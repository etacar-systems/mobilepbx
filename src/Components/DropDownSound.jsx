import React, { useEffect, useState } from "react";
import { ReactComponent as Dropdownicon } from "../Assets/Icon/Dropdownicon.svg";
import { useTranslation } from "react-i18next";
const ListNameMapping = {
  ivr_menus: "IVR",
  conference: "Conference",
  extensions: "Extensions",
  recordings: "Recordings",
  ring_groups: "Ring groups",
  timeconditions: "Time conditions",
  sounds: "Sounds",
};
function DropDownSound({
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
  const { t } = useTranslation();
  const handleClickOutside = (event) => {
    if (openDropdown === name) {
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

  // useEffect(() => {
  //   Object.keys(valueArray).forEach((val) => {
  //     Object.keys(valueArray[val]).forEach((subVal) => {
  //       if (subVal == showValue) {
  //         Showstate(valueArray[val][subVal]);
  //       }
  //     });
  //   });
  // }, [showValue, valueArray]);
  useEffect(() => {
    if (showValue) {
      Showstate(showValue);
    }
  }, [showValue]);

  return (
    <div>
      <div className="Selfmade-dropdown " style={{ width: "100%" }}>
        <div className="Selfmadedropdown-btn " onClick={handleDropdownClick}>
          <div className="elipsisDrodownshow">{state || defaultValue}</div>
          <div>
            <Dropdownicon />
          </div>
        </div>
        {openDropdown === name ? (
          <div className="Selfmadedropdown-content">
            {Object.keys(valueArray)
              ?.sort()
              .map((item, index) => {
                const subItems = Object.keys(valueArray[item]);
                return (
                  <>
                    <a
                      key={item.uuid}
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
                    {subItems.length === 0 ? (
                      <div className="Norecordcss">{t("No record")}</div>
                    ) : (
                      subItems.sort().map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          className="elipsisDrodownshow"
                          style={{
                            color: "var(--main-dropdowncontent-color)",
                            width: "99%",
                            fontSize: "14px",
                          }}
                          onClick={() => {
                            handleSelection(
                              name,
                              valueArray[item][subItem],
                              subItem
                            );
                            Showstate(subItem);
                          }}
                        >
                          {subItem}
                        </a>
                      ))
                    )}
                  </>
                );
              })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DropDownSound;
