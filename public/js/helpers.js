import { TIMEOUT_SEC } from "./config.js";

// TODO: Use Axios Next time
export const request = async function (
  path,
  method = undefined,
  reqData = undefined,
  dataType = "application/json"
) {
  try {
    const body =
      dataType === "application/json" ? JSON.stringify(reqData) : reqData;

    const AJAX = method
      ? fetch(`/api/v1/${path}`, {
          method,
          headers: {
            "Content-Type": dataType,
          },
          body,
        })
      : fetch(`/api/v1/${path}`);

    const data = await Promise.race([AJAX, timeout(TIMEOUT_SEC)]);
    const res = await data.json();

    console.log(res);
    if (res.status === "fail" || res.status === "error") {
      throw new Error(res.message);
    } else {
      return res;
    }
  } catch (err) {
    throw err;
  }
};

export const reloadPage = (seconds) => {
  setTimeout(() => {
    location.reload();
  }, seconds * 1000);
};

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const renderNotification = function (type, message) {
  const markup = `
  <div class="toast ${type}">
      <div class="toast-content">
        <svg class="${type}">
          <use href="/img/icons.svg#icon-${type}"></use>
        </svg>
        <div class="message">
          <span class="text text-1">${
            type === "error" ? "Erro!" : "Sucesso!"
          }</span>
          <span class="text text-2">${message}</span>
        </div>
          <svg class="close">
            <use href="/img/icons.svg#icon-error"></use>
          </svg>
        </div>
      </div>
        `;
  // <div class="progress-${type}"></div>

  document
    .querySelector(".toaster-container")
    .insertAdjacentHTML("beforeend", markup);

  const toastNotification = document.querySelector(
    ".toaster-container .toast:last-child"
  );
  setTimeout(() => {
    toastNotification.remove();
  }, 6000);
};
