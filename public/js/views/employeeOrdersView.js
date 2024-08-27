import socketIoClient from "https://cdn.jsdelivr.net/npm/socket.io-client@4.7.5/+esm";

import View from "./View.js";

class employeeOrdersView extends View {
  _currentOrders = "ativos";

  _orderNav = document.querySelector(".order-overview");
  _orderInfo = document.querySelector(".order-info");
  _orderRecipesInfo = document.querySelector(".order-recipes-info");
  _cancelOrderModal = document.querySelector(".order-confirm-cancel");

  constructor() {
    super();
    this._initSocket();
    this._addEventListeners();
  }

  _initSocket() {
    if (this._orderNav) {
      const socket = socketIoClient();

      socket.on("newOrder", (order) => {
        this._data.push(order);
        this.renderOrders();
      });
    }
  }

  _addEventListeners() {
    if (this._orderNav) {
      this._orderNav.addEventListener("click", (e) => {
        if (e.target.closest(".order-preview"))
          this.renderOderInfo(e.target.closest(".order-preview").dataset.id);

        if (e.target.closest(".order-ativos")) {
          this._currentOrders = "ativos";
          this.renderOrders();
        }
        if (e.target.closest(".order-completos")) {
          this._currentOrders = "completos";
          this.renderOrders();
        }
      });

      this._orderInfo.addEventListener("click", (e) => {
        if (e.target.closest(".arrow-request-hide"))
          this._toggleOrderRecipeInfo();
        if (e.target.closest(".arrow-hide"))
          this._toggleOrderRecipeOptions(e.target);
        if (e.target.closest(".order-blur-overlay")) {
          this._hideCancelOrderModal();
          this._hideDetailsModal();
        }
        if (e.target.closest(".order-detail-person")) this._showDetailsModal();
        if (e.target.closest(".order-close-btn")) this._hideDetailsModal();
        if (e.target.closest(".order-deny-order")) this._showCancelOrderModal();
        if (e.target.closest(".order-cancel-close-btn"))
          this._hideCancelOrderModal();
      });
    }
  }

  _showCancelOrderModal() {
    document.querySelector(".order-confirm-cancel").classList.remove("hidden");
    document.querySelector(".order-blur-overlay").classList.remove("hidden");
  }
  _hideCancelOrderModal() {
    document.querySelector(".order-confirm-cancel").classList.add("hidden");
    document.querySelector(".order-blur-overlay").classList.add("hidden");
  }
  _showDetailsModal() {
    document.querySelector(".order-detailed-client").classList.remove("hidden");
    document.querySelector(".order-blur-overlay").classList.remove("hidden");
  }

  _hideDetailsModal() {
    document.querySelector(".order-detailed-client").classList.add("hidden");
    document.querySelector(".order-blur-overlay").classList.add("hidden");
  }

  _toggleOrderRecipeInfo() {
    document.querySelector(".order-recipes-info").classList.toggle("active");
  }

  _toggleOrderRecipeOptions(element) {
    element
      .closest(".order-recipe-name")
      .nextElementSibling.classList.toggle("active");
  }

  _generateOrdersMarkup() {
    return (
      `
      <div class="order-overview-nav">
        <span class="hover-underline order-ativos ${
          this._currentOrders === "ativos" ? "active" : ""
        }"><span class="span">Pedidos Ativos</span></span>
        <span class="hover-underline order-completos ${
          this._currentOrders === "completos" ? "active" : ""
        }">Pedidos Concluídos</span>
      </div>
    ` +
      this._data
        .sort((a, b) => {
          return new Date(b.orderedAt) - new Date(a.orderedAt);
        })
        .filter((el) => {
          if (this._currentOrders === "ativos")
            return (
              el.status !== "retirado" &&
              el.status !== "entregue" &&
              el.status !== "cancelado"
            );
          return (
            el.status === "retirado" ||
            el.status === "entregue" ||
            el.status === "cancelado"
          );
        })
        .map((el) => {
          const date = new Date(el.orderedAt);

          const hours = date.getHours();
          const minutes = `${date.getMinutes()}`.padStart(2, "0");
          const day = `${date.getDate()}`.padStart(2, "0");
          const month = `${date.getMonth() + 1}`.padStart(2, "0");

          return `
    <div class="order-preview" data-id="${el._id}">
      <span class="order-type">${el.deliveryMethod}</span>
      <svg class="order-icon">
        <use xlink:href="/img/icons.svg#icon-${el.deliveryMethod}"></use>
      </svg>
      <span class="order-id">${el._id}</span>
      <span class="order-name">${el.user.name}</span>
      <span class="order-time">${day}/${month} ${hours}:${minutes} </span>
      <span class="order-status order-status-${el.status.replaceAll(
        " ",
        ""
      )}">${el.status}</span>
      <span class="order-price">${el.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}</span>
    </div>
    `;
        })
        .join("")
    );
  }

  _generateOrderInfoMarkup(order) {
    const date = new Date(order.orderedAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    let nextStatus;
    if (order.deliveryMethod === "retirada" && order.status === "aguardando")
      nextStatus = "retirado";
    else if (order.status === "aguardando") nextStatus = "em trânsito";
    else if (order.status === "em trânsito") nextStatus = "entregue";
    else if (order.status === "retirado" || order.status === "entregue")
      nextStatus = "aguardando";

    return `
      <div class="order-blur-overlay hidden"></div>
      <div class="order-detailed-client hidden">
        <div class="order-detailed-client-wrapper">
          <svg class="order-close-btn">
            <use xlink:href="/img/icons.svg#icon-close"></use>
          </svg>
          <div class="order-client-information">
            <span class="title-txt-big">Sobre o Cliente</span
            ><span>CLIENTE: Pedro Forte</span
            ><span>E-MAIL: pedroforte1911@gmail.com</span
            ><span>TELEFONE: (67) 99971-0088</span>
          </div>
          <div class="order-client-about-address">
            <span class="title-txt-big">Sobre a Entrega</span>
            <span>ENDERE&Ccedil;O: Rua Jos&eacute; Alencar, 207</span>
            <span>REGI&Atilde;O: Jardim Paulista, Dourados - MS</span>
            <span>CEP: 79830-170</span><span>&Aacute;REA DE ENTREGA: 5 km</span>
            <span>TAXA DE ENTREGA: R$ 13,00</span>
            <span>PREVIS&Atilde;O DE ENTREGA: 06/06/2024 20:47</span>
          </div>
        </div>
      </div>

      <div class="order-description">
        <div class="order-pedido">
          <span class="title-order"
            >Pedido #${order._id}
            <span class="order-situation order-status-${order.status.replaceAll(
              " ",
              ""
            )}">${order.status}</span>
          </span>
          <a class="icon-whatsapp" target="_blank" href="https://wa.me/${
            order.user.phoneNumber
          }">
            <svg>
              <use xlink:href="/img/icons.svg#icon-whatsapp"></use>
              </svg>
              </a>
        </div>
        <div class="order-buttons-action">
          <button class="order-check-order ${
            order.status === "cancelado"
              ? "inactive"
              : nextStatus === "aguardando"
              ? "inactive"
              : ""
          }" data-id="${order._id}">${
      order.status === "cancelado"
        ? "PEDIDO FOI CANCELADO"
        : nextStatus === "aguardando"
        ? "VOLTAR PARA :"
        : "MARCAR COMO :"
    } ${order.status === "cancelado" ? "" : nextStatus}</button>
    ${
      order.status === "cancelado"
        ? ""
        : `<button class="order-deny-order">CANCELAR PEDIDO</button>`
    }
          
          <div class="order-confirm-cancel hidden">
          Confirmar Cancelamento?
            <svg class="order-cancel-close-btn">
              <use xlink:href="/img/icons.svg#icon-close"></use>
            </svg>
            Isso irá reembolsar o cliente.
            <button class="order-cancel-btn" data-id="${
              order._id
            }">Confirmar </button>
          </div>
        </div>
        <div class="order-client-info">
          <span> <b>CLIENTE: </b>${
            order.user.name
          }</span> <span>${date.toLocaleDateString(
      "pt-BR"
    )} ${hours}:${minutes}</span>
        </div>
        <div class="order-client-adress">
          <span> <b>ENDERE&Ccedil;O: </b>${order.address.street}, ${
      order.address.houseNumber
    }</span>
          <span> </span>
          <button class="order-detail-person">DETALHES</button>
        </div>
      </div>
      <div class="order-recipes">
        <div class="order-information-request">
          <svg class="arrow-request-hide">
            <use xlink:href="/img/icons.svg#icon-arrow-down"></use>
          </svg>
          <span>Qtd.</span>
          <span>Items</span>
          <span>Pre&ccedil;o</span>
        </div>
        <div class="order-recipes-info active">
          ${this._generateOrderRecipesMarkup(order)}

          <div class="order-total-price"><span>TOTAL</span><span>${this._convertToCurrencyBrl(
            order.price
          )}</span></div>
        </div>
      </div>
    `;
  }

  _generateOrderRecipesMarkup(order) {
    return order.order
      .map(
        (recipe) => `
      <span class="order-recipe-info-quantity">${recipe.quantity}</span>
      <div class="order-recipe-description">
        <span class="order-recipe-name">${recipe.name}
          <svg class="arrow-hide">
            <use xlink:href="/img/icons.svg#icon-arrow-down"></use>
          </svg>
        </span>
        <div class="order-recipe-options active">
          ${recipe.options
            .map(
              (option) => `
            <span>${option.optionTitle}</span>
            ${option.options
              .map(
                (subOption) => `
            <span>- ${subOption.optionName} ${
                  subOption.price
                    ? `(${this._convertToCurrencyBrl(subOption.price)})`
                    : ""
                }</span>
            `
              )
              .join("")}
            `
            )
            .join("")}
        </div>
      </div>
      <span class="order-recipe-price">${this._convertToCurrencyBrl(
        recipe.price
      )}</span>
      `
      )
      .join("");

    // <span class="order-recipe-info-quantity">1</span>
    //     <div class="order-recipe-description">
    //       <span class="order-recipe-name">Mignon a Parmegiana Tradicional
    //         <svg>
    //           <use xlink:href="/img/icons.svg#icon-arrow-down"></use>
    //         </svg>
    //       </span>
    //       <div class="order-recipe-options">
    //         <span>Grelhado ou Empanado</span>
    //         <span>- Empanado</span>
    //         <span>Adicionais</span>
    //         <span>- Arroz</span>
    //         <span>- Batata Fritas</span>
    //         <span>Tamanho</span>
    //         <span>- Pequeno</span>
    //       </div>
    //     </div>
    //     <span class="order-recipe-price">R$ 71,00</span>
  }

  renderOderInfo(id) {
    const order = this._data.find((el) => el._id === id);

    const markup = this._generateOrderInfoMarkup(order);

    this._orderInfo.innerHTML = "";

    this._orderInfo.insertAdjacentHTML("afterbegin", markup);
  }

  renderOrders(data) {
    if (data) this._data = data;
    const markup = this._generateOrdersMarkup();

    this._orderNav.innerHTML = "";

    this._orderNav.insertAdjacentHTML("beforeend", markup);
  }

  addInitOrdersHandler(handler) {
    if (this._orderNav) handler();
  }

  addUpdateOrderHandler(handler) {
    if (this._orderInfo)
      this._orderInfo.addEventListener("click", (e) => {
        const updateStatusBtn = e.target.closest(".order-check-order");
        if (!updateStatusBtn) return;
        handler(updateStatusBtn.dataset.id);
      });
  }
  addCancelOrderHandler(handler) {
    if (this._orderInfo)
      this._orderInfo.addEventListener("click", (e) => {
        const cancelOrderBtn = e.target.closest(".order-cancel-btn");
        if (!cancelOrderBtn) return;
        handler(cancelOrderBtn.dataset.id);
      });
  }
}

export default new employeeOrdersView();
