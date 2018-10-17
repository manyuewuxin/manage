import React, { Component } from "react";
import axios from "axios";
import { Icon, Tooltip, message } from "antd";
import Breadcrumbs from "../Breadcrumbs";
import Line from "./Line";
import Bar from "./Bar";
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            type: "line",
            chart: []
        };
        this.refx = React.createRef();
        this.line = this.line.bind(this);
        this.bar = this.bar.bind(this);
    }
    line(e) {
        e.stopPropagation();
        if (this.state.type !== "line") this.setState({ type: "line" });
    }
    bar(e) {
        e.stopPropagation();
        if (this.state.type !== "bar") this.setState({ type: "bar" });
    }
    format() {
        const date = new Date(); //本月的日期

        const ldate = new Date(); //上个月的日期，返回上个月最大日期是几号
        ldate.setMonth(ldate.getMonth());
        ldate.setDate(0);
        const ldt = ldate.getDate();

        const arr = [6, 5, 4, 3, 2, 1, 0].map((i) => {
            if (date.getDate() - i > 0) {
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() -
                    i}`;
            } else {
                const num = date.getDate() - i;
                return `${date.getFullYear()}-${date.getMonth()}-${ldt + num}`;
            }
        });

        return arr;
    }
    render() {
        if (this.state.loading) return null;
        const { chart, type } = this.state;
        const labels = this.format();
        return (
            <div className="content">
                <Breadcrumbs to={[{ "/": "首页" }]} />
                <div className="chart">
                    <div className="chart_title">数据统计</div>
                    <ul className="current_count">
                        <li>
                            <span>当日数据：</span>
                        </li>
                        <li>
                            <span className="h1_text">{chart.user.current_count}</span>
                            <span>新增用户</span>
                        </li>
                        <li>
                            <span className="h1_text">{chart.posts.current_count}</span>
                            <span>创建文章</span>
                        </li>
                    </ul>
                    <ul className="all_count">
                        <li>
                            <span>总数据：</span>
                        </li>
                        <li>
                            <span className="h1_text">{chart.user.all_count}</span>
                            <span>注册用户</span>
                        </li>
                        <li>
                            <span className="h1_text">{chart.posts.all_count}</span>
                            <span>文章</span>
                        </li>
                    </ul>
                </div>
                <div className="chart_type">
                    <Tooltip title="折线图">
                        <span onClick={this.line}>
                            <Icon
                                type="line-chart"
                                style={{
                                    fontSize: "23px",
                                    marginRight: "15px",
                                    color: type === "line" ? "#08c" : ""
                                }}
                            />
                        </span>
                    </Tooltip>
                    <Tooltip title="柱状图">
                        <span onClick={this.bar}>
                            <Icon
                                type="bar-chart"
                                style={{
                                    fontSize: "23px",
                                    color: type === "bar" ? "#08c" : ""
                                }}
                            />
                        </span>
                    </Tooltip>
                </div>
                {type === "line" ? (
                    <Line chart={chart} labels={labels} />
                ) : (
                    <Bar chart={chart} labels={labels} />
                )}
            </div>
        );
    }
    componentDidMount() {
        axios
            .get("/admin/chart")
            .then(({ data }) => {
                this.setState({ chart: data.chart, loading: false });
            })
            .catch(({ response }) => {
                message.error(response.data.err);
            });
    }
}
