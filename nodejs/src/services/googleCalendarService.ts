// src/services/googleCalendarService.ts
import { google } from "googleapis";

const CLIENT_ID =
  "13890205139-oqvonrj9a4qds9r1k2299h8tvrcqi2tt.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:8000/google/redirect";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
};

export const getAccessToken = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

export const listEvents = async () => {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const response = await calendar.events.list({
    calendarId: "primary",
    maxResults: 10,
    orderBy: "startTime",
    singleEvents: true,
    timeMin: new Date().toISOString(),
  });
  return response.data.items;
};
