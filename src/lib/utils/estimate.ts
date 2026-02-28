import { generateEstimatePDF, downloadPDF } from './pdf';
import { OrderForPDF } from '@/lib/types/order';

export function downloadEstimate(order: OrderForPDF) {
  const pdfBlob = generateEstimatePDF(order);
  downloadPDF(pdfBlob, `WyshKit-Estimate-${order.order_number}.pdf`);

  // Open in new window for printing
  const url = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
