import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Nav, Row, Spinner, Tab, Table } from "react-bootstrap";
import ChatList from "./ChatList";
import "./webphoneCss.css";
import ContactCardModal from "./webphoneModal";
import DialPad from "../Call/DialPad";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import config from "../../config";
import { postapiAll } from "../../Redux/Reducers/ApiServices";
import { AllEmit } from "../Chat/SocketConfig";
import Infinitescroll from "../Modal/InfinitescrollComp";
import { setExtensionStatus } from "../../Redux/Reducers/DataServices";

export default function Webphone() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Extension");
  const statusType = {
    online: "Online",
    offline: "Offline",
    busy: "Busy",
  };
  const dispatch = useDispatch();
  const sipRegister = useSelector((state) => state.sipconnect.sipconnect);
  const allListeners = useSelector((state) => state.allListeners.allListeners);
  useEffect(() => {
    if (allListeners.name === "ack_register_extantions") {
      dispatch(setExtensionStatus(allListeners.listener_params));
    }
  }, [allListeners]);
  const status = useSelector((state) => state.extensionstatus.extensionstatus);
  const [statuslist, setStatusList] = useState([]);
  useEffect(() => {
    setStatusList(status);
  }, [status]);
  const [searchTerm, setSearchterm] = useState("");
  const select = 18;
  const [currentPage, setCurrentPage] = useState(1);
  const initialPage = 1;
  let Token = Cookies.get("Token");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const abortControllerRef = useRef(null);
  const [selectedContact, setSelectedContact] = useState({
    name: "",
    number: "",
  });
  const sip = Cookies.get("Sip_number");
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [dynamicHeightForTabs, setDynamicHeightForTabs] = useState(0);
  const [extensionList, setExtensionList] = useState([]);
  const [userTotal, setUserTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [groupList, setGroupList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [groupUserOnline, setGroupUserOnline] = useState(0);
  const tabKey = {
    Extension: "Extension",
    Contact: "Contact",
    Group: "Group",
  };

  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 105;
      setDynamicHeight(windowHeight);
      const windowHeightTab = window.innerHeight - 300;
      setDynamicHeightForTabs(windowHeightTab);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);

  const openModal = ({ name, mobile, extension, position }) => {
    setSelectedContact({
      name: name,
      extension: extension,
      mobile: mobile,
      position: position,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };
  useEffect(() => {
    setExtensionList([]);
    setContactList([]);
    setGroupList([]);
    setCurrentPage(1);
    setHasMore(true);
    if (activeTab === tabKey.Extension) {
      setLoading(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const inputData = {
        page: initialPage,
        size: select,
        search: searchTerm.toLowerCase(),
      };
      dispatch(
        postapiAll({
          inputData: inputData,
          Api: config.EXTENSION.LIST,
          Token: Token,
          urlof: config.EXTENSION_KEY.LIST,
          signal: abortController.signal,
        })
      ).then((response) => {
        if (response?.error?.message == "Rejected") {
          setLoading(true);
        } else {
          setLoading(false);
          setExtensionList(response?.payload?.response?.usersData);
          setUserTotal(response.payload?.response?.company_total_counts);
          setCurrentPage(initialPage + 1);
        }
        // setSortedColumn("");
      });
    }

    if (activeTab === tabKey.Group) {
      setLoading(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const inputData = {
        page: initialPage,
        size: select,
      };
      dispatch(
        postapiAll({
          inputData: inputData,
          Api: config.RING_GROUP.LIST,
          Token: Token,
          urlof: config.RING_GROUP_KEY.LIST,
          signal: abortController.signal,
        })
      ).then((response) => {
        if (response?.error?.message == "Rejected") {
          setLoading(true);
        } else {
          setLoading(false);
          setGroupList(response?.payload?.response?.RingGroupList);
          setCurrentPage(initialPage + 1);
          setUserTotal(response.payload?.response?.ring_group_total_counts);
          setGroupUserOnline(response?.payload?.response?.groupUserOnline)
        }
      });
    }

    if (activeTab === tabKey.Contact) {
      setCurrentPage(1);
      setLoading(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const inputData = {
        page: initialPage,
        size: select,
      };
      dispatch(
        postapiAll({
          inputData: inputData,
          Api: config.PHONEBOOK.LIST,
          Token: Token,
          urlof: config.PHONEBOOK_KEY.LIST,
          signal: abortController.signal,
        })
      ).then((response) => {
        setContactList(response?.payload?.response?.PhonebooksData);
        setUserTotal(response.payload?.response?.phonebook_total_counts);
        setCurrentPage(initialPage + 1);

        if (response?.error?.message == "Rejected") {
          setLoading(true);
        } else {
          setLoading(false);
        }
      });
    }
  }, [activeTab]);

  const fetchMoreData = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    let inputData = {
      page: currentPage,
      size: select,
      search: searchTerm.toLowerCase(),
    };

    let apiUrl, apiKey;
    if (activeTab === tabKey.Extension) {
      apiUrl = config.EXTENSION.LIST;
      apiKey = config.EXTENSION_KEY.LIST;
    } else if (activeTab === tabKey.Group) {
      apiUrl = config.RING_GROUP.LIST;
      apiKey = config.RING_GROUP_KEY.LIST;
    } else if (activeTab === tabKey.Contact) {
      apiUrl = config.PHONEBOOK.LIST;
      apiKey = config.PHONEBOOK_KEY.LIST;
    } else {
      setLoading(false);
      return;
    }
    dispatch(
      postapiAll({
        inputData: inputData,
        Api: apiUrl,
        Token: Token,
        urlof: apiKey,
        signal: abortController.signal,
      })
    )
      .then((response) => {
        const newData =
          activeTab === tabKey.Extension
            ? response?.payload?.response?.usersData || []
            : activeTab === tabKey.Group
            ? response?.payload?.response?.RingGroupList || []
            : response?.payload?.response?.PhonebooksData || [];
        if (newData.length < select) {
          setHasMore(false);
        }

        if (activeTab === tabKey.Extension) {
          setExtensionList((prevList) => [...prevList, ...newData]);
        } else if (activeTab === tabKey.Group) {
          setGroupList((prevList) => [...prevList, ...newData]);
        } else if (activeTab === tabKey.Contact) {
          setContactList((prevList) => [...prevList, ...newData]);
        }
        setCurrentPage((prevPage) => prevPage + 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching more data", error);
        setLoading(false);
      });
  };

  return (
    <div id="main-content">
      <div className="communication">
        <div className="block-header">
          <div className="row clearfix">
            <div
              className="col-md-6 col-sm-12 col-name "
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <span className="dashboardtext">{t("Communication")}</span>
              <span
                style={{ color: "var(--main-adminnumberheader-color)" }}
                className="siptext"
              >
                {/* <i class="fa fa-signal" style={{ fontSize: "14px" }}></i>{" "} */}
                {/* {t("sip")} :-  */}
                {sip}
                <br />
                {sipRegister == true ? (
                  <span className="conlist">{t("Connected")}</span>
                ) : (
                  <span className="conlist">{t("Registration Failed")}</span>
                )}
              </span>
            </div>
          </div>
        </div>
        <div>
          <Row className="clearfix mt-4">
            <Col lg={4} className="m-0 p-0">
              <Card className="dear-card mb-0" style={{ width: "100%" }}>
                <Card.Body style={{ width: "100%" }}>
                  <DialPad />
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8} className="m-0">
              <Card style={{ width: "100%" }}>
                <Card.Body className="misscall" style={{ width: "100%" }}>
                  <Tab.Container
                    activeKey={activeTab}
                    onSelect={handleTabSelect}
                    className="mb-2"
                  >
                    <Nav variant="tabs" className="custome-nav table-nav">
                      <Nav.Item className="custom-nav-item">
                        <Nav.Link eventKey="Extension" className="nav-link2">
                          {t("Extension")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="custom-nav-item">
                        <Nav.Link eventKey="Group" className="nav-link2">
                          {t("Groups")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="custom-nav-item">
                        <Nav.Link eventKey="Contact" className="nav-link2">
                          {t("Contact")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="custom-nav-item">
                        <Nav.Link eventKey="BLF" className="nav-link2">
                          {t("BLF")}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content
                      className="tabcontent webphone-table hide_scrollbar"
                      style={{
                        height: "364px",
                        overflow: "auto",
                      }}
                      id="scrollableDiv"
                    >
                      {loading && (
                        <div
                          style={{ height: dynamicHeightForTabs }}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <Spinner
                            animation="border"
                            role="status"
                            style={{ color: "var(--main-orange-color)" }}
                          />
                        </div>
                      )}
                      {activeTab == "Extension" ? (
                        <Infinitescroll
                          userTotal={userTotal}
                          fetchMoreData={fetchMoreData}
                          hasMore={hasMore}
                        >
                          <div className="row g-0">
                            {console.log(extensionList, "extensionList")}
                            {extensionList
                              ?.filter((item) => item.role.type === 1)
                              .map((item, index) => {
                                const statusItem = statuslist?.find(
                                  (status) => status._id === item._id
                                );

                                const isOnline = statusItem?.is_online === 1;
                                const isBusy = statusItem?.isbusy === 1;

                                const statusText = isBusy
                                  ? statusType.busy
                                  : isOnline
                                  ? statusType.online
                                  : statusType.offline;

                                const statusClass = isBusy
                                  ? "Busy"
                                  : isOnline
                                  ? "Online"
                                  : "offline";
                                return (
                                  <div
                                    className="col-12 col-sm-4"
                                    key={index}
                                    style={{ padding: "14px" }}
                                  >
                                    <ChatList
                                      badge={true}
                                      name={
                                        item.first_name + " " + item.last_name
                                      }
                                      image={item?.user_image}
                                      message={statusText}
                                      status={statusText}
                                      statusClass={statusClass}
                                      activeTab={activeTab}
                                      onOpenModal={() =>
                                        openModal({
                                          name:
                                            item.first_name +
                                            " " +
                                            item.last_name,
                                          extension: item.user_extension,
                                          mobile: item.mobile,
                                        })
                                      }
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        </Infinitescroll>
                      ) : activeTab == "Group" ? (
                        <Infinitescroll
                          userTotal={userTotal}
                          fetchMoreData={fetchMoreData}
                          hasMore={hasMore}
                        >
                          <div className="row g-0">
                            {groupList?.map((item) => {
                               const statusText = groupUserOnline == 0
                               ? "Offline"
                               : "Online"

                             const statusClass = groupUserOnline == 0
                             ? "Offline"
                             : "Online"

                              return (
                                <div
                                  className="col-12 col-sm-4"
                                  style={{ padding: "14px" }}
                                >
                                  <ChatList
                                    usersOnline={groupUserOnline}
                                    badge={true}
                                    name={item.name}
                                    message={statusText}
                                    status={statusText}
                                    statusClass={statusClass}
                                    activeTab={activeTab}
                                    onOpenModal={(e) =>
                                      openModal({
                                        name: item.name,
                                        extension: item.extension,
                                        mobile: item.assign_pstn_number,
                                      })
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </Infinitescroll>
                      ) : activeTab == "Contact" ? (
                        <Infinitescroll
                          userTotal={userTotal}
                          fetchMoreData={fetchMoreData}
                          hasMore={hasMore}
                        >
                          <div className="row g-0">
                            {contactList?.map((item) => {
                              return (
                                <div
                                  className="col-12 col-sm-4 "
                                  style={{
                                    padding: "14px",
                                    textWrap: "nowrap",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  <ChatList
                                    badge={false}
                                    name={
                                      item.first_name + " " + item.last_name
                                    }
                                    message="Online"
                                    status="Online"
                                    statusClass="online"
                                    activeTab={activeTab}
                                    onOpenModal={(e) =>
                                      openModal({
                                        name:
                                          item.first_name +
                                          " " +
                                          item.last_name,
                                        extension: item.phone_number,
                                        mobile: item.mobile_number,
                                        position: item.position,
                                      })
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </Infinitescroll>
                      ) : activeTab == "BLF" ? (
                        <Tab.Pane eventKey="BLF">
                          <div className="col-md-12 webfon_width">
                            <div>
                              <Table hover className="webphone-table">
                                <tbody>
                                  <tr>
                                    <td>
                                      <ChatList
                                        badge={false}
                                        name="Function"
                                        message=""
                                        status=""
                                        statusClass="online"
                                        onOpenModal={(e) =>
                                          openModal(e, "Function", 185)
                                        }
                                      />
                                    </td>
                                    <td>
                                      <ChatList
                                        name="Function"
                                        message=""
                                        status=""
                                        statusClass="busy"
                                        onOpenModal={(e) =>
                                          openModal(e, "Function", 180)
                                        }
                                      />
                                    </td>
                                    <td>
                                      <ChatList
                                        name="Function"
                                        message=""
                                        status=""
                                        statusClass="offline"
                                        onOpenModal={(e) =>
                                          openModal(e, "Function", 181)
                                        }
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </Tab.Pane>
                      ) : (
                        ""
                      )}
                    </Tab.Content>
                  </Tab.Container>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      {showModal && (
        <ContactCardModal
          show={showModal}
          onHide={closeModal}
          contactName={selectedContact}
          activeTab={activeTab}
        />
      )}
    </div>
  );
}
