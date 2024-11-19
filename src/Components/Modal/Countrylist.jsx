import React, { useEffect, useState, useRef } from "react";
import { getNames } from "country-list";
import { Form } from "react-bootstrap";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import { useTranslation } from "react-i18next";

const CountrySelector = ({
  formData,
  handleSelection,
  toggleDropdown,
  openDropdown,
  setOpenDropdown,
}) => {
  const [searchItem, setSearchItem] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(getNames());
  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
    const filteredItems = getNames().filter((user) =>
      user.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredItems);
  };

  useEffect(() => {
    if (openDropdown === "type") {
      setSearchItem("");
      setFilteredUsers(getNames());
    }
  }, [openDropdown]);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      openDropdown === "type"
    ) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const { t } = useTranslation();

  return (
    <div
      className="Selfmade-dropdown"
      style={{ width: "100%" }}
      ref={dropdownRef}
    >
      <div
        className="Selfmadedropdown-btn"
        onClick={() => toggleDropdown("type")}
      >
        <span className="conlist">
          {" "}
          {t(formData.Country) || t("--Select Country--")}
        </span>
        <div>
          <Dropdownicon />
        </div>
      </div>
      {openDropdown === "type" && (
        <div className="Selfmadedropdown-content">
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
              alignItems: "center",
            }}
          >
            <i
              className="fa fa-search"
              aria-hidden="true"
              style={{
                fontSize: "13px",
                position: "relative",
                left: "4px",
                bottom: "-2px",
                color: "var(--main-adminheaderpage-color)",
              }}
            ></i>{" "}
            <Form.Control
              type="text"
              className="searchcountry"
              value={searchItem}
              onChange={handleInputChange}
              placeholder={t("Search country")}
            />
          </div>

          {filteredUsers?.sort().map((type) => (
            <a
              key={type}
              onClick={() => handleSelection("Country", type, type)}
              className="elipsisDrodownshow"
            >
              {t(type)}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
