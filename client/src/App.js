import logo from "./logo.svg";
import "./App.css";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import LoginPage from "./components/Pages/LoginPage";
import RegisterPage from "./components/Pages/RegisterPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { Protected } from "./routes/Protected";
// import DashboardDesign from "./components/Pages/DashboardDesign";
import Webphone from "./components/Pages/Webphone";
import Phonebook from "./components/Pages/Phonebook";
import Whatsapp from "./components/Pages/Whatsapp";
import Numbers from "./components/Admin/Numbers";
import ForgotPassword from "./components/Pages/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Extension from "./components/Admin/Extension";
import Groups from "./components/Admin/Groups";
import Conference from "./components/Admin/Conference";
import IVR from "./components/Admin/IVR";
import TimeCondition from "./components/Admin/TimeCondition";
import Call_recordings from "./components/Admin/Call_recordings";
import System_recordings from "./components/Admin/System_recordings";
import Reports from "./components/Admin/Reports";
import Customer from "./components/Admin/Customer";
import Invoice from "./components/Admin/Invoice";
// import PstnNumber from "./components/Admin/PstnNumber";
import { Chart } from "chart.js/auto";
import Truncks from "./components/Admin/Truncks";
import Outbound from "./components/Admin/Outbound";
import Firewall from "./components/Admin/Firewall";
import ChatScreen from "./components/Chat/ChatScreen";
import CallHistory from "./components/Pages/CallHistory";
import { Suspense, lazy, useEffect } from "react";
import Cookies from "js-cookie";
import Setting from "./components/Pages/Setting";
import WpScreen from "./components/Whatsapp/WpScreen";
import Calendar from "./components/Calendar/Calendar";
import Roles from "./components/Pages/Roles";
import { FacebookProvider } from "react-facebook";
import ForgotRedirect from "./components/Pages/ForgotRedirect";
import ChatWidget from "./components/Pages/ChatWidget";
import Smtp from "./components/Pages/Smtp";
import Integrations from "./components/Pages/Integrations";
// import VideoUpload from ;
import GoogleRedirect from "./components/Calendar/GoogleRedirect";
import CookiesPage from "./components/Pages/CookiesPage";
import TimeConditionOptions from "./components/Admin/TimeConditionOptions";

import { TRPCContextProvider } from "./contexts";

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
    "/timeConditionOptions",
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
    "/cookies",
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
    "/support",
    "/cookies",
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
    "/cookies",
  ],
};

const defaultRolePaths = {
  1: "/webphone",
  2: "/dashboard",
  3: "/customers",
  4: "/dashboard",
};

const DashboardPage = lazy(() => import("./components/Pages/Dashboard"));
const VideoUploadPage = lazy(() => import("./components/Pages/VideoUpload"));
const SupportPage = lazy(() => import("./components/Pages/Support"));
const PSTNNumbersPage = lazy(() =>
  import("./components/Admin/pages/PSTNNumbers")
);

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
  //   import("./components/Pages/DashboardDesign")
  // );

  return (
    <TRPCContextProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/forgotpasswordred" element={<ForgotRedirect />} />
        {Role && <Route path="/cookies" element={<CookiesPage />} />}

        {(Role == 2 || Role == 4) && (
          <>
            <Route
              path="/dashboard"
              element={
                <Protected>
                  <Suspense fallback={<></>}>
                    <DashboardPage />
                  </Suspense>
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
                  <Suspense fallback={<></>}>
                    <PSTNNumbersPage />
                  </Suspense>
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
                  <Suspense fallback={<></>}>
                    <VideoUploadPage />
                  </Suspense>
                </Protected>
              }
            />
            <Route
              path="/support"
              element={
                <Protected>
                  <Suspense fallback={<></>}>
                    <SupportPage />
                  </Suspense>
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
                  <Suspense fallback={<></>}>
                    <DashboardPage />
                  </Suspense>
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
    </TRPCContextProvider>
  );
}

export default App;
