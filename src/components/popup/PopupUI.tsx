// PopupUI.tsx
import React, { useEffect, useState } from "react";
import { PopupUIProps } from "../../interfaces/UserProfile";
import { userBasicInfo } from "../../ExecuteScript";
import { LogoMain } from "../utils/Svgs";
import CreateTags from "./CreateTags";

interface userInfoProp {
  userName: string;
  profileUrl: string;
}

const PopupUI: React.FC<PopupUIProps> = ({ setProfile }) => {
  const [userInfo, setUserInfo] = useState<userInfoProp>();
  const [alreadyExist, setAlreadyExist] = useState();

  useEffect(() => {
    const updateUserInfo = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Check if the tab's URL contains the required domain
      if (
        tab.url.includes("linkedin.com/in/") ||
        tab.url.includes("twitter.com/") ||
        tab.url.includes("upwork.com/") ||
        tab.url.includes("linkedin.com/company/")
      ) {
        const returnVal = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: userBasicInfo,
        });
        setUserInfo(returnVal[0].result);
      } else {
        setUserInfo(null);
      }
    };

    // Listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (tab.active) {
        updateUserInfo();
        setProfile(null);
      }
    });

    // Listen for tab activation changes
    chrome.tabs.onActivated.addListener((activeInfo) => {
      updateUserInfo();
      setProfile(null);
    });

    // Initial update when the component mounts
    updateUserInfo();
  }, []);

  if (userInfo) {
    //  checking all ready scrap or not
    chrome.storage.local.get(["profiles"], (result) => {
      if (result.profiles) {
        // console.log("result", result.profiles, userInfo);
        const test = result.profiles.some(
          (item) => item.personalInfo.ProfileLink === userInfo?.profileUrl
        );
        setAlreadyExist(test);
      }
    });
  }

  // console.log("userinfo", userInfo);

  const [error, setError] = useState(null);
  const [isScraping, setIsScraping] = useState(false);

  const startScraping = () => {
    setIsScraping(true);
    setError(null);
    const matchedLink = ["linkedin", "twitter", "upwork"].find((link) =>
      userInfo.profileUrl.includes(link)
    );

    chrome.runtime.sendMessage(
      {
        action: "startScraping",
        origin: matchedLink,
      },
      (response) => {
        if (chrome.runtime.lastError || !response) {
          // console.error(
          //   chrome.runtime.lastError?.message || "No response received."
          // );
          setError("Failed to start scraping. Please try again.");
          setIsScraping(false);
          return;
        }
        if (response.error) {
          setError(response.error);
          setIsScraping(false);
        } else {
          console.log("All okay");
        }
      }
    );
  };

  return (
    <div>
      <div className="center logo">
        <img style={{ width: "60%" }} src="/assets/logo_main.svg" alt="" />
        {/* <LogoMain /> */}
      </div>
      <div className="center">
        <button
          disabled={!userInfo}
          className={`btn ${!userInfo ? "disable" : "active"}`}
          onClick={startScraping}
        >
          <span>
            <img src="/assets/scrap.svg" alt="" />
          </span>
          {userInfo ? `Scrap ${userInfo.userName}` : "Start Scraping"}
        </button>
      </div>
      {alreadyExist && userInfo && (
        <p className="exist-warn">
          This profile has already been scraped. If you want to update it, then
          scrape again.
        </p>
      )}
      {!userInfo && (
        <p className="error text-center">This is not a valid profile page</p>
      )}

      <div>
        {/* Existing elements */}
        {isScraping && <p>Scraping in progress...</p>}
        {/* {error && <p className="error">{error}</p>} */}
      </div>

      <div className="tac">
        By using this extension, you agree to our{" "}
        <a href="#">Terms of service</a> and <a href="#">Privacy policy</a>
      </div>
    </div>
  );
};

export default PopupUI;
