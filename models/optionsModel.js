const mongoose = require("mongoose");

//TODO: Try to fix unique in Name not working

//TODO: Mudar tipos de seleçao para que se assimilem aos dos formularios HTML

const optionsSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [
      true,
      "Diga o nome que voce quer dar ao conjunto de opções, por favor!",
    ],
  },
  title: {
    type: String,
    required: [
      true,
      "Diga o título que voce quer dar ao conjunto de opções, por favor!",
    ],
  },
  instructions: {
    type: String,
    required: [true, "Por favor, coloque as instruções desta opção"],
  },
  type: {
    type: String,
    required: [
      true,
      "Selecione o tipo de opção que deseja adicionar, por favor!",
    ],
    enum: {
      values: ["checkBox", "radio"],
      message: "Por favor selecione um tipo válido",
    },
  },
  required: {
    type: Boolean,
    required: [true, "Por favor diga se a opção é obrigatória ou não"],
  },
  minMaxNumberSelect: {
    type: {
      minNumber: Number,
      maxNumber: Number,
    },
    default: undefined,
  },
  needsPrice: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    required: [true, "Forneça uma mensagem de erro, por favor!"],
  },
  options: {
    type: [
      {
        optionName: {
          type: String,
          required: [true, "Diga o nome da opção, por favor!"],
        },
        description: {
          type: String,
          default: undefined,
        },
        price: {
          type: Number,
          default: undefined,
        },
      },
    ],
    required: true,
    validate: {
      validator: function (el) {
        return el.length > 0;
      },
      message: "Especifique pelo menos uma opção",
    },
    _id: false,
  },
});

const Options = new mongoose.model("Options", optionsSchema);

module.exports = Options;
