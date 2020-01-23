```js
import React from 'react';
import { shallow } from 'enzyme';
import * as reactRedux from 'react-redux';
import 'jest-styled-components';
import { IntlProvider } from 'react-intl';
import { flattenMessages } from '@src/shared/helpers/locale/flattenMessages';
import { Notables } from './index';

const intlProvider = new IntlProvider({
  locale: 'en',
  messages: flattenMessages({
    app: {
      notable: {
        notable: 'notable',
      },
    },
  }),
});

const { intl } = intlProvider.getChildContext();
const initialState = {
  notables: {
    aq_config: {},
    notables_saved_views: {
      data: [],
    },
  },
};
const state = { ...initialState };
jest.spyOn(reactRedux, 'useSelector').mockImplementation(fn => fn(state));
const dispatchSpy = jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => payload => payload);

const props = {
  intl,
};

const view = <Notables {...props} />;

test('component', () => {
  const component = shallow(view);
  expect(component).toMatchSnapshot();
});
```
