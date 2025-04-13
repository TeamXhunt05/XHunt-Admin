
import React , { useEffect ,  useState} from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import BasicLayout from '../pages/auth/BasicLayout';
import AppLogin from '../pages/auth/login'; 
import AppRegister from '../pages/auth/register';
import AppVarify from '../pages/auth/varify';
import AppReset from '../pages/auth/reset';
import PaymentPage from '../pages/payments/payment';

import { ElementsConsumer, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function hasLogin(props){
    let token = localStorage.getItem('token');
    let user = localStorage.getItem('user');
    const objUser = JSON.parse(user);

		if(token && objUser){
			return true;
		}
		else{ return false }
	}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      hasLogin() ? (<Component {...props} />) : (<Redirect to={{ pathname: "/login", state: { from: props.location } }} />)
    }
  />
);


function RouterConfig({ history }) {

  const stripe = loadStripe("pk_live_51LDYGLDwWFFOZQ8gxkYEYVKP8tGhl0pfbm7TBmVq4c3qpzqAqjHwy6l20wp0KYvoo7lq1AZj9jc4LgUJ4FAMWa9e00hZbRLTnJ");

  return (
    <Elements stripe={stripe}>
    <Router history={history} basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path='/login' component={AppLogin} />
        <Route exact path='/verify' component={AppVarify} />		
        <Route exact path='/register' component={AppRegister} />
        <Route exact path='/reset' component={AppReset} />
        <Route exact path='/stripe-payment' component={PaymentPage} />
        
        <PrivateRoute path='/' component={BasicLayout} />
      </Switch>
    </Router>
    </Elements>
  );
}




export default RouterConfig;

