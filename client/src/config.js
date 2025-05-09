export const BASE_URL = process.env.REACT_APP_MOBIILILINJA_BASE_URL;
const config = {
  TOST_AUTO_CLOSE: 2000,
  RESET_PASSWORD: BASE_URL + "/reset/reset_password",
  UPDATE_PASSWORD: BASE_URL + "/reset/update_password",
  AUDIO: {
    MP3: "mp3",
    WAV: "wav",
  },
  RING_GROUP: {
    LIST: BASE_URL + "/ringgroup/list",
  },
  RING_GROUP_KEY: {
    ADD: "ringgroup_add",
    UPDATE: "ringgroup_edit",
    DELETE: "ringgroup_delete",
    LIST: "ringgroup_list",
    DETAIL: "ringgroup_detail",
    EXTENSION: "extension_list",
  },
  FIREWALL: {
    ADD: BASE_URL + "/firewall/add",
    UPDATE: BASE_URL + "/firewall/update",
    DELETE: BASE_URL + "/firewall/delete",
    LIST: BASE_URL + "/firewall/list",
    DETAIL: BASE_URL + "/firewall/detail",
    // ADD_PHP :"https://70.34.205.87/webapi/core/firewall/create.php"
  },
  FIREWALL_KEY: {
    ADD: "firewall_add",
    UPDATE: "firewall_update",
    DELETE: "firewall_delete",
    LIST: "firewall_list",
    DETAIL: "firewall_detail",
  },
  OUTBOUND: {
    ADD: BASE_URL + "/outbound/add",
    UPDATE: BASE_URL + "/outbound/edit",
    DELETE: BASE_URL + "/outbound/delete",
    LIST: BASE_URL + "/outbound/list",
    DETAIL: BASE_URL + "/outbound/detail",
    PATTERN: BASE_URL + "/outbound/dialplan",
  },
  OUTBOUND_KEY: {
    ADD: "outbound_add",
    UPDATE: "outbound_edit",
    DELETE: "outbound_delete",
    LIST: "outbound_list",
    DETAIL: "outbound_detail",
    PATTERN: "match_pattern",
  },
  PSTN_NUMBER: {
    ADD: BASE_URL + "/pstn/add",
    DELETE: BASE_URL + "/pstn/delete",
    DETAIL: BASE_URL + "/pstn/detail",
    // EDIT: BASE_URL + "/pstn/edit",
    LIST: BASE_URL + "/pstn/list",
    EXTENSION_LIST: BASE_URL + "/pstn/unassigned/list",
  },
  COMPANYWISE_PSTNLIST: BASE_URL + "/pstn/companywise_pstn",
  COMPANYWISE_KEY: "companiwise_pstn",

  PSTN_NUMBER_KEY: {
    ADD: "pstn_add",
    DELETE: "pstn_delete",
    LIST: "pstn_list",
    EXTENSION_LIST: "pstn_unassigned_list",
    EDIT: "pstn_edit",
    DETAIL: "pstn_detail",
  },
  //   const trunklistapi = "https://ui.mobiililinja.fi/v1/trunk/namelist";

  TRUNK: {
    ADD: BASE_URL + "/trunk/add",
    UPDATE: BASE_URL + "/trunk/edit",
    DELETE: BASE_URL + "/trunk/delete",
    LIST: BASE_URL + "/trunk/list",
    DETAIL: BASE_URL + "/trunk/detail",
    NAME_LIST: BASE_URL + "/trunk/namelist",
  },
  TRUNK_KEY: {
    ADD: "trunk_add",
    UPDATE: "trunk_edit",
    DELETE: "trunk_delete",
    LIST: "trunk_list",
    DETAIL: "trunk_detail",
    NAME_LIST: "trunk_namelist",
  },
  EXTENSION: {
    ADD: BASE_URL + "/user/add",
    UPDATE: BASE_URL + "/user/edit",
    DELETE: BASE_URL + "/user/delete",
    LIST: BASE_URL + "/user/company_users",
    VALUE: BASE_URL + "/user/user",
  },
  EXTENSION_KEY: {
    ADD: "user_add",
    UPDATE: "user_edit",
    DELETE: "user_delete",
    LIST: "user_company_users",
    VALUE: "Trunksvalues",
    OPTIONS: "Trunksvalues",
  },
  COMPANY_LIST: BASE_URL + "/company/namelist",
  COMPANY_LIST_KEY: "company_list",
  CRDLOG: BASE_URL + "/cdr_logs",
  CRDLOG_KEY: "cdr_logs",
  PHONEBOOK: {
    ADD: BASE_URL + "/phonebook/add",
    UPDATE: BASE_URL + "/phonebook/edit",
    DELETE: BASE_URL + "/phonebook/delete",
    DETAIL: BASE_URL + "/phonebook/detail",
    LIST: BASE_URL + "/phonebook/list",
  },
  PHONEBOOK_KEY: {
    ADD: "phonebook_add",
    UPDATE: "phonebook_edit",
    DELETE: "phonebook_delete",
    DETAIL: "phonebook_detail",
    LIST: "phonebook_list",
  },
  //   const compalistapi = `https://ui.mobiililinja.fi/v1/company/user/list`;
  COMPANY_USER_LIST: BASE_URL + "/company/user/list",
  COMPANY_USER_LIST_KEY: "company_user_list",
  COMPANY_USER_DETAIL_LIST: BASE_URL + "/company/detail",
  COMPANY_USER_DETAIL_LIST_KEY: "company_detail_list",
  COMPANY_USER_EDIT: BASE_URL + "/company/edit",
  COMPANY_USER_EDIT_KEY: "company_edit",
  REPORTS_DROPDOWN: BASE_URL + "/pstn/dropdown/call/reports",
  REPORTS_KEY: "Reportsdropdown",
  DROPDOWN: {
    URL: {
      RING: BASE_URL + "/pbx_api/ring_dropdown",
      ALL_GET: BASE_URL + "/pbx_api/dropdown",
      SOUND: BASE_URL + "/pbx_api/sound_dropdown",
    },
    KEY: {
      RING: "dropdown_ring",
      ALL_GET: "dropdown_all",
      SOUND: "dropdown_sound",
    },
  },
  TIME_CONDITION: {
    ADD: BASE_URL + "/time_condition/add",
    UPDATE: BASE_URL + "/time_condition/edit",
    DELETE: BASE_URL + "/time_condition/delete",
    DETAIL: BASE_URL + "/time_condition/details",
    LIST: BASE_URL + "/time_condition/list",
    OPTIONS: BASE_URL + "/time_condition/options",
  },
  TIME_CONDITION_KEY: {
    ADD: "time_condition_add",
    UPDATE: "time_condition_edit",
    DELETE: "time_condition_delete",
    DETAIL: "time_condition_detail",
    LIST: "time_condition_list",
    OPTIONS: "time_condition_options",
  },
  DROPDOWNAllSHOW: BASE_URL + "/pbx_api/dropdown",
  NUMBERSDROPDOWN: BASE_URL + "/pstn/dropdown",
  NUMBERSDROPDOWNKEY: "numbersdropdown",
  EXTENSIONUSERLIST: BASE_URL + "/user/list",
  EXTENSIONUSERKEY: "extensionuserlist",
  IVR: {
    URL: {
      DETAILS: BASE_URL + "/ivr/details",
      ADD: BASE_URL + "/ivr/add",
      UPDATE: BASE_URL + "/ivr/edit",
      DELETE: BASE_URL + "/ivr/delete",
      LIST: BASE_URL + "/ivr/list",
    },
    KEY: {
      DETAILS: "ivr_details",
      ADD: "ivr_add",
      UPDATE: "ivr_update",
      DELETE: "ivr_delete",
      LIST: "ivr_list",
    },
  },
  CDR_KEY: {
    CDR_DOMAIN_LIST: "DOMAIN_LIST",
  },
  CDR: {
    CDR_DOMAIN_LIST: BASE_URL + "/cdr_logs/new/domain",
    CDR_DOMAIN_LIST_LIST: BASE_URL + "/cdr_logs/new/domain_list",
  },
  RECORDING: {
    URL: {
      GET: BASE_URL + "/cdr_logs/recordings",
    },
    KEY: {
      GET: "get_recording_list",
    },
  },
  NUMBER: {
    ADD: BASE_URL + "/pstn/assign_pstn",
    UPDATE: BASE_URL + "/pstn/update_pstn",
    DELETE: BASE_URL + "/pstn/delete_pstn",
    DETAIL: BASE_URL + "/pstn/detail",
    LIST: BASE_URL + "/time_condition/list",
  },
  NUMBER_KEY: {
    ADD: "number_add",
    UPDATE: "number_edit",
    DELETE: "number_delete",
    DETAIL: "number_detail",
    LIST: "time_condition_list",
  },
  FEATURES: {
    ADD: BASE_URL + "/company_feature/add",
    EDIT: BASE_URL + "/company_feature/detail",
    UPDATE: BASE_URL + "/company_feature/edit",
    addkey: "features",
    editkey: "editapi",
    updatekey: "updateapi",
  },
  SETTING: {
    CHANGE_PASS: BASE_URL + "/setting/change_password",
    API_KEY: "change_password",
    ADMIN_UPDATE: BASE_URL + "/setting/update/user/detail",
    ADMIN_KEY: BASE_URL + "update_user_detail",
  },
  SMTP: {
    DETAIL: BASE_URL + "/smtp/detail",
    ADD: BASE_URL + "/smtp/config/update",
  },
  SMTP_KEY: {
    DETAIL: "smtp_detail",
    ADD: "smtp_add",
  },
  EMAIL_TEMPLET: {
    EMAIL_LIST: BASE_URL + "/email",
  },
  EMAIL_TEMPLET_KEY: {
    EMAIL_LIST: "EMAIL_TEMPLET",
  },
  WHATSAPP_TOKEN: {
    TOKEN_PUT: BASE_URL + "/whatsapp/config",
  },
  WHATSAPP_TOKEN_KEY: {
    TOKEN_PUT: "whatsapp_token",
  },
  DASHBOARD: {
    GET: BASE_URL + "/dashboard",
  },
  DASHBOARD_KEY: {
    GET: "dashboard_key",
  },
  INTEGRATION_LIST: {
    GET_ROLE: BASE_URL + "/integration/role/list",
    ADD_VIDEO: BASE_URL + "/integration/video/add",
    VIDEO_LIST: BASE_URL + "/integration/video/list",
    VIDEO_BY_ROLE: BASE_URL + "/integration/video/list/role?user_type=",
  },
  CALENDAR: {
    GET: BASE_URL + "/calendar/event",
    PUT: BASE_URL + "/calendar/config/refresh/token/redirct",
    PUT1: BASE_URL + "/calendar/config/refresh/token/update",
    DETAIL: BASE_URL + "/calendar/config/detail",
  },
  CALENDAR_KEY: {
    GET: "calendar_get",
    PUT: "calendar_put",
    PUT1: "calendar_put1",
    DETAIL: "calendar_detail",
  },
};

export default config;