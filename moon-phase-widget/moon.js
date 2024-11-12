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

function parse(data) {
  const prop = data.properties.data;
  const cp = prop.closestphase;
  const diff =
    Math.max(em.timestamp, cp.timestamp) - Math.min(em.timestamp, cp.timestamp);
  const phase = diff < 86400 ? cp.phase : prop.curphase;
  em.phase.innerHTML = `${phase}<br><b>${prop.fracillum}</b>`;
  const svg = prop.moon.find((item) => item.hasOwnProperty(phase));
  const lat = data.geometry.coordinates[1];
  em.mod.setAttribute("y", Object.values(svg)[0][0]);
  em.mod.setAttribute("height", Object.values(svg)[0][1]);
  em.mod.setAttribute("transform", `rotate(${lat})`);
  prop.events.forEach((event) => {
    const li = document.createElement("li");
    li.classList.add(event.obj);
    li.textContent = `${event.time}\u{2002}\u{200a}${event.phen}`;
    em.events.appendChild(li);
  });
  em.container.classList.remove("hidden");
}

function edit(arr, obj) {
  arr.forEach((entry) => {
    switch (entry.phen) {
      case "Rise":
        entry.phen = `${obj}rise`;
        break;
      case "Upper Transit":
        entry.phen = `${obj} transit`;
        break;
      case "Set":
        entry.phen = `${obj}set`;
        break;
      case "Begin Civil Twilight":
        entry.phen = "civil dawn";
        break;
      default:
        entry.phen = "civil dusk";
    }
    Object.assign(entry, { obj: obj });
  });
  return arr;
}

function storage(data) {
  data.date = em.date;
  const prop = data.properties.data;
  const cp = prop.closestphase;
  const month = String(cp.month).padStart(2, "0");
  const day = String(cp.day).padStart(2, "0");
  const date_string = `${cp.year}-${month}-${day}`;
  const time_string = `${date_string}T${cp.time}`;
  cp.timestamp = Math.floor(new Date(time_string).getTime() / 1000);
  const events = edit(prop.moondata, "moon").concat(edit(prop.sundata, "sun"));
  if (date_string === em.date) {
    prop.curphase = cp.phase;
    const main = { phen: cp.phase.toLowerCase(), time: cp.time, obj: "moon" };
    events.push(main);
  }
  prop.events = events.sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
  prop.moon = [
    { "New Moon": [-5, 0] },
    { "Waxing Crescent": [-5, 3] },
    { "First Quarter": [-5, 5] },
    { "Waxing Gibbous": [-5, 7] },
    { "Full Moon": [-5, 10] },
    { "Waning Gibbous": [-2, 7] },
    { "Last Quarter": [0, 5] },
    { "Waning Crescent": [2, 3] },
  ];
  return data;
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
      em.container.innerHTML = reject.message;
      em.container.classList.remove("hidden");
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
        em.container.innerHTML = reject.message;
        em.container.classList.remove("hidden");
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
    mod: document.getElementById("mod"),
    phase: document.getElementById("phase"),
    events: document.getElementById("events"),
    date: now.toLocaleDateString("en-ca"),
    tz: -now.getTimezoneOffset() / 60,
    timestamp: Math.floor(now.getTime() / 1000),
  };
  return elements;
}

const em = init();
check_storage();
