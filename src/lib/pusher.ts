import PusherServer from "pusher";
import PusherClient from "pusher-js";

export function createPusherServer() {
  const appId = process.env.PUSHER_APP_ID || "";
  const key = process.env.PUSHER_KEY || "";
  const secret = process.env.PUSHER_SECRET || "";
  const cluster = process.env.PUSHER_CLUSTER || "eu";

  return new PusherServer({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });
}

export function createPusherClient() {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY || "";
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu";

  return new PusherClient(key, {
    cluster,
    forceTLS: true,
  });
}

