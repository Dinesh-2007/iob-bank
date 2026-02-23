// utilities for report downloads
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * format a filename (caller already supplies parts but this helper
 * ensures extension/invalid chars are handled)
 */
export function formatFileName(base) {
  return base.replace(/\s+/g, '_');
}

export function generatePDF(reportType, meta, tableData, fileName) {
  console.log('[DEBUG] generatePDF', { reportType, meta, rows: tableData.length });
  const doc = new jsPDF();

  if (reportType === 'STR Draft') {
    // produce a narrative STR (with sample XML snippet) for each draft entry
    tableData.forEach((str, idx) => {
      if (idx > 0) doc.addPage();
      // header
      doc.setFontSize(16);
      doc.text('Suspicious Transaction Report (STR)', 14, 20);

      // customer / entity details
      doc.setFontSize(12);
      doc.text(`Reporting Entity: ${str.reportingEntity?.name || ''}`, 14, 30);
      doc.text(`Branch Code: ${str.reportingEntity?.branchCode || ''}`, 14, 36);
      doc.text(`Customer Name: ${str.customer?.name || ''}`, 14, 46);
      doc.text(`Account Number: ${str.customer?.accountNumber || ''}`, 14, 52);
      doc.text(`PAN: ${str.customer?.PAN || ''}`, 14, 58);

      // transaction info
      doc.text(`Date of Transaction: ${str.suspiciousTransaction?.date || ''}`, 14, 68);
      doc.text(`Amount: ${str.suspiciousTransaction?.amount || ''}`, 14, 74);
      doc.text(`Mode: ${str.suspiciousTransaction?.mode || ''}`, 14, 80);

      // narrative section
      doc.text('Suspicious Pattern Observed:', 14, 92);
      const patternLines = doc.splitTextToSize(str.suspicionReason || '', 180);
      doc.text(patternLines, 14, 98);

      doc.text('Conclusion:', 14, 112);
      const conclusionLines = doc.splitTextToSize(str.conclusion || '', 180);
      doc.text(conclusionLines, 14, 118);

      // sample XML fragment
      doc.setFontSize(10);
      doc.text('XML Submission Sample:', 14, 134);
      const xml = `<STRReport>
  <ReportingEntity>
    <Name>${str.reportingEntity?.name || ''}</Name>
    <BranchCode>${str.reportingEntity?.branchCode || ''}</BranchCode>
  </ReportingEntity>

  <Customer>
    <Name>${str.customer?.name || ''}</Name>
    <AccountNumber>${str.customer?.accountNumber || ''}</AccountNumber>
    <PAN>${str.customer?.PAN || ''}</PAN>
  </Customer>

  <SuspiciousTransaction>
    <Date>${str.suspiciousTransaction?.date || ''}</Date>
    <Amount>${str.suspiciousTransaction?.amount || ''}</Amount>
    <Mode>${str.suspiciousTransaction?.mode || ''}</Mode>
  </SuspiciousTransaction>

  <SuspicionReason>
    ${str.suspicionReason || ''}
  </SuspicionReason>
</STRReport>`;
      const xmlLines = doc.splitTextToSize(xml, 180);
      doc.text(xmlLines, 14, 140);
    });

    doc.save(fileName);
    return;
  }

  // default table-based output for other reports
  // title
  doc.setFontSize(16);
  doc.text(reportType, 14, 20);

  // meta info
  doc.setFontSize(10);
  doc.text(`Region: ${meta.region}`, 14, 28);
  doc.text(`Period: ${meta.period}`, 14, 34);

  // table
  if (tableData && tableData.length) {
    const columns = Object.keys(tableData[0]).map((k) => ({ header: k, dataKey: k }));
    // plugin exposes a function rather than attaching to doc in recent versions
    autoTable(doc, {
      startY: 40,
      head: [columns.map((c) => c.header)],
      body: tableData.map((row) => columns.map((c) => row[c.dataKey]))
    });
  }

  doc.save(fileName);
}

export function generateCSV(data, fileName) {
  console.log('[DEBUG] generateCSV', { rows: data.length });
  if (!data || !data.length) {
    console.warn('generateCSV: no data');
    return;
  }
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  data.forEach((row) => {
    csvRows.push(headers.map((h) => JSON.stringify(row[h] || '')).join(','));
  });
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
}

export function generateExcel(data, fileName) {
  console.log('[DEBUG] generateExcel', { rows: data.length });
  if (!data || !data.length) {
    console.warn('generateExcel: no data');
    return;
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
}
