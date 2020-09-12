```js
import { useHistory } from 'react-router-dom';

jest.mock('react-router-dom', () => {
  return {
    useHistory: jest.fn(() => []),
  };
});

test('renders component', () => {
  expect(useHistory).toHaveBeenCalled();
});
```
