import React from 'react';
import './TableEmptyState.css';

/**
 * Komponen tampilan kosong yang konsisten untuk semua tabel.
 *
 * @param {string} icon      - Emoji atau ikon (default: 📭)
 * @param {string} title     - Judul pesan kosong
 * @param {string} subtitle  - Keterangan tambahan (opsional)
 * @param {number} colSpan   - Jumlah kolom untuk colSpan <td>
 * @param {boolean} asCell   - true = render sebagai <tr><td>…</td></tr> untuk di dalam <tbody>
 */
const TableEmptyState = ({
  icon = '📭',
  title = 'Tidak ada data',
  subtitle = '',
  colSpan = 6,
  asCell = true,
}) => {
  const inner = (
    <div className="table-empty-state">
      <span className="table-empty-state__icon" aria-hidden="true">{icon}</span>
      <p className="table-empty-state__title">{title}</p>
      {subtitle && <p className="table-empty-state__subtitle">{subtitle}</p>}
    </div>
  );

  if (asCell) {
    return (
      <tr>
        <td colSpan={colSpan} className="table-empty-state__cell">
          {inner}
        </td>
      </tr>
    );
  }

  return inner;
};

export default TableEmptyState;
