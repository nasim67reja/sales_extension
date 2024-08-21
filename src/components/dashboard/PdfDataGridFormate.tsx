import React, { useRef } from "react";
import {
  getFormattedDate,
  truncateString,
  truncateStringCharacter,
} from "../utils/Common";
import { ActionsBtn } from "../utils/Svgs";
import { truncString } from "../../utils";

const PdfDataGrid = ({ profiles }: any) => {
  const currentDate = getFormattedDate();
  return (
    <>
      <div
        style={{
          textAlign: "center",
          fontSize: "20px",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Scraped Profiles
      </div>
      <div
        style={{
          color: "green",
          textAlign: "right",
          fontSize: "13px",
          marginBottom: "20px",
        }}
        className="pdf-header"
      >
        Date: {currentDate}
      </div>
      <div>
        <table className="scraped-table">
          <thead>
            <tr className="row row-th">
              <th style={{ width: "180px" }}>User</th>
              <th>Origin</th>
              <th>Tags</th>
              <th>Title</th>
              <th>Skills</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <tr className="row row-td" key={index}>
                <td className="user">
                  <img
                    src={profile.personalInfo?.profileImageSrc}
                    alt={profile.personalInfo?.profileName}
                    className="table-user__img"
                  />
                  <span>
                    {truncateString(profile.personalInfo?.profileName, 14)}
                  </span>
                </td>

                <td>{profile.origin}</td>
                <td>
                  {profile.tags &&
                    profile.tags.map((el, i) => (
                      <React.Fragment key={i}>
                        {`${el.value}, `}{" "}
                      </React.Fragment>
                    ))}
                </td>
                <td>{profile.personalInfo.title}</td>
                <td>{profile.skills.join(", ")}</td>
                <td>
                  <button
                  // onClick={() => {
                  //   setIndexOfClickProfile(index);
                  //   setOpenUserModal(true);
                  // }}
                  >
                    <ActionsBtn />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PdfDataGrid;
