export type PaymentReceivedProps = {
  tenantName: string;
  customerName: string;
  bookingNumber: string;
  amount: string;
  breakdown?: string;
};

export function PaymentReceived(props: PaymentReceivedProps) {
  const {tenantName, customerName, bookingNumber, amount, breakdown} = props;

  return (
    <div>
      <h1>Payment received</h1>
      <p>Hi {customerName},</p>
      <p>
        We have received <strong>{amount}</strong> for booking {bookingNumber} with{" "}
        {tenantName}.
      </p>
      {breakdown && <p>{breakdown}</p>}
    </div>
  );
}

