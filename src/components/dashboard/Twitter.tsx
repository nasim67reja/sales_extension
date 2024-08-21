import React from "react";
import { StoredData } from "../../interfaces/UserProfile";

const Twitter: React.FC<any> = ({ visibleProfile }) => {
  console.log(visibleProfile);
  const info = visibleProfile.personalInfo;

  const userDataArr = [
    {
      title: "Username",
      value: info.userName,
    },
    {
      title: "Following",
      value: info.following,
    },
    {
      title: "Follower",
      value: info.followers,
    },
    {
      title: "Location",
      value: info.location,
    },
  ];

  return (
    <div style={{ paddingLeft: "15px" }}>
      {userDataArr.map((el, i) => (
        <Row key={i} title={el.title} value={el.value} />
      ))}
    </div>
  );
};

export default Twitter;

export const Row = ({ title, value }) => {
  return (
    <>
      {value && (
        <div>
          <span className="text-bold">{title} : </span>
          <span className="text-12">{value}</span>
        </div>
      )}
    </>
  );
};
