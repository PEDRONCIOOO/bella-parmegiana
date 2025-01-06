import View from "./View.js";

class EmailConfirmView extends View {
  _confirmEmailBtn = document.querySelector(".email-confirm-btn");

  addHandlerConfirmEmail(handler) {
    if (this._confirmEmailBtn)
      this._confirmEmailBtn.addEventListener("click", (e) => {
        const token = window.location.pathname.split("/")[2];

        handler(token);
      });
  }
}

export default new EmailConfirmView();
