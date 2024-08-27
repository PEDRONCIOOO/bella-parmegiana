const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const Options = require("../models/optionsModel");
const APIFeatures = require("../utils/features");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { title } = require("process");
const Order = require("../models/oderModel");

exports.getHome = (req, res) => {
  res.status(200).render("home", {
    title: "Home",
    path: req.route.path,
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: `Sua conta`,
    path: req.route.path,
  });
};

exports.getAccountAdresses = (req, res) => {
  res.status(200).render("addresses", {
    title: "Meus Endereços",
    path: req.route.path,
  });
};

exports.getMyOrders = (req, res) => {
  res.status(200).render("myOrders", {
    title: "Meus Pedidos",
    path: req.route.path,
  });
};

exports.getEmployeeOrders = catchAsync(async (req, res, next) => {
  res.status(200).render("employeeOrders", {
    title: "Manejar Pedidos",
    path: req.route.path,
  });
});

exports.getAdminMenu = catchAsync(async (req, res) => {
  const options = await Options.find();

  const subCategories = {};
  const categories = process.env.MENU_CATEGORIES.split(",");

  categories.forEach((category) => {
    subCategories[category] = [];

    process.env[`MENU_SUBCATEGORIES_${category}`]
      .split(",")
      .forEach((sub) => subCategories[category].push(sub));
  });

  res.status(200).render("adminMenu", {
    title: "Admin Menu | Adicionar",
    path: req.route.path,
    options,
    categories,
    subCategories,
  });
});

exports.getAdminMenuEdit = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find();

  res.status(200).render("adminMenuEdit", {
    title: "Admin Menu | Editar",
    path: req.route.path,
    recipes,
  });
});

exports.getResetPassword = (req, res, next) => {
  res.status(200).render("resetPassword", {
    title: "Reset Senha",
  });
};

exports.getEmailConfirm = (req, res, next) => {
  res.status(200).render("emailConfirm", {
    title: "Confirme seu email",
  });
};

exports.getMenu = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Recipe.find(), { page: 1 })
    .filter()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const recipes = await features.query;

  const subCategories = {};
  const categories = process.env.MENU_CATEGORIES.split(",");

  categories.forEach((category) => {
    subCategories[category] = [];

    process.env[`MENU_SUBCATEGORIES_${category}`]
      .split(",")
      .forEach((sub) => subCategories[category].push(sub));
  });

  res.status(200).render("menu", {
    title: "Menu",
    path: req.route.path,
    query: req.query,
    recipes,
    categories,
    subCategories,
  });
});

exports.getCheckOutInfo = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //TODO: Fazer resposta para caso JWT tenha expirado

  res.status(200).render("checkoutInfo", {
    title: "checkout",
    shoppingCart: decoded.shoppingCart,
  });
});

exports.getCheckoutFinish = catchAsync(async (req, res, next) => {
  const token = req.params.id;

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const order = await Order.findById(decoded.orderId);

  res.status(200).render("checkoutFinish", {
    title: "Pedido Finalizado",
    order,
  });
});

exports.getCheckoutFail = (req, res, next) => {
  res.status(200).render("checkoutFail", {
    title: "Pedido Finalizado",
  });
};

exports.getCheckoutPayment = catchAsync(async (req, res, next) => {
  const token = req.params.id;

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const order = await Order.findById(decoded.orderId);

  res.status(200).render("checkoutPayment", {
    title: "Pagar",
    order,
  });
});
