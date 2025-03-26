import React, { useRef, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Tab, Tabs } from "react-bootstrap";
import RegisterForm from "./RegisterPageAccount";
import { useEffect } from "react";
import RegisterPageBilling from "./RegisterPageBilling";
import RegisterPageAuthorization from "./RegisterPageAuthorization";
import TermsAndConditions from "./RegisterPageTerms&Cond";
import RegisterPageAdminSetting from "./RegisterPageAdminSetting";
import RegisterPageIdentify from "./RegisterPageIdentify";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import LanguageSelect from "../Modal/LanguageSelect";
import LogoDisply from "./LogoDisply";

function RegisterPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("1.Identify");
  const [visitedTabs, setVisitedTabs] = useState(["1.Identify"]);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [theme, setTheme] = useState(false);
  const Themee = Cookies.get("Theme");
  useEffect(() => {
    if (Themee) {
      setTheme(Themee === "Dark");
      document.querySelector("body").setAttribute("data-theme", Themee);
    }
  }, [Themee]);
  const handleTabSelect = (selectedTab) => {
    if (visitedTabs.includes(selectedTab)) {
      setActiveTab(selectedTab);
    }
  };

  const handleNext = () => {
    const tabs = [
      "1.Identify",
      "2.Account",
      "3.Select billing options",
      "4.Authorization",
      "5.Admin settings",
      "6.Terms Conditions",
      "7.Finish",
    ];
    const currentIndex = tabs.findIndex((tab) => tab === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
      setVisitedTabs([...visitedTabs, tabs[currentIndex + 1]]);
    }
  };
  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 1;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);
  const handlePrevious = () => {
    const tabs = [
      "1.Identify",
      "2.Account",
      "3.Select billing options",
      "4.Authorization",
      "5.Admin settings",
      "6.Terms Conditions",
      "7.Finish",
    ];
    const currentIndex = tabs.findIndex((tab) => tab === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };
  const getTabClass = (eventKey) => {
    if (eventKey === activeTab) {
      return "orange-flag";
    } else if (visitedTabs.includes(eventKey)) {
      return "visited-flag";
    } else {
      return "notvisited-flag";
    }
  };

  const tabs = [
    "1.Identify",
    "2.Account",
    "3.Select billing options",
    "4.Authorization",
    "5.Admin settings",
    "6.Terms Conditions",
    "7.Finish",
  ];
  const currentIndex = tabs.findIndex((tab) => tab === activeTab);

  return (
    <>
      <LanguageSelect />
      <div style={{ overflow: "auto", height: dynamicHeight }}>
        <div className="pattern">
          <span className="orange"></span>
        </div>
        <Row
          className="auth-main-divs mb-0 mt-0"
          style={{ marginLeft: "0px", marginRight: "0px" }}
        >
          <Col className="auth-main-header" lg={12} md={12}>
            <div className="width_tabbs">
              <div className="auth-brand" style={{ marginTop: "85px" }}>
                <LogoDisply />
              </div>
              <Tabs
                activeKey={activeTab}
                onSelect={handleTabSelect}
                id="uncontrolled-tab-example"
                className=" manage_tabsss"
                style={{ marginBottom: "0.10rem", border: "none" }}
              >
                <Tab
                  eventKey="1.Identify"
                  title={`1. ${t("Identify")}`}
                  tabClassName={getTabClass("1.Identify")}
                >
                  <RegisterPageIdentify />
                </Tab>
                <Tab
                  eventKey="2.Account"
                  title={`2. ${t("Account")}`}
                  disabled={!visitedTabs.includes("2.Account")}
                  tabClassName={getTabClass("2.Account")}
                >
                  <RegisterForm />
                </Tab>
                <Tab
                  eventKey="3.Select billing options"
                  title={`3. ${t("Select billing options")}`}
                  disabled={!visitedTabs.includes("3.Select billing options")}
                  className="3"
                  tabClassName={getTabClass("3.Select billing options")}
                >
                  <RegisterPageBilling />
                </Tab>
                <Tab
                  eventKey="4.Authorization"
                  title={`4. ${t("Authorization")}`}
                  disabled={!visitedTabs.includes("4.Authorization")}
                  tabClassName={getTabClass("4.Authorization")}
                >
                  <RegisterPageAuthorization />
                </Tab>
                <Tab
                  eventKey="5.Admin settings"
                  title={`5. ${t("Admin settings")}`}
                  disabled={!visitedTabs.includes("5.Admin settings")}
                  tabClassName={getTabClass("5.Admin settings")}
                >
                  <RegisterPageAdminSetting />
                </Tab>
                <Tab
                  eventKey="6.Terms Conditions"
                  title={`6. ${t("Terms Conditions")}`}
                  disabled={!visitedTabs.includes("6.Terms Conditions")}
                  tabClassName={getTabClass("6.Terms Conditions")}
                >
                  <TermsAndConditions />
                </Tab>
                <Tab
                  eventKey="7.Finish"
                  title={`7. ${t("Finish")}`}
                  disabled={!visitedTabs.includes("7.Finish")}
                  tabClassName={getTabClass("7.Finish")}
                >
                  <Row className="backgroundoffinish ">
                    <p>{t("Informations")}</p>
                  </Row>
                </Tab>
              </Tabs>

              <div className="my-2 d-flex justify-content-end">
                <button
                  className={
                    currentIndex === 0
                      ? "inactiveprevbtn me-1"
                      : "btn_Previous me-1"
                  }
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  {t("Previous")}
                </button>
                <button
                  className="btn_Previous "
                  onClick={handleNext}
                  disabled={currentIndex === tabs.length - 1}
                >
                  {currentIndex === tabs.length - 1 ? t("Finish") : t("Next")}
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default RegisterPage;
