import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Dropdownicon } from "../Assets/Icon/Dropdownicon.svg";
import { useTranslation } from "react-i18next";

function removePrefix(str) {
  return str;
}
function DropdownGreet({
  toggleDropdown,
  openDropdown,
  valueArray,
  handleSelection,
  name,
  defaultValue,
  mapValue,
  showValue,
  storeValue,
  setOpenDropdown,
  multiValue,
  mapObject,
  selectedSection,
}) {
  const [state, Showstate] = useState(showValue);
  const [inputVal, setInputVal] = useState();
  const handleDropdownClick = (e) => {
    e.stopPropagation();
    toggleDropdown(name);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown == name) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown, name, setOpenDropdown]);

  useEffect(() => {
    if (!multiValue) {
      Showstate(showValue);
      setInputVal(removePrefix(showValue));
    }
  }, [showValue, multiValue]);

  const { t } = useTranslation();
  return (
    <div>
      <div className="Selfmade-dropdown " style={{ width: "100%" }}>
        <div className="Selfmadedropdown-btn " onClick={handleDropdownClick}>
          <div className="elipsisDrodownshow">
            {/* {state.startsWith("say:") || state.startsWith("tone_stream:") ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "flex-start",
                }}
              >
                <div style={{ fontWeight: 500 }}>
                  {state.startsWith("say:") ? "say:" : "tone_stream:"}
                </div>
                <div>
                  <input
                    ref={inputRef}
                    value={inputVal}
                    type="text"
                    style={{
                      outline: "none",
                      border: "none",
                      color: "var(--main-adminheaderpage-color)",
                      backgroundColor: "transparent",
                      width: state.startsWith("say:") ? "140px" : "70px",
                    }}
                    autofocus
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ) : ( */}
            {state || defaultValue}
            {/* )} */}
          </div>
          <div>
            <Dropdownicon />
          </div>
        </div>
        {openDropdown === name ? (
          <div className="Selfmadedropdown-content">
            {valueArray && valueArray.length > 0 ? (
              <>
                {valueArray
                  ?.sort((a, b) => a[mapValue].localeCompare(b[mapValue]))
                  .map((item, index) => {
                    return (
                      <a
                        key={item._id}
                        className="elipsisDrodownshow"
                        style={{
                          color: "var(--main-dropdowncontent-color)",
                          width: "99%",
                        }}
                        onClick={() => {
                        handleSelection(name, item[storeValue], item[mapValue]);
                          Showstate(item[mapValue]);
                        }}
                      >
                        {item[mapValue]}
                      </a>
                    );
                  })}
              </>
            ) : (
              <div>{t("No Record")}</div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default DropdownGreet;
