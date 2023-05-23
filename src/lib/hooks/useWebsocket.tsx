import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { config } from "../config";
import CookieManager from "../cookie-manager";
import { ChatMessage } from "../types";
import { useUser } from "../user-context";

export interface EventMap {
  "chat-message": (msg: ChatMessage) => void;
  exception: (err: any) => void;
}

export default function useWebsocket({ events }: { events: Partial<EventMap> }) {
  const wsRef = useRef<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const user = useUser();

  const attachHandlers = () => {
    if (!wsRef.current) return;
    const ws = wsRef.current;

    // first detach anything remaining
    // we don't do this in a cleanup function because it won't work
    //  how I want it to
    ws.off("connect");
    ws.off("disconnect");
    const keys = Object.keys(events);
    for (const key of keys) {
      ws.off(key);
    }

    console.count("Reattaching handlers");
    ws.on("connect", () => {
      setIsConnected(true);
    });
    ws.on("disconnect", () => {
      setIsConnected(false);
    });
    for (const key of keys) {
      const handler = events[key as keyof EventMap];
      if (handler) ws.on(key, handler);
    }
    return function cleanup() {};
  };

  // init connection
  useEffect(() => {
    if (user.isLoading) return;
    const token = CookieManager.get("token");
    wsRef.current = io(config.wsBase, {
      transports: ["websocket"],
      auth: {
        token,
      },
    });
    attachHandlers();
    return function cleanup() {
      wsRef.current?.close();
      wsRef.current = undefined;
    };
  }, [user.isLoading]);

  // attach handlers
  useEffect(attachHandlers, [wsRef.current, ...Object.values(events)]);

  return {
    isConnected,
    sendMessage(text: string) {
      return wsRef.current!.emitWithAck("send-message", text);
    },
    setNickname(nick: string) {
      return wsRef.current!.emitWithAck("set-nickname", nick);
    },
  };
}
