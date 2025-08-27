// Astronomy Picture of the Day Dashboard Widget
// version 2025.7.0
// Guide and updates ☛ https://forum.vivaldi.net/post/783627
// ————————  ⁂  ————————

"use strict";

// EDIT START
// Generate your own API key @ https://api.nasa.gov and input it below. By
// default the demo key is being used, which limits the number and rate of
// requests and might deny service.

const api_key = "DEMO_KEY";

// EDIT END

const video_thumb = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/;
  const id = url.match(regex);
  return `https://img.youtube.com/vi/${id[1]}/hqdefault.jpg`;
};

async function load_image(data) {
  let image_url;
  switch (data.media_type) {
    case "image":
      image_url = data.url;
      break;
    case "video":
      image_url = video_thumb(data.url);
      break;
    default:
      image_url = "icons/noimage.jpg";
  }
  return new Promise((resolve) => {
    es.media.onload = () => resolve(`image loaded ${image_url}`);
    es.media.src = image_url;
  });
}

async function get_data(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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
          message: "Connection error",
        });
      });
  });
}

function set(data) {
  es.title.innerHTML = data.title;
  es.date.innerHTML = data.date;
  es.set_date.value = data.date;
  if ("copyright" in data) {
    es.copyright.innerHTML = data.copyright.trim();
    es.copyright.parentElement.classList.remove("hidden");
  } else es.copyright.parentElement.classList.add("hidden");
  es.explanation.innerHTML = data.explanation;
  if (es.first_run === true) {
    es.set_date.setAttribute("max", data.date);
    es.container.classList.remove("hidden");
    es.first_run = false;
  } else {
    const mu = data.date.slice(2).replace(/-/g, "");
    es.media.parentElement.setAttribute(
      "href",
      `https://apod.nasa.gov/apod/ap${mu}.html`,
    );
  }
}

const parse = async (data) => {
  await load_image(data).then(
    (resolve) => {
      console.info(resolve);
      set(data);
    },
    () => {
      console.error(`Could not load image ${data.url}`);
      es.media.src = "icons/noimage.jpg";
      set(data);
    },
  );
};

const setup = async (data_url) => {
  es.error.classList.add("hidden");
  if (es.first_run === true) {
    const apod = JSON.parse(localStorage.getItem("apod"));
    if (
      apod &&
      (es.time < apod.next || es.time - apod.last_checked < 3600000)
    ) {
      console.info(apod);
      parse(apod);
      return;
    }
  }
  await get_data(data_url).then(
    (resolve) => {
      if (es.first_run === true) {
        const storage = resolve.data;
        storage.last_checked = es.time;
        storage.next = new Date(storage.date).getTime() + 102600000;
        localStorage.setItem("apod", JSON.stringify(storage));
      }
      console.info(resolve);
      parse(resolve.data);
    },
    (reject) => {
      es.error.innerHTML = reject.message;
      es.error.classList.remove("hidden");
    },
  );
};

const new_query = (event) => {
  es.set_date.blur();
  const pick = event.target.value;
  const archive = `https://api.nasa.gov/planetary/apod?date=${pick}&api_key=${api_key}`;
  setup(archive);
};

function init() {
  const essentials = {
    api_request: `https://api.nasa.gov/planetary/apod?api_key=${api_key}`,
    first_run: true,
    time: Date.now(),
  };
  const elements = [
    "container",
    "copyright",
    "date",
    "error",
    "explanation",
    "media",
    "set_date",
    "text",
    "title",
  ];
  elements.forEach((el) => (essentials[el] = document.getElementById(el)));
  essentials.set_date.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") e.target.showPicker();
    else if (/^\d$/.test(e.key)) e.preventDefault();
  });
  essentials.set_date.addEventListener("change", new_query);
  return essentials;
}

const es = init();
setup(es.api_request);
