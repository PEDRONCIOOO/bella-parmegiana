import $jVhuh$mercadopago from "mercadopago";

const $083eaea728d068b0$export$61abde59b50deb8e =
  "http://127.0.0.1:5000/api/v1";
const $083eaea728d068b0$export$196440f71ed9f601 = 10;

const $37ad537dd3e87e13$export$b5fe3f66a567bec0 = async function (
  path,
  method,
  reqData,
  dataType = "application/json"
) {
  try {
    const body =
      dataType === "application/json" ? JSON.stringify(reqData) : reqData;
    const AJAX = method
      ? fetch(`${(0, $083eaea728d068b0$export$61abde59b50deb8e)}/${path}`, {
          method: method,
          headers: {
            "Content-Type": dataType,
          },
          body: body,
        })
      : fetch(`${(0, $083eaea728d068b0$export$61abde59b50deb8e)}/${path}`);
    const data = await Promise.race([
      AJAX,
      $37ad537dd3e87e13$export$83e74882c5df8fe1(
        (0, $083eaea728d068b0$export$196440f71ed9f601)
      ),
    ]);
    const res = await data.json();
    console.log(res);
    if (res.status === "fail" || res.status === "error")
      throw new Error(res.message);
    else return res;
  } catch (err) {
    throw err;
  }
};
const $37ad537dd3e87e13$export$da22d4a5076a7905 = (seconds) => {
  setTimeout(() => {
    location.reload();
  }, seconds * 1000);
};
const $37ad537dd3e87e13$export$83e74882c5df8fe1 = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
const $37ad537dd3e87e13$export$2d13f4f324548872 = function (type, message) {
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

const $470b6aa9041e5638$export$ca000e230c0caa3e = {
  recipes: [],
  newRecipes: [],
  page: 1,
  count: undefined,
  curCategories: undefined,
  shoppingCart: [],
};
const $470b6aa9041e5638$export$7b79da20e2a51e08 = async function (
  email,
  password
) {
  try {
    const res = await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)(
      "users/login",
      "POST",
      {
        email: email,
        password: password,
      }
    );
    return res;
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$f8bc10b856805210 = async function () {
  try {
    await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)("users/logout");
  } catch (err) {
    throw new Error(`Erro ao efetuar o logout!Por favor tente novamente`);
  }
};
const $470b6aa9041e5638$export$8e9e0bdc826b242c = async function (data, type) {
  try {
    const path =
      type === "password" ? "users/updateMyPassword" : "users/updateMe";
    await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)(path, "PATCH", data);
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$88246c25250c6147 = async function (data) {
  try {
    const res = await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)(
      "users/addresses",
      "POST",
      {
        data: data,
      }
    );
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$478bae29a2ce7b6d = async function (cep) {
  try {
    //
    const res = await fetch(`https://api.brasilaberto.com/v1/zipcode/${cep}`);
    const data = await res.json();
    if (data.result.error)
      throw new Error(
        "Erro ao pegar informa\xe7\xf5es, certifique-se de que o CEP est\xe1 correto!"
      );
    return data;
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$1385536c13345b0c = async function (id) {
  try {
    await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)(
      "users/addresses",
      "DELETE",
      {
        id: id,
      }
    );
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$eaeb5d9f844f32d7 = async function (formData) {
  try {
    const data = await fetch(
      `${(0, $083eaea728d068b0$export$61abde59b50deb8e)}/recipes`,
      {
        method: "POST",
        body: formData,
      }
    );
    const res = await data.json();
    if (res.status === "error" || res.status === "fail")
      throw new Error(res.message);
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$52b5cb58c5cddd9f = async function (id) {
  try {
    const res = await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)(
      `recipes/${id}`,
      "DELETE"
    );
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$20c25ccb8e603fb9 = async function (
  token,
  password,
  passwordConfirm
) {
  try {
    await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)(
      `users/resetPassword/${token}`,
      "PATCH",
      {
        password: password,
        passwordConfirm: passwordConfirm,
      }
    );
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$553a7d2e29b97358 = async function (data) {
  try {
    await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)(
      `users/signup`,
      "POST",
      data
    );
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$aa06f30a5c9809a8 = async function (token) {
  try {
    await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)(
      `users/confirmEmail/${token}`,
      "PATCH"
    );
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$24531cc2aa925809 = async function (email) {
  try {
    await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)(
      `users/forgotPassword`,
      "POST",
      {
        email: email,
      }
    );
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$a9fe710f565dd9e3 = async function (
  categories,
  count = true,
  page = 1
) {
  try {
    $470b6aa9041e5638$export$ca000e230c0caa3e.curCategories = categories;
    let queryString;
    if (categories === "all")
      queryString = `?page=${page}${count ? "&count=true" : ""}`;
    else
      queryString = `?categories=${JSON.stringify(
        categories.split(",")
      )}&page=${page}${count ? "&count=true" : ""}`;
    const res = await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)(
      `recipes${queryString}`
    );
    $470b6aa9041e5638$export$ca000e230c0caa3e.page = page;
    if (page > 1)
      $470b6aa9041e5638$export$ca000e230c0caa3e.recipes.push(...res.data.data);
    else $470b6aa9041e5638$export$ca000e230c0caa3e.recipes = res.data.data;
    $470b6aa9041e5638$export$ca000e230c0caa3e.newRecipes = res.data.data;
    if (res.count) $470b6aa9041e5638$export$ca000e230c0caa3e.count = res.count;
  } catch (err) {
    throw err;
  }
};
const $470b6aa9041e5638$export$d76e4008e1dbce56 = async function (
  shoppingCartData
) {
  try {
    const res = await (0, $37ad537dd3e87e13$export$b5fe3f66a567bec0)(
      `orders/validateOrder`,
      "POST",
      shoppingCartData
    );
    console.log(res);
  } catch (err) {
    throw err;
  }
};

class $7e0517535d5352f3$export$2e2bcd8739ae039 {
  _data;
  _blurOverlay = document.querySelector(".blur-overlay");
  renderSuccessIcon() {
    const markup = `
      <div class="success-animation">
  <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
  </div>
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
  renderLoadingSpinner(element) {
    const markup = `
    <div class="loading-spinner-container">
    <svg class="loading-spinner">
          <use href="/img/icons.svg#icon-loading"></use>
          </div>
    `;
    element.insertAdjacentHTML("beforeend", markup);
    return () => {
      element.querySelector("loading-spinner").remove();
    };
  }
  render(markup) {
    this._clear;
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
  _clear() {
    this._parentEl.innerHTML = "";
  }
  _hideModal(element) {
    element.classList.add("hidden");
    this._blurOverlay.classList.add("hidden");
  }
  _showModal(element) {
    element.classList.remove("hidden");
    this._blurOverlay.classList.remove("hidden");
  }
  _convertToCurrencyBrl(number) {
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
}

class $0324854ac3a14cf9$var$loginView extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
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
var $0324854ac3a14cf9$export$2e2bcd8739ae039 =
  new $0324854ac3a14cf9$var$loginView();

//FIXME: Do not add event listener if the user is logged in
//TODO: Add success message on logOut
class $65096c09685f8a3f$var$navView extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
  _parentEl = document.querySelector(".forgot-password-container");
  _blurOverlay = document.querySelector(".blur-overlay");
  _loginBtn = document.querySelector("#login-btn");
  _registerBtn = document.querySelector("#register-btn");
  _forgotPasswordBtn = document.querySelector(".forgot-password-btn");
  _logOutBtn = document.querySelector("#logout-btn");
  _loginContainer = document.querySelector(".log-in-container");
  _registerContainer = document.querySelector(".register-container");
  _forgotPassowrdContainer = document.querySelector(
    ".forgot-password-container"
  );
  _closeBtn = document.querySelectorAll(".close-form-btn");
  _shoppingCart = document.querySelector(".shop-cart-menu-display");
  _shoppingCartBtn = document.querySelector(".cart-delivery");
  _forgotPasswordForm = document.querySelector("#forgotPasswordForm");
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
      });
    if (this._loginBtn)
      this._loginBtn.addEventListener("click", () => {
        this._showModal(this._loginContainer);
      });
    if (this._registerBtn)
      this._registerBtn.addEventListener("click", () => {
        this._showModal(this._registerContainer);
      });
    if (this._closeBtn)
      this._closeBtn.forEach((el) =>
        el.addEventListener("click", () => {
          this._hideModal(this._registerContainer);
          this._hideModal(this._loginContainer);
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
      this._logOutBtn.addEventListener("click", handler.bind(this));
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
        N\xf3s mandamos um email para: <br />
        <b>${inputs[0].value}</b>
      </p>
      <p>Para recuperar sua conta abra seu email, por favor!</p>
    </div>
    `;
  }
  addHadlerRenderShoppingCart(handler) {
    if (this._shoppingCartBtn)
      this._shoppingCartBtn.addEventListener("click", (e) => {
        this._showModal(this._shoppingCart);
        handler();
      });
  }
  renderSendEmailNotification() {
    this._clear();
    this.render(this._generateMarkupSendEmail());
  }
}
var $65096c09685f8a3f$export$2e2bcd8739ae039 =
  new $65096c09685f8a3f$var$navView();

class $fd8e1dcbcad580f9$var$AccountView extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
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
        handler({
          name: name,
          email: email,
          number: number,
        });
      });
  }
  addHandlerUpdatePassword(handler) {
    if (this._passwordUpdateForm)
      this._passwordUpdateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const currentPassword = this._passwordCurrent.value;
        const password = this._passwordNew.value;
        const passwordConfirm = this._passwordConfirm.value;
        handler(
          {
            currentPassword: currentPassword,
            password: password,
            passwordConfirm: passwordConfirm,
          },
          "password"
        );
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
var $fd8e1dcbcad580f9$export$2e2bcd8739ae039 =
  new $fd8e1dcbcad580f9$var$AccountView();

class $a3ad08df9247543c$var$addressesView extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
  _blurOverlay = document.querySelector(".blur-overlay");
  _addressesContainer = document.querySelector(".addresses-container");
  _addAddressBtn = document.querySelector(".addAdressBtn");
  _addressFormOverlay = document.querySelector(".form-overlay");
  _addressForm = document.querySelector(".address-form");
  _closeAddressFormBtn = document.querySelector(".close-form-btn");
  _deleteAddressModal = document.querySelector(".delete-address-modal");
  _deleteAddressBtn = document.querySelectorAll(".address-delete");
  _deleteAddressConfirmBtn = document.querySelector(
    ".delete-address-confirm-btn"
  );
  _deleteAddressCancelBtn = document.querySelector(
    ".delete-address-cancel-btn"
  );
  _formInputResidenceType = document.querySelector(
    ".address-form-input-residenceType"
  );
  _formInputCEP = document.querySelector(".address-form-input-CEP");
  _formInputState = document.querySelector(".address-form-input-state");
  _formInputCity = document.querySelector(".address-form-input-city");
  _formInputNeighbourhood = document.querySelector(
    ".address-form-input-neighbourhood"
  );
  _formInputStreet = document.querySelector(".address-form-input-street");
  _formInputHouseNumber = document.querySelector(
    ".address-form-input-house-number"
  );
  _formInputCompliment = document.querySelector(
    ".address-form-input-compliment"
  );
  constructor() {
    super(), this._addEventListeners();
  }
  _addEventListeners() {
    if (this._addressesContainer) {
      this._blurOverlay.addEventListener("click", (e) => {
        this._hideModal(this._addressForm);
        this._hideModal(this._deleteAddressModal);
      });
      if (this._addAddressBtn)
        this._addAddressBtn.addEventListener("click", (e) => {
          console.log("click");
          this._showModal(this._addressForm);
        });
      this._deleteAddressBtn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this._deleteAddressConfirmBtn.dataset.id = e.target.dataset.id;
          this._showModal(this._deleteAddressModal);
        });
      });
      this._deleteAddressCancelBtn.addEventListener("click", (e) => {
        this._hideModal(this._deleteAddressModal);
      });
      this._closeAddressFormBtn.addEventListener("click", (e) => {
        this._hideModal(this._addressFormOverlay);
      });
    }
  }
  addHandlerCEPFetch(handler) {
    if (this._formInputCEP)
      this._formInputCEP.addEventListener("blur", (e) => {
        e.preventDefault();
        const cep = this._formInputCEP.value.replaceAll("-", "");
        if (/^\d{8}$/.test(cep)) handler(cep, this);
      });
  }
  addCEPInfo(data) {
    this._formInputState.value = data.stateShortname;
    this._formInputCity.value = data.city;
    this._formInputNeighbourhood.value = data.district;
    this._formInputStreet.value = data.street;
  }
  addHandlerAddAddress(handler) {
    if (this._addressForm)
      this._addressForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
          residenceType: this._formInputResidenceType.value,
          CEP: this._formInputCEP.value.replace("-", ""),
          state: this._formInputState.value,
          city: this._formInputCity.value,
          neighbourhood: this._formInputNeighbourhood.value,
          street: this._formInputStreet.value,
          houseNumber: this._formInputHouseNumber.value,
          compliment: this._formInputCompliment.value,
        };
        handler(data);
      });
  }
  addHandlerDeleteAddress(handler) {
    if (this._deleteAddressConfirmBtn)
      this._deleteAddressConfirmBtn.addEventListener("click", function (e) {
        const id = e.target.dataset.id;
        handler(id);
      });
  }
}
var $a3ad08df9247543c$export$2e2bcd8739ae039 =
  new $a3ad08df9247543c$var$addressesView();

class $4cb3869cf78f7b40$var$adminMenuView extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
  _blurOverlay = document.querySelector(".blur-overlay");
  _adminMenuForm = document.querySelector(".admin-menu-form");
  _ingredientsForm = document.querySelector(".admin-menu-form-ingredients");
  _optionsForm = document.querySelector("#options-form");
  _optionsOverlay = document.querySelector(".admin-menu-options-overlay");
  _ingredientsOverlay = document.querySelector(
    ".admin-menu-ingredients-overlay"
  );
  _ingredientsDisplay = document.querySelector(
    ".admin-menu-form-big-ingredients-text"
  );
  _allOptions = document.querySelectorAll(".admin-menu-form-big-option");
  _imageInputs = document.querySelectorAll(".admin-menu-form-image-input");
  _imageContainer = document.querySelectorAll(".admin-menu-form-image");
  _ingredientsBtn = document.querySelector(".admin-menu-form-big-ingredients");
  _submitIngredientsBtn = document.querySelector(
    ".admin-menu-form-ingredients-submit"
  );
  _selectOptionsBtn = document.querySelector(
    ".admin-menu-form-big-add-options"
  );
  _optionsFormBtn = document.querySelector(".admin-menu-option-btn");
  _nameInput1 = document.querySelector(".admin-menu-form-name");
  _nameInput2 = document.querySelector(".admin-menu-form-big-name");
  _descriptionInput1 = document.querySelector(".admin-menu-form-description");
  _descriptionInput2 = document.querySelector(
    ".admin-menu-form-big-description"
  );
  _categoriesForm = document.querySelector("#categories-form");
  _categoriesOverlay = document.querySelector(".admin-menu-category-overlay");
  _categoriesFormBtn = document.querySelector(
    ".admin-menu-form-big-categories"
  );
  _categoriesFormDropdownBtn = document.querySelectorAll(
    ".admin-menu-categories-dropdown"
  );
  _categoriesSubmitBtn = document.querySelector(".admin-menu-categories-btn");
  constructor() {
    super();
    this._addHandlerUploadImage(this._changeRecipeImage.bind(this));
    this._addEventListeners();
  }
  _addEventListeners() {
    if (this._ingredientsForm) {
      this._blurOverlay.addEventListener("click", () => {
        this._hideModal(this._ingredientsOverlay);
        this._hideModal(this._optionsOverlay);
        this._hideModal(this._categoriesOverlay);
      });
      this._ingredientsBtn.addEventListener("click", (e) => {
        this._showModal(this._ingredientsOverlay);
      });
      this._selectOptionsBtn.addEventListener("click", (e) => {
        this._showModal(this._optionsOverlay);
      });
      this._categoriesFormBtn.addEventListener("click", (e) => {
        this._showModal(this._categoriesOverlay);
      });
      this._ingredientsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this._hideModal(this._ingredientsOverlay);
        const ingredients = this._getIngredients().join(", ");
        this._ingredientsDisplay.innerHTML = ingredients;
      });
      this._optionsForm.addEventListener("change", (e) => {
        const id = e.target.id.slice(8);
        if (e.target.checked) this._displayOption(id);
        else this._hideOption(id);
      });
      this._optionsFormBtn.addEventListener("click", (e) => {
        this._hideModal(this._optionsOverlay);
      });
      this._categoriesSubmitBtn.addEventListener("click", (e) => {
        this._hideModal(this._categoriesOverlay);
      });
      this._adminMenuForm.addEventListener("input", (e) => {
        this._syncInputs(e);
      });
      this._categoriesForm.addEventListener("click", (e) => {
        const btn = e.target.closest(".admin-menu-categories-dropdown");
        if (!btn) return;
        btn.querySelector("svg").classList.toggle("active");
        btn.nextSibling.classList.toggle("hidden");
      });
    }
  }
  _addHandlerUploadImage(handler) {
    if (this._imageInputs)
      this._imageInputs.forEach((input) => {
        input.addEventListener("change", (e) => {
          handler(e);
          // TODO:
          // TODO:
          this._imageInputs[0];
          console.log(this._imageInputs[1].files);
        });
      });
  }
  _changeRecipeImage(event) {
    const input = event.srcElement;
    const reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    reader.addEventListener("load", () => {
      this._imageContainer.forEach(
        (el) => (el.style.backgroundImage = `url(${reader.result})`)
      );
    });
  }
  _displayOption(id) {
    const option = document.getElementById(id);
    const options = option.querySelectorAll('input[type="text"]');
    option.classList.remove("hidden");
    options.forEach((el) => (el.required = true));
  }
  _hideOption(id) {
    const option = document.getElementById(id);
    const options = option.querySelectorAll('input[type="number"]');
    option.classList.add("hidden");
    options.forEach((el) => (el.required = false));
  }
  _syncInputs(e) {
    if (e.target === this._nameInput1) this._nameInput2.value = e.target.value;
    else if (e.target === this._nameInput2)
      this._nameInput1.value = e.target.value;
    else if (e.target === this._descriptionInput1)
      this._descriptionInput2.value = e.target.value;
    else if (e.target === this._descriptionInput2)
      this._descriptionInput1.value = e.target.value;
  }
  _getCategories() {
    const categorieInputs = this._categoriesForm.querySelectorAll(
      ".admin-menu-subcategory-input"
    );
    const categories = [];
    categorieInputs.forEach((el) => {
      if (el.checked) categories.push(el.previousSibling.innerHTML);
    });
    return categories;
  }
  _getIngredients() {
    return Array.from(this._ingredientsForm.elements)
      .filter((el) => {
        return el.value;
      })
      .map((el) => el.value);
  }
  _getOptions() {
    const selectedOptions = [];
    const data = [];
    this._allOptions.forEach((el) => {
      if (el.classList.contains("hidden")) return;
      else selectedOptions.push(el);
    });
    selectedOptions.forEach((el) => {
      const title = el.querySelector("h1").innerHTML;
      const instructions = el.querySelector("span").innerHTML;
      const type = el.dataset.config.split("-")[0];
      const required = el.dataset.config.split("-")[1];
      const name = el.dataset.config.split("-")[2];
      const needsPrice = el.dataset.config.split("-")[3];
      const errorMessage = el.dataset.errormessage;
      const options = [];
      const optionNodes = el.querySelectorAll(
        ".admin-menu-form-big-option-input"
      );
      optionNodes.forEach((input) => {
        const optionName = input.firstChild.innerHTML.split("<br>")[0];
        const description =
          input.firstChild.innerHTML.split("<br>")[1] || undefined;
        let price;
        if (input.firstChild.nextSibling)
          price = input.firstChild.nextSibling.value;
        options.push({
          optionName: optionName,
          description: description,
          price: price,
        });
      });
      data.push({
        name: name,
        title: title,
        instructions: instructions,
        type: type,
        required: required,
        errorMessage: errorMessage,
        options: options,
      });
    });
    console.log(data);
    return data;
  }
  addHandlerCreateRecipe(handler) {
    // TODO: Change serving size according to size
    if (this._adminMenuForm)
      this._adminMenuForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const categories = this._getCategories();
        const options = JSON.stringify(this._getOptions());
        const ingredients = this._getIngredients();
        const inputs = this._adminMenuForm.elements;
        const image = inputs[1].files[0] || inputs[6].files[0];
        const form = new FormData();
        form.append("name", inputs[2].value);
        form.append("price", +inputs[3].value);
        form.append("description", inputs[4].value);
        form.append("servingSize", +inputs[8].value);
        form.append("ingredients", ingredients);
        form.append("image", image);
        form.append("categories", categories);
        form.append("options", options);
        handler(form);
        // this._adminMenuForm.reset();
        inputs[1].value = null;
        inputs[6].value = null;
      });
  }
}
var $4cb3869cf78f7b40$export$2e2bcd8739ae039 =
  new $4cb3869cf78f7b40$var$adminMenuView();

class $92518c62b119910c$var$AdminMenuEdit extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
  _parentElement = document.querySelector(".admin-menu-grid");
  _blurOverlay = document.querySelector(".blur-overlay");
  _deleteConfirmModal = document.querySelector(
    ".admin-menu-edit-confirm-delete"
  );
  _deleteConfirmBtn = document.querySelector(
    ".admin-menu-edit-confirm-delete-btn"
  );
  constructor() {
    super();
    this._addEventListeners();
  }
  _addEventListeners() {
    if (document.querySelector(".admin-menu-grid")) {
      this._parentElement.addEventListener("click", (e) => {
        const deleteBtn = e.target.closest(".admin-menu-edit-delete-btn");
        if (!deleteBtn) return;
        const id = deleteBtn.dataset.id;
        this._deleteConfirmModal.querySelector("button").dataset.id = id;
        this._showModal(this._deleteConfirmModal);
      });
      this._blurOverlay.addEventListener("click", (e) => {
        this._hideModal(this._deleteConfirmModal);
      });
    }
  }
  addHandlerDeleteRecipe(handler) {
    if (this._deleteConfirmBtn)
      this._deleteConfirmBtn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this._hideModal(this._deleteConfirmModal);
        handler(id);
      });
  }
}
var $92518c62b119910c$export$2e2bcd8739ae039 =
  new $92518c62b119910c$var$AdminMenuEdit();

class $3af6e414dce22479$var$RegisterView extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
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
        N\xf3s mandamos um email para: <br />
        <b>${inputs[1].value}</b>
      </p>
      <p>Para terminar de criar sua conta abra seu email, por favor!</p>
    </div>
    `;
  }
  renderConfirmEmailNotification() {
    this._clear();
    this.render(this._generateMarkupConfirmEmail());
  }
}
var $3af6e414dce22479$export$2e2bcd8739ae039 =
  new $3af6e414dce22479$var$RegisterView();

class $6ccf7fd2bfab7c29$var$PasswordResetView extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
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
var $6ccf7fd2bfab7c29$export$2e2bcd8739ae039 =
  new $6ccf7fd2bfab7c29$var$PasswordResetView();

class $ce3d05d2d80a8870$var$EmailConfirmView extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
  _confirmEmailBtn = document.querySelector(".email-confirm-btn");
  addHandlerConfirmEmail(handler) {
    if (this._confirmEmailBtn)
      this._confirmEmailBtn.addEventListener("click", (e) => {
        const token = window.location.pathname.split("/")[2];
        handler(token);
      });
  }
}
var $ce3d05d2d80a8870$export$2e2bcd8739ae039 =
  new $ce3d05d2d80a8870$var$EmailConfirmView();

class $6699ffc95644b3e8$var$MenuView extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
  _recipeContainer = document.querySelector(".section-delivery");
  _recipeSeeMoreBtn = document.querySelector(".section-delivery-see-more");
  _recipeOptions = document.querySelector(".section-menu-options");
  _recipeOptionsForm = document.querySelector(".recipe-options");
  _recipeOptionsBuyBtn = document.querySelector(".menu-price-button-buy");
  _recipeOtionsControls = document.querySelector(".menu-price-button-controls");
  _recipeOptionsControl = document.querySelectorAll(
    ".menu-price-button-control"
  );
  _recipeOptionsQuantity = document.querySelector(
    ".menu-price-button-quantity"
  );
  _recipeImage = document.querySelector(".recipe-image");
  _recipeName = document.querySelector(".menu-recipe-name");
  _recipeServingSize = document.querySelector(".menu-recipe-serving-size");
  _recipeIngredients = document.querySelector(".menu-recipe-ingredients");
  _categoryBoxes = document.querySelectorAll(".category-box");
  _subCategoriesContainer = document.querySelector(".section-subcategories");
  constructor() {
    super();
    this._addEventListeners();
  }
  _addEventListeners() {
    if (this._recipeContainer) {
      this._recipeContainer.addEventListener("click", (e) => {
        const recipe = e.target.closest(".delivery-box");
        if (!recipe) return;
        this._showModal(this._recipeOptions);
        this._renderOptions(recipe.dataset.id);
      });
      this._blurOverlay.addEventListener("click", () => {
        this._hideModal(this._recipeOptions);
      });
      this._recipeOptionsForm.addEventListener("click", (e) => {
        const option = e.target.closest(".recipe-options-input");
        if (!option) return;
        this._calculatePrice();
      });
      this._recipeOtionsControls.addEventListener("click", (e) => {
        const btn = e.target.closest(".menu-price-button-control");
        if (!btn) return;
        if (btn.dataset.goto === "0") return;
        this._recipeOptionsQuantity.innerHTML = btn.dataset.goto;
        this._recipeOptionsQuantity.previousSibling.dataset.goto =
          this._recipeOptionsQuantity.innerHTML - 1;
        this._recipeOptionsQuantity.nextSibling.dataset.goto =
          +this._recipeOptionsQuantity.innerHTML + 1;
        this._calculatePrice(this._recipeOptionsQuantity.dataset.price);
      });
      this._recipeOptionsForm.addEventListener("invalid", (e) => {
        e.preventDefault();
        console.log("INVALIDOO");
      });
    }
  }
  _renderOptions(recipeId) {
    const recipe = this._data.recipes.find((el) => el._id === recipeId);
    this._recipeImage.firstChild.src = `./img/recipes/${
      recipe.image === "undefined" ? "default.jpg" : recipe.image
    }`;
    this._recipeName.innerHTML = recipe.name;
    this._recipeServingSize.innerHTML = recipe.servingSize;
    this._recipeIngredients.innerHTML = recipe.ingredients.join(",");
    this._recipeOptionsForm.innerHTML = this._generateOptionsMarkup(recipe);
    this._recipeOptionsQuantity.innerHTML = 1;
    this._recipeOptionsQuantity.dataset.price = recipe.price;
    this._recipeOptionsControl[0].dataset.goto = 0;
    this._recipeOptionsControl[1].dataset.goto = 2;
    this._recipeOptionsBuyBtn.dataset.id = recipe._id;
    this._calculatePrice(recipe.price);
  }
  _generateOptionsMarkup(recipe) {
    console.log(recipe);
    return recipe.options
      .map(
        (el) => `
         <div class="recipe-option" id="${el.name.replaceAll(" ", "")}-${
          recipe._id
        }" data-name="">
            <div class="recipe-options-title">
              <h1>${el.title}</h1>
              <span>${el.instructions}</span>
            </div>
            <div class="recipe-options-choices">
            ${el.options
              .map((option) => {
                let price;
                let priceLabel;
                if (option.price) {
                  price = this._convertToCurrencyBrl(option.price);
                  priceLabel = `<label for="${recipe._id}-${option.optionName}">${price}</label>`;
                } else
                  priceLabel = `<label for="${recipe._id}-${option.optionName}"></label>`;
                // =============================================
                return `
            <div class="recipe-options-input" data-price="${option.price}">
              <label for="${recipe._id}-${option.optionName}">${
                  option.optionName
                } ${
                  option.description
                    ? "<br> <span>" + option.description + "</span>"
                    : ""
                }</label>
                ${priceLabel ? priceLabel : "<label></label>"}
              <input name="${el.name}" type="${el.type}" id="${recipe._id}-${
                  option.optionName
                }" data-price="${option.price}" data-errormessage="${
                  el.errorMessage
                }" ${el.required ? "required" : ""} ${
                  option.optionName.startsWith("Pequeno") ? "checked" : ""
                }/>
            </div>
            `;
              })
              .join("")}
            </div>
          </div>
          `
      )
      .join("");
  }
  _getOrderData(id) {
    const inputs = this._recipeOptionsForm.querySelectorAll("input");
    const invalidInputs = [];
    inputs.forEach((input) => {
      if (input.validity.valid) return;
      invalidInputs.push(input);
    });
    document
      .querySelectorAll(".recipe-option-error")
      .forEach((el) => el.remove());
    if (invalidInputs.length > 0) return this._renderInputErrors(invalidInputs);
    // Order Format
    // { recipe: id, options: { optionName: choices, ... } }
    const shoppingCartItem = this._data.recipes.find((el) => el._id === id);
    shoppingCartItem.options = [];
    shoppingCartItem.price = this._calculatePrice(shoppingCartItem.price);
    shoppingCartItem.quantity = +this._recipeOptionsQuantity.innerHTML;
    const options = document.querySelectorAll(".recipe-option");
    options.forEach((el) => {
      const selectedInputs = el.querySelectorAll(
        'input[type="checkbox"]:checked, input[type="radio"]:checked'
      );
      const optionName = el.id.split("-")[0];
      const optionTitle = el
        .closest(".recipe-option")
        .querySelector("h1")
        .innerHTML.replace(":", "");
      const inputs = [];
      selectedInputs.forEach((input) => {
        inputs.push(input.id.split("-")[1]);
      });
      shoppingCartItem.options.push({
        optionTitle: optionTitle,
        [optionName]: inputs,
      });
    });
    this._data.shoppingCart.push(shoppingCartItem);
    this._hideModal(this._recipeOptions);
    return true;
  }
  _renderInputErrors(inputs) {
    inputs.forEach((input) => {
      const errorMarkup = `<span class="recipe-option-error"><b>Erro!</b>: ${input.dataset.errormessage}</span>`;
      const errorElement = input
        .closest(".recipe-option")
        .querySelector(".recipe-option-error");
      if (errorElement) errorElement.remove();
      input
        .closest(".recipe-option")
        .querySelector(".recipe-options-title")
        .insertAdjacentHTML("beforeend", errorMarkup);
    });
    inputs[0].closest(".recipe-option").scrollIntoView({
      behavior: "smooth",
    });
    return null;
  }
  _calculatePrice(basePrice) {
    const inputs = this._recipeOptionsForm.querySelectorAll("input");
    let totalPrice = 0;
    const hasSizeOption = Array.from(inputs).some((el) =>
      el.name.startsWith("Tamanhos")
    );
    if (!hasSizeOption) totalPrice += basePrice;
    inputs.forEach((input) => {
      if (!input.checked) return;
      if (input.dataset.price === "undefined") return;
      totalPrice += +input.dataset.price;
    });
    const quantity =
      this._recipeOtionsControls.firstChild.nextSibling.innerHTML;
    totalPrice *= +quantity;
    this._recipeOptionsBuyBtn.innerHTML = `COMPRE \u{2022} ${this._convertToCurrencyBrl(
      totalPrice
    )}`;
    return totalPrice;
  }
  _changeCategory(e) {
    const box = e.target.closest(".category-box");
    if (!box) return;
    this._categoryBoxes.forEach((categoryBox) =>
      categoryBox.classList.remove("category-box-active")
    );
    box.classList.add("category-box-active");
    this._subCategoriesContainer.innerHTML = "";
    if (box.dataset.name === "Tudo") return box.dataset.subcategories;
    this._renderSubcategories(box.dataset.subcategories);
    return box.dataset.subcategories;
  }
  _changeSubCategory(e) {
    const subCategory = e.target.closest(".section-subcategory");
    const subCategories = document.querySelectorAll(".section-subcategory");
    subCategories.forEach((el) => {
      el.classList.remove("section-subcategory-active");
    });
    e.target.classList.add("section-subcategory-active");
    return subCategory.dataset.subcategory;
  }
  _renderSubcategories(categories) {
    const category = categories.split(",");
    const markup = category.map((category) => {
      return `<span class="section-subcategory" data-subcategory="${category}">${category} </span>`;
    });
    const all = `<span class="section-subcategory section-subcategory-active" data-subcategory="${categories}">Tudo</span>`;
    markup.unshift(all);
    markup.forEach((el) =>
      this._subCategoriesContainer.insertAdjacentHTML("beforeend", el)
    );
  }
  _generateRecipeMarkup(data) {
    return data
      .map((el) => {
        let price = el.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        return `
        <div class="delivery-box" data-id="${el._id}">
        <div class="img-display-delivery">
            <img src="./img/recipes/${
              el.image === "undefined" ? "default.jpg" : el.image
            }" alt="${el.name}" />
        </div>

        <div class="info-recipes">
            <h4>${el.name}</h4>
            <p> ${el.description} </p>
            <h2>${price}</h2>
        </div>
        </div>
        `;
      })
      .join("");
  }
  renderRecipes(data) {
    this._data = data;
    const markup = this._generateRecipeMarkup(data.recipes);
    this._recipeContainer.innerHTML = "";
    this._recipeContainer.insertAdjacentHTML("afterbegin", markup);
  }
  renderAditionalRecipes(data) {
    this._data = data;
    const markup = this._generateRecipeMarkup(data.newRecipes);
    this._recipeContainer.insertAdjacentHTML("beforeend", markup);
    if (this._data.count > this._data.page * 10)
      this._recipeSeeMoreBtn.dataset.goto++;
    else this._recipeSeeMoreBtn.classList.add("hidden");
  }
  addRenderRecipeHandler(handler) {
    if (this._categoryBoxes)
      this._categoryBoxes.forEach((el) => {
        el.addEventListener("click", (e) => {
          const categories = this._changeCategory(e);
          const removeSpinner = this.renderLoadingSpinner(
            this._recipeContainer
          );
          handler(categories);
          removeSpinner();
        });
      });
    if (this._subCategoriesContainer)
      this._subCategoriesContainer.addEventListener("click", (e) => {
        const subCategory = this._changeSubCategory(e);
        if (!subCategory) return;
        handler(subCategory);
      });
    if (this._recipeSeeMoreBtn)
      this._recipeSeeMoreBtn.addEventListener("click", (e) => {
        handler(
          this._data.curCategories,
          false,
          this._recipeSeeMoreBtn.dataset.goto
        );
      });
    if (this._subCategoriesContainer)
      (() => {
        const removeSpinner = this.renderLoadingSpinner(this._recipeContainer);
        handler("all");
      })();
  }
  addAddToCartHandler(handler) {
    if (this._recipeOptionsBuyBtn)
      this._recipeOptionsBuyBtn.addEventListener("click", (e) => {
        const id = this._recipeOptionsBuyBtn.dataset.id;
        const isValidOrder = this._getOrderData(id);
        if (!isValidOrder) return;
        handler(this._data.shoppingCart);
      });
  }
}
var $6699ffc95644b3e8$export$2e2bcd8739ae039 =
  new $6699ffc95644b3e8$var$MenuView();

class $c6bb06a97f6fe0c2$var$ShoppingCartVeiw extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
  _shoppingCartItemContainer = document.querySelector(".pedidos-cart");
  _shoppingCartCheckOutBtn = document.querySelector(".button-buy-cart");
  renderShoppingCart(data) {
    this._data = data;
    this._shoppingCartItemContainer.innerHTML = "";
    const markup = this._generateShoppingCartMarkup(this._data);
    this._shoppingCartItemContainer.insertAdjacentHTML("beforeend", markup);
    if (data.shoppingCart.length > 0)
      this._shoppingCartCheckOutBtn.innerHTML = "Finalizar Pedido";
    else this._shoppingCartCheckOutBtn.innerHTML = "Seu Carrinho Est\xe1 Vazio";
  }
  _generateShoppingCartMarkup(data) {
    if (!data.shoppingCart.length > 0)
      return `<span>Seu carrinho est\xe1 vazio.</span>`;
    console.log(data);
    return data.shoppingCart
      .map((el) => {
        console.log(el);
        data.recipes.find;
        return `
        <div class="shopping-cart-item" data-id="${el._id}">
            <div class="shopping-cart-item-image">
                <img
                src="../img/recipes/${el.image}"
                alt="${el.name}"
                />
            </div>
    
          <div class="shopping-cart-item-info">
            <div class="shopping-cart-item-name-price">
              <p>${el.name}</p>
              <span>${this._convertToCurrencyBrl(el.price)}</span>
            </div>
            <ul class="shopping-cart-item-options">
              ${el.options.map(
                (option) =>
                  `<li><b>${option.optionTitle}:</b> ${option[
                    Object.keys(option)[1]
                  ].map((el) => `${el}`)}</li>`
              )}
              
            </ul>
          </div>
        </div>
        `;
      })
      .join("");
  }
  addCreateOrderHandler(handler) {
    if (this._shoppingCartCheckOutBtn)
      this._shoppingCartCheckOutBtn.addEventListener("click", (e) => {
        handler(this._data.shoppingCart);
      });
  }
}
var $c6bb06a97f6fe0c2$export$2e2bcd8739ae039 =
  new $c6bb06a97f6fe0c2$var$ShoppingCartVeiw();

class $d0df8bd8c301e59c$var$CheckoutInfoView extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
  _blurOverlay = document.querySelector(".blur-overlay");
  _checkoutAddressContainer = document.querySelector(".checkout-address");
  _addAddressBtn = document.querySelector(".addAdressBtn");
  _closeAddressFormBtn = document.querySelector(".close-form-btn");
  _formInputCEP = document.querySelector(".address-form-input-CEP");
  _formInputState = document.querySelector(".address-form-input-state");
  _formInputCity = document.querySelector(".address-form-input-city");
  _formInputNeighbourhood = document.querySelector(
    ".address-form-input-neighbourhood"
  );
  _formInputStreet = document.querySelector(".address-form-input-street");
  _formInputHouseNumber = document.querySelector(
    ".address-form-input-house-number"
  );
  _formInputCompliment = document.querySelector(
    ".address-form-input-compliment"
  );
  _addressForm = document.querySelector(".address-form");
  _checkoutProcceedBtn = document.querySelector(".checkout-procceed");
  constructor() {
    super();
    this._addEventListeners();
  }
  _addEventListeners() {
    if (this._checkoutAddressContainer) {
      this._blurOverlay.addEventListener("click", (e) => {
        this._hideModal(this._addressForm);
      });
      if (this._addressForm)
        this._addressForm.addEventListener("click", (e) => {
          const closeBtn = e.target.closest(".close-form-btn");
          if (closeBtn) return this._hideModal(this._addressForm);
        });
      if (this._addAddressBtn)
        this._addAddressBtn.addEventListener("click", (e) => {
          console.log("click");
          this._showModal(this._addressForm);
        });
      this._checkoutProcceedBtn.addEventListener("click", () => {
        this._createPreference();
      });
    }
  }
  addHandlerCEPFetch(handler) {
    if (this._formInputCEP)
      this._formInputCEP.addEventListener("blur", (e) => {
        e.preventDefault();
        const cep = this._formInputCEP.value.replaceAll("-", "");
        if (/^\d{8}$/.test(cep)) handler(cep, this);
      });
  }
  addCEPInfo(data) {
    this._formInputState.value = data.stateShortname;
    this._formInputCity.value = data.city;
    this._formInputNeighbourhood.value = data.district;
    this._formInputStreet.value = data.street;
  }
  addHandlerAddAddress(handler) {
    if (this._addressForm)
      this._addressForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
          residenceType: this._formInputResidenceType.value,
          CEP: this._formInputCEP.value.replace("-", ""),
          state: this._formInputState.value,
          city: this._formInputCity.value,
          neighbourhood: this._formInputNeighbourhood.value,
          street: this._formInputStreet.value,
          houseNumber: this._formInputHouseNumber.value,
          compliment: this._formInputCompliment.value,
        };
        handler(data);
      });
  }
  async _createPreference() {
    const client = new MercadoPagoConfig({
      accessToken:
        "TEST-4517457179055625-052923-f6e53e64bd1f002c8dcc78bd8fee1913-635703940",
    });
    const preference = new Preference(client);
    const body = {
      items: [
        {
          id: "1234",
          title: "Picanha",
          description:
            "Tamanho: pequeno; Prote\xednas:Mignon,bife,frango; Molho: Pomodoro ",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 150.99,
        },
        {
          id: "0",
          title: "Frete",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 8,
        },
      ],
    };
    const response = await preference
      .create({
        body: body,
      })
      .then(console.log)
      .catch(console.log);
  }
}
var $d0df8bd8c301e59c$export$2e2bcd8739ae039 =
  new $d0df8bd8c301e59c$var$CheckoutInfoView();

class $875300df668b24a8$var$checkoutCreditCardView extends (0,
$7e0517535d5352f3$export$2e2bcd8739ae039) {
  _creditCardFormContainer = document.querySelector(
    ".checkout-credit-card-form-container"
  );
  constructor() {
    super();
    this._init();
  }
  async _init() {
    if (this._creditCardFormContainer) {
      //   await loadMercadoPago();
      const mp = new window.MercadoPago(
        "TEST-decd35ff-fe9e-420d-adc4-d0fc9879a078"
      );
      const cardForm = mp.cardForm({
        amount: "100.5",
        iframe: true,
        form: {
          id: "form-checkout",
          cardNumber: {
            id: "form-checkout__cardNumber",
            placeholder: "N\xfamero do cart\xe3o",
          },
          expirationDate: {
            id: "form-checkout__expirationDate",
            placeholder: "MM/YY",
          },
          securityCode: {
            id: "form-checkout__securityCode",
            placeholder: "C\xf3digo de seguran\xe7a",
          },
          cardholderName: {
            id: "form-checkout__cardholderName",
            placeholder: "Titular do cart\xe3o",
          },
          issuer: {
            id: "form-checkout__issuer",
            placeholder: "Banco emissor",
          },
          installments: {
            id: "form-checkout__installments",
            placeholder: "Parcelas",
          },
          identificationType: {
            id: "form-checkout__identificationType",
            placeholder: "Tipo de documento",
          },
          identificationNumber: {
            id: "form-checkout__identificationNumber",
            placeholder: "N\xfamero do documento",
          },
          cardholderEmail: {
            id: "form-checkout__cardholderEmail",
            placeholder: "E-mail",
          },
        },
        callbacks: {
          onFormMounted: (error) => {
            if (error)
              return console.warn("Form Mounted handling error: ", error);
            console.log("Form mounted");
          },
          onSubmit: (event) => {
            event.preventDefault();
            const {
              paymentMethodId: payment_method_id,
              issuerId: issuer_id,
              cardholderEmail: email,
              amount: amount,
              token: token,
              installments: installments,
              identificationNumber: identificationNumber,
              identificationType: identificationType,
            } = cardForm.getCardFormData();
            fetch(``, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: token,
                issuer_id: issuer_id,
                payment_method_id: payment_method_id,
                transaction_amount: Number(amount),
                installments: Number(installments),
                description: "Descri\xe7\xe3o do produto",
                payer: {
                  email: email,
                  identification: {
                    type: identificationType,
                    number: identificationNumber,
                  },
                },
              }),
            });
          },
          onFetching: (resource) => {
            console.log("Fetching resource: ", resource);
            // Animate progress bar
            const progressBar = document.querySelector(".progress-bar");
            progressBar.removeAttribute("value");
            return () => {
              progressBar.setAttribute("value", "0");
            };
          },
        },
      });
    }
  }
}
var $875300df668b24a8$export$2e2bcd8739ae039 =
  new $875300df668b24a8$var$checkoutCreditCardView();

("use strict");
console.log((0, $jVhuh$mercadopago));
//TODO: Do better testing for errors adter adding toaster
//TODO:Pagina meus pedidos
//TODO:Painel admin : manejar receitas, manejar usuarios
//TODO: Export accout navigation into its own pug template
//TODO:Check if every eventListener has an if conditional, so it doesn't keep throwing erros
const $7fa7420c36f2b85c$var$loginController = async function (email, password) {
  try {
    // Send login request
    await $470b6aa9041e5638$export$7b79da20e2a51e08(email, password);
    (0, $0324854ac3a14cf9$export$2e2bcd8739ae039).renderSuccessIcon();
    (0, $37ad537dd3e87e13$export$da22d4a5076a7905)(1.5);
    //reload page
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$logoutController = async function () {
  try {
    await $470b6aa9041e5638$export$f8bc10b856805210();
    location.assign("/");
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$updateUserController = async function (data, type) {
  try {
    if (type === "password")
      (0, $fd8e1dcbcad580f9$export$2e2bcd8739ae039).changePasswordBtnText(
        "Atualizando ..."
      );
    else
      (0, $fd8e1dcbcad580f9$export$2e2bcd8739ae039).changeInfoBtnText(
        "Atualizando ..."
      );
    await $470b6aa9041e5638$export$8e9e0bdc826b242c(data, type);
    (0, $fd8e1dcbcad580f9$export$2e2bcd8739ae039).clearPasswordInputFields();
    if (type === "password")
      (0, $fd8e1dcbcad580f9$export$2e2bcd8739ae039).changePasswordBtnText(
        "Salvar Senha"
      );
    else
      (0, $fd8e1dcbcad580f9$export$2e2bcd8739ae039).changeInfoBtnText(
        "Salvar Configura\xe7\xf5es"
      );
    //TODO: Render success toast notification
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)(
      "success",
      "Configura\xe7\xf5es salvas com \xeaxito"
    );
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
    (0, $fd8e1dcbcad580f9$export$2e2bcd8739ae039).clearPasswordInputFields();
    if (type === "password")
      (0, $fd8e1dcbcad580f9$export$2e2bcd8739ae039).changePasswordBtnText(
        "Salvar Senha"
      );
    else
      (0, $fd8e1dcbcad580f9$export$2e2bcd8739ae039).changeInfoBtnText(
        "Salvar Configura\xe7\xf5es"
      );
  }
};
const $7fa7420c36f2b85c$var$addAddressController = async function (data) {
  try {
    await $470b6aa9041e5638$export$88246c25250c6147(data);
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)(
      "success",
      "Endere\xe7o adicionado com sucesso"
    );
    (0, $37ad537dd3e87e13$export$da22d4a5076a7905)(1.5);
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$CEPFetchController = async function (
  cep,
  currentView
) {
  try {
    const data = await $470b6aa9041e5638$export$478bae29a2ce7b6d(cep);
    currentView.addCEPInfo(data.result);
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
    console.log(err);
  }
};
const $7fa7420c36f2b85c$var$deleteAddressController = async function (id) {
  try {
    await $470b6aa9041e5638$export$1385536c13345b0c(id);
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)(
      "success",
      "Endere\xe7o deletado com sucesso"
    );
    (0, $37ad537dd3e87e13$export$da22d4a5076a7905)(1.5);
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$addRecipeController = async function (data) {
  try {
    await $470b6aa9041e5638$export$eaeb5d9f844f32d7(data);
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)(
      "success",
      "Receita Criada com sucesso!"
    );
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$deleteRecipeController = async function (id) {
  try {
    await $470b6aa9041e5638$export$52b5cb58c5cddd9f(id);
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)(
      "success",
      "Prato deletado com sucesso"
    );
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$resetPasswordcontroller = async function (
  token,
  password,
  passwordConfirm
) {
  try {
    await $470b6aa9041e5638$export$20c25ccb8e603fb9(
      token,
      password,
      passwordConfirm
    );
    location.assign("/");
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$signUpController = async function (data) {
  try {
    await $470b6aa9041e5638$export$553a7d2e29b97358(data);
    (0,
    $3af6e414dce22479$export$2e2bcd8739ae039).renderConfirmEmailNotification();
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$confirmEmailController = async function (token) {
  try {
    await $470b6aa9041e5638$export$aa06f30a5c9809a8(token);
    location.assign("/");
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$sendForgotPasswordEmailController = async function (
  email
) {
  try {
    await $470b6aa9041e5638$export$24531cc2aa925809(email);
    (0, $65096c09685f8a3f$export$2e2bcd8739ae039).renderSendEmailNotification();
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$renderRecipesController = async function (
  categories,
  count = true,
  page = 1
) {
  try {
    await $470b6aa9041e5638$export$a9fe710f565dd9e3(categories, count, page);
    if (count)
      (0, $6699ffc95644b3e8$export$2e2bcd8739ae039).renderRecipes(
        $470b6aa9041e5638$export$ca000e230c0caa3e
      );
    else
      (0, $6699ffc95644b3e8$export$2e2bcd8739ae039).renderAditionalRecipes(
        $470b6aa9041e5638$export$ca000e230c0caa3e
      );
  } catch (err) {
    console.log(err);
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$addToCartController = function (data) {
  $470b6aa9041e5638$export$ca000e230c0caa3e.shoppingCart = data;
  console.log($470b6aa9041e5638$export$ca000e230c0caa3e);
  localStorage.setItem(
    "shoppingCart",
    JSON.stringify($470b6aa9041e5638$export$ca000e230c0caa3e.shoppingCart)
  );
};
const $7fa7420c36f2b85c$var$getShoppingCartFromLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem("shoppingCart"));
  if (!data) return;
  $470b6aa9041e5638$export$ca000e230c0caa3e.shoppingCart = data;
};
const $7fa7420c36f2b85c$var$renderShoppingCartController = async function () {
  try {
    (0, $c6bb06a97f6fe0c2$export$2e2bcd8739ae039).renderShoppingCart(
      $470b6aa9041e5638$export$ca000e230c0caa3e
    );
  } catch (err) {
    throw err;
  }
};
const $7fa7420c36f2b85c$var$createOrderController = async function (
  shoppingCartData
) {
  try {
    await $470b6aa9041e5638$export$d76e4008e1dbce56(shoppingCartData);
  } catch (err) {
    (0, $37ad537dd3e87e13$export$2d13f4f324548872)("error", err.message);
  }
};
const $7fa7420c36f2b85c$var$init = function () {
  $7fa7420c36f2b85c$var$getShoppingCartFromLocalStorage();
  (0, $0324854ac3a14cf9$export$2e2bcd8739ae039).addHandlerLogin(
    $7fa7420c36f2b85c$var$loginController
  );
  (0, $65096c09685f8a3f$export$2e2bcd8739ae039).addLogoutHandler(
    $7fa7420c36f2b85c$var$logoutController
  );
  (0,
  $65096c09685f8a3f$export$2e2bcd8739ae039).addSendResetPasswordEmailHandler(
    $7fa7420c36f2b85c$var$sendForgotPasswordEmailController
  );
  (0, $fd8e1dcbcad580f9$export$2e2bcd8739ae039).addHandlerUpdateUser(
    $7fa7420c36f2b85c$var$updateUserController
  );
  (0, $fd8e1dcbcad580f9$export$2e2bcd8739ae039).addHandlerUpdatePassword(
    $7fa7420c36f2b85c$var$updateUserController
  );
  (0, $a3ad08df9247543c$export$2e2bcd8739ae039).addHandlerCEPFetch(
    $7fa7420c36f2b85c$var$CEPFetchController
  );
  (0, $d0df8bd8c301e59c$export$2e2bcd8739ae039).addHandlerCEPFetch(
    $7fa7420c36f2b85c$var$CEPFetchController
  );
  (0, $a3ad08df9247543c$export$2e2bcd8739ae039).addHandlerDeleteAddress(
    $7fa7420c36f2b85c$var$deleteAddressController
  );
  (0, $a3ad08df9247543c$export$2e2bcd8739ae039).addHandlerAddAddress(
    $7fa7420c36f2b85c$var$addAddressController
  );
  (0, $d0df8bd8c301e59c$export$2e2bcd8739ae039).addHandlerAddAddress(
    $7fa7420c36f2b85c$var$addAddressController
  );
  (0, $4cb3869cf78f7b40$export$2e2bcd8739ae039).addHandlerCreateRecipe(
    $7fa7420c36f2b85c$var$addRecipeController
  );
  (0, $92518c62b119910c$export$2e2bcd8739ae039).addHandlerDeleteRecipe(
    $7fa7420c36f2b85c$var$deleteRecipeController
  );
  (0, $6ccf7fd2bfab7c29$export$2e2bcd8739ae039).addHandlerResetPassword(
    $7fa7420c36f2b85c$var$resetPasswordcontroller
  );
  (0, $3af6e414dce22479$export$2e2bcd8739ae039).addHandlerSignUp(
    $7fa7420c36f2b85c$var$signUpController
  );
  (0, $ce3d05d2d80a8870$export$2e2bcd8739ae039).addHandlerConfirmEmail(
    $7fa7420c36f2b85c$var$confirmEmailController
  );
  (0, $6699ffc95644b3e8$export$2e2bcd8739ae039).addRenderRecipeHandler(
    $7fa7420c36f2b85c$var$renderRecipesController
  );
  (0, $6699ffc95644b3e8$export$2e2bcd8739ae039).addAddToCartHandler(
    $7fa7420c36f2b85c$var$addToCartController
  );
  (0, $65096c09685f8a3f$export$2e2bcd8739ae039).addHadlerRenderShoppingCart(
    $7fa7420c36f2b85c$var$renderShoppingCartController
  );
  (0, $c6bb06a97f6fe0c2$export$2e2bcd8739ae039).addCreateOrderHandler(
    $7fa7420c36f2b85c$var$createOrderController
  );
};
$7fa7420c36f2b85c$var$init();

//# sourceMappingURL=controller.js.map
