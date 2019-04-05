## Functional Component

```js
import React, { useMemo } from 'react';
import Select from '@splunk/react-ui/Select';
import PropTypes from 'prop-types';
import useWhyDidYouUpdate from './useWhyDidYouUpdate';

export const generateOptions = options => {
  return options.map(option => {
    return <Select.Option label={option.label} value={option.id} key={option.id} />;
  });
};

const SavedViews = React.memo(props => {
  // useWhyDidYouUpdate('Counter', props);
  // console.log(props);
  const { selectedFilterId, filters } = props;

  const selectOptions = useMemo(() => generateOptions(filters), [filters]);

  const handleDropdownChange = (e, data) => {
    const { value } = data;
    props.onChange(value);
  };

  return (
    <>
      <span style={{ marginRight: '10px' }}>Showing:</span>
      <Select value={selectedFilterId} onChange={handleDropdownChange}>
        {selectOptions}
      </Select>
    </>
  );
});

SavedViews.propTypes = {
  filters: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  selectedFilterId: PropTypes.string,
};

SavedViews.defaultProps = {
  filters: [],
  selectedFilterId: null,
};

export default SavedViews;

```
## Spec

```js
import React from 'react';
import { shallow, mount } from 'enzyme';
import Select from '@splunk/react-ui/Select';
import SavedViews, { generateOptions } from '.';

const props = {
  onChange: jest.fn(),
};
const view = <SavedViews {...props} />;
let wrapper;

describe('SavedViews', () => {
  beforeEach(() => {
    wrapper = shallow(view);
  });

  describe('Render', () => {
    it('should render with no errors', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Select Options', () => {
    it('should render options', () => {
      const options = [{ label: 'foo', id: 'bar' }];
      expect(generateOptions(options)).toEqual([<Select.Option label="foo" value="bar" key="bar" />]);
    });

    it('should call callback function when a filter is selected', () => {
      wrapper = mount(view);
      const submitButton = wrapper.find(Select).first();
      submitButton.instance().props.onChange({}, { value: 'foo' });
      expect(props.onChange).toBeCalledWith('foo');
    });
  });
});
```
