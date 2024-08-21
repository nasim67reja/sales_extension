import * as React from "react";
import ExportToExcel from "./ExportXlsx";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import PdfDataGrid from "./PdfDataGridFormate";

export default function PositionedMenu({ exportData, profiles }) {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const inputRef = React.useRef(null);
  const menuRef = React.useRef(null);

  const handleClick = () => {
    setMenuVisible(!menuVisible);
  };

  const handleClose = () => {
    setMenuVisible(false);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };

  React.useEffect(() => {
    if (menuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisible]);

  // const generatePDF = () => {
  //   html2canvas(inputRef.current).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const doc = new jsPDF();
  //     doc.addImage(imgData, "PNG", 5, 10, null, null);
  //     doc.save("scrapped_profiles.pdf");
  //   });
  // };

  return (
    <>
      <div
        style={{
          opacity: 0,
          position: "absolute",
          zIndex: "-10",
          border: "1px solid black",
          width: "760px",
        }}
      >
        <div ref={inputRef}>
          <PdfDataGrid profiles={profiles} />
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <button onClick={handleClick} className="export-button">
          <span>Export</span>
          <svg
            style={{ width: "20px", marginLeft: "5px", fill: "#fff" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M14 2v6h4l-6 6-6-6h4V2h4zM6 18v4h12v-4H6z" />
          </svg>
        </button>
        {menuVisible && (
          <div ref={menuRef} className="center flex-col menu">
            <div
              className="menu-item"
              onClick={() => {
                // generatePDF();
                handleClose();
              }}
            >
              Pdf
            </div>
            <div className="menu-item" onClick={handleClose}>
              <ExportToExcel
                data={exportData}
                fileName="scrapped_profiles"
                text="XLSX"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
