import React, { Component } from "react";
import axios from "axios";
import { message, Checkbox, Button, Modal, Pagination } from "antd";
import PropTypes from "prop-types";

import Breadcrumbs from "../Breadcrumbs";

export default class Show extends Component {
    static propTypes = {
        history: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.state = {
            label: [],
            checkbox: [],
            visible: false,
            title: null,
            text: null,
            count: 0, //总页
            page: 1, //当前页
            loading: true
        };
        this.setter = this.setter.bind(this);
        this.remove = this.remove.bind(this);
        this.switch = this.switch.bind(this);
        this.removeSwitch = this.removeSwitch.bind(this);
        this.ok_modal = this.ok_modal.bind(this);
        this.no_modal = this.no_modal.bind(this);
        this.setPage = this.setPage.bind(this);
        this.label_id = [];
    }
    setter(e) {
        //重新编辑标签
        e.stopPropagation();
        const index = Number(e.target.dataset.index);
        this.props.history.push(`/label/create#${this.state.label[index].type}`);
    }

    remove(e) {
        //删除单个标签
        e.stopPropagation();
        const { checkbox } = this.state;
        checkbox.push(Number(e.target.dataset.index));
        this.setState({
            checkbox: checkbox,
            visible: true,
            title: "删除标签",
            text: "你确定要删除该标签吗？"
        });
    }

    removeSwitch(e) {
        //删除多选项标签
        e.stopPropagation();
        this.setState({
            visible: true,
            title: "删除多个标签",
            text: "你确定要删除所选标签吗？"
        });
    }

    switch(e) {
        //选择标签
        e.stopPropagation();
        const { checkbox } = this.state;
        const value = Number(e.target.value);
        const indexOf = checkbox.indexOf(value);
        indexOf !== -1
            ? checkbox.splice(indexOf, 1)
            : checkbox.push(Number(e.target.value));
        this.setState({ checkbox: checkbox });
    }

    getLabel(page) {
        if (typeof page == "number") {
            axios
                .get(`/admin/label?type=all&page=${page}`)
                .then(({ data }) => {
                    this.setState({
                        label: data.label,
                        count: data.count,
                        page: page,
                        loading: false
                    });
                })
                .catch(({ response }) => {
                    message.error(response.data.err);
                });
        } else {
            message.error("传递的page参数不是数字");
        }
    }

    setPage(page) {
        this.getLabel(page);
    }

    ok_modal() {
        //确认删除
        if (this.state.checkbox.length > 0) {
            const { label, page, checkbox } = this.state;

            const label_id = checkbox.map((index) => {
                return label[index]._id;
            });
            const promise_remove = checkbox.map((index) => {
                return axios.post("/file/remove", {
                    url: label[index].image,
                    folder: "logo"
                });
            });

            Promise.all(promise_remove)
                .then(() => {
                    return axios.post("/admin/label/remove", {
                        label_id: label_id,
                        page: page
                    });
                })
                .then(({ data }) => {
                    message.success("删除标签成功");
                    this.setState({
                        label: data.label,
                        count: data.count,
                        checkbox: [],
                        visible: false,
                        title: null,
                        text: null
                    });
                })
                .catch(({ response }) => {
                    message.error(response.data.err);
                });
        } else {
            message.error("操作异常");
        }
    }

    no_modal() {
        //取消
        this.setState({ checkbox: [], visible: false, title: null, text: null });
    }

    render() {
        if (this.state.loading) return null;
        const { label, count, page, checkbox, visible, title, text } = this.state;
        const list = label.map((labels, index) => {
            return (
                <li
                    key={Math.random()
                        .toString(36)
                        .substring(2, 6)}>
                    <div className="label_describes">
                        <div className="label_changebox">
                            <Checkbox
                                onChange={this.switch}
                                checked={checkbox.includes(index)}
                                value={index}
                            />
                        </div>
                        <img src={labels.image} />
                        <p>{labels.type}</p>
                        <div>
                            <span>{`${labels.followtype_count} 关注`}</span>
                            <span>{`${labels.article_count} 文章`}</span>
                        </div>
                        <button
                            className="success_button"
                            data-index={index}
                            onClick={this.setter}>
                            编辑
                        </button>
                        <button
                            className="warning_button"
                            data-index={index}
                            onClick={this.remove}>
                            删除
                        </button>
                    </div>
                </li>
            );
        });
        return (
            <div className="content">
                <Breadcrumbs to={[{ "/": "首页" }, { "/label/create": "创建标签" }]} />
                <div className="label">
                    <div className="label_removeswitch">
                        <Button
                            type="danger"
                            disabled={checkbox.length === 0}
                            onClick={this.removeSwitch}>
                            删除选中标签
                        </Button>
                    </div>
                    <ul className="label_list">{list}</ul>
                    <div className="label_page">
                        <Pagination
                            current={page}
                            total={count * 10}
                            onChange={this.setPage}
                        />
                    </div>
                </div>
                <Modal
                    title={title}
                    visible={visible}
                    onOk={this.ok_modal}
                    onCancel={this.no_modal}
                    cancelText="取消"
                    okText="确定">
                    <p>{text}</p>
                </Modal>
            </div>
        );
    }
    componentDidMount() {
        this.getLabel(1);
    }
}
