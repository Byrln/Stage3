"use client";

import {useState} from "react";
import type {Role} from "@prisma/client";
import {sileo} from "sileo";

type StaffRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastActiveAt: string | null;
  assignedToursCount: number;
  isCurrentUser: boolean;
};

type StaffListClientProps = {
  locale: string;
  staff: StaffRow[];
};

type InviteFormState = {
  email: string;
  role: Role;
};

export function StaffListClient(props: StaffListClientProps) {
  const {staff} = props;
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteState, setInviteState] = useState<InviteFormState>({
    email: "",
    role: "SALES",
  });

  async function handleInviteSubmit(event: React.FormEvent) {
    event.preventDefault();

    sileo.info({
      title: "Invite staff",
      description: "Wire this form to an API route that creates an invite token and sends an email.",
    });

    setInviteDialogOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-neutral-400">
          Invited team members will have access to this workspace based on their role.
        </p>
        <button
          type="button"
          onClick={() => setInviteDialogOpen(true)}
          className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-neutral-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
        >
          Invite staff member
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <div
            key={member.id}
            className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-[11px] text-neutral-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-neutral-50">
                {member.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-neutral-50">{member.name}</span>
                <span className="text-[11px] text-neutral-400">{member.email}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-200">
                {member.role}
              </span>
              {member.isCurrentUser && (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                  You
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-neutral-400">
              <span>
                Last active:{" "}
                {member.lastActiveAt
                  ? new Date(member.lastActiveAt).toLocaleString()
                  : "Never"}
              </span>
              <span>{member.assignedToursCount} tours assigned</span>
            </div>
          </div>
        ))}
      </div>

      {inviteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-[11px] text-neutral-200">
            <p className="text-[11px] font-semibold text-neutral-100">
              Invite staff member
            </p>
            <p className="mt-1 text-[11px] text-neutral-400">
              Send an email invitation with a secure sign-up link.
            </p>
            <form className="mt-3 space-y-2" onSubmit={handleInviteSubmit}>
              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400">Email</label>
                <input
                  type="email"
                  required
                  value={inviteState.email}
                  onChange={(event) =>
                    setInviteState((current) => ({...current, email: event.target.value}))
                  }
                  className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-neutral-400">Role</label>
                <select
                  value={inviteState.role}
                  onChange={(event) =>
                    setInviteState((current) => ({
                      ...current,
                      role: event.target.value as Role,
                    }))
                  }
                  className="h-8 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-[11px] text-neutral-100 outline-none"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SALES">Sales</option>
                  <option value="SUPPORT">Support</option>
                  <option value="USER">User</option>
                </select>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInviteDialogOpen(false)}
                  className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-[11px] text-neutral-100 hover:bg-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-neutral-950 hover:bg-emerald-400"
                >
                  Send invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

