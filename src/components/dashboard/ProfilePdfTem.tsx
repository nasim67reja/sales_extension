import React from "react";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";
// import TwitterIcon from "@mui/icons-material/Twitter";
import { UpworkIcon } from "../utils/Svgs";
import Twitter, { Row } from "./Twitter";
import Linkedin from "./Linkedin";
import Upwork from "./Upwork";

const ProfilePdfTem = ({ visibleProfile }: any) => {
  return (
    <div className="profile-pdf-tem">
      {visibleProfile.origin === "twitter" && (
        <h2 className="center user-heading">
          {/* <TwitterIcon className="user-heading__icon" /> */}
          {visibleProfile.origin}
        </h2>
      )}
      <div className="">
        <div className="user-details-left  flex-1">
          {visibleProfile.origin === "linkedin" && (
            <h2 className="flex items-center user-heading">
              {/* <LinkedInIcon className="user-heading__icon" /> */}
              {visibleProfile.origin}
            </h2>
          )}
          {visibleProfile.origin === "upwork" && (
            <h2 className="flex items-center user-heading">
              <UpworkIcon />
              {visibleProfile.origin}
            </h2>
          )}
          <div>
            <img
              className="user-img"
              src={visibleProfile.personalInfo.profileImageSrc}
              alt={visibleProfile.personalInfo.profileName}
            />
            <h3 className="user-name">
              {visibleProfile.personalInfo.profileName}
            </h3>
            <p className="user-title">{visibleProfile.personalInfo.title}</p>
            {visibleProfile.origin === "upwork" && (
              <div className="flex gap-8 stat-box">
                <Row title="Level" value={visibleProfile.personalInfo.level} />
                <Row
                  title="Total Job"
                  value={visibleProfile.personalInfo.totalJob}
                />
                <Row
                  title="Total Hour"
                  value={visibleProfile.personalInfo.totalHour}
                />
              </div>
            )}
          </div>
        </div>

        <div
          className={` ${visibleProfile.origin === "twitter" ? "center" : ""}`}
        >
          {visibleProfile.origin === "twitter" ? (
            <Twitter visibleProfile={visibleProfile} />
          ) : visibleProfile.origin === "linkedin" ? (
            <Linkedin visibleProfile={visibleProfile} />
          ) : (
            <Upwork UpworkProfile={visibleProfile} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePdfTem;
