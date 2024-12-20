import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGOURI || "";
const PORT = process.env.PORT;
const DB_NAME = process.env.DBNAME;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
const PBX_API_USERNAME = "apiuser";
const PBX_API_PASSWORD = "d6kVImEEV1A34B2fjduZpxxFAf4";
//const PBX_BASE_URL = "https://voip.mobiililinja.fi/webapi/core/";
const PBX_BASE_URL = "https://mobilepbx.mobiililinja.fi/webapi/core/";
const MariaDB_hostName = "70.34.216.11";
const MariaDB_password = "pbx#123";
const MariaDB_database = "opensips";
export const config = {
  mariaDB: {
    host: MariaDB_hostName,
    password: MariaDB_password,
    database: MariaDB_database,
  },
  mongo: {
    uri: MONGO_URI,
  },
  db: {
    dbname: DB_NAME,
  },
  server: {
    port: PORT,
  },
  key: {
    secret_key: JWT_SECRET_KEY,
  },
  RESPONSE: {
    STATUS_CODE: {
      SUCCESS: 200,
      INTERNAL_SERVER: 500,
      INVALID_FIELD: 400,
      COMPANY_NOT_EXIST: 402,
    },
    MESSAGE: {
      INTERNAL_SERVER: "Internal server error",
      COMPANY_ERROR: "company not found",
    },
    ERROR: {
      WEBTOKEN: "JsonWebTokenError",
      EXPIRETOKEN: "TokenExpiredError",
    },
  },

  PBX_API: {
    AUTH: {
      username: PBX_API_USERNAME,
      password: PBX_API_PASSWORD,
    },
    DROPDOWN: {
      RING_BACK: PBX_BASE_URL + "dropdown/ringback_dropdown.php?id=",
      GET: PBX_BASE_URL + "dropdown/index.php",
      SOUND: PBX_BASE_URL + "dropdown/ivr_sound_dropdown.php?id=",
    },
    RING_GROUP: {
      ADD: PBX_BASE_URL + "ringgroup/create.php",
      REMOVE: PBX_BASE_URL + "ringgroup/delete.php?id=",
      LIST: PBX_BASE_URL + "ringgroup/fetch_ringgroup_by_domain.php?id=",
      UPDATE: PBX_BASE_URL + "ringgroup/update.php",
    },
    IVR: {
      ADD: PBX_BASE_URL + "ivr/create.php",
      REMOVE: PBX_BASE_URL + "ivr/delete.php?id=",
      LIST: PBX_BASE_URL + "ivr/fetch_ivr_by_domain.php?id=",
      UPDATE: PBX_BASE_URL + "ivr/update.php",
    },
    EXTENSION: {
      ADD: PBX_BASE_URL + "extension/create.php",
      UPDATE: PBX_BASE_URL + "extension/update.php",
      DELETE: PBX_BASE_URL + "extension/delete.php",
      GET_BY_ID: PBX_BASE_URL + "extension/fetch_extension_by_id.php?id=",
    },
    TIME_CONDITION: {
      ADD: PBX_BASE_URL + "timeconditions/create.php",
      UPDATE: PBX_BASE_URL + "timeconditions/update.php",
      DELETE: PBX_BASE_URL + "timeconditions/delete.php?id=",
      LIST: PBX_BASE_URL + "timeconditions/fetch_timecondition_by_domain.php?id=",
    },
    CONFERENCE: {
      ADD: PBX_BASE_URL + "conference/create.php",
      REMOVE: PBX_BASE_URL + "conference/delete.php?id=",
      UPDATE: PBX_BASE_URL + "conference/update.php",
      PROFILE: PBX_BASE_URL + "conference/fetch_conference_profile.php",
    },
    COMPANY: {
      ADD: PBX_BASE_URL + "domain/create.php",
      REMOVE: PBX_BASE_URL + "domain/delete.php?id=",
      UPDATE: PBX_BASE_URL + "domain/update.php",
    },
    PSTN: {
      ADD: PBX_BASE_URL + "destination/create.php",
      UPDATE: PBX_BASE_URL + "destination/update.php",
      BULK_ADD: PBX_BASE_URL + "destination/import.php",
      REMOVE: PBX_BASE_URL + "destination/delete.php?id=",
    },
    TRUNKS: {
      ADD: PBX_BASE_URL + "gateway/create.php",
      REMOVE: PBX_BASE_URL + "gateway/delete.php?id=",
      UPDATE: PBX_BASE_URL + "gateway/update.php",
    },
    OUTBOUND_ROUTE: {
      ADD: PBX_BASE_URL + "dialplan_outbound/create.php",
      UPDATE: PBX_BASE_URL + "dialplan_outbound/update.php",
      REMOVE: PBX_BASE_URL + "dialplan_outbound/delete.php?id=",
      DIALPLAN:
        PBX_BASE_URL + "dropdown/dialplan_expression.php?id=2348f0bd-fa6f-4f93-b3d0-bbb8bf80cbb8",
    },
    FIREWALL: {
      ADD: PBX_BASE_URL + "firewall/create.php",
      REMOVE: PBX_BASE_URL + "firewall/delete.php?id=",
      UPDATE: PBX_BASE_URL + "firewall/update.php",
    },
    CDR: {
      GET_BY_EXTENSION: PBX_BASE_URL + "cdr/fetch_by_extension_uuid.php?id=",
      GET_BY_DOMAIN: PBX_BASE_URL + "cdr/fetch_by_domain.php?id=",
      GET_BY_EXTENSION_NUMBER: PBX_BASE_URL + "cdr/fetch_by_extension.php?id=",
    },
    RECORDING: {
      GET: PBX_BASE_URL + "cdr/fetch_by_recordings.php?id=",
      GET_uuid: PBX_BASE_URL + "recording/fetch_recording_by_id.php?id=",
    },
    DASHBOARD: {
      GET_REPORTS: PBX_BASE_URL + "report/index.php",
      GET_CALL_MATRICS: PBX_BASE_URL + "report/call_matrics.php",
      GET_MISSED_CALL: PBX_BASE_URL + "report/missed_call.php",
      GET_RINGGROUP_CALL: PBX_BASE_URL + "report/ring_group.php",
    },
  },
  SELECT_NAME: {
    IVR: 1,
    RINGGROUP: 2,
    EXTENSION: 3,
    RECORDING: 5,
    CONFERENCE: 4,
    TIMECONDTION: 6,
  },
};
