// Astronomy Picture of the Day Dashboard Widget
// version 2024.10.3
// Guide and updates ☛ https://forum.vivaldi.net/post/783627
// ————————  ⁂  ————————

"use strict";

// EDIT START
// For advanced functionality generate your own API key @ https://api.nasa.gov
// and input it below. By default the demo key is being used, which limits the
// number and rate of requests and might deny service.

const api_key = "DEMO_KEY";

// EDIT END

const video_thumb = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/;
  const id = url.match(regex);
  return `https://img.youtube.com/vi/${id[1]}/hqdefault.jpg`;
};

async function load_image(data, e) {
  let image_url = "";
  if (data.media_type === "video") image_url = video_thumb(data.url);
  else image_url = data.url;
  return new Promise((resolve) => {
    e.onload = () => resolve(`image loaded ${image_url}`);
    e.src = image_url;
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
  if (em.api === true) em.set_date.value = data.date;
  if ("copyright" in data) {
    em.copyright.innerHTML = data.copyright.trim();
    em.copyright.parentElement.classList.remove("hidden");
  } else em.copyright.parentElement.classList.add("hidden");
  em.explanation.innerHTML = data.explanation;
  if (em.first_run === true) {
    if (em.api === true) em.set_date.setAttribute("max", data.date);
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
  await load_image(data, em.media).then(
    (resolve) => {
      console.info(resolve);
      set(data);
    },
    () => {
      console.error(`cannot load image ${data.url}`);
      em.media.src = "icons/noimage.jpg";
      set(data);
    }
  );
};

const setup = async (data_url) => {
  em.data_error.classList.add("hidden");
  await get_data(data_url).then(
    (resolve) => {
      console.info(resolve);
      parse(resolve.data, init);
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
  const container = document.getElementById("container");
  const title = document.getElementById("title");
  const media = document.getElementById("media");
  const text = document.getElementById("text");
  const copyright = document.getElementById("copyright");
  const explanation = document.getElementById("explanation");
  const data_error = document.getElementById("error");
  const elements = {
    container: container,
    title: title,
    media: media,
    text: text,
    copyright: copyright,
    explanation: explanation,
    data_error: data_error,
    first_run: true,
  };
  let date = "";
  if (api_key === "DEMO_KEY") {
    elements.api = false;
    date = document.querySelector("div .date");
    date.parentElement.classList.remove("hidden");
  } else {
    elements.api = true;
    date = document.querySelector("details .date");
    date.parentElement.parentElement.classList.remove("hidden");
    const set_date = document.getElementById("set_date");
    elements.set_date = set_date;
    set_date.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") e.target.showPicker();
      if (/^\d$/.test(e.key)) e.preventDefault();
    });
    set_date.addEventListener("change", new_query);
  }
  elements.date = date;
  return elements;
}

const apod = `https://api.nasa.gov/planetary/apod?api_key=${api_key}`;
const em = init();
setup(apod);
