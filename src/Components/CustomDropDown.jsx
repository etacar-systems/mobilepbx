import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Dropdownicon } from "../Assets/Icon/Dropdownicon.svg";
import { useTranslation } from "react-i18next";

function CustomDropDown({
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
  bgcolor,
  mode,
  sorting,
  fullWidth,
}) {
  useEffect(() => {
    const selectedextension = valueArray?.find((val) => val._id === showValue);
    const selectedtype = valueArray?.find((val) => val.value === showValue);
    const gt_type = valueArray?.find((val) => val._id === showValue);
    console.log(valueArray, "gt_type", gt_type, showValue);
    if (name == "extension") {
      Showstate(selectedextension?.extension);
    } else if (name == "selectextension") {
      Showstate(selectedtype?.type);
    } else if (name == "Direction") {
      Showstate(selectedtype?.name);
    } else if (name == "gt_type") {
      Showstate(gt_type?._id);
    } else {
      Showstate(defaultValue);
    }
  }, [defaultValue, showValue]);
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
    const selectedObject = valueArray?.find((val) => val._id === showValue);

    if (
      (selectedObject && name == "cid") ||
      (selectedObject && name == "Domain")
    ) {
      Showstate(selectedObject?.company_name || selectedObject?.gateway_name);
    } else if (name == "cid") {
      Showstate(null);
    }
  }, [showValue, state, valueArray]);
  useEffect(() => {
    if (name == "User_type" || name == "Assigned_Zone") {
      if (showValue) {
        Showstate(showValue);
      } else {
        Showstate(defaultValue);
      }
    }
  }, [showValue, defaultValue]);
  useEffect(() => {
    if (
      name.startsWith("TimeList_") ||
      name.startsWith("Value_") ||
      name.startsWith("Range_")
    ) {
      if (showValue) {
        Showstate(showValue);
      } else {
        Showstate(defaultValue);
      }
    }
  }, [showValue, defaultValue]);
  const { t } = useTranslation();

  return (
    <div>
      <div
        className="Selfmade-dropdown "
        style={{
          width: "100%",
          backgroundColor: mode === "edit" ? "var(--main-input-disabled)" : "",
        }}
      >
        <div
          className="Selfmadedropdown-btn "
          onClick={mode === "edit" ? null : handleDropdownClick}
          style={{
            background: bgcolor,
            width: fullWidth ? undefined : "100px",
          }}
        >
          {console.log(state, "---state--")}
          <div className="elipsisDrodownshow">
            {t(state) || t(defaultValue)}
          </div>
          <div>
            <Dropdownicon />
          </div>
        </div>
        {openDropdown === name && mapValue ? (
          <div className="Selfmadedropdown-content">
            {valueArray && valueArray.length > 0 ? (
              <>
                {" "}
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
                          handleSelection(name, item[storeValue]);
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
        ) : openDropdown === name ? (
          <div className="Selfmadedropdown-content">
            {valueArray && valueArray.length > 0 ? (
              <>
                {" "}
                {(!sorting ? valueArray : valueArray?.sort()).map(
                  (item, index) => {
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
                        {t(item)}
                      </a>
                    );
                  }
                )}
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

export default CustomDropDown;
