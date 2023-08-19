const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

document.addEventListener("DOMContentLoaded", () => {
	const curr_time = new Date();

	let time = document.getElementById("time");
	time.innerHTML = curr_time.getHours() + ":" + curr_time.getMinutes();

	let date = document.getElementById("date");
	date.innerHTML = `${days[curr_time.getDay()]}, ${months[curr_time.getMonth()]} ${curr_time.getDate()}, ${curr_time.getFullYear()}` ;
});
