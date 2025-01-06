import View from "./View.js";

class AdminMenuEdit extends View {
  _parentElement = document.querySelector(".admin-menu-grid");
  _blurOverlay = document.querySelector(".blur-overlay");

  _deleteConfirmModal = document.querySelector(
    ".admin-menu-edit-confirm-delete"
  );

  _deleteConfirmBtn = document.querySelector(
    ".admin-menu-edit-confirm-delete-btn"
  );

  constructor() {
    super();
    this._addEventListeners();
  }

  _addEventListeners() {
    if (document.querySelector(".admin-menu-grid")) {
      this._parentElement.addEventListener("click", (e) => {
        const deleteBtn = e.target.closest(".admin-menu-edit-delete-btn");
        if (!deleteBtn) return;
        const id = deleteBtn.dataset.id;
        this._deleteConfirmModal.querySelector("button").dataset.id = id;

        this._showModal(this._deleteConfirmModal);
      });

      this._blurOverlay.addEventListener("click", (e) => {
        this._hideModal(this._deleteConfirmModal);
      });
    }
  }

  addHandlerDeleteRecipe(handler) {
    if (this._deleteConfirmBtn)
      this._deleteConfirmBtn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this._hideModal(this._deleteConfirmModal);

        handler(id);
      });
  }
}

export default new AdminMenuEdit();
