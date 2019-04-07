import { CodeBlock } from 'mithril-materialized';
import { EditableTable, IEditableTable } from 'mithril-table';
import m from 'mithril';

interface IPerson { id: number; first: string; last: string; }

export const InputPage = () => {
  const state = {
    data: [{
      id: 1,
      first: 'John',
      last: 'Doe',
    }, {
      id: 2,
      first: 'Jane',
      last: 'Doe',
    }, {
      id: 3,
      first: 'Bob',
      last: 'Bear',
    }] as IPerson[],
  };

  return {
    view: () =>
      m('.col.s12', [
        m('h2.header', 'EditableTable from mithril-table'),

        m(EditableTable, {
          headers: [
            { column: 'id', title: 'ID' },
            { column: 'first', title: 'First name' },
            { column: 'last', title: 'Last name' },
          ],
          data: state.data,
          addRows: true,
          deleteRows: true,
          moveRows: true,
          // disabled: true,
          // sortRows: false,
          onchange: (data) => {
            state.data = data;
            console.table(data);
          },
        } as IEditableTable<IPerson>),

        m(CodeBlock, {
          code: `import { EditableTable, IEditableTable } from 'mithril-table';
import m from 'mithril';

...

interface IPerson { id: number; first: string; last: string; }

const state = {
  data: [{
    id: 1,
    first: 'John',
    last: 'Doe',
  }, {
    id: 2,
    first: 'Jane',
    last: 'Doe',
  }, {
    id: 3,
    first: 'Bob',
    last: 'Bear',
  }] as IPerson[],
};

m(EditableTable, {
  headers: [
    { column: 'id', title: 'ID' },
    { column: 'first', title: 'First name' },
    { column: 'last', title: 'Last name' },
  ],
  data: state.data,
  addRows: true,
  deleteRows: true,
  moveRows: true,
  // disabled: true,
  // sortRows: false,
  onchange: (data) => {
    state.data = data;
    console.table(data);
  },
} as IEditableTable<IPerson>),
`,
        }),
      ]),
  };
};
