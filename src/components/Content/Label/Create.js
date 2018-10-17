import React, { Component } from "react";
import axios from "axios";
import { message } from "antd";
import PropTypes from "prop-types";

import Breadcrumbs from "../Breadcrumbs";

export default class Create extends Component {
    static propTypes = {
        location: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.state = {
            image: "/logo/dafault.png",
            type: "",
            describe: "",
            loading: true
        };
        this.refx = React.createRef();
        this.change = this.change.bind(this);
        this.openFile = this.openFile.bind(this);
        this.changeFile = this.changeFile.bind(this);
        this.create = this.create.bind(this);
        this.is_update = false;
        this.label_id = null;
    }
    change(e) {
        e.stopPropagation();
        const name = e.target.name;
        this.setState({ [name]: e.target.value });
    }
    openFile(e) {
        e.stopPropagation();
        this.refx.current.click();
    }

    changeFile(e) {
        e.stopPropagation();
        e.persist();
        if (e.target.files.length > 0) {
            this.uploadImg(e.target.files[0])
                .then((url) => {
                    this.setState({ image: url });
                })
                .catch(({ response }) => {
                    e.target.value = "";
                    message.error(response.data.err);
                });
        }
    }

    uploadFile(key, file) {
        if (/^image\//.test(file.type) || file.size < 2000000) {
            const formdata = new FormData();
            formdata.append(key, file);
            return axios.post("/file/upload", formdata, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        } else {
            const err =
                file.size > 2000000 ? "请上传低于2M的图片" : "上传文件不是图片格式";
            message.error(err);
            return Promise.reject();
        }
    }
    async uploadImg(file) {
        const { image } = this.state;
        const { data } = await this.uploadFile("logo", file);
        await axios.post("/file/remove", { url: image, folder: "logo" });
        return data.url;
    }
    create(e) {
        e.stopPropagation();
        Promise.resolve(this.state)
            .then(({ ...data }) => {
                const type = data.type.replace(/\s+/g, "");
                const describe = data.describe.replace(/\s+/g, "");
                const image = data.image;
                if (/^.{1,30}$/.test(type) && /^.{1,30}$/.test(describe)) {
                    const update = { label_id: this.label_id, image, type, describe };
                    const create = { image, type, describe };
                    return this.is_update
                        ? axios.post("/admin/label/update", update)
                        : axios.post("/admin/label/create", create);
                } else {
                    return Promise.reject({ err: "标签名或描述不能为空" });
                }
            })
            .then(() => {
                message.success("创建标签成功");
                this.setState({
                    image: "/logo/dafault.png",
                    type: "",
                    describe: ""
                });
            })
            .catch(({ response }) => {
                message.error(response.data.err);
            });
    }

    render() {
        if (this.state.loading) return null;
        const { image, type, describe } = this.state;
        const path =
            this.props.location.hash !== ""
                ? `/label/create${this.props.location.hash}`
                : "/label/create";
        return (
            <div className="content">
                <Breadcrumbs to={[{ "/": "首页" }, { [path]: "创建标签" }]} />
                <form className="label_form">
                    <ul>
                        <li className="label_image">
                            <div>标签背景图</div>
                            <div>
                                <img src={image} />
                            </div>
                            <div>
                                <p>支持jpg、jpeg、png格式</p>
                                <button onClick={this.openFile} type="button">
                                    上传图片
                                </button>
                                <input
                                    type="file"
                                    name="file"
                                    style={{ display: "none" }}
                                    onChange={this.changeFile}
                                    ref={this.refx}
                                />
                            </div>
                        </li>
                        <li>
                            <div>标签名</div>
                            <div>
                                <input
                                    type="text"
                                    name="type"
                                    placeholder="输入标签名"
                                    autoComplete="off"
                                    maxLength="8"
                                    onChange={this.change}
                                    value={type}
                                />
                            </div>
                        </li>
                        <li>
                            <div>描述</div>
                            <div>
                                <input
                                    type="text"
                                    name="describe"
                                    placeholder="输入标签描述"
                                    autoComplete="off"
                                    maxLength="8"
                                    onChange={this.change}
                                    value={describe}
                                />
                            </div>
                        </li>
                    </ul>
                    <div className="label_submit">
                        <button type="button" onClick={this.create}>
                            确认创建
                        </button>
                    </div>
                </form>
            </div>
        );
    }
    componentDidMount() {
        if (this.props.location.hash !== "") {
            const type = this.props.location.hash.split("#")[1];
            axios
                .get(`/admin/label?type=${type}&page=1`)
                .then(({ data }) => {
                    const label = data.label[0];
                    this.is_update = true;
                    this.label_id = label._id;
                    this.setState({ ...label, loading: false });
                })
                .catch(({ response }) => {
                    message.error(response.data.err);
                });
        } else {
            this.setState({ loading: false });
        }
    }
}
