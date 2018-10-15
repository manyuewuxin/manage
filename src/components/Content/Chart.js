import React, { Component } from "react";
import axios from "axios";
import Chart from 'chart.js';
import Breadcrumbs from "./Breadcrumbs";

export default class Char extends Component{
    constructor(props) {
    	super(props);
    	this.state = {
    		loading: true,
    		chart:[]
    	};
    }
    format() {
        const date = new Date(); //本月的日期

        const ldate = new Date(); //上个月的日期，返回上个月最大日期是几号
        ldate.setMonth(ldate.getMonth())
        ldate.setDate(0);
        const ldt = ldate.getDate();

        const arr = [6,5,4,3,2,1,0].map((i)=>{
            if(date.getDate()-i>0){
                return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()-i}`
            }
            else {
                const num = date.getDate()-i;
                return `${date.getFullYear()}-${date.getMonth()}-${ldt + num}`;
            }
        });

        return arr;
    }
    render(){
    	if(this.state.loading) return null;
    	const { chart } = this.state;
    	return(
    		<div className="content">
    			<Breadcrumbs to={[{ "/": "首页" }]} />
				<div className="chart">
					<div className="chart_title">数据统计</div>
					<ul className="current_count">
						<li><span>当日数据：</span></li>
						<li><span className="h1_text">{chart.user.current_count}</span><span>新增用户</span></li>
						<li><span className="h1_text">{chart.posts.current_count}</span><span>创建文章</span></li>
					</ul>
					<ul className="all_count">
						<li><span>总数据：</span></li>
						<li><span className="h1_text">{chart.user.all_count}</span><span>注册用户</span></li>
						<li><span className="h1_text">{chart.posts.all_count}</span><span>文章</span></li>
					</ul>
				</div>
				<div className="chart_canvas">
					<canvas id="charts"></canvas>
				</div>  
			</div>  		
    	);
    }
    componentDidMount(){
    	axios.get("/admin/chart").then(({ data })=>{
    		this.setState({ chart:data.chart, loading: false });
    	}).catch((err)=>{
    		console.log(err);
    	});
    }
    componentDidUpdate(){
    	if(this.state.loading === false){
    		const labels = this.format();
    		const { chart } = this.state;
    		const ctx = document.querySelector("#charts");
    		const max = Math.max(...chart.user.date_arr.concat(chart.posts.date_arr));
    		const myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					label: '注册用户',
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor:'rgb(255, 99, 132)',
					data: chart.user.date_arr, // 计算每个日期注册用户
					fill: false,
				}, {
					label: '发表文章',
					fill: false,
					backgroundColor:'rgb(54, 162, 235)',
					borderColor: 'rgb(54, 162, 235)',
					data: chart.posts.date_arr,
				}]
			},
			options: {
				responsive: true,
				title: {
					display: false,
					text: '数据统计图表'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: '日期'
						}
					}],
							yAxes: [{
								display: true,
								scaleLabel: {
									display: true,
									labelString: '走势'
								},
								ticks: {
									suggestedMin: 0,
									suggestedMax: max + 20
								}
							}]
						}
					}
				}
			);	
    	}
    }
}


