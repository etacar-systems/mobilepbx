import { FormEventHandler, PropsWithChildren, ReactNode } from "react";

import { AdminHeader } from "../../Admin";

import classNames from "./contentTemplate.module.scss";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface IContentTemplateProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  action?: ReactNode;
  className?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export const ContentTemplate = ({
  action,
  children,
  className,
  onSubmit,
  isSubmitting,
  disabled
}: PropsWithChildren<IContentTemplateProps>) => {
  const { t } = useTranslation();

  return (
    <div className="tablespadding">
      <AdminHeader addBtn={true} />
      <form onSubmit={onSubmit} className={classNames.scroll}>
        <div className={[classNames.section, className].join(" ")}>
          {children}
        </div>
        {action ? (
          action
        ) : (
          <div
            className="d-flex justify-content-end "
            style={{ marginTop: "37px" }}
          >
            <button
              disabled={disabled || isSubmitting}
              className="btn_save"
            >
              {isSubmitting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                t("Save")
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
