const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  paymentId: {
    type: String,
    default: undefined,
  },
  price: {
    type: Number,
    default: undefined,
  },
  orderedAt: {
    type: Date,
    default: undefined,
  },
  status: {
    type: String,
    enum: [
      "retirado",
      "entregue",
      "cancelado",
      "em trânsito",
      "aguardando",
      "aguardando pagamento",
    ],
    default: "aguardando pagamento",
  },
  deliveryMethod: {
    type: String,
    enum: ["entrega", "retirada"],
    default: "entrega",
  },
  order: [
    {
      _id: false,
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      Name: String,
      image: String,
      options: [
        {
          optionTitle: String,
          options: [
            {
              optionName: String,
              price: Number,
            },
          ],
        },
      ],
    },
  ],

  address: {
    deliveryFee: Number,
    CEP: {
      type: String,
      maxlength: [8, "Por favor forneça um CEP válido"],
      minlength: [8, "Por favor forneça um CEP válido"],
      validate: {
        validator: (val) => {
          if (this.deliveryMethod === "retirada") return true;
          return /^\d+$/.test(+val);
        },
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
    },
    houseNumber: {
      type: Number,
      required: [true, "Por favor nos fale o número do endereço de entrega"],
    },
    compliment: {
      type: String,
    },
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate("user");
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
