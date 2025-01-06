const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { type } = require("os");

// TODO: Set max length for every input of a user
// TODO: Enable precise geoLocation validation with haversine

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "coloque seu nome, por favor"],
  },
  // TODO: Finish GeoJson Validation
  addresses: [
    {
      deliveryFee: Number,
      CEP: {
        type: String,
        required: [true, "Por favor nos diga seu CEP"],
        maxlength: [8, "Por favor forneça um CEP válido"],
        minlength: [8, "Por favor forneça um CEP válido"],
        validate: {
          validator: (val) => /^\d+$/.test(+val),
          message: "Por favor forneça um CEP válido",
        },
      },
      city: {
        type: String,
        enum: ["Dourados"],
        default: "Dourados",
      },
      state: {
        type: String,
        enum: ["MS"],
        default: "MS",
      },
      residenceType: {
        type: String,
        enum: ["Casa", "Apartamento", "Escritório"],
        default: "Casa",
      },
      neighbourhood: {
        type: String,
      },
      street: {
        type: String,
        required: [true, "Por favor nos informe a rua do local de entrega"],
      },
      houseNumber: {
        type: Number,
        required: [true, "Por favor nos informe o número do local de entrega"],
      },
      compliment: {
        type: String,
      },
    },
  ],
  email: {
    type: String,
    required: [true, "Coloque um email, por favor"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Coloque um email valido, por favor."],
  },
  phoneNumber: {
    type: String,
    required: [true, "Coloque um número de celular, por favor"],
    unique: true,
    validate: {
      validator: function (el) {
        return validator.isMobilePhone(el, ["pt-BR"]);
      },
      message: "Número de celular inválido",
    },
  },
  password: {
    type: String,
    required: [true, "Coloque uma senha, por favor"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirme sua senha, por favor"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "As senhas nao são iguais!",
    },
  },
  role: {
    type: String,
    enum: ["user", "funcionario", "admin"],
    default: "user",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
  emailConfirmExpires: {
    type: Date,
    default: Date.now() + 1000 * 60 * 60 * 24,
  },
});

// encrypting passwords before they are saved to DB
userSchema.pre("save", async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12 (higher = better)
  this.password = await bcrypt.hash(this.password, 12);
  // deleting passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // Create reset token that will be sent to user
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Encrypt reset token that will be stored in DB for later comparison
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
