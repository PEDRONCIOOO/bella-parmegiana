import View from "./View.js";

class AccountView extends View {
  _updateUserForm = document.querySelector(".name-email");
  _userName = document.querySelector(".user-name");
  _userEmail = document.querySelector(".user-email");
  _userNumber = document.querySelector(".user-number");
  _updateInfoBtn = document.querySelector(".update-info-btn");

  // Password
  _passwordUpdateForm = document.querySelector(".change-passwords");
  _passwordCurrent = document.querySelector(".password-current");
  _passwordNew = document.querySelector(".password-new");
  _passwordConfirm = document.querySelector(".password-confirm");
  _updatePasswordBtn = document.querySelector(".update-password-btn");

  addHandlerUpdateUser(handler) {
    if (this._updateUserForm)
      this._updateUserForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = this._userName.value;
        const email = this._userEmail.value;
        const number = this._userNumber.value;

        handler({ name, email, number });
      });
  }

  addHandlerUpdatePassword(handler) {
    if (this._passwordUpdateForm)
      this._passwordUpdateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const currentPassword = this._passwordCurrent.value;
        const password = this._passwordNew.value;
        const passwordConfirm = this._passwordConfirm.value;

        handler({ currentPassword, password, passwordConfirm }, "password");
      });
  }

  clearPasswordInputFields() {
    this._passwordCurrent.value = "";
    this._passwordNew.value = "";
    this._passwordConfirm.value = "";
  }

  changePasswordBtnText(text) {
    this._updatePasswordBtn.innerHTML = text;
  }

  changeInfoBtnText(text) {
    this._updateInfoBtn.innerHTML = text;
  }
}

export default new AccountView();
