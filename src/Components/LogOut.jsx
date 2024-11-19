import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";

const LogoutModal = ({ countdown }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "var(--main-logout-color)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "500px",
        textAlign: "center",
      }}
    >
      <h2>You don't have access to this account.</h2>
      <p>Please contact your company Admin to continue using this account.</p>
      <p>In {countdown} seconds, your account will be logged out...</p>
    </div>
  </div>
);

const LogoutComponent = ({ onLogout }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    const logoutTimer = setTimeout(() => {
      onLogout();
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(logoutTimer);
    };
  }, [onLogout]);

  return ReactDOM.createPortal(
    <LogoutModal countdown={countdown} />,
    document.body
  );
};

export const performLogout = () => {
  const handleLogout = () => {
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
    Cookies.remove("profile_url");
    window.location.href = "/";
  };

  ReactDOM.render(<LogoutComponent onLogout={handleLogout} />, document.body);
};
