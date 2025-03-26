import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ReactComponent as Document } from "../../Assets/Icon/document.svg";
import { ReactComponent as Document1 } from "../../Assets/Icon/document copy.svg";
import { ReactComponent as Download } from "../../Assets/Icon/download.svg";
import { ReactComponent as Download1 } from "../../Assets/Icon/download copy.svg";
import axios from "axios";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
const DocumentComponent = ({ message, passhover, passhover1, forward }) => {
  const { t } = useTranslation();
  const pathUrl = process.env.REACT_APP_FILE_BASE_URL;
  let user_id;
  var path = window.location.pathname;
  if (path == "/whatsappChat") {
    user_id = Cookies.get("company_number");
  } else {
    user_id = Cookies.get("User_id");
  }

  const downloadFile = async (file) => {
    const fileUrl = `${pathUrl}${file}`;

    try {
      const response = await axios.get(fileUrl, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {}
  };

  const documentName = message?.message.split("/").slice(2).join(", ");

  const sender_id = message?.sender_id?._id
    ? message?.sender_id?._id
    : message?.sender_id;

  return (
    <div
      style={{
        background: passhover1
          ? "var(--main-orange-color)"
          : passhover
          ? ""
          : "",
        display: "flex",
        borderRadius: "10px",
      }}
    >
      <Container style={{ paddingLeft: "0" }}>
        {forward == true && (
          <div
            style={{
              color: "black",
              fontSize: "14px",
              borderBottom: "1px solid",
              marginLeft: "10px",
              marginBottom: "10px",
            }}
          >
            {t("Forwarded")}
          </div>
        )}
        <Row className="align-items-center py-2 ">
          <Col xs={2} className="p-0">
            <div>
              {sender_id !== user_id ? (
                <Document style={{ height: "30px", width: "30px" }} />
              ) : (
                <Document1 style={{ height: "30px", width: "30px" }} />
              )}
            </div>
          </Col>
          <Col xs={8}>
            <div
              className="docsize"
              style={{
                color:
                  sender_id !== user_id
                    ? "var(--main-sidebarfont-color)"
                    : "var(--main-white-color)",
              }}
            >
              {documentName.length > 20
                ? documentName.substring(0, 14) + "..."
                : documentName}
            </div>
          </Col>
          <Col xs={2}>
            <div
              onClick={() => {
                downloadFile(message.message);
              }}
            >
              {sender_id !== user_id ? (
                <Download style={{ height: "30px", width: "30px" }} />
              ) : (
                <Download1 style={{ height: "30px", width: "30px" }} />
              )}
            </div>
          </Col>
        </Row>
      </Container>
      {passhover1 ? passhover1 : passhover}
    </div>
  );
};

export default DocumentComponent;
