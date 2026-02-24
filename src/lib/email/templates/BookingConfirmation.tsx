export type BookingConfirmationProps = {
  tenantName: string;
  customerName: string;
  bookingNumber: string;
  tourTitle: string;
  startDate: string;
  endDate: string;
};

export function BookingConfirmation(props: BookingConfirmationProps) {
  const {tenantName, customerName, bookingNumber, tourTitle, startDate, endDate} = props;

  return (
    <div>
      <h1>Booking confirmed with {tenantName}</h1>
      <p>Hi {customerName},</p>
      <p>
        Thank you for booking <strong>{tourTitle}</strong>.
      </p>
      <p>
        Booking number: <strong>{bookingNumber}</strong>
      </p>
      <p>
        Travel dates: {startDate} - {endDate}
      </p>
    </div>
  );
}

