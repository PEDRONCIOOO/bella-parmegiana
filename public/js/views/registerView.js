import View from "./View.js";

class RegisterView extends View {
  _parentEl = document.querySelector(".register-container");
  _registerForm = document.querySelector("#registerForm");
  constructor() {
    super();
  }

  addHandlerSignUp(handler) {
    if (this._registerForm)
      this._registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputs = this._registerForm.elements;

        const data = {
          name: inputs[0].value,
          email: inputs[1].value,
          phoneNumber: inputs[2].value,
          password: inputs[3].value,
          passwordConfirm: inputs[4].value,
        };

        handler(data);
      });
  }

  _generateMarkupConfirmEmail() {
    const inputs = this._registerForm.elements;

    return `
    <div>
        <svg>
          <use href="../img/icons.svg#icon-email"></use>
        </svg>
        <h1>Verifique seu email</h1>
      </div>
      <p>
        Nós mandamos um email para: <br />
        <b>${inputs[1].value}</b>
      </p>
      <p>Em até 5 minutos o email deverá estar em sua caixa de entrada. Caso não veja o email, lembre-se de checar o SPAM.</p>
    </div>
    `;
  }

  renderConfirmEmailNotification() {
    this._clear();
    this.render(this._generateMarkupConfirmEmail());
  }
}

export default new RegisterView();
