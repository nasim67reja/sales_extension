import React, { useEffect, useState, KeyboardEventHandler } from "react";
import CreatableSelect from "react-select/creatable";
import Loader from "../utils/Loader";
import { API } from "../../config/apiConfig";
import ApiUrls from "../../config/ApiUrls";

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string, value: string) => ({
  label,
  value,
});

export default function Settings() {
  const [checked, setChecked] = useState(false);
  const [syncEmail, setSyncEmail] = useState<Option | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [emailOptions, setEmailOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [host, setHost] = useState("");
  const [hostPassword, setHostPassword] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [errors, setErrors] = useState<{
    host?: string;
    hostPassword?: string;
  }>({});

  useEffect(() => {
    // Fetch stored email from chrome.storage
    chrome.storage.local.get(["email"]).then((result) => {
      if (result.email) {
        setSyncEmail(createOption(result.email, result.email));
        setSubmitted(true);
      }
    });

    // Fetch email options from the API
    const fetchEmailList = async () => {
      try {
        const response = await API.get(ApiUrls.EMAIL_LIST);
        // console.log("Emails:", response.data.data);

        const emails = response.data.data.email_settings.map((email: any) =>
          createOption(email.host_user, email.host_user)
        );
        setEmailOptions(emails);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmailList();
  }, []);

  const handleJobKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setSyncEmail(createOption(inputValue, inputValue));
        setInputValue("");
        setShowAdditionalFields(true);
        event.preventDefault();
    }
  };

  const handleEmailChange = (newValue: Option | null) => {
    setSyncEmail(newValue);
    setShowAdditionalFields(!newValue); // Show additional fields only for new emails
  };

  const validateForm = (): boolean => {
    const formErrors: { host?: string; hostPassword?: string } = {};
    let isValid = true;

    if (showAdditionalFields) {
      if (!host) {
        formErrors.host = "Host is required.";
        isValid = false;
      }

      if (!hostPassword) {
        formErrors.hostPassword = "Host password is required.";
        isValid = false;
      }
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (syncEmail && validateForm()) {
      setLoading(true);
      try {
        const isExistingEmail = emailOptions.some(
          (option) => option.value === syncEmail.value
        );

        if (isExistingEmail) {
          // If the email is from existing options, just store it in chrome.storage
          await chrome.storage.local.set({ email: syncEmail.value });
          console.log("Existing email saved:", syncEmail.value);
        } else {
          // Otherwise, make the POST API call and then store it
          const payload = {
            host,
            use_tls: true,
            use_ssl: false,
            port: 587,
            host_user: syncEmail.value,
            host_password: hostPassword,
          };

          const postResponse = await API.post(ApiUrls.EMAIL_LIST, payload);

          if (postResponse.status === 200) {
            await chrome.storage.local.set({ email: syncEmail.value });
            console.log("New email saved after API call:", syncEmail.value);
          } else {
            console.error("Failed to save new email:", postResponse.statusText);
          }
        }

        setSubmitted(true); // Set submitted to true if storage or API call succeeds
      } catch (error) {
        console.error("Error saving email:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteSyncEmailHandler = async () => {
    setLoading(true);
    try {
      // Remove email from chrome.storage
      await chrome.storage.local.set({ email: null });
      setSyncEmail(null);
      setSubmitted(false); // Reset the screen to show the form again
    } catch (error) {
      console.error("Error deleting email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Set the Email Address for Sending Profiles</h2>
      <div className="settings">
        {submitted ? (
          <div className="flex flex-col gap-8 sync-email-box">
            <p>
              Current Email:{" "}
              <span className="sync-email">{syncEmail?.label}</span>
            </p>
            <p>
              If you want to remove this email{" "}
              <span className="delete-email" onClick={deleteSyncEmailHandler}>
                click here
              </span>
            </p>
          </div>
        ) : (
          <>
            <label className="check-label">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
                style={{ cursor: "pointer" }}
              />
              Sync Email
            </label>
            {checked && (
              <form onSubmit={handleSubmit} className="styled-form">
                <CreatableSelect
                  inputValue={inputValue}
                  isClearable
                  onChange={handleEmailChange}
                  onInputChange={setInputValue}
                  onKeyDown={handleJobKeyDown}
                  placeholder="Type or select email..."
                  value={syncEmail}
                  options={emailOptions}
                />
                {showAdditionalFields && (
                  <>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Enter SMTP Host"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        className="styled-input" /* Add this class */
                      />
                      {errors.host && <p className="error">{errors.host}</p>}
                    </div>
                    <div className="input-group">
                      <input
                        type="password"
                        placeholder="Enter SMTP Host Password"
                        value={hostPassword}
                        onChange={(e) => setHostPassword(e.target.value)}
                        className="styled-input" /* Add this class */
                      />
                      {errors.hostPassword && (
                        <p className="error">{errors.hostPassword}</p>
                      )}
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="styled-button"
                  disabled={loading}
                >
                  {loading ? <Loader color="#fff" size={20} /> : "Save"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
}
