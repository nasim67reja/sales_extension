import React from "react";
import Skills from "./Skills";

const Linkedin: React.FC<any> = ({ visibleProfile }) => {
  return (
    <div>
      {/* <p>
        <span className="text-bold">Skills : </span>
        {visibleProfile.skills.join(",")} ...
      </p> */}
      <Skills skills={visibleProfile.skills} />

      {visibleProfile.educationDetails && (
        <div className="section-info">
          <h3 className="text-bold heading-tertiary"> Education</h3>
          {visibleProfile.educationDetails.map((el, i) => (
            <div className="section-info-box" key={i}>
              <h5 className="text-bold">{el.institute}</h5>
              <p>{el.department}</p>
              <p>{el.studyPeriod}</p>
            </div>
          ))}
        </div>
      )}

      {visibleProfile.licenseCertification && (
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
      )}

      {visibleProfile.workExperience && (
        <div className="section-info">
          <h3 className="text-bold heading-tertiary">Work Experience</h3>
          {visibleProfile.workExperience.map((el, i) => (
            <div className="section-info-box" key={i}>
              <h5 className="text-bold">{el.jobTitle}</h5>
              <p>{el.company}</p>
              <p>{el.duration}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Linkedin;
