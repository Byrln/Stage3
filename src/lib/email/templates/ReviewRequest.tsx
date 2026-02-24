export type ReviewRequestProps = {
  tenantName: string;
  customerName: string;
  bookingNumber: string;
  tourTitle: string;
  reviewUrl: string;
};

export function ReviewRequest(props: ReviewRequestProps) {
  const {tenantName, customerName, bookingNumber, tourTitle, reviewUrl} = props;

  return (
    <div>
      <h1>How was your experience?</h1>
      <p>Hi {customerName},</p>
      <p>
        We hope you enjoyed <strong>{tourTitle}</strong> with {tenantName}.
      </p>
      <p>
        Please take a moment to review your experience for booking {bookingNumber}.
      </p>
      <p>
        <a href={reviewUrl}>Leave a review</a>
      </p>
    </div>
  );
}

