import React, { useState,useEffect } from 'react';
import { loadCart, cartEmpty } from './helper/cartHelper';
import { Link } from 'react-router-dom';
import { getmeToken, processPayment } from './paypalCheckout';
import { createOrder } from './helper/OrderHelper';
import { isAuthenticate } from '../auth/helper';
import DropIn from "braintree-web-drop-in-react"

const PaymentB = ({ products, setReload = f => f, reload = undefined }) => {
    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    });

    const token = isAuthenticate() && isAuthenticate().token;
    const userId = isAuthenticate() && isAuthenticate().user._id;
    console.log("1",token)

    const getToken = (userId, token) => {
        getmeToken(userId, token).then(info => {
             console.log("INFORMATION", info);
            if (info.error) {
                setInfo({ ...info, error: info.error });
            } else {
                const clientToken = info.clientToken;
                setInfo({ clientToken });
            }
        });
    };

    const showbtdropIn = () => {
        return (
            <div>
                {info.clientToken !== null && products.length > 0 ? (
                    <div>
                        <DropIn
                            options={{ authorization: info.clientToken }}
                            onInstance={instance => (info.instance = instance)}
                        />
                        <button className="btn btn-block btn-success" onClick={onPurchase}>
                            Buy
            </button>
                    </div>
                ) : (
                        <h3>Please login or add something to cart</h3>
                    )}
            </div>
        );
    };

    useEffect(() => {
        getToken(userId, token);
    }, []);

    const onPurchase = () => {
        setInfo({ loading: true });
        let nonce;
        let getNonce = info.instance.requestPaymentMethod().then(data => {
            nonce = data.nonce;
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getAmount()
            };
            processPayment(userId, token, paymentData)
                .then(response => {
                    setInfo({ ...info, success: response.success, loading: false });
                    console.log("PAYMENT SUCCESS");
                    const orderData = {
                        products: products,
                        transaction_id: response.transaction.id,
                        amount: response.transaction.amount
                    }
                    console.log("ORDER DATA:", orderData)
                    createOrder(userId, token, orderData)
                    //empty the cart
                    cartEmpty(() => {
                        console.log("empty")
                    })

                    // force reload
                    setReload(!reload)
                })
                .catch(error => {
                    setInfo({ loading: false, success: false });
                    console.log("PAYMENT FAILED");
                });
        });
    };

    const getAmount = () => {
        let amount = 0;
        products.map(p => {
            amount = amount + p.price;
        });
        return amount;
    };

    
    return (
        <div>
            <h3>Welcome, your Bill is {getAmount()}</h3>

            {showbtdropIn()}
        </div>
    );
};

export default PaymentB;
