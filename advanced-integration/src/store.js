import { useSyncExternalStore } from 'react'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector'

const createEmitter = () => {
    const subscriptions = new Map()
    return {
        emit: (v) => subscriptions.forEach((fn) => fn(v)),
        subscribe: (fn) => {
            const key = Symbol()
            subscriptions.set(key, fn)
            return () => subscriptions.delete(key)
        }
    }
}

export const createStore = (initialize) => {
    // 1. create an emitter
    const emitter = createEmitter()

    // 2. create store
    let store = null
    const get = () => store
    const set = (op) => {
        store = op(store)
        // notify all subscribers when store updates
        emitter.emit(store)
    }

    // 3. initialize store
    store = initialize(set, get)

    const useStore = (selector) => {
        if (selector) {
            return useSyncExternalStoreWithSelector(
                emitter.subscribe,
                get,
                get,
                selector
            )
        }
        return useSyncExternalStore(emitter.subscribe, get)
    }

    return useStore
}

export const useStore = createStore((set) => ({
    meta: {},
    cart: {
        id: 'WS5XPBM5KBDVU', //'NB5QRK3FJ4ANE',
        item_name: 'T-Shirt',
        price: 20,
        currency_code: 'EUR',
        quantity: 2,
        tax: 12,
        tax_rate: 9,
        shipping: 10
    },
    sdk: {
        //clientId: 'B_AiC0FeU8v-5PeEQ7pQATJSvG4ppKpe8PX--Zmbn8UZUBpSuHvUpu11s9fo51UE5C7ewKg5KxjZjSjkuQ', 
        //merchantId: 'M7JSF3RMJ5DTW',
        //sdkBaseUrl: 'https://www.msmaster.qa.paypal.com/sdk/js',
        clientId: 'AbZtjYpuBgn7oZFlkmvs6t4uGxIpfpCpG8PVUNJlZ2bFuUx-Nc4Kgj-UkYaujZbojuXGZcMyHQh3nDwT', 
        merchantId: 'A2AL8PEZEQKX8',
        buyerCountry: 'DE',
        components: "buttons,applepay,googlepay,payment-fields,marks,funding-eligibility",
        enableFunding: "venmo"
    },
    buttons: {
        selectedFundingSource: ''
    },
    init: (key, value) => set(store => ({
        ...store,
        [key]: {
            ...store[key],
            ...value
        }
    })),
    set: (key, name, value) =>
        set((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [name]: value
            }
        }))
}))