const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // Only send cookie over HTTPS if in production
  // During Development HTTPS is unaccessible
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove Password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signEmailConfirmToken = (id) => {
  return jwt.sign({ emailConfirmTokenId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EMAIL_EXPIRES_IN,
  });
};

// Signign Json Web Token jwt.sign(payload, secret, options)
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//TODO: Add email confirmation, unless signup with google or other method
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // TODO: Delete everything bellow before deplaying app
  });

  const token = signEmailConfirmToken(user._id);

  const url = `${req.protocol}://${req.get("host")}/confirmEmail/${token}`;

  await new Email(user, url).sendWelcome();

  user.password = undefined;

  res.status(200).json({
    status: "success",
    message: "Por favor confirme seu email para começar a utilizar sua conta",
    data: user,
  });
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.emailConfirmTokenId);

  if (!user)
    return next(
      new AppError("Usuario não existe mais, registre-se novamente", 401)
    );

  if (user.emailConfirmed)
    return next(
      new AppError(
        "Email já foi confirmado, você ja pode fazer o login normalmente",
        400
      )
    );

  if (user.emailConfirmExpires < Date.now()) {
    await User.findByIdAndDelete(decoded.emailConfirmTokenId);
    return next(
      new AppError("Confirmação de email expirada, registre-se novamente", 401)
    );
  }

  const confirmedUser = await User.findByIdAndUpdate(
    decoded.emailConfirmTokenId,
    {
      emailConfirmed: true,
      emailConfirmExpires: null,
    },
    { new: true }
  );

  createSendToken(confirmedUser, 200, res);
});

exports.deleteUnconfirmedUsers = catchAsync(async () => {
  await User.deleteMany({ emailConfirmExpires: { $lt: Date.now() } });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Coloque um email e uma senha, por favor!", 400));
  }
  // 2) Check if user exister && password is correct
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists and if so ,check if passwords match
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Email ou senha incorretos", 401));

  if (!user.emailConfirmed) {
    return next(new AppError("Por favor confirme seu email!", 401));
  }

  // 3) if everything is ok, send the token to the client
  const token = signToken(user.id);

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError(
        "Voce nao está Logado! Por favor faça o login para ter acesso!",
        401
      )
    );
  }
  // 2) Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "O usuario ao qual este token pertencia nao existe mais",
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    // 4) Check if user changed password after the token was issued
    return next(
      new AppError(
        "Usuario trocou de senha recentemente! Por favor faça o login de novo",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  res.locals.user = currentUser; // give access to user in pug template
  req.user = currentUser;

  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      req.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
});

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Você nao tem permissao para realizar esta ação", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("Não existe nenhum usuario com este email", 404));
  }

  //2) Generate the random reset token, and store it in DB
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3) Send it to user's email
  // Needs try catch because we need to do something before sending the error
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/resetPassword/${resetToken}`;

    // const text = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If didn't forget your password, please ignore`;

    // await sendEmail({
    //   email: user.email,
    //   subject: `Your password reset token (valid for 10 min)`,
    //   text,
    // });

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "Ocorreu um erro ao mandar o email. Por favor tente mais tarde!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // get user based on the url token and check if it has expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired, and there is user, set new password
  if (!user) return next(new AppError("Token expirado ou inválido", 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Senha atual incorreta", 401));
  }
  // 3) If so , update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in Send JWT
  createSendToken(user, 200, res);
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError("Senha incorreta", 401));
  }

  // 3) If so, delete user
  await User.findByIdAndDelete(user.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.validateWebhook = catchAsync(async (req, res, next) => {
  const ts = req.headers["x-signature"].split(",")[0].split("=")[1].trim();
  const v1 = req.headers["x-signature"].split(",")[1].split("=")[1].trim();

  const signatureTemplateParsed = `id:${req.body.data.id};request-id:${req.headers["x-request-id"]};ts:${ts};`;

  const crypto = require("crypto");
  const cyphedSignature = crypto
    .createHmac(
      "sha256",
      "2954ec7f823365cdb3035a12bdb1fb24a81207862564f25340cd8265b90c9228"
    )
    .update(signatureTemplateParsed)
    .digest("hex");

  if (cyphedSignature !== v1)
    return next(new AppError("WebHook Inválido", 401));

  next();
});

exports.stopDuringClosingHours = (req, res, next) => {
  currentTime = new Date().getHours();

  console.log(currentTime);

  if (currentTime > 10 && currentTime < 14) return next();
  if (currentTime > 18 && currentTime < 23) return next();

  next(new AppError("O restaurante não está aberto no momento!", 401));
};
