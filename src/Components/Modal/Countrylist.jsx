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
  const [countriesList, setCountriesList] = useState(getNames());

  const dropdownRef = useRef(null);
  const { t, i18n } = useTranslation();

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      openDropdown === "type"
    ) {
      setOpenDropdown(null);
    }
  };

  const diplayCountresList = () => {
    // in start we are making the list of country as key value pairs for name and translation.
    const filterdList = [...countriesList].map(name => { return {name, translation: t(name) } } )
      .filter(country => country.translation.toLowerCase().includes(searchItem.toLowerCase()))
      .sort((a, b) => a.translation.localeCompare(b.translation, i18n.language, { sensitivity: "base" }));

    return filterdList;
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

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
              placeholder={t("Search")}
            />
          </div>
          {diplayCountresList().map((country) => (
            <>
              <a
                key={country.name}
                onClick={() => handleSelection("Country", country.name, country.name)}
                className="elipsisDrodownshow"
              >
                {country.translation}
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
