import React, { useEffect, useMemo, useState } from "react";
import { Modal, InputGroup, Form, Col, Row, Image } from "react-bootstrap";
import { ReactComponent as Search } from "../../Assets/Icon/search.svg";
import { ReactComponent as Forward } from "../../Assets/Icon/forward.svg";
import { useSelector } from "react-redux";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function ForwardModal({
  forwardModal,
  setForwardModal,
  ForwardMessage,
  setSelectedUsers,
  selectedUsers,
}) {
  // Api config
  let Token = Cookies.get("Token");
  const ForwardApi = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_FORWARD_LIST}`;
  //
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    dispatch(getapiAll({ Api: ForwardApi, Token: Token, urlof: "ForwardApi" }))
      .then((res) => {
        if (res) return setLoader(false);
      })
      .catch((err) => {
        return setLoader(true);
      })
      .finally(() => {
        return setLoader(false);
      });
  }, [dispatch]);
  const { t } = useTranslation();
  const Sidebar = useSelector((state) => state.getapiall.getapiall.ForwardApi);

  const [activeRow, setActiveRow] = useState(null);

  const [dynamicHeight, setDynamicHeight] = useState(0);

  const handleClose = () => {
    setForwardModal(false);
  };

  const handleCheckboxChange = (user, event = null) => {
    if (event.target.checked != null) {
      event.stopPropagation();
      setSelectedUsers((prevSelected) => {
        if (prevSelected.some((u) => u._id === user._id)) {
          return prevSelected?.filter((u) => u._id !== user._id);
        } else {
          return [user, ...prevSelected];
        }
      });
    } else {
      setSelectedUsers((prevSelected) => {
        if (prevSelected.some((u) => u._id === user._id)) {
          return prevSelected?.filter((u) => u._id !== user._id);
        } else {
          return [user, ...prevSelected];
        }
      });
    }
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredSidebarData = useMemo(() => {
    return Sidebar?.filter((item) => {
      if (item.isBlocked == 1) return false;
      if (searchQuery) {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true; // If no search query, keep the item
    });
  }, [searchQuery, Sidebar]);
  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 250;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);

  return (
    <Modal show={forwardModal} onHide={handleClose} dialogClassName="modalsize">
      <div style={{ background: "var(--main-white-color)" }}>
        <Modal.Header
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--main-lightdarkthemeborder-color)",
          }}
        >
          <Modal.Title className="Modaltitle">
            {t("Forward message to")}
          </Modal.Title>
          <Closeicon height={36} width={36} onClick={handleClose} />
        </Modal.Header>
        <div style={{ padding: "10px 10px" }} className="parentforover">
          <InputGroup>
            <InputGroup.Text id="basic-addon1">
              <Search className="searchIcon" />
            </InputGroup.Text>
            <Form.Control
              placeholder={t("Search")}
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={handleSearchChange}
              className="emailforminput"
            />
          </InputGroup>
        </div>
        <div
          style={{
            overflow: "auto",
            height: dynamicHeight,
            // borderRadius: "12px"
            paddingLeft: "5px",
          }}
          className="scrollbarforward"
        >
          {loader ? (
            <div className="loader-container">
              <Spinner
                animation="border"
                role="status"
                style={{ color: "var(--main-orange-color)" }}
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : (
            Sidebar &&
            filteredSidebarData?.map((user, index) => {
              let imageshowpath = `${process.env.REACT_APP_FILE_BASE_URL}/${user.image}`;
              return (
                <Row
                  key={user._id}
                  className={`parentrow ${
                    selectedUsers?.find((su) => su._id === user._id)
                      ? "active-foward"
                      : ""
                  }`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "70px",
                    cursor: "pointer",
                    border: "1px solid var(--main-white-color)",
                  }}
                  onClick={(e) => handleCheckboxChange(user, e)}
                >
                  <Col xs={2}>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {user.image ? (
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
                            background: "var(--main-orange-color)",
                            borderRadius: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "var(--main-btninfo-color)",
                            border: selectedUsers?.find(
                              (su) => su._id === user._id
                            )
                              ? "1.5px solid var(--main-btninfo-color)"
                              : "",
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={8}>
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          fontSize: "16px",
                          color: selectedUsers?.find(
                            (su) => su._id === user._id
                          )
                            ? "white"
                            : "var(--main-adminheaderpage-color)",
                          fontWeight: "600",
                          fontFamily: "krub",
                          textTransform: "capitalize",
                        }}
                      >
                        {user.name}
                      </div>
                      <div
                        className="forelipsislastmessage"
                        style={{
                          fontSize: "12px",
                          color: "var(--main-forwardmodal-color)",
                          fontWeight: "600",
                          fontFamily: "krub",
                          color: selectedUsers?.find(
                            (su) => su._id === user._id
                          )
                            ? "white"
                            : "var(--main-adminheaderpage-color)",
                        }}
                      ></div>
                    </div>
                  </Col>
                </Row>
              );
            })
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            background: " var(--main-hover-color)",
            borderTop: "1px solid var(--main-lightdarkthemeborder-color)",
          }}
        >
          <div
            className="selected-users-container"
            style={{
              padding: "10px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {selectedUsers.map((user, index) => (
              <span
                key={index}
                style={{
                  marginRight: "5px",
                  color: "var(--main-adminheaderpage-color)",
                }}
              >
                {user.name}
                {index > selectedUsers.length - 1 || ","}
              </span>
            ))}
          </div>
          <div style={{ marginRight: "30px", marginTop: "10px" }}>
            <div className="mainsendforward" onClick={() => ForwardMessage()}>
              <Forward
                style={{ width: "30px", height: "30px", fill: "white" }}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ForwardModal;
