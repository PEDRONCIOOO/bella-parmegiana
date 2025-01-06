import View from "./View.js";

class CheckoutInfoView extends View {
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

  _checkOutRetrieve = document.querySelector("#checkout-retrieve");
  _checkOutDelivery = document.querySelector("#checkout-delivery");

  _userAddresses = document.querySelector(".checkout-choose-address-form");
  _guestAddressForm = document.querySelector(".checkout-address-form");

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

      if (this._addressForm) {
        this._addressForm.addEventListener("click", (e) => {
          const closeBtn = e.target.closest(".close-form-btn");
          if (closeBtn) return this._hideModal(this._addressForm);
        });

        this._addAddressBtn.addEventListener("click", (e) => {
          this._showModal(this._addressForm);
        });

        this._checkOutRetrieve.addEventListener("click", (e) => {
          this._hideModal(this._userAddresses);
        });
        this._checkOutDelivery.addEventListener("click", (e) => {
          this._userAddresses.classList.remove("hidden");
        });
      }
      if (this._guestAddressForm) {
        this._checkOutRetrieve.addEventListener("click", (e) => {
          this._hideModal(this._guestAddressForm);
        });
        this._checkOutDelivery.addEventListener("click", (e) => {
          this._guestAddressForm.classList.remove("hidden");
        });
      }
    }
  }

  addHandlerCEPFetch(handler) {
    if (this._formInputCEP)
      this._formInputCEP.addEventListener("blur", (e) => {
        e.preventDefault();
        const cep = this._formInputCEP.value.replaceAll("-", "");

        if (/^\d{8}$/.test(cep)) {
          handler(cep, this);
        }
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

  _getAddressInfo() {
    if (this._userAddresses) {
      const address = Array.from(this._userAddresses.elements).find(
        (el) => el.checked
      );
      if (!address) return false;

      return address.id;
    }

    const formData = this._guestAddressForm.elements;
    return {
      residenceType: formData[0].value,
      CEP: formData[1].value.replace("-", ""),
      state: formData[2].value,
      city: formData[3].value,
      neighbourhood: formData[4].value,
      street: formData[5].value,
      houseNumber: formData[6].value,
      compliment: formData[7].value,
    };
    // TODO: pegar endereço do formulario para guest
  }

  addCreateOrderHandler(handler) {
    if (this._checkoutProcceedBtn)
      this._checkoutProcceedBtn.addEventListener("click", () => {
        let address;
        if (this._checkOutDelivery.checked) address = this._getAddressInfo();
        if (this._checkOutRetrieve.checked) address = "retirada";

        const orderToken = window.location.pathname.split("/")[2];
        handler(orderToken, address);
      });
  }
}

export default new CheckoutInfoView();
