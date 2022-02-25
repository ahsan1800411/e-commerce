import './App.css';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import Home from './components/layouts/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductDetails from './components/layouts/product/productDetails';
import Login from './components/user/Login';
import Register from './components/user/Register';
import store from './store';
import { useEffect, useState } from 'react';
import { loadUser } from './actions/userActions';
import Profile from './components/user/Profile';
import ProtectedRoutes from './components/route/ProtectedRoutes';
import ErrorPage from './components/ErrorPage';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
import OrderList from './components/order/OrderList';
import OrderDetails from './components/order/OrderDetails';

function App() {
  const [stripeApiKey, setStripeApiKey] = useState('');
  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeApiKey() {
      const { data } = await axios('/api/v1/stripeapi');
      setStripeApiKey(data.stripeApiKey);
    }

    getStripeApiKey();
  }, []);

  return (
    <BrowserRouter>
      <div className='App'>
        <Header />
        <div className='container container-fluid'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />

            <Route
              path='/me'
              element={
                <ProtectedRoutes>
                  <Profile />
                </ProtectedRoutes>
              }
            />
            <Route
              path='/me/update'
              element={
                <ProtectedRoutes>
                  <UpdateProfile />
                </ProtectedRoutes>
              }
            />
            <Route
              path='/password/update'
              element={
                <ProtectedRoutes>
                  <UpdatePassword />
                </ProtectedRoutes>
              }
            />
            <Route
              path='/shipping'
              element={
                <ProtectedRoutes>
                  <Shipping />
                </ProtectedRoutes>
              }
            />
            <Route
              path='/order/confirm'
              element={
                <ProtectedRoutes>
                  <ConfirmOrder />
                </ProtectedRoutes>
              }
            />
            <Route
              path='/success'
              element={
                <ProtectedRoutes>
                  <OrderSuccess />
                </ProtectedRoutes>
              }
            />
            <Route
              path='/orders/me'
              element={
                <ProtectedRoutes>
                  <OrderList />
                </ProtectedRoutes>
              }
            />
            <Route
              path='/order/:id'
              element={
                <ProtectedRoutes>
                  <OrderDetails />
                </ProtectedRoutes>
              }
            />
            {stripeApiKey && (
              <Route
                path='/payment'
                element={
                  <Elements stripe={loadStripe(stripeApiKey)}>
                    <ProtectedRoutes>
                      <Payment />
                    </ProtectedRoutes>
                  </Elements>
                }
              />
            )}

            <Route path='/password/forgot' element={<ForgotPassword />} />
            <Route path='/password/reset/:token' element={<NewPassword />} />

            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='/search/:keyword' element={<Home />} />
            <Route path='/product/:id' element={<ProductDetails />} />
            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
