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

  // console.log(headers)

  const headerHtml = headers.map(header => {
    let cell = '<th'

    if (safeGet(options, 'headerCellClass')) {
      const customClass = options.headerCellClass(headers, header)
      if (typeof customClass === 'string') cell += `class="${customClass}"`
    }

    cell += '>'
    cell += header
    cell += '</th>'

    return cell
  }).join('')


  html += headerHtml + '</tr></thead><tbody>'


  const tableBody = items.map(item => {
    const row = headers.map(header => {
      let cell = '<td'

      if (safeGet(options, 'bodyCellClass')) {
        const customClass = options.bodyCellClass(item, header)
        if (typeof customClass === 'string') cell += `class="${customClass}"`
      }

      return cell + '>' + item[header] + '</td>'
    }).join('')
    return `<tr>${row}</tr>`
  }).join('')

  html += tableBody
  html += '</tbody></table>'

  console.log(html)
  return html
}

module.exports = tableify
