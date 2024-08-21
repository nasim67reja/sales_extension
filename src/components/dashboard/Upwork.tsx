import React from "react";
import { Row } from "./Twitter";
import { StoredUpworkData } from "../../interfaces/UserProfile";
import Skills from "./Skills";

const Upwork: React.FC<StoredUpworkData> = ({ UpworkProfile }) => {
  console.log("upwork", UpworkProfile);
  const info = UpworkProfile.personalInfo;
  return (
    <div>
      <Skills skills={UpworkProfile.skills} />

      {/* {UpworkProfile.workExperience && (
        <div className="section-info">
          <h3 className="text-bold heading-tertiary">Work Experience</h3>
          {UpworkProfile.workExperience.map((el, i) => (
            <div className="section-info-box" key={i}>
              <h5 className="text-bold">{el.jobTitle}</h5>
              <p>{el.company}</p>
              <p>{el.duration}</p>
            </div>
          ))}
        </div>
      )} */}
      {/* {UpworkProfile.educationDetails && (
        <div className="section-info">
          <h3 className="text-bold heading-tertiary"> Education</h3>
          {UpworkProfile.educationDetails.map((el, i) => (
            <div className="section-info-box" key={i}>
              <h5 className="text-bold">{el.institute}</h5>
              <p>{el.department}</p>
              <p>{el.studyPeriod}</p>
            </div>
          ))}
        </div>
      )} */}
      {/* {UpworkProfile.licenseCertification && (
        <div className="section-info">
          <h3 className="text-bold heading-tertiary">
            {" "}
            License and Certification
          </h3>
          {visibleProfile.licenseCertification.map((el, i) => (
            <div className="section-info-box" key={i}>
              <h5 className="text-bold">{el.title}</h5>
              <p>{el.issuer}</p>
              <p>{el.issuanceDate}</p>
            </div>
          ))}
        </div>
      )} */}

      {info.about && (
        <div className="section-info-box">
          <h3 className="text-bold heading-tertiary"> About</h3>
          <p
            dangerouslySetInnerHTML={{
              __html: info.about.replace(/\n/g, "<br />"),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Upwork;
