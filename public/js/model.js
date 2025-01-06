import { request } from "./helpers.js";

export const state = {
  recipes: [],
  newRecipes: [],
  page: 1,
  count: undefined,
  curCategories: undefined,
  shoppingCart: [],
  order: undefined,
  orders: undefined,
};

export const sendLoginRequest = async function (email, password) {
  try {
    const res = await request("users/login", "POST", {
      email,
      password,
    });

    return res;
  } catch (err) {
    throw err;
  }
};

export const sendLogoutRequest = async function () {
  try {
    await request("users/logout");
  } catch (err) {
    throw new Error(`Erro ao efetuar o logout!Por favor tente novamente`);
  }
};

export const sendUpdateUserRequest = async function (data, type) {
  try {
    const path =
      type === "password" ? "users/updateMyPassword" : "users/updateMe";

    await request(path, "PATCH", data);
  } catch (err) {
    throw err;
  }
};

export const sendAddAdressRequest = async function (data) {
  try {
    const res = await request("users/addresses", "POST", {
      data,
    });
  } catch (err) {
    throw err;
  }
};

// TODO: Reativar helmet, descobrir como fazer o fetch funcionar mesmo com ele ativo.
//TODO: Adicionar error handling aqui
export const fetchCEPinfo = async function (cep) {
  try {
    //
    const res = await fetch(`https://api.brasilaberto.com/v1/zipcode/${cep}`);
    const data = await res.json();

    if (data.result.error)
      throw new Error(
        "Erro ao pegar informações, certifique-se de que o CEP está correto!"
      );

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendDeleteAddressRequest = async function (id) {
  try {
    await request("users/addresses", "DELETE", {
      id,
    });
  } catch (err) {
    throw err;
  }
};

export const sendCreateRecipeRequest = async function (formData) {
  try {
    const data = await fetch(`recipes`, {
      method: "POST",
      body: formData,
    });
    const res = await data.json();
    if (res.status === "error" || res.status === "fail") {
      throw new Error(res.message);
    }
  } catch (err) {
    throw err;
  }
};

export const sendDeleteRecipeRequest = async function (id) {
  try {
    const res = await request(`recipes/${id}`, "DELETE");
  } catch (err) {
    throw err;
  }
};

export const sendResetPasswordRequest = async function (
  token,
  password,
  passwordConfirm
) {
  try {
    await request(`users/resetPassword/${token}`, "PATCH", {
      password,
      passwordConfirm,
    });
  } catch (err) {
    throw err;
  }
};

export const sendSignUpRequest = async function (data) {
  try {
    await request(`users/signup`, "POST", data);
  } catch (err) {
    throw err;
  }
};

export const sendConfirmEmailRequest = async function (token) {
  try {
    await request(`users/confirmEmail/${token}`, "PATCH");
  } catch (err) {
    throw err;
  }
};

export const sendForgotPasswordEmailRequest = async function (email) {
  try {
    await request(`users/forgotPassword`, "POST", { email });
  } catch (err) {
    throw err;
  }
};

export const sendRequestGetRecipes = async function (
  categories,
  count = true,
  page = 1
) {
  try {
    state.curCategories = categories;

    let queryString;
    if (categories === "all") {
      queryString = `?page=${page}${count ? "&count=true" : ""}`;
    } else
      queryString = `?categories=${JSON.stringify(
        categories.split(",")
      )}&page=${page}${count ? "&count=true" : ""}`;

    const res = await request(`recipes${queryString}`);

    state.page = page;
    if (page > 1) state.recipes.push(...res.data.data);
    else state.recipes = res.data.data;

    state.newRecipes = res.data.data;

    if (res.count) state.count = res.count;
  } catch (err) {
    throw err;
  }
};

export const sendCreateOrderRequest = async function (shoppingCartData) {
  try {
    const res = await request(`orders/validateOrder`, "POST", shoppingCartData);

    return res;
  } catch (err) {
    throw err;
  }
};

export const sendCreatePreferenceRequest = async function (token, address) {
  try {
    const res = await request(`orders`, "POST", {
      token,
      address,
    });

    return res;
  } catch (err) {
    throw err;
  }
};

export const sendGetOrderRequest = async function (token) {
  try {
    const res = await request(`orders/${token}`);

    state.order = res.data.order;
  } catch (err) {
    throw err;
  }
};
export const sendGetOrdersRequest = async function (token) {
  try {
    const res = await request(`orders`);

    state.orders = res.data;
  } catch (err) {
    throw err;
  }
};

export const sendUpdateOrderRequest = async function (id) {
  try {
    const res = await request(`orders/${id}`, "PATCH");

    const orderIndex = state.orders.findIndex(
      (order) => order._id === res.data.order._id
    );
    state.orders[orderIndex] = res.data.order;

    return res.data.order;
  } catch (err) {
    throw err;
  }
};
export const sendCancelOrderRequest = async function (orderId) {
  try {
    const res = await request(`payment/${orderId}`, "PATCH");

    const orderIndex = state.orders.findIndex(
      (order) => order._id === res.data.order._id
    );

    state.orders[orderIndex] = res.data.order;

    return res.data.order;
  } catch (err) {
    throw err;
  }
};
