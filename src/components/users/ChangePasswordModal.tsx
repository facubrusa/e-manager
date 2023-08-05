import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as Yup from 'yup';

interface Props {
  show: boolean;
  onHide: () => void;
  changePassword: (password: string) => void;
}

const ChangePasswordModal = (props: Props) => {
  const { show, changePassword, onHide } = props;
  const initUserForm = {
    password: '',
    confirmPassword: '',
  };

  const { handleChange, values, handleSubmit, touched, errors, resetForm } = useFormik({
    initialValues: initUserForm,
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .required('Required'),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref('password')],
        'Passwords must match'
      ),
    }),
    onSubmit: (values) => {
      changePassword(values.password);
      resetForm();
      onHide();
    },
  });

  return (
    <Modal show={show} onHide={onHide} aria-labelledby='contained-modal-title-vcenter' centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header>
          <Modal.Title id='contained-modal-title-vcenter'>
            Change password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-10'>
              <Form.Group
                className='form-group row text-right'
                controlId='password'
              >
                <Form.Label className='col-sm-6 col-form-label pr-3'>
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
            <div className='col-10'>
              <Form.Group
                className='form-group row text-right'
                controlId='confirmPassword'
              >
                <Form.Label className='col-sm-6 col-form-label pr-3'>
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
                    isValid={touched.confirmPassword && !errors.confirmPassword}
                    isInvalid={
                      touched.confirmPassword && !!errors.confirmPassword
                    }
                  />
                </div>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='success' type="submit">
            Change
          </Button>
          <Button variant='secondary' onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
