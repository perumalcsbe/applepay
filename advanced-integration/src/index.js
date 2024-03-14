
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useStore } from './store';
import { CartSummary } from './cartSummary';
import { PaymentMethods } from './paymentMethods';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Control from './control';

const App = () => {
    const meta = useStore(store => store.meta);
    const sdk = useStore(store => store.sdk);
    const currency = useStore(store => store.cart.currency_code);

    return (
        <PayPalScriptProvider options={{
            ...meta,
            ...sdk,
            currency
        }}>
            <>
                <div className="container">
                    <div className="row g-0 border radius">
                        <div className="col">
                            <CartSummary />
                        </div>
                        <div className="col">

                            <PaymentMethods />

                        </div>
                    </div>
                </div>
                <Control />
            </>
        </PayPalScriptProvider>
    )
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />)