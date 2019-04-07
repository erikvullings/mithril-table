# mithril-table

An editable table component for Mithril.

## Installation

Pull it from [npm](https://www.npmjs.com/package/mithril-table).

```bash
npm i mithril mithril-table
# Also install the typings if you use TypeScript
npm i --save-dev @types/mithril
```

## Usage example

```ts
import { EditableTable, IEditableTable } from 'mithril-table';
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

```

## Build instructions

Using `pnpm` (`npm i -g pnpm`), run the following commands:

```bash
pnpm m i
npm start
```
