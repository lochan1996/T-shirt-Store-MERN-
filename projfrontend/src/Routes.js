import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from "./core/Home"
import Signup from './user/Signup';
import Signin from './user/Signin'
import AdminRoute from './auth/helper/AdminRoutes';
import PrivateRoute from './auth/helper/PrivateRoutes';
import UserDashboard from './user/UserDashBoard';
import AdminDashboard from './user/AdminDashBoard';
import AddCatergory from './admin/AddCategory';
import ManageCategories from './admin/ManageCategories';
import AddProduct from './admin/AddProduct';
import ManageProducts from './admin/ManageProducts';
import UpdateProduct from './admin/UpdateProduct';
import UpdateCategory from './admin/UpdateCategory';
import Cart from './core/Cart';


const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}></Route>
                <Route path="/signup" exact component={Signup}></Route>
                <Route path="/signin" exact component={Signin}></Route>
                <Route path="/cart" exact component={Cart}></Route>

                <PrivateRoute path="/user/dashboard" exact component={UserDashboard}></PrivateRoute>
                <AdminRoute path="/admin/dashboard" exact component={AdminDashboard}></AdminRoute>
                <AdminRoute path="/admin/create/category" exact component={AddCatergory}></AdminRoute>
                <AdminRoute path="/admin/categories" exact component={ManageCategories}></AdminRoute>
                <AdminRoute path="/admin/products" exact component={ManageProducts}></AdminRoute>
                <AdminRoute path="/admin/create/product" exact component={AddProduct}></AdminRoute>
                <AdminRoute path="/admin/product/update/:productId" exact component={UpdateProduct}></AdminRoute>
                <AdminRoute path="/admin/category/update/:categoryId" exact component={UpdateCategory}></AdminRoute>



            </Switch>
        </BrowserRouter>
    );
};

export default Routes;