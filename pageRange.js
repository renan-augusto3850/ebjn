
var totalPages = 292;
var wordsPerPage = 300;
var ppm = 150;

var minutes = totalPages * wordsPerPage / ppm;

const hours = Math.floor(minutes / 60);
const restMinutes = minutes % 60;

console.log(hours, restMinutes);