import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface InvoiceItem {
  slNo: number;
  description: string;
  hsnSac: string;
  quantity: string;
  rate: number;
  unit: string;
  amount: number;
}

interface InvoicePdfProps {
  company: any;
  buyer: any;
  invoiceDetails: any;
  items: InvoiceItem[];
  igstRate: number;
  previousBalance?: number;
  bankDetails: any;
  qrCode?: string;
}

// Enhanced Number to Words Function
const numberToWords = (num: number): string => {
  if (num === 0) return "Zero Only";
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  };
  
  const convertNumber = (n: number): string => {
    if (n === 0) return '';
    if (n < 1000) return convertLessThanThousand(n);
    if (n < 100000) {
      const thousands = Math.floor(n / 1000);
      const remainder = n % 1000;
      return convertLessThanThousand(thousands) + ' Thousand' + (remainder !== 0 ? ' ' + convertLessThanThousand(remainder) : '');
    }
    if (n < 10000000) {
      const lakhs = Math.floor(n / 100000);
      const remainder = n % 100000;
      return convertLessThanThousand(lakhs) + ' Lakh' + (remainder !== 0 ? ' ' + convertNumber(remainder) : '');
    }
    const crores = Math.floor(n / 10000000);
    const remainder = n % 10000000;
    return convertLessThanThousand(crores) + ' Crore' + (remainder !== 0 ? ' ' + convertNumber(remainder) : '');
  };
  
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  let result = 'INR ' + convertNumber(rupees);
  if (paise > 0) {
    result += ' and ' + convertNumber(paise) + ' Paise';
  }
  return result + ' Only';
};

const styles = StyleSheet.create({
  page: { 
    fontFamily: 'Helvetica', 
    fontSize: 8, 
    padding: 20 
  },
  container: { 
    border: '2px solid black' 
  },
  
  // Header styles
  header: { 
    padding: 6, 
    borderBottom: '2px solid black', 
    textAlign: 'center',
    backgroundColor: '#ffffff'
  },
  headerText: { 
    fontSize: 14, 
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2
  },
  headerSubtext: {
    fontSize: 8,
    fontFamily: 'Helvetica'
  },
  
  // Top section - Company and Invoice Details
  topSection: { 
    flexDirection: 'row', 
    borderBottom: '2px solid black' 
  },
  companySection: { 
    width: '50%', 
    padding: 8, 
    borderRight: '2px solid black' 
  },
  invoiceDetailsSection: { 
    width: '50%'
  },
  
  companyName: { 
    fontSize: 11, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 2 
  },
  companyAddress: { 
    fontSize: 7, 
    marginBottom: 1,
    lineHeight: 1.3
  },
  companyInfo: { 
    fontSize: 7, 
    marginBottom: 1 
  },
  bold: { 
    fontFamily: 'Helvetica-Bold' 
  },
  
  // Invoice details grid
  detailRow: { 
    flexDirection: 'row', 
    borderBottom: '1px solid black' 
  },
  detailLabel: { 
    width: '40%', 
    padding: 4, 
    fontFamily: 'Helvetica-Bold', 
    fontSize: 7,
    borderRight: '1px solid black'
  },
  detailValue: { 
    width: '60%', 
    padding: 4, 
    fontSize: 7 
  },
  
  // Buyer/Consignee section
  buyerConsigneeSection: { 
    flexDirection: 'row', 
    borderBottom: '2px solid black' 
  },
  buyerSection: { 
    width: '50%', 
    padding: 8, 
    borderRight: '2px solid black' 
  },
  consigneeSection: { 
    width: '50%', 
    padding: 8 
  },
  sectionTitle: { 
    fontSize: 8, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 3 
  },
  buyerName: { 
    fontSize: 9, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 2 
  },
  buyerAddress: { 
    fontSize: 7, 
    marginBottom: 1 
  },
  buyerInfo: { 
    fontSize: 7, 
    marginBottom: 1 
  },
  
  // Table styles
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#f5f5f5', 
    borderBottom: '1px solid black',
    fontFamily: 'Helvetica-Bold'
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottom: '1px solid black',
    minHeight: 20
  },
  th: { 
    padding: 4, 
    fontSize: 7, 
    textAlign: 'center', 
    borderRight: '1px solid black',
    fontFamily: 'Helvetica-Bold'
  },
  td: { 
    padding: 4, 
    fontSize: 7, 
    borderRight: '1px solid black' 
  },
  tdCenter: {
    textAlign: 'center'
  },
  tdRight: {
    textAlign: 'right',
    paddingRight: 6
  },
  
  // Tax and total rows
  taxRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    minHeight: 15
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid black',
    fontFamily: 'Helvetica-Bold'
  },
  
  // Amount in words
  amountInWords: { 
    padding: 6, 
    borderBottom: '2px solid black',
    fontSize: 7
  },
  amountInWordsLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2
  },
  
  // Balance section
  balanceSection: {
    flexDirection: 'row',
    borderBottom: '2px solid black',
    fontSize: 7
  },
  balanceLeft: {
    width: '15%',
    padding: 6,
    borderRight: '1px solid black'
  },
  balanceTable: {
    width: '85%',
    flexDirection: 'column'
  },
  balanceRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black'
  },
  balanceCell: {
    padding: 4,
    borderRight: '1px solid black',
    fontSize: 7,
    textAlign: 'center'
  },
  balanceCellLabel: {
    fontFamily: 'Helvetica-Bold'
  },
  
  // Tax amount in words
  taxAmountWords: {
    padding: 6,
    borderBottom: '2px solid black',
    fontSize: 7
  },
  
  // Bank and QR section
  bankQrSection: { 
    flexDirection: 'row', 
    borderBottom: '2px solid black' 
  },
  qrSection: { 
    width: '20%', 
    padding: 8, 
    borderRight: '2px solid black', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  bankSection: { 
    width: '80%', 
    padding: 8 
  },
  qrImage: { 
    width: 60, 
    height: 60,
    marginBottom: 4
  },
  qrText: { 
    fontSize: 6, 
    textAlign: 'center' 
  },
  bankTitle: { 
    fontSize: 8, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 4 
  },
  bankDetail: { 
    fontSize: 7, 
    marginBottom: 2 
  },
  
  // Declaration and signature
  declarationSection: { 
    flexDirection: 'row', 
    minHeight: 80,
    borderBottom: '2px solid black'
  },
  declarationLeft: { 
    width: '60%', 
    padding: 8,
    borderRight: '2px solid black'
  },
  signatureRight: { 
    width: '40%', 
    padding: 8,
    alignItems: 'center'
  },
  declarationTitle: { 
    fontSize: 8, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 3 
  },
  declarationText: { 
    fontSize: 7,
    lineHeight: 1.4
  },
  signatureCompany: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 30
  },
  signatureLine: {
    fontSize: 7,
    marginTop: 10
  },
  
  // Footer
  footer: { 
    padding: 6, 
    textAlign: 'center', 
    fontSize: 7,
    fontFamily: 'Helvetica-Bold'
  }
});

const InvoicePdf: React.FC<InvoicePdfProps> = ({ 
  company, 
  buyer, 
  invoiceDetails, 
  items, 
  igstRate, 
  previousBalance = 0, 
  bankDetails, 
  qrCode 
}) => {
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const igst = (subtotal * igstRate) / 100;
  const roundOff = Math.round(subtotal + igst) - (subtotal + igst);
  const totalTax = igst;
  const grandTotal = Math.round(subtotal + igst);
  const currentBalance = previousBalance + grandTotal;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Tax Invoice</Text>
            <Text style={styles.headerSubtext}>(ORIGINAL FOR RECIPIENT)</Text>
          </View>

          {/* Seller Details + Invoice Details */}
          <View style={styles.topSection}>
            {/* Left - Company Details */}
            <View style={styles.companySection}>
              <Text style={styles.companyName}>{company?.name || "Company Name"}</Text>
              {company?.address?.map((line: string, i: number) => (
                <Text key={i} style={styles.companyAddress}>{line}</Text>
              ))}
              <Text style={styles.companyInfo}>
                <Text style={styles.bold}>GSTIN/UIN: </Text>{company?.gstin || ""}
              </Text>
              <Text style={styles.companyInfo}>
                <Text style={styles.bold}>State Name: </Text>{company?.state || ""}, Code: {company?.stateCode || ""}
              </Text>
              <Text style={styles.companyInfo}>
                <Text style={styles.bold}>Contact: </Text>{company?.contact?.join(", ") || ""}
              </Text>
              <Text style={styles.companyInfo}>
                <Text style={styles.bold}>E-Mail: </Text>{company?.email || ""}
              </Text>
            </View>

            {/* Right - Invoice Details */}
            <View style={styles.invoiceDetailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Invoice No.</Text>
                <Text style={styles.detailValue}>{invoiceDetails?.invoiceNo || ""}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>e-Way Bill No.</Text>
                <Text style={styles.detailValue}>Dated</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dated</Text>
                <Text style={styles.detailValue}>{invoiceDetails?.date || ""}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Delivery Note</Text>
                <Text style={styles.detailValue}></Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mode/Terms of Payment</Text>
                <Text style={styles.detailValue}>{invoiceDetails?.paymentTerms || "IMMEDIATE"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reference No. & Date.</Text>
                <Text style={styles.detailValue}>Other References</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Buyer's Order No.</Text>
                <Text style={styles.detailValue}>Dated</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dispatch Doc No.</Text>
                <Text style={styles.detailValue}>Delivery Note Date</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dispatched through</Text>
                <Text style={styles.detailValue}>Destination</Text>
              </View>
              <View style={[styles.detailRow, { borderBottom: 'none' }]}>
                <Text style={styles.detailLabel}>Bill of Lading/LR-RR No.</Text>
                <Text style={styles.detailValue}>Motor Vehicle No.</Text>
              </View>
              <View style={[styles.detailRow, { borderBottom: 'none' }]}>
                <Text style={styles.detailLabel}>Dated</Text>
                <Text style={styles.detailValue}>{invoiceDetails?.lrDate || ""}</Text>
              </View>
              <View style={[styles.detailRow, { borderBottom: 'none' }]}>
                <Text style={styles.detailLabel}>Terms of Delivery</Text>
                <Text style={styles.detailValue}></Text>
              </View>
            </View>
          </View>

          {/* Buyer and Consignee */}
          <View style={styles.buyerConsigneeSection}>
            {/* Buyer (Bill to) */}
            <View style={styles.buyerSection}>
              <Text style={styles.sectionTitle}>Buyer (Bill to)</Text>
              <Text style={styles.buyerName}>{buyer?.name || ""}</Text>
              {buyer?.address?.map((line: string, i: number) => (
                <Text key={i} style={styles.buyerAddress}>{line}</Text>
              ))}
              <Text style={styles.buyerInfo}>
                <Text style={styles.bold}>GSTIN/UIN: </Text>{buyer?.gstin || ""}
              </Text>
              <Text style={styles.buyerInfo}>
                <Text style={styles.bold}>State Name: </Text>{buyer?.state || ""}, Code: {buyer?.stateCode || ""}
              </Text>
            </View>

            {/* Consignee (Ship to) */}
            <View style={styles.consigneeSection}>
              <Text style={styles.sectionTitle}>Consignee (Ship to)</Text>
              <Text style={styles.buyerName}>{buyer?.consigneeName || buyer?.name || ""}</Text>
              {(buyer?.consigneeAddress || buyer?.address)?.map((line: string, i: number) => (
                <Text key={i} style={styles.buyerAddress}>{line}</Text>
              ))}
              <Text style={styles.buyerInfo}>
                <Text style={styles.bold}>GSTIN/UIN: </Text>{buyer?.consigneeGstin || buyer?.gstin || ""}
              </Text>
              <Text style={styles.buyerInfo}>
                <Text style={styles.bold}>State Name: </Text>{buyer?.consigneeState || buyer?.state || ""}, Code: {buyer?.consigneeStateCode || buyer?.stateCode || ""}
              </Text>
            </View>
          </View>

          {/* Items Table */}
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { width: '5%' }]}>SI{'\n'}No.</Text>
              <Text style={[styles.th, { width: '33%' }]}>Description of Goods</Text>
              <Text style={[styles.th, { width: '10%' }]}>HSN/SAC</Text>
              <Text style={[styles.th, { width: '10%' }]}>Quantity</Text>
              <Text style={[styles.th, { width: '10%' }]}>Rate</Text>
              <Text style={[styles.th, { width: '8%' }]}>per</Text>
              <Text style={[styles.th, { width: '12%', borderRight: 'none' }]}>Amount</Text>
            </View>

            {/* Table Rows */}
            {items.map((item, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={[styles.td, styles.tdCenter, { width: '5%' }]}>{i + 1}</Text>
                <Text style={[styles.td, { width: '33%' }]}>{item.description}</Text>
                <Text style={[styles.td, styles.tdCenter, { width: '10%' }]}>{item.hsnSac}</Text>
                <Text style={[styles.td, styles.tdRight, { width: '10%' }]}>{item.quantity}</Text>
                <Text style={[styles.td, styles.tdRight, { width: '10%' }]}>{item.rate.toFixed(2)}</Text>
                <Text style={[styles.td, styles.tdCenter, { width: '8%' }]}>{item.unit}</Text>
                <Text style={[styles.td, styles.tdRight, { width: '12%', borderRight: 'none' }]}>
                  {item.amount.toFixed(2)}
                </Text>
              </View>
            ))}

            {/* Blank rows for spacing (if needed) */}
            {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => (
              <View style={styles.tableRow} key={`blank-${i}`}>
                <Text style={[styles.td, { width: '5%' }]}></Text>
                <Text style={[styles.td, { width: '33%' }]}></Text>
                <Text style={[styles.td, { width: '10%' }]}></Text>
                <Text style={[styles.td, { width: '10%' }]}></Text>
                <Text style={[styles.td, { width: '10%' }]}></Text>
                <Text style={[styles.td, { width: '8%' }]}></Text>
                <Text style={[styles.td, { width: '12%', borderRight: 'none' }]}></Text>
              </View>
            ))}

            {/* Tax Row */}
            <View style={styles.taxRow}>
              <Text style={[styles.td, { width: '66%' }]}>
                <Text style={styles.bold}>IGST @{igstRate}%</Text>{'\n'}
                <Text style={styles.bold}>ROUND OFF</Text>
              </Text>
              <Text style={[styles.td, { width: '22%' }]}>{igstRate}%</Text>
              <Text style={[styles.td, styles.tdRight, { width: '12%', borderRight: 'none' }]}>
                {igst.toFixed(2)}{'\n'}
                {roundOff.toFixed(2)}
              </Text>
            </View>

            {/* Total Row */}
            <View style={styles.totalRow}>
              <Text style={[styles.td, { width: '66%', fontFamily: 'Helvetica-Bold', fontSize: 8 }]}>Total</Text>
              <Text style={[styles.td, { width: '22%', fontFamily: 'Helvetica-Bold' }]}>
                {subtotal.toFixed(2)} kg
              </Text>
              <Text style={[styles.td, styles.tdRight, { width: '12%', borderRight: 'none', fontFamily: 'Helvetica-Bold', fontSize: 8 }]}>
                ₹ {grandTotal.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Amount Chargeable in Words */}
          <View style={styles.amountInWords}>
            <Text style={styles.amountInWordsLabel}>Amount Chargeable (in words)</Text>
            <Text>{numberToWords(grandTotal)}</Text>
          </View>

          {/* Balance Section */}
          <View style={styles.balanceSection}>
            <View style={styles.balanceLeft}>
              <Text style={{ fontSize: 7, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                HSN/SAC
              </Text>
            </View>
            <View style={styles.balanceTable}>
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '20%' }]}>Taxable{'\n'}Value</Text>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '10%' }]}>Rate</Text>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '15%' }]}>Amount</Text>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '15%' }]}>Tax Amount</Text>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '20%' }]}>Previous Balance:</Text>
                <Text style={[styles.balanceCell, { width: '20%', borderRight: 'none' }]}>
                  ₹ {previousBalance.toFixed(2)} Dr
                </Text>
              </View>
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceCell, { width: '20%' }]}>{subtotal.toFixed(2)}</Text>
                <Text style={[styles.balanceCell, { width: '10%' }]}>{igstRate}%</Text>
                <Text style={[styles.balanceCell, { width: '15%' }]}>{igst.toFixed(2)}</Text>
                <Text style={[styles.balanceCell, { width: '15%' }]}>{totalTax.toFixed(2)}</Text>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '20%' }]}>Current Balance:</Text>
                <Text style={[styles.balanceCell, { width: '20%', borderRight: 'none' }]}>
                  ₹ {currentBalance.toFixed(2)} Dr
                </Text>
              </View>
              <View style={[styles.balanceRow, { borderBottom: 'none' }]}>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '20%' }]}>Total</Text>
                <Text style={[styles.balanceCell, { width: '10%' }]}></Text>
                <Text style={[styles.balanceCell, { width: '15%' }]}>{subtotal.toFixed(2)}</Text>
                <Text style={[styles.balanceCell, { width: '15%' }]}>{totalTax.toFixed(2)}</Text>
                <Text style={[styles.balanceCell, { width: '20%' }]}></Text>
                <Text style={[styles.balanceCell, { width: '20%', borderRight: 'none' }]}></Text>
              </View>
            </View>
          </View>

          {/* Tax Amount in Words */}
          <View style={styles.taxAmountWords}>
            <Text style={[styles.bold, { marginBottom: 2 }]}>Tax Amount (in words):</Text>
            <Text>{numberToWords(totalTax)}</Text>
          </View>

          {/* Bank Details and QR Code */}
          <View style={styles.bankQrSection}>
            {/* QR Code */}
            <View style={styles.qrSection}>
              {qrCode ? (
                <Image src={qrCode} style={styles.qrImage} />
              ) : (
                <View style={{ width: 60, height: 60, border: '1px solid black', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 6 }}>QR Code</Text>
                </View>
              )}
              <Text style={styles.qrText}>Scan to pay</Text>
            </View>

            {/* Bank Details */}
            <View style={styles.bankSection}>
              <Text style={styles.bankTitle}>Company's Bank Details</Text>
              <Text style={styles.bankDetail}>
                <Text style={styles.bold}>A/c Holder's Name: </Text>
                {bankDetails?.accountHolderName || ""}
              </Text>
              <Text style={styles.bankDetail}>
                <Text style={styles.bold}>Bank Name: </Text>
                {bankDetails?.bankName || ""}
              </Text>
              <Text style={styles.bankDetail}>
                <Text style={styles.bold}>A/c No.: </Text>
                {bankDetails?.accountNo || ""}
              </Text>
              <Text style={styles.bankDetail}>
                <Text style={styles.bold}>Branch & IFSC Code: </Text>
                {bankDetails?.branchAndIFSC || ""}
              </Text>
              <Text style={styles.bankDetail}>
                <Text style={styles.bold}>SWIFT Code: </Text>
                {bankDetails?.swiftCode || ""}
              </Text>
              <Text style={{ textAlign: 'right', marginTop: 8, fontSize: 8 }}>E. & O.E</Text>
            </View>
          </View>

          {/* Declaration and Signature */}
          <View style={styles.declarationSection}>
            {/* Declaration */}
            <View style={styles.declarationLeft}>
              <Text style={styles.declarationTitle}>Declaration</Text>
              <Text style={styles.declarationText}>
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
              </Text>
            </View>

            {/* Signature */}
            <View style={styles.signatureRight}>
              <Text style={styles.signatureCompany}>for {company?.name || "Company Name"}</Text>
              <Text style={styles.signatureLine}>Authorised Signatory</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>This is a Computer Generated Invoice</Text>
          </View>

        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;
