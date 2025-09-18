"use client";
import { useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { baseURL, pusherCluster, pusherKey } from "@/constants";

interface UsePusherChannelOptions {
  channelName: string;
  eventName: string;
  onEvent: (data: any) => void;
  authToken?: string | null;
  isPrivate?: boolean;
}

export function usePusherChannel({
  channelName,
  eventName,
  onEvent,
  authToken,
  isPrivate = true,
}: UsePusherChannelOptions) {
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    if (!channelName || !eventName || !onEvent) return;

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      forceTLS: true,
      ...(isPrivate && {
        authEndpoint: `https://www.samsunev.com/pusher/auth`,
        auth: {
          headers: {
            Authorization: authToken ? `Bearer ${authToken}` : "",
          },
        },
      }),
    });
    pusherRef.current = pusher;

    const channel = pusher.subscribe(channelName);
    channel.bind(eventName, onEvent);

    return () => {
      channel.unbind(eventName, onEvent);
      channel.unsubscribe();
      pusher.disconnect();
    };
    // eslint-disable-next-line
  }, [channelName, eventName, authToken, isPrivate]);
} 