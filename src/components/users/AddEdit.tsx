import { useFormik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';

import ContentHeader from '@app/components/content-header/ContentHeader';
import { clientAxios } from '@app/config/Axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserProps } from '@app/interfaces/users';

const AddEdit = () => {
  const { id } = useParams();
  const isAddMode = !id;

  const initUserForm: UserProps = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  };

  const [userData, setUserData] = useState(initUserForm);

  const { handleChange, values, handleSubmit, touched, errors, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: userData,
      validationSchema: Yup.object({
        name: Yup.string()
          .min(4, 'Must be at least 4 characters')
          .required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string()
          .min(8, 'Must be at least 8 characters')
          .required('Required'),
        confirmPassword: Yup.string().oneOf(
          [Yup.ref('password')],
          'Passwords must match'
        ),
        role: Yup.string().required('Must select one'),
      }),
      onSubmit: async (values) => {
        try {
          const data = {
            ...values,
            confirmPassword: undefined,
          };
          if (isAddMode) {
            await createUser(data);
            resetForm();
          } else {
            await updateUser(data);
          }
        } catch (error) {
          console.log(error);
        }
      },
    });

  const createUser = async (userData: any) => {
    await clientAxios.post('/users', userData);
    toast.success('User created successfully');
  };

  const updateUser = async (userData: any) => {
    if (!id) {
      throw new Error('Error getting id from url');
    }
    await clientAxios.patch(`/users/${id}`, userData);
    toast.info('User updated successfully');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAddMode) {
        setUserData(initUserForm);
      } else {
        const response = await clientAxios.get(`/users/${id}`);
        setUserData(response.data);
      }
    };
    fetchUserData().catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <ContentHeader title='Create User' />

      <section className='content'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card card-primary'>
              <div className='card-header'>
                <h3 className='card-title'>Create a new user</h3>
                <div className='card-tools'>
                  <button
                    type='button'
                    className='btn btn-tool'
                    data-card-widget='collapse'
                    title='Collapse'
                  >
                    <i className='fas fa-minus'></i>
                  </button>
                </div>
              </div>
              <div className='card-body'>
                <Form className='form-horizontal' onSubmit={handleSubmit}>
                  <h3 className='form-section'>User information</h3>

                  <div className='row justify-content-around'>
                    <div className='col-5'>
                      <Form.Group
                        className='form-group row text-right'
                        controlId='name'
                      >
                        <Form.Label className='col-sm-3 col-form-label pr-3'>
                          Name<span className='text-danger'>*</span>
                        </Form.Label>
                        <div className='col-sm-6 p-0'>
                          <Form.Control
                            name='name'
                            type='text'
                            placeholder='Enter name'
                            onChange={handleChange}
                            value={values.name}
                            isValid={touched.name && !errors.name}
                            isInvalid={touched.name && !!errors.name}
                          />
                          {touched.name && errors.name && (
                            <Form.Control.Feedback type='invalid'>
                              {errors.name}
                            </Form.Control.Feedback>
                          )}
                        </div>
                      </Form.Group>
                    </div>
                    <div className='col-5'>
                      <Form.Group
                        className='form-group row text-right'
                        controlId='email'
                      >
                        <Form.Label className='col-sm-3 col-form-label pr-3'>
                          Email<span className='text-danger'>*</span>
                        </Form.Label>
                        <div className='col-sm-6 p-0'>
                          <Form.Control
                            name='email'
                            type='email'
                            placeholder='Enter email'
                            onChange={handleChange}
                            value={values.email}
                            isValid={touched.email && !errors.email}
                            isInvalid={touched.email && !!errors.email}
                          />
                          {touched.email && errors.email && (
                            <Form.Control.Feedback type='invalid'>
                              {errors.email}
                            </Form.Control.Feedback>
                          )}
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  {isAddMode && (
                    <div className='row justify-content-around'>
                      <div className='col-5'>
                        <Form.Group
                          className='form-group row text-right'
                          controlId='password'
                        >
                          <Form.Label className='col-sm-3 col-form-label pr-3'>
                            Password<span className='text-danger'>*</span>
                          </Form.Label>
                          <div className='col-sm-6 p-0'>
                            <Form.Control
                              name='password'
                              type='password'
                              placeholder='Enter password'
                              onChange={handleChange}
                              value={values.password}
                              isValid={touched.password && !errors.password}
                              isInvalid={touched.password && !!errors.password}
                            />
                            {touched.password && errors.password && (
                              <Form.Control.Feedback type='invalid'>
                                {errors.password}
                              </Form.Control.Feedback>
                            )}
                          </div>
                        </Form.Group>
                      </div>
                      <div className='col-5'>
                        <Form.Group
                          className='form-group row text-right'
                          controlId='confirmPassword'
                        >
                          <Form.Label className='col-sm-3 col-form-label pr-3'>
                            Confirm password
                            <span className='text-danger'>*</span>
                          </Form.Label>
                          <div className='col-sm-6 p-0'>
                            <Form.Control
                              name='confirmPassword'
                              type='password'
                              placeholder='Confirm password'
                              onChange={handleChange}
                              value={values.confirmPassword}
                              isValid={
                                touched.confirmPassword &&
                                !errors.confirmPassword
                              }
                              isInvalid={
                                touched.confirmPassword &&
                                !!errors.confirmPassword
                              }
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                  )}

                  <div className='row justify-content-around'>
                    <div className='col-5'>
                      <Form.Group
                        className='form-group row text-right'
                        controlId='role'
                      >
                        <Form.Label className='col-sm-3 col-form-label pr-3'>
                          Role<span className='text-danger'>*</span>
                        </Form.Label>
                        <div className='col-sm-6 p-0'>
                          <Form.Select
                            id='role'
                            name='role'
                            className='custom-select'
                            aria-label='Default select example'
                            onChange={handleChange}
                            value={values.role}
                            isValid={touched.role && !errors.role}
                            isInvalid={touched.role && !!errors.role}
                          >
                            <option value='' disabled={true}>
                              Select one
                            </option>
                            <option value='user'>User</option>
                            <option value='admin'>Admin</option>
                          </Form.Select>
                          {touched.role && errors.role && (
                            <Form.Control.Feedback type='invalid'>
                              {errors.role}
                            </Form.Control.Feedback>
                          )}
                        </div>
                      </Form.Group>
                    </div>
                    <div className='col-5'></div>
                  </div>
                  <div className='row'>
                    <div className='col-12'>
                      <a href='#' className='btn btn-secondary'>
                        Cancel
                      </a>
                      <input
                        type='submit'
                        value='Create'
                        className='btn btn-success float-right'
                      />
                    </div>
                  </div>
                </Form>
                {/* /.form-horizontal */}
              </div>
              {/* /.card-body */}
            </div>
            {/* /.card */}
          </div>
        </div>
      </section>
    </>
  );
};

export default AddEdit;
