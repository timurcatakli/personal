```js
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import { Formik, Field, Form } from 'formik';
import { FormikText } from '@src/shared/formik/';
import styled from 'styled-components';
import validationSchema from './validationSchema';

const StyleWrapper = styled.div``;

export const AddCertificateModal = props => {
  const { onCancel, onFormSubmit } = props;
  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize={true}
      validationSchema={validationSchema}
      initialValues={{ pem: '' }}
      onSubmit={onFormSubmit}
    >
      {formProps => {
        const { isSubmitting, submitForm, dirty } = formProps;
        const isSubmitButtonDisabled = isSubmitting;
        return (
          <Form>
            <Modal onRequestClose={onCancel} open style={{ width: '600px' }}>
              <Modal.Header title="Add Client Certificate" />
              <Modal.Body>
                <StyleWrapper>
                  <Field
                    multiline
                    rowsMax={5}
                    rowsMin={5}
                    component={FormikText}
                    name="pem"
                    placeholder={'Paste client certificate here'}
                    size="medium"
                  />
                </StyleWrapper>
              </Modal.Body>
              <Modal.Footer>
                <Button appearance="secondary" onClick={onCancel} label="Cancel" />
                <Button
                  appearance="primary"
                  onClick={submitForm}
                  label="Submit"
                  type="submit"
                  disabled={!dirty || isSubmitButtonDisabled}
                />
              </Modal.Footer>
            </Modal>
          </Form>
        );
      }}
    </Formik>
  );
};

AddCertificateModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};

AddCertificateModal.defaultProps = {};

export default AddCertificateModal;
```

```js
import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';
import { AddCertificateModal } from './AddCertificateModal';

const props = {
  onCancel: jest.fn(),
  onFormSubmit: jest.fn(),
};

it('renders component', () => {
  const wrapper = shallow(<AddCertificateModal {...props} />).dive();

  expect(wrapper.exists()).toBe(true);
  expect(wrapper).toMatchSnapshot();
});

```
