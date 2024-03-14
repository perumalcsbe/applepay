import React from "react";
import { useStore } from "./store";
import { countryList } from "./data";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";

export default function Control() {
    const [{ options }, dispatch] = usePayPalScriptReducer();
    const set = useStore(store => store.set);
    const sdk = useStore(store => store.sdk);
    const cart = useStore(store => store.cart);
    const updateBuyerCountry = (event) => {
        const value = event.target.value;
        set('sdk', 'buyerCountry', value);
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                buyerCountry: value,
            },
        })
    }
    const updateCurrency = (event) => {
        const value = event.target.value;
        set('cart', 'currency_code', value);
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: value,
            },
        })
    }

    return (
        <nav className="navbar fixed-bottom bg-dark">
            <div className="container-fluid">
                <div className="row g-3">
                    <div className='col'>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">Buyer Country</span>
                            <select className="form-select" aria-label="Buyer Country" onChange={updateBuyerCountry} value={sdk.buyerCountry}>
                                {countryList.map((country) => (
                                    <option key={country.countryCode} value={country.countryCode}>{country.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon2" >Currency</span>
                            <select className="form-select" aria-label="Currency" onChange={updateCurrency} value={cart.currency_code}><option value="USD">USD</option><option value="AUD">AUD</option><option value="BRL">BRL</option><option value="CAD">CAD</option><option value="CHF">CHF</option><option value="CZK">CZK</option><option value="DKK">DKK</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="HKD">HKD</option><option value="HUF">HUF</option><option value="ILS">ILS</option><option value="JPY">JPY</option><option value="MXN">MXN</option><option value="NOK">NOK</option><option value="NZD">NZD</option><option value="PHP">PHP</option><option value="PLN">PLN</option><option value="RUB">RUB</option><option value="SEK">SEK</option><option value="SGD">SGD</option><option value="THB">THB</option><option value="TWD">TWD</option></select>

                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}