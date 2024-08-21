// popup.tsx
import { createRoot } from "react-dom/client";
import React, { useEffect, useRef, useState } from "react";
import { StoredData } from "./interfaces/UserProfile";
import Profile from "./components/popup/Profile";
import PopupUI from "./components/popup/PopupUI";
import axios from "axios";
import { DataStore, LogoutIcon, SettingsIcon } from "./components/utils/Svgs";
import SignIn from "./components/popup/auth/Signin";
import SignUp from "./components/popup/auth/Signup";
import { TOKEN, REFRESH_TOKEN } from "./config/apiConfig";

const Popup: React.FC = () => {
  const [profile, setProfile] = useState<StoredData["profile"] | undefined>();
  const [user, setUser] = useState<any>(null);
  const [menuIsShown, setMenuIsShown] = useState(false);
  const [activeHover, setActiveHover] = useState(false);
  const [activeHoverSetting, setActiveHoverSetting] = useState(false);
  const [response, setResponse] = useState(null);
  const [showSignIn, setShowSignIn] = useState(true);
  const [localStorageData, setLocalStorageData] = useState<string | null>(null);

  // const sendEmail = async (profile, email) => {
  //   try {
  //     // Convert profile object to a JSON string
  //     const profileString = JSON.stringify(profile);
  //     const url =
  //       "https://yrqubf5qoh.execute-api.us-east-1.amazonaws.com/Prod/send-email";

  //     console.log(profileString, "popup 25");
  //     const payload = {
  //       to: email,
  //       subject: `scrap ${profile.personalInfo.profileName}'s profile`,
  //       body: profileString,
  //     };
  //     console.log(url, payload);

  //     const response = await axios.post(url, payload);

  //     if (response.status === 200) {
  //       setResponse(response.data);
  //       console.log(response.data, "response");
  //     } else {
  //       console.log("Unexpected response status:", response.status);
  //     }
  //   } catch (error) {
  //     console.log("Error sending email:", error);
  //   }
  // };

  const getLocalStorageData = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab.url.startsWith("https://hr-assistant.shadhin.ai/")) {
      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          return {
            refreshToken: localStorage.getItem("refresh-token"),
            accessToken: localStorage.getItem("access-token"),
          };
        },
      });

      if (result && result[0].result) {
        const { refreshToken, accessToken } = result[0].result;

        if (refreshToken && accessToken) {
          // Store tokens in local state
          setLocalStorageData(
            `Refresh Token: ${refreshToken}\nAccess Token: ${accessToken}`
          );

          localStorage.setItem(TOKEN, accessToken);
          localStorage.setItem(REFRESH_TOKEN, refreshToken);
          setUser(accessToken);
          setShowSignIn(false);
        } else {
          setLocalStorageData(
            "No tokens found in the active tab's local storage."
          );
        }
      }
    } else {
      setLocalStorageData(
        "Active tab URL does not match the required pattern."
      );
    }
  };

  useEffect(() => {
    const handleTabChange = async () => {
      await getLocalStorageData();
    };

    handleTabChange();

    chrome.tabs.onActivated.addListener(handleTabChange);
    chrome.tabs.onUpdated.addListener(handleTabChange);

    return () => {
      chrome.tabs.onActivated.removeListener(handleTabChange);
      chrome.tabs.onUpdated.removeListener(handleTabChange);
    };
  }, []);

  useEffect(() => {
    const idToken = localStorage.getItem(TOKEN);
    // const storedUser = localStorage.getItem("user");

    if (idToken && idToken !== "undefined") {
      setUser(idToken);
      setShowSignIn(false);
    } else {
      getLocalStorageData();
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "INFO") {
        console.log("message", message);

        setProfile(message.profile);

        // chrome.storage.local.get(["email"]).then((result) => {
        //   if (result.email) {
        //     sendEmail(message.profile, result.email);
        //   }
        // });
      }
    });
  }, []);

  // Navigating to the options page with a specific section active
  const openOptionPageHandler = (section) => {
    const url = chrome.runtime.getURL("options.html");
    const fullUrl = section ? `${url}?active=${section}` : url;

    if (chrome.runtime.openOptionsPage) {
      // If openOptionsPage supports query strings, you can directly use it,
      // however, this function does not usually support it, thus the fallback to window.open
      window.open(fullUrl);
    } else {
      window.open(fullUrl);
    }
    setMenuIsShown(false);
  };

  const handleSignInSuccess = (token) => {
    setUser(token);
    setShowSignIn(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem("user");
    setUser(null);
    setShowSignIn(true);
    setMenuIsShown(false);
  };

  return (
    <>
      <div className="container">
        <div className="header flex space-between">
          {menuIsShown && (
            <div className="nav-items">
              <ul className="">
                <li
                  onClick={() => openOptionPageHandler("History")}
                  onMouseEnter={() => setActiveHover(true)}
                  onMouseLeave={() => setActiveHover(false)}
                >
                  <span>
                    <DataStore color={activeHover ? "#007AFE" : "#141B34"} />
                  </span>
                  <span>History</span>
                </li>
                <li
                  onClick={() => openOptionPageHandler("Settings")}
                  onMouseEnter={() => setActiveHoverSetting(true)}
                  onMouseLeave={() => setActiveHoverSetting(false)}
                >
                  <span>
                    <SettingsIcon
                      color={activeHoverSetting ? "#007AFE" : "#141B34"}
                    />
                  </span>
                  <span>Settings</span>
                </li>
                {user && (
                  <li onClick={handleLogout}>
                    <LogoutIcon color="#141B34" />
                    <span>Logout</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {profile ? (
            <h1
              onClick={() => setProfile(null)}
              style={{ cursor: "pointer" }}
              className="heading-main"
            >
              <img style={{ width: "32px" }} src="/assets/back.svg" alt="" />
              <span>Back</span>
            </h1>
          ) : (
            <h1 className="heading-main">
              <img
                style={{ width: "32px" }}
                src="/assets/logo_main.svg"
                alt=""
              />
              <span style={{ color: "#007afe" }}>Sales Assistant</span>
            </h1>
          )}
          <div>
            <span className="icon-bg">
              {menuIsShown ? (
                <img
                  src="assets/close.svg"
                  alt="close"
                  className="menu-img"
                  onClick={() => setMenuIsShown(!menuIsShown)}
                />
              ) : (
                <img
                  src="assets/menu.svg"
                  alt="menu"
                  className="menu-img"
                  onClick={() => setMenuIsShown(!menuIsShown)}
                />
              )}
            </span>
          </div>
        </div>
        {user ? (
          profile ? (
            <Profile profile={profile} />
          ) : (
            <PopupUI setProfile={setProfile} />
          )
        ) : showSignIn ? (
          <SignIn
            onSignUpClick={() => setShowSignIn(false)}
            onSignInSuccess={handleSignInSuccess}
          />
        ) : (
          <SignUp onSignInClick={() => setShowSignIn(true)} />
        )}
      </div>
    </>
  );
};

export default Popup;

// Update to use createRoot
const container = document.getElementById("root");
const root = createRoot(container);

root.render(<Popup />);
