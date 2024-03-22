import fetch from "node-fetch";

// set some important variables
const { CLIENT_ID, APP_SECRET, MERCHANT_ID } = process.env;
const base = "https://api-m.sandbox.paypal.com";


// call the create order method
export async function createOrder(cart) {
  const tax = (cart.tax_rate === 0 || false
    ? 0
    : cart.price * (parseFloat(cart.tax_rate) / 100)) * cart.quantity;
  const total = (cart.price * cart.quantity) + cart.shipping + tax;
  const currency_code = cart.currency_code;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        items: [{
          reference_id: cart.id,
          name: cart.item_name,
          quantity: cart.quantity,
          sku: cart.id,
          unit_amount: {
            currency_code: currency_code,
            value: Number(cart.price).toFixed(2),
          },
          tax: {
            currency_code: currency_code,
            value: Number(tax / cart.quantity).toFixed(2),
          }
        }],
        amount: {
          currency_code: currency_code,
          value: Number(total).toFixed(2),
          breakdown: {
            item_total: {
              currency_code: currency_code,
              value: Number(cart.price * cart.quantity).toFixed(2),
            },
            shipping: {
              currency_code: currency_code,
              value: Number(cart.shipping).toFixed(2),
            },
            tax_total: {
              currency_code: currency_code,
              value: Number(tax).toFixed(2),
            }
          },
        },
        payee: {
          merchant_id: MERCHANT_ID,
        }
      },
    ],
  }
  console.log(JSON.stringify(payload))
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

// capture payment for an order
export async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

// generate access token
export async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

// generate client token
export async function generateClientToken() {
  const accessToken = await generateAccessToken();
  const response = await fetch(`${base}/v1/identity/generate-token`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": "en_US",
      "Content-Type": "application/json",
    },
  });
  const jsonData = await handleResponse(response);
  return jsonData.client_token;
}

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

export async function getOrder(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}`;
  const response = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}