import React, { useEffect, useState, KeyboardEventHandler } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { API } from "../../config/apiConfig";
import ApiUrls from "../../config/ApiUrls";
import Loader from "../utils/Loader";

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string, value: string) => ({
  label,
  value,
});

const ProfileComponent: React.FC<{ profile: any }> = ({ profile }) => {
  // const [profiles, setProfiles] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [leadOptions, setLeadOptions] = useState<Option[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<readonly Option[]>([]);
  const [isSkillAdded, setIsSkillAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch profiles from the API
    // const fetchProfiles = async () => {
    //   try {
    //     const response = await API.get(ApiUrls.LEAD_LIST, {
    //       params: {
    //         page: 1,
    //         limit: 10,
    //       },
    //     });

    //     const leads = response.data.leads.map((lead: any) => ({
    //       ...lead.features,
    //       id: lead.id,
    //     }));

    //     setProfiles(leads);
    //   } catch (error) {
    //     console.error("Error fetching profiles:", error);
    //   }
    // };

    // fetchProfiles();

    // Fetch lead names from the API
    const fetchLeadList = async () => {
      try {
        const response = await API.get(ApiUrls.LEAD_LIST, {
          params: {
            page: 1,
            limit: 10,
          },
        });

        const jobs = response.data.data.leads.map((lead: any) =>
          createOption(lead.features.personalInfo.profileName, lead.id)
        );
        setLeadOptions(jobs);
      } catch (error) {
        console.error("Error fetching job names:", error);
      }
    };

    fetchLeadList();
  }, []);

  const handleJobKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setSelectedJobs((prev) => [
          ...prev,
          createOption(inputValue, inputValue),
        ]);
        setInputValue("");
        event.preventDefault();
    }
  };

  const leadAddHandler = async () => {
    if (selectedJobs.length === 0) {
      console.error("No lead selected");
      return;
    }

    // Assuming profile is the company profile and selectedJobs[0] is the selected lead profile
    const leadProfileId = selectedJobs[0].value;
    const companyProfile = profile;
    setLoading(true);
    try {
      const response = await API.put(ApiUrls.COMPANY_PROFILE(leadProfileId), {
        company_profile: { companyProfile },
      });
      console.log("API Response:", response.data);
      setIsSkillAdded(true);
    } catch (error) {
      console.error("Error updating lead profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="input-tag gap-8">
      {isSkillAdded ? (
        <p className="text-center" style={{ color: "green" }}>
          Lead added successfully
        </p>
      ) : (
        <>
          <CreatableSelect
            inputValue={inputValue}
            isClearable
            isMulti
            onChange={(newValue) => setSelectedJobs(newValue)}
            onInputChange={(newValue) => setInputValue(newValue)}
            onKeyDown={handleJobKeyDown}
            placeholder="Type or select lead name..."
            value={selectedJobs}
            options={leadOptions}
          />
          {/* <button onClick={leadAddHandler}>Add Lead</button> */}

          <button
            onClick={leadAddHandler}
            className={loading ? "disabled" : ""}
            disabled={loading}
          >
            {loading ? (
              <>
                {" "}
                <Loader color="#fff" size={20} />
              </>
            ) : (
              "Add Lead"
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileComponent;
