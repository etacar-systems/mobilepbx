import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import WpSidebar from "./WpSidebar";
import { useDispatch, useSelector } from "react-redux";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import Cookies from "js-cookie";
import { openChat, openSidebar } from "../../Redux/Reducers/DataServices";
import WpChatScreen from "./WpChatScreen";

export default function WpScreen() {
  // Api Config //
  let Token = Cookies.get("Token");
  let Sidebarapi;
  const dispatch = useDispatch();
  const [sidebarobjget, setSidebarobjget] = useState(null);
  const openchat = useSelector((state) => state.openchat.openchat);
  const [Sidebar, setsidebar] = useState([]);
  const opensidebar = useSelector((state) => state.opensidebar.opensidebar);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 991);
  const [chatLoader, setChatLoder] = useState(false);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [assignNumber, setAssignNumber] = useState(1);
  const [ackAssign, setAckAssign] = useState(false);
  const [refreshState, setRefreshState] = useState(false);
  const [sideClick, setSideClick] = useState(false);

  useEffect(() => {
    const Sidebarapi = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/whatsapp/sidebar?assign_no=${assignNumber}`;
    setLoader(true);
    dispatch(
      getapiAll({ Api: Sidebarapi, Token: Token, urlof: "wpsidebarlist" })
    )
      .then((res) => {
        if (res) return setLoader(false);
      })
      .catch((err) => {
        return setLoader(true);
      })
      .finally(() => {
        return setLoader(false);
      });
  }, [assignNumber, ackAssign]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 991);
    };

    window.addEventListener("resize", handleResize);

    if (isLargeScreen) {
      dispatch(openChat(true));
      dispatch(openSidebar(true));
    } else {
      dispatch(openChat(false));
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLargeScreen, dispatch]);

  return (
    <Container style={{ width: "100%" }} className="p-0" fluid>
      <Row className="m-0">
        <Col
          lg={4}
          style={{
            overflow: "hidden",
            backgroundColor: "var(--main-white-color)",
            height: "100%",
            paddingLeft: "0px",
            paddingRight: "0px",
          }}
        >
          {opensidebar && (
            <>
              <WpSidebar
                setSidebarobjget={setSidebarobjget}
                setChatLoder={setChatLoder}
                loader={loader}
                setLoader={setLoader}
                sidebar={Sidebar}
                currentPage={currentPage}
                setAssignNumber={setAssignNumber}
                setRefreshState={setRefreshState}
                setSideClick={setSideClick}
              />
            </>
          )}
        </Col>

        <Col lg={8}>
          {openchat && (
            <>
              <WpChatScreen
                sidebarobjget={sidebarobjget}
                setSidebarobjget={setSidebarobjget}
                chatLoader={chatLoader}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setAckAssign={setAckAssign}
                refreshState={refreshState}
                sideClick={sideClick}
                setSideClick={setSideClick}
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
