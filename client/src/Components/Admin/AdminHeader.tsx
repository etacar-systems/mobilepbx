import React, { MouseEvent, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { pages } from "../Pages/VideoUpload/pages";
import { useLocation } from "react-router-dom";

interface IAdminHeaderProps {
  openModal?: (e: MouseEvent<HTMLButtonElement>) => void;
  // pathname: (typeof pages)[number]["link"];
  addBtn?: boolean;
  btnName?: string;
}

export const AdminHeader = ({
  openModal,
  // pathname,
  addBtn,
  btnName,
}: IAdminHeaderProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const titles = useMemo<Record<(typeof pages)[number]["link"], string>>(() => {
    return pages.reduce<Record<(typeof pages)[number]["link"], string>>(
      (acc, page) => {
        acc[page.link] = t(page.label);
        return acc;
      },
      {} as Record<(typeof pages)[number]["link"], string>
    );
  }, [t]);

  return (
    <>
      <div
        className="d-flex  justify-content-between"
        style={{ marginBottom: "21px", marginTop: "5px" }}
      >
        <span className="dashboardtext" style={{ lineHeight: "21px" }}>
          {titles[location.pathname as (typeof pages)[number]["link"]]}
        </span>
        {!addBtn && (
          <div>
            <button className="add_new" onClick={openModal}>
              {btnName ? btnName : t("Add new")}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
