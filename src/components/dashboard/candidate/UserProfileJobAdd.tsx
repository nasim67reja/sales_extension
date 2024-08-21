import React, { useEffect, useState, KeyboardEventHandler } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { API } from "../../../config/apiConfig";
import ApiUrls from "../../../config/ApiUrls";
// import { API } from "../../config/apiConfig";
// import ApiUrls from "../../config/ApiUrls";

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string, value: string) => ({
  label,
  value,
});

const UserProfileJobAdd = ({ profile, refreshProfiles }: any) => {
  const [profiles, setProfiles] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [jobOptions, setJobOptions] = useState<Option[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<readonly Option[]>([]);
  const [isSkillAdded, setIsSkillAdded] = useState(false);

  useEffect(() => {
    // Fetch profiles from local storage
    chrome.storage.local.get(["profiles"], (result) => {
      if (result.profiles) {
        setProfiles(result.profiles);
      }
    });

    // Fetch job names from the API using axios
    const fetchJobNames = async () => {
      try {
        const response = await API.get(ApiUrls.JOB_DESCRIPTIONS, {
          params: {
            page: 1,
            limit: 10,
          },
        });
        const jobs = response.data.data.results.map((job: any) =>
          createOption(job.display_name, job.id)
        );
        console.log("response", response);
        setJobOptions(jobs);
      } catch (error) {
        console.error("Error fetching job names:", error);
      }
    };

    fetchJobNames();
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

  const addJobsHandler = () => {
    chrome.storage.local.get(["profiles"], (result) => {
      if (result.profiles) {
        const targetProfileIndex = result.profiles.findIndex(
          (el) =>
            el.personalInfo.ProfileLink === profile.personalInfo.ProfileLink
        );

        if (targetProfileIndex !== -1) {
          result.profiles[targetProfileIndex].jobs = selectedJobs;

          // send the updated profile to the API
          const postScrapedData = async () => {
            try {
              const response = await API.post(ApiUrls.BULK_SCRAP, {
                candidates: [result.profiles[targetProfileIndex]],
              });
              console.log("API Response:", response.data);
              // toast.success("Data posted successfully!");
              result.profiles[targetProfileIndex].jobPosted = true;
            } catch (error) {
              console.error("Error posting data:", error);
              // toast.error("Failed to post data. Please try again.");
              // Handle the error as needed
              result.profiles[targetProfileIndex].jobPosted = false; // Set to false on error if necessary
            } finally {
              // Update local storage after the API call, regardless of success or failure
              chrome.storage.local.set({ profiles: result.profiles }, () => {
                console.log(
                  "Profiles updated in local storage:",
                  result.profiles
                );
                refreshProfiles();
              });
            }
          };

          postScrapedData();
        } else {
          console.error("Target profile not found");
        }
      }
    });
    setIsSkillAdded(true);
  };

  return (
    <div className="input-tag gap-8">
      {isSkillAdded ? (
        <p className="text-center" style={{ color: "green" }}>
          Jobs added successfully
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
            placeholder="Type or select job names..."
            value={selectedJobs}
            options={jobOptions}
          />
          <button onClick={addJobsHandler}>Add jobs</button>
        </>
      )}
    </div>
  );
};

export default UserProfileJobAdd;
