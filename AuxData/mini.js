var apiTime,
  _offSet = 0,
  _location = "london",
  userOffset = 0,
  crownOut = !1;
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
    .then((e) => e.json())
    .then((e) => {
      apiTime = e.unixtime;
    });
}
const hourHand = document.getElementById("houru"),
  minHand = document.getElementById("minu"),
  secHand = document.getElementById("secondu"),
  dayText = document.getElementById("dayu"),
  dateText = document.getElementById("dateu"),
  weatherIcon = document.getElementById("w-icon"),
  weatherCity = document.getElementById("w-city"),
  weatherTemp = document.getElementById("w-temp");
async function getWeather() {
  fetch(
    "https://watchenzonbase.vercel.app/api/currentweather?city=" + _location
  )
    .then((e) => e.json())
    .then((e) => {
      if (!e.ok) {
        console.log(e.msg);
        return;
      }
      weatherIcon.setAttribute(
        "href",
        "https:" + e.data.current.condition.icon
      ),
        (weatherCity.innerHTML = e.data.location.name),
        (weatherTemp.innerHTML =
          e.data.current.temp_c + "\xb0C/" + e.data.current.temp_f + "\xb0F");
    })
    .catch(console.error);
}
function baseDateObj() {
  userOffset = Math.floor(new Date().getTime()) - 1e3 * apiTime;
  var e = new Date(0);
  return e.setUTCSeconds(apiTime + _offSet), e;
}
function generateCurrentTime(e) {
  return new Date(e.getTime() + 6e4 * e.getTimezoneOffset() + userOffset);
}
function generateCurrentAngles(e) {
  var t = 6 * e.getSeconds() + (6 * e.getMilliseconds()) / 1e3,
    n = 6 * e.getMinutes() + 0.1 * e.getSeconds(),
    r = 30 * e.getHours() + 0.5 * e.getMinutes();
  minHand.setAttribute("transform", `rotate(${n},200,200)`),
    hourHand.setAttribute("transform", `rotate(${r},200,200)`),
    secHand.setAttribute("transform", `rotate(${t},200,200)`);
}
function generateDay(e) {
  dayText.innerHTML = weekdays[e.getDay()];
}
function generateDate(e) {
  dateText.innerHTML = e.getDate();
}
const crown = document.getElementById("crown");
function actual() {
  if (crownOut) return;
  let e = baseDateObj(),
    t = generateCurrentTime(e);
  generateCurrentAngles(t),
    document.getElementById("day") && generateDay(t),
    document.getElementById("date") && generateDate(t);
}
async function run() {
  getUTC().catch(console.error),
    getWeather().catch(console.error),
    setInterval(actual, 200);
  setInterval(getWeather, 15000);
}
crown.addEventListener("click", async () => {
  if (
    ((crownOut = !crownOut),
    (cX = crown.getAttribute("x")),
    console.log(cX),
    !crownOut)
  ) {
    await getUTC(), crown.setAttribute("transform", "translate(0 0)");
    return;
  }
  crown.setAttribute("transform", "translate(10 0)");
}),
  run();
