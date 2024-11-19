import React from "react";
import { Col, Row, InputGroup, Form } from "react-bootstrap";
import { ReactComponent as Emailicon } from "../../Assets/Icon/email_logo.svg";
import { ReactComponent as Companylogo } from "../../Assets/Icon/company.svg";
import { ReactComponent as Keylogo } from "../../Assets/Icon/keylogo.svg";
import { ReactComponent as Computerlogo } from "../../Assets/Icon/computerlogo.svg";
import { ReactComponent as Cardlogo } from "../../Assets/Icon/cardlogo.svg";
import { ReactComponent as PhoneRegister } from "../../Assets/Icon/phoneregister.svg";
import Avatar from "../../Assets/Icon/Avatar.svg";
import { useTranslation } from "react-i18next";

const RegisterPageBilling = () => {
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
        <div className="forcenter">{t("Mobile")}</div>
        <InputGroup className="registerpage-maingroup">
          <InputGroup.Text
            id="basic-addon1"
            className="registerpage-icon-parent"
          >
            <PhoneRegister className="registerpage-icon" />
            {/* <img src={phoneRegister} className="registerpage-icon" /> */}
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
      <Col lg={4} md={4}>
        <div className="forcenter">{t("Company name")}</div>
        <InputGroup className="registerpage-maingroup">
          <InputGroup.Text
            id="basic-addon1"
            className="registerpage-icon-parent"
          >
            <Companylogo className="registerpage-icon" />
            {/* <img src={companylogo} className="registerpage-icon" /> */}
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
        <div className="forcenter">{t("VAT")}</div>
        <InputGroup className="registerpage-maingroup">
          <InputGroup.Text
            id="basic-addon1"
            className="registerpage-icon-parent"
          >
            <Keylogo className="registerpage-icon" />
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
        <div className="forcenter">{t("Street address")}</div>
        <InputGroup className="registerpage-maingroup">
          <InputGroup.Text
            id="basic-addon1"
            className="registerpage-icon-parent"
          >
            <Computerlogo className="registerpage-icon" />
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
        <div className="forcenter">{t("ZIP CODE")}</div>
        <InputGroup className="registerpage-maingroup">
          <InputGroup.Text
            id="basic-addon1"
            className="registerpage-icon-parent"
          >
            <Cardlogo className="registerpage-icon" />
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
        <div className="forcenter">{t("City")}</div>
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

export default RegisterPageBilling;
