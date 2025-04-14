import React from "react";
import { Col, Row, InputGroup, Form } from "react-bootstrap";
import { ReactComponent as Emailicon } from "../../Assets/Icon/email_logo.svg";
import Avatar from "../../Assets/Icon/Avatar.svg";
import { useTranslation } from "react-i18next";

const RegisterPageAuthorization = () => {
  const { t } = useTranslation();
  return (
    <Row className="backgroundofregistertab">
      <Col lg={4} md={4}>
        <div className="forcenter">{t("First name")}</div>
        <InputGroup className="registerpage-maingroup">
          <InputGroup.Text
            id="basic-addon1"
            className="registerpage-icon-parent"
          >
            <img src={Avatar} className="registerpage-icon" />
          </InputGroup.Text>
          <Form.Control
            placeholder=""
            aria-label="Username"
            aria-describedby="basic-addon1"
            className="emailforminput"
          />
        </InputGroup>
      </Col>
      <Col lg={4} md={4}>
        <div className="forcenter">{t("Last name")}</div>
        <InputGroup className="registerpage-maingroup">
          <InputGroup.Text
            id="basic-addon1"
            className="registerpage-icon-parent"
          >
            <img src={Avatar} className="registerpage-icon" />
          </InputGroup.Text>
          <Form.Control
            placeholder=""
            aria-label="Username"
            aria-describedby="basic-addon1"
            className="emailforminput"
          />
        </InputGroup>
      </Col>
      <Col lg={4} md={4}>
        <div className="forcenter">{t("Email")}</div>
        <InputGroup className="registerpage-maingroup">
          <InputGroup.Text
            id="basic-addon1"
            className="registerpage-icon-parent"
          >
            <Emailicon height={18} width={18} />
          </InputGroup.Text>
          <Form.Control
            placeholder=""
            aria-label="Username"
            aria-describedby="basic-addon1"
            className="emailforminput"
          />
        </InputGroup>
      </Col>
    </Row>
  );
};

export default RegisterPageAuthorization;
