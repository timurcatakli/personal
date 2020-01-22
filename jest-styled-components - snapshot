## Code

```js
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tooltip from '@splunk/react-ui/Tooltip';

export const StyleWrapper = styled.div`
  border-radius: 3px;
  background-color: ${props => props.color};
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
`;

const tooltipStyle = { color: 'white' };

const ManualPin = ({ data, color, width, height }) => {
  return (
    <StyleWrapper width={width} height={height} color={color}>
      <div className="slide-wrapper">
        <Tooltip content={data.message} style={tooltipStyle} inline={false}>
          <div className="slide-message">{data.message}</div>
        </Tooltip>
        <Tooltip content={data.data} style={tooltipStyle} inline={false}>
          <div className="slide-data">{data.data}</div>
        </Tooltip>
      </div>
    </StyleWrapper>
  );
};

ManualPin.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    pin_style: PropTypes.string.isRequired,
  }).isRequired,
  color: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

ManualPin.defaultProps = {};

export default memo(ManualPin);
```

## spec

```js
import React from 'react';
import { shallow } from 'enzyme';
import styled from 'styled-components';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import ManualPin, { StyleWrapper } from './ManualPin';

const props = {
  color: 'red',
  width: 50,
  height: 50,
  data: {
    data: 'foo',
    message: 'bar',
    pin_style: 'red',
  },
};

test('component', () => {
  const component = shallow(<ManualPin {...props} />);
  expect(component).toMatchSnapshot();
});

test('styles', () => {
  const tree = renderer.create(<StyleWrapper {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
  expect(tree).toHaveStyleRule('border-radius', '3px');
  expect(tree).toHaveStyleRule('background-color', props.color);
  expect(tree).toHaveStyleRule('width', `${props.width}px`);
  expect(tree).toHaveStyleRule('height', `${props.height}px`);
});
```
