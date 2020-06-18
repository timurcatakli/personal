## CODE

```js
import React, { useState, useEffect } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { SettingsHeader, ActionButtons } from '@src/features/settings/__components/';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import Loader from '@src/shared/components/Loader';
import Remove from '@splunk/react-icons/Remove';
import Button from '@splunk/react-ui/Button';
import Plus from '@splunk/react-icons/Plus';
import P from '@splunk/react-ui/Paragraph';
import NavigationPrompt from '@src/shared/components/NavigationPrompt';
import { Formik, Form, Field, FieldArray } from 'formik';
import { FormikText, FormikSwitch } from '@src/shared/formik/';
import { useToast, TOAST_TYPES } from '@src/shared/contexts/toast-message';
import HorizontalDivider from '@src/shared/components/HorizontalDivider';
import styled from 'styled-components';
import validationSchema from './validationSchema';
import { FETCH_TENANT_SETTINGS, UPDATE_TENANT_SETTINGS } from './gql';

const StyleWrapper = styled.div`
  padding: 20px;
  width: 800px;

  .form-wrapper {
    display: flex;
    flex-direction: column;
    widows: 100%;
    justify-content: space-between;
  }
  .form-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 14px;
    line-height: 24px;
    color: #f5f5f5;
  }
  .form-header-name {
    width: 320px;
  }
  .form-header-value {
    width: 320px;
  }
  .form-header-secret {
    width: 60px;
  }
  .form-header-action {
    width: 60px;
  }
  .form-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 15px;
  }
`;
const GLOBAL_ENV_VARS_KEY = 'global_environment_variables';

export const getVarsFromResponse = items => {
  if (items.length === 0) return [];
  return items.find(item => item.key === GLOBAL_ENV_VARS_KEY);
};

export const AppEnvironment = ({ intl }) => {
  const fetchPolicy = { fetchPolicy: 'network-only' };
  const createToast = useToast();
  const [tenantSettings, setTenantSettings] = useState({ value: [] });
  const localeTitle = intl.formatMessage({ id: 'oar.settings.environment.title' });
  const localeDescription = intl.formatMessage({ id: 'oar.settings.environment.description' });
  const localeSuccessMessage = intl.formatMessage({ id: 'oar.settings.environment.successMessage' });
  const localeActionMessage = intl.formatMessage({ id: 'oar.settings.environment.actionMessage' });
  const localeDiscard = intl.formatMessage({ id: 'oar.settings.environment.discard' });
  const localeSubmit = intl.formatMessage({ id: 'oar.settings.environment.submit' });
  const localeEnvironmentTitle = intl.formatMessage({ id: 'oar.settings.environment.environmentTitle' });
  const localeName = intl.formatMessage({ id: 'oar.settings.environment.name' });
  const localeValue = intl.formatMessage({ id: 'oar.settings.environment.value' });
  const localeSecret = intl.formatMessage({ id: 'oar.settings.environment.secret' });
  const localeLoading = intl.formatMessage({ id: 'oar.connectorConfig.loading' });

  // gql begins
  const [fetchTenantSettings, tenantSettingsQuery] = useLazyQuery(FETCH_TENANT_SETTINGS, fetchPolicy);

  useEffect(() => {
    fetchTenantSettings();
  }, []);

  useEffect(() => {
    if (!tenantSettingsQuery.loading && tenantSettingsQuery.called) {
      const { items } = tenantSettingsQuery.data.tenantSettings;
      const filteredSettings = getVarsFromResponse(items);
      setTenantSettings(filteredSettings);
    }
  }, [tenantSettingsQuery]);
  // gql ends

  const handleMutationCompleted = () => {
    fetchTenantSettings();
    createToast({
      type: TOAST_TYPES.SUCCESS,
      message: localeSuccessMessage,
    });
  };

  // gql begins
  const [updateTenantSettings] = useMutation(UPDATE_TENANT_SETTINGS, {
    onCompleted: handleMutationCompleted,
  });
  // gql end

  const handleFormSubmit = values => {
    const { id } = values;
    const payload = {
      id,
      payload: values,
    };
    updateTenantSettings({ variables: payload });
  };

  return (
    <Formik
      initialValues={tenantSettings}
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={handleFormSubmit}
    >
      {formProps => {
        const { values, submitForm, resetForm, dirty } = formProps;
        return (
          <>
            <NavigationPrompt when={dirty} />
            <ActionButtons message={localeActionMessage} hidden={!dirty}>
              <Button data-test="discard-btn" label={localeDiscard} onClick={resetForm} />
              <Button data-test="save-btn" appearance="primary" label={localeSubmit} onClick={submitForm} />
            </ActionButtons>

            <StyleWrapper>
              <SettingsHeader title={localeTitle} />
              <P>{localeDescription}</P>
              <HorizontalDivider height={20} />
              <SettingsHeader title={localeEnvironmentTitle} level={4} />
              <HorizontalDivider height={20} />
              <Loader active={tenantSettingsQuery.loading} text={localeLoading}>
                <Form>
                  <FieldArray
                    name="value"
                    render={arrayHelpers => {
                      return (
                        <div className="form-wrapper">
                          <div className="form-header">
                            <div className="form-header-name">{localeName}</div>
                            <div className="form-header-value">{localeValue}</div>
                            <div className="form-header-secret">{localeSecret}</div>
                            <div className="form-header-action">&nbsp;</div>
                          </div>
                          {values.value.map((setting, index) => {
                            /* eslint-disable-next-line */
                            const isFieldDisabled = tenantSettings.value[index]?.is_secret || false;
                            const isSwitchDisabled = setting.key_value === '';
                            const valueFieldType = setting.is_secret ? 'password' : 'text';

                            const handleRemove = () => {
                              arrayHelpers.remove(index);
                            };

                            return (
                              <div className="form-row" key={index}>
                                <div className="form-header-name">
                                  <Field
                                    component={FormikText}
                                    disabled={isFieldDisabled}
                                    name={`value.[${index}].key_name`}
                                    size="medium"
                                  />
                                </div>
                                <div className="form-header-value">
                                  <Field
                                    type={valueFieldType}
                                    disabled={isFieldDisabled}
                                    component={FormikText}
                                    name={`value.[${index}].key_value`}
                                    size="medium"
                                  />
                                </div>
                                <div className="form-header-secret">
                                  <Field
                                    disabled={isSwitchDisabled || isFieldDisabled}
                                    component={FormikSwitch}
                                    inline
                                    appearance="checkbox"
                                    size="medium"
                                    name={`value.[${index}].is_secret`}
                                  />
                                </div>
                                <div className="form-header-action">
                                  <Button
                                    data-test="button-remove"
                                    appearance="secondary"
                                    icon={<Remove hideDefaultTooltip size={1} />}
                                    onClick={handleRemove}
                                  />
                                </div>
                              </div>
                            );
                          })}
                          <div>
                            <Button
                              icon={<Plus size={1} style={{ color: 'white' }} />}
                              label={intl.formatMessage({ id: 'oar.connectorConfig.advanced.envVariables.variable' })}
                              onClick={() =>
                                arrayHelpers.push({
                                  is_secret: false,
                                  key_name: '',
                                  key_value: '',
                                })
                              }
                            />
                          </div>
                        </div>
                      );
                    }}
                  />
                </Form>
              </Loader>
            </StyleWrapper>
          </>
        );
      }}
    </Formik>
  );
};

AppEnvironment.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AppEnvironment);
```

## SPEC
```js
import React from 'react';
import { mount } from 'enzyme';
import { cleanup } from 'react-testing-library';
import { BrowserRouter as Router } from 'react-router-dom';
import wait from 'waait';
import Button from '@splunk/react-ui/Button';
import 'jest-styled-components';
import { IntlProvider } from 'react-intl';
import { MockedProvider } from '@apollo/react-testing';
import { flattenMessages } from '@src/shared/helpers/locale/flattenMessages';
import { Formik } from 'formik';
import { FETCH_TENANT_SETTINGS, UPDATE_TENANT_SETTINGS } from './gql';
import AppEnvironment, { getVarsFromResponse } from './index';

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
const props = {
  intl,
};

const apolloMocks = [
  {
    request: {
      query: FETCH_TENANT_SETTINGS,
      variables: {},
    },
    result: {
      data: {
        tenantSettings: {
          items: [
            {
              id: '1',
              key: 'global_environment_variables',
              schema_version: 'v1',
              value: [{ is_secret: true, key_name: 'test', key_value: '127.0.0.1' }],
            },
          ],
          total: 1,
          total_pages: 1,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_TENANT_SETTINGS,
      variables: {
        id: '1',
        payload: {
          id: '1',
          key: 'global_environment_variables',
          schema_version: 'v1',
          value: [{ is_secret: true, key_name: 'test', key_value: '127.0.0.1' }],
        },
      },
    },
    result: {
      data: {
        updateTenantSetting: {
          success: true,
          __typename: 'SimpleResponse',
        },
      },
    },
  },
];

describe('getVarsFromResponse', () => {
  test('function when items exist and does not exist', () => {
    const envSettingVariable = [
      {
        id: '123',
        key: 'global_environment_variables',
        schema_version: 'v1',
        value: [{ is_secret: true }],
      },
    ];
    expect(getVarsFromResponse(envSettingVariable)).toMatchObject(envSettingVariable[0]);
    expect(getVarsFromResponse([])).toMatchObject({});
  });
});

describe('AppEnvironment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(cleanup);
  test('render', async () => {
    const wrapper = mount(
      <Router>
        <IntlProvider
          locale="en-US"
          messages={{
            'oar.settings.environment.title': 'foo',
            'oar.settings.environment.description': 'foo',
            'oar.settings.environment.successMessage': 'foo',
            'oar.settings.environment.actionMessage': 'foo',
            'oar.settings.environment.discard': 'foo',
            'oar.settings.environment.submit': 'foo',
            'oar.settings.environment.environmentTitle': 'foo',
            'oar.settings.environment.name': 'foo',
            'oar.settings.environment.value': 'foo',
            'oar.settings.environment.secret': 'foo',
            'oar.connectorConfig.loading': 'foo',
            'shared.navigationPrompt.body': 'foo',
            'oar.connectorConfig.advanced.envVariables.variable': 'foo',
          }}
        >
          <MockedProvider mocks={apolloMocks} addTypename={false}>
            <AppEnvironment {...props} />
          </MockedProvider>
        </IntlProvider>
      </Router>,
    );
    expect(wrapper).toBeDefined();
    /*
      Loading state, while important, isn't the only thing to test.
      To test the final state of the component after receiving data,
      we can just wait for it to update and test the final state.
    */
    await wait(0);
    // Use wrapper.setProps({}) to force a re-render so that graphql data could be reflected to the component.

    const payload = {
      id: '1',
      key: 'global_environment_variables',
      schema_version: 'v1',
      value: [{ is_secret: true, key_name: 'test', key_value: '127.0.0.1' }],
    };

    expect(() => {
      wrapper
        .find(Formik)
        .props()
        .onSubmit(payload);
    }).not.toThrow();

    wrapper.setProps({});

    wrapper
      .find(Button)
      .at(1)
      .props()
      .onClick();

    wrapper.setProps({});

    expect(wrapper.find({ 'data-test': 'button-remove' }).length).toBe(20);

    wrapper.setProps({});

    wrapper
      .find({ 'data-test': 'button-remove' })
      .at(0)
      .props()
      .onClick();

    wrapper.setProps({});

    wrapper
      .find({ 'data-test': 'button-remove' })
      .at(0)
      .props()
      .onClick();

    wrapper.setProps({});

    expect(wrapper.find({ 'data-test': 'button-remove' }).length).toBe(0);
  });
});
```
