export type TourReminderProps = {
  tenantName: string;
  customerName: string;
  bookingNumber: string;
  tourTitle: string;
  startDate: string;
  daysBefore: number;
};

export function TourReminder(props: TourReminderProps) {
  const {tenantName, customerName, bookingNumber, tourTitle, startDate, daysBefore} = props;

  return (
    <div>
      <h1>Upcoming tour reminder</h1>
      <p>Hi {customerName},</p>
      <p>
        This is a reminder that your tour <strong>{tourTitle}</strong> with {tenantName} is
        starting on {startDate}.
      </p>
      <p>
        Booking number: <strong>{bookingNumber}</strong>. You are receiving this{" "}
        {daysBefore} days before departure.
      </p>
    </div>
  );
}

