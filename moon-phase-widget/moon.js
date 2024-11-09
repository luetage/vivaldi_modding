// Moon Phase Widget
// version 2024.11.0
// Guide and updates ☛ https://forum.vivaldi.net/post/783627
// ————————  ⁂  ————————

"use strict";

// EDIT START
// Latitude and longitude are being determined by an API. For more accuracy
// on a stationary install, or when using a VPN service, input your decimal
// coordinates below. E.g. [latitude, longitude] for Reykjavík: [64.13584, -21.89541]

const coordinates = [48.30521, 16.32522];

// EDIT END

const moon = {
  phases: [
    ["New Moon", -5, 0],
    ["Waxing Crescent", -5, 3],
    ["First Quarter", -5, 5],
    ["Waxing Gibbous", -5, 7],
    ["Full Moon", -5, 10],
    ["Waning Gibbous", -2, 7],
    ["Last Quarter", 0, 5],
    ["Waning Crescent", 2, 3],
  ],
  illum: (p) => {
    for (let i = 0; i < moon.phases.length; i++) {
      if (moon.phases[i][0] === p) {
        return {
          coordinate: moon.phases[i][1],
          range: moon.phases[i][2],
        }
      }
    }
  },
};

function parse(data) {
  const prop = data.properties.data;
  const diff =
    Math.max(em.timestamp, data.timestamp) -
    Math.min(em.timestamp, data.timestamp);
  const phase = diff < 86400 ? prop.closestphase.phase : prop.curphase;
  const svg = moon.illum(phase);
  console.info(svg);
  const illum = prop.fracillum;
  const lat = data.geometry.coordinates[1];
  const lon = data.geometry.coordinates[0];
  const coords = `${lat},${lon}`;
  console.info(data.events);
  console.info(phase);
}

async function load_data(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        resolve({
          success: true,
          data: data,
          message: "data loaded",
        });
      })
      .catch((error) => {
        reject({
          success: false,
          error: error.message,
          message: "cannot load data :/",
        });
      });
  });
}

function edit(arr, obj) {
  arr.forEach((entry) => {
    switch (entry.phen) {
      case "Begin Civil Twilight":
        entry.phen = "civil dawn";
        break;
      case "Rise":
        entry.phen = `${obj}rise`;
        break;
      case "Upper Transit":
        entry.phen = `${obj} transit`;
        break;
      case "Set":
        entry.phen = `${obj}set`;
        break;
      default:
        entry.phen = "civil dusk";
    }
    Object.assign(entry, { obj: obj });
  });
  return arr;
}

function storage(data) {
  const prop = data.properties.data;
  const month = String(prop.closestphase.month).padStart(2, "0");
  const day = String(prop.closestphase.day).padStart(2, "0");
  const date_string = `${prop.closestphase.year}-${month}-${day}`;
  const time_string = `${date_string}T${prop.closestphase.time}`;
  data.timestamp = Math.floor(new Date(time_string).getTime() / 1000);
  const moon_events = edit(prop.moondata, "moon");
  const sun_events = edit(prop.sundata, "sun");
  const events = moon_events.concat(sun_events);
  if (date_string === em.date) {
    const main = {
      phen: prop.closestphase.phase.toLowerCase(),
      time: prop.closestphase.time,
      obj: "moon",
    };
    events.push(main);
  }
  data.events = events;
  data.date = em.date;
  return data;
}

async function astro(lat, lon) {
  await load_data(
    `https://aa.usno.navy.mil/api/rstt/oneday?date=${em.date}&coords=${lat},${lon}&tz=${em.tz}`
  ).then(
    (resolve) => {
      console.info(resolve);
      const sto = storage(resolve.data);
      localStorage.setItem("moon-phase", JSON.stringify(sto));
      parse(sto);
    },
    (reject) => {
      em.data_error.innerHTML = reject.message;
      em.data_error.classList.remove("hidden");
    }
  );
}

async function loc() {
  if (Array.isArray(coordinates) && coordinates.length === 2) {
    astro(coordinates[0], coordinates[1]);
  } else {
    await load_data(
      "http://ip-api.com/json?fields=status,message,lat,lon"
    ).then(
      (resolve) => {
        if (!resolve.data.message) astro(resolve.data.lat, resolve.data.lon);
      },
      (reject) => {
        em.data_error.innerHTML = reject.message;
        em.data_error.classList.remove("hidden");
      }
    );
  }
}

function check_storage() {
  const saved = JSON.parse(localStorage.getItem("moon-phase"));
  if (saved !== null && saved.date === em.date) {
    console.info(saved);
    parse(saved);
  } else loc();
}

function init() {
  const now = new Date();
  const elements = {
    container: document.getElementById("container"),
    data_error: document.getElementById("error"),
    date: now.toLocaleDateString("en-ca"),
    tz: -now.getTimezoneOffset() / 60,
    timestamp: Math.floor(now.getTime() / 1000),
  };
  return elements;
}

const em = init();
check_storage();
