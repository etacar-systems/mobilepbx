import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction"; // For drag-and-drop functionality
import AdminHeader from "../Admin/AdminHeader";
import CalendarModal from "./CalendarModal";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { Fi } from "../ConstantConfig";
import {
  getapiAll,
  postapiAll,
  putapiall,
} from "../../Redux/Reducers/ApiServices";
import { useDispatch } from "react-redux";
import config from "../../config";
import { toast } from "react-toastify";
import AuthModal from "./AuthModal";
export default function Calendar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let Token = Cookies.get("Token");
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Auto_Refresh: "",
    Remote_Url: "",
    Client_id: "",
    Client_secret: "",
    // Name2: "",
    // Description2: "",
    // Email: "",
    // Username: "",
    // Password: "",
    // EWS_Server_URL: "",
    // EWS_Version: "",
    // Auto_Refresh2: "",
    // Principal_URL: "",
    // Auto_Refresh3: "",
    // Name3: "",
    // Description3: "",
    // Username2: "",
    // Password2: "",
  });
  const [startDate, setStartDate] = useState(
    new Date(new Date().setHours(5, 50, 0, 0)).toISOString()
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(23, 59, 0, 0)).toISOString()
  );
  const formatDateToISOString = (date) => {
    return new Date(date).toISOString().split(".")[0] + ".000Z";
  };
  const handleDateChange = (dateInfo) => {
    const { startStr, endStr, view } = dateInfo;
    setStartDate(formatDateToISOString(startStr));
    setEndDate(formatDateToISOString(endStr));
    setCurrentView(view.type);
  };
  const [header, setHeader] = useState("");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [authmodal, setAuthmodal] = useState(false);
  console.log(authmodal, "authmodalcheck");
  const [currentView, setCurrentView] = useState("dayGridMonth"); // State to track current view
  const events = [
    { id: "1", title: "Team Meeting", start: "2024-07-22", color: "#17c2d7" },
    { id: "2", title: "Client Meeting", start: "2024-07-23", color: "#9367b4" },
    {
      id: "3",
      title: "Project Deadline",
      start: "2024-07-30",
      color: "#e15858",
    },
    { id: "4", title: "Team Outing", start: "2024-07-05", color: "#56b65f" },
    { id: "5", title: "Lunch", start: "2024-07-16", color: "#17c2d7" },
    { id: "6", title: "Dinner", start: "2024-07-20", color: "#9367b4" },
    { id: "7", title: "Meeting", start: "2024-07-04", color: "#e15858" },
    { id: "8", title: "Team Outing", start: "2024-07-25", color: "#56b65f" },
  ];

  useEffect(() => {
    dispatch(
      getapiAll({
        Api: `${config.CALENDAR.GET}?start_date=${startDate}&end_date=${endDate}`,
        Token: Token,
        urlof: config.CALENDAR_KEY.GET,
      })
    ).then((response) => {
      console.log(response, "responsecheck");
      const transformedEvents =
        response?.payload?.response?.CalanderEventList?.map((event) => ({
          id: event.id,
          title: event.summary,
          start: event.start.dateTime,
          end: event.end.dateTime,
          color: "#e15858", // Set a default color or map from another property
        }));
      console.log(transformedEvents, "transformedEventscheck");
      setCalendarEvents(transformedEvents);
    });
  }, [startDate, endDate, dispatch, currentView]);

  useEffect(() => {
    const enableTodayButton = () => {
      const todayButton = document.querySelector(".fc-today-button");
      if (todayButton) {
        todayButton.classList.remove("fc-button-disabled");
        todayButton.disabled = false;
      }
    };
    enableTodayButton();
    document.addEventListener("click", enableTodayButton);

    return () => {
      document.removeEventListener("click", enableTodayButton);
    };
  }, []);

  useEffect(() => {
    const handleFocus = (event) => {
      const button = event.target;
      button.classList.add("focused");
      setTimeout(() => {
        button.classList.remove("focused");
        button.blur();
      }, 300);
    };

    const buttons = document.querySelectorAll(".fc-button-primary");

    buttons.forEach((button) => {
      button.addEventListener("focus", handleFocus);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("focus", handleFocus);
      });
    };
  }, []);

  const openModal = () => {
    setShow(true);
    setHeader(t("Calendar Configuration"));
  };

  const editModal = () => {
    setShow(true);
    setHeader(t("Edit calendar details"));
  };

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    const stylee = document.createElement("style");

    const cssRules = calendarEvents
      ?.map(
        (event) => `
        .fc-event-${event.id} {
          background-color: ${event.color} !important;
        }
      `
      )
      .join("\n");

    stylee.innerHTML = cssRules;
    document.head.appendChild(stylee);

    return () => {
      document.head.removeChild(stylee);
    };
  }, [calendarEvents]);

  const handleEventClick = () => {
    // editModal();
  };
  const language = Cookies.get("language");
  const handlesavedata = () => {
    const listvalues = {
      client_id: formData.Client_id,
      client_secret: formData.Client_secret,
      redirect_uri: formData.Remote_Url,
      name: formData.Name,
      description: formData.Description,
      auto_refresh: formData.Auto_Refresh,
    };
    const data = listvalues;
    dispatch(
      putapiall({
        inputData: data,
        Api: config.CALENDAR.PUT,
        Token: Token,
        urlof: config.CALENDAR_KEY.PUT,
      })
    ).then((res) => {
      if (res?.payload?.response) {
        console.log(res, "checkresponse");
        Cookies.set("Verifyurl", res?.payload?.response?.authUrl);
        setAuthmodal(res?.payload?.response?.authUrl);
        handleClose();
        setFormData("");
        toast.success(t(res.payload.response.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      } else {
        if (res?.payload?.error) {
          toast.error(t(res.payload.error.response.data.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        }
      }
    });
  };
  const Onclose = () => {
    setAuthmodal(false);
  };
  return (
    <div>
      {currentView === "listWeek" && (
        <style>
          {`
            .fc-list-event-dot {
              border-color: #3a87ad !important;
            }
            .fc .fc-view-harness{
              height: auto !important;
            }
            .fc .fc-view-harness-active > .fc-view{
              position: inherit !important;
              inset: 0px !important;
            }
          `}
        </style>
      )}

      <AdminHeader
        openModal={openModal}
        pathname={t("Calendar")}
        addBtn={false}
        btnName={"Calendar Configuration"}
      />
      <FullCalendar
        locale={language === Fi ? Fi : ""}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "title",
          center: "",
          end: "today,dayGridMonth,timeGridWeek,prev,next",
        }}
        buttonText={{
          today: t("Today"),
          month: t("Month"),
          week: t("Week"),
        }}
        noEventsText={t("No events to display")}
        views={{
          listWeek: {
            duration: { weeks: 1 },
          },
          timeGridWeek: {
            eventContent: renderEventContent,
          },
          dayGridMonth: {
            eventClick: handleEventClick,
          },
        }}
        events={calendarEvents?.map((event) => ({
          ...event,
          className: `fc-event-${event.id}`,
        }))}
        editable={true}
        droppable={true}
        eventResizableFromStart={true}
        datesSet={handleDateChange}
        firstDay={1}
      />

      {show && (
        <CalendarModal
          handleClose={handleClose}
          show={show}
          header={header}
          formData={formData}
          setFormData={setFormData}
          handlesavedata={handlesavedata}
        />
      )}
      {authmodal && <AuthModal show={authmodal} onClose={Onclose} />}
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div
      style={{
        backgroundColor: eventInfo.event.backgroundColor,
      }}
      className="event-container"
    >
      <div
        style={{
          color: "white",
          height: "10px",
        }}
      >
        {eventInfo.event.title}
      </div>
      <div className="hover-effect">=</div>
    </div>
  );
}
