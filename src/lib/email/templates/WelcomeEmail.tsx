export type WelcomeEmailProps = {
  tenantName: string;
  customerName: string;
};

export function WelcomeEmail(props: WelcomeEmailProps) {
  const {tenantName, customerName} = props;

  return (
    <div>
      <h1>Welcome to {tenantName}</h1>
      <p>Hi {customerName},</p>
      <p>Thank you for signing up. We are excited to help you plan your trips.</p>
    </div>
  );
}

