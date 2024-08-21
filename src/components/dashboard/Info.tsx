import React from "react";
import { InfoData } from "../../interfaces/UserProfile";

const Info: React.FC<InfoData> = ({ profileEx, heading }) => {
  return (
    <div>
      <h3 className="text-bold">{heading}</h3>
      <ul>
        {profileEx
          ? profileEx.map((el, i) => (
              <li className="box" key={i}>
                <p>{el.title ? el.title : el.jobTitle}</p>
                <p>{el.issuer ? el.issuer : el.company}</p>
                {el.duration && <p>{el.duration}</p>}
              </li>
            ))
          : "none"}
      </ul>
    </div>
  );
};

export default Info;
