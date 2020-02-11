```js
import React from 'react';
import set from 'lodash/set';
import { shallow } from 'enzyme';
import ArrowLeft from '@splunk/react-icons/ArrowLeft';
import Button from '@splunk/react-ui/Button';
import 'jest-styled-components';
import { reactRouterProps } from '@src/shared/spec/';
import { Header } from './index';

const props = {
  ...reactRouterProps,
  form: {
    dirty: true,
    isSubmitting: false,
    touched: {},
    errors: {},
    values: {
      status: 'draft',
    },
    submitForm: jest.fn(),
    setFieldValue: jest.fn(),
  },
  field: {
    name: 'Foo',
    value: 'Bar',
  },
};

test('component', () => {
  const component = shallow(<Header {...props} />);
  expect(component).toMatchSnapshot();

  component
    .find(ArrowLeft)
    .props()
    .onClick();
  expect(props.history.goBack).toBeCalled();

  component
    .find(Button)
    .at(0)
    .props()
    .onClick();
  expect(props.history.push).toBeCalled();

  component
    .find(Button)
    .at(2)
    .props()
    .onClick();
  expect(props.form.submitForm).toBeCalled();

  const nextProps = set(props, 'form.values.status', 'published');
  component.setProps(set(props, 'form.values.status', 'published'));
  expect(component).toMatchSnapshot();
});

```
