import React, { useEffect } from "react";
import {
    PayPalButtons,
    PayPalMarks,
    usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { setupApplepay } from "./applepay";
import { onGooglePayLoaded } from "./googlepay";
import { useStore } from "./store";
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
    return (
        <ul className="list-group list-group-flush">
            {fundingSources.filter((fundingSource) => fundingSource === 'googlepay' || paypal?.isFundingEligible(fundingSource)).map(fundingSource => {
                const button = paypal.Buttons({
                    fundingSource: fundingSource,
                });
                return (
                    <li key={fundingSource} className="list-group-item d-flex align-items-center">
                        <input className="form-check-input me-1" type="radio" name="fundingsource" checked={fundingSource === selectedFundingSource} value={fundingSource} id={fundingSource} onChange={() => set('buttons', 'selectedFundingSource', fundingSource)} />
                        <label className="form-check-label" htmlFor={fundingSource}>{button.isEligible() ? (
                            <PayPalMarks fundingSource={fundingSource} />
                        ) : (
                            fundingSource == 'googlepay' ? 'Google Pay' : 'Apple Pay'
                        )}</label>
                    </li>
                )
            })}
        </ul>
    )
}


export function PaymentMethods() {
    const [{ isResolved }] = usePayPalScriptReducer();
    const selectedFundingSource = useStore(store => store.buttons.selectedFundingSource);

    useEffect(() => {
        // eslint-disable-next-line no-undef
        if (isResolved && selectedFundingSource === 'applepay' && window?.ApplePaySession && ApplePaySession?.supportsVersion(4) && ApplePaySession?.canMakePayments()) {
            setupApplepay().catch(console.error);
        }
        // eslint-disable-next-line no-undef
        if (isResolved && selectedFundingSource === 'googlepay' && window?.google && window?.paypal?.Googlepay) {
            onGooglePayLoaded().catch(console.log);
        }
    }, [isResolved, selectedFundingSource])
    return (
        <div className=" bg-white p-5 flex flex-column" style={{ minHeight: "100%" }}>
            <h6 className="mb-3">Accepted payment methods</h6>

            <FundingList />

            {selectedFundingSource === 'applepay' &&
                <div id="applepay-container"></div>}
            {selectedFundingSource === 'googlepay' && <div id="googlepay-container"></div>}
            {!['', 'applepay', 'googlepay'].includes(selectedFundingSource) &&
                <PayPalButtons
                    fundingSource={selectedFundingSource}
                    forceReRender={[selectedFundingSource]}
                />
            }
        </div>
    )
}