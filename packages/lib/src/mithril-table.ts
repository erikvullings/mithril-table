import m, { FactoryComponent, Component, Attributes } from 'mithril';
import { ContentEditable } from 'mithril-contenteditable';

// TODO Optional functionality
// - Add pagination
// - Infer type and/or cast type
// - create property for new row factory function
// - Add a search option, see also https://codepen.io/dp_lewis/pen/MwPRYW

export interface IEditableTable<T extends { [key: string]: unknown }> extends Attributes {
  /** Table headers, also determines column order. */
  headers?: Array<{ column: Extract<keyof T, string>; title: string }>;
  /** Table data */
  data: T[];
  /** If disabled, show a table without editing capabilities. */
  disabled?: boolean;
  /** Is the user allowed to add rows, @default false */
  addRows?: boolean;
  /** Is the user allowed to delete rows, @default false */
  deleteRows?: boolean;
  /** Is the user allowed to move rows up and down, @default false */
  moveRows?: boolean;
  /** Is the user allowed to sort rows by column, @default true */
  sortRows?: boolean;
  /** When the data changes, return an updated version of the table data */
  onchange?: (data: T[]) => void;
}

/**
 * EditableTable, a Mithril component for generating an editable table.
 *
 * Features:
 * - Specify the headers
 * - Specify the column order (using the header order)
 * - Disable the table, making it an ordinary table
 * - Adding, deleting, moving and sorting rows
 */
export const EditableTable = <T>(): Component<IEditableTable<T>> => {
  const state = {
    sortDirectionUp: true,
  } as {
    headers: Array<{ column: Extract<keyof T, string>; title: string }>;
    data: T[];
    onchange?: (data: T[]) => void;
    sortColumn?: string;
    sortDirectionUp: boolean;
  };

  const uppercaseFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const columnToTitle = (c: string) => uppercaseFirst(c).replace('_', ' ');

  const emitChange = () => {
    const { onchange, data } = state;
    if (onchange) {
      onchange(data);
    }
  };

  const addRow = () => {
    const { data, headers } = state;
    const newRow = headers.reduce(
      (acc, cur) => {
        (acc as any)[cur.column] = '';
        return acc;
      },
      {} as T
    );
    data.push(newRow);
    emitChange();
  };

  const deleteRow = (row: T) => {
    const { data } = state;
    state.data = data.filter(r => r !== row);
    emitChange();
  };

  const moveRowUp = (row: T) => {
    const { data } = state;
    const i = data.indexOf(row);
    [data[i], data[i - 1]] = [data[i - 1], data[i]];
    emitChange();
  };

  const moveRowDown = (row: T) => {
    const { data } = state;
    const i = data.indexOf(row);
    [data[i], data[i + 1]] = [data[i + 1], data[i]];
    emitChange();
  };

  const sortBy = (column: string) => {
    const { data, sortDirectionUp, sortColumn } = state;
    state.sortDirectionUp = sortColumn === column ? !sortDirectionUp : true;
    const dir = state.sortDirectionUp ? 1 : -1;
    state.sortColumn = column;
    state.data = data.sort((a, b) =>
      (a as any)[column] > (b as any)[column] ? dir : (a as any)[column] < (b as any)[column] ? -dir : 0
    );
    emitChange();
  };

  const sortableHeader: FactoryComponent<{ title: string; column: string }> = () => ({
    view: ({ attrs: { title, column } }) =>
      m('th', m('span', { onclick: () => sortBy(column), style: 'cursor: pointer;' }, title)),
  });

  const addRowButton: FactoryComponent = () => ({
    view: () => m('th', m('a', { onclick: () => addRow(), style: 'cursor: pointer; margin-right: 5px;' }, '✚')),
  });

  const addDeleteButton: FactoryComponent<{ row: T }> = () => ({
    view: ({ attrs: { row } }) =>
      m('a', { onclick: () => deleteRow(row), style: 'cursor: pointer; margin-right: 10px;' }, '✖'),
  });

  const addMoveButtons: FactoryComponent<{ row: T; isFirst: boolean; isLast: boolean }> = () => ({
    view: ({ attrs: { row, isFirst, isLast } }) => [
      isFirst
        ? undefined
        : m(
            'a',
            {
              onclick: () => moveRowUp(row),
              style: 'cursor: pointer; margin-right: 5px;' + (isFirst ? 'margin-left: 22px;' : ''),
            },
            m('spam', '▲ ')
          ),
      isLast
        ? undefined
        : m('a', { onclick: () => moveRowDown(row), style: 'cursor: pointer; margin-right: 5px;' }, m('spam', '▼')),
    ],
  });

  const makeRow: FactoryComponent<{
    row: T;
    disabled?: boolean;
    addRows?: boolean;
    deleteRows?: boolean;
    moveRows?: boolean;
    isFirst: boolean;
    isLast: boolean;
  }> = () => {
    return {
      view: ({ attrs: { row, addRows, deleteRows, moveRows, disabled, isFirst, isLast } }) => {
        return m('tr', [
          ...state.headers.map(h =>
            m(
              'td',
              disabled
                ? row[h.column]
                : m(ContentEditable, {
                    html: row[h.column].toString(),
                    onchange: (c: string) => {
                      (row as any)[h.column] = c;
                      emitChange();
                    },
                  })
            )
          ),
          (addRows || deleteRows || moveRows) && !disabled
            ? m('td', [
                deleteRows ? m(addDeleteButton, { row }) : undefined,
                moveRows ? m(addMoveButtons, { row, isFirst, isLast }) : undefined,
              ])
            : undefined,
        ]);
      },
    };
  };

  const makeRows: FactoryComponent<Partial<IEditableTable<T>>> = () => {
    return {
      view: ({ attrs: { addRows, deleteRows, moveRows, disabled } }) => [
        ...state.data.map((row, i, arr) =>
          m(makeRow, { row, addRows, deleteRows, moveRows, disabled, isFirst: i === 0, isLast: i === arr.length - 1 })
        ),
      ],
    };
  };

  const makeHeader: FactoryComponent<Partial<IEditableTable<T>>> = () => {
    return {
      view: ({ attrs: { addRows, deleteRows, moveRows, sortRows, disabled } }) =>
        m('tr', [
          ...state.headers.map(h => sortRows && !disabled ? m(sortableHeader, h) : m('th', h.title)),
          addRows && !disabled ? m(addRowButton) : deleteRows || moveRows ? m('th') : undefined,
        ]),
    };
  };

  return {
    oninit: ({ attrs: { onchange } }) => (state.onchange = onchange),
    view: ({
      attrs: {
        headers,
        data,
        addRows = false,
        deleteRows = false,
        moveRows = false,
        sortRows = true,
        disabled = false,
      },
    }) => {
      if (!headers && data.length === 0) {
        return undefined;
      }

      state.data = data;
      state.headers = headers
        ? headers
        : Object.keys(data[0]).map(column => ({
            column: column as Extract<keyof T, string>,
            title: columnToTitle(column),
          }));

      return m('table', [
        m(makeHeader, { addRows, deleteRows, moveRows, sortRows, disabled }),
        m(makeRows, { addRows, deleteRows, moveRows, disabled }),
      ]);
    },
  };
};
