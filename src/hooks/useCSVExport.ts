import Papa from 'papaparse';
import { Transaction } from '../types';

export function exportToCSV(data: Transaction[], filename: string): void {
  const csv = Papa.unparse(data.map(t => ({
    ID: t.id,
    'Business ID': t.businessId,
    'Card ID': t.cardId,
    'Staff ID': t.staffId,
    Type: t.type,
    Timestamp: new Date(t.timestamp).toLocaleString('ru-RU'),
    Details: t.details || ''
  })));

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}