import React, { useEffect } from "react";
import {
    PayPalButtons,
    PayPalMarks,
    usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { ApplePayButtonContainer, setupApplepay } from "./applepay";
import { GooglePayButtonContainer } from "./googlepay";
import { useStore } from "./store";
import PayPalMarkContainer from "./apm";
const fundingSources = [
    "paypal",
    "venmo",
    "itau",
    "credit",
    "paylater",
    "applepay",
    "googlepay",
    "ideal",
    "sepa",
    "bancontact",
    "giropay",
    "eps",
    "sofort",
    "mybank",
    "blik",
    "p24",
    "wechatpay",
    "payu",
    "trustly",
    "oxxo",
    "boleto",
    "boletobancario",
    "mercadopago",
    "multibanco",
    "satispay",
    "paidy",
    "card",
];

function FundingList() {
    const [{ isPending }] = usePayPalScriptReducer();
    const set = useStore(store => store.set);
    const selectedFundingSource = useStore(store => store.buttons.selectedFundingSource);
    if (isPending) {
        return (
            <ul className="list-group list-group-flush">
                <li className="list-group-item placeholder-glow">
                    <span className="placeholder col-6" />
                </li>
                <li className="list-group-item placeholder-glow">
                    <span className="placeholder col-6" />
                </li>
                <li className="list-group-item placeholder-glow">
                    <span className="placeholder col-6" />
                </li>
                <li className="list-group-item placeholder-glow">
                    <span className="placeholder col-6" />
                </li>
            </ul>
        )
    }
    // eslint-disable-next-line no-undef
    const showApplePay = window?.ApplePaySession && ApplePaySession?.supportsVersion(4) && ApplePaySession?.canMakePayments()
    return (
        <ul className="list-group list-group-flush">
            {fundingSources.filter((fundingSource) => fundingSource === 'googlepay' || paypal?.isFundingEligible(fundingSource)).map(fundingSource => {
                const button = paypal.Buttons({
                    fundingSource: fundingSource,
                });
                if (fundingSource === 'applepay' && !showApplePay) return null;
                return (
                    <li key={fundingSource} className="list-group-item">
                        <p className="form-check">
                            <input className="form-check-input me-1" type="radio" name="fundingsource" checked={fundingSource === selectedFundingSource} value={fundingSource} id={fundingSource} onChange={() => set('buttons', 'selectedFundingSource', fundingSource)} />
                            <label className="form-check-label" htmlFor={fundingSource}>{button.isEligible() ? (
                                <PayPalMarks fundingSource={fundingSource} />
                            ) : (
                                fundingSource == 'googlepay' ? 'Google Pay' : 'Apple Pay'
                            )}</label>
                        </p>
                        {/*selectedFundingSource === fundingSource && selectedFundingSource === 'applepay' &&
                            <div id="applepay-container"></div>*/}
                        {/*selectedFundingSource === 'googlepay' && <div id="googlepay-container"></div>*/}
                        {selectedFundingSource === fundingSource && ['ideal', 'sofort', 'p24', 'giropay', 'mybank', 'multibanco', 'eps', 'blik', 'bancontact'].includes(selectedFundingSource) &&
                            <PayPalMarkContainer />}
                        {selectedFundingSource === fundingSource && !['', 'applepay', 'googlepay'].includes(selectedFundingSource) &&
                            <div className="paypal-container">
                                <PayPalButtons
                                    fundingSource={selectedFundingSource}
                                    forceReRender={[selectedFundingSource]}
                                />
                            </div>
                        }
                        {selectedFundingSource === fundingSource &&
                            <GooglePayButtonContainer />}

                        {selectedFundingSource === fundingSource &&
                            <ApplePayButtonContainer />}

                    </li>
                )
            })}
        </ul>
    )
}


export function PaymentMethods() {
    const [{ isResolved }] = usePayPalScriptReducer();
    //const cart = useStore(store => store.cart);
    const selectedFundingSource = useStore(store => store.buttons.selectedFundingSource);

    useEffect(() => {
        // eslint-disable-next-line no-undef
        if (isResolved && selectedFundingSource === 'applepay' && window?.ApplePaySession && ApplePaySession?.supportsVersion(4) && ApplePaySession?.canMakePayments()) {
            setupApplepay().catch(console.error);
        }
        // eslint-disable-next-line no-undef
        /*
        if (isResolved && selectedFundingSource === 'googlepay' && window?.google && window?.paypal?.Googlepay) {
            onGooglePayLoaded({
                displayItems: [{
                  label: "Subtotal",
                  type: "SUBTOTAL",
                  price: (cart.price * cart.quantity).toFixed(2).toString(),
                },
                {
                  label: "Tax",
                  type: "TAX",
                  price: (cart.tax).toFixed(2).toString(),
                },
                {
                    label: "Shipping",
                    type: "LINE_ITEM",
                    price: (cart.shipping).toFixed(2).toString(),
                  }
                ],
                currencyCode: cart.currency_code,
                totalPriceStatus: "FINAL",
                totalPrice: ((cart.price * cart.quantity) + cart.shipping + cart.tax).toFixed(2).toString(),
                totalPriceLabel: "Total"
              }).catch(console.log);
        }*/
    }, [isResolved, selectedFundingSource])
    return (
        <div className=" bg-white p-5 flex flex-column" style={{ minHeight: "100%" }}>
            <h6 className="mb-3">Accepted payment methods</h6>

            <FundingList />


        </div>
    )
}