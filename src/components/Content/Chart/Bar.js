import React, { Component } from "react";
import Chart from "chart.js";
import PropTypes from "prop-types";

export default class Bar extends Component {
    static propTypes = {
        chart: PropTypes.object,
        labels: PropTypes.array
    };
    constructor(props) {
        super(props);
        this.refx = React.createRef();
    }
    render() {
        return (
            <div className="chart_canvas">
                <canvas ref={this.refx} />
            </div>
        );
    }
    componentDidMount() {
        const { chart, labels } = this.props;
        const max = Math.max(...chart.user.date_arr.concat(chart.posts.date_arr));
        const myChart = new Chart(this.refx.current, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "注册用户",
                        backgroundColor: "rgba(255, 99, 132, 0.8)",
                        borderColor: "rgb(255, 99, 132)",
                        borderWidth: 1,
                        data: chart.user.date_arr // 计算每个日期注册用户
                    },
                    {
                        label: "发表文章",
                        backgroundColor: "rgba(54, 162, 235, 0.8)",
                        borderColor: "rgb(54, 162, 235)",
                        data: chart.posts.date_arr
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: false,
                    text: "数据统计图表"
                },
                tooltips: {
                    mode: "index",
                    intersect: false
                },
                hover: {
                    mode: "nearest",
                    intersect: true
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: "日期"
                            }
                        }
                    ],
                    yAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: "走势"
                            },
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: max + 30
                            }
                        }
                    ]
                }
            }
        });
    }
}
