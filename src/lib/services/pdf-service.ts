import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cart } from '@/lib/types/cart';
import { Address } from '@/lib/types/address';
import { OrderItemDetail } from '@/lib/types/order';

// Initialize autoTable
const _autoTable = autoTable;

interface DocumentData {
    orderNumber?: string;
    date: string;
    cart?: Cart; // For checkout estimates
    order_items?: OrderItemDetail[]; // For post-order documents
    gstin?: string;
    customerName?: string;
    businessName?: string;
    billingAddress?: Address | null;
    shippingAddress?: Address | null;
    partner: {
        name: string;
        address: string;
        gstin?: string;
        phone?: string;
    };
    totals: {
        itemTotal: number;
        deliveryFee: number;
        platformFee: number;
        gstAmount: number;
        grandTotal: number;
        discount?: number;
    };
}

const generateBasePDF = (type: 'ESTIMATE' | 'TAX INVOICE', data: DocumentData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let y = 20;

    // Header
    doc.setFontSize(type === 'TAX INVOICE' ? 22 : 18);
    doc.setFont('helvetica', 'bold');
    doc.text(type, pageWidth / 2, y, { align: 'center' });
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Facilitated via WyshKit Platform', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Two Column layout for addresses
    const col1 = 14;
    const col2 = pageWidth / 2 + 5;
    const startY = y;

    // Left: SOLD BY (Partner)
    doc.setFont('helvetica', 'bold');
    doc.text('SOLD BY:', col1, y);
    doc.setFont('helvetica', 'normal');
    y += 5;
    doc.text(data.partner.name, col1, y);
    y += 5;
    const partnerAddress = doc.splitTextToSize(data.partner.address, (pageWidth / 2) - 20);
    doc.text(partnerAddress, col1, y);
    y += (partnerAddress.length * 5);
    if (data.partner.gstin) doc.text(`GSTIN: ${data.partner.gstin}`, col1, y += 5);
    if (data.partner.phone) doc.text(`Phone: ${data.partner.phone}`, col1, y += 5);

    // Right: BILL TO
    let y2 = startY;
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', col2, y2);
    doc.setFont('helvetica', 'normal');
    y2 += 5;
    if (data.businessName) {
        doc.setFont('helvetica', 'bold');
        doc.text(data.businessName, col2, y2);
        doc.setFont('helvetica', 'normal');
        y2 += 5;
    } else {
        doc.text(data.customerName || 'Customer', col2, y2);
        y2 += 5;
    }
    if (data.billingAddress) {
        const addrLines = doc.splitTextToSize(
            `${data.billingAddress.address_line1 || ''}, ${data.billingAddress.city || ''}`,
            (pageWidth / 2) - 20
        );
        doc.text(addrLines, col2, y2);
        y2 += (addrLines.length * 5);
    }
    if (data.gstin) {
        doc.setFont('helvetica', 'bold');
        doc.text(`GSTIN: ${data.gstin}`, col2, y2 += 5);
        doc.setFont('helvetica', 'normal');
    }

    y = Math.max(y, y2) + 10;

    // Order Info
    doc.text(`Doc No: ${data.orderNumber || 'PRE-AUTH'}`, col1, y);
    doc.text(`Date: ${data.date}`, col2, y);
    y += 10;

    // Table
    const items = data.order_items || data.cart?.items || [];
    const tableBody = items.map(item => [
        item.item_name || (item as any).itemName || (item as any).name || 'Product',
        (item as any).hsn_code || '6912',
        item.quantity || (item as any).quantity_number || 1,
        `₹${item.unit_price || (item as any).unitPrice || 0}`,
        `₹${(item.total_price || (item as any).totalPrice || 0)}`
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Description', 'HSN', 'Qty', 'Rate', 'Amount']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 20] },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 15, halign: 'center' },
            3: { cellWidth: 25, halign: 'right' },
            4: { cellWidth: 25, halign: 'right' }
        },
    });

    // Totals
    y = (doc as any).lastAutoTable.finalY + 10;
    const totalsX = pageWidth - 60;

    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', totalsX, y);
    doc.text(`₹${data.totals.itemTotal.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });

    y += 6;
    doc.text('Delivery Fee:', totalsX, y);
    doc.text(`₹${data.totals.deliveryFee.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });

    y += 6;
    doc.text('GST (18%):', totalsX, y);
    doc.text(`₹${data.totals.gstAmount.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });

    if (data.totals.discount) {
        y += 6;
        doc.text('Discount:', totalsX, y);
        doc.text(`-₹${data.totals.discount.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });
    }

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', totalsX, y);
    doc.text(`₹${data.totals.grandTotal.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });

    // Footer
    y += 20;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    if (type === 'ESTIMATE') {
        doc.text('This is a Proforma Estimate issued for advance documentation. Not a Tax Invoice.', 14, y);
    } else {
        doc.text('This is a computer generated Tax Invoice. No signature required.', 14, y);
    }

    return doc;
};

export const generateEstimatePDF = (data: DocumentData): void => {
    const doc = generateBasePDF('ESTIMATE', data);
    doc.save(`WyshKit_Estimate_${data.orderNumber || 'Draft'}_${Date.now()}.pdf`);
};

export const generateTaxInvoicePDF = (data: DocumentData): void => {
    const doc = generateBasePDF('TAX INVOICE', data);
    doc.save(`WyshKit_Invoice_${data.orderNumber}_${Date.now()}.pdf`);
};
