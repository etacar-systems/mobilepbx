import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Dropdownicon } from "../Assets/Icon/Dropdownicon.svg";
import { useTranslation } from "react-i18next";

function DropDown({
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
  const { t } = useTranslation();
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
    if (!multiValue) {
      Showstate(showValue);
    }
    if (name === "ivr_menu_parent_id") {
      Showstate(valueArray?.find((i) => i.ivr_uuid === showValue)?.name);
    }
  }, [showValue, valueArray]);

  useEffect(() => {
    if (
      selectedSection &&
      name === "ring_group_ringback" &&
      !mapObject[state]
    ) {
      handleSelection(name, "");
    }
  }, [selectedSection]);

  return (
    <div>
      <div className="Selfmade-dropdown " style={{ width: "100%" }}>
        <div className="Selfmadedropdown-btn " onClick={handleDropdownClick}>
          <div className="elipsisDrodownshow">
            {name === "ring_group_ringback" || name === "expression_detail"
              ? mapObject[state] || defaultValue
              : state || defaultValue}
          </div>
          <div>
            <Dropdownicon />
          </div>
        </div>
        {openDropdown === name && multiValue ? (
          <div className="Selfmadedropdown-content">
            {valueArray && valueArray.length > 0 ? (
              <>
                {" "}
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
                        Showstate(item[mapValue]);
                      }}
                    >
                      {t(item[mapValue])}
                    </a>
                  );
                })}
              </>
            ) : (
              <div>{t("No Record")}</div>
            )}
          </div>
        ) : openDropdown === name && mapValue ? (
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
                  {t(item[mapValue])}
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
                    handleSelection(name, item, multiValue);
                    Showstate(item);
                  }}
                >
                  {name === "ring_group_ringback" ||
                  name === "expression_detail"
                    ? t(mapObject[item])
                    : t(item)}
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

export default DropDown;
