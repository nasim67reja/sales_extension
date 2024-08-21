import * as React from "react";
import { Link, useSearchParams } from "react-router-dom";
import Settings from "./Settings";
import ScrapedData from "./ScrapedData";
// Make sure to import your ScrapedData component if you uncomment it
// import ScrapedData from "./ScrapedData";

export default function DashboardLayout() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("active");

  const isActive = (name) => code === name;

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h1 className="heading-main">
          <img style={{ width: "34px" }} src="/assets/logo_main.svg" alt="" />
          <span style={{ color: "#007afe" }}>Sales Assistant</span>
        </h1>

        <div className="sidebar-content">
          {["History", "Settings"].map((text, index) => (
            <Link
              key={text}
              className={`sidebar-link ${isActive(text) ? "active" : ""}`}
              to={`/options.html?active=${text}`}
            >
              {text}
            </Link>
          ))}
        </div>
      </div>

      <div className="main-content">
        {code === "Settings" && (
          <div className="settings-page">
            <Settings />
          </div>
        )}
        {(code === "History" || !code) && (
          <div className="history-page">
            {/* Uncomment the below line to include ScrapedData */}
            <ScrapedData open={true} />
          </div>
        )}
      </div>
    </div>
  );
}
