import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { AllEmit } from "./SocketConfig";
import { toast } from "react-toastify";
import axios from "axios";
import { ReactComponent as Icon3 } from "../../Assets/Icon/extension_logo.svg";
import { useTranslation } from "react-i18next";

export default function CreateGroup({ Drawerclose }) {
  const { t } = useTranslation();
  const [fileUrl, setFileUrl] = useState();

  const fileUploadUrl = process.env.REACT_APP_FILE_UPLOAD;
  let imageshowpath = `${process.env.REACT_APP_FILE_BASE_URL}/${fileUrl}`;
  const fileInputRef = useRef(null);

  const NewConversationdata = useSelector(
    (state) => state.getapiall.getapiall.NewConversation
  );
  const [selectUsers, setSelectUsers] = useState([]);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const cid = Cookies.get("Company_Id");
  const uid = Cookies.get("User_id");
  const [groupName, setGroupName] = useState({
    groupname: "",
    description: "",
  });

  const selectUser = (userId) => {
    setSelectUsers((previous) => {
      if (previous.includes(userId)) {
        return previous.filter((val) => val != userId);
      } else {
        return [...previous, userId];
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupName((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectFile = e.target.files[0];
    const formData = new FormData();
    formData.append("file", selectFile);

    axios
      .post(`${fileUploadUrl}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setFileUrl(res.data.filePath);
      })
      .catch((error) => {});
  };

  const createGroup = () => {
    const groupObj = {
      uid: uid,
      cid: cid,
      group_name: groupName.groupname,
      description: groupName.description,
      group_image: fileUrl,
      group_users: selectUsers,
    };
    AllEmit("send_create_group", groupObj);
    toast.success(t("Create Group Successfully"), { autoClose: 2000 });
    setGroupName({
      groupname: "",
      description: "",
    });
    setSelectUsers([]);
    Drawerclose();
  };

  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 422;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);

  const isDisabled =
    selectUsers.length >= 1 && groupName?.groupname.trim() !== "";

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-3 ">
      <div className="w-100 d-flex justify-content-center">
        <div
          onClick={handleAvatarClick}
          className="d-flex align-items-center justify-content-center"
        >
          {fileUrl ? (
            <Image
              src={imageshowpath}
              alt=""
              style={{
                width: "80px",
                height: "80px",
              }}
              roundedCircle
            />
          ) : (
            <div className="group_profile_avtar">
              <Icon3
                style={{
                  width: "30px",
                  height: "30px",
                  fill: "var(--main-phone-color)",
                }}
              />
            </div>
          )}
        </div>

        <Form.Control
          type="file"
          name="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
        />
      </div>
      <h6 className="text-center my-2">{t("Add profile")}</h6>
      <Form className="edit_group_input">
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Control
            type="text"
            placeholder={t("Group Name")}
            name="groupname"
            value={groupName.groupname}
            onChange={handleChange}
            className="groupname"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Control
            type="text"
            placeholder={t("Description")}
            name="description"
            value={groupName.description}
            onChange={handleChange}
            className="groupname"
          />
        </Form.Group>
      </Form>
      <div
        style={{ overflow: "auto", height: dynamicHeight, marginTop: "10px" }}
      >
        {NewConversationdata?.map((val) => {
          let imageshowpath = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/${val.image}`;
          const fullname = val?.first_name + " " + val?.last_name;

          return (
            <Row
              key={val._id}
              className="create_group_user align-items-center"
              onClick={() => selectUser(val._id)}
            >
              <Col xs={2}>
                <div>
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
                        background: "var(--main-orange-color)",
                        borderRadius: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "var(--main-phone-color)",
                      }}
                    >
                      {val.first_name.charAt(0).toUpperCase()}
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
              <Col xs={2} className=" text-end">
                <div>
                  <Form.Check
                    aria-label="option 1"
                    checked={selectUsers?.includes(val?._id)}
                  />
                </div>
              </Col>
            </Row>
          );
        })}
      </div>
      <div className="click-group-btn mt-2">
        <Button disabled={!isDisabled} onClick={createGroup}>
          <p style={{ color: "var(--main-droparear2-color)",marginBottom:"0px" }}>{t("Create Group")}</p>
        </Button>
      </div>
    </div>
  );
}
