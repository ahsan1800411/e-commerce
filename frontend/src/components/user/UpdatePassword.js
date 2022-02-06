import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import MetaData from './../layouts/MetaData';
import { updatePassword, clearErrors } from '../../actions/userActions';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import Loader from './../layouts/Loader';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { success, loading, error } = useSelector((state) => state.updateUser);
  const alert = useAlert();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success('Password updated successfully');

      navigate('/me');
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [navigate, alert, dispatch, error, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('oldPassword', oldPassword);
    formData.set('password', password);

    dispatch(updatePassword(formData));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={'Update Password'} />
          <div className='row wrapper'>
            <div className='col-10 col-lg-5'>
              <form className='shadow-lg' onSubmit={submitHandler}>
                <h1 className='mt-2 mb-5'>Update Password</h1>
                <div className='form-group'>
                  <label htmlFor='old_password_field'>Old Password</label>
                  <input
                    type='password'
                    id='old_password_field'
                    className='form-control'
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='new_password_field'>New Password</label>
                  <input
                    type='password'
                    id='new_password_field'
                    className='form-control'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type='submit'
                  className='btn update-btn btn-block mt-4 mb-3'
                  disabled={loading ? true : false}
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdatePassword;
