import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../Loader";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { putapiall } from "../../Redux/Reducers/ApiServices";
import config from "../../config";

const GoogleRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const Token = Cookies.get("Token");
  const [loader, setLoader] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  
  Cookies.set("Codestore", code);
  const scope = queryParams.get("scope");

  useEffect(() => {
    // Ensure code and Token are defined before dispatch
    if (code && Token) {
      setLoader(true);
      const data = {
        refresh_token: code,
      };
      console.log(code,Token,data,"allcheck")
      dispatch(
        putapiall({
          inputData: data,
          Api: config.CALENDAR.PUT1,
          Token: Token,
          urlof: config.CALENDAR_KEY.PUT1,
        })
      )
        .then((res) => {
          setLoader(false);
          const data = res?.payload?.response?.CalanderDetail;
          console.log(data, "Received data from Google Calendar API");
          navigate("/calendar")
        })
        .catch((error) => {
          setLoader(false);
          console.error("Error in Google Calendar API call:", error);
        });
    }
  }, [code, Token, dispatch]); // Add dependencies

  return (
    <div className="google-redirect-container">
      {loader && <Loader />}
      <h2 className="google-redirect-text">
        Connecting with Google Calendar...
      </h2>
    </div>
  );
};

export default GoogleRedirect;
