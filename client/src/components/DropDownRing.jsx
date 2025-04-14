import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Dropdownicon } from "../Assets/Icon/Dropdownicon.svg";

function DropDownRing({
  toggleDropdown,
  openDropdown,
  valueArray,
  handleSelection,
  name,
  defaultValue,
  mapValue,
  storeValue,
  setOpenDropdown,
  showValue,
}) {
  const [state, Showstate] = useState("");
  const handleClickOutside = (event) => {
    if (openDropdown == name) {
      setOpenDropdown(null);
    }
  };
  const handleDropdownClick = (e) => {
    e.stopPropagation();
    toggleDropdown(name);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown]);
  useEffect(() => {
    const selectedObject = valueArray.find((val) => val._id === showValue);

    if (selectedObject) {
      Showstate(selectedObject?.company_name);
    } else {
      Showstate(null);
    }
  }, [showValue, state, valueArray]);

  return (
    <div>
      <div className="Selfmade-dropdown " style={{ width: "100%" }}>
        <div className="Selfmadedropdown-btn " onClick={handleDropdownClick}>
          <div className="elipsisDrodownshow">{state || defaultValue}</div>
          <div>
            <Dropdownicon />
          </div>
        </div>
        {openDropdown === name && mapValue ? (
          <div className="Selfmadedropdown-content">
            {valueArray?.map((item, index) => {
              return (
                <a
                  key={item._id}
                  className="elipsisDrodownshow"
                  style={{
                    color: "var(--main-dropdowncontent-color)",
                    width: "99%",
                  }}
                  onClick={() => {
                    handleSelection(name, item[storeValue]);
                    Showstate(item[mapValue]);
                  }}
                >
                  {item[mapValue]}
                </a>
              );
            })}
          </div>
        ) : openDropdown === name ? (
          <div className="Selfmadedropdown-content">
            {valueArray?.map((item, index) => {
              return (
                <a
                  key={item._id}
                  className="elipsisDrodownshow"
                  style={{
                    color: "var(--main-dropdowncontent-color)",
                    width: "99%",
                  }}
                  onClick={() => {
                    handleSelection(name, item);
                    Showstate(item);
                  }}
                >
                  {item}
                </a>
              );
            })}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default DropDownRing;
