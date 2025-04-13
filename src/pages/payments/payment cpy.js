

import React, { useState, useEffect, useRef } from 'react';
// import CheckoutForm from './CheckoutForm';
// import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import Apploader from '../../components/loader/loader';
import { message } from 'antd';

const baseUrl = process.env.REACT_APP_ApiUrl;



const PaymentPage = (props) => {

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


	const handleToken = async (token, addresses) => {

		console.log('token', token)
		return 

		setLoading(true)
		const res = await axios.post(`${baseUrl}/api/stripe-pay`, { token, addresses, user });
		if (res.data.status) {
			setLoading(false);

			message.success(res.data.message, 5);
			props.history.push('/login');
		} else {
			setLoading(false);

			message.error("Something Went Wrong", 5);

		}
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
				<div className="col-md-12">
					<React.Fragment>
						{/* <h4 className="d-flex justify-content-between align-items-center mb-3">
							<span className="text-muted">Pay with card</span>
						</h4>
						{console.log({ user })} */}
						<StripeCheckout
							stripeKey='pk_test_51LDYGLDwWFFOZQ8gH33BEJwdlA31uNNxhsZWTVbIA8wpo5xtMwC7YHWupGF4KEVxB4pZfiyEfMeOMKzNoyVrFBdu00EW7KWDz0'
							token={handleToken}
							billingAddress
							shippingAddress
							email={user?.email}
							amount={price * 100}
							ref={buttonClickRef}
							
						>
							<center>
								<button className="btn btn-lg btn-primary">
									Proceed To Pay
								</button>
							</center>
						</StripeCheckout>
					</React.Fragment>
				</div>
			</div>


		</div>

	)
}


export default PaymentPage;