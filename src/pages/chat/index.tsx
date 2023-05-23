import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import useWebsocket from "../../lib/hooks/useWebsocket";
import { ChatMessage } from "../../lib/types";
import Button from "../../components/ui/Button";
import * as dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime";
import Input from "../../components/ui/Input";
import { toast } from "react-toastify";
import { useUser } from "../../lib/user-context";

dayjs.extend(relativeTime);

export function getReadableTextForBg(bgColor: string) {
  // remove leading #
  bgColor = bgColor.split("#").pop()!;
  // bgColor might be #XXX or #XXXXXX
  const size = Math.round(bgColor.length / 3);
  const rgb = [
    parseInt(bgColor.substring(0, size), 16),
    parseInt(bgColor.substring(size, size * 2), 16),
    parseInt(bgColor.substring(size * 2, size * 3), 16),
  ];

  const brightness = Math.round((rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000);

  return brightness > 150 ? "black" : "white";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [nickname, setNickname] = useState("");
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  const user = useUser();

  const ws = useWebsocket({
    events: {
      "chat-message": useCallback(
        (msg: ChatMessage) => {
          setMessages(msgs => [msg, ...msgs]);
          // update color map
          if (!colorMap[msg.nickname]) {
            setColorMap(cm => ({
              ...cm,
              [msg.nickname]: Math.floor(0x100000 + Math.random() * 0xefffff).toString(16),
            }));
          }
        },
        [colorMap]
      ),
      exception: useCallback((err: any) => {
        toast.error(err.message);
      }, []),
    },
  });

  // reset state
  useEffect(() => {
    if (ws.isConnected) return;
    setMessages([]);
  }, [ws.isConnected]);

  const handleSendMessage = () => {
    ws.sendMessage(text).then(() => setText(""));
  };

  const handleSetNickname = () => {
    ws.setNickname(nickname);
  };

  return (
    <Layout isLoading={!ws.isConnected}>
      <h1 className="text-4xl mb-4">Guestbook</h1>
      {!user.user && (
        <div className="flex gap-2 mb-3 w-full">
          <Input
            type="text"
            className="flex-grow"
            placeholder="Nickname"
            value={nickname}
            onChange={ev => setNickname(ev.target.value)}
          ></Input>
          <Button onClick={handleSetNickname}>Set nickname</Button>
        </div>
      )}
      <div className="flex gap-2 mb-3 w-full">
        <Input type="text" className="flex-grow" value={text} onChange={ev => setText(ev.target.value)}></Input>
        <Button onClick={handleSendMessage}>Send message</Button>
      </div>
      <div className="border border-b-0">
        {messages.map(msg => (
          <div className="border-b p-2">
            <span
              className="p-0.5 px-1 rounded"
              style={{
                backgroundColor: "#" + colorMap[msg.nickname],
                color: getReadableTextForBg(colorMap[msg.nickname]),
              }}
            >
              {msg.nickname}
            </span>
            : {msg.text}
            <div className="text-gray-500 text-sm float-right">{dayjs(msg.timestamp).fromNow()}</div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
