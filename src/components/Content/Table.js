import React, { Component } from "react";
import { Table, message, Tag, Modal, Pagination } from "antd";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";

export default class Tabels extends Component {
    static propTypes = {
        location: PropTypes.object,
        match: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.state = {
            table: [],
            count: 0, //总页数
            page: 1, //当前页
            title: null,
            visible: false,
            text: null,
            loading: true,
            update: false,
            remove: null,
            disabled: false,
            filter: ["c"]
        };
        this.remove = this.remove.bind(this);
        this.reject = this.reject.bind(this);
        this.resolve = this.resolve.bind(this);
        this.setPage = this.setPage.bind(this);
        this.ok_modal = this.ok_modal.bind(this);
        this.no_modal = this.no_modal.bind(this);
        this.filter = this.filter.bind(this);
        this.index = null;
        this.status = {
            a: 0,
            b: 1,
            c: 2
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.setState({ update: true });
        }
    }

    getTable(path, page, state = 2) {
        axios
            .get(`/admin/table/${path}?page=${page}&state=${state}`)
            .then(({ data }) => {
                this.setState({
                    table: data.table,
                    count: data.count,
                    page: page,
                    loading: false,
                    update: false
                });
            })
            .catch(({ response }) => {
                message.error(response.data.err);
            });
    }

    reject(e) {
        //拒绝
        e.stopPropagation();
        const index = Number(e.target.dataset.index);
        const { table, page, filter } = this.state;

        axios.post("/admin/posts/reject", {
            posts_id: table[index]._id, 
            state: table[index].state 
        }).then(() => {
            if(table.length-1 > 0){
                table.splice(index,1);
                this.setState({ table });
            }
            else{
                const pages = page-1 > 0 ? page-1 : 1;
                const state = this.status[filter[0]];
                this.getTable("posts", pages, state);
            }
        }).catch(({ response }) => {
            message.error(response.data.err);
        });
    }

    resolve(e) {
        //通过
        e.stopPropagation();
        const index = Number(e.target.dataset.index);

        const { table, page, filter } = this.state;

        axios.post("/admin/posts/agree", {
                posts_id: table[index]._id,
                state: table[index].state
            }).then(() => {
                if(table.length-1 > 0){
                    table.splice(index,1);
                    this.setState({ table });
                }
                else{
                    const pages = page-1 > 0 ? page-1 : 1;
                    const state = this.status[filter[0]];
                    this.getTable("posts", pages, state);
                }
            }).catch(({ response }) => {
                message.error(response.data.err);
            });
    }

    remove(e) {
        e.stopPropagation();
        this.index = Number(e.target.dataset.index);
        this.setState({
            title: "删除文章",
            text: "确定以管理员身份删除该文章？",
            visible: true
        });
    }

    ok_modal() {
        //删除
        if (typeof this.index === "number" && Number.isNaN(this.index) === false) {
            const index = this.index;
            const { table, page, filter } = this.state;

            axios.post("/admin/posts/remove", {
                    posts_id: table[index]._id,
                    state: table[index].state
                }).then(() => {
                    if(table.length-1 > 0){
                        table.splice(index,1);
                        this.setState({ table: table, visible: false, title: null, text: null });
                    }

                    else{
                        const pages = page-1 > 0 ? page-1 : 1;
                        const state = this.status[filter[0]];
                        this.setState({ visible: false, title: null, text: null });
                        this.getTable("posts", pages, state);
                    }
                }).catch(({ response }) => {
                    message.error(response.data.err);
                });
        } 
        else {
            message.error("操作异常");
        }
    }

    no_modal() {
        this.index = null;
        this.setState({ title: null, text: null, visible: false });
    }

    setPage(page) {
        if (this.state.page !== page) {
            const obj = { a: 0, b: 1, c: 2 };
            const { filter } = this.state;
            const state = obj[filter[0]];
            this.getTable(this.props.match.params.type, page, state);
        }
    }

    filter(pagination, filter, sort) {
        if (this.state.filter[0] !== filter.state[0]) {
            const state = this.status[filter.state[0]];
            axios.get(`/admin/table/posts?page=1&state=${state}`).then(({ data }) => {
                this.setState({
                    table: data.table,
                    count: data.count,
                    page: 1,
                    filter: filter.state,
                    loading: false,
                    update: false
                });
            }).catch(({ response }) => {
                message.error(response.data.err);
            });
        }
    }

    render() {
        if (this.state.loading) return null;
        const obj = {
            user: { "/table/user": "用户列表" },
            posts: { "/table/posts": "文章列表" }
        };
        const { table, count, update, page, title, visible, text, filter } = this.state;
        const user_columns = [
            {
                title: "#",
                dataIndex: "index",
                width: "10%",
                key: "index"
            },
            {
                title: "注册日期",
                dataIndex: "date",
                width: "20%",
                key: "date"
            },
            {
                title: "用户呢称",
                dataIndex: "name",
                width: "20%",
                key: "name"
            },
            {
                title: "注册地址",
                dataIndex: "region",
                width: "50%",
                key: "region"
            }
        ];

        const posts_columns = [
            {
                title: "#",
                dataIndex: "index",
                key: "index"
            },
            {
                title: "发表日期",
                dataIndex: "date",
                key: "date"
            },
            {
                title: "文章标题",
                dataIndex: "title",
                key: "title",
                render: function(title, record) {
                    return (
                        <Link to={`/p/${record._id}?state=${record.state}`}>{title}</Link>
                    );
                }
            },
            {
                title: "作者",
                dataIndex: "author",
                key: "author",
                render: function(author) {
                    return <span>{author[0].name}</span>;
                }
            },
            {
                title: "选择状态",
                dataIndex: "state",
                key: "state",
                filteredValue: filter,
                filterMultiple: false,
                filters: [
                    { text: "待审核", value: "a" },
                    { text: "已拒绝", value: "b" },
                    { text: "已通过", value: "c" }
                ],
                onFilter: (value, record) => {
                    return record.state === this.status[value];
                },
                render: (state) => {
                    switch (state) {
                        case 0:
                            return (
                                <Tag color="blue" key={"abcd"}>
                                    待审核
                                </Tag>
                            );

                        case 1:
                            return (
                                <Tag color="red" key={"dses"}>
                                    已拒绝
                                </Tag>
                            );

                        case 2:
                            return (
                                <Tag color="green" key={"esdw"}>
                                    已通过
                                </Tag>
                            );
                    }
                }
            },
            {
                title: "操作",
                key: "action",
                render: (text, data, index) => {
                    return (
                        <div>
                            <Tag color="volcano" key="dser">
                                <span onClick={this.remove} data-index={index}>
                                    删除
                                </span>
                            </Tag>
                            <Tag
                                color="#ea6f5a"
                                visible={data.state === 0 || data.state == 2}
                                key="wfrw">
                                <span onClick={this.reject} data-index={index}>
                                    拒绝
                                </span>
                            </Tag>
                            <Tag color="#2db7f5" visible={data.state !== 2} key="wsde">
                                <span onClick={this.resolve} data-index={index}>
                                    通过
                                </span>
                            </Tag>
                        </div>
                    );
                }
            }
        ];
        const columns =
            this.props.match.params.type === "user" ? user_columns : posts_columns;
        return (
            <div className="content">
                <Breadcrumbs to={[{ "/": "首页" }, obj[this.props.match.params.type]]} />
                {update ? null : (
                    <Table
                        columns={columns}
                        dataSource={table}
                        className="table"
                        onChange={this.filter}
                        pagination={false}
                    />
                )}
                <div className="table_page">
                    <Pagination
                        current={page}
                        total={count * 10}
                        onChange={this.setPage}
                    />
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
        if (this.state.loading) this.getTable(this.props.match.params.type, 1, 2);
    }
    componentDidUpdate() {
        if (this.state.update) this.getTable(this.props.match.params.type, 1, 2);
    }
}
//不要使用表格组件默认嵌入分页，在filter事件触发时change也跟着触发
