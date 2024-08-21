import React from "react";
import { StoredUpworkData } from "../../interfaces/UserProfile";

export const colors = [
  "#ffccbc",
  "#efebe9",
  "#bdbdbd",
  "#b0bec5",
  "#f1f8e9",
  "#e6ee9c",
  "#81c784",
  "#80deea",
  "#e1f5fe",
  "#fce4ec",
];

export function generateRandomNumber() {
  return Math.floor(Math.random() * 10);
}

interface SkillsProps {
  skills: string[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <div style={{ marginBottom: "15px" }}>
      <h3 className="text-bold heading-tertiary">Skills ({skills.length}): </h3>
      <ul className="skills">
        {skills.map((el: string, i: number) => (
          <li
            key={i}
            style={{ backgroundColor: `${colors[generateRandomNumber()]}` }}
          >
            {el}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Skills;
