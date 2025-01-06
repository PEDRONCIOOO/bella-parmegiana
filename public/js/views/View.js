export default class View {
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
