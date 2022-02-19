import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import MetaData from '../layouts/MetaData';

import CheckoutSteps from './CheckoutSteps';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';

const options = {
  style: {
    base: {
      fontSize: '16px',
    },
    invalid: '#9e2146',
  },
};

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  useEffect(() => {}, []);

  return (
    <>
      <MetaData title={'Payment'} />
      <CheckoutSteps shipping confirmOrder payment />

      <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
          <form className='shadow-lg'>
            <h1 className='mb-4'>Card Info</h1>
            <div className='form-group'>
              <label htmlFor='card_num_field'>Card Number</label>
              <CardNumberElement
                type='text'
                id='card_num_field'
                className='form-control'
                options={options}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='card_exp_field'>Card Expiry</label>
              <CardNumberElement
                type='text'
                id='card_exp_field'
                className='form-control'
                options={options}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='card_cvc_field'>Card CVC</label>
              <CardNumberElement
                type='text'
                id='card_cvc_field'
                className='form-control'
                options={options}
              />
            </div>

            <button id='pay_btn' type='submit' className='btn btn-block py-3'>
              Pay
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Payment;
