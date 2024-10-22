// Fortune Widget
// version 2024.10.0
// Guide and updates ☛ https://forum.vivaldi.net/post/783627
// ————————  ⁂  ————————

"use strict";

async function get_data() {
  return new Promise((resolve, reject) => {
    fetch("https://helloacm.com/api/fortune/")
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

function get_time() {
  const date = new Date();
  const d = date.getDay();
  const h = date.getHours();
  return { day: d, hour: h };
}

function write_fortune(q, el) {
  q = q.replace("--", "-\u2060-");
  el.innerHTML = q;
}

const init = async () => {
  let request = true;
  const text = document.getElementById("text");
  const sto = JSON.parse(localStorage.getItem("fortune"));
  if (sto !== null) {
    console.info(sto);
    const local = get_time();
    if (
      local.day === sto.time.day &&
      (local.hour < 12 || (local.hour > 11 && sto.time.hour > 11))
    ) {
      request = false;
      write_fortune(sto.quote, text);
    }
  }
  if (request === true) {
    await get_data().then(
      (resolve) => {
        console.info(resolve);
        const store = get_time();
        const object = {
          quote: resolve.data,
          time: { day: store.day, hour: store.hour },
        };
        localStorage.setItem("fortune", JSON.stringify(object));
        write_fortune(resolve.data, text);
      },
      (reject) => {
        text.innerHTML = reject.message;
      }
    );
  }
};

function new_fortune(event) {
  if (event.button === 0 && event.ctrlKey) {
    localStorage.removeItem("fortune");
    init();
  }
}

init();
document.getElementById("asterism").addEventListener("click", new_fortune);
