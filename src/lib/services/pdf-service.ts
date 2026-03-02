import { DraftTransaction as Cart, DraftProduct } from '@/lib/types/personalization';
import { Address } from '@/lib/types/address';
import { OrderProductDetail } from '@/lib/types/order';

interface DocumentData {
    order_number?: string;
    date: string;
    cart?: Cart; // For checkout estimates
    order_products?: OrderProductDetail[]; // For post-order documents
    gstin?: string;
    customer_name?: string;
    business_name?: string;
    billing_address?: Address | null;
    shipping_address?: Address | null;
    vendor: {
        name: string;
        address: string;
        gstin?: string;
        phone?: string;
    };
    totals: {
        product_total: number;
        delivery_fee: number;
        platform_fee: number;
        gst_amount: number;
        grand_total: number;
        discount?: number;
    };
}

const generateBasePDF = async (type: 'ESTIMATE' | 'TAX INVOICE', data: DocumentData) => {
    // Dynamic imports for heavy PDF libraries to optimize bundle size (H6 Fix)
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable')
    ]);

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

    // Left: SOLD BY (Vendor)
    doc.setFont('helvetica', 'bold');
    doc.text('SOLD BY:', col1, y);
    doc.setFont('helvetica', 'normal');
    y += 5;
    doc.text(data.vendor.name, col1, y);
    y += 5;
    const vendorAddress = doc.splitTextToSize(data.vendor.address, (pageWidth / 2) - 20);
    doc.text(vendorAddress, col1, y);
    y += (vendorAddress.length * 5);
    if (data.vendor.gstin) doc.text(`GSTIN: ${data.vendor.gstin}`, col1, y += 5);
    if (data.vendor.phone) doc.text(`Phone: ${data.vendor.phone}`, col1, y += 5);

    // Right: BILL TO
    let y2 = startY;
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', col2, y2);
    doc.setFont('helvetica', 'normal');
    y2 += 5;
    if (data.business_name) {
        doc.setFont('helvetica', 'bold');
        doc.text(data.business_name, col2, y2);
        doc.setFont('helvetica', 'normal');
        y2 += 5;
    } else {
        doc.text(data.customer_name || 'Customer', col2, y2);
        y2 += 5;
    }
    if (data.billing_address) {
        const addrLines = doc.splitTextToSize(
            `${data.billing_address.address_line1 || ''}, ${data.billing_address.city || ''}`,
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
    doc.text(`Doc No: ${data.order_number || 'PRE-AUTH'}`, col1, y);
    doc.text(`Date: ${data.date}`, col2, y);
    y += 10;

    // Table
    const products = data.order_products || data.cart?.products || [];
    const tableBody = products.map(product => {
        const p = product as OrderProductDetail;
        const productName = p.product_name || 'Product';
        const quantity = p.quantity || 1;
        const unitPrice = p.unit_price || 0;
        const totalPrice = p.total_price || 0;

        return [
            productName,
            (p as any).hsn_code || '6912',
            quantity,
            `₹${unitPrice}`,
            `₹${totalPrice}`
        ];
    });

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
    doc.text(`₹${data.totals.product_total.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });

    y += 6;
    doc.text('Delivery Fee:', totalsX, y);
    doc.text(`₹${data.totals.delivery_fee.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });

    y += 6;
    doc.text('GST (18%):', totalsX, y);
    doc.text(`₹${data.totals.gst_amount.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });

    if (data.totals.discount) {
        y += 6;
        doc.text('Discount:', totalsX, y);
        doc.text(`-₹${data.totals.discount.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });
    }

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', totalsX, y);
    doc.text(`₹${data.totals.grand_total.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });

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

export const generateEstimatePDF = async (data: DocumentData): Promise<void> => {
    const doc = await generateBasePDF('ESTIMATE', data);
    doc.save(`WyshKit_Estimate_${data.order_number || 'Draft'}_${Date.now()}.pdf`);
};

export const generateTaxInvoicePDF = async (data: DocumentData): Promise<void> => {
    const doc = await generateBasePDF('TAX INVOICE', data);
    doc.save(`WyshKit_Invoice_${data.order_number}_${Date.now()}.pdf`);
};
