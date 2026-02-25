/**
 * PDF Generation Utilities
 * Simple PDF generation for Estimate and GSTIN downloads
 */

import { jsPDF } from 'jspdf';
import { OrderForPDF, VendorForPDF } from '@/lib/types/order';

export function generateEstimatePDF(order: OrderForPDF): Blob {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(197, 160, 89); // Wyshkit Gold
  doc.setFont('helvetica', 'bold');
  doc.text('WyshKit Order Estimate', margin, y);

  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(104, 107, 120); // #686B78
  doc.setFont('helvetica', 'normal');
  doc.text(`Order #${order.order_number} • ${new Date(order.created_at).toLocaleDateString('en-IN')}`, margin, y);

  y += 15;
  doc.setDrawColor(217, 27, 36);
  doc.setLineWidth(0.5);
  doc.line(margin, y, 190, y);

  y += 15;
  // Order Details Section
  doc.setFontSize(12);
  doc.setTextColor(40, 44, 63); // #282C3F
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER DETAILS', margin, y);

  y += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Vendor: ${order.vendor?.name || 'N/A'}`, margin, y);
  y += 7;
  doc.text(`Order Number: ${order.order_number}`, margin, y);
  y += 7;
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, y);

  y += 15;
  // Products Table Header
  doc.setFont('helvetica', 'bold');
  doc.text('Item', margin, y);
  doc.text('Qty', 140, y, { align: 'right' });
  doc.text('Price', 165, y, { align: 'right' });
  doc.text('Total', 190, y, { align: 'right' });

  y += 5;
  doc.line(margin, y, 190, y);
  y += 10;

  // Products
  doc.setFont('helvetica', 'normal');
  (order.order_products || []).forEach((product: any) => {
    doc.text((product.product_name || 'Item').substring(0, 40), margin, y);
    doc.text((product.quantity || 1).toString(), 140, y, { align: 'right' });
    doc.text(`Rs ${Number(product.unit_price || 0).toFixed(2)}`, 165, y, { align: 'right' });
    doc.text(`Rs ${Number(product.total_price || 0).toFixed(2)}`, 190, y, { align: 'right' });
    y += 8;
  });

  y += 10;
  doc.line(margin, y, 190, y);
  y += 10;

  // Summary
  doc.setFont('helvetica', 'bold');
  doc.text('Bill Summary', margin, y);
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 140, y, { align: 'right' });
  doc.text(`Rs ${Number(order.subtotal || 0).toFixed(2)}`, 190, y, { align: 'right' });
  y += 7;
  doc.text('Delivery Fee:', 140, y, { align: 'right' });
  doc.text(`Rs ${Number(order.delivery_fee || 0).toFixed(2)}`, 190, y, { align: 'right' });
  y += 7;
  doc.text('Total Amount:', 140, y, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs ${Number(order.total || 0).toFixed(2)}`, 190, y, { align: 'right' });

  y += 20;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150);
  doc.text('This is a computer-generated estimate.', 105, y, { align: 'center' });

  return doc.output('blob');
}

export function generateGSTINPDF(order: OrderForPDF, vendor: VendorForPDF): Blob {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(197, 160, 89);
  doc.setFont('helvetica', 'bold');
  doc.text('GSTIN Certificate', 105, y, { align: 'center' });

  y += 15;
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(2);
  doc.rect(margin, y, 170, 40);

  doc.setFontSize(12);
  doc.setTextColor(104, 107, 120);
  doc.text('GST Identification Number', 105, y + 12, { align: 'center' });
  doc.setFontSize(24);
  doc.setTextColor(197, 160, 89);
  doc.text(vendor.gstin || 'APPLIED FOR', 105, y + 28, { align: 'center' });

  y += 60;
  doc.setFontSize(12);
  doc.setTextColor(40, 44, 63);
  doc.setFont('helvetica', 'normal');

  const details = [
    ['Vendor Name:', vendor.name],
    ['Business Type:', vendor.business_type || 'N/A'],
    ['Order Number:', order.order_number],
    ['Order Date:', new Date(order.created_at).toLocaleDateString('en-IN')],
    ['Total Amount:', `Rs ${Number(order.total || 0).toFixed(2)}`]
  ];

  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value || '', 70, y);
    y += 10;
  });

  return doc.output('blob');
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
