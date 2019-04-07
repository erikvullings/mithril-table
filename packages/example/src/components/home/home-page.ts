import { dashboardSvc } from '../../services/dashboard-service';
import m from 'mithril';
import { CodeBlock } from 'mithril-materialized';

export const HomePage = () => ({
  view: () =>
    m('.row', [
      m(
        '.col.s12.m7.l8',
        m('.introduction', [
          m('h2', 'About mithril-table'),
          m('p', [
            `A component for Mithril to edit content. See the `,
            m('a[href=/editable-table]', { oncreate: m.route.link }, 'example.'),
          ]),
          m('p', [
            'You can check out the API documentation ',
            m('a[href="https://erikvullings.github.io/mithril-table/typedoc/index.html"]', 'here'),
            '.',
          ]),
          m('h3', 'Installation'),
          m('p', 'First, you need to install the required packages:'),
          m(CodeBlock, {
            language: 'console',
            code: `npm i mithril mithril-table
# Also install the typings if you use TypeScript
npm i --save-dev @types/mithril`,
          }),
          m('p', 'Next, you can use them inside your application:'),
          m(CodeBlock, {
            code: `import { EditableTable } from 'mithril-table';
`,
          }),
        ])
      ),
      m('.col.s12.m5.l4', [
        m('h1', 'Contents'),
        m('ul.collection', [
          dashboardSvc
            .getList()
            .filter(d => d.visible && !d.default)
            .map(d => m('li.collection-item', m('a', { href: d.route, oncreate: m.route.link }, d.title))),
        ]),
      ]),
    ]),
});
