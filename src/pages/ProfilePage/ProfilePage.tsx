import React, { useState } from "react";
import ArrowRight from "../../components/Icons/ArrowRight";
import Copy from "../../components/Icons/Copy";
import Pencil from "../../components/Icons/Pencil";
import InformationCard from "../../components/InformationCard/InformationCard";
import Input from "../../components/Input/Input";
import Layout from "../../components/Layout/Layout";
import {
  updateDisplayName,
  updatePhoneNumber,
  updateSubjects,
} from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import styles from "./ProfilePage.module.css";
import { db } from "../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import Phone from "../../components/Icons/Phone";
import PencilStudy from "../../components/Icons/PencilStudy";
import PersonStudy from "../../components/Icons/PersonStudy";

import { subjects } from "../../consts/subjects";

export default function ProfilePage() {
  const { profile } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();
  const copyFunction = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const [isShowingInput, setIsShowingInput] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(profile.displayName);

  const userRef = doc(db, "users", profile.uid);
  const [newPhoneNumber, setNewPhoneNumber] = useState(
    profile.phoneNumber || ""
  );
  const [isShowingImport, setIsShowingImport] = useState(false);
  const [isShowingPhoneInput, setIsShowingPhoneInput] = useState(false);
  const updateDisplayN = async () => {
    setIsShowingInput(!isShowingInput);
    dispatch(updateDisplayName(newDisplayName));
    await updateDoc(userRef, {
      displayName: newDisplayName,
    });
  };
  const updatePhone = async () => {
    if (/^\d{9}$/.test(newPhoneNumber)) {
      setIsShowingPhoneInput(!isShowingPhoneInput);
      dispatch(updatePhoneNumber(newPhoneNumber));
      await updateDoc(userRef, {
        phoneNumber: newPhoneNumber,
      });
    } else {
      alert("Please enter a valid phone number (max 9 digits)");
    }
  };

  const updateThisTag = async (subject: string) => {
    if (profile.subjects?.includes(subject)) {
      await updateDoc(userRef, {
        subjects: profile.subjects
          ? [...profile.subjects.filter((subjectIn) => subjectIn !== subject)]
          : [],
      });
      dispatch(
        updateSubjects(
          profile.subjects
            ? [...profile.subjects.filter((subjectIn) => subjectIn !== subject)]
            : [subject]
        )
      );
    } else {
      await updateDoc(userRef, {
        subjects: profile.subjects ? [...profile.subjects, subject] : [subject],
      });
      dispatch(
        updateSubjects(
          profile.subjects ? [...profile.subjects, subject] : [subject]
        )
      );
    }
  };

  return (
    <Layout>
      <div className={styles.pageContainer}>
        <div className={styles.profileCard}>
          <div className={styles.leftContainer}>
            <div className={styles.imageContainer}>
              {isShowingImport ? (
                <div
                  onMouseEnter={() => {
                    setIsShowingImport(true);
                  }}
                  onMouseLeave={() => {
                    setIsShowingImport(false);
                  }}
                  className={styles.showImportContainer}
                >
                  Upload
                </div>
              ) : null}
              <img
                className={styles.profilePic}
                src={profile.providerData[0].photoURL || ""}
                alt="profilePic"
                onMouseEnter={() => {
                  setIsShowingImport(true);
                }}
                onMouseLeave={() => {
                  setIsShowingImport(false);
                }}
              />
            </div>
            <div className={styles.displayNameContainer}>
              {isShowingInput ? (
                <div className={styles.flexBox}>
                  <div className={styles.label}>Set new display name</div>
                  <Input
                    value={newDisplayName}
                    customContainerStyle={{ width: "100%", height: "100%" }}
                    style={{ width: "100%", height: "100%" }}
                    placeholder={profile.displayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    icon={<ArrowRight />}
                    onClick={updateDisplayN}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        updateDisplayN();
                      }
                    }}
                  />
                </div>
              ) : (
                <div className={styles.flexBox}>
                  <div className={styles.label}>Display name:</div>
                  <div className={styles.flexRow}>
                    {profile.displayName}
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsShowingInput(!isShowingInput)}
                    >
                      <Pencil />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {profile.type === "teacher" ? (
              <div className={styles.chooseTagsContainer}>
                <div>Choose your subjects</div>
                <div className={styles.tagsContainer}>
                  {subjects.map((subject, index) => (
                    <div
                      // onClick={() => updateThisTag(subject)}
                      key={index}
                      className={styles.subjectTag}
                      style={
                        profile.subjects?.includes(subject)
                          ? { backgroundColor: "#D4F9AC" }
                          : {}
                      }
                    >
                      #{subject}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.cardContainerTop}>
              <InformationCard
                label={"Email:"}
                text={profile.email}
                icon={<Copy />}
                onClick={() => copyFunction(profile.email)}
                customStyles={{
                  backgroundColor: "#EDDAFD",
                }}
                className={styles.card}
              />
              <InformationCard
                label={"Join date:"}
                text={new Date(
                  profile.createdAt.seconds * 1000
                ).toLocaleDateString()}
                icon={<Copy />}
                onClick={() => copyFunction("12.12")}
                customStyles={{
                  backgroundColor: "#EBFCD5",
                }}
                className={styles.card}
              />
            </div>
            <div className={styles.phoneContainer}>
              {isShowingPhoneInput ? (
                <div className={styles.flexBox}>
                  <div className={styles.label}>Set new display name</div>
                  <Input
                    value={newPhoneNumber}
                    customContainerStyle={{ width: "100%", height: "100%" }}
                    style={{ width: "100%", height: "100%" }}
                    placeholder={profile.phoneNumber || ""}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    icon={<ArrowRight />}
                    onClick={updatePhone}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        updatePhone();
                      }
                    }}
                  />
                </div>
              ) : (
                <div className={styles.flexBox}>
                  <div className={styles.label}>
                    <Phone fill="black" />
                    Phone:
                  </div>
                  <div className={styles.flexRow}>
                    {profile.phoneNumber || "Not set"}
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setIsShowingPhoneInput(!isShowingPhoneInput)
                      }
                    >
                      <Pencil />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.iconsContainer}>
              <PersonStudy />
              <PencilStudy />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
