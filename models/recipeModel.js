const mongoose = require("mongoose");

// TODO: Add all categories and fix object

const subCategories = [];
const categories = fetch('categories.json')

console.log(categories);

categories.forEach((el) => {
  process.env[`MENU_SUBCATEGORIES_${el}`]
    .split(",")
    .forEach((el) => subCategories.push(el));
});

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "O prato necessita de um nome!"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "O prato necessita de um preço!"],
  },
  ingredients: {
    type: [String],
    required: [true, "O prato necessita de ingredientes!"],
  },
  description: {
    type: String,
    required: [true, "O prato necessita de uma descrição!"],
  },
  image: {
    type: String,
    default: "default.jpg",
  },
  servingSize: {
    type: Number,
    required: [
      true,
      "Por favor especifique quantas pessoas essa receita serve!",
    ],
  },
  categories: [
    {
      type: String,
      required: [true, "Uma receita deve ter no mínimo uma categoria"],
      enum: {
        values: subCategories,
        message: `Por favor escolha uma das categorias válidas`,
      },
    },
  ],
  options: [
    {
      name: {
        type: String,
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
          values: ["checkBox", "radio", "number"],
          message: "Por favor selecione um tipo válido",
        },
      },
      errorMessage: {
        type: String,
        required: [true, "Forneça uma mensagem de erro, por favor!"],
      },
      required: {
        type: Boolean,
        required: [true, "Por favor diga se a opção é obrigatória ou não"],
      },
      // TODO: Find way to make this better
      minMaxNumberSelect: {
        type: {
          minNumber: Number,
          maxNumber: Number,
        },
        default: undefined,
      },
      options: {
        _id: false,

        type: [
          {
            _id: false,
            optionName: {
              type: String,
              required: [true, "Diga o nome da opção, por favor!"],
            },
            description: {
              type: String,
              default: undefined,
            },
            needsPrice: {
              type: Boolean,
              default: false,
            },
            price: {
              type: Number,
              default: undefined,
              validate: {
                validator: function (el) {
                  if (!el && this.needsPrice) return false;
                },
                message: "Por favor coloque todos os preços",
              },
            },
          },
        ],
      },
      _id: false,
    },
  ],
});

const Recipe = new mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;

//  options: Array of custom options for each category
