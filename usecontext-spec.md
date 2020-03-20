```js
// in order to mock context you need to export it as a custom hook e.g. useResponseContext
// also you need to name export the component not default
import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

/* eslint-disable-next-line */
import ResponseContext, { useResponseContext } from '@src/features/investigation/components/Response/ResponseContext';
/* eslint-disable-next-line */
import * as ResponseContextModule from '@src/features/investigation/components/Response/ResponseContext';
import mockData from '@src/features/investigation/components/Response/spec-mock-data';

import { Note } from './index';

const props = {
  author: 'Foo',
  content: 'Bar',
  createTime: '2020-03-19T03:30:04Z',
  id: '123',
  onDelete: jest.fn(),
  onEdit: jest.fn(),
  title: 'Baz',
};

it('renders component', () => {
  jest.spyOn(ResponseContextModule, 'useResponseContext').mockImplementation(() => ({
    locale: {
      'notes.note.by': 'by',
      'notes.note.on': 'on',
      'notes.note.edit': 'Edit note',
      'notes.note.delete': 'Delete note',
      'notes.note.evidence': 'Tag as evidence',
      'notes.note.confirmationModal.title': 'Note Deletion Confirmation',
      'notes.note.confirmationModal.body': 'Do you want to delete the note?',
      'notes.note.confirmationModal.confirm': 'Delete',
    },
    selectedPhaseIndex: 0,
    selectedTaskIndex: 1,
    selectedTemplateIndex: 0,
    templates: mockData.notable.templates,
    notableId: mockData.notable.id,
  }));

  const wrapper = shallow(
    <ResponseContext.Provider>
      <Note {...props} />
    </ResponseContext.Provider>,
  ).dive();

  expect(wrapper.exists()).toBe(true);
  expect(wrapper).toMatchSnapshot();
});
```
