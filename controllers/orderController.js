const Recipe = require("../models/recipeModel");
const Order = require("../models/oderModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const haversine = require("haversine");

const signOrderToken = (shoppingCart) => {
  return jwt.sign({ shoppingCart }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const signOrderIdToken = (orderId) => {
  return jwt.sign({ orderId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.deleteOrder = (req, res) => {
  res.status(200).json({
    status: "success",
    data: "Rota ainda nao implementada",
  });
};

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const id = req.params.token;

  const order = await Order.findById(id);

  if (order.status === "cancelado")
    return next(new AppError("Este pedido já foi cancelado!", 401));

  let nextStatus;
  if (order.deliveryMethod === "retirada" && order.status === "aguardando")
    nextStatus = "retirado";
  else if (order.status === "aguardando") nextStatus = "em trânsito";
  else if (order.status === "em trânsito") nextStatus = "entregue";
  else if (order.status === "retirado" || order.status === "entregue")
    nextStatus = "aguardando";

  order.status = nextStatus;

  order.save();

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.getOrdersFromPastWeek = catchAsync(async (req, res, next) => {
  const orders = await Order.find({
    status: { $ne: "arguardando pagamento" },
    orderedAt: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 7 },
  });

  res.status(200).json({
    status: "success",
    data: orders,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (!decoded) return next(new AppError("Token inválido", 401));

  const order = await Order.findById(decoded.orderId);

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const token = req.body.token;

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (!decoded)
    return next(new AppError("Por favor, providencie um token!", 401));

  let user;
  if (req.user) user = req.user._id;
  else user = undefined;

  let address;
  let deliveryMethod;
  if (req.body.address === "retirada") {
    deliveryMethod = "retirada";
    address = {
      CEP: "79823120",
      neighbourhood: "Vila Aurora",
      street: "Rua Afonso Pena",
      houseNumber: "760",
      deliveryFee: 0,
    };
  } else if (user) {
    address = req.user.addresses.find(
      (el) => el._id.toHexString() === req.body.address
    );
  } else if (!req.body.address.CEP || !req.body.address.houseNumber) {
    return next(new AppError("Por favor forneça todos os dados", 401));
  } else {
    const CEPInfo = await fetch(
      `https://cep.awesomeapi.com.br/json/${req.body.address.CEP}`
    );

    const data = await CEPInfo.json();

    const center = {
      latitude: -22.229679451790382,
      longitude: -54.803665569587025,
    };

    const addressCoord = {
      latitude: data.lat,
      longitude: data.lng,
    };

    const distance = Math.round(
      haversine(center, addressCoord, { unit: "meter" }) / 1000
    );

    req.body.address.deliveryFee = 8 + distance * 4;

    address = req.body.address;
  }

  const orderData = {
    user,
    order: decoded.shoppingCart,
    address,
    deliveryMethod,
  };

  const order = await Order.create(orderData);

  const idToken = signOrderIdToken(order._id);

  res.status(200).json({
    status: "success",
    idToken,
  });
});

exports.validateOrder = catchAsync(async (req, res, next) => {
  // Verifica se req.body é um array
  if (!Array.isArray(req.body))
    return next(new AppError("Dados inválidos", 400));

  const shoppingCart = [];
  // Loop para verificar todas as receitas do carrinho
  for (const recipe of req.body) {
    const order = { options: [] };

    //  Verifica se o id está correto
    const DBRecipe = await Recipe.findById(recipe._id);
    if (!DBRecipe) return next(new AppError("Prato não encontrado!", 400));

    // Loop para verificar todas as opçoes das receitas do carrinho
    for (const option of recipe.options) {
      const optionName = Object.keys(option)[1];
      const options = { optionTitle: option.optionTitle, options: [] };

      // Verifica se a opção realmente existe para esta receita
      const verifiedOption = DBRecipe.options.find((DBoption) => {
        return DBoption.name.replaceAll(" ", "") === optionName;
      });
      if (!verifiedOption) return next(new AppError("Dados Inválidos", 400));

      // Verifica se as opçoes de tipo radio possuem apenas um input
      if (verifiedOption.type === "radio" && option[optionName].length > 1)
        return next(new AppError("Dados Inválidos", 400));

      // Loop para verificar todos os inputs das opçoes
      for (const optionChoice of option[optionName]) {
        // Verifica se o input para a opção realmente existe
        const verifiedOptionChoice = verifiedOption.options.find(
          (el) => el.optionName === optionChoice
        );
        if (!verifiedOptionChoice)
          return next(new AppError("Dados Inválidos", 400));

        options.options.push(verifiedOptionChoice);
      }

      order.options.push(options);
    }

    order.name = recipe.name;
    order.id = recipe._id;
    order.quantity = recipe.quantity;
    order.price = 0;
    order.image = DBRecipe.image;

    const hasSizeOption = order.options.find((el) =>
      el.optionTitle.startsWith("Tamanho")
    );

    if (!hasSizeOption) order.price += +DBRecipe.price;
    for (const option of order.options) {
      for (const options of option.options) {
        if (options.price) order.price += +options.price;
      }
    }

    shoppingCart.push(order);
  }

  const token = signOrderToken(shoppingCart);

  res.status(200).json({
    status: "success",
    token,
  });
});
