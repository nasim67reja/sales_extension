import React, { useState, useEffect } from "react";
import { API } from "../../../config/apiConfig";
import ApiUrls from "../../../config/ApiUrls";
import { toast } from "react-toastify";
import Loader from "../../utils/Loader";

interface LeadProfile {
  features: any;
  email_content: string;
  email_subject: string;
}

interface EmailFormProps {
  //   onSubmit: (data: {
  //     emailContent: string;
  //     emailSubject: string;
  //     email: string;
  //   }) => void;
  leadProfile: LeadProfile;
  setShowEmailForm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Errors {
  email?: string;
  emailSubject?: string;
  emailContent?: string;
}

const EmailForm: React.FC<EmailFormProps> = ({
  leadProfile,
  setShowEmailForm,
}) => {
  const [emailContent, setEmailContent] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  console.log("Lead Profile:", leadProfile);

  useEffect(() => {
    if (leadProfile) {
      setEmailContent(leadProfile.email_content);
      setEmailSubject(leadProfile.email_subject);
      setEmail(leadProfile.features.personalInfo.email || "");
    }
  }, [leadProfile]);

  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Start loader

      const result = await chrome.storage.local.get(["email"]);
      const storedEmail = result.email;
      try {
        const response = await API.post(ApiUrls.SEND_MAIL, {
          email_content: emailContent,
          email_subject: emailSubject,
          email,
          host_user: storedEmail || "docadvisor@shadhinlab.com",
        });
        console.log("API Response:", response.data);
        toast.success("Email sent successfully!"); // Show success toast
        setShowEmailForm(false); // Close the form on success
      } catch (error) {
        console.error("Error sending email:", error);
        toast.error("Failed to send email."); // Show error toast
      } finally {
        setLoading(false); // Stop loader
      }
    }
  };

  const validateForm = (): boolean => {
    let formErrors: Errors = {};
    let valid = true;

    if (!email) {
      valid = false;
      formErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      valid = false;
      formErrors.email = "Email address is invalid.";
    }

    if (!emailSubject) {
      valid = false;
      formErrors.emailSubject = "Email subject is required.";
    }

    if (!emailContent) {
      valid = false;
      formErrors.emailContent = "Email content is required.";
    }

    setErrors(formErrors);
    return valid;
  };

  return (
    <form className="email-form" onSubmit={handleSubmit}>
      <h2>Verify Email</h2>
      <div className="w-full">
        <input
          type="email"
          placeholder="Enter Lead's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          //   required
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>
      <div className="w-full">
        <input
          type="text"
          placeholder="Enter email subject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          //   required
        />
        {errors.emailSubject && <p className="error">{errors.emailSubject}</p>}
      </div>
      <div className="w-full">
        <textarea
          placeholder="Enter email content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          //   required
        />
        {errors.emailContent && <p className="error">{errors.emailContent}</p>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? <Loader color="#fff" size={30} /> : "Send Email"}
      </button>
    </form>
  );
};

export default EmailForm;
