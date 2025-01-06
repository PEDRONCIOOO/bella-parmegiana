import View from "./View.js";

class PasswordResetView extends View {
  _resetPasswordForm = document.querySelector(".reset-password-form");
  constructor() {
    super();
  }

  addHandlerResetPassword(handler) {
    if (this._resetPasswordForm)
      this._resetPasswordForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const inputs = this._resetPasswordForm.elements;

        const password = inputs[0].value;
        const passwordConfirm = inputs[1].value;

        const token = window.location.pathname.split("/")[2];
        handler(token, password, passwordConfirm);
      });
  }
}

export default new PasswordResetView();
