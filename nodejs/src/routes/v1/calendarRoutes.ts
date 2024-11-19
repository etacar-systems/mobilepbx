// src/routes/v1/calendarRoutes.ts
import { Router } from "express";
import CalendarController from "../../controllers/v1/calendarController";

export const Calendar = Router();

//Route to initiate Google OAuth process
Calendar.put("/config", CalendarController.ConfigCalanderDetail);
Calendar.put("/config/refresh/token/redirct", CalendarController.GetUserRefrestTokenCalander);
Calendar.put("/config/refresh/token/update", CalendarController.UpdateRefrestTokenCalander);
Calendar.get("/event", CalendarController.GetAllEventCalendar);
Calendar.get("/config/detail", CalendarController.GetCalendarConfigDetail);

// Route to handle Google OAuth callback and fetch events
//Calendar.get("/events", CalendarController.handleOAuthCallback);

// Calendar.get("/auth", CalendarController.getAuthUrlHandler);

// // Route to handle Google OAuth callback and fetch events
// Calendar.get("/events", CalendarController.handleOAuthCallback);