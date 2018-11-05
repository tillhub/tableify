const safeGet = require('just-safe-get')

function tableify(items, options) {
  if (!items) return undefined

  let html = '<table><thead><tr>'
  let headers = []

  if (!safeGet(options, 'headers') || !Array.isArray(options.headers)) {
    // get unique keys of all objects
    headers = new Set
    items.forEach(item => {
      if (typeof item === 'object') {
        Object.keys(item).forEach(key => headers.add(key))
      }
    })
    headers = Array.from(headers)
  } else {
    headers = JSON.parse(JSON.stringify(options.headers))
  }

  const headerHtml = headers.map(header => {
    let cell = '<th'

    if (safeGet(options, 'headerCellClass')) {
      const customClass = options.headerCellClass(headers, header)
      if (typeof customClass === 'string') cell += ` class="${customClass}"`
    }

    cell += '>'

    let content = header
    if (safeGet(options, 'headerCellContent')) {
      const customContent = options.headerCellContent(headers, header)
      if (typeof customContent === 'string') content = customContent
    }

    return cell + content + '</th>'
  }).join('')

  html += headerHtml + '</tr></thead><tbody>'

  const tableBody = items.map(item => {
    const row = headers.map(header => {
      let cell = '<td'

      if (safeGet(options, 'bodyCellClass')) {
        const customClass = options.bodyCellClass(item, header, item[header])
        if (typeof customClass === 'string') cell += ` class="${customClass}"`
      }

      cell += '>'

      let content = item[header] || ''
      if (safeGet(options, 'bodyCellContent')) {
        const customContent = options.bodyCellContent(item, header, item[header])
        if (typeof customContent === 'string') content = customContent
      }

      return cell + content + '</td>'
    }).join('')
    return `<tr>${row}</tr>`
  }).join('')

  html += tableBody + '</tbody></table>'

  console.log(html)
  return html
}

module.exports = tableify
