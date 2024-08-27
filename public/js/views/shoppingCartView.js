import View from "./View.js";

class ShoppingCartVeiw extends View {
  _shoppingCartItemContainer = document.querySelector(".pedidos-cart");
  _shoppingCartCheckOutBtn = document.querySelector(".button-buy-cart");

  _shoppingCartTotalPrice = document.querySelector(".valores-totais");

  constructor() {
    super();
    this._addEventListeners();
  }

  _addEventListeners() {
    if (this._shoppingCartItemContainer) {
      this._shoppingCartItemContainer.addEventListener("click", (e) => {
        const closeBtn = e.target.closest(".shopping-cart-remove");
        if (!closeBtn) return;
        const shoppingCartItem = closeBtn.closest(".shopping-cart-item");

        this._data.shoppingCart.splice(shoppingCartItem.dataset.index, 1);
        shoppingCartItem.remove();

        this.renderShoppingCart(this._data);

        document.querySelector(".cart-count").innerHTML = this._data
          .shoppingCart.length
          ? this._data.shoppingCart.length
          : "";

        localStorage.setItem(
          "shoppingCart",
          JSON.stringify(this._data.shoppingCart)
        );
      });
    }
  }

  clearShoppingCart() {
    if (!document.querySelector(".checkout-finish-wrapper")) return;

    localStorage.removeItem("shoppingCart");
  }

  renderShoppingCart(data) {
    this._data = data;

    this._shoppingCartItemContainer.innerHTML = "";

    const markup = this._generateShoppingCartMarkup(this._data);

    const totalPrice = this._calculateTotalPrice();

    this._shoppingCartItemContainer.insertAdjacentHTML("beforeend", markup);

    if (data.shoppingCart.length > 0) {
      this._shoppingCartCheckOutBtn.innerHTML = "Finalizar Pedido";
      this._shoppingCartTotalPrice.firstChild.innerHTML =
        this._convertToCurrencyBrl(totalPrice);
    } else {
      this._shoppingCartCheckOutBtn.innerHTML = "Seu Carrinho Está Vazio";
      this._shoppingCartTotalPrice.firstChild.innerHTML =
        this._convertToCurrencyBrl(0);
      this._shoppingCartTotalPrice.lastChild.innerHTML =
        this._convertToCurrencyBrl(0);
    }
  }

  _generateShoppingCartMarkup(data) {
    if (!data.shoppingCart.length > 0)
      return `<span>Seu carrinho está vazio.</span>`;

    return data.shoppingCart
      .map((el, index) => {
        data.recipes.find;
        return `
        <div class="shopping-cart-item" data-id="${
          el._id
        }" data-index="${index}">
            <svg class="shopping-cart-remove">
              <use href="/img/icons.svg#icon-close"></use>
            </svg>
            <div class="shopping-cart-item-image">
                <img
                src="../img/recipes/${
                  el.image === "undefined" ? "default.jpg" : el.image
                }"
                alt="${el.name}"
                />
            </div>
    
          <div class="shopping-cart-item-info">
            <div class="shopping-cart-item-name-price">
              <p>${el.name}</p>
              <span>${this._convertToCurrencyBrl(el.price)}</span>
            </div>
            <ul class="shopping-cart-item-options">
            <li><b>Quantidade:</b>${el.quantity}</li>
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

  _calculateTotalPrice() {
    return this._data.shoppingCart.reduce((acc, cur) => (acc += cur.price), 0);
  }

  addCreateOrderInfoHandler(handler) {
    if (this._shoppingCartCheckOutBtn)
      this._shoppingCartCheckOutBtn.addEventListener("click", (e) => {
        if (this._data.shoppingCart.length === 0) return;

        handler(this._data.shoppingCart);
      });
  }
}

export default new ShoppingCartVeiw();
