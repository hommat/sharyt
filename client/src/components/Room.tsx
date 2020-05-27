import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";

import Video, { playerHeight, playerWidth } from "./Video";
import VideoLoader from "./VideoLoader";
import VideoChanger from "./VideoChanger";

type Params = { roomId: string };

const VideoContainer = styled.div`
  width: ${playerWidth}px;
  height: ${playerHeight}px;
`;

const Room = () => {
  const history = useHistory();
  const { roomId } = useParams<Params>();
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [videoId, setVideoId] = useState<string>("");

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER!);
    const joinRoomData = { roomId, username: "some username" };
    const joinRoomCallback = (room?: any) => {
      if (room) {
        setVideoId(room.videoId);
        setSocket(socket);
        socket.on("changeVideo", onChangeVideo);
        history.replace("/room/" + room.id);
      } else history.replace("/");
    };

    socket.emit("joinRoom", joinRoomData, joinRoomCallback);

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  function onChangeVideo(videoId: string) {
    setVideoId(videoId);
  }

  return (
    <main>
      <h2>Room</h2>
      <VideoContainer>
        {socket ? (
          <Video videoId={videoId} socket={socket} roomId={roomId} />
        ) : (
          <VideoLoader />
        )}
      </VideoContainer>
      {socket && <VideoChanger socket={socket} roomId={roomId} />}
    </main>
  );
};

export default Room;
