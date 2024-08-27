import View from "./View.js";

class MenuView extends View {
  _recipeContainer = document.querySelector(".section-delivery");
  _recipeSeeMoreBtn = document.querySelector(".section-delivery-see-more");
  _recipeOptions = document.querySelector(".section-menu-options");
  _recipeOptionsCloseBtn = document.querySelector(
    ".section-menu-options-close-btn"
  );
  _recipeOptionsForm = document.querySelector(".recipe-options");
  _recipeOptionsBuyBtn = document.querySelector(".menu-price-button-buy");
  _recipeOtionsControls = document.querySelector(".menu-price-button-controls");
  _recipeOptionsControl = document.querySelectorAll(
    ".menu-price-button-control"
  );
  _recipeOptionsQuantity = document.querySelector(
    ".menu-price-button-quantity"
  );
  _recipeImage = document.querySelector(".recipe-image");
  _recipeName = document.querySelector(".menu-recipe-name");
  _recipeServingSize = document.querySelector(".menu-recipe-serving-size");
  _recipeIngredients = document.querySelector(".menu-recipe-ingredients");
  _recipeDescription = document.querySelector(".menu-recipe-description");

  _categoryBoxes = document.querySelectorAll(".category-box");

  _subCategoriesContainer = document.querySelector(".section-subcategories");

  constructor() {
    super();
    this._addEventListeners();
  }

  _addEventListeners() {
    if (this._recipeContainer) {
      this._recipeContainer.addEventListener("click", (e) => {
        const recipe = e.target.closest(".delivery-box");
        if (!recipe) return;
        this._showModal(this._recipeOptions);
        this._renderOptions(recipe.dataset.id);
      });
      this._blurOverlay.addEventListener("click", () => {
        this._hideModal(this._recipeOptions);
      });
      this._recipeOptionsCloseBtn.addEventListener("click", () => {
        this._hideModal(this._recipeOptions);
      });

      this._recipeOptionsForm.addEventListener("click", (e) => {
        const option = e.target.closest(".recipe-options-input");
        if (!option) return;
        this._calculatePrice(+this._recipeOptionsQuantity.dataset.price);
      });

      this._recipeOtionsControls.addEventListener("click", (e) => {
        const btn = e.target.closest(".menu-price-button-control");
        if (!btn) return;
        if (btn.dataset.goto === "0") return;
        this._recipeOptionsQuantity.innerHTML = btn.dataset.goto;
        this._recipeOptionsQuantity.previousSibling.dataset.goto =
          this._recipeOptionsQuantity.innerHTML - 1;
        this._recipeOptionsQuantity.nextSibling.dataset.goto =
          +this._recipeOptionsQuantity.innerHTML + 1;
        this._calculatePrice(this._recipeOptionsQuantity.dataset.price);
      });

      this._recipeOptionsForm.addEventListener("invalid", (e) => {
        e.preventDefault();
      });
    }
  }

  _renderOptions(recipeId) {
    const recipe = this._data.recipes.find((el) => el._id === recipeId);

    this._recipeImage.firstChild.src = `./img/recipes/${
      recipe.image === "undefined" ? "default.jpg" : recipe.image
    }`;
    this._recipeName.innerHTML = recipe.name;
    this._recipeServingSize.innerHTML = `Serve ${recipe.servingSize} ${
      recipe.servingSize > 1 ? "Pessoas" : "Pessoa"
    }`;
    this._recipeDescription.innerHTML = recipe.description;
    this._recipeIngredients.innerHTML = recipe.ingredients.join(",");
    this._recipeOptionsForm.innerHTML = this._generateOptionsMarkup(recipe);
    this._recipeOptionsQuantity.innerHTML = 1;
    this._recipeOptionsQuantity.dataset.price = recipe.price;
    this._recipeOptionsControl[0].dataset.goto = 0;
    this._recipeOptionsControl[1].dataset.goto = 2;
    this._recipeOptionsBuyBtn.dataset.id = recipe._id;
    this._calculatePrice(recipe.price);
  }

  _generateOptionsMarkup(recipe) {
    return recipe.options
      .map(
        (el) =>
          `
         <div class="recipe-option" id="${el.name.replaceAll(" ", "")}-${
            recipe._id
          }" data-name="">
            <div class="recipe-options-title">
              <h1>${el.title}</h1>
              <span>${el.instructions}</span>
            </div>
            <div class="recipe-options-choices">
            ${el.options
              .map((option) => {
                let price;
                let priceLabel;
                if (option.price) {
                  price = this._convertToCurrencyBrl(option.price);
                  priceLabel = `<label for="${recipe._id}-${option.optionName}">${price}</label>`;
                } else
                  priceLabel = `<label for="${recipe._id}-${option.optionName}"></label>`;
                // =============================================
                return `
            <div class="recipe-options-input" data-price="${option.price}">
              <label for="${recipe._id}-${option.optionName}">${
                  option.optionName
                } ${
                  option.description
                    ? "<br> <span>" + option.description + "</span>"
                    : ""
                }</label>
                ${priceLabel ? priceLabel : "<label></label>"}
              <input name="${el.name}" type="${el.type}" id="${recipe._id}-${
                  option.optionName
                }" data-price="${option.price}" data-errormessage="${
                  el.errorMessage
                }" ${el.required ? "required" : ""} ${
                  option.optionName.startsWith("Pequeno") ? "checked" : ""
                }/>
            </div>
            `;
              })
              .join("")}
            </div>
          </div>
          `
      )
      .join("");
  }

  _getOrderData(id) {
    const inputs = this._recipeOptionsForm.querySelectorAll("input");
    const invalidInputs = [];
    inputs.forEach((input) => {
      if (input.validity.valid) return;
      invalidInputs.push(input);
    });
    document
      .querySelectorAll(".recipe-option-error")
      .forEach((el) => el.remove());

    if (invalidInputs.length > 0) return this._renderInputErrors(invalidInputs);
    // Order Format
    // { recipe: id, options: { optionName: choices, ... } }
    const shoppingCartItem = this._data.recipes.find((el) => el._id === id);
    shoppingCartItem.options = [];
    shoppingCartItem.price = this._calculatePrice(shoppingCartItem.price);

    shoppingCartItem.quantity = +this._recipeOptionsQuantity.innerHTML;

    const options = document.querySelectorAll(".recipe-option");
    options.forEach((el) => {
      const selectedInputs = el.querySelectorAll(
        'input[type="checkbox"]:checked, input[type="radio"]:checked'
      );
      const optionName = el.id.split("-")[0];
      const optionTitle = el
        .closest(".recipe-option")
        .querySelector("h1")
        .innerHTML.replace(":", "");
      const inputs = [];

      selectedInputs.forEach((input) => {
        inputs.push(input.id.split("-")[1]);
      });

      shoppingCartItem.options.push({ optionTitle, [optionName]: inputs });
    });

    this._data.shoppingCart.push(shoppingCartItem);
    this._hideModal(this._recipeOptions);
    return true;
  }

  _renderInputErrors(inputs) {
    inputs.forEach((input) => {
      const errorMarkup = `<span class="recipe-option-error"><b>Erro!</b>: ${input.dataset.errormessage}</span>`;

      const errorElement = input
        .closest(".recipe-option")
        .querySelector(".recipe-option-error");
      if (errorElement) errorElement.remove();

      input
        .closest(".recipe-option")
        .querySelector(".recipe-options-title")
        .insertAdjacentHTML("beforeend", errorMarkup);
    });
    inputs[0].closest(".recipe-option").scrollIntoView({ behavior: "smooth" });

    return null;
  }

  _calculatePrice(basePrice) {
    const inputs = this._recipeOptionsForm.querySelectorAll("input");
    let totalPrice = 0;

    const hasSizeOption = Array.from(inputs).some((el) =>
      el.name.startsWith("Tamanhos")
    );
    if (!hasSizeOption) totalPrice += +basePrice;

    inputs.forEach((input) => {
      if (!input.checked) return;
      if (input.dataset.price === "undefined") return;
      totalPrice += +input.dataset.price;
    });
    const quantity =
      this._recipeOtionsControls.firstChild.nextSibling.innerHTML;

    totalPrice = +quantity * +totalPrice;

    this._recipeOptionsBuyBtn.innerHTML = `COMPRE • ${this._convertToCurrencyBrl(
      totalPrice
    )}`;

    return totalPrice;
  }

  _changeCategory(e) {
    const box = e.target.closest(".category-box");
    if (!box) return;
    this._categoryBoxes.forEach((categoryBox) =>
      categoryBox.classList.remove("category-box-active")
    );

    box.classList.add("category-box-active");
    this._subCategoriesContainer.innerHTML = "";

    if (box.dataset.name === "Tudo") return box.dataset.subcategories;

    this._renderSubcategories(box.dataset.subcategories);
    return box.dataset.subcategories;
  }

  _changeSubCategory(e) {
    const subCategory = e.target.closest(".section-subcategory");
    if (!subCategory) return;

    const subCategories = document.querySelectorAll(".section-subcategory");

    subCategories.forEach((el) => {
      el.classList.remove("section-subcategory-active");
    });
    e.target.classList.add("section-subcategory-active");

    return subCategory.dataset.subcategory;
  }

  _renderSubcategories(categories) {
    const category = categories.split(",");

    const markup = category.map((category) => {
      return `<span class="section-subcategory" data-subcategory="${category}">${category} </span>`;
    });
    const all = `<span class="section-subcategory section-subcategory-active" data-subcategory="${categories}">Tudo</span>`;
    markup.unshift(all);

    markup.forEach((el) =>
      this._subCategoriesContainer.insertAdjacentHTML("beforeend", el)
    );
  }

  _generateRecipeMarkup(data) {
    return data
      .map((el) => {
        let price = el.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        return `
        <div class="delivery-box" data-id="${el._id}">
        <div class="img-display-delivery">
            <img src="./img/recipes/${
              el.image === "undefined" ? "default.jpg" : el.image
            }" alt="${el.name}" />
        </div>

        <div class="info-recipes">
            <h4>${el.name}</h4>
            <p> ${el.description} </p>
            <h2>${price}</h2>
        </div>
        </div>
        `;
      })
      .join("");
  }

  renderRecipes(data) {
    this._data = data;
    const markup = this._generateRecipeMarkup(data.recipes);
    this._recipeContainer.innerHTML = "";

    this._recipeContainer.insertAdjacentHTML("afterbegin", markup);

    if (this._data.count > this._data.page * 10) {
      this._recipeSeeMoreBtn.classList.remove("hidden");
      this._recipeSeeMoreBtn.dataset.goto = 2;
    } else this._recipeSeeMoreBtn.classList.add("hidden");
  }

  renderAditionalRecipes(data) {
    this._data = data;
    const markup = this._generateRecipeMarkup(data.newRecipes);

    this._recipeContainer.insertAdjacentHTML("beforeend", markup);

    if (this._data.count > this._data.page * 10)
      this._recipeSeeMoreBtn.dataset.goto++;
    else this._recipeSeeMoreBtn.classList.add("hidden");
  }

  addRenderRecipeHandler(handler) {
    if (this._categoryBoxes)
      this._categoryBoxes.forEach((el) => {
        el.addEventListener("click", (e) => {
          const categories = this._changeCategory(e);
          const removeSpinner = this.renderLoadingSpinner(
            this._recipeContainer
          );
          handler(categories);

          removeSpinner();
        });
      });

    if (this._subCategoriesContainer)
      this._subCategoriesContainer.addEventListener("click", (e) => {
        const subCategory = this._changeSubCategory(e);
        if (!subCategory) return;
        handler(subCategory);
      });

    if (this._recipeSeeMoreBtn)
      this._recipeSeeMoreBtn.addEventListener("click", (e) => {
        handler(
          this._data.curCategories,
          false,
          this._recipeSeeMoreBtn.dataset.goto
        );
      });

    if (this._subCategoriesContainer)
      (() => {
        const removeSpinner = this.renderLoadingSpinner(this._recipeContainer);
        handler("all");
      })();
  }

  addAddToCartHandler(handler) {
    if (this._recipeOptionsBuyBtn) {
      this._recipeOptionsBuyBtn.addEventListener("click", (e) => {
        const id = this._recipeOptionsBuyBtn.dataset.id;
        const isValidOrder = this._getOrderData(id);
        if (!isValidOrder) return;
        handler(this._data.shoppingCart);
      });
    }
  }
}

export default new MenuView();
