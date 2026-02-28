export function validateGSTIN(gstin: string): boolean {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
}

export function downloadGSTIN(order: any, vendor: any) {
  // Mock function for downloading GSTIN certificate as a JSON/text file for now
  // In a real app, this would generate a PDF or fetch a signed URL
  const data = {
    orderNumber: order.orderNumber,
    customer: order.users?.full_name || 'Guest',
    vendor: vendor.name,
    gstin: vendor.gstin || 'Applied For',
    businessType: vendor.businessType,
    panNumber: vendor.panNumber,
    timestamp: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GSTIN_${order.orderNumber}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
