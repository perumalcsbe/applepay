
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useStore } from './store';
import { CartSummary } from './cartSummary';
import { PaymentMethods } from './paymentMethods';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const App = () => {
    const meta = useStore(store => store.meta);
    const sdk = useStore(store => store.sdk);

    return (
        <>
            <div className="container">
                <div className="row g-0 border radius">
                    <div className="col">
                        <CartSummary />
                    </div>
                    <div className="col">
                        <PayPalScriptProvider options={{
                            ...meta,
                            ...sdk
                        }}>
                            <PaymentMethods />
                        </PayPalScriptProvider>
                    </div>
                </div>
            </div>
            <nav className="navbar fixed-bottom bg-dark">
                <div className="container-fluid">
                    <div className="row g-3">
                        <div className='col'>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Buyer Country</span>
                                <select className="form-select" aria-label="Default select example">
                                    <option value="US">US</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>
                        <div className='col'>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Currency</span>
                                <select className="form-select" aria-label="Default select example">
                                    <option value="USD">USD</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />)