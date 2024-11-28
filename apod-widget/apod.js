// Astronomy Picture of the Day Dashboard Widget
// version 2024.11.0
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
      image_url = "noimage.jpg";
  }
  return new Promise((resolve) => {
    em.media.onload = () => resolve(`image loaded ${image_url}`);
    em.media.src = image_url;
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
          message: "cannot load data :/",
        });
      });
  });
}

function set(data) {
  em.title.innerHTML = data.title;
  em.date.innerHTML = data.date;
  em.set_date.value = data.date;
  if ("copyright" in data) {
    em.copyright.innerHTML = data.copyright.trim();
    em.copyright.parentElement.classList.remove("hidden");
  } else em.copyright.parentElement.classList.add("hidden");
  em.explanation.innerHTML = data.explanation;
  if (em.first_run === true) {
    em.set_date.setAttribute("max", data.date);
    em.container.classList.remove("hidden");
    em.first_run = false;
  } else {
    const mu = data.date.slice(2).replace(/-/g, "");
    em.media.parentElement.setAttribute(
      "href",
      `https://apod.nasa.gov/apod/ap${mu}.html`
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
      console.error(`cannot load image ${data.url}`);
      em.media.src = "noimage.jpg";
      set(data);
    }
  );
};

const setup = async (data_url) => {
  em.data_error.classList.add("hidden");
  if (em.first_run === true) {
    const apod = JSON.parse(localStorage.getItem("apod"));
    if (apod !== null && Date.now() - apod.timestamp < 7200000) {
      console.info(apod);
      parse(apod);
      return;
    }
  }
  await get_data(data_url).then(
    (resolve) => {
      console.info(resolve);
      if (em.first_run === true) {
        const storage = resolve.data;
        storage.timestamp = Date.now();
        localStorage.setItem("apod", JSON.stringify(storage));
      }
      parse(resolve.data);
    },
    (reject) => {
      em.data_error.innerHTML = reject.message;
      em.data_error.classList.remove("hidden");
    }
  );
};

const new_query = (event) => {
  em.set_date.blur();
  const pick = event.target.value;
  const archive = `https://api.nasa.gov/planetary/apod?date=${pick}&api_key=${api_key}`;
  setup(archive);
};

function init() {
  const elements = {
    container: document.getElementById("container"),
    title: document.getElementById("title"),
    media: document.getElementById("media"),
    text: document.getElementById("text"),
    copyright: document.getElementById("copyright"),
    explanation: document.getElementById("explanation"),
    date: document.getElementById("date"),
    set_date: document.getElementById("set_date"),
    data_error: document.getElementById("error"),
    first_run: true,
  };
  elements.set_date.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") e.target.showPicker();
    else if (/^\d$/.test(e.key)) e.preventDefault();
  });
  elements.set_date.addEventListener("change", new_query);
  return elements;
}

const api_request = `https://api.nasa.gov/planetary/apod?api_key=${api_key}`;
const em = init();
setup(api_request);
