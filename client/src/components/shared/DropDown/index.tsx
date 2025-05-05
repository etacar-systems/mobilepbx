import React, { MouseEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./dropDown.module.scss";

import { ReactComponent as ArrowIcon } from "../../../Assets/Icon/Dropdownicon.svg";

export interface ISyntheticEvent { target: { value: any; name?: string } };

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
  onChange?: (e: ISyntheticEvent) => void;
  translateLabels?: boolean;
  style?: any;
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
  translateLabels,
  style,
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
    <div style={style}>
      <div className="Selfmade-dropdown ">
        <div
          className="Selfmadedropdown-btn "
          onClick={disabled ? undefined : onClick}
        >
          <div className="elipsisDrodownshow">
            {(translateLabels
              ? t(
                  (options?.find((val) => val[valueKey] === value) || {})[
                    labelKey
                  ]
                )
              : (options?.find((val) => val[valueKey] === value) || {})[
                  labelKey
                ]) ||
              placeHolder ||
              ""}
          </div>
          <div>
            <ArrowIcon />
          </div>
        </div>
        {isOpen ? (
          <ul
            className={["Selfmadedropdown-content", styles.wrapper].join(" ")}
          >
            {options && options.length > 0 ? (
              (!sort ? options : options?.sort()).map((item, index) => {
                return (
                  <li
                    key={item[valueKey]}
                    className="elipsisDrodownshow"
                    onClick={onChangeFabric(item)}
                  >
                    {translateLabels ? t(item[labelKey]) : item[labelKey]}
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
