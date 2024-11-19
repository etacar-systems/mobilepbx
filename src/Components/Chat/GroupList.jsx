import React, { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { useSelector } from "react-redux";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Cookies from "js-cookie";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { ReactComponent as DotsThreeVertical } from "../../Assets/Icon/DotsThreeVertical.svg";
import { AllEmit } from "./SocketConfig";
import { useTranslation } from "react-i18next";

export default function GroupList({
  groupListShow,
  setGroupListShow,
  sidebarobjget,
  listOfUser,
  checkboxStates,
  setCheckboxStates,
}) {
  const { t } = useTranslation();
  const NewConversationdata = useSelector(
    (state) => state.getapiall.getapiall.NewConversation
  );
  const [memberList, setMemberList] = useState([]);
  const uid = Cookies.get("User_id");
  const cid = Cookies.get("Company_Id");
  const [notMemberList, setNotMemberList] = useState([]);
  const [listBtnOpen, setListBtnShow] = useState(true);
  const [showDropdown, setShowDropdown] = useState({});
  const activeConversationId = Cookies.get("conversation_id");
  const [checkIsAdmin, setCheckIsAdmin] = useState(false);
  const [dummyList, setDummyList] = useState([]);
  const [createdGroup, setCreatedGroup] = useState([]);
  const createGroupBy = listOfUser?.created_by?._id;
  const admin = listOfUser.group_users;
  const [dynamicHeight, setDynamicHeight] = useState(false);

  useEffect(() => {
    const newdata = listOfUser?.group_users?.filter(
      (state) => state.member_id._id === uid && state.is_admin === 1
    );

    if (newdata?.length !== 0) {
      setCheckIsAdmin(true);
    } else {
      setCheckIsAdmin(false);
    }

    const updateData = NewConversationdata?.filter((item) => {
      return !listOfUser?.group_users?.some(
        (val) => val?.member_id?._id === item?._id && val.isleaved === 0
      );
    });
    setNotMemberList(updateData);
    setDummyList(updateData);

    const isleaved = listOfUser?.group_users.filter(
      (val) => val.isleaved === 0
    );
    setMemberList(isleaved);
  }, [NewConversationdata, listOfUser, uid]);
  useEffect(() => {
    const data = listOfUser?.group_users?.filter(
      (val) => createGroupBy === val.member_id._id
    );
    if (data?.length !== 0) {
      setCreatedGroup(data);
    }
  }, [listOfUser]);

  const addListBtn = () => {
    setListBtnShow((state) => !state);
  };

  const handleToggle = (index) => {
    setShowDropdown((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const removeMember = (val) => {
    const data = {
      uid: uid,
      cid: cid,
      group_id: activeConversationId,
      member_id: val?.member_id?._id,
    };
    AllEmit("remove_group_members", data);
    setMemberList((state) =>
      state.filter((item) => item.member_id?._id !== val?.member_id?._id)
    );
  };

  const addMember = (val) => {
    const data = {
      uid: uid,
      cid: cid,
      group_id: activeConversationId,
      member_ids: [val?._id],
    };
    AllEmit("add_group_members", data);
    setNotMemberList((state) => state.filter((item) => item?._id !== val?._id));
  };

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    if (listBtnOpen) {
      setMemberList(
        value === ""
          ? listOfUser?.group_users
          : listOfUser?.group_users?.filter((val) =>
              `${val.member_id?.first_name} ${val.member_id?.last_name}`
                .toLowerCase()
                .includes(value)
            )
      );
    } else {
      setNotMemberList(
        value === ""
          ? dummyList
          : dummyList?.filter((val) =>
              `${val?.first_name} ${val?.last_name}`
                .toLowerCase()
                .includes(value)
            )
      );
    }
  };

  const addAdmin = (val) => {
    const data = {
      uid: uid,
      group_id: activeConversationId,
      member_id: val?.member_id?._id,
      status: val?.is_admin === 1 ? 0 : 1,
    };
    AllEmit("send_group_admin", data);
  };

  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 120;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setCheckboxStates(isChecked ? 1 : 0);

    const adminsendmsg = {
      uid: uid,
      group_id: activeConversationId,
      cid: cid,
      is_admin_send_message: isChecked ? 1 : 0,
    };
    AllEmit("update_group_message_setting", adminsendmsg);
  };
  useEffect(() => {
    if (listOfUser.is_admin_send_message === 1) {
      setCheckboxStates(1);
    } else {
      setCheckboxStates(0);
    }
  }, []);
  const handleclose = () => {
    setGroupListShow(false);
  };

  return (
    <>
      <Offcanvas
        show={groupListShow}
        onHide={handleclose}
        placement="end"
        className="edit_group_backdrop"
      >
        <div className="pb-2 d-flex align-items-center justify-content-between w-100 border-bottom">
          <h6 className="edit_group_name">{sidebarobjget?.name}</h6>
          <Closeicon width={23} onClick={handleclose} height={23} />
        </div>
        {checkIsAdmin && (
          <div className="mt-3 click-group-btn">
            <Button onClick={addListBtn}>
              {listBtnOpen ? t("Add New Members") : t("Back to members")}
            </Button>
          </div>
        )}
        <div className="w-100 mt-3">
          <Form.Control
            type="text"
            placeholder={t("Search Here...")}
            style={{
              width: "100%",
              color: "var(--main-adminheaderpage-color)",
            }}
            onChange={handleChange}
            className="groupname"
          />
        </div>
        <div
          className="w-100 mt-3"
          style={{ overflow: "auto", height: dynamicHeight }}
        >
          {listBtnOpen
            ? memberList?.map((val) => {
                const imageshowpath = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/${val.image}`;

                const isAdminConditionMet =
                  (val?.is_admin === 1 &&
                    createdGroup[0]?.member_id?._id === val.member_id?._id) ||
                  val.member_id?._id === uid;
                const fullname = `${val.member_id?.first_name} ${val.member_id?.last_name}`;

                return (
                  <Row
                    key={val._id}
                    className="create_group_user align-items-center"
                  >
                    <Col xs={2} className="p-0">
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {val.image ? (
                          <Image
                            src={imageshowpath}
                            style={{ width: "30px", height: "30px" }}
                            alt=""
                            roundedCircle
                          />
                        ) : (
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              background: "grey",
                              borderRadius: "50px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              color: "white",
                            }}
                          >
                            {val?.member_id?.first_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col xs={8}>
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "var(--main-adminheaderpage-color)",
                            fontWeight: "600",
                            fontFamily: "krub",
                            textTransform: "capitalize",
                          }}
                        >
                          {fullname}
                        </div>
                        <p
                          className="forelipsislastmessage m-0"
                          style={{
                            fontSize: "12px",
                            color: "var(--main-adminheaderpage-color)",
                            fontWeight: "600",
                            fontFamily: "krub",
                          }}
                        >
                          {val?.is_admin === 1 ? t("Admin") : t("Member")}
                        </p>
                      </div>
                    </Col>
                    {checkIsAdmin && !isAdminConditionMet && (
                      <Col xs={2} className="text-end">
                        <DropdownButton
                          key={val._id}
                          align="start"
                          id={`dropdown-menu-${val._id}`}
                          show={showDropdown[val._id]}
                          className="custom-dropdown-button"
                          onToggle={() => handleToggle(val._id)}
                          title={
                            <DotsThreeVertical style={{ cursor: "pointer" }} />
                          }
                        >
                          {val?.is_admin == 0 && (
                            <Dropdown.Item
                              eventKey="1"
                              onClick={() => removeMember(val)}
                            >
                              {t("Remove Member")}
                            </Dropdown.Item>
                          )}

                          <Dropdown.Item
                            eventKey="2"
                            onClick={() => addAdmin(val)}
                          >
                            {val?.is_admin === 1
                              ? t("Remove Admin")
                              : t("Add Admin")}
                          </Dropdown.Item>
                        </DropdownButton>
                      </Col>
                    )}
                  </Row>
                );
              })
            : notMemberList?.map((val) => {
                const imageshowpath = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/${val.image}`;
                const fullname = `${val.first_name} ${val.last_name}`;

                return (
                  <Row
                    key={val._id}
                    className="create_group_user align-items-center"
                  >
                    <Col xs={2} className="p-0">
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {val.image ? (
                          <Image
                            src={imageshowpath}
                            style={{ width: "30px", height: "30px" }}
                            alt=""
                            roundedCircle
                          />
                        ) : (
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              background: "grey",
                              borderRadius: "50px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              color: "var(--main-white-color)",
                            }}
                          >
                            {val?.first_name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col xs={8}>
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "var(--main-adminheaderpage-color)",
                            fontWeight: "600",
                            fontFamily: "krub",
                            textTransform: "capitalize",
                          }}
                        >
                          {fullname}
                        </div>
                      </div>
                    </Col>
                    <Col xs={2} className="text-end">
                      <DropdownButton
                        key={val._id}
                        align="start"
                        id={`dropdown-menu-${val._id}`}
                        show={showDropdown[val._id]}
                        className="custom-dropdown-button"
                        onToggle={() => handleToggle(val._id)}
                        title={
                          <DotsThreeVertical style={{ cursor: "pointer" }} />
                        }
                      >
                        <Dropdown.Item
                          eventKey="1"
                          onClick={() => addMember(val)}
                        >
                          {t("Add Member")}
                        </Dropdown.Item>
                      </DropdownButton>
                    </Col>
                  </Row>
                );
              })}
        </div>
        {admin?.map(
          (val) =>
            uid === val?.member_id._id &&
            val?.is_admin === 1 &&
            val?.isleaved === 0 && (
              <div key={val.member_id._id} style={{ width: "100%" }}>
                <hr />
                <div className="musicback" style={{ border: "0px" }}>
                  {t("Only Admin can send message")}
                  <label className="switch">
                    <input
                      type="checkbox"
                      onChange={handleCheckboxChange}
                      checked={checkboxStates}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            )
        )}
      </Offcanvas>
    </>
  );
}
