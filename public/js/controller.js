"use strict";

import { reloadPage, renderNotification } from "./helpers.js";
import * as model from "./model.js";
import loginView from "./views/loginView.js";
import navView from "./views/navView.js";
import accountView from "./views/accountView.js";
import addressesView from "./views/addressesView.js";
import adminMenuView from "./views/adminMenuView.js";
import adminMenuEditView from "./views/adminMenuEditView.js";
import registerView from "./views/registerView.js";
import resetPasswordView from "./views/resetPasswordView.js";
import emailConfirmView from "./views/emailConfirmView.js";
import menuView from "./views/menuView.js";
import shoppingCartView from "./views/shoppingCartView.js";
import checkoutInfoView from "./views/checkoutInfoView.js";
import employeeOrdersView from "./views/employeeOrdersView.js";
import checkoutPaymentView from "./views/checkoutPaymentView.js";
import animationView from "./views/animationView.js";

//TODO: Do better testing for errors adter adding toaster

//TODO:Pagina meus pedidos
//TODO:Painel admin : manejar receitas, manejar usuarios

//TODO: Export accout navigation into its own pug template
//TODO:Check if every eventListener has an if conditional, so it doesn't keep throwing erros

const loginController = async function (email, password) {
  try {
    // Send login request

    await model.sendLoginRequest(email, password);

    loginView.renderSuccessIcon();

    reloadPage(1.5);

    //reload page
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const logoutController = async function () {
  try {
    await model.sendLogoutRequest();

    location.assign("/");
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const updateUserController = async function (data, type) {
  try {
    if (type === "password")
      accountView.changePasswordBtnText("Atualizando ...");
    else accountView.changeInfoBtnText("Atualizando ...");

    await model.sendUpdateUserRequest(data, type);

    accountView.clearPasswordInputFields();
    if (type === "password") accountView.changePasswordBtnText("Salvar Senha");
    else accountView.changeInfoBtnText("Salvar Configurações");

    //TODO: Render success toast notification
    renderNotification("success", "Configurações salvas com êxito");
  } catch (err) {
    renderNotification("error", err.message);
    accountView.clearPasswordInputFields();
    if (type === "password") accountView.changePasswordBtnText("Salvar Senha");
    else accountView.changeInfoBtnText("Salvar Configurações");
  }
};

const addAddressController = async function (data) {
  try {
    await model.sendAddAdressRequest(data);

    renderNotification("success", "Endereço adicionado com sucesso");

    reloadPage(1.5);
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const CEPFetchController = async function (cep, currentView) {
  try {
    const data = await model.fetchCEPinfo(cep);

    currentView.addCEPInfo(data.result);
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const deleteAddressController = async function (id) {
  try {
    await model.sendDeleteAddressRequest(id);

    renderNotification("success", "Endereço deletado com sucesso");

    reloadPage(1.5);
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const addRecipeController = async function (data) {
  try {
    await model.sendCreateRecipeRequest(data);

    renderNotification("success", "Receita Criada com sucesso!");
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const deleteRecipeController = async function (id) {
  try {
    await model.sendDeleteRecipeRequest(id);

    renderNotification("success", "Prato deletado com sucesso");
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const resetPasswordcontroller = async function (
  token,
  password,
  passwordConfirm
) {
  try {
    await model.sendResetPasswordRequest(token, password, passwordConfirm);

    location.assign("/");
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const signUpController = async function (data) {
  try {
    await model.sendSignUpRequest(data);

    registerView.renderConfirmEmailNotification();
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const confirmEmailController = async function (token) {
  try {
    await model.sendConfirmEmailRequest(token);

    location.assign("/");
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const sendForgotPasswordEmailController = async function (email) {
  try {
    await model.sendForgotPasswordEmailRequest(email);

    navView.renderSendEmailNotification();
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const renderRecipesController = async function (
  categories,
  count = true,
  page = 1
) {
  try {
    await model.sendRequestGetRecipes(categories, count, page);

    if (count) menuView.renderRecipes(model.state);
    else menuView.renderAditionalRecipes(model.state);
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const getShoppingCartFromLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem("shoppingCart"));
  if (!data) return;
  model.state.shoppingCart = data;

  document.querySelector(".cart-count").innerHTML = data.length
    ? data.length
    : "";
};

const addToCartController = function (data) {
  model.state.shoppingCart = data;

  document.querySelector(".cart-count").innerHTML = data.length
    ? data.length
    : "";

  localStorage.setItem(
    "shoppingCart",
    JSON.stringify(model.state.shoppingCart)
  );
};

const renderShoppingCartController = async function () {
  try {
    shoppingCartView.renderShoppingCart(model.state);
  } catch (err) {
    throw err;
  }
};

const createOrderController = async function (shoppingCartData) {
  try {
    const res = await model.sendCreateOrderRequest(shoppingCartData);

    location.assign(`/checkout/${res.token}`);
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const createPreferenceController = async function (orderToken, address) {
  try {
    if (!address)
      return renderNotification("error", "Por favor nos diga o endereço");

    const res = await model.sendCreatePreferenceRequest(orderToken, address);

    location.assign(`/checkout-payment/${res.idToken}`);
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const paymentController = async function (token) {
  try {
    await model.sendGetOrderRequest(token);

    checkoutPaymentView.initBricks(MercadoPago, model.state.order);
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const getOrdersController = async function () {
  try {
    await model.sendGetOrdersRequest();

    employeeOrdersView.renderOrders(model.state.orders);
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const updateOrderController = async function (id) {
  try {
    const order = await model.sendUpdateOrderRequest(id);

    employeeOrdersView.renderOrders(model.state.orders);

    employeeOrdersView.renderOderInfo(order._id);

    return order;
  } catch (err) {
    renderNotification("error", err.message);
  }
};

const cancelOrderController = async function (orderId) {
  try {
    const order = model.sendCancelOrderRequest(orderId);

    employeeOrdersView.renderOrders(model.state.orders);

    employeeOrdersView.renderOderInfo(order._id);
  } catch (err) {
    renderNotification("error", err.message);

    employeeOrdersView.renderOrders(model.state.orders);

    employeeOrdersView.renderOderInfo(orderId);
  }
};

const init = function () {
  shoppingCartView.clearShoppingCart();
  getShoppingCartFromLocalStorage();
  loginView.addHandlerLogin(loginController);
  navView.addLogoutHandler(logoutController);
  navView.addSendResetPasswordEmailHandler(sendForgotPasswordEmailController);
  accountView.addHandlerUpdateUser(updateUserController);
  accountView.addHandlerUpdatePassword(updateUserController);
  addressesView.addHandlerCEPFetch(CEPFetchController);
  checkoutInfoView.addHandlerCEPFetch(CEPFetchController);
  addressesView.addHandlerDeleteAddress(deleteAddressController);
  addressesView.addHandlerAddAddress(addAddressController);
  checkoutInfoView.addHandlerAddAddress(addAddressController);
  adminMenuView.addHandlerCreateRecipe(addRecipeController);
  adminMenuEditView.addHandlerDeleteRecipe(deleteRecipeController);
  resetPasswordView.addHandlerResetPassword(resetPasswordcontroller);
  registerView.addHandlerSignUp(signUpController);
  emailConfirmView.addHandlerConfirmEmail(confirmEmailController);
  menuView.addRenderRecipeHandler(renderRecipesController);
  menuView.addAddToCartHandler(addToCartController);
  navView.addHadlerRenderShoppingCart(renderShoppingCartController);
  shoppingCartView.addCreateOrderInfoHandler(createOrderController);
  checkoutInfoView.addCreateOrderHandler(createPreferenceController);
  checkoutPaymentView.addGetOrderHandler(paymentController);
  employeeOrdersView.addInitOrdersHandler(getOrdersController);
  employeeOrdersView.addUpdateOrderHandler(updateOrderController);
  employeeOrdersView.addCancelOrderHandler(cancelOrderController);
};

init();
