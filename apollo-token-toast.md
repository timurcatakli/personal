## CODE

```js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from '@splunk/react-ui/Select';
import { useLazyQuery } from '@apollo/react-hooks';
import { updateLabel } from '@src/features/settings/notable-settings/apis';
import { useToast, TOAST_TYPES } from '@src/shared/contexts/toast-message';
import { SettingsHeader } from '@src/features/settings/__components/';
import StatusLabel from '@src/shared/components/StatusLabel';
import P from '@splunk/react-ui/Paragraph';
import { FETCH_LABELS } from './gql';

const StyleWrapper = styled.div``;

export const DefaultLabel = props => {
  const { locale, loading, triggerFetch } = props;
  const fetchPolicy = { fetchPolicy: 'network-only' };
  const params = { _page: 0, _limit: 0, label__icontains: '', _order: 'asc', _sort: 'label', is_deleted: false };
  const fetchParams = {
    variables: {
      params,
    },
  };
  const [defaultLabel, setDefaultLabel] = useState('');
  const [isLoading, setLoading] = useState(false);
  const createToast = useToast();

  // gql begins
  const [fetchLabels, labelsQuery] = useLazyQuery(FETCH_LABELS, fetchPolicy);

  useEffect(() => {
    fetchLabels(fetchParams);
  }, []);

  useEffect(() => {
    if (triggerFetch > 0) {
      fetchLabels(fetchParams);
    }
  }, [triggerFetch]);
  // gql ends

  const data = labelsQuery?.data?.labels?.items || [];
  const renderLabels = list => {
    if (list.length === 0) return [];
    return list.map(label => {
      const isActive = label.is_provisioned;
      return (
        <Select.Option
          icon={<StatusLabel label="" status={isActive ? 'success' : 'error'} />}
          label={label.label}
          truncate
          value={label.id}
          key={label.id}
        />
      );
    });
  };

  useEffect(() => {
    const defaultSelectedLabel = data.find(label => label.default);
    setDefaultLabel(defaultSelectedLabel?.id || '');
  }, [data]);

  const handleChange = (e, { value }) => {
    setLoading(true);
    // do post with id and default true
    updateLabel(value, { default: true }).then(res => {
      // If backend update is successful, just re-render the component.
      if (res.status === 200) {
        setLoading(false);
        setDefaultLabel(value);
      } else {
        createToast({
          type: TOAST_TYPES.ERROR,
          message: 'Message Goes Here',
        });
      }
    });
  };

  return (
    <StyleWrapper>
      <SettingsHeader title={locale.defaultLabelForSeverity} level={4} />
      <P className="description">{locale.defaultLabelDesc}</P>
      <Select
        filter
        disabled={isLoading || loading}
        style={{ maxWidth: '320px', width: '320px' }}
        value={defaultLabel}
        onChange={handleChange}
      >
        {renderLabels(data)}
      </Select>
    </StyleWrapper>
  );
};

DefaultLabel.propTypes = {
  loading: PropTypes.bool.isRequired,
  locale: PropTypes.shape({
    defaultLabelForSeverity: PropTypes.string.isRequired,
    defaultLabelDesc: PropTypes.string.isRequired,
    tableInactive: PropTypes.string.isRequired,
    tableActive: PropTypes.string.isRequired,
  }).isRequired,
  triggerFetch: PropTypes.number.isRequired,
};

DefaultLabel.defaultProps = {};

export default DefaultLabel;
```

```js
import React from 'react';
import { mount } from 'enzyme';
import 'jest-styled-components';
import wait from 'waait';
import { act, cleanup, waitForElement } from '@testing-library/react';
import Select from '@splunk/react-ui/Select';
import * as apis from '@src/features/settings/notable-settings/apis';
import { MockedProvider } from '@apollo/react-testing';
import { FETCH_LABELS } from './gql';
import DefaultLabel from './DefaultLabel';

const props = {
  loading: false,
  locale: {
    defaultLabelForSeverity: 'string',
    defaultLabelDesc: 'string',
    tableInactive: 'string',
    tableActive: 'string',
  },
  triggerFetch: 0,
};

const apolloMocks = [
  {
    request: {
      query: FETCH_LABELS,
      variables: {
        params: { _page: 0, _limit: 0, label__icontains: '', _order: 'asc', _sort: 'label', is_deleted: false },
      },
    },
    result: {
      data: {
        labels: {
          items: [
            {
              color: null,
              default: false,
              display_name: null,
              id: '123',
              is_deleted: false,
              is_provisioned: true,
              label: 'Foo',
              sort_field: null,
            },
            {
              color: null,
              default: false,
              display_name: null,
              id: '456',
              is_deleted: false,
              is_provisioned: false,
              label: 'Bar',
              sort_field: null,
            },
          ],
          total: 2,
          total_pages: 1,
        },
      },
    },
  },
];

jest.mock('@src/shared/services', () => ({
  getAccessToken: jest.fn(() => 'token'),
}));

const mockToastSpy = () => {};
jest.mock('@src/shared/contexts/toast-message', () => ({
  useToast: () => mockToastSpy,
  TOAST_TYPES: { ERROR: 'error' },
}));

describe('DefaultLabel', () => {
  beforeEach(() => {
    jest.mock('@src/features/settings/notable-settings/apis');
  });
  afterEach(cleanup);

  test('render', async () => {
    const wrapper = mount(
      <MockedProvider mocks={apolloMocks} addTypename={false}>
        <DefaultLabel {...props} />
      </MockedProvider>,
    );
    expect(wrapper).toBeDefined();
    await act(() => wait(0));

    apis.updateLabel = jest.fn().mockReturnValue(Promise.resolve({ status: 200 }));

    waitForElement(() =>
      wrapper
        .find(Select)
        .props()
        .onChange({}, { value: 'baz' }),
    );

    expect(apis.updateLabel).toHaveBeenCalled();

    apis.updateLabel = jest.fn().mockReturnValue(Promise.resolve({ status: 403 }));

    waitForElement(() =>
      wrapper
        .find(Select)
        .props()
        .onChange({}, { value: 'baz' }),
    );

    expect(wrapper).toMatchSnapshot();
  });
});
```
