import './App.css';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import Home from './components/layouts/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductDetails from './components/layouts/product/productDetails';
import Login from './components/user/Login';
import Register from './components/user/Register';
import store from './store';
import { useEffect } from 'react';
import { loadUser } from './actions/userActions';
import Profile from './components/user/Profile';
import ProtectedRoutes from './components/route/ProtectedRoutes';
import ErrorPage from './components/ErrorPage';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';
import Cart from './components/cart/Cart';

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
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
