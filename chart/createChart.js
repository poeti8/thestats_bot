const ChartjsNode = require('chartjs-node');

const createChart = function(channel, stats) {
    const chartOptions = {
        type: 'line',
        data: {
            labels: stats.map(item => item.date),
            datasets: [{
                label: '# of members for ' + channel,
                data: stats.map(item => item.count),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false,
                lineTension: 0
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            layout: {
                padding: {
                    left: 40,
                    top: 20,
                    right: 40,
                    bottom: 20
                }
            }
        }
    }

    const chartNode = new ChartjsNode(800, 600);

    return new Promise((resolve, reject) => {
        chartNode.drawChart(chartOptions)
            .then(() => chartNode.getImageBuffer('image/png'))
            .then(buffer => {
                resolve(buffer);
            })
    })
}

module.exports = createChart;


