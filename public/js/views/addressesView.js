import View from "./View.js";

class addressesView extends View {
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

      this._addressForm.addEventListener("click", (e) => {
        if (e.target.closest(".close-form-btn"))
          this._hideModal(this._addressForm);
      });
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

  addHandlerDeleteAddress(handler) {
    if (this._deleteAddressConfirmBtn)
      this._deleteAddressConfirmBtn.addEventListener("click", function (e) {
        const id = e.target.dataset.id;
        handler(id);
      });
  }
}

export default new addressesView();
