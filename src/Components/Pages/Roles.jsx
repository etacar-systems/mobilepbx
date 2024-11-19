// src/AccordionComponent.js
import React from "react";
import { Accordion, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function Roles() {
  const { t } = useTranslation();
  const data = [
    { header: "Dashboard", title: "Dashboard", key: "1" },
    { header: "Dashboard", title: "Dashboard", key: "2" },
    { header: "Dashboard", title: "Dashboard", key: "3" },
    { header: "Dashboard", title: "Dashboard", key: "4" },
  ];
  return (
    <div>
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ marginBottom: "24px", marginTop: "5px" }}
      >
        <span className="dashboardtext">{t("Roles")}</span>
      </div>
      <div className="num_table" style={{ height: "505px", overflow: "auto" }}>
        <Accordion defaultActiveKey="0" style={{ width: "70%" }}>
          {data.map((val) => {
            return (
              <div className="accordination">
                <Accordion.Item eventKey={val.key}>
                  <Accordion.Header>{val.header}</Accordion.Header>
                  <Accordion.Body>
                    <Form.Check type="checkbox" label={val.title} />
                  </Accordion.Body>
                </Accordion.Item>
              </div>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
