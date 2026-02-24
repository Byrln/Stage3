"use client";

import {useEffect, useState} from "react";
import type PusherClient from "pusher-js";
import {createPusherClient} from "@/lib/pusher";

export type RealtimeNotificationEvent =
  | "new-booking"
  | "booking-updated"
  | "payment-received"
  | "system-alert";

export type RealtimeNotification = {
  id: string;
  type: RealtimeNotificationEvent;
  title: string;
  message: string;
  createdAt: string;
};

type UseRealtimeNotificationsOptions = {
  tenantId: string;
};

export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions) {
  const {tenantId} = options;
  const [client, setClient] = useState<PusherClient | null>(null);
  const [events, setEvents] = useState<RealtimeNotification[]>([]);

  useEffect(() => {
    const pusher = createPusherClient();
    const channel = pusher.subscribe(`tenant-${tenantId}`);

    function handleEvent(data: RealtimeNotification) {
      setEvents((current) => [data, ...current].slice(0, 50));
    }

    channel.bind("new-booking", handleEvent);
    channel.bind("booking-updated", handleEvent);
    channel.bind("payment-received", handleEvent);
    channel.bind("system-alert", handleEvent);

    setClient(pusher);

    return () => {
      channel.unbind("new-booking", handleEvent);
      channel.unbind("booking-updated", handleEvent);
      channel.unbind("payment-received", handleEvent);
      channel.unbind("system-alert", handleEvent);
      pusher.unsubscribe(`tenant-${tenantId}`);
      pusher.disconnect();
    };
  }, [tenantId]);

  return {
    client,
    events,
  };
}

