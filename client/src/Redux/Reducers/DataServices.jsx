import { createAsyncThunk, createThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const Calling_Function = createAsyncThunk(
  "dataservice/Calling_Function",
  async (status) => {
    return status;
  }
);

export const Transfer_Function = createAsyncThunk(
  "dataservice/Transfer_Function",
  async (status) => {
    return status;
  }
);
export const AllListeners = createAsyncThunk(
  "dataservice/AllListeners",
  async (status) => {
    return status;
  }
);
export const WhatsappAllListeners = createAsyncThunk(
  "dataservice/WhatsappAllListeners",
  async (status) => {
    return status;
  }
);
export const Sipconnect = createAsyncThunk(
  "dataservice/Sipconnect",
  async (status) => {
    return status;
  }
);

const dataService = createSlice({
  name: "dataservice",
  initialState: {
    calling_function: "",
    multipleCallObj: "",
    transfer_function: "",
    opensidebar: true,
    openchat: true,
    allListeners: [],
    chatHeaderDetail: "",
    sipconnect: "",
    whatsappAllListeners: [],
    settingUpdateStatus: "",
    extensionstatus: [],
    Theme: Cookies.get("Theme"),
    TransferOn: false,
  },
  reducers: {
    multipleCallId(state, action) {
      state.multipleCallObj = action.payload;
    },
    openSidebar(state, action) {
      state.opensidebar = action.payload;
    },
    openChat(state, action) {
      state.openchat = action.payload;
    },
    chatHeaderInfo(state, action) {
      state.chatHeaderDetail = action.payload;
    },
    settingUpdate(state, action) {
      state.settingUpdateStatus = action.payload;
    },
    setExtensionStatus(state, action) {
      const { offline_extension, online_extension, busy_extension } =
        action?.payload;
      state.extensionstatus = [
        ...offline_extension,
        ...(online_extension || []),
        ...busy_extension,
      ];
    },
    settheme(state, action) {
      state.Theme = action.payload;
    },
    setAsTransfer(state, action) {
      state.TransferOn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Calling_Function.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.calling_function = action.payload;
      })
      .addCase(AllListeners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allListeners = action.payload;
      })
      .addCase(Transfer_Function.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transfer_function = action.payload;
      })
      .addCase(Sipconnect.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sipconnect = action.payload;
      })
      .addCase(WhatsappAllListeners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.whatsappAllListeners = action.payload;
      });
  },
});

export const {
  multipleCallId,
  openChat,
  openSidebar,
  chatHeaderInfo,
  settingUpdate,
  setExtensionStatus,
  settheme,
  setAsTransfer,
} = dataService.actions;
export default dataService.reducer;
