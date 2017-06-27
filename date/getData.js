const moment = require('moment');

function getData(channel, type) {
	let stats = channel.stats;
	let statsLength = channel.stats.length;

	if (type === 'day') {
		for (statsLength; statsLength < 30; statsLength++) {
			stats.unshift({
				date: moment(stats[0].date).subtract(1, 'day').format(),
				count: stats[0].count
			});
		}
		stats = stats.map(item => {
			return {
				date: moment(item.date).format('M/DD'),
				count: item.count
			}
		});
	} else if (type === 'month') {
		let months = [];
		for (let i = 0; i < 12; i++) {
			months.push({
				id: (i + 1).toString(),
				value: []
			})
		}
		stats.forEach(item => {
			months.forEach(month => {
				if (month.id === moment(item.date).format('M')) {
					month.value.push(item.count);
				}
			})
		});
		months = months
			.filter(month => month.value.length > 0)
			.map(item => {
				return {
					id: item.id + '-thisYear',
					count: Math.round(item.value.reduce((a, b) => a + b, 0) / item.value.length)
				}
			});
		const monthsLength = months.length;
		const firstMonth = months[0].id.split('-')[0];
		for (let i = 1; i < 13 - monthsLength; i++) {
			const id = (firstMonth - i) > 0 ?
				`${(firstMonth - i).toString()}-thisYear` :
				(Number(firstMonth - i) + 12).toString() + '-lastYear';

			months.unshift({
				id,
				count: stats[0].count
			})
		}
		stats = months.map(item => {
			const [month, year] = item.id.split('-');
			console.log(item);
			return {
				date: year === 'thisYear' ?
					moment().set('month', month - 1).format('MMM') :
					moment(moment().set('month', month - 1)).subtract(1, 'year').format('MMM'),
				count: item.count
			}
		});
	}
	return stats;
}

module.exports = {
	getDataDaily(channel) {
		return getData(channel, 'day');
	},
	getDataMonthly(channel) {
		return getData(channel, 'month');
	}
}