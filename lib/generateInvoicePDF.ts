import { format } from 'date-fns';

interface Booking {
  _id: string;
  roomId: string;
  roomTitle: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  invoiceNumber: string;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

export const generateInvoicePDF = async (booking: Booking) => {
  try {
    // Dynamically import jsPDF and qrcode to avoid SSR issues
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default;
    const QRCodeModule = await import('qrcode');
    const QRCode = QRCodeModule.default;

    const doc = new jsPDF();
  
  // Colors
  const primaryColor = '#59a4b5';
  const darkGray = '#333333';
  const lightGray = '#666666';
  
  // Header
  doc.setFillColor(89, 164, 181);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('HOTEL BEACH', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Santorini, Greece', 20, 28);
  doc.text('Tel: +30 22860 12345', 20, 33);
  
  // Invoice title
  doc.setTextColor(darkGray);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 150, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${booking.invoiceNumber || booking._id.slice(-8)}`, 150, 28);
  doc.text(`Date: ${format(new Date(booking.createdAt), 'MMM dd, yyyy')}`, 150, 33);
  
  // Guest Information
  let yPos = 55;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, yPos);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(booking.guestInfo.name, 20, yPos + 7);
  doc.text(booking.guestInfo.email, 20, yPos + 13);
  doc.text(booking.guestInfo.phone, 20, yPos + 19);
  
  // Booking Details
  yPos += 35;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Details', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos - 5, 170, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 25, yPos);
  doc.text('Details', 120, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  
  // Room
  doc.text('Room Type', 25, yPos);
  doc.text(booking.roomTitle, 120, yPos);
  
  yPos += 7;
  doc.text('Check-in Date', 25, yPos);
  doc.text(format(new Date(booking.checkInDate), 'MMM dd, yyyy'), 120, yPos);
  
  yPos += 7;
  doc.text('Check-out Date', 25, yPos);
  doc.text(format(new Date(booking.checkOutDate), 'MMM dd, yyyy'), 120, yPos);
  
  yPos += 7;
  doc.text('Guests', 25, yPos);
  doc.text(`${booking.adults} Adult(s), ${booking.children} Child(ren)`, 120, yPos);
  
  yPos += 7;
  doc.text('Booking Status', 25, yPos);
  doc.text(booking.status.toUpperCase(), 120, yPos);
  
  yPos += 7;
  doc.text('Payment Status', 25, yPos);
  doc.text((booking.paymentStatus || 'PENDING').toUpperCase(), 120, yPos);
  
  // Total
  yPos += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount:', 120, yPos);
  doc.setTextColor(primaryColor);
  doc.text(`$${booking.totalPrice}`, 170, yPos);
  
  // Generate QR Code
  const qrData = `Booking ID: ${booking._id}\nGuest: ${booking.guestInfo.name}\nRoom: ${booking.roomTitle}\nTotal: $${booking.totalPrice}`;
  const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 100, margin: 1 });
  
  // Add QR Code
  doc.addImage(qrCodeDataUrl, 'PNG', 20, yPos + 10, 40, 40);
  
  doc.setTextColor(lightGray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Scan QR code for booking details', 20, yPos + 55);
  
  // Footer
  yPos = 270;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  
  doc.setFontSize(8);
  doc.setTextColor(lightGray);
  doc.text('Thank you for choosing Hotel Beach!', 105, yPos + 5, { align: 'center' });
  doc.text('For inquiries, contact us at reservations@hotelbeach.com', 105, yPos + 10, { align: 'center' });
  
  // Save the PDF
  doc.save(`invoice-${booking.invoiceNumber || booking._id.slice(-8)}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
