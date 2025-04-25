import React, { MouseEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChangeHandler } from "react-hook-form";

import { ReactComponent as ArrowIcon } from "../../../Assets/Icon/Dropdownicon.svg";

interface ICustomDropDownProps<
  T extends { [key: string]: any } = { [key: string]: any }
> {
  name?: string;
  options?: Array<T>;
  valueKey: keyof T;
  labelKey: keyof T;
  value?: string | number;
  disabled?: boolean;
  placeHolder?: string;
  sort?: boolean;
  onChange?: any;
}

export const DropDown = ({
  options,
  sort,
  valueKey,
  labelKey,
  name,
  value,
  disabled,
  placeHolder,
  onChange: onChangeExternal,
}: ICustomDropDownProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const onClick = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    document.addEventListener("click", () => setOpen(false));
    return () => {
      document.removeEventListener("click", () => setOpen(false));
    };
  }, []);

  const onChangeFabric = useCallback(
    (item: { [key: string]: any }) => {
      return () => {
        onChangeExternal &&
          onChangeExternal({
            target: {
              name,
              value: item[valueKey],
            },
          });
      };
    },
    [onChangeExternal, name, valueKey]
  );

  return (
    <div>
      <div
        className="Selfmade-dropdown "
        // style={{
        // width: "100%",
        // backgroundColor: mode === "edit" ? "var(--main-input-disabled)" : "",
        // }}
      >
        <div
          className="Selfmadedropdown-btn "
          onClick={disabled ? undefined : onClick}
          // style={{
          // background: bgcolor,
          // width: fullWidth ? undefined : "100px",
          // }}
        >
          <div className="elipsisDrodownshow">
            {(options?.find((val) => val[valueKey] === value) || {})[
              labelKey
            ] || placeHolder || ""}
          </div>
          <div>
            <ArrowIcon />
          </div>
        </div>
        {isOpen ? (
          <ul className="Selfmadedropdown-content">
            {options && options.length > 0 ? (
              (!sort ? options : options?.sort()).map((item, index) => {
                return (
                  <li
                    key={item[valueKey]}
                    className="elipsisDrodownshow"
                    onClick={onChangeFabric(item)}
                  >
                    {item[labelKey]}
                  </li>
                );
              })
            ) : (
              <div>{t("No Record")}</div>
            )}
          </ul>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
