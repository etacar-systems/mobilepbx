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
  const { t, i18n } = useTranslation();
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

  const [sortedCountries, setSortedCountries] = useState([]);

  useEffect(() => {
    // Ensure i18n.language is loaded before applying localeCompare
    if (i18n.language) {
      const sortedData = [...filteredUsers]
        .filter((item) => typeof item === "string")
        .sort((a, b) => a.localeCompare(b, i18n.language, { sensitivity: "base" }));
      setSortedCountries(sortedData);
    }
  }, [i18n.language, filteredUsers]);

  console.log(i18n.language, "-------------- t------------------");

  // const testArray = ["a", "o", "z", "ä", "ö"];
  // const collator = new Intl.Collator("fi"); // Finnish locale
  // const sortedArray = testArray.sort((a, b) => collator.compare(a, b));

  // console.log("Original array:", testArray);
  // console.log("Sorted array (locale 'fi'):", sortedArray);

  console.log(Intl.Collator.supportedLocalesOf(["fi"]));

  return (
    <div className="Selfmade-dropdown" style={{ width: "100%" }} ref={dropdownRef}>
      <div className="Selfmadedropdown-btn" onClick={() => toggleDropdown("type")}>
        <span className="conlist"> {t(formData.Country) || t("--Select Country--")}</span>
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
          {sortedCountries.map((type) => (
            <>
              <a
                key={type}
                onClick={() => handleSelection("Country", type, type)}
                className="elipsisDrodownshow"
              >
                {t(type)}
                <br />
              </a>
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
