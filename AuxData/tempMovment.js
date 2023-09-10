var _offSet = 0;
var _location = "london";
var apiTime;
var userOffset = 0;
var crownOut = false;

const weekdays = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

async function getUTC() {
  await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC")
    .then((response) => response.json())
    .then((data) => {
      apiTime = data.unixtime;
    });
}

const hourHand = document.getElementById("houru");
const minHand = document.getElementById("minu");
const secHand = document.getElementById("secondu");
const dayText = document.getElementById("dayu");
const dateText = document.getElementById("dateu");

const weatherIcon = document.getElementById("w-icon");
const weatherCity = document.getElementById("w-city");
const weatherTemp = document.getElementById("w-temp");

async function getWeather() {
  const url =
    "https://watchenzonbase.vercel.app/api/currentweather?city=" + _location;
  fetch(url)
    .then((resp) => resp.json())
    .then((w) => {
      if (!w.ok) {
        console.log(w.msg);
        return;
      }
      weatherIcon.setAttribute(
        "href",
        "https:" + w.data.current.condition.icon
      );
      weatherCity.innerHTML = w.data.location.name;
      weatherTemp.innerHTML =
        w.data.current.temp_c + "°C/" + w.data.current.temp_f + "°F";
    })
    .catch(console.error);
}

function baseDateObj() {
  var userNow = new Date();
  userOffset = Math.floor(userNow.getTime()) - apiTime * 1000;
  var dt = new Date(0);
  dt.setUTCSeconds(apiTime + _offSet);
  return dt;
}

function generateCurrentTime(dt) {
  var d = new Date(dt.getTime() + dt.getTimezoneOffset() * 60000 + userOffset);
  return d;
}

function generateCurrentAngles(d) {
  var angleSecond = d.getSeconds() * 6 + (d.getMilliseconds() * 6) / 1000;
  var angleMin = d.getMinutes() * 6 + d.getSeconds() * 0.1;
  var angleHour = d.getHours() * 30 + d.getMinutes() * 0.5;
  minHand.setAttribute("transform", `rotate(${angleMin},200,200)`);
  hourHand.setAttribute("transform", `rotate(${angleHour},200,200)`);
  secHand.setAttribute("transform", `rotate(${angleSecond},200,200)`);
}

function generateDay(d) {
  dayText.innerHTML = weekdays[d.getDay()];
}

function generateDate(d) {
  dateText.innerHTML = d.getDate();
}

// crown
const crown = document.getElementById("crown");
crown.addEventListener("click", async () => {
  crownOut = !crownOut;
  cX = crown.getAttribute("x");
  console.log(cX);
  if (!crownOut) {
    await getUTC();
    crown.setAttribute("transform", "translate(0 0)");
    return;
  }
  crown.setAttribute("transform", "translate(10 0)");
});
function actual() {
  if (crownOut) {
    return;
  }
  const dt = baseDateObj();
  const d = generateCurrentTime(dt);
  generateCurrentAngles(d);
  if (document.getElementById("day")) {
    generateDay(d);
  }
  if (document.getElementById("date")) {
    generateDate(d);
  }
}

async function run() {
  getUTC().catch(console.error);
  getWeather().catch(console.error);
  setInterval(actual, 200);
}

run();
