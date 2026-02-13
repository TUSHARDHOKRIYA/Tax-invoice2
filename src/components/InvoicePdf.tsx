import styled from 'styled-components';

const PageHeader = styled.h1`
  position: absolute;
  top: 0;
  left: 0;
`;

const HeaderSubtext = styled.h2`
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 20px;
`;

// Other component code...

const InvoicePdf = () => {
  return (
    <div>
      <PageHeader>Tax Invoice</PageHeader>
      <HeaderSubtext>(ORIGINAL FOR RECIPIENT)</HeaderSubtext>
      {/* Rest of the invoice PDF code */}
    </div>
  );
};

export default InvoicePdf;
