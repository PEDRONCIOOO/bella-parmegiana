import View from "./View.js";

class adminMenuView extends View {
  _blurOverlay = document.querySelector(".blur-overlay");

  _adminMenuForm = document.querySelector(".admin-menu-form");
  _ingredientsForm = document.querySelector(".admin-menu-form-ingredients");
  _optionsForm = document.querySelector("#options-form");

  _optionsOverlay = document.querySelector(".admin-menu-options-overlay");
  _ingredientsOverlay = document.querySelector(
    ".admin-menu-ingredients-overlay"
  );

  _ingredientsDisplay = document.querySelector(
    ".admin-menu-form-big-ingredients-text"
  );
  _allOptions = document.querySelectorAll(".admin-menu-form-big-option");

  _imageInputs = document.querySelectorAll(".admin-menu-form-image-input");
  _imageContainer = document.querySelectorAll(".admin-menu-form-image");

  _ingredientsBtn = document.querySelector(".admin-menu-form-big-ingredients");
  _submitIngredientsBtn = document.querySelector(
    ".admin-menu-form-ingredients-submit"
  );
  _selectOptionsBtn = document.querySelector(
    ".admin-menu-form-big-add-options"
  );
  _optionsFormBtn = document.querySelector(".admin-menu-option-btn");

  _nameInput1 = document.querySelector(".admin-menu-form-name");
  _nameInput2 = document.querySelector(".admin-menu-form-big-name");

  _descriptionInput1 = document.querySelector(".admin-menu-form-description");
  _descriptionInput2 = document.querySelector(
    ".admin-menu-form-big-description"
  );

  _categoriesForm = document.querySelector("#categories-form");
  _categoriesOverlay = document.querySelector(".admin-menu-category-overlay");
  _categoriesFormBtn = document.querySelector(
    ".admin-menu-form-big-categories"
  );
  _categoriesFormDropdownBtn = document.querySelectorAll(
    ".admin-menu-categories-dropdown"
  );
  _categoriesSubmitBtn = document.querySelector(".admin-menu-categories-btn");

  constructor() {
    super();
    this._addHandlerUploadImage(this._changeRecipeImage.bind(this));
    this._addEventListeners();
  }

  _addEventListeners() {
    if (this._ingredientsForm) {
      this._blurOverlay.addEventListener("click", () => {
        this._hideModal(this._ingredientsOverlay);
        this._hideModal(this._optionsOverlay);
        this._hideModal(this._categoriesOverlay);
      });

      this._ingredientsBtn.addEventListener("click", (e) => {
        this._showModal(this._ingredientsOverlay);
      });

      this._selectOptionsBtn.addEventListener("click", (e) => {
        this._showModal(this._optionsOverlay);
      });

      this._categoriesFormBtn.addEventListener("click", (e) => {
        this._showModal(this._categoriesOverlay);
      });

      this._ingredientsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this._hideModal(this._ingredientsOverlay);
        const ingredients = this._getIngredients().join(", ");

        this._ingredientsDisplay.innerHTML = ingredients;
      });

      this._optionsForm.addEventListener("change", (e) => {
        const id = e.target.id.slice(8);
        if (e.target.checked) {
          this._displayOption(id);
        } else {
          this._hideOption(id);
        }
      });

      this._optionsFormBtn.addEventListener("click", (e) => {
        this._hideModal(this._optionsOverlay);
      });

      this._categoriesSubmitBtn.addEventListener("click", (e) => {
        this._hideModal(this._categoriesOverlay);
      });

      this._adminMenuForm.addEventListener("input", (e) => {
        this._syncInputs(e);
      });

      this._categoriesForm.addEventListener("click", (e) => {
        const btn = e.target.closest(".admin-menu-categories-dropdown");
        if (!btn) return;
        btn.querySelector("svg").classList.toggle("active");
        btn.nextSibling.classList.toggle("hidden");
      });
    }
  }

  _addHandlerUploadImage(handler) {
    if (this._imageInputs)
      this._imageInputs.forEach((input) => {
        input.addEventListener("change", (e) => {
          handler(e);
          // TODO:
          // TODO:
          if (input === this._imageInputs[0]) {
            // e.target.files[0] = this._imageInputs[1].files
          }
        });
      });
  }

  _changeRecipeImage(event) {
    const input = event.srcElement;
    const reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    reader.addEventListener("load", () => {
      this._imageContainer.forEach(
        (el) => (el.style.backgroundImage = `url(${reader.result})`)
      );
    });
  }

  _displayOption(id) {
    const option = document.getElementById(id);
    const options = option.querySelectorAll('input[type="text"]');
    option.classList.remove("hidden");
    options.forEach((el) => (el.required = true));
  }

  _hideOption(id) {
    const option = document.getElementById(id);
    const options = option.querySelectorAll('input[type="number"]');
    option.classList.add("hidden");
    options.forEach((el) => (el.required = false));
  }

  _syncInputs(e) {
    if (e.target === this._nameInput1) this._nameInput2.value = e.target.value;
    else if (e.target === this._nameInput2)
      this._nameInput1.value = e.target.value;
    else if (e.target === this._descriptionInput1)
      this._descriptionInput2.value = e.target.value;
    else if (e.target === this._descriptionInput2)
      this._descriptionInput1.value = e.target.value;
  }

  _getCategories() {
    const categorieInputs = this._categoriesForm.querySelectorAll(
      ".admin-menu-subcategory-input"
    );

    const categories = [];
    categorieInputs.forEach((el) => {
      if (el.checked) categories.push(el.previousSibling.innerHTML);
    });

    return categories;
  }

  _getIngredients() {
    return Array.from(this._ingredientsForm.elements)
      .filter((el) => {
        return el.value;
      })
      .map((el) => el.value);
  }

  _getOptions() {
    const selectedOptions = [];
    const data = [];
    this._allOptions.forEach((el) => {
      if (el.classList.contains("hidden")) return;
      else selectedOptions.push(el);
    });

    selectedOptions.forEach((el) => {
      const title = el.querySelector("h1").innerHTML;
      const instructions = el.querySelector("span").innerHTML;
      const type = el.dataset.config.split("-")[0];
      const required = el.dataset.config.split("-")[1];
      const name = el.dataset.config.split("-")[2];
      const needsPrice = el.dataset.config.split("-")[3];
      const errorMessage = el.dataset.errormessage;

      const options = [];
      const optionNodes = el.querySelectorAll(
        ".admin-menu-form-big-option-input"
      );
      optionNodes.forEach((input) => {
        const optionName = input.firstChild.innerHTML.split("<br>")[0];
        const description =
          input.firstChild.innerHTML.split("<br>")[1] || undefined;

        let price;
        if (input.firstChild.nextSibling)
          price = input.firstChild.nextSibling.value;

        options.push({ optionName, description, price });
      });

      data.push({
        name,
        title,
        instructions,
        type,
        required,
        errorMessage,
        options,
      });
    });
    return data;
  }

  addHandlerCreateRecipe(handler) {
    // TODO: Change serving size according to size
    if (this._adminMenuForm)
      this._adminMenuForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const categories = this._getCategories();

        const options = JSON.stringify(this._getOptions());
        const ingredients = this._getIngredients();
        const inputs = this._adminMenuForm.elements;
        const image = inputs[1].files[0] || inputs[6].files[0];

        const form = new FormData();
        form.append("name", inputs[2].value);
        form.append("price", +inputs[3].value);
        form.append("description", inputs[4].value);
        form.append("servingSize", +inputs[8].value);
        form.append("ingredients", ingredients);
        form.append("image", image);
        form.append("categories", categories);
        form.append("options", options);

        handler(form);
        this._adminMenuForm.reset();
        inputs[1].value = null;
        inputs[6].value = null;
      });
  }
}

export default new adminMenuView();
