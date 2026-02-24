export type BookingCancellationProps = {
  tenantName: string;
  customerName: string;
  bookingNumber: string;
  tourTitle: string;
  refundAmount?: string;
};

export function BookingCancellation(props: BookingCancellationProps) {
  const {tenantName, customerName, bookingNumber, tourTitle, refundAmount} = props;

  return (
    <div>
      <h1>Booking cancelled</h1>
      <p>Hi {customerName},</p>
      <p>
        Your booking <strong>{bookingNumber}</strong> for {tourTitle} with {tenantName} has
        been cancelled.
      </p>
      {refundAmount && (
        <p>
          A refund of <strong>{refundAmount}</strong> will be processed according to your
          payment method.
        </p>
      )}
    </div>
  );
}

