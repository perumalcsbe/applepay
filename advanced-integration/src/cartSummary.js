import React from "react";
import { useStore } from "./store";
import { formatCurrency } from "./utils";

export function CartSummary() {
    const cart = useStore(store => store.cart);
    const total = (cart.price * cart.quantity) + cart.shipping + cart.tax;
    return (
        <div className=" bg-light p-5 flex flex-column" style={{ minHeight: "100%" }}>
            <h6>Test Store</h6>
            <h6 className="text-muted">Purchase details</h6>
            <p>{cart.item_name}</p>
            <dl className="row">
                <dt className="col-sm-9">Quantity</dt>
                <dd className="col-sm-3">{cart.quantity}</dd>
                <dt className="col-sm-9">Subtotal</dt>
                <dd className="col-sm-3">{formatCurrency(cart.price * cart.quantity, cart.currency_code)} {cart.currency_code}</dd>
                <dt className="col-sm-9">Tax</dt>
                <dd className="col-sm-3">{formatCurrency(cart.tax, cart.currency_code)} {cart.currency_code}</dd>
                <dt className="col-sm-9">Shipping (Standard 5-7 days)</dt>
                <dd className="col-sm-3">{formatCurrency(cart.shipping, cart.currency_code)} {cart.currency_code}</dd>
                <hr className="border opacity-75" />
                <dt className="col-sm-9">Total</dt>
                <dd className="col-sm-3">{formatCurrency(total, cart.currency_code)} {cart.currency_code}</dd>
            </dl>
        </div>
    )
}