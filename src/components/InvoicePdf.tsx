import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Define interfaces for type safety
interface InvoiceItem {
  slNo: number;
  description: string;
  hsnSac: string;
  quantity: string;
  rate: number;
  unit: string;
  amount: number;
}

interface CompanyDetails {
  name: string;
  address: string[];
  gstin: string;
  state: string;
  stateCode: string;
  contact: string[];
  email: string;
  website: string;
  logo?: string;
}

interface BuyerDetails {
  name: string;
  address: string[];
  gstin: string;
  pan: string;
  state: string;
  stateCode: string;
  placeOfSupply: string;
}

interface InvoiceDetails {
  invoiceNo: string;
  invoiceDate: string;
  eWayBillNo?: string;
  deliveryNote?: string;
  referenceNo?: string;
  buyerOrderNo?: string;
  dispatchDocNo?: string;
  dispatchedThrough?: string;
  billOfLadingNo?: string;
  billOfLadingDate?: string;
  modeOfPayment: string;
  otherReferences?: string;
  deliveryNoteDate?: string;
  destination?: string;
  motorVehicleNo?: string;
  termsOfDelivery?: string;
}

interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNo: string;
  branchAndIFSC: string;
  swiftCode?: string;
}

interface InvoicePdfProps {
  company: CompanyDetails;
  buyer: BuyerDetails;
  invoiceDetails: InvoiceDetails;
  items: InvoiceItem[];
  igstRate: number;
  previousBalance?: number;
  bankDetails: BankDetails;
  qrCode?: string;
  notes?: string;
}

// Create comprehensive styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    padding: 20,
  },
  
  // Border container
  container: {
    border: '2px solid #000',
  },
  
  // Header section
  header: {
    fontSize: 14,
    textAlign: 'center',
    padding: 8,
    borderBottom: '1px solid #000',
    fontFamily: 'Helvetica-Bold',
  },
  
  headerSubtext: {
    fontSize: 8,
    fontFamily: 'Helvetica',
  },
  
  // Main content sections
  topSection: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  
  // Seller details
  sellerSection: {
    width: '50%',
    padding: 10,
    borderRight: '1px solid #000',
  },
  
  companyName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  
  companyDetail: {
    fontSize: 8,
    marginBottom: 2,
  },
  
  boldLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  
  // Invoice details table
  invoiceDetailsSection: {
    width: '50%',
  },
  
  detailRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  
  detailCell: {
    padding: 4,
    fontSize: 7,
    borderRight: '1px solid #000',
  },
  
  detailCellLast: {
    padding: 4,
    fontSize: 7,
  },
  
  detailLabel: {
    width: '25%',
    fontFamily: 'Helvetica-Bold',
  },
  
  detailValue: {
    width: '25%',
  },
  
  // Buyer section
  buyerSection: {
    padding: 10,
    borderBottom: '1px solid #000',
  },
  
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
    fontSize: 9,
  },
  
  buyerName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    marginBottom: 2,
  },
  
  buyerDetail: {
    fontSize: 8,
    marginBottom: 1,
  },
  
  buyerGrid: {
    flexDirection: 'row',
    marginTop: 3,
  },
  
  buyerGridCol: {
    width: '50%',
    fontSize: 8,
  },
  
  // Items table
  itemsTable: {
    width: '100%',
  },
  
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    backgroundColor: '#f0f0f0',
  },
  
  tableHeaderCell: {
    padding: 5,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    borderRight: '1px solid #000',
    textAlign: 'center',
  },
  
  tableHeaderCellLast: {
    padding: 5,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  
  tableCell: {
    padding: 5,
    fontSize: 8,
    borderRight: '1px solid #000',
  },
  
  tableCellLast: {
    padding: 5,
    fontSize: 8,
  },
  
  slNoCell: { width: '5%' },
  descriptionCell: { width: '40%' },
  hsnCell: { width: '12%' },
  quantityCell: { width: '15%', textAlign: 'right' },
  rateCell: { width: '10%', textAlign: 'right' },
  unitCell: { width: '8%', textAlign: 'center' },
  amountCell: { width: '10%', textAlign: 'right' },
  
  itemDescription: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
  },
  
  itemSubtext: {
    fontSize: 7,
    marginTop: 2,
  },
  
  // Total rows
  totalRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  
  totalLabel: {
    width: '90%',
    padding: 5,
    fontSize: 8,
    textAlign: 'right',
    borderRight: '1px solid #000',
    fontFamily: 'Helvetica-Bold',
  },
  
  totalValue: {
    width: '10%',
    padding: 5,
    fontSize: 8,
    textAlign: 'right',
  },
  
  grandTotalRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    fontFamily: 'Helvetica-Bold',
  },
  
  grandTotalLabel: {
    width: '47%',
    padding: 5,
    fontSize: 8,
    textAlign: 'right',
    borderRight: '1px solid #000',
  },
  
  grandTotalQty: {
    width: '43%',
    padding: 5,
    fontSize: 8,
    textAlign: 'right',
    borderRight: '1px solid #000',
  },
  
  grandTotalValue: {
    width: '10%',
    padding: 5,
    fontSize: 8,
    textAlign: 'right',
  },
  
  // Amount in words section
  amountWordsSection: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  
  amountWordsLeft: {
    width: '66.66%',
    padding: 10,
    borderRight: '1px solid #000',
  },
  
  amountWordsRight: {
    width: '33.34%',
    padding: 10,
  },
  
  amountWordsLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    marginBottom: 3,
  },
  
  amountWordsText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    marginBottom: 5,
  },
  
  eoeText: {
    fontSize: 7,
    fontStyle: 'italic',
  },
  
  balanceText: {
    fontSize: 8,
    marginBottom: 3,
  },
  
  qrCodeContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  
  qrCodeLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  
  qrCodePlaceholder: {
    width: 80,
    height: 80,
    border: '1px solid #000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Tax summary table
  taxTable: {
    width: '100%',
    borderBottom: '1px solid #000',
  },
  
  taxTableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    backgroundColor: '#f0f0f0',
  },
  
  taxTableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  
  taxHsnCell: { width: '20%', padding: 5, fontSize: 8, borderRight: '1px solid #000' },
  taxValueCell: { width: '20%', padding: 5, fontSize: 8, borderRight: '1px solid #000', textAlign: 'right' },
  taxRateCell: { width: '15%', padding: 5, fontSize: 8, borderRight: '1px solid #000', textAlign: 'center' },
  taxAmountCell: { width: '20%', padding: 5, fontSize: 8, borderRight: '1px solid #000', textAlign: 'right' },
  taxTotalCell: { width: '25%', padding: 5, fontSize: 8, textAlign: 'right' },
  
  // Tax amount in words
  taxAmountWords: {
    padding: 10,
    borderBottom: '1px solid #000',
    fontSize: 8,
  },
  
  // Footer section
  footerSection: {
    flexDirection: 'row',
  },
  
  declarationSection: {
    width: '66.66%',
    padding: 10,
    borderRight: '1px solid #000',
  },
  
  bankDetailsSection: {
    width: '33.34%',
    padding: 10,
  },
  
  declarationTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    marginBottom: 5,
  },
  
  declarationText: {
    fontSize: 7,
    lineHeight: 1.4,
  },
  
  bankDetailItem: {
    fontSize: 7,
    marginBottom: 2,
  },
  
  signatureSection: {
    marginTop: 40,
    alignItems: 'flex-end',
  },
  
  signatureText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  
  signatoryText: {
    fontSize: 7,
    marginTop: 20,
  },
  
  // Footer note
  footerNote: {
    textAlign: 'center',
    padding: 5,
    fontSize: 7,
    borderTop: '1px solid #000',
  },
});

const InvoicePdf: React.FC<InvoicePdfProps> = ({
  company,
  buyer,
  invoiceDetails,
  items,
  igstRate,
  previousBalance = 0,
  bankDetails,
  qrCode,
  notes,
}) => {
  // Calculate totals
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const igstAmount = (subtotal * igstRate) / 100;
    const roundOff = Math.round((subtotal + igstAmount) * 100) / 100 - (subtotal + igstAmount);
    const grandTotal = subtotal + igstAmount + roundOff;
    const currentBalance = previousBalance + grandTotal;

    return {
      subtotal,
      igstAmount,
      roundOff,
      grandTotal,
      currentBalance,
    };
  };

  const { subtotal, igstAmount, roundOff, grandTotal, currentBalance } = calculateTotals();

  // Convert number to words (simplified version)
  const numberToWords = (amount: number): string => {
    // This is a placeholder - you would implement a full number-to-words converter
    return `INR ${amount.toFixed(2)} Only`;
  };

  const totalQuantity = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity.replace(/[^\d.-]/g, ''));
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text>
              Tax Invoice <Text style={styles.headerSubtext}>(ORIGINAL FOR RECIPIENT)</Text>
            </Text>
          </View>

          {/* Top Section - Seller & Invoice Details */}
          <View style={styles.topSection}>
            {/* Seller Details */}
            <View style={styles.sellerSection}>
              <Text style={styles.companyName}>{company.name}</Text>
              {company.address.map((line, idx) => (
                <Text key={idx} style={styles.companyDetail}>{line}</Text>
              ))}
              <Text style={styles.companyDetail}>
                <Text style={styles.boldLabel}>GSTIN/UIN: </Text>{company.gstin}
              </Text>
              <Text style={styles.companyDetail}>
                <Text style={styles.boldLabel}>State Name: </Text>{company.state}, <Text style={styles.boldLabel}>Code: </Text>{company.stateCode}
              </Text>
              <Text style={styles.companyDetail}>
                <Text style={styles.boldLabel}>Contact: </Text>{company.contact.join(', ')}
              </Text>
              <Text style={styles.companyDetail}>
                <Text style={styles.boldLabel}>E-Mail: </Text>{company.email}
              </Text>
              <Text style={styles.companyDetail}>{company.website}</Text>
            </View>

            {/* Invoice Details Table */}
            <View style={styles.invoiceDetailsSection}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailCell, styles.detailLabel]}>Invoice No.</Text>
                <Text style={[styles.detailCell, styles.detailValue]}>{invoiceDetails.invoiceNo}</Text>
                <Text style={[styles.detailCell, styles.detailLabel]}>e-Way Bill No.</Text>
                <Text style={[styles.detailCellLast, styles.detailValue]}>{invoiceDetails.eWayBillNo || ''}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailCell, styles.detailLabel]}>Delivery Note</Text>
                <Text style={[styles.detailCell, styles.detailValue]}>{invoiceDetails.deliveryNote || ''}</Text>
                <Text style={[styles.detailCell, styles.detailLabel]}>Dated</Text>
                <Text style={[styles.detailCellLast, styles.detailValue]}>{invoiceDetails.invoiceDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailCell, styles.detailLabel]}>Reference No. & Date.</Text>
                <Text style={[styles.detailCell, styles.detailValue]}>{invoiceDetails.referenceNo || ''}</Text>
                <Text style={[styles.detailCell, styles.detailLabel]}>Mode/Terms of Payment</Text>
                <Text style={[styles.detailCellLast, styles.detailValue]}>{invoiceDetails.modeOfPayment}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailCell, styles.detailLabel]}>Buyer's Order No.</Text>
                <Text style={[styles.detailCell, styles.detailValue]}>{invoiceDetails.buyerOrderNo || ''}</Text>
                <Text style={[styles.detailCell, styles.detailLabel]}>Other References</Text>
                <Text style={[styles.detailCellLast, styles.detailValue]}>{invoiceDetails.otherReferences || ''}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailCell, styles.detailLabel]}>Dispatch Doc No.</Text>
                <Text style={[styles.detailCell, styles.detailValue]}>{invoiceDetails.dispatchDocNo || ''}</Text>
                <Text style={[styles.detailCell, styles.detailLabel]}>Dated</Text>
                <Text style={[styles.detailCellLast, styles.detailValue]}></Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailCell, styles.detailLabel]}>Dispatched through</Text>
                <Text style={[styles.detailCell, styles.detailValue]}>{invoiceDetails.dispatchedThrough || ''}</Text>
                <Text style={[styles.detailCell, styles.detailLabel]}>Delivery Note Date</Text>
                <Text style={[styles.detailCellLast, styles.detailValue]}>{invoiceDetails.deliveryNoteDate || ''}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailCell, styles.detailLabel]}>Bill of Lading/LR-RR No.</Text>
                <Text style={[styles.detailCell, styles.detailValue]}>{invoiceDetails.billOfLadingNo || ''}</Text>
                <Text style={[styles.detailCell, styles.detailLabel]}>Destination</Text>
                <Text style={[styles.detailCellLast, styles.detailValue]}>{invoiceDetails.destination || ''}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailCell, styles.detailLabel]}>{invoiceDetails.billOfLadingDate || ''}</Text>
                <Text style={[styles.detailCell, styles.detailValue]}></Text>
                <Text style={[styles.detailCell, styles.detailLabel]}>Motor Vehicle No.</Text>
                <Text style={[styles.detailCellLast, styles.detailValue]}>{invoiceDetails.motorVehicleNo || ''}</Text>
              </View>
              <View style={[styles.detailRow, { borderBottom: 'none' }]}>
                <Text style={[styles.detailCell, styles.detailLabel]}>Terms of Delivery</Text>
                <Text style={[styles.detailCellLast, { width: '75%' }]}>{invoiceDetails.termsOfDelivery || ''}</Text>
              </View>
            </View>
          </View>

          {/* Buyer Section */}
          <View style={styles.buyerSection}>
            <Text style={styles.sectionTitle}>Buyer (Bill to)</Text>
            <Text style={styles.buyerName}>{buyer.name}</Text>
            {buyer.address.map((line, idx) => (
              <Text key={idx} style={styles.buyerDetail}>{line}</Text>
            ))}
            <View style={styles.buyerGrid}>
              <View style={styles.buyerGridCol}>
                <Text style={styles.buyerDetail}>
                  <Text style={styles.boldLabel}>GSTIN/UIN: </Text>{buyer.gstin}
                </Text>
                <Text style={styles.buyerDetail}>
                  <Text style={styles.boldLabel}>PAN/IT No: </Text>{buyer.pan}
                </Text>
              </View>
              <View style={styles.buyerGridCol}>
                <Text style={styles.buyerDetail}>
                  <Text style={styles.boldLabel}>State Name: </Text>{buyer.state}, <Text style={styles.boldLabel}>Code: </Text>{buyer.stateCode}
                </Text>
                <Text style={styles.buyerDetail}>
                  <Text style={styles.boldLabel}>Place of Supply: </Text>{buyer.placeOfSupply}
                </Text>
              </View>
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.itemsTable}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.slNoCell]}>Sl{'\n'}No.</Text>
              <Text style={[styles.tableHeaderCell, styles.descriptionCell]}>Description of Goods</Text>
              <Text style={[styles.tableHeaderCell, styles.hsnCell]}>HSN/SAC</Text>
              <Text style={[styles.tableHeaderCell, styles.quantityCell]}>Quantity</Text>
              <Text style={[styles.tableHeaderCell, styles.rateCell]}>Rate</Text>
              <Text style={[styles.tableHeaderCell, styles.unitCell]}>per</Text>
              <Text style={[styles.tableHeaderCellLast, styles.amountCell]}>Amount</Text>
            </View>

            {/* Table Rows */}
            {items.map((item) => (
              <View key={item.slNo} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.slNoCell]}>{item.slNo}</Text>
                <View style={[styles.tableCell, styles.descriptionCell]}>
                  <Text style={styles.itemDescription}>{item.description.split('\n')[0]}</Text>
                  {item.description.split('\n').slice(1).map((line, idx) => (
                    <Text key={idx} style={styles.itemSubtext}>{line}</Text>
                  ))}
                </View>
                <Text style={[styles.tableCell, styles.hsnCell]}>{item.hsnSac}</Text>
                <Text style={[styles.tableCell, styles.quantityCell]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.rateCell]}>{item.rate.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.unitCell]}>{item.unit}</Text>
                <Text style={[styles.tableCellLast, styles.amountCell]}>
                  {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            ))}

            {/* Subtotal */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}></Text>
              <Text style={styles.totalValue}>
                {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>

            {/* IGST */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IGST @{igstRate}%</Text>
              <Text style={styles.totalValue}>
                {igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>

            {/* Round Off */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>ROUND OFF</Text>
              <Text style={styles.totalValue}>{roundOff.toFixed(2)}</Text>
            </View>

            {/* Grand Total */}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalQty}>{totalQuantity.toFixed(3)} kg</Text>
              <Text style={styles.grandTotalValue}>
                ₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          {/* Amount in Words & Balance */}
          <View style={styles.amountWordsSection}>
            <View style={styles.amountWordsLeft}>
              <Text style={styles.amountWordsLabel}>Amount Chargeable (in words)</Text>
              <Text style={styles.amountWordsText}>{numberToWords(grandTotal)}</Text>
              <Text style={styles.eoeText}>E. & O.E</Text>
            </View>
            <View style={styles.amountWordsRight}>
              <Text style={styles.balanceText}>
                <Text style={styles.boldLabel}>Previous Balance: </Text>
                ₹ {previousBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Dr
              </Text>
              <Text style={styles.balanceText}>
                <Text style={styles.boldLabel}>Current Balance: </Text>
                ₹ {currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Dr
              </Text>
              <View style={styles.qrCodeContainer}>
                <Text style={styles.qrCodeLabel}>Scan to pay</Text>
                {qrCode ? (
                  <Image src={qrCode} style={{ width: 80, height: 80 }} />
                ) : (
                  <View style={styles.qrCodePlaceholder}>
                    <Text style={{ fontSize: 7 }}>QR Code</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Tax Summary Table */}
          <View style={styles.taxTable}>
            <View style={styles.taxTableHeader}>
              <Text style={[styles.tableHeaderCell, styles.taxHsnCell]}>HSN/SAC</Text>
              <Text style={[styles.tableHeaderCell, styles.taxValueCell]}>Taxable Value</Text>
              <Text style={[styles.tableHeaderCell, styles.taxRateCell]}>IGST{'\n'}Rate</Text>
              <Text style={[styles.tableHeaderCell, styles.taxAmountCell]}>IGST{'\n'}Amount</Text>
              <Text style={[styles.tableHeaderCellLast, styles.taxTotalCell]}>Total Tax Amount</Text>
            </View>
            <View style={styles.taxTableRow}>
              <Text style={styles.taxHsnCell}>39232100</Text>
              <Text style={styles.taxValueCell}>
                {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.taxRateCell}>{igstRate}%</Text>
              <Text style={styles.taxAmountCell}>
                {igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.taxTotalCell}>
                {igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={[styles.taxTableRow, { fontFamily: 'Helvetica-Bold' }]}>
              <Text style={styles.taxHsnCell}>Total</Text>
              <Text style={styles.taxValueCell}>
                {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.taxRateCell}></Text>
              <Text style={styles.taxAmountCell}>
                {igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.taxTotalCell}>
                {igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          {/* Tax Amount in Words */}
          <View style={styles.taxAmountWords}>
            <Text>
              <Text style={styles.boldLabel}>Tax Amount (in words): </Text>
              {numberToWords(igstAmount)}
            </Text>
          </View>

          {/* Footer - Declaration & Bank Details */}
          <View style={styles.footerSection}>
            <View style={styles.declarationSection}>
              <Text style={styles.declarationTitle}>Declaration</Text>
              <Text style={styles.declarationText}>
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
              </Text>
            </View>
            <View style={styles.bankDetailsSection}>
              <Text style={styles.declarationTitle}>Company's Bank Details</Text>
              <Text style={styles.bankDetailItem}>
                <Text style={styles.boldLabel}>A/c Holder's Name: </Text>{bankDetails.accountHolderName}
              </Text>
              <Text style={styles.bankDetailItem}>
                <Text style={styles.boldLabel}>Bank Name: </Text>{bankDetails.bankName}
              </Text>
              <Text style={styles.bankDetailItem}>
                <Text style={styles.boldLabel}>A/c No.: </Text>{bankDetails.accountNo}
              </Text>
              <Text style={styles.bankDetailItem}>
                <Text style={styles.boldLabel}>Branch & IFS Code: </Text>{bankDetails.branchAndIFSC}
              </Text>
              {bankDetails.swiftCode && (
                <Text style={styles.bankDetailItem}>
                  <Text style={styles.boldLabel}>SWIFT Code: </Text>{bankDetails.swiftCode}
                </Text>
              )}
              <View style={styles.signatureSection}>
                <Text style={styles.signatureText}>for {company.name}</Text>
                <Text style={styles.signatoryText}>Authorised Signatory</Text>
              </View>
            </View>
          </View>

          {/* Footer Note */}
          <View style={styles.footerNote}>
            <Text>This is a Computer Generated Invoice</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;
