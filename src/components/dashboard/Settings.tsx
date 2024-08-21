import * as React from "react";
import { useState } from "react";

interface FormState {
  email: string;
}

export default function Settings() {
  const [checked, setChecked] = React.useState(false);
  const [formState, setFormState] = useState<FormState>({
    email: "",
  });

  const [syncEmail, setSyncEmail] = useState<any>();

  React.useEffect(() => {
    chrome.storage.local.get(["email"]).then((result) => {
      setSyncEmail(result.email);
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formState);

    chrome.storage.local.set({ email: formState.email }).then(() => {
      setSyncEmail(formState.email);
    });
  };

  const deleteSyncEmailHandler = () => {
    chrome.storage.local.set({ email: null }).then(() => {
      setSyncEmail(null);
    });
  };

  return (
    <>
      <h2>Get your profiles delivered to your inbox</h2>
      <div className="settings">
        {syncEmail ? (
          <div className="flex flex-col gap-8 sync-email-box">
            <p>
              Sync Email : <span className="sync-email">{syncEmail}</span>
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
            <label className=" check-label">
              <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                style={{ cursor: "pointer" }}
              />
              Sync Email
            </label>
            {checked && (
              <form onSubmit={handleSubmit} className="styled-form">
                <input
                  className="styled-input"
                  id="email-basic"
                  placeholder="Email"
                  type="email"
                  required
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                />
                <button type="submit" className="styled-button">
                  Save
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
}
