import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/RoomPage.module.css";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import {
  AppState,
  BinaryFiles,
  ExcalidrawAPIRefValue,
} from "@excalidraw/excalidraw/types/types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useLocation } from "react-router-dom";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { CircularProgress } from "@mui/material";
import { useAppSelector } from "../../../redux/hooks";
export default function WhiteBoard({
  pc,
  dataChannel,
  receivedMessages,
}: {
  pc: RTCPeerConnection;
  dataChannel: RTCDataChannel | null;
  receivedMessages: string;
}) {
  const excalidrawRef = useRef<ExcalidrawAPIRefValue | null>(null);
  const [initialData, setInitialData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawAPIRefValue | null>(null);
  const [currentElements, setCurrentElements] = useState<ExcalidrawElement[]>(
    []
  );
  const [dataChannelActive, setDataChannelActive] =
    useState<RTCDataChannel | null>(null);
  const [comingFromListen, setComingFromListen] = useState(false);
  const { profile } = useAppSelector((state) => state.profile);
  const { state } = useLocation();
  const roomDocRef = doc(
    db,
    "users",
    state.belongsToUserId,
    "students",
    state.studentId,
    "lessons",
    state.lesson.id
  );
  const canvasDocReff = doc(roomDocRef, "canvas", "123");
  useEffect(() => {
    setDataChannelActive(dataChannel);
  }, [dataChannel]);
  if (receivedMessages) {
    const messageData = JSON.parse(receivedMessages);
    if (excalidrawAPI && messageData && !comingFromListen) {
      if (excalidrawAPI.ready) {
        setComingFromListen(true);
        console.log(`updating scene`);
        excalidrawAPI.updateScene({
          elements: messageData.message,
        });
      }
    }
  }
  useEffect(() => {
    const handleMessage = async () => {
      console.log(`handling`);

      if (receivedMessages === "") return;
      if (receivedMessages) {
        const messageData = JSON.parse(receivedMessages);
        console.log(messageData);
        if (messageData.sendBy === profile.uid) {
          return;
        }
        setComingFromListen(true);
        console.log(`updating scene`);
        if (excalidrawAPI) {
          if (excalidrawAPI.ready) {
            console.log(`updating scene`);
            excalidrawAPI.updateScene({
              elements: messageData.message,
            });
          }
        }
      }
      // const messageData = JSON.parse(receivedMessages);
      // if (messageData.sendBy === profile.uid) {
      //   return;
      // }
      // setComingFromListen(true);
      // (await excalidrawRef.current?.readyPromise)?.updateScene({
      //   elements: messageData.message,
      // });
    };

    handleMessage();
  }, [receivedMessages]);

  useEffect(() => {
    const getInitialData = async () => {
      const docSnap = await getDoc(canvasDocReff);
      if (docSnap.exists()) {
        setInitialData(docSnap.data().canvas);
        setIsLoading(false);
      }
    };
    getInitialData();
  }, []);

  const sendMessage = (message: string) => {
    const messageData = {
      message,
      sendBy: profile.uid,
    };
    if (comingFromListen) {
      setComingFromListen(false);
      return;
    }
    console.log(`send data`);
    if (pc.signalingState === "stable") {
      if (dataChannelActive) {
        if (dataChannelActive.readyState === "open") {
          dataChannelActive.send(JSON.stringify(messageData));
          console.log("message sent");
        }
      }
    }
  };

  const handleChange = async (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    if (appState.cursorButton === "up") {
      if (areObjectsEqual(elements, currentElements)) {
        return;
      }
    } else {
      if (appState.activeTool.type === "hand") {
        return;
      }
    }
    setCurrentElements(elements as ExcalidrawElement[]);
    if (elements.length === 0) return;

    if (dataChannelActive) {
      sendMessage(JSON.stringify(elements));
    }
  };

  useEffect(() => {
    // ... (your existing code)
    const cleanupFunction = async () => {
      try {
        if (excalidrawRef.current) {
          const elements = (
            await excalidrawRef.current.readyPromise
          )?.getSceneElements();
          const data = JSON.stringify(elements);

          await setDoc(canvasDocReff, { canvas: data });
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    // Set up a cleanup function to save data when the component unmounts
    return () => {
      cleanupFunction();
    };
  }, []);

  return (
    <div className={styles.whiteBoardContainer}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Excalidraw
          ref={(api) => setExcalidrawAPI(api)}
          //initialData={{ elements: JSON.parse(initialData ?? "[]") }}
          onChange={handleChange}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              clearCanvas: false,
              export: false,
              loadScene: false,
              saveToActiveFile: false,
              toggleTheme: null,
              saveAsImage: false,
            },
          }}
        >
          <MainMenu />
        </Excalidraw>
      )}
    </div>
  );
}

export function areObjectsEqual(object1: any, object2: any) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !areObjectsEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }
  return true;
}

function isObject(object: any) {
  return object != null && typeof object === "object";
}
