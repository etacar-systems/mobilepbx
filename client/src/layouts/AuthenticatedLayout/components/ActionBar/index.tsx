import { forwardRef } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

import { ActionMenu } from "./actions/ActionMenu";

import classNames from "./actionBar.module.scss";

import defaultProfileIcon from "../../../../Assets/Icon/profile_default.svg";

interface IActionBarProps {
  localurl: string;
  fileBaseUrl?: string;
  profile_url?: string;
  role: 1 | 2 | 3 | 4;
  // ref?: LegacyRef<HTMLDivElement>
}

export const ActionBar = forwardRef<HTMLDivElement, IActionBarProps>(
  (
    {
      localurl,
      fileBaseUrl,
      profile_url,
      role,
    }: // ref
    IActionBarProps,
    ref
  ) => {
    const { t } = useTranslation();

    // TODO: REMOVE
    const firstname = Cookies.get("firstname");
    const lastname = Cookies.get("lastname");
    const company_name = Cookies.get("company_name");

    return (
      <div ref={ref} className="user-full d-flex align-items-center mt-3 ">
        <img
          src={
            localurl || profile_url
              ? `${fileBaseUrl}${localurl || profile_url}`
              : (defaultProfileIcon as unknown as string)
          }
          alt="profile"
          width={40}
          height={40}
          className="rounded"
        />

        <div className="ms-3">
          <h5 className="m-0 welcome">{t("Welcome,")}</h5>

          <Dropdown
            className="custome-dropdown "
            style={{
              // border: "none",
              borderRadius: "10px",
              marginTop: "-2px",
            }}
          >
            <Dropdown.Toggle variant="default" className={classNames.toggle}>
              <div
                style={{
                  // whiteSpace: "nowrap",
                  // overflow: "hidden",
                  // textOverflow: "ellipsis",
                  // maxWidth: "130px",
                  display: "inline-block",
                  verticalAlign: "middle",
                  color: "var(--main-adminheaderpage-color)",
                }}
              >
                {(company_name !== "undefined" && role === 2) || role === 4 ? (
                  company_name
                ) : (
                  <>
                    <span style={{ marginRight: "4px" }}>{firstname}</span>
                    <span>{lastname}</span>
                  </>
                )}
              </div>
            </Dropdown.Toggle>
            <ActionMenu />
          </Dropdown>
        </div>
      </div>
    );
  }
);
