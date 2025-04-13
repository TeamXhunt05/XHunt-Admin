

import React, { useState, useEffect, useRef } from 'react';
// import CheckoutForm from './CheckoutForm';
import axios from 'axios';
import Apploader from '../../components/loader/loader';
import { message } from 'antd';
import { CardElement, useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js';
import './index.css'

const baseUrl = process.env.REACT_APP_ApiUrl;
const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#fff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": {
				color: "#fce883"
			},
			"::placeholder": {
				color: "#87bbfd"
			}
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
};


const PaymentPage = (props) => {

	const stripe = useStripe();
	const elements = useElements();
	const buttonClickRef = useRef()
	const [user, setUser] = useState();
	const [loading, setLoading] = useState(false);
	const [price, setPrice] = useState();

	useEffect(() => {
		getToken();
		localStorage.removeItem("stripe_screen", "true")
	}, [])

	const getToken = async () => {
		let user = JSON.parse(localStorage.getItem("user"))
		const res = await axios.get(`${baseUrl}/api/stripe/price`);
		setPrice(res?.data?.price?.plan_price)
		setUser(user)
	}


	const handleToken = async () => {

		setLoading(true)
		try {
			const { data } = await axios.post(`${baseUrl}/api/stripe-pay`, { user });

			let { clientSecret, stripe_payment_id } = data.stripeData;
			const paymentResult = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: elements.getElement(CardElement),
					billing_details: {
						name: user.name,
					},
				},
			});

			if (paymentResult.error) {
				await axios.post(`${baseUrl}/api/stripe-pay-callback`, { stripe_payment_id, status: "FAILED" });
				setLoading(false)
				// alert(paymentResult.error.message);
				message.error(paymentResult.error.message, 5);
				
			} else {
				if (paymentResult.paymentIntent.status === "succeeded") {
					let { data } = await axios.post(`${baseUrl}/api/stripe-pay-callback`, { stripe_payment_id, status: "SUCCESS" });
					setLoading(false)
					// alert(data.message);
				message.success(data.message, 5);

					props.history.push('/login');
				}
			}

		} catch (e) {
			setLoading(false)
		}


		// return
		// setLoading(true)
		// if (data.status) {
		// 	setLoading(false);

		// 	message.success(data.message, 5);
		// 	props.history.push('/login');
		// } else {
		// 	setLoading(false);

		// 	message.error("Something Went Wrong", 5);

		// }
	}



	const add_click = true;
	return (
		<div style={{ backgroundColor: "#eef", height: '100vh' }}>
			<Apploader show={loading} />
			<div className="py-5 text-center">
				<h4>Stripe Payment</h4>
				<h4 className="text-success">${price}</h4>
			</div>

			<div className="row s-box">
				<div className="col-md-6 mx-auto" >
					<fieldset className="FormGroup">
						<CardField />
					</fieldset>

					<center>
						<button onClick={handleToken} className="btn btn-lg btn-primary">
							Proceed To Pay
						</button>
					</center>
				</div>
			</div>


		</div>

	)
}


const CardField = ({ onChange }) => (
	<div className="FormRow">
		<CardElement options={CARD_OPTIONS} onChange={onChange} />
	</div>
);


export default PaymentPage;