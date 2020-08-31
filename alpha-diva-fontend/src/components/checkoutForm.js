import React,{useState,useEffect} from 'react';
import {
    CardElement,
    useStripe,
    useElements
  } from "@stripe/react-stripe-js";
import config from '../includes/config';
import './checkout.css'
import axios from 'axios';
var user = require('../includes/getUserDetails');

  function App(props){
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(props.clientSecret);
    const stripe = useStripe();
    const elements = useElements();


  
 
    
      const cardStyle = {
        style: {
          base: {
            color: "#32325d",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#32325d"
            }
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
          }
        }
      };

      const handleChange = async (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
      };

      const handleSubmit = async ev => {
        ev.preventDefault();
        setProcessing(true);
        const payload = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: ev.target.name.value
            }
          }
        });
        if (payload.error) {
          setError(`Payment failed ${payload.error.message}`);
          setProcessing(false);
        } else {
          setError(null);
          setProcessing(false);
          //setSucceeded(true);

            if(!props.register){
              props.handleChange();
              return;
            }
            var otherData = props.body;
            const response = await axios.post(
                config.apiBaseUrl+"/stripe/checkout",
                { otherData },{withCredentials: true}
            );

          
            if (response.status === 200) {
                setProcessing(false);
                user.getUserDetails("");
            } else {
                setError(`Oops! an error occured`);
            }
        }
      };

    return(
      <form id="payment-form" onSubmit={handleSubmit}>
        <CardElement id="card-element" options={cardStyle} onChange={handleChange} />

        <button
        disabled={processing || disabled || succeeded}
        id="submit"
      >
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Pay {"+props.amount+")"
          )}
        </span>
      </button>

      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}

      {/* Show a success message upon completion */}
      <p className={succeeded ? "result-message" : "result-message hidden"}>
        Payment succeeded, see the result in your
        <a
          href={`https://dashboard.stripe.com/test/payments`}
        >
          {" "}
          Stripe dashboard.
        </a> Refresh the page to pay again.
      </p>

      </form>
    )
  }

  export default App;