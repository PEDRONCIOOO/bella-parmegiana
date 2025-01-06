import View from "./View.js";
import { MERCADO_PAGO_PUBLIC_KEY } from "../config.js";

class checkoutPaymentView extends View {
  _bricksContainer = document.querySelector("#paymentBrick_container");

  _token = window.location.pathname.split("/")[2];

  initBricks(MercadoPago, order) {
    const amount =
      order.order.reduce((acc, cur) => (acc += cur.price), 0) +
      order.address.deliveryFee;

    const mp = new MercadoPago(MERCADO_PAGO_PUBLIC_KEY);
    const bricksBuilder = mp.bricks();
    const renderPaymentBrick = async (bricksBuilder) => {
      const settings = {
        initialization: {
          payer: {
            email: order.user ? order.user.email : undefined,
          },
          amount,
        },
        customization: {
          paymentMethods: {
            bankTransfer: "all",
            creditCard: "all",
            debitCard: "all",
            minInstallments: 1,
            maxInstallments: 1,
          },
          visual: {
            style: {
              customVariables: {
                baseColor: "#ffb005",
                baseColorFirstVariant: "#b8810c",
                baseColorSecondVariant: "#b8810c",
              },
            },
          },
        },
        callbacks: {
          onReady: () => {
            /*
               Callback chamado quando o Brick estiver pronto.
               Aqui você pode ocultar loadings do seu site, por exemplo.
              */
          },
          onSubmit: ({ selectedPaymentMethod, formData }) => {
            // callback chamado ao clicar no botão de submissão dos dados
            return new Promise((resolve, reject) => {
              fetch(`/api/v1/payment/${this._token}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              })
                .then((response) => response.json())
                .then((response) => {
                  // receber o resultado do pagamento
                  if (response.paymentStatus === "rejected")
                    return location.assign("/checkout-fail");
                  location.assign(
                    `/checkout-finish/${window.location.pathname.split("/")[2]}`
                  );

                  resolve();
                })
                .catch((error) => {
                  // lidar com a resposta de erro ao tentar criar o pagamento
                  reject();
                });
            });
          },
          onError: (error) => {
            // callback chamado para todos os casos de erro do Brick
            location.assign("/checkout-fail");
          },
        },
      };
      window.paymentBrickController = await bricksBuilder.create(
        "payment",
        "paymentBrick_container",
        settings
      );
    };

    renderPaymentBrick(bricksBuilder);
  }

  addGetOrderHandler(handler) {
    if (this._bricksContainer) {
      handler(this._token);
    }
  }
}

export default new checkoutPaymentView();
