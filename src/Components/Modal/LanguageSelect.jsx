import React, { useEffect, useRef, useState } from "react";
import language from "../../Assets/Image/languge.jpg";
import language_dark from "../../Assets/Image/language_dark_2.png";
import englishLanguage from "../../Assets/Image/English_language.webp";
import finnishLanguage from "../../Assets/Image/Finnish_language.png";
import Cookies from "js-cookie";
import i18n from "../../i18next";
import { useTranslation } from "react-i18next";

const LanguageSelect = ({ main }) => {
  const [theme, setTheme] = useState(false);

  const handleLanguage = () => {
    setIsClick(!isClick);
  };
  const [isClick, setIsClick] = useState(false);
  const iconRef = useRef(null);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the dropdown if the click is outside the dropdown and icon
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIsClick(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { t } = useTranslation();

  const languagehandler = (language) => {
    i18n.changeLanguage(language);
    Cookies.set("language", language, { expires: 365 }); // Set the language cookie to expire in 1 year
    handleLanguage();
  };

  const Themee = Cookies.get("Theme");

  return (
    <div style={{ position: "relative" }} className="p-2">
      <div className="d-flex justify-content-end " ref={iconRef}>
        {Themee !== "Dark" ? (
          <img
            src={language}
            alt=""
            style={{
              width: "25px",
              height: "18px",
            }}
            onClick={handleLanguage}
          />
        ) : (
          <img
            src={language_dark}
            alt=""
            style={{
              width: "20px",
              height: "18px",
            }}
            onClick={handleLanguage}
          />
        )}
      </div>

      <div
        className={main ? "dropdown-menu" : "dropdown-menu_main"}
        ref={dropdownRef}
        aria-labelledby="navbarDropdown"
        style={{
          display: isClick ? "block" : "none",
          position: "absolute",
        }}
      >
        <div
          className="row align-items-center py-1 Langcursor"
          onClick={() => {
            languagehandler("en");
          }}
        >
          <div className="col-2">
            <img
              src={englishLanguage}
              alt=""
              style={{
                width: "20px",
                height: "20px",
                objectFit: "cover",
                borderRadius: "50%",
                marginLeft: "10px",
              }}
            />
          </div>
          <div className="col-9 ms-auto language_color">English</div>
        </div>
        <div
          className="row align-items-center py-1 Langcursor"
          onClick={() => {
            languagehandler("fi");
          }}
        >
          <div className="col-2">
            <img
              src={finnishLanguage}
              alt=""
              style={{
                width: "20px",
                height: "20px",
                objectFit: "cover",
                borderRadius: "50%",
                marginLeft: "10px",
              }}
            />
          </div>
          <div className="col-9 ms-auto language_color">Finnish</div>
        </div>
        {/* <div
                      className="row align-items-center py-1 "
                      onClick={() => {
                        languagehandler("hi");
                      }}
                    >
                      <div className="col-2">
                        <img
                          src={hindiLanguage}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginLeft: "10px",
                          }}
                        />
                      </div>
                    </div> */}
      </div>
    </div>
  );
};

export default LanguageSelect;
