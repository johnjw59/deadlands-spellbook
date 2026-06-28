/**
 * Lightweight markdown renderer for power descriptions.
 * Handles: **bold**, *italic*, - bullet lists, and GFM pipe tables.
 * No external dependencies required.
 */

function processInline(text, keyPrefix = '') {
  // Split on **bold** and *italic* spans
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

function isTableSeparator(line) {
  return line.replace(/[| \-]/g, '').length === 0 && line.includes('-')
}

export default function Markdown({ children }) {
  if (!children) return null

  const lines = children.split('\n')
  const elements = []
  let listBuffer = []
  let tableBuffer = []

  const flushList = (key) => {
    if (listBuffer.length === 0) return
    elements.push(
      <ul key={key}>
        {listBuffer.map((item, i) => (
          <li key={i}>{processInline(item, `li-${key}-${i}`)}</li>
        ))}
      </ul>
    )
    listBuffer = []
  }

  const flushTable = (key) => {
    if (tableBuffer.length === 0) return
    const rows = tableBuffer.filter(r => !isTableSeparator(r))
    if (rows.length === 0) { tableBuffer = []; return }

    const parseRow = (row) =>
      row.split('|').filter(Boolean).map(c => c.trim())

    const [headerRow, ...bodyRows] = rows
    const headers = parseRow(headerRow)

    elements.push(
      <table key={key}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{processInline(h, `th-${key}-${i}`)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri}>
              {parseRow(row).map((cell, ci) => (
                <td key={ci}>{processInline(cell, `td-${key}-${ri}-${ci}`)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
    tableBuffer = []
  }

  lines.forEach((line, i) => {
    if (line.startsWith('- ')) {
      flushTable(`table-${i}`)
      listBuffer.push(line.slice(2))
    } else if (line.startsWith('|')) {
      flushList(`list-${i}`)
      tableBuffer.push(line)
    } else {
      flushList(`list-${i}`)
      flushTable(`table-${i}`)
      if (line.trim()) {
        elements.push(
          <p key={i}>{processInline(line, `p-${i}`)}</p>
        )
      }
    }
  })

  // flush any trailing buffers
  flushList('list-end')
  flushTable('table-end')

  return <>{elements}</>
}
