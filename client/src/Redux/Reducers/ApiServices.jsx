import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../config";
import { performLogout } from "../../Components/LogOut"; // Import the helper function

let SideBarData;
export const postapiAll = createAsyncThunk(
  "user2/postapiall",
  async ({ inputData, Api, Token, urlof, signal }, { rejectWithValue }) => {
    try {
      const response = await axios.post(Api, inputData, {
        headers: { Authorization: Token },
        signal,
      });
      var responseDiff = {
        urlof: urlof,
        response: response.data,
      };

      return responseDiff;
    } catch (error) {
      if (error?.response?.status == "402") {
        performLogout();
      }
      return rejectWithValue({ error: error, status: error, headers: error });
    }
  }
);
export const deleteapiAll = createAsyncThunk(
  "user2/deleteapiAll",
  async ({ inputData, Api, Token, urlof }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(Api, {
        headers: { Authorization: Token },
        data: inputData,
      });
      var responseDiff = {
        urlof: urlof,
        response: response.data,
      };

      return responseDiff;
    } catch (error) {
      if (error?.response?.status == "402") {
        performLogout();
      }
      return rejectWithValue({
        error: error,
        status: error?.response?.status,
        headers: error?.response?.headers,
      });
    }
  }
);
export const putapiall = createAsyncThunk(
  "user2/putapiall",
  async ({ inputData, Api, Token, urlof }, { rejectWithValue }) => {
    try {
      const response = await axios.put(Api, inputData, {
        headers: { Authorization: Token },
      });
      var responseDiff = {
        urlof: urlof,
        response: response.data,
      };

      return responseDiff;
    } catch (error) {
      if (error?.response?.status == "402") {
        performLogout();
      }
      return rejectWithValue({
        error: error.response?.data || error.message,
        status: error.response?.status,
        headers: error.response?.headers,
      });
    }
  }
);

export const getapiAll = createAsyncThunk(
  "user2/getapiAll",
  async ({ Api, Token, urlof, signal }) => {
    const response = await axios.get(Api, {
      headers: { Authorization: Token },
      signal,
    });
    var responseDiff = {
      urlof: urlof,
      response: response.data,
    };
    return responseDiff;
  }
);

const initialState = {
  deleteapiAll: {
    Deletetrunkapi: [],
    Deleteringgroup: [],
    DeleteFirewall: [],
    Deleteoutbound: [],
    Deletephonebook: [],
    pstnnumberdelete: [],
    Deletesystemrecordin: [],
  },
  putapiall: {
    Trunkedit: [],
    Ringgroup: [],
    Firewalledit: [],
    updatedoutboand: [],
    Phonebookupdate: [],
  },
  postapiall: {
    Trunks: [],
    Trunkadd: [],
    Login: [],
    groupdetails: [],
    ringgroupex: [],
    ringgrouplist: [],
    groupdetailsadd: [],
    TrunkvalueEdit: [],
    Ivrdata: [],
    Extension: "",
    CompanyList: [],
    EditGetDetailCompany: [],
    Firewall: [],
    Firewalladd: [],
    Firewalllist: [],
    outbound: [],
    outboundadd: [],
    outboundedit: [],
    phonebooklist: [],
    phonebookadd: [],
    phonebookeditvalues: [],
    Pstnnumber: [],
    pstnumberadd: [],
    conferenceList: [],
    timecondition: [],
    Numberslist: [],
  },
  getapiall: {
    Sidebar: [],
    ContactList: "",
    Conversation: "",
    NewConversation: [],
    ListofUser: "",
    wpsidebarlist: [],
    wpsidebarCompanydetail: [],
    ForwardApi: [],
    PstnNumberList: "",
    complist: [],
    Trunknamelist: [],
    WConversation: [],
    systemrecordinglist: [],
    crdlist: [],
    profileurl: "",
    unreadCount: "",
    email_list: [],
    dashboardData:[],
  },
};

const ApiSlice = createSlice({
  name: "user2",
  initialState,
  reducers: {
    setUnreadCount(state, action) {
      state.unreadCount = action.payload.unread_msg_count;
    },
    profileupdate(state, action) {
      state.getapiall.profileurl = action.payload;
    },
    sidebarUpdate(state, action) {
      const newSidebarData = state.getapiall.Sidebar.map((item) => ({
        ...item,
      }));

      const index = newSidebarData.findIndex(
        (item) => item?._id === action?.payload?.id
      );

      if (index !== -1) {
        const currentItem = newSidebarData[index];

        if (currentItem) {
          const updatedItem = {
            ...currentItem,
            is_online: action?.payload?.data,
          };

          newSidebarData[index] = updatedItem;
        }
      }

      return {
        ...state,
        getapiall: {
          ...state.getapiall,
          Sidebar: newSidebarData, // Update Sidebar with the new data
        },
      };
    },

    AcksendMessage(state, action) {
      const newSidebarData = [...state.getapiall.Sidebar];
      const index = newSidebarData.findIndex(
        (item) => item?._id === action?.payload?.id
      );
      console.log(action?.payload, index, "action?.payload");
      if (index !== -1) {
        const updatedItem = {
          ...newSidebarData[index],
          last_message: action?.payload?.data?.message,
          last_media_type: action?.payload?.data?.media_type,
          last_message_time: action?.payload?.data?.createdAt,
        };
        newSidebarData.splice(index, 1, updatedItem);
      } else {
        const newItem = {
          _id: action?.payload?.id,
          last_message: action?.payload?.data?.message,
          last_media_type: action?.payload?.data?.media_type,
          last_message_time: action?.payload?.data?.createdAt,
          isGroup: action?.payload?.isGroup,
          name: action?.payload?.data?.receiver_nm,
          isBlocked: 0,
          last_seen: action?.payload?.data?.createdAt,
          image: action?.payload?.user_image,
          is_online: action?.payload?.is_online,
          isgroup: action.payload?.isgroup,
        };
        newSidebarData.push(newItem);
      }
      return {
        ...state,
        getapiall: {
          ...state.getapiall,
          Sidebar: newSidebarData,
        },
      };
    },
    WAcksendMessage(state, action) {
      const activeConversationId = Cookies.get("conversation_id");
      const newSidebarData = [...state.getapiall.wpsidebarlist];
      const index = newSidebarData.findIndex(
        (item) => item?._id === action?.payload?.id
      );
      if (index !== -1) {
        const updatedItem = {
          ...newSidebarData[index],
          last_message: action?.payload?.data?.message,
          last_media_type: action?.payload?.data?.media_type,
          last_message_time: action?.payload?.data?.createdAt,
          unread_msg_count:
            activeConversationId !== action?.payload?.id && action?.payload?.key
              ? (newSidebarData[index].unread_msg_count || 0) + 1
              : newSidebarData[index].unread_msg_count,
        };
        newSidebarData.splice(index, 1, updatedItem);
      } else {
        const newItem = {
          _id: action?.payload?.id,
          last_message: action?.payload?.data?.message,
          last_media_type: action?.payload?.data?.media_type,
          last_message_time: action?.payload?.data?.createdAt,
          name: action?.payload?.data?.user_name,
          unread_msg_count: 1,
        };
        newSidebarData.push(newItem);
      }
      return {
        ...state,
        getapiall: {
          ...state.getapiall,
          wpsidebarlist: newSidebarData,
        },
      };
    },
    ReceiveMessage(state, action) {
      const activeConversationId = Cookies.get("conversation_id");
      const newSidebarData = [...state.getapiall.Sidebar];
      const index = newSidebarData.findIndex(
        (item) => item?._id === action?.payload?.id
      );
      if (index !== -1) {
        const updatedItem = {
          ...newSidebarData[index],
          last_message: action?.payload?.data?.message,
          last_media_type: action?.payload?.data?.media_type,
          last_message_time: action?.payload?.data?.createdAt,
          unread_msg_count:
            activeConversationId !== action?.payload?.id
              ? (newSidebarData[index].unread_msg_count || 0) + 1
              : newSidebarData[index].unread_msg_count,
        };
        newSidebarData.splice(index, 1, updatedItem);
      } else {
        const newItem = {
          _id: action?.payload?.id,
          last_message: action?.payload?.data?.message,
          last_media_type: action?.payload?.data?.media_type,
          last_message_time: action?.payload?.data?.createdAt,
          isGroup: action?.payload?.data?.isGroup,
          name: action?.payload?.data?.name,
          unread_msg_count:
            activeConversationId !== action?.payload?.id ? 1 : 0,
          isBlocked: 0,
          last_seen: action?.payload?.data?.createdAt,
          image: action?.payload?.data?.image,
        };
        newSidebarData.push(newItem);
      }
      return {
        ...state,
        getapiall: {
          ...state.getapiall,
          Sidebar: newSidebarData,
        },
      };
    },
    CreateGroupUpdate(state, action) {
      const sidebarObj = {
        _id: action.payload.post._id,
        name: action.payload.post.group_name,
        last_message_time: action.payload.infoMessage?.createdAt,
        last_message: action.payload.infoMessage?.message,
        last_media_type: action?.payload.infoMessage?.media_type,
        isGroup: 1,
        cid: action.payload.post.cid,
        description: action.payload.post.description,
        image: action.payload.post.group_image,
      };

      state.getapiall.Sidebar = [sidebarObj, ...state.getapiall.Sidebar];
    },
    ackEditGroup(state, action) {
      const newData = state.getapiall?.Sidebar?.map((item) => {
        if (item._id === action?.payload._id) {
          return {
            ...item,
            name: action?.payload?.group_name,
            image: action?.payload?.group_image,
            description: action?.payload?.description,
          };
        }
        return item;
      });

      state.getapiall.Sidebar = newData;
    },
    ackUserAssign(state, action) {
      const newData = state.getapiall?.wpsidebarlist?.map((item) => {
        if (item._id === action?.payload?.receiver_id) {
          return {
            ...item,
            assigned_id: action?.payload?.assigned_id,
          };
        }
        return item;
      });

      state.getapiall.wpsidebarlist = newData;
    },
    ackRemoveGroup(state, action) {
      const activeConversationId = Cookies.get("conversation_id");
      state.getapiall.ListofUser = action.payload;
    },
    makeGroupAdmin(state, action) {
      const { getapiall } = state;
      const { ListofUser } = getapiall;
      const { group_users } = ListofUser || {};

      if (!group_users) return state;

      const newData = group_users.map((item) => {
        if (item.member_id?._id === action.payload.member_id) {
          return {
            ...item,
            is_admin: action.payload.is_admin,
          };
        }
        return item;
      });

      return {
        ...state,
        getapiall: {
          ...getapiall,
          ListofUser: {
            ...ListofUser,
            group_users: newData,
          },
        },
      };
    },
    GroupMemberRole(state, action) {
      const { getapiall } = state;
      const { ListofUser } = getapiall;
      const { group_users } = ListofUser || {};

      if (!group_users) return state;

      const newData = group_users.map((item) => {
        if (item.member_id?._id === action.payload.id) {
          return {
            ...item,
            is_admin: action.payload.data === 2 ? 1 : 0,
          };
        }
        return item;
      });

      return {
        ...state,
        getapiall: {
          ...getapiall,
          ListofUser: {
            ...ListofUser,
            group_users: newData,
          },
        },
      };
    },
    DeleteGroup(state, action) {
      const newData = state.getapiall.Sidebar?.filter((val) => {
        return val._id !== action.payload?.receiver_id;
      });
      Cookies.remove("conversation_id");
      state.getapiall.Sidebar = newData;
    },
    AckBlockUser(state, action) {
      const newSidebarData = [...state.getapiall.Sidebar];
      const newConData = [...state.getapiall.NewConversation];
      const indexList = newConData.findIndex(
        (item) => item?._id === action?.payload?.block_id
      );
      if (indexList !== -1) {
        const updatedItem = {
          ...newConData[indexList],
          isBlocked: action?.payload?.isBlocked,
          isblocked_by_reciver: action?.payload?.isBlocked === 1 ? 1 : 0,
        };
        newConData[indexList] = updatedItem;
      }
      const index = newSidebarData.findIndex(
        (item) => item?._id === action?.payload?.block_id
      );
      if (index !== -1) {
        const updatedItem = {
          ...newSidebarData[index],
          isBlocked: action?.payload?.isBlocked,
          isblocked_by_reciver: action?.payload?.isBlocked === 1 ? 1 : 0,
        };
        newSidebarData.splice(index, 1, updatedItem);
      }
      return {
        ...state,
        getapiall: {
          ...state.getapiall,
          Sidebar: newSidebarData,
          NewConversation: newConData,
        },
      };
    },
    RecieveBlockUser(state, action) {
      const newSidebarData = [...state.getapiall.Sidebar];
      const index = newSidebarData.findIndex(
        (item) => item?._id === action?.payload?.block_by
      );
      if (index !== -1) {
        const updatedItem = {
          ...newSidebarData[index],
          // isBlocked: action?.payload?.isBlocked,
          isblocked_by_reciver: action?.payload?.isBlocked === 1 ? 1 : 0,
        };
        newSidebarData.splice(index, 1, updatedItem);
        return {
          ...state,
          getapiall: {
            ...state.getapiall,
            Sidebar: newSidebarData,
          },
        };
      }
      return state;
    },
    msgUnreadCount(state, action) {
      const newSidebarData = action?.payload?.key
        ? [...state.getapiall.Sidebar]
        : [...state.getapiall.wpsidebarlist];
      const index = newSidebarData.findIndex(
        (item) => item?._id === action?.payload?._id
      );
      if (index !== -1) {
        const updatedItem = {
          ...newSidebarData[index],
          unread_msg_count: action.payload.count,
        };
        newSidebarData.splice(index, 1, updatedItem);
        if (action?.payload?.key) {
          return {
            ...state,
            getapiall: {
              ...state.getapiall,
              Sidebar: newSidebarData,
            },
          };
        } else {
          return {
            ...state,
            getapiall: {
              ...state.getapiall,
              wpsidebarlist: newSidebarData,
            },
          };
        }
      }
      return state;
    },
    ackLeaveGroup(state, action) {
      state.getapiall.ListofUser = action.payload;
    },
    ackClearChat(state, action) {
      const newSidebarData = [...state.getapiall.Sidebar];
      const index = newSidebarData.findIndex(
        (item) => item?._id === action?.payload
      );
      if (index !== -1) {
        const updatedItem = {
          ...newSidebarData[index],
          last_message: "",
          // last_message_time: null,
          last_media_type: 0,
          unread_msg_count: 0,
        };
        newSidebarData.splice(index, 1, updatedItem);
        return {
          ...state,
          getapiall: {
            ...state.getapiall,
            Sidebar: newSidebarData,
          },
        };
      }
      return state;
    },
    WAackClearChat(state, action) {
      const newSidebarData = [...state.getapiall.wpsidebarlist];

      const index = newSidebarData.findIndex(
        (item) => item?._id === action?.payload
      );
      if (index !== -1) {
        const updatedItem = {
          ...newSidebarData[index],
          last_message: "",
          // last_message_time: null,
          last_media_type: 0,
          unread_msg_count: 0,
        };
        newSidebarData.splice(index, 1, updatedItem);
        return {
          ...state,
          getapiall: {
            ...state.getapiall,
            wpsidebarlist: newSidebarData,
          },
        };
      }
      return state;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(putapiall.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.urlof === config.TRUNK_KEY.UPDATE) {
          state.putapiall.Trunkedit =
            action.payload.response || state.putapiall.Trunkedit;
        }
        if (action.payload.urlof === config.RING_GROUP_KEY.UPDATE) {
          state.putapiall.Ringgroup =
            action.payload.response || state.putapiall.Ringgroup;
        }
        if (action.payload.urlof === config.FIREWALL_KEY.UPDATE) {
          state.putapiall.Firewalledit =
            action.payload.response || state.putapiall.Firewalledit;
        }
        if (action.payload.urlof === config.OUTBOUND_KEY.UPDATE) {
          state.putapiall.updatedoutboand =
            action.payload.response || state.putapiall.updatedoutboand;
        }
        if (action.payload.urlof === config.PHONEBOOK_KEY.UPDATE) {
          state.deleteapiAll.Phonebookupdate =
            action.payload.response || state.deleteapiAll.Phonebookupdate;
        }
      })
      .addCase(deleteapiAll.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.urlof === config.TRUNK_KEY.DELETE) {
          state.deleteapiAll.Deletetrunkapi =
            action.payload.response || state.deleteapiAll.Deletetrunkapi;
        }
        state.status = "succeeded";
        if (action.payload.urlof === config.RING_GROUP_KEY.DELETE) {
          state.deleteapiAll.Deleteringgroup =
            action.payload.response || state.deleteapiAll.Deleteringgroup;
        }

        if (action.payload.urlof === "deletesystemrecording") {
          state.deleteapiAll.Deletesystemrecordin =
            action.payload.response || state.deleteapiAll.Deletesystemrecordin;
        }
        if (action.payload.urlof === config.OUTBOUND_KEY.DELETE) {
          state.deleteapiAll.Deleteoutbound =
            action.payload.response || state.deleteapiAll.Deleteoutbound;
        }
        if (action.payload.urlof === config.PHONEBOOK_KEY.DELETE) {
          state.deleteapiAll.Deletephonebook =
            action.payload.response || state.deleteapiAll.Deletephonebook;
        }
        if (action.payload.urlof === config.PSTN_NUMBER_KEY.DELETE) {
          state.deleteapiAll.pstnnumberdelete =
            action.payload.response || state.deleteapiAll.pstnnumberdelete;
        }
      })
      .addCase(postapiAll.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.urlof === "login") {
          state.postapiall.Login = action.payload || state.postapiall.Login;
        }
        if (action.payload.urlof === config.TRUNK_KEY.LIST) {
          state.postapiall.Trunks =
            action.payload.response || state.postapiall.Trunks;
        }
        if (action.payload.urlof === config.COMPANYWISE_KEY) {
          console.log("response", action.payload);
          state.postapiall.Numberslist =
            action.payload.response || state.postapiall.Numberslist;
        }
        if (action.payload.urlof === config.TRUNK_KEY.ADD) {
          state.postapiall.Trunkadd =
            action.payload.response || state.postapiall.Trunkadd;
        }
        if (action.payload.urlof === config.TRUNK_KEY.DETAIL) {
          state.postapiall.TrunkvalueEdit =
            action.payload.response || state.postapiall.TrunkvalueEdit;
        }
        if (action.payload.urlof === config.RING_GROUP_KEY.ADD) {
          state.postapiall.groupdetails =
            action.payload.response || state.postapiall.groupdetails;
        }
        if (action.payload.urlof === config.RING_GROUP_KEY.LIST) {
          state.postapiall.ringgrouplist =
            action.payload.response || state.postapiall.ringgrouplist;
        }
        if (action.payload.urlof === config.RING_GROUP_KEY.UPDATE) {
          state.postapiall.groupdetailsadd =
            action.payload.response || state.postapiall.groupdetailsadd;
        }
        if (action.payload.urlof === config.RING_GROUP_KEY.EXTENSION) {
          state.postapiall.ringgroupex =
            action.payload.response || state.postapiall.ringgroupex;
        }
        if (action.payload.urlof === config.FIREWALL_KEY.LIST) {
          state.postapiall.Firewall =
            action.payload.response || state.postapiall.Firewall;
        }
        if (action.payload.urlof === config.FIREWALL_KEY.ADD) {
          state.postapiall.Firewalladd =
            action.payload.response || state.postapiall.Firewalladd;
        }
        if (action.payload.urlof === config.FIREWALL_KEY.LIST) {
          state.postapiall.Firewalllist =
            action.payload.response || state.postapiall.Firewalllist;
        }
        if (action.payload.urlof === config.OUTBOUND_KEY.LIST) {
          state.postapiall.outbound =
            action.payload.response || state.postapiall.outbound;
        }
        if (action.payload.urlof === config.OUTBOUND_KEY.ADD) {
          state.postapiall.outboundadd =
            action.payload.response || state.postapiall.outboundadd;
        }
        if (action.payload.urlof === config.OUTBOUND_KEY.DETAIL) {
          state.postapiall.outboundedit =
            action.payload.response || state.postapiall.outboundedit;
        }
        if (action.payload.urlof === config.PSTN_NUMBER_KEY.ADD) {
          state.postapiall.pstnumberadd =
            action.payload.response || state.postapiall.pstnumberadd;
        }
        if (action.payload.urlof === config.PHONEBOOK_KEY.DETAIL) {
          state.postapiall.phonebookeditvalues =
            action.payload.response || state.postapiall.phonebookeditvalues;
        }

        if (action.payload.urlof === config.PHONEBOOK_KEY.LIST) {
          state.postapiall.phonebooklist =
            action.payload.response || state.postapiall.phonebooklist;
        }
        if (action.payload.urlof === config.EXTENSION_KEY.LIST) {
          state.postapiall.Extension =
            action.payload.response || state.postapiall.Extension;
        }
        if (action.payload.urlof === config.COMPANY_LIST_KEY) {
          state.postapiall.CompanyList =
            action.payload.response || state.postapiall.CompanyList;
        }
        if (action.payload.urlof === config.TIME_CONDITION_KEY.LIST) {
          state.postapiall.timecondition =
            action.payload.response || state.postapiall.timecondition;
        }
        if (action.payload.urlof === config.IVR.KEY.LIST) {
          state.postapiall.Ivrdata =
            action.payload.response || state.postapiall.Ivrdata;
        }
        if (action.payload.urlof === "EditGetDetailCompany") {
          state.postapiall.EditGetDetailCompany =
            action.payload.response || state.postapiall.EditGetDetailCompany;
        }

        if (action.payload.urlof === "conference") {
          state.postapiall.conferenceList =
            action.payload.response || state.postapiall.conferenceList;
        }
      })
      .addCase(getapiAll.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload.urlof === config.CDR_KEY.CDR_DOMAIN_LIST) {
          state.getapiall.crdlist =
            action.payload.response.data || state.getapiall.crdlist;
        }
        if (action.payload.urlof === config.PSTN_NUMBER_KEY.LIST) {
          state.postapiall.Pstnnumber =
            action.payload.response || state.postapiall.Pstnnumber;
        }
        if (action.payload.urlof === "Sidebar") {
          state.getapiall.Sidebar =
            action.payload.response.sidebarData || state.getapiall.Sidebar;
          SideBarData = state.getapiall.Sidebar;
        }
        if (action.payload.urlof === "contact_list") {
          state.getapiall.ContactList =
            action.payload || state.getapiall.ContactList;
        }
        if (action.payload.urlof === "Conversation") {
          state.getapiall.Conversation =
            action.payload || state.getapiall.Conversation;
        }
        if (action.payload.urlof === "WConversation") {
          state.getapiall.WConversation =
            action.payload.response || state.getapiall.WConversation;
        }
        if (action.payload.urlof === "wpsidebarlist") {
          state.getapiall.wpsidebarlist =
            action.payload.response.company_chat_list ||
            state.getapiall.wpsidebarlist;
          state.getapiall.wpsidebarCompanydetail =
            action.payload.response || state.getapiall.wpsidebarCompanydetail;
        }
        if (action.payload.urlof === "NewConversation") {
          state.getapiall.NewConversation =
            action.payload.response.usersData ||
            state.getapiall.NewConversation;
        }
        if (action.payload.urlof === "ListOfUser") {
          state.getapiall.ListofUser =
            action.payload.response.groupsDetails || state.getapiall.ListofUser;
        }
        if (action.payload.urlof === config.PHONEBOOK_KEY.ADD) {
          state.getapiall.phonebookadd =
            action.payload.response.groupsDetails ||
            state.getapiall.phonebookadd;
        }
        if (action.payload.urlof === "ForwardApi") {
          state.getapiall.ForwardApi =
            action.payload.response.ForwardList || state.getapiall.ForwardApi;
        }
        if (action.payload.urlof === config.PSTN_NUMBER_KEY.EXTENSION_LIST) {
          state.getapiall.PstnNumberList =
            action.payload.response.PstnList || state.getapiall.PstnNumberList;
        }
        if (action.payload.urlof === config.COMPANY_USER_LIST_KEY) {
          state.getapiall.complist =
            action.payload.response || state.getapiall.complist;
        }
        if (action.payload.urlof === "trunknamelist") {
          state.getapiall.Trunknamelist =
            action.payload.response || state.getapiall.Trunknamelist;
        }
        if (action.payload.urlof === "systemrecording") {
          state.getapiall.systemrecordinglist =
            action.payload.response || state.getapiall.systemrecordinglist;
        }
        if (action.payload.urlof === config.EMAIL_TEMPLET_KEY.EMAIL_LIST) {
          state.getapiall.email_list =
            action.payload.response.emaillist || []
        }
        if (action.payload.urlof === config.DASHBOARD_KEY.GET) {
          state.getapiall.dashboardData =
            action.payload.response || state.getapiall.dashboardData
        }
      });
  },
});
export const {
  AcksendMessage,
  ReceiveMessage,
  CreateGroupUpdate,
  ackEditGroup,
  ackRemoveGroup,
  makeGroupAdmin,
  DeleteGroup,
  AckBlockUser,
  msgUnreadCount,
  ackLeaveGroup,
  ackClearChat,
  RecieveBlockUser,
  GroupMemberRole,
  WAcksendMessage,
  ackUserAssign,
  WAackClearChat,
  sidebarUpdate,
  profileupdate,
  setUnreadCount,
} = ApiSlice.actions;

export default ApiSlice.reducer;
