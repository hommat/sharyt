import React, { useEffect, useState, useRef } from "react";
import deepCopy from "clone-deep";

import styled from "../../styles";
import MessageGroup, { MessageGroupType } from "./MessageGroup";
import { useRoom } from "../../context/room";
import { isSentTimeEqual } from "../../utils/time";

type ResponseMessage = {
  id: string;
  sendTime: number;
  author: string;
  content: string;
};

const SList = styled.ul`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  padding: 0.6em;
`;

const welcomeMessage: MessageGroupType = {
  author: "System",
  messages: [
    {
      content: "Welcome in chat room",
      id: "123",
      showSendTime: true,
      sendTime: Date.now(),
    },
  ],
};

const MessageList = () => {
  const { socket } = useRoom();
  const [messageGroups, setMessagesGroups] = useState<MessageGroupType[]>([
    welcomeMessage,
  ]);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", onMessage);
    }
    // eslint-disable-next-line
  }, [socket]);

  function onMessage({ author, ...rest }: ResponseMessage) {
    setMessagesGroups((prevGroups): MessageGroupType[] => {
      const message = { ...rest, showSendTime: true };
      const otherGroups: MessageGroupType[] = deepCopy(prevGroups);
      const lastGroup = otherGroups.pop() as MessageGroupType;

      if (author === lastGroup.author) {
        const lastMessage = lastGroup.messages[lastGroup.messages.length - 1];
        if (isSentTimeEqual(lastMessage.sendTime, rest.sendTime)) {
          lastMessage.showSendTime = false;
        }

        lastGroup.messages.push(message);
        return [...otherGroups, lastGroup];
      }

      return [...otherGroups, lastGroup, { author, messages: [message] }];
    });

    if (listRef.current) {
      listRef.current.scroll({ top: listRef.current.scrollHeight });
    }
  }

  return (
    <SList ref={listRef}>
      {messageGroups.map((messageGroup) => (
        <MessageGroup key={messageGroup.messages[0].id} {...messageGroup} />
      ))}
    </SList>
  );
};

export default MessageList;
