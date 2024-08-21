import React from "react";

interface LoaderProps {
  color?: string;
  size?: number; // Size in pixels
}

const Loader: React.FC<LoaderProps> = ({ color = "#007bff", size = 40 }) => {
  return (
    <div className="center" style={{ width: "100%" }}>
      <div
        className="loader"
        style={{
          borderColor: `${color} transparent ${color} transparent`,
          width: `${size}px`,
          height: `${size}px`,
        }}
      ></div>
    </div>
  );
};

export default Loader;
