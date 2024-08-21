import React, { useEffect, useState } from "react";
import Info from "../dashboard/Info";
import { StoredData } from "../../interfaces/UserProfile";
import CreateTags from "./CreateTags";
import { API } from "../../config/apiConfig";
import ApiUrls from "../../config/ApiUrls";

const Profile: React.FC<any> = ({ profile }) => {
  const [successIsTrue, SetSuccessIsTrue] = useState(true);
  setTimeout(() => {
    SetSuccessIsTrue(false);
  }, 3000);

  useEffect(() => {
    if (profile && !profile?.company) {
      postScrapedData();
    }
  }, [profile]);

  const postScrapedData = async () => {
    try {
      const response = await API.post(ApiUrls.LEAD_CREATE, {
        features: profile,
      });
      console.log("API Response:", response.data);
      // toast.success("Data posted successfully!");
      profile.jobPosted = true;
    } catch (error) {
      // console.error("Error posting data:", error);
      // toast.error("Failed to post data. Please try again.");
      // Handle the error as needed
      profile.jobPosted = false; // Set to false on error if necessary
    } finally {
      // Update local storage after the API call, regardless of success or failure
      chrome.storage.local.set({ profiles: [profile] }, () => {
        console.log("Profiles updated in local storage:", [profile]);
      });
    }
  };

  console.log("profile", profile);

  return (
    <>
      {profile?.company && <CreateTags profile={profile} />}
      {successIsTrue && <p className="success-msg">Data Scrap successfully</p>}
      <div className="user-profile">
        <div className="center">
          <img
            className="user-profile__img"
            src={profile.personalInfo.profileImageSrc}
            alt={profile.personalInfo.profileName}
          />
        </div>
        <p className="text text-name">{profile.personalInfo.profileName}</p>
        {profile.personalInfo.userName && (
          <p style={{ marginBottom: "10px" }}>
            {profile.personalInfo.userName}
          </p>
        )}
        <p className="text text-title">{profile.personalInfo.title}</p>
        {profile.personalInfo.summary && (
          <p className="text text-title">{profile.personalInfo.summary}</p>
        )}
        {profile.origin === "linkedin" ? (
          <div className="flex flex-col gap-5">
            {profile.skills?.length > 0 && (
              <p className="text text-skills">
                <span className="text-bold">Skills : </span>
                {profile.skills?.join(", ")}
              </p>
            )}

            {profile.educationDetails.length > 0 && (
              <p>
                <span className="text-bold">Education : </span>
                {profile.educationDetails[0].institute}
              </p>
            )}

            {profile.licenseCertification.length > 0 && (
              <Info
                profileEx={profile.licenseCertification}
                heading={"License and Certification"}
              />
            )}
            {profile.workExperience.length > 0 && (
              <Info
                profileEx={profile.workExperience}
                heading="Work Experience"
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <p>
              <span className="text-bold">Location : </span>
              {profile.personalInfo.location || ""}
            </p>

            {profile.personalInfo.following && (
              <p>
                <span className="text-bold">Following : </span>
                {profile.personalInfo.following || ""}
              </p>
            )}

            {profile.personalInfo.followers && (
              <p>
                <span className="text-bold">Follower : </span>
                {profile.personalInfo.followers || ""}
              </p>
            )}

            {profile.skills?.length > 0 && (
              <p className="text text-skills">
                <span className="text-bold">Skills : </span>
                {profile.skills?.join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
