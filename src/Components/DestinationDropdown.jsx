import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Dropdownicon } from "../Assets/Icon/Dropdownicon.svg";
import { useTranslation } from "react-i18next";

const ListNameMapping = {
  conference: "Conference",
  extensions: "Extensions",
  ivr_menus: "IVR",
  recordings: "Recordings",
  ring_groups: "Ring groups",
  timeconditions: "Time conditions",
};
function DestinationDropdown({
  toggleDropdown,
  openDropdown,
  valueArray,
  handleSelection,
  name,
  defaultValue,
  showValue,
  ivrShowValue,
  setOpenDropdown,
  isMulti,
  isRingBack,
  ringShowValue,
}) {
  const { t } = useTranslation();
  const [state, Showstate] = useState("");

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    toggleDropdown(name);
  };

  const handleClickOutside = (event) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (showValue) {
      let selectedObject;
      Object.keys(valueArray).forEach((val) => {
        valueArray[val].forEach((subVal) => {
          if (
            subVal.app === Object.values(showValue)[0] &&
            subVal.data === Object.values(showValue)[1]
          ) {
            selectedObject = subVal;
          }
        });
      });

      if (selectedObject) {
        Showstate(selectedObject);
      }
    }
  }, [showValue]);

  useEffect(() => {
    if (ivrShowValue) {
      let selectedObject;
      Object.keys(valueArray).forEach((val) => {
        valueArray[val].forEach((subVal) => {
          if (subVal.app + " " + subVal.data === ivrShowValue) {
            selectedObject = subVal;
          }
        });
      });

      if (selectedObject) {
        Showstate(selectedObject);
      }
    }
  }, [ivrShowValue]);

  useEffect(() => {
    if (ringShowValue) {
      let selectedObject;
      Object.keys(valueArray).forEach((val) => {
        Object.keys(valueArray[val]).forEach((subVal) => {
          if (subVal === ringShowValue) {
            selectedObject = valueArray[val][subVal];
          }
        });
      });

      if (selectedObject) {
        Showstate(selectedObject);
      }
    }
  }, [ringShowValue]);

  return (
    <div style={{ width: "100%" }}>
      <div className="Selfmade-dropdown" style={{ width: "100%" }}>
        <div className="Selfmadedropdown-btn" onClick={handleDropdownClick}>
          <div className="elipsisDrodownshow">
            {isRingBack ? state || defaultValue : state?.name || defaultValue}
          </div>
          <div>
            <Dropdownicon />
          </div>
        </div>
        {openDropdown === name ? (
          <div className="Selfmadedropdown-content">
            <>
              {Object.keys(valueArray)
                .sort()
                .map((item, index) => {
                  const subItems = isRingBack
                    ? Object.keys(valueArray[item])
                    : valueArray[item];
                  return (
                    <React.Fragment key={index}>
                      <a
                        className="elipsisDrodownshow"
                        style={{
                          color: "var(--main-destinationdropdown-color)",
                          width: "99%",
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                      >
                        {t(ListNameMapping[item]) || t(item)}
                      </a>
                      {subItems && subItems.length === 0 ? (
                        <div className="Norecordcss">{t("No Record")}</div>
                      ) : (
                        [...subItems]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((subItem, subIndex) => (
                            <a
                              key={subItem._id || subIndex}
                              className="elipsisDrodownshow"
                              style={{
                                color: "var(--main-dropdowncontent-color)",
                                width: "99%",
                                fontSize: "14px",
                              }}
                              onClick={() => {
                                handleSelection(name, subItem, isMulti);
                                Showstate(
                              isRingBack ? valueArray[item][subItem] : subItem
                                );
                              }}
                            >
                              {isRingBack
                                ? valueArray[item][subItem]
                                : subItem.name}
                            </a>
                          ))
                      )}
                    </React.Fragment>
                  );
                })}
            </>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DestinationDropdown;
