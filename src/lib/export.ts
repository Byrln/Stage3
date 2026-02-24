"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Papa from "papaparse";
import * as XLSX from "xlsx";

type ExportColumn<T> = {
  key: keyof T;
  label: string;
};

export function exportToCSV<T>(
  data: T[],
  filename: string,
  columns: ExportColumn<T>[],
): void {
  const rows = data.map((item) =>
    columns.reduce<Record<string, unknown>>((accumulator, column) => {
      accumulator[column.label] = item[column.key];
      return accumulator;
    }, {}),
  );

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportToPDF(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: window.devicePixelRatio || 1,
  });
  const imageData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("landscape", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imageWidth = pageWidth;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;

  const y = Math.max(0, (pageHeight - imageHeight) / 2);
  pdf.addImage(imageData, "PNG", 0, y, imageWidth, imageHeight);

  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

export function exportToExcel<T>(
  data: T[],
  filename: string,
  columns: ExportColumn<T>[],
): void {
  const rows = data.map((item) =>
    columns.reduce<Record<string, unknown>>((accumulator, column) => {
      accumulator[column.label] = item[column.key];
      return accumulator;
    }, {}),
  );

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelFilename = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, excelFilename);
}

