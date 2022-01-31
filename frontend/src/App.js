import './App.css';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import Home from './components/layouts/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductDetails from './components/layouts/product/productDetails';
import Login from './components/user/Login';
import Register from './components/user/Register';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Header />
        <div className='container container-fluid'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='/search/:keyword' element={<Home />} />
            <Route path='/product/:id' element={<ProductDetails />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
