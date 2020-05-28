import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";

import Video, { playerHeight, playerWidth } from "./Video";
import VideoLoader from "./VideoLoader";
import VideoChanger from "./VideoChanger";
import MessageBox from "./MessageBox";

type Params = { roomId: string };
type ResponseRoom = { id: string; videoId: string };

const VideoContainer = styled.div`
  width: ${playerWidth}px;
  height: ${playerHeight}px;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Room = () => {
  const history = useHistory();
  const { roomId } = useParams<Params>();
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [videoId, setVideoId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER!);
    const joinRoomCallback = (room?: ResponseRoom, username?: string) => {
      if (room && username) {
        setVideoId(room.videoId);
        setSocket(socket);
        setUsername(username);
        socket.on("changeVideo", onChangeVideo);
        history.replace("/room/" + room.id);
      } else history.replace("/");
    };

    socket.emit("joinRoom", roomId, joinRoomCallback);

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  function onChangeVideo(videoId: string) {
    setVideoId(videoId);
  }

  return (
    <main className="container">
      <VideoContainer>
        {socket ? (
          <Video videoId={videoId} socket={socket} roomId={roomId} />
        ) : (
          <VideoLoader />
        )}
      </VideoContainer>
      {socket && <VideoChanger socket={socket} roomId={roomId} />}
      {socket && <MessageBox socket={socket} />}
    </main>
  );
};

export default Room;
