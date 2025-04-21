import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { ICreatePSTNNumberOutput } from "../../../../../../requests/mutations";

interface ISuccessModalProps {
  data: ICreatePSTNNumberOutput;
  close: () => void;
}

export const SuccessModal = ({ data, close }: ISuccessModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal show={true} onHide={close} centered>
      <Modal.Header style={{ backgroundColor: "var(--main-white-color)" }}>
        <Modal.Title
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            color: "var(--main-sidebarfont-color)",
          }}
        >
          {t("PSTN Numbers")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "var(--main-white-color)",
        }}
      >
        {data && data.createdNumbers.length !== 0 && (
          <div>
            <p style={{ fontSize: "16px", color: "var(--main-orange-color)" }}>
              {data.createdNumbers.length}{" "}
              {t("numbers were successfully created.")}
            </p>
          </div>
        )}
        {data && data.duplicateNumbers.length !== 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "16px", color: "var(--main-error-color)" }}>
              {t("These")} {data.duplicateNumbers.length}
              {t(" numbers are duplicates and were ignored:")}
            </p>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
                border: "1px solid var(--main-error-color)",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "var(--main-error-bg-color)",
              }}
            >
              {data.duplicateNumbers.map((item, index) => (
                <span
                  key={index}
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: "14px",
                    color: "var(--main-error-color)",
                  }}
                >
                  {item}
                  {index < data.duplicateNumbers.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer
        style={{
          justifyContent: "center",
          backgroundColor: "var(--main-white-color)",
        }}
      >
        <Button
          variant="secondary"
          onClick={close}
          style={{
            padding: "7px 18px",
            fontSize: "16px",
            borderRadius: "5px",
            backgroundColor: "var(--main-orange-color)",
          }}
        >
          {t("Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
