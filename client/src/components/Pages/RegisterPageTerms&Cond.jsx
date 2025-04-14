import React from "react";
import { Form, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  return (
    <Form.Group className="backgroundofterms">
      <Form.Label as="fieldset" className="termheader">
        <h6 style={{ fontWeight: "600" }}>Terms</h6>
      </Form.Label>
      <Row>
        <Col lg={12} md={12} className="termsbody">
          <div className="dd nestable-with-handle" style={{ width: "100%" }}>
            <div style={{ width: "100%", display: "flex" }}>
              <div className="dd3-content" style={{ width: "15%" }}>
                1.
              </div>
              <div className="dd3-content" style={{ width: "85%" }}>
                {t(
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                )}
              </div>
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <div className="dd3-content" style={{ width: "15%" }}>
                2.
              </div>
              <div className="dd3-content" style={{ width: "85%" }}>
                {t(
                  "It is a long established fact that a reader will be distracted by the readable"
                )}
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div className="dd3-content" style={{ width: "15%" }}>
                3.
              </div>
              <div className="dd3-content" style={{ width: "85%" }}>
                {t(
                  "It is a long established fact that a reader will be distracted by the readable"
                )}
              </div>
            </div>
            {/* 

                                                 */}
          </div>
        </Col>
      </Row>
      <div className="fancy-checkbox termsfooter mt-3">
        <input
          type="checkbox"
          style={{ width: "20px", height: "20px" }}
          className="custom-checkbox"
        />
        <p className="mb-0 ms-2 dd3-content">
          {t("I agree with the Terms and Conditions.")}
        </p>
      </div>
    </Form.Group>
  );
};

export default TermsAndConditions;
