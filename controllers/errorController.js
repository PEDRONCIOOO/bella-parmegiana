const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `${err.path} Inválido: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Campo já existente: ${value}. Por favor escolha outro valor!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Dados inválidos fornecidos. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

handleJWTError = () =>
  new AppError("Token inválido.Tente logar de novo, por favor!", 401);

const handleJWTExpiredError = () =>
  new AppError("Seu token expirou. Tente logar de novo, por favor!", 401);

const handleNoImageError = () => new AppError("Prato criado sem imagem!", 400);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    console.error("ERROR 💥", err);

    res.status(err.statusCode).render("error", {
      title: "Algo deu errado",
      msg: err.message,
    });
  }
};

sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    // API
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error("ERROR 💥", err);

      // 2) Send generic message
      res.status(500).json({
        status: "error",
        message: "Alguma coisa deu muito errado!😭",
      });
    }
  } else {
    // B) RENDERED WEBSITE
    if (err.isOperational) {
      res.status(err.statusCode).render("error", {
        title: "Algo deu errado",
        msg: err.message,
      });
      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error("ERROR 💥", err);

      // 2) Send generic message
      res.status(err.statusCode).render("error", {
        title: "Algo deu errado",
        msg: "Por favor tente novamente!",
      });
    }
  }
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Alguma coisa deu muito errado!😭",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log(err);

  if (process.env.NODE_ENV === "development") sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message };

    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (
      error.message === "Cannot read properties of undefined (reading 'buffer')"
    )
      error = handleNoImageError();
    sendErrorProd(error, req, res);
  }
};