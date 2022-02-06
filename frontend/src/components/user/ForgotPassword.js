import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
// import { useNavigate } from 'react-router-dom';
import MetaData from './../layouts/MetaData';
import { forgotPassword, clearErrors } from '../../actions/userActions';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const { message, loading, error } = useSelector(
    (state) => state.forgotPassword
  );
  const alert = useAlert();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      alert.success(message);

      // navigate('/me'); TODO for tomorrow
    }
  }, [alert, dispatch, error, message]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.set('email', email);

    dispatch(forgotPassword(formData));
  };
  return (
    <>
      <MetaData title={'Forgot Password'} />
      <div class='row wrapper'>
        <div class='col-10 col-lg-5'>
          <form class='shadow-lg' onSubmit={submitHandler}>
            <h1 class='mb-3'>Forgot Password</h1>
            <div class='form-group'>
              <label for='email_field'>Enter Email</label>
              <input
                type='email'
                id='email_field'
                class='form-control'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              id='forgot_password_button'
              type='submit'
              class='btn btn-block py-3'
              disabled={loading ? true : false}
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
