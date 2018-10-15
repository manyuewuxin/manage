import Chart from 'chart.js';

		var config = {
			type: 'line',
			data: {
				labels: ['2018-9-20', '2018-9-21', '2018-9-22', '2018-9-23', '2018-9-24', '2018-9-25', '2018-9-26'],
				datasets: [{
					label: '注册用户',
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor:'rgb(255, 99, 132)',
					data: [
						15,
						13,
						14,
						16,
						12,
						11,
						17
					],
					fill: false,
				}, {
					label: '发表文章',
					fill: false,
					backgroundColor:'rgb(54, 162, 235)',
					borderColor: 'rgb(54, 162, 235)',
					data: [
						24,
						15,
						12,
						18,
						16,
						23,
						19
					],
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
						}
					}]
				}
			}
		};

const ctx = document.getElementById("charts");
var myChart = new Chart(ctx, config);



