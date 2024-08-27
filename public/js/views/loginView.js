import View from "./View.js";

class loginView extends View {
  _parentEl = document.querySelector(".form-container");
  emailInput = document.querySelector("#email");
  passwordInput = document.querySelector("#password");

  addHandlerLogin(handler) {
    if (this._parentEl)
      this._parentEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = this.emailInput.value;
        const password = this.passwordInput.value;
        handler(email, password);
      });
  }
}

export default new loginView();
