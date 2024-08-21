// background.js

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "startScraping") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ error: "No active tab found." });
        return;
      }
      const tabId = tabs[0].id;

      // Ensure the content script is loaded
      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: ["js/content_script.js"],
        },
        (injectionResults) => {
          if (chrome.runtime.lastError || injectionResults.length === 0) {
            console.error(
              `Failed to inject content script: ${chrome.runtime.lastError?.message}`
            );
            sendResponse({ error: "Failed to load the scraping script." });
            return;
          }

          // Send a message to the content script
          chrome.tabs.sendMessage(
            tabId,
            {
              action: "startScraping",
              origin: message.origin,
            },
            (response) => {
              if (chrome.runtime.lastError) {
                // console.error(
                //   `Error sending message to content script: ${chrome.runtime.lastError.message}`
                // );
                sendResponse({
                  error: "Error communicating with the content script.",
                });
              } else {
                sendResponse(
                  response || { error: "No response from content script." }
                );
              }
            }
          );
        }
      );
    });
  }

  if (message.type === "profile_name") {
    sendResponse({ farewell: message.profileInfo });
  }

  // Check if the received message is of type INFO
  if (message.type === "INFO") {
    const newProfile = message.profile;

    // Retrieve existing scraped profiles from Chrome Storage
    chrome.storage.local.get(["profiles"], (result) => {
      // Initialize an empty array to store scraped profiles
      let scrapedProfiles = [];

      if (result.profiles) {
        scrapedProfiles = result.profiles;
      }
      // Find the index of the existing profile, if it exists
      const existingProfileIndex = scrapedProfiles.findIndex(
        (profile) =>
          profile?.personalInfo?.profileName ===
            newProfile.personalInfo.profileName &&
          profile?.origin === newProfile.origin
      );

      if (existingProfileIndex !== -1) {
        // Replace the existing profile with the new profile
        scrapedProfiles[existingProfileIndex] = newProfile;
      } else {
        // Add the new profile to the array
        scrapedProfiles = [...scrapedProfiles, newProfile];
      }

      // Store the entire array in Chrome Storage API
      chrome.storage.local.set({ profiles: scrapedProfiles });
    });
  }

  return true; // Keep the message channel open for asynchronous response
});

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
