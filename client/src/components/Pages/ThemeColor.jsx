import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Switch from "react-bootstrap/Switch";
import magic from "../../Assets/Image/magic-wand.svg";
import { useTranslation } from "react-i18next";

export default function ThemeColor({ isDrawerOpen, setIsDrawerOpen }) {
  const [isChecked, setIsChecked] = useState(false);

  const handletheme = (color) => {
    if (color == "green") {
      document.querySelector("body").setAttribute("data-theme", "green");
    } else if (color == "blush") {
      document.querySelector("body").setAttribute("data-theme", "blush");
    } else if (color == "cyan") {
      document.querySelector("body").setAttribute("data-theme", "cyan");
    } else if (color == "indigo") {
      document.querySelector("body").setAttribute("data-theme", "indigo");
    } else if (color == "red") {
      document.querySelector("body").setAttribute("data-theme", "red");
    } else {
      document.querySelector("body").setAttribute("data-theme", "orange");
    }
  };

  const handleSwitchChange = () => {
    setIsChecked(!isChecked);
  };

  const themeClose = () => {
    setIsDrawerOpen(false);
  };
  const { t } = useTranslation();
  return (
    <>
      <div className="magic_wand1" onClick={themeClose}>
        <img src={magic} alt="" width={15} />
      </div>
      <div className="themesetting">
        <div className="theme_color">
          <div className="header">
            <h2>{t("Theme Color")}</h2>
          </div>
          <ul className="choose-skin list-unstyled mb-0">
            <li
              data-theme="green"
              onClick={() => {
                handletheme("green");
              }}
            >
              <div className="green"></div>
            </li>
            <li
              data-theme="orange"
              onClick={() => {
                handletheme("orange");
              }}
              className="active"
            >
              <div className="orange"></div>
            </li>
            <li
              data-theme="blush"
              onClick={() => {
                handletheme("blush");
              }}
            >
              <div className="blush"></div>
            </li>
            <li
              data-theme="cyan"
              onClick={() => {
                handletheme("cyan");
              }}
            >
              <div className="cyan"></div>
            </li>
            <li
              data-theme="indigo"
              onClick={() => {
                handletheme("indigo");
              }}
            >
              <div className="indigo"></div>
            </li>
            <li
              data-theme="red"
              onClick={() => {
                handletheme("red");
              }}
            >
              <div className="red"></div>
            </li>
          </ul>
        </div>
        <div className=" setting_switch">
          <div className="header pb-2">
            <h2>{t("Settings")}</h2>
          </div>
          <ul className="list-group">
            <li className="list-group-item d-flex align-items-center justify-content-between">
              <h2>{t("Light Version")}</h2>

              <div className="float-right">
                <Form>
                  <Form.Check
                    type="switch"
                    id="custom-switch1"
                    checked={isChecked}
                    onChange={handleSwitchChange}
                    className="custom-switch"
                  />
                </Form>
              </div>
            </li>
            <li className="list-group-item d-flex align-items-center justify-content-between">
              <h2>{t("Horizontal Henu")}</h2>
              <div className="float-right">
                <Form>
                  <Form.Check
                    type="switch"
                    id="custom-switch2"
                    checked={isChecked}
                    onChange={handleSwitchChange}
                    className="custom-switch"
                  />
                </Form>
              </div>
            </li>
            <li className="list-group-item d-flex align-items-center justify-content-between">
              <h2>{t("Mini Sidebar")}</h2>
              <div className="float-right">
                <Form>
                  <Form.Check
                    type="switch"
                    id="custom-switch3"
                    checked={isChecked}
                    onChange={handleSwitchChange}
                    className="custom-switch"
                  />
                </Form>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
