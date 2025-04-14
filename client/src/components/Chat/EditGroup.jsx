import React, { useRef, useState } from "react";
import { Button, DropdownDivider, Form, Image } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { AllEmit } from "./SocketConfig";
import { useTranslation } from "react-i18next";
import config from "../../config";

export default function EditGroup({
  editGroupShow,
  setEditGroupShow,
  sidebarobjget,
  setSidebarobjget,
}) {
  const { t } = useTranslation();
  const fileUploadUrl = process.env.REACT_APP_FILE_UPLOAD;
  const cid = Cookies.get("Company_Id");
  const fileInputRef = useRef(null);
  const [groupName, setGroupName] = useState({
    groupname: sidebarobjget?.name,
    description: sidebarobjget?.description,
  });
  const [fileUrl, setFileUrl] = useState();
  let imageshowpath = fileUrl
    ? `${process.env.REACT_APP_FILE_BASE_URL}/${fileUrl}`
    : `${process.env.REACT_APP_FILE_BASE_URL}/${sidebarobjget?.image}`;

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

  const saveData = () => {
    if (groupName?.groupname.trim() == "") return;
    const obj = {
      group_id: sidebarobjget?._id,
      group_name: groupName?.groupname,
      description: groupName?.description,
      group_image: fileUrl || sidebarobjget?.image || "",
      cid: cid,
      is_admin_send_message: 0,
    };

    AllEmit("send_edit_group", obj);
    setSidebarobjget((prevState) => ({
      ...prevState,
      name: groupName?.groupname,
      description: groupName?.description,
      image: fileUrl || sidebarobjget?.image,
    }));
    setGroupName({
      groupname: "",
      description: "",
    });
    toast.success(t("Edit group successfully"), {
      autoClose: config.TOST_AUTO_CLOSE,
    });
    setEditGroupShow(false);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <>
      <Offcanvas
        show={editGroupShow}
        placement="end"
        className="edit_group_backdrop"
        onHide={() => {
          setEditGroupShow(false);
        }}
      >
        <div className="w-100 position-relative h-100">
          <div className="pb-2 d-flex align-items-center justify-content-between w-100 border-bottom">
            <h6 className="edit_group_name">{t("Edit Group")}</h6>
            <Closeicon
              width={25}
              height={25}
              onClick={() => {
                setEditGroupShow(false);
              }}
            />
          </div>
          <div className="w-100 d-flex justify-content-center mt-3">
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
              ) : sidebarobjget?.image ? (
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
                  {sidebarobjget.name?.charAt(0)?.toUpperCase()}
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
          <h6 className="text-center mt-2" style={{ fontWeight: "500" }}>
            {t("Edit profile")}
          </h6>
          <Form className="mt-4 edit_group_input">
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
          <div className="edit_group_save">
            <Button onClick={saveData}>{t("Save")}</Button>
          </div>
        </div>
      </Offcanvas>
    </>
  );
}
