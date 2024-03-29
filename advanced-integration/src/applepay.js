import React, { useEffect } from "react";
import { useStore } from "./store";
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */



export function ApplePayButtonContainer() {
    const selectedFundingSource = useStore(store => store.buttons.selectedFundingSource);
    const cart = useStore(store => store.cart);
    async function setupApplepay(cart) {
        const applepay = paypal.Applepay();
        const {
            isEligible,
            countryCode,
            currencyCode,
            merchantCapabilities,
            supportedNetworks,
        } = await applepay.config();

        if (!isEligible) {
            throw new Error("applepay is not eligible");
        }
        document.getElementById("applepay-container").innerHTML =
            '<apple-pay-button id="btn-appl" buttonstyle="black" type="plain" locale="en">';

        document.getElementById("btn-appl").addEventListener("click", onClick);

        const resultElement = document.getElementById("result");
        const modal = document.getElementById("resultModal");
        resultElement.innerHTML = ""

        const tax = (cart.tax_rate === 0 || false
            ? 0
            : cart.price * (parseFloat(cart.tax_rate) / 100)) * cart.quantity;

        async function onClick() {
            console.log({ merchantCapabilities, currencyCode, supportedNetworks })

            const paymentRequest = {
                countryCode,
                merchantCapabilities,
                supportedNetworks,
                requiredBillingContactFields: ["name", "phone", "email", "postalAddress"],
                requiredShippingContactFields: [
                    "postalAddress",
                    "phone",
                    "name",
                    "email",
                ],
                currencyCode: cart.currency_code,
                lineItems: [
                    {
                        label: `${cart.item_name} x ${cart.quantity}`,
                        amount: (cart.price * cart.quantity).toFixed(2).toString(),

                    },
                    {
                        label: "Subtotal",
                        amount: (cart.price * cart.quantity).toFixed(2).toString(),
                    },
                    {
                        label: "Tax",
                        amount: (tax).toFixed(2).toString(),
                    },
                    {
                        label: "Shipping",
                        amount: (cart.shipping).toFixed(2).toString(),
                    }
                ],
                total: {
                    label: cart.item_name,
                    amount: ((cart.price * cart.quantity) + cart.shipping + tax).toFixed(2).toString(),
                    type: "final",
                },
            };
            console.log(JSON.stringify(paymentRequest));
            // eslint-disable-next-line no-undef
            let session = new ApplePaySession(4, paymentRequest);

            session.onvalidatemerchant = (event) => {
                applepay
                    .validateMerchant({
                        validationUrl: event.validationURL,
                    })
                    .then((payload) => {
                        session.completeMerchantValidation(payload.merchantSession);
                    })
                    .catch((err) => {
                        console.error(err);
                        session.abort();
                    });
            };

            session.onpaymentmethodselected = () => {
                session.completePaymentMethodSelection({
                    newTotal: paymentRequest.total,
                });
            };

            session.onpaymentauthorizedOld = async (event) => {
                try {
                    /* Create Order on the Server Side */
                    const orderResponse = await fetch(`/api/orders`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(cart)
                    })
                    if (!orderResponse.ok) {
                        throw new Error("error creating order")
                    }

                    const { id } = await orderResponse.json()
                    console.log({ id })

                    console.log(event.payment)
                    /**
                     * Confirm Payment 
                     */
                    await applepay.confirmOrder({ orderId: id, token: event.payment.token, billingContact: event.payment.billingContact, shippingContact: event.payment.shippingContact });

                    /*
                    * Capture order (must currently be made on server)
                    */
                    const response = await fetch(`/api/orders/${id}/capture`, {
                        method: 'POST',
                    }).then(res => res.json());
                    console.log(" ===== Order Capture Completed ===== ");

                    console.log(" ===== Order Capture Completed ===== ")
                    modal.style.display = "block";
                    resultElement.innerHTML = prettyPrintJson.toHtml(response, {
                        indent: 2
                    });

                    session.completePayment({
                        status: window.ApplePaySession.STATUS_SUCCESS,
                    });
                } catch (err) {
                    console.error(err);
                    session.completePayment({
                        status: window.ApplePaySession.STATUS_FAILURE,
                    });
                }
            };

            session.onpaymentauthorized = async (event) => {
                try {
                    const { access_token } = await fetch(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, {
                        method: "post",
                        body: "grant_type=client_credentials",
                        headers: {
                            Authorization: `Basic QWJadGpZcHVCZ243b1pGbGttdnM2dDR1R3hJcGZwQ3BHOFBWVU5KbFoyYkZ1VXgtTmM0S2dqLVVrWWF1alpib2p1WEdaY015SFFoM25Ed1Q=`,

                            //Authorization: 'Basic Ql9BaUMwRmVVOHYtNVBlRVE3cFFBVEpTdkc0cHBLcGU4UFgtLVptYm44VVpVQnBTdUh2VXB1MTFzOWZvNTFVRTVDN2V3S2c1S3hqWmpTamt1UQ=='
                        },
                    }).then((res) => res.json());
                    /* Create Order on the Server Side */
                    const { context_id } = await fetch(`https://api-m.sandbox.paypal.com/v1/checkout/links/NB5QRK3FJ4ANE/create-context`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "authorization": `Bearer ${access_token}`
                        },
                        body: JSON.stringify({
                            "entry_point": "SDK",
                            "quantity": "2"
                        }),
                    }).then((res) => res.json());

                    /**
                     * Confirm Payment 
                     */
                    await applepay.confirmOrder({ orderId: context_id, token: event.payment.token, billingContact: event.payment.billingContact, shippingContact: event.payment.shippingContact });

                    /*
                    * Capture order (must currently be made on server)
                    */
                    const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v1/checkout/links/NB5QRK3FJ4ANE/pay`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "authorization": `Bearer ${access_token}`
                        },
                        body: JSON.stringify({
                            "entry_point": "SDK",
                            "context_id": context_id
                        }),
                    }).then(res => res.json())
                    console.log(" ===== Order Capture Completed ===== ");

                    console.log(" ===== Order Capture Completed ===== ")
                    modal.style.display = "block";
                    resultElement.innerHTML = prettyPrintJson.toHtml(captureResponse, {
                        indent: 2
                    });

                    session.completePayment({
                        status: window.ApplePaySession.STATUS_SUCCESS,
                    });
                } catch (err) {
                    console.error(err);
                    session.completePayment({
                        status: window.ApplePaySession.STATUS_FAILURE,
                    });
                }
            };

            session.oncancel = () => {
                console.log("Apple Pay Cancelled !!")
            }

            session.begin();
        }
    }
    useEffect(() => {
        // eslint-disable-next-line no-undef
        if (selectedFundingSource === 'applepay' && window?.ApplePaySession && ApplePaySession?.supportsVersion(4) && ApplePaySession?.canMakePayments()) {
            setupApplepay(cart).catch(console.error);
        }
    }, [])


    if (selectedFundingSource !== 'applepay') return null
    return (
        <div id="applepay-container">
        </div>
    )

}
