import { useCallback, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import ConfirmationModal from "../../../../../components/Chat/ConfirmationModal";
import { settheme } from "../../../../../Redux/Reducers/DataServices";

import { ReactComponent as SettingIcon } from "../../../../../Assets/Image/setting.svg";
import { ReactComponent as PowerOffIcon } from "../../../../../Assets/Icon/logout.svg";
import { ReactComponent as ThemeVersionIcon } from "../../../../../Assets/Icon/dark-theme.svg";

export const ActionMenu = () => {
  const { t } = useTranslation();
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // @ts-ignore
  const theme: "light" | "Dark" = useSelector((state) => state?.Theme?.Theme);

  const onThemeChange = useCallback(() => {
    const newThemeName = theme === "light" ? "Dark" : "light";
    document.querySelector("body")?.setAttribute("data-theme", newThemeName);
    Cookies.set("Theme", newThemeName);
    dispatch(settheme(newThemeName));
  }, [theme, dispatch]);

  const logout = () => {
    setConfirmationModal(true);
  };

  useEffect(() => {
    document.querySelector("body")?.setAttribute("data-theme", theme);
  }, []);

  const Logout = () => {
    Cookies.remove("Token");
    Cookies.remove("Company_Id");
    Cookies.remove("RefreshToken");
    Cookies.remove("User_id");
    Cookies.remove("user_email");
    Cookies.remove("username");
    Cookies.remove("Sip_number");
    Cookies.remove("company_name");
    Cookies.remove("conversation_id");
    Cookies.remove("domain_name");
    Cookies.remove("domain_uuid");
    Cookies.remove("firstname");
    Cookies.remove("lastname");
    Cookies.remove("role");
    Cookies.remove("sip_password");
    Cookies.remove("sip_username");
    Cookies.remove("company_features");
    Cookies.remove("user_extension");
    navigate("/");
    window.location.reload();
  };


  const handleChangesetting = () => {
    navigate("/setting");
  };

  const config = [
    {
      label: () => t("Settings"),
      Icon: SettingIcon,
      onClick: handleChangesetting
    },
    {
      label: (theme: 'light' | 'Dark') => t(theme === "light" ? "Dark Version" : "Light Version"),
      Icon: ThemeVersionIcon,
      onClick: onThemeChange,
    },
    {
      label: () => t("Logout"),
      Icon: PowerOffIcon,
      onClick: logout
    }
  ]

  return (
    <>
      <Dropdown.Menu
        className="bttt"
        style={{
          border: "none !important",
          borderRadius: "10px",
          boxShadow: "var(--main-boxshadowdropdown-color) 0px 2px 20px 0px",
        }}
      >
        {config.map((action) => (
          <Dropdown.Item
          className="d-flex align-items-center  setting_tag user-link-logout"
          onClick={action.onClick}
        >
          <div className="setting_tag">
            <action.Icon
              width={16}
              height={16}
            />
            <p className="m-0 ms-2">{action.label(theme)}</p>
          </div>
        </Dropdown.Item>
        ))}
      </Dropdown.Menu>
      {confirmationModal === true && (
        <ConfirmationModal
          title={t("Logout")}
          body={t("Are you sure you want to Logout?")}
          button1={t("Logout")}
          button2={t("Cancel")}
          cancelcss={true}
          confirmationModal={confirmationModal}
          setConfirmationModal={setConfirmationModal}
          button1function={Logout}
          button2function={setConfirmationModal}
        />
      )}
    </>
  );
};
