// Moon Phase Widget
// version 2024.11.0
// Guide and updates ☛ https://forum.vivaldi.net/post/783627
// ————————  ⁂  ————————

"use strict";

// EDIT START
// Latitude and longitude are being determined by an API. For more accuracy
// on a stationary install, or when using a VPN service, input your decimal
// coordinates below. E.g. [latitude, longitude] for Reykjavík: [64.14, -21.89]

const coordinates = [];

// EDIT END

const lunation = {
  newmoon: [
    1730465220, 1733034060, 1735597620, 1738154160, 1740703500, 1743245880,
    1745782260, 1748314920, 1750847460, 1753384260, 1755929160, 1758484440,
    1761049500, 1763621220, 1766194980, 1768765920, 1771329660, 1773883380,
    1776426720, 1778961660, 1781492040, 1784022180, 1786556220, 1789097220,
    1791647400, 1794207720, 1796777520, 1799353440, 1801929360, 1804498140,
    1807055460, 1809601080, 1812138000, 1814670120, 1817201100, 1819734060,
    1822271760, 1824816960, 1827372240, 1829938320, 1832512320, 1835087820,
    1837657860, 1840218420, 1842768960, 1845311220, 1847847720, 1850381040,
    1852914240, 1855450620, 1857993480, 1860545160, 1863105840, 1865673060,
    1868242740, 1870810800, 1873374120, 1875930600, 1878479460, 1881021360,
    1883558640, 1886094840, 1888633440, 1891176720, 1893725340, 1896278820,
    1898836440, 1901397720, 1903961520, 1906525260, 1909085640, 1911640260,
    1914188820, 1916733240, 1952456940, 1955005560, 1957550760, 1960093440,
    1962635040, 1965177540, 1967722560, 1970271120, 1972824060, 1975381860,
    1977944160, 1980509160, 1983073500, 1985633580, 1988187420, 1990735200,
    1993278180, 1995817860, 1998355560, 2000892960, 2003432820, 2005978320,
    2008532400, 2011095600, 2013665280, 2016236340, 2018803560, 2021364060,
    2023917000, 2026462440, 2029001160, 2031534720, 2034066360, 2036600100,
    2039140380, 2041690440, 2044251120, 2046820560, 2049394440, 2051967780,
    2054535720, 2057094540, 2059642680, 2062181040, 2064712860, 2067242340,
    2069773920, 2072311140, 2074856820, 2077412280, 2079977820, 2082551460,
    2085128220, 2087701140, 2090264220, 2092815180, 2095355820, 2097889740,
    2100421020, 2102952900, 2105488260, 2108029800, 2110580040, 2113140840,
    2115711240, 2118286440, 2120859360, 2123424420, 2125979640, 2128525800,
    2131065120, 2133600060, 2136133500, 2138668440, 2141208180, 2143755480,
    2146311660,
  ],
  progress: (em) => {
    const ln = lunation.newmoon;
    for (let i = 0; i < ln.length; i++) {
      if (em.timestamp >= ln[i])
        return Math.trunc(((em.timestamp - ln[i]) / (ln[i + 1] - ln[i])) * 100);
    }
  },
};

function schedule(events, em) {
  em.events.innerHTML = "";
  events.forEach((e, i, a) => {
    const li = document.createElement("li");
    let ind = "";
    let ch = "";
    if (em.time === e.time) li.classList.add("main");
    else if (i === 0 && em.time < e.time) {
      ind = "before";
      ch = arrow;
    } else if (
      (i === a.length - 1 && em.time > e.time) ||
      (em.time > e.time && em.time < a[i + 1].time)
    ) {
      ind = "after";
      ch = arrow;
    }
    li.innerHTML = `<div class="contain"><span class=${ind}>${ch}</span></div><span>${e.time}</span><span></span><span>${e.phen}</span><span></span>`;
    em.events.appendChild(li);
  });
}

function calc_ry(p, i) {
  return p.includes("Crescent") ? 250 - 5 * i : i * 5 - 250;
}

function parse(data, em) {
  const prop = data.properties.data;
  const progress = lunation.progress(em);
  const phase = prop.curphase;
  em.phase.innerHTML = `${phase}<br><b>${progress}%</b>`;
  const svg = prop.moon.find((entry) => entry.hasOwnProperty(phase));
  const ry = Object.values(svg)[0][2];
  const illum = ry === 1 ? calc_ry(phase, parseFloat(prop.fracillum)) : ry;
  em.rec.setAttribute("y", Object.values(svg)[0][0]);
  em.rec.setAttribute("fill", Object.values(svg)[0][1]);
  em.ell.setAttribute("ry", illum);
  em.ell.setAttribute("fill", Object.values(svg)[0][3]);
  em.angle.forEach((el) => {
    el.setAttribute("transform", `rotate(${data.geometry.coordinates[1]})`);
  });
  schedule(prop.events, em);
  em.container.classList.remove("hidden");
}

function edit(arr, obj) {
  arr.forEach((entry) => {
    switch (entry.phen) {
      case "Rise":
        entry.phen = `${obj}rise`;
        break;
      case "Upper Transit":
        entry.phen = `${obj} Transit`;
        break;
      case "Set":
        entry.phen = `${obj}set`;
        break;
      case "Begin Civil Twilight":
        entry.phen = "Civil Dawn";
        break;
      default:
        entry.phen = "Civil Dusk";
    }
    Object.assign(entry, { obj: obj });
  });
  return arr;
}

function storage(data, em) {
  data.date = em.date;
  const prop = data.properties.data;
  const cp = prop.closestphase;
  const month = String(cp.month).padStart(2, "0");
  const day = String(cp.day).padStart(2, "0");
  const date_string = `${cp.year}-${month}-${day}`;
  const events = edit(prop.moondata, "Moon").concat(edit(prop.sundata, "Sun"));
  if (date_string === em.date) {
    prop.curphase = cp.phase;
    const main = { phen: cp.phase, time: cp.time, obj: "Moon" };
    events.push(main);
  }
  prop.events = events.sort((a, b) => {
    if (a.time !== null) return a.time.localeCompare(b.time);
  });
  prop.moon = [
    { "New Moon": [0, "black", 0, "black"] },
    { "Waxing Crescent": [-250, "white", 1, "black"] },
    { "First Quarter": [-250, "white", 0, "black"] },
    { "Waxing Gibbous": [-250, "white", 1, "white"] },
    { "Full Moon": [0, "white", 250, "white"] },
    { "Waning Gibbous": [0, "white", 1, "white"] },
    { "Last Quarter": [0, "white", 0, "black"] },
    { "Waning Crescent": [0, "white", 1, "black"] },
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

async function astro(lat, lon, em) {
  await load_data(
    `https://aa.usno.navy.mil/api/rstt/oneday?date=${em.date}&coords=${lat},${lon}&tz=${em.tz}`
  ).then(
    (resolve) => {
      console.info(resolve);
      const sto = storage(resolve.data, em);
      localStorage.setItem("moon-phase", JSON.stringify(sto));
      parse(sto, em);
    },
    (reject) => {
      em.container.innerHTML = reject.message;
      em.container.classList.remove("hidden");
    }
  );
}

async function loc(em) {
  if (Array.isArray(coordinates) && coordinates.length === 2) {
    astro(coordinates[0], coordinates[1], em);
  } else {
    await load_data(
      "http://ip-api.com/json?fields=status,message,lat,lon"
    ).then(
      (resolve) => {
        console.info(resolve);
        if (!resolve.data.message)
          astro(resolve.data.lat, resolve.data.lon, em);
      },
      (reject) => {
        em.container.innerHTML = reject.message;
        em.container.classList.remove("hidden");
      }
    );
  }
}

function check_storage(em) {
  const saved = JSON.parse(localStorage.getItem("moon-phase"));
  if (saved !== null && saved.date === em.date) {
    console.info(saved);
    parse(saved, em);
  } else loc(em);
}

function init() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const elements = {
    container: document.getElementById("container"),
    ell: document.getElementById("ell"),
    rec: document.getElementById("rec"),
    angle: document.querySelectorAll(".angle"),
    phase: document.getElementById("phase"),
    events: document.getElementById("events"),
    date: now.toLocaleDateString("en-ca"),
    time: `${hours}:${minutes}`,
    tz: -now.getTimezoneOffset() / 60,
    timestamp: Math.floor(now.getTime() / 1000),
  };
  check_storage(elements);
}

const arrow = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="0.8575em" viewBox="0 0 511.6 438.71" fill="currentColor"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>`;
init();
const reload = document.getElementById("reload");
reload.addEventListener("click", () => {
  reload.classList.add("load");
  init();
  setTimeout(() => reload.classList.remove("load"), 800);
});
