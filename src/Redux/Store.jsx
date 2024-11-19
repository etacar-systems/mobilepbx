import { configureStore } from "@reduxjs/toolkit";
import ApiServices from "./Reducers/ApiServices";
import DataServices from "./Reducers/DataServices";

export default configureStore({
  reducer: {
    calling_function: DataServices,

    multipleCallObj: DataServices,
    transfer_function: DataServices,
    whatsappAllListeners: DataServices,
    opensidebar: DataServices,
    openchat: DataServices,
    allListeners: DataServices,
    chatHeaderDetail: DataServices,
    sipconnect: DataServices,
    postapiAll: ApiServices,
    getapiall: ApiServices,
    deleteapiAll: ApiServices,
    putapiall: ApiServices,
    settingUpdateStatus: DataServices,
    extensionstatus: DataServices,
    Theme: DataServices,
    TransferOn:DataServices,
    setUnreadCount:ApiServices
  },
});
