import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
// import CanvasDraw from "react-canvas-draw";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useAppSelector } from "../redux/hooks";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  BinaryFiles,
  ExcalidrawAPIRefValue,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";

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

export default function Whiteboard2({
  initialData,
  roomDoc,
}: {
  initialData?: any;
  roomDoc: any;
}) {
  const canvasDocRef = doc(collection(roomDoc, "canvas"), "123");

  const [isMounted, setIsMounted] = useState(false);
  const { profile } = useAppSelector((state) => state.profile);

  useEffect(() => {
    console.log(initialData);
    if (!isMounted) console.log(`is mounted`);
    if (!isMounted) {
      console.log(`loading canvas`);
      if (initialData.canvas) {
      }
      // canvasRef.current?.loadPaths(initialData);
    } else {
      setIsMounted(true);
    }
  }, [initialData]);

  const [turnOffWriting, setTurnOffWriting] = useState(false);
  const [currentElements, setCurrentElements] = useState<ExcalidrawElement[]>(
    JSON.parse(initialData.canvas)
  );

  const [comingFromListen, setComingFromListen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(canvasDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.canvas) {
          console.log(`change`);

          if (!(data.createdBy === profile.type)) {
            console.log(`loading canvas snapshot`);
            if (excalidrawRef.current) {
              setComingFromListen(true);
              excalidrawRef.current.updateScene({
                elements: JSON.parse(data.canvas),
              });
            }
            setTurnOffWriting(true);
          } else {
            setTurnOffWriting(false);
          }
        }
      } else {
        console.log("No such document!");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleCanvasChange = async (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    if (excalidrawRef.current) {
      console.log(`onchange`);
      //   console.log(excalidrawRef.current);
      //   console.log(elements);
      if (turnOffWriting) {
        setTurnOffWriting(false);
        return;
      }
      const elements2 = excalidrawRef.current.getSceneElements();
      if (currentElements === elements2) return;
      setCurrentElements(elements2 as ExcalidrawElement[]);
      if (areObjectsEqual(elements, JSON.parse(initialData.canvas))) return;
      //   if(excalidrawRef.current.getSceneElements()) return;
      if (comingFromListen) {
        setComingFromListen(false);
        return;
      } else {
        await setDoc(canvasDocRef, {
          canvas: JSON.stringify(elements2),
          createdBy: profile.type,
        })
          .then((docRef) => {
            console.log("Document written with ");
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      }
    }

    // console.log(`elements: `);
    // console.log(elements);
    // console.log(`appState: `);
    // console.log(appState);
    // console.log(`files: `);
    // console.log(files);
  };

  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <Excalidraw
        ref={excalidrawRef}
        isCollaborating={true}
        // initialData={JSON.parse(initialData.canvas)}
        initialData={{
          elements: JSON.parse(initialData.canvas),
          appState: { zenModeEnabled: true, viewBackgroundColor: "#a5d8ff" },
          scrollToContent: true,
        }}
        onChange={handleCanvasChange}
      />
    </div>
  );
}
