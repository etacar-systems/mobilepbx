import logo from "./logo.svg";
import "./App.css";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import LoginPage from "./Components/Pages/LoginPage";
import RegisterPage from "./Components/Pages/RegisterPage";
import "bootstrap/dist/css/bootstrap.min.css";
import Protected from "./Components/Protected";
import DashboardDesign from "./Components/Pages/DashboardDesign";
import Webphone from "./Components/Pages/Webphone";
import Phonebook from "./Components/Pages/Phonebook";
import Whatsapp from "./Components/Pages/Whatsapp";
import Numbers from "./Components/Admin/Numbers";
import ForgotPassword from "./Components/Pages/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Extension from "./Components/Admin/Extension";
import Groups from "./Components/Admin/Groups";
import Conference from "./Components/Admin/Conference";
import IVR from "./Components/Admin/IVR";
import TimeCondition from "./Components/Admin/TimeCondition";
import Call_recordings from "./Components/Admin/Call_recordings";
import System_recordings from "./Components/Admin/System_recordings";
import Reports from "./Components/Admin/Reports";
import Customer from "./Components/Admin/Customer";
import Invoice from "./Components/Admin/Invoice";
import PstnNumber from "./Components/Admin/PstnNumber";
import { Chart } from "chart.js/auto";
import Truncks from "./Components/Admin/Truncks";
import Outbound from "./Components/Admin/Outbound";
import Firewall from "./Components/Admin/Firewall";
import ChatScreen from "./Components/Chat/ChatScreen";
import CallHistory from "./Components/Pages/CallHistory";
import { Suspense, lazy, useEffect } from "react";
import Cookies from "js-cookie";
import Setting from "./Components/Pages/Setting";
import WpScreen from "./Components/Whatsapp/WpScreen";
import Calendar from "./Components/Calendar/Calendar";
import Roles from "./Components/Pages/Roles";
import { FacebookProvider } from "react-facebook";
import ForgotRedirect from "./Components/Pages/ForgotRedirect";
import ChatWidget from "./Components/Pages/ChatWidget";
import Smtp from "./Components/Pages/Smtp";
import Integrations from "./Components/Pages/Integrations";
import VideoUpload from "./Components/Pages/VideoUpload";
import GoogleRedirect from "./Components/Calendar/GoogleRedirect";
import CookiesPage from "./Components/Pages/CookiesPage";
import TimeConditionOptions from "./Components/Admin/TimeConditionOptions";

const rolePaths = {
  1: [
    "/webphone",
    "/chat",
    "/phonebook",
    "/calendar",
    "/whatsapp",
    "/callhistory",
    "/whatsappChat",
    "/dashboard",
    "/setting",
    "/google/redirect",
    "/cookies",
    "/timeConditionOptions"
  ],
  2: [
    "/dashboard",
    "/number",
    "/extension",
    "/ring",
    "/conferences",
    "/ivr",
    "/time",
    "/call",
    "/system",
    "/reports",
    "/setting",
    "/integration",
    "/cookies"
  ],
  3: [
    "/customers",
    "/setting",
    "/invoices",
    "/pstn",
    "/trunk",
    "/outbound",
    "/firewall",
    "/smtp",
    "/video",
    "/cookies"
  ],
  4: [
    "/dashboard",
    "/number",
    "/extension",
    "/ring",
    "/conferences",
    "/ivr",
    "/time",
    "/call",
    "/system",
    "/reports",
    "/setting",
    "/integration",
    "/cookies"
  ],
};

const defaultRolePaths = {
  1: "/webphone",
  2: "/dashboard",
  3: "/customers",
  4: "/dashboard",
};

function App() {
  // console.log = console.warn = console.error = () => {};
  const navigate = useNavigate();
  const location = useLocation();
  const token = Cookies.get("Token");
  const Role = Cookies.get("role");
  const { id } = useParams();
  useEffect(() => {
    Cookies.remove("conversation_id");
  }, [location.pathname]);
  useEffect(() => {
    if (token && Role) {
      const currentPath = location.pathname;
      if (!rolePaths[Role].includes(currentPath)) {
        navigate(defaultRolePaths[Role]);
      }
    } else if (location.pathname === "/registerPage") {
      navigate("/registerPage");
    } else if (location.pathname === "/forgotpassword") {
      navigate("/forgotpassword");
    } else if (location.pathname.includes("/forgotpasswordred")) {
      // const dynamicId = id; // Replace with your actual dynamic id logic
      navigate(`/forgotpasswordred`);
    } else {
      navigate("/");
    }
  }, [token, Role, location.pathname]);

  // const DashboardDesign = lazy(() =>
  //   import("./Components/Pages/DashboardDesign")
  // );

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/forgotpasswordred" element={<ForgotRedirect />} />
        {Role && (
          <Route path="/cookies" element={<CookiesPage />} />
        )}

        {(Role == 2 || Role == 4) && (
          <>
            <Route
              path="/dashboard"
              element={
                <Protected>
                  <DashboardDesign />
                </Protected>
              }
            />
            <Route
              path="/number"
              element={
                <Protected>
                  <Numbers />
                </Protected>
              }
            />

            <Route
              path="/extension"
              element={
                <Protected>
                  <Extension />
                </Protected>
              }
            />
            <Route
              path="/ring"
              element={
                <Protected>
                  <Groups />
                </Protected>
              }
            />
            <Route
              path="/conferences"
              element={
                <Protected>
                  <Conference />
                </Protected>
              }
            />
            <Route
              path="/ivr"
              element={
                <Protected>
                  <IVR />
                </Protected>
              }
            />
            <Route
              path="/time"
              element={
                <Protected>
                  <TimeCondition />
                </Protected>
              }
            />
            <Route
              path="/call"
              element={
                <Protected>
                  <Call_recordings />
                </Protected>
              }
            />
            <Route
              path="/system"
              element={
                <Protected>
                  <System_recordings />
                </Protected>
              }
            />
            <Route
              path="/reports"
              element={
                <Protected>
                  <Reports />
                </Protected>
              }
            />
            <Route
              path="/integration"
              element={
                <Protected>
                  <Integrations />
                </Protected>
              }
            />
          </>
        )}

        {Role == 3 && (
          <>
            <Route
              path="/customers"
              element={
                <Protected>
                  <Customer />
                </Protected>
              }
            />
            <Route
              path="/invoices"
              element={
                <Protected>
                  <Invoice />
                </Protected>
              }
            />
            <Route
              path="/pstn"
              element={
                <Protected>
                  <PstnNumber />
                </Protected>
              }
            />
            <Route
              path="/trunk"
              element={
                <Protected>
                  <Truncks />
                </Protected>
              }
            />
            <Route
              path="/outbound"
              element={
                <Protected>
                  <Outbound />
                </Protected>
              }
            />
            <Route
              path="/firewall"
              element={
                <Protected>
                  <Firewall />
                </Protected>
              }
            />
            <Route
              path="/smtp"
              element={
                <Protected>
                  <Smtp />
                </Protected>
              }
            />
               <Route
              path="/video"
              element={
                <Protected>
                  <VideoUpload />
                </Protected>
              }
            />
          </>
        )}
        {Role == 1 && (
          <>
            <Route
              path="/webphone"
              element={
                <Protected>
                  <Webphone />
                </Protected>
              }
            />
            <Route
              path="/timeConditionOptions"
              element={
                <Protected>
                  <TimeConditionOptions />
                </Protected>
              }
            />
            <Route
              path="/chat"
              element={
                <Protected>
                  <ChatScreen />
                </Protected>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Protected>
                  <DashboardDesign />
                </Protected>
              }
            />
            <Route
              path="/phonebook"
              element={
                <Protected>
                  <Phonebook />
                </Protected>
              }
            />
            <Route
              path="/calendar"
              element={
                <Protected>
                  <Calendar />
                </Protected>
              }
            />
            <Route
              path="/whatsapp"
              element={
                <Protected>
                  <Whatsapp />
                </Protected>
              }
            />
            <Route
              path="/callhistory"
              element={
                <Protected>
                  <CallHistory />
                </Protected>
              }
            />
            <Route
              path="/whatsappChat"
              element={
                <Protected>
                  <WpScreen />
                </Protected>
              }
            />
          </>
        )}

        <Route
          path="/role"
          element={
            <Protected>
              <Roles />
            </Protected>
          }
        />
        <Route path="/google/redirect" element={<GoogleRedirect />} />

        <Route
          path="/setting"
          element={
            <Protected>
              <Setting />
            </Protected>
          }
        />
        <Route
          path="/test"
          element={
            <Protected>
              <Whatsapp />
            </Protected>
          }
        />
      </Routes>
    </>
  );
}

export default App;
