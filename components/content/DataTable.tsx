interface Column<Row> {
  /** Column heading. */
  header: React.ReactNode;
  /** Which field to show, or a function for custom cells. */
  cell: keyof Row | ((row: Row) => React.ReactNode);
  /** Right-align numeric columns. */
  numeric?: boolean;
}

interface DataTableProps<Row> {
  columns: Column<Row>[];
  rows: Row[];
  caption?: React.ReactNode;
}

/**
 * Simple reference table, e.g. refractive indices or work functions.
 *
 *   <DataTable
 *     columns={[{ header: 'Material', cell: 'material' }, { header: 'n', cell: 'n', numeric: true }]}
 *     rows={materials}
 *   />
 */
export default function DataTable<Row>({ columns, rows, caption }: DataTableProps<Row>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-card">
      <table className="w-full text-sm">
        {caption && <caption className="px-4 pt-3 text-left text-sm text-ink-muted">{caption}</caption>}
        <thead className="border-b border-line bg-subtle text-left text-ink">
          <tr>
            {columns.map((col, i) => (
              <th key={i} scope="col" className={`px-4 py-2.5 font-semibold ${col.numeric ? 'text-right' : ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-gray-700">
          {rows.map((row, r) => (
            <tr key={r} className="hover:bg-subtle/60">
              {columns.map((col, c) => (
                <td key={c} className={`px-4 py-2.5 ${col.numeric ? 'text-right font-mono tabular-nums' : ''}`}>
                  {typeof col.cell === 'function' ? col.cell(row) : (row[col.cell] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
