import View from "./View.js";

//FIXME: Do not add event listener if the user is logged in
//TODO: Add success message on logOut

class navView extends View {
  _parentEl = document.querySelector(".forgot-password-container");
  _blurOverlay = document.querySelector(".blur-overlay");
  _loginBtn = document.querySelectorAll(".login-btn");
  _registerBtn = document.querySelectorAll(".register-btn");
  _forgotPasswordBtn = document.querySelector(".forgot-password-btn");
  _logOutBtn = document.querySelectorAll(".logout-btn");
  _loginContainer = document.querySelector(".log-in-container");
  _registerContainer = document.querySelector(".register-container");
  _forgotPassowrdContainer = document.querySelector(
    ".forgot-password-container"
  );
  _closeBtn = document.querySelectorAll(".close-form-btn");

  _shoppingCart = document.querySelector(".shop-cart-menu-display");
  _shoppingCartBtn = document.querySelectorAll(".shoppingCart-btn");
  _shoppingCartCloseBtn = document.querySelector(".shopping-cart-close-btn");

  _forgotPasswordForm = document.querySelector("#forgotPasswordForm");
  _navOpenButton = document.querySelector(".nav-open-btn");
  _navMenu = document.querySelector(".menu-principal-home");
  _navMenuClose = document.querySelector(".menu-principal-close");

  constructor() {
    super();
    this._addEventListeners();
  }

  _addEventListeners() {
    if (this._blurOverlay)
      this._blurOverlay.addEventListener("click", () => {
        this._hideModal(this._loginContainer);
        this._hideModal(this._registerContainer);
        this._hideModal(this._forgotPassowrdContainer);
        this._hideModal(this._shoppingCart);
        this._hideModal(this._navMenu);
      });
    if (this._navOpenButton)
      this._navOpenButton.addEventListener("click", () => {
        this._showModal(this._navMenu);
      });

    if (this._loginBtn)
      this._loginBtn.forEach((el) => {
        el.addEventListener("click", () => {
          this._showModal(this._loginContainer);
        });
      });

    if (this._registerBtn) {
      this._registerBtn.forEach((el) => {
        el.addEventListener("click", () => {
          this._showModal(this._registerContainer);
        });
      });
    }
    if (this._navMenuClose)
      this._navMenuClose.addEventListener("click", () => {
        this._hideModal(this._navMenu);
      });

    if (this._shoppingCartCloseBtn)
      this._shoppingCartCloseBtn.addEventListener("click", () => {
        this._hideModal(this._shoppingCart);
      });

    if (this._closeBtn)
      this._closeBtn.forEach((el) =>
        el.addEventListener("click", () => {
          this._hideModal(this._registerContainer);
          this._hideModal(this._loginContainer);
          this._hideModal(this._forgotPassowrdContainer);
        })
      );

    if (this._forgotPasswordBtn)
      this._forgotPasswordBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this._hideModal(this._loginContainer);
        this._showModal(this._forgotPassowrdContainer);
      });
  }

  addSendResetPasswordEmailHandler(handler) {
    if (this._forgotPasswordForm)
      this._forgotPasswordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handler(this._forgotPasswordForm.elements[0].value);
      });
  }

  addLogoutHandler(handler) {
    if (this._logOutBtn)
      this._logOutBtn.forEach((el) =>
        el.addEventListener("click", handler.bind(this))
      );
  }

  _generateMarkupSendEmail() {
    const inputs = this._forgotPasswordForm.elements;

    return `
    <div>
        <svg>
          <use href="../img/icons.svg#icon-email"></use>
        </svg>
        <h1>Defina uma nova senha</h1>
      </div>
      <p>
        Nós mandamos um email para: <br />
        <b>${inputs[0].value}</b>
      </p>
      <p>Para recuperar sua conta abra seu email, por favor!</p>
    </div>
    `;
  }

  addHadlerRenderShoppingCart(handler) {
    if (this._shoppingCartBtn)
      this._shoppingCartBtn.forEach((el) => {
        el.addEventListener("click", (e) => {
          this._showModal(this._shoppingCart);
          handler();
        });
      });
  }

  renderSendEmailNotification() {
    this._clear();
    this.render(this._generateMarkupSendEmail());
  }
}

export default new navView();
