const test = require('tape')
const tableify = require('../index')
const oneLine = require('oneline')

const items = [
  {
    name: 'Lipstick',
    vat_rate: 19,
    net: 6.58,
    currency: 'EUR'
  },
  {
    name: 'Shoelaces',
    vat_rate: 19,
    net: 7.34,
    currency: 'EUR'
  },
  {
    name: 'Apple',
    vat_rate: 7,
    net: 0.43
  },
  {
    name: 'Pears',
    vat_rate: 7,
    net: 0.77
  }
]

test('can handle missing items', function(t) {
  t.equal(tableify(), undefined, 'returns undefined on missing items')
  t.end()
})

test('can create correct table without given headers', function(t) {
  const expected = oneLine`
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>vat_rate</th>
          <th>net</th>
          <th>currency</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Lipstick</td>
          <td>19</td>
          <td>6.58</td>
          <td>EUR</td>
        </tr>
        <tr>
          <td>Shoelaces</td>
          <td>19</td>
          <td>7.34</td>
          <td>EUR</td>
        </tr>
        <tr>
          <td>Apple</td>
          <td>7</td>
          <td>0.43</td>
          <td></td>
        </tr>
        <tr>
          <td>Pears</td>
          <td>7</td>
          <td>0.77</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  `.replace(/>\s</gm, '><')

  t.equal(tableify(items), expected, 'correct html with default headers')
  t.end()
})

test('can create correct table with given headers and custom options', function(t) {
  const expected = oneLine`
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>net</th>
        <th class="green">VAT</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="red">Lipstick</td>
        <td>€6.58</td>
        <td>19</td>
      </tr>
      <tr>
        <td class="red">Shoelaces</td>
        <td>€7.34</td>
        <td>19</td>
      </tr>
      <tr>
        <td class="apple">Apple</td>
        <td>0.43</td>
        <td>7</td>
      </tr>
    </tbody>
  </table>
`.replace(/>\s</gm, '><')

  const map = {
    name: {
      custom: null,
      default: 'Product'
    },
    vat_rate: {
      custom: 'VAT',
      default: 'VAT Rate'
    },
    net: {
      custom: null
    }
  }

  const options = {
    headers: [
      'name',
      'net',
      { field: 'vat_rate', show: true },
      { field: 'currency', show: false }
    ],
    headerCellClass: function(row, col) {
      if (col === 'vat_rate') return 'green'
    },
    bodyCellClass: function(row, col, content) {
      if (content === 'Apple') return 'apple'
      if (col === 'name') return 'red'
    },
    headerCellContent: function(row, col) {
      if (map[col]) {
        return map[col].custom || map[col].default
      }
    },
    bodyCellContent: function(row, col, content) {
      if (row.currency) {
        if (col === 'net') {
          return content.toLocaleString('de-DE', {
            style: 'currency',
            currency: row.currency
          })
        }
      }
    },
    hideRow: function(row) {
      if (row.name === 'Pears') return true
    }
  }

  t.equal(
    tableify(items, options),
    expected,
    'custom headers and classes correct'
  )
  t.end()
})

test('can create correct table with no-header option', function(t) {
  const expected = oneLine`
    <table>
      <tbody>
        <tr>
          <td>Lipstick</td>
          <td>19</td>
          <td>6.58</td>
          <td>EUR</td>
        </tr>
        <tr>
          <td>Shoelaces</td>
          <td>19</td>
          <td>7.34</td>
          <td>EUR</td>
        </tr>
        <tr>
          <td>Apple</td>
          <td>7</td>
          <td>0.43</td>
          <td></td>
        </tr>
        <tr>
          <td>Pears</td>
          <td>7</td>
          <td>0.77</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  `.replace(/>\s</gm, '><')

  t.equal(tableify(items, { showHeaders: false }), expected, 'no header shown')
  t.end()
})
