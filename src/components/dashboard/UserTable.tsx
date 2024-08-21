import React, { useState } from "react";
import { StoredData } from "../../interfaces/UserProfile";
import { truncateString } from "../utils/Common";

type DeleteProfileFn = (profileIndex: number) => void;

interface UserTableProps {
  profiles: StoredData["profile"][];
  deleteProfile: DeleteProfileFn;
}

const UserTable: React.FC<UserTableProps> = ({ profiles, deleteProfile }) => {
  return (
    <div>
      <div className="heading flex text-white">
        <div className="flex-1 center">
          <h3>User</h3>
        </div>
        <div className="flex-1 center">
          <h3>Title</h3>
        </div>
        <div className="flex-1 center">
          <h3>Skills</h3>
        </div>
        <div className="flex-1 center">
          <h3>Title</h3>
        </div>
        <div className="flex-1 center">
          <h3>Action</h3>
        </div>
      </div>
      {profiles.map((el, i) => (
        <Data key={i} profile={el} deleteProfile={() => deleteProfile(i)} />
      ))}
    </div>
  );
};

interface DataProps extends StoredData {
  deleteProfile: () => void;
}

const Data: React.FC<DataProps> = ({ profile, deleteProfile }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    deleteProfile();
    setShowConfirmation(false);
  };
  return (
    <div className="flex profile">
      <div className="flex-1 gap-10 border-right items-center flex">
        <img
          src={profile.personalInfo.profileImageSrc}
          alt={profile.personalInfo.profileName}
          className="table-user__img"
        />
        <span>{profile.personalInfo.profileName}</span>
      </div>
      <div className="flex-1 center">
        {truncateString(profile.personalInfo.title, 3)}
      </div>
      <div className="flex-1 text-center">{profile.skills?.join(", ")}</div>
      <div className="flex-1 center">try</div>
      <div className="flex-1 center">
        <img
          src="/assets/delete.svg"
          onClick={() => setShowConfirmation(true)}
          alt=""
        />
      </div>

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this profile?</p>
            <div className="button-container">
              <button onClick={() => setShowConfirmation(false)}>Cancel</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserTable;
