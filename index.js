function tableify(items, options) {
  if (!items) return undefined

  let html = '<table><thead><tr>'
  let headers = []

  if (!options || !options.headers || !Array.isArray(options.headers)) {
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

  html += headers.map(header => `<th>${header}</th>`).join('')
  html += '</tr></thead><tbody>'

  const bodyCellClass = options && options.bodyCellClass

  const tableBody = items.map(item => {
    const row = headers.map(header => {
      let cell = '<td'

      if (bodyCellClass) {
        const customClass = bodyCellClass(item, header)
        if (typeof customClass === 'string') cell += `class="${customClass}"`
      }

      return cell + '>' + item[header] + '</td>'
      // return `<td>${item[header]}</td>`
    }).join('')
    return `<tr>${row}</tr>`
  }).join('')

  html += tableBody
  html += '</tbody></table>'

  console.log(html)
  return html
}

module.exports = tableify
