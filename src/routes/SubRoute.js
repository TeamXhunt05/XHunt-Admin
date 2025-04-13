import React, { Component, Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import { Redirect } from 'dva/router';

//DASHBOARD
import Dashboard from '../pages/dashboard/dashboard';

 





//ACCOUNT
import Account from '../pages/account/index';

//PAGES(CMS) 
import PagesList from '../pages/pages/list';
import AddEditPages from '../pages/pages/action/addEdit';

//SETTINGS
import SiteSetting from '../pages/site-setting/list';
import Setting from '../pages/setting/setting';


import PaymentList from '../pages/payment-list/list';


//STORE MANAGMENT
import StoreList from '../pages/store/list';
import AddEditStore from '../pages/store/action/addEdit';
import AddEditStoreAdmin from '../pages/store/action/addEditAdmin';
import ViewStore from '../pages/store/action/view';

//PIN MANAGMENT
import PinList from '../pages/pin/list';
import PinAditEdit from '../pages/pin/action/addEdit';
import PinAditEditAdmin from '../pages/pin/action/addEditAdmin';
import PinView from '../pages/pin/action/view';

//PRODUCT MANAGMENT
import ProductList from '../pages/product/list';
import ProductAditEdit from '../pages/product/action/addEdit';
import ProductAditEditAdmin from '../pages/product/action/addEditProductAdmin';

import ProductView from '../pages/product/action/view';



//STORE USER MANAGMENT
import StoreUserList from '../pages/storeuser/list';
import AddEditStoreUser from '../pages/storeuser/action/addEdit';
import ViewStoreUser from '../pages/storeuser/action/view';


//CUSTOMER MANAGMENT
import CustomerList from '../pages/customer/list';
import AddEditCustomer from '../pages/customer/action/addEdit';
import ViewCustomer from '../pages/customer/action/view';


//ACCOUNT MANAGMENT
import BusinessList from '../pages/business/list';
import ViewBusiness from '../pages/business/action/view';

//ORDER MANAGMENT
import OrderList from '../pages/order/list';
import AddEditOrder from '../pages/order/action/addEdit';
import AddEditOrderAdmin from '../pages/order/action/addEditAdmin';
import ViewOrder from '../pages/order/action/view';



function hasAdmin() {
	let role = localStorage.getItem('role');
	if (role === "ADMIN") {
		return true;
	}
	else { return false }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			hasAdmin() ? (<Component {...props} />) : (<Redirect to={{ pathname: "/", state: { from: props.location } }} />)
		}
	/>
);

class SubRoute extends Component {


	render() {
		return (
			<div>
				{/* Dashboard */}
				<Route exact name="Dashboad" breadcrumbName="Dashboad" path={'/'} component={Dashboard} />


				{/* ACCOUNT ROUTES */}
				<Route exact path={"/account"} component={Account} />
				{/* END ROUTES */}

				{/*START PAGE ROUTES */}
				<PrivateRoute exact path={"/pages"} component={PagesList} />
				<PrivateRoute exact path={"/pages/add"} component={AddEditPages} />
				<PrivateRoute exact path='/pages/edit/:id' component={AddEditPages} />
				{/*END PAGE ROUTES */}


				{/* SETTING ROUTES */}
				<PrivateRoute exact path={`/settings`} component={SiteSetting} />
				<PrivateRoute exact path={`/setting`} component={Setting} />
				{/* END SETTING ROUTES */}

	

				{/* <Route exact path='/stripe-payment' component={PaymentPage} /> */}

			


				<Route exact path='/payment-list' component={PaymentList} />



				
				{/*START Store Routes */}
				<Route exact path='/stores' component={StoreList} />
				<Route exact path='/store/edit/:id' component={AddEditStore} />
				<Route exact path='/store/add' component={AddEditStore} />
				<Route exact path='/admin/store/edit/:id/:user_id' component={AddEditStoreAdmin} />
				<Route exact path='/admin/store/add/:user_id' component={AddEditStoreAdmin} />
				<Route exact path='/store/view/:id' component={ViewStore} />
				{/*End Employee Routes */}

					{/* Pin START */}
					<Route exact path='/pins' component={PinList} />
				<Route exact path='/pin/add/:category' component={PinAditEdit} />
				<Route exact path='/pin/edit/:id/:category' component={PinAditEdit} />
				<Route exact path='/pin/admin/add/:user_id/:category' component={PinAditEditAdmin} />
				<Route exact path='/pin/admin/edit/:id/:user_id/:category' component={PinAditEditAdmin} />
				<Route exact path='/pin/view/:id' component={PinView} />
				{/*End Pin Routes */}

					{/* Pin START */}
				<Route exact path='/products' component={ProductList} />
				<Route exact path='/products/:user_id' component={ProductList} />

				<Route exact path='/product/add' component={ProductAditEdit} />
				<Route exact path='/product/add/:user_id' component={ProductAditEdit} />
				<Route exact path='/product/edit/:id/:user_id' component={ProductAditEdit} />


				<Route exact path='/product/edit/:id' component={ProductAditEdit} />
				<Route exact path='/product/admin/add/:user_id/:category' component={ProductAditEditAdmin} />
				<Route exact path='/product/admin/edit/:id/:user_id/:category' component={ProductAditEditAdmin} />


				<Route exact path='/product/view/:id' component={ProductView} />
				{/*End Pin Routes */}


				
				

				{/*START Store User Routes */}
				<Route exact path='/store-users' component={StoreUserList} />
				<Route exact path='/store-user/edit/:id' component={AddEditStoreUser} />
				<Route exact path='/store-user/add' component={AddEditStoreUser} />
				<Route exact path='/store-user/view/:id' component={ViewStoreUser} />
				{/*End Store User Routes */}

				{/*START Customer Routes */}
				<Route exact path='/customers' component={CustomerList} />
				<Route exact path='/customer/edit/:id' component={AddEditCustomer} />
				<Route exact path='/customer/add' component={AddEditCustomer} />
				<Route exact path='/customer/view/:id' component={ViewCustomer} />
				{/*End Customer Routes */}


				{/*START Customer Routes */}
				<Route exact path='/approve' component={BusinessList} />
				<Route exact path='/approve/view/:id' component={ViewBusiness} />
				{/*End Customer Routes */}


	
				{/*START Order Routes */}
				<Route exact path='/orders' component={OrderList} />
				<Route exact path='/order/edit/:id' component={AddEditOrder} />
				<Route exact path='/order/add' component={AddEditOrder} />
				<Route exact path='/admin/order/edit/:id/:user_id' component={AddEditOrderAdmin} />
				<Route exact path='/admin/order/add/:user_id' component={AddEditOrderAdmin} />
				<Route exact path='/order/view/:id' component={ViewOrder} />
				{/*End Order Routes */}




			</div>



		);
	}
}

export default SubRoute;