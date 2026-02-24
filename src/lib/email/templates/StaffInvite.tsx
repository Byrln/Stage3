export type StaffInviteProps = {
  tenantName: string;
  inviteeEmail: string;
  inviterName: string;
  role: string;
  invitationUrl: string;
};

export function StaffInvite(props: StaffInviteProps) {
  const {tenantName, inviteeEmail, inviterName, role, invitationUrl} = props;

  return (
    <div>
      <h1>You are invited to join {tenantName}</h1>
      <p>Hi {inviteeEmail},</p>
      <p>
        {inviterName} has invited you to join {tenantName} as <strong>{role}</strong>.
      </p>
      <p>
        <a href={invitationUrl}>Accept invitation</a>
      </p>
    </div>
  );
}

