export type PasswordResetProps = {
  tenantName: string;
  email: string;
  resetUrl: string;
};

export function PasswordReset(props: PasswordResetProps) {
  const {tenantName, email, resetUrl} = props;

  return (
    <div>
      <h1>Reset your password</h1>
      <p>Hi {email},</p>
      <p>
        We received a request to reset your password for {tenantName}. If this was not you,
        you can safely ignore this email.
      </p>
      <p>
        <a href={resetUrl}>Reset password</a>
      </p>
    </div>
  );
}

