const handlerFactory = require("./handlerFactory");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const haversine = require("haversine");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.createUser = handlerFactory.createOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
exports.updateUser = handlerFactory.updateOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "Esta rota nao é para atualizar senhas. Por favor use /updateMyPassword.",
        400
      )
    );

  // Filtering unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "phoneNumber");

  // Update User document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.createAddress = catchAsync(async (req, res, next) => {
  if (req.user.addresses.length >= 3)
    return next(
      new AppError(
        "Você já possui o número maximo de endereços por usuário",
        401
      )
    );

  console.log(req.body);

  const CEPInfo = await fetch(
    `https://cep.awesomeapi.com.br/json/${req.body.data.CEP}`
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

  req.body.data.deliveryFee = 8 + distance * 4;

  const address = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { addresses: req.body.data },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  console.log(address);

  res.status(200).json({
    status: "success",
    data: {
      address,
    },
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { addresses: { _id: req.body.id } },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: null,
  });
});
