import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import ContentHeader from '@app/components/content-header/ContentHeader';
import { clientAxios } from '@app/config/Axios';
import { CategoryProps } from '@app/interfaces/categories';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddEdit = () => {
  const { id } = useParams();
  const isAddMode = !id;

  const initCategoryForm: CategoryProps = {
    name: '',
    active: true,
    image: '',
    background_color: '#000000',
  };

  const [categoryData, setCategoryData] = useState(initCategoryForm);

  const { handleChange, values, handleSubmit, touched, errors, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: categoryData,
      validationSchema: Yup.object({
        name: Yup.string()
          .min(4, 'Must be at least 4 characters')
          .required('Required'),
        image: Yup.string().required('Must insert one image url'),
        background_color: Yup.string().required('Must select one'),
      }),
      onSubmit: async (values) => {
        try {
          const data = {
            ...values,
            id: undefined,
          };
          if (isAddMode) {
            await createCategory(data);
            resetForm();
          } else {
            await updateCategory(data);
          }
        } catch (error) {
          console.log(error);
        }
      },
    });

  const createCategory = async (categoryData: any) => {
    await clientAxios.post('/categories', categoryData);
    toast.success('Category created successfully');
  };

  const updateCategory = async (categoryData: any) => {
    if (!id) {
      throw new Error('Error getting id from url');
    }
    await clientAxios.patch(`/categories/${id}`, categoryData);
    toast.info('Category updated successfully');
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (isAddMode) {
        setCategoryData(initCategoryForm);
      } else {
        const response = await clientAxios.get(`/categories/${id}`);
        setCategoryData(response.data);
      }
    };
    fetchCategoryData().catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <ContentHeader title='Create Category' />

      <section className='content'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card card-primary'>
              <div className='card-header'>
                <h3 className='card-title'>Create a new category</h3>
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
                  <h3 className='form-section'>Category information</h3>

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
                          Image URL<span className='text-danger'>*</span>
                        </Form.Label>
                        <div className='col-sm-6 p-0'>
                          <Form.Control
                            name='image'
                            type='text'
                            placeholder='Enter image url'
                            onChange={handleChange}
                            value={values.image}
                            isValid={touched.image && !errors.image}
                            isInvalid={touched.image && !!errors.image}
                          />
                          {touched.image && errors.image && (
                            <Form.Control.Feedback type='invalid'>
                              {errors.image}
                            </Form.Control.Feedback>
                          )}
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className='row justify-content-around'>
                    <div className='col-5'>
                      <Form.Group
                        className='form-group row text-right'
                        controlId='background_color'
                      >
                        <Form.Label className='col-sm-3 col-form-label pr-3'>
                          Background Color<span className='text-danger'>*</span>
                        </Form.Label>
                        <div className='col-sm-2 p-0'>
                          <Form.Control
                            name='background_color'
                            type='color'
                            onChange={handleChange}
                            value={values.background_color}
                            isValid={
                              touched.background_color &&
                              !errors.background_color
                            }
                            isInvalid={
                              touched.background_color &&
                              !!errors.background_color
                            }
                          />
                          {touched.background_color &&
                            errors.background_color && (
                              <Form.Control.Feedback type='invalid'>
                                {errors.background_color}
                              </Form.Control.Feedback>
                            )}
                        </div>
                      </Form.Group>
                    </div>
                    <div className='col-5'>
                      <Form.Group
                        className='form-group row text-right'
                        controlId='active'
                      >
                        <Form.Label className='col-sm-3 col-form-label pr-3'>
                          Active<span className='text-danger'>*</span>
                        </Form.Label>
                        <div className='col-sm-1 d-flex justify-content-center'>
                          <Form.Check
                            type='checkbox'
                            id='active'
                            checked={values.active}
                            onChange={handleChange}
                            className='d-flex align-items-center'
                          />
                        </div>
                      </Form.Group>
                    </div>
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
