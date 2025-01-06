const path = require("path");
const morgan = require("morgan");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const { createServer } = require("http");
const { Server } = require("socket.io");

const recipeRouter = require("./routes/recipeRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const optionsRouter = require("./routes/optionsRoutes");
const viewRouter = require("./routes/viewRoutes");
const AppError = require("./utils/appError");
const paymentRouter = require("./routes/paymentRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// SECURITY CONFIG
// Set security HTTP headers
//TODO: Reaativar aqui
// app.use(helmet());

// Max requests per IP to the API
const limiter = rateLimit({
  max: process.env.MAX_REQUESTS_PER_HOUR,
  windowMs: 60 * 60 * 1000,
  message:
    "Muitas solicitações deste IP, por favor, tente novamente em uma hora!",
});
app.use("/api", limiter);

// Limiting amout of data in one request
// Body parser, reading data from body into req.body
app.use(express.json({ limit: "5kb" }));
app.use(cookieParser());

// Data sanitization againts NoSQL query injection
app.use(mongoSanitize());

// Data sanitization againts XSS
app.use(xss());

// Prevent Parameter pullution
// Whitelist to allow the same parameter to appear multiple times, exmple filter for duration = 5 & duration =9
//TODO: Update when recipe model is complete
app.use(
  hpp({
    whitelist: ["price", "servingSize", "ingredients"],
  })
);

app.use(compression());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ROUTES

app.use("/", viewRouter);
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/options", optionsRouter);
app.use("/api/v1/payment", paymentRouter);

// Handling misspelled routes 404

// TODO: Add handling for frontend 404 page if url does not start with /api/v1/
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Nao conseguimos encontrar ${req.originalUrl} nesse servidor!`,
      404
    )
  );
});

//Global error handler
app.use(globalErrorHandler);

//WebSocketConnection
const httpServer = createServer(app);
const io = new Server(httpServer);
io.on("connection", (socket) => {
  console.log("New Conection");
});

module.exports = httpServer;
