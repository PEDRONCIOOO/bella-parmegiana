const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const Order = require("../models/oderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const { MercadoPagoConfig, Payment, PaymentRefund } = require("mercadopago");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { log } = require("console");

const signOrderIdToken = (orderId) => {
  return jwt.sign({ orderId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// TODO: Testar situaçoes em que o pagamento nao será aprovado(preço alterado, entre outros)

exports.pay = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (!decoded) return next(new AppError("Token inválido", 401));

  const order = await Order.findById(decoded.orderId);

  const price =
    order.order.reduce((acc, cur) => (acc += cur.price), 0) + order.address.deliveryFee;

  if (price !== req.body.transaction_amount)
    return next(
      new AppError("O preço não corresponde ao valor do pedido!", 401)
    );

  if (+req.body.installments !== 1)
    return next(new AppError("Nós não aceitamos parcelamento!", 401));

  const items = [];

  order.order.forEach((el) => {
    const description =
      `Quantidade :${el.quantity} | ` +
      el.options
        .map(
          (option) =>
            `${option.optionTitle}: ${option.options
              .map((el) => el.optionName.toLowerCase())
              .join(",")}`
        )
        .join(" | ");

    items.push({
      id: el.id,
      title: el.name,
      quantity: el.quantity,
      description,
      unit_price: el.price,
    });
  });

  items.push({
    id: "0",
    title: "Frete",
    quantity: 1,
    unit_price: 8,
  });

  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    options: { timeout: 5000 },
  });

  const payment = new Payment(client);

  const paymentData = await payment.create({
    body: {
      transaction_amount: price,
      additional_info: { items },
      token: req.body.token,
      description: `Pedido de id ${order._id}`,
      payment_method_id: req.body.payment_method_id,
      external_reference: order._id,
      token: req.body.token,
      installments: 1,
      payer: {
        email: req.body.payer.email,
      },
    },
  });
  res.status(200).json({
    status: "success",
    paymentStatus: paymentData.status,
  });
});

exports.startOrder = catchAsync(async (req, res, next) => {
  const paymentId = req.body.data.id;

  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
      method: "GET",
    }
  );

  const payment = await response.json();

  if (payment.status !== "approved") {
    return res.status(200).json({
      status: "success",
    });
  }

  const order = await Order.findById(payment.external_reference);

  order.status = "aguardando";
  order.orderedAt = Date.now();
  order.paymentId = payment.id;
  order.price = payment.transaction_amount;

  const savedOrder = await order.save();

  req.io.emit("newOrder", savedOrder);

  res.status(200).json({
    status: "success",
  });
});

exports.refundOrder = catchAsync(async (req, res, next) => {
  const id = req.params.token;
  
  
  const order = await Order.findById(id);
  
  const date = new Date(order.orderedAt);
   

  if (date + 1000 * 60 * 60 < Date.now())
    return next(
      new AppError(
        "Este pedido foi realizado há mais de uma hora, portanto nao pode mais ser reembolsado !",
        401
      )
    );

  if (order.status === "cancelado")
    return next(new AppError("Este pedido ja foi cancelado!", 401));

  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    options: { timeout: 5000 },
  });

  const paymentRefund = new PaymentRefund(client);

  const refund = await paymentRefund.create({
    payment_id: order.paymentId,
  });

  order.status = "cancelado";

  order.save();

  res.status(200).json({
    status: "success",
    data: {
      order,
      refund,
    },
  });
});
