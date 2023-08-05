import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { setWindowClass } from '@app/utils/helpers';
import { authLogin } from '@app/utils/oidc-providers';
import { PfButton, PfCheckbox } from '@profabric/react-components';
import { setProfile, setToken } from '@store/reducers/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      const response: any = await authLogin(email, password);
      dispatch(setProfile(response.profile));
      dispatch(setToken(response.token));

      toast.success('Login is succeed!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed');
    }
    setAuthLoading(false);
  };

  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      await login(values.email, values.password);
    },
  });

  setWindowClass('hold-transition login-page');

  return (
    <div className='login-box'>
      <div className='card card-outline card-primary'>
        <div className='card-header text-center'>
          <Link to='/' className='h1'>
            <b>Admin</b>
            <span>LTE</span>
          </Link>
        </div>
        <div className='card-body'>
          <p className='login-box-msg'>Sign in to start your session</p>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <InputGroup className='mb-3'>
                <Form.Control
                  id='email'
                  name='email'
                  type='email'
                  placeholder='Email'
                  onChange={handleChange}
                  value={values.email}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                />
                {touched.email && errors.email ? (
                  <Form.Control.Feedback type='invalid'>
                    {errors.email}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Text>
                    <i className='fas fa-envelope' />
                  </InputGroup.Text>
                )}
              </InputGroup>
            </div>
            <div className='mb-3'>
              <InputGroup className='mb-3'>
                <Form.Control
                  id='password'
                  name='password'
                  type='password'
                  placeholder='Password'
                  onChange={handleChange}
                  value={values.password}
                  isValid={touched.password && !errors.password}
                  isInvalid={touched.password && !!errors.password}
                />
                {touched.password && errors.password ? (
                  <Form.Control.Feedback type='invalid'>
                    {errors.password}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Text>
                    <i className='fas fa-lock' />
                  </InputGroup.Text>
                )}
              </InputGroup>
            </div>

            <div className='row'>
              <div className='col-8'>
                <PfCheckbox checked={false}>Remember me</PfCheckbox>
              </div>
              <div className='col-4'>
                <PfButton block type='submit' loading={isAuthLoading}>
                  Sign in
                </PfButton>
              </div>
            </div>
          </form>
          <p className='mb-1'>
            <Link to='/forgot-password'>I forgot my password</Link>
          </p>
          <p className='mb-0'>
            <Link to='/register' className='text-center'>
              Register a new membership
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
