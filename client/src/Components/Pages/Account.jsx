import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Row, InputGroup, Spinner } from "react-bootstrap";
import cloud from "../../Assets/Icon/cloud-upload.svg";
import DragFile from "../Modal/DragFile";
import { ReactComponent as Hide } from "../../Assets/Icon/hide.svg";
import { ReactComponent as Show } from "../../Assets/Icon/show.svg";
import { useTranslation } from "react-i18next";
import axios from "axios";
import config from "../../config";
import { profileupdate, putapiall } from "../../Redux/Reducers/ApiServices";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ConstantConfig, { new_Password } from "../ConstantConfig";

export default function Account() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragShow, setDragNotShow] = useState(true);

  const dispatch = useDispatch();
  const user_id = Cookies.get("User_id");
  const role = Cookies.get("role");
  let Token = Cookies.get("Token");
  const [saveloading, setsaveLoading] = useState(false);
  const [formdata, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const togglePasswordVisibility3 = () => {
    setShowPassword3(!showPassword3);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [files, setFiles] = useState([]);
  const regexPatterns = {
    new_password: ConstantConfig.EXTENSION.VALIDATION.Password,
    // Contact_person: ConstantConfig.CUSTOMER.Phone_number,
  };
  const validForm = (name, value) => {
    let valid = true;
    const newErrors = {};

    if (!value || !String(value).trim()) {
      newErrors[name] = `${t(name.replace(/_/g, " "))} ${t("is required")}`;
      valid = false;
    } else if (regexPatterns[name] && !value.match(regexPatterns[name])) {
      if (name === new_Password) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${t(
            "please choose a strong password try a mix of letters numbers and symbols"
          )}`,
        }));
        valid = false;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${name} ${t("is invalid")}`,
        }));
        valid = false;
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    return valid;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors({ ...errors, [name]: "" });
    setFormData({ ...formdata, [name]: value });
    validForm(name, value);
  };

  const handleSave = () => {
    let isValid = true;

    for (let key in formdata) {
      if (!validForm(key, formdata[key])) {
        isValid = false;
      }
    }

    if (isValid) {
      setsaveLoading(true);
      const data = new FormData();
      data.append("current_password", formdata.current_password);
      data.append("new_password", formdata.new_password);
      data.append("confirm_password", formdata.confirm_password);
      data.append("user_id", user_id);
      data.append("role", role);
      dispatch(
        putapiall({
          inputData: data,
          Api: config.SETTING.CHANGE_PASS,
          Token: Token,
          urlof: config.SETTING.API_KEY,
        })
      ).then((res) => {
        setsaveLoading(false);
        if (res?.payload?.response) {
          if (res?.payload?.response?.profile_url) {
            Cookies.set("profile_url", res?.payload?.response?.profile_url);
          }
          dispatch(profileupdate(res?.payload?.response.profile_url));
          setFormData({
            current_password: "",
            new_password: "",
            confirm_password: "",
          });
          toast.success(res.payload.response.message, { autoClose: 2000 });
          // setFiles("");
        } else {
          toast.error(res?.payload?.error?.message, { autoClose: 2000 });
        }
      });
    }
  };
  useEffect(() => {
    console.log(files, "filecheckwhatget");
    if (files[0]) {
      setsaveLoading(true);
      const data = new FormData();
      data.append("profile_picture", files[0]);
      data.append("user_id", user_id);
      data.append("role", role);
      dispatch(
        putapiall({
          inputData: data,
          Api: config.SETTING.CHANGE_PASS,
          Token: Token,
          urlof: config.SETTING.API_KEY,
        })
      ).then((res) => {
        setsaveLoading(false);
        if (res?.payload?.response) {
          Cookies.set("profile_url", res?.payload?.response.profile_url);
          dispatch(profileupdate(res?.payload?.response.profile_url));
          setFormData({
            current_password: "",
            new_password: "",
            confirm_password: "",
          });
          toast.success(res.payload.response.message, { autoClose: 2000 });
          setFiles("");
        } else {
          toast.error(res?.payload?.error?.message, { autoClose: 2000 });
        }
      });
    }
  }, [files, dragShow]);
  const removeFunction = () => {
    const data = new FormData();
    data.append("profile_picture", files[0]);
    data.append("user_id", user_id);
    data.append("role", role);
    dispatch(
      putapiall({
        inputData: data,
        Api: config.SETTING.CHANGE_PASS,
        Token: Token,
        urlof: config.SETTING.API_KEY,
      })
    );
  };
  return (
    <div>
      <Row>
        <Col lg={4}>
          <Form.Label className="modal-head mb-4" style={{ fontWeight: "500" }}>
            {t("Change Password")}{" "}
          </Form.Label>
          <div>
            <InputGroup className="">
              <InputGroup.Text
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
                className="modal-icon"
              >
                {showPassword ? (
                  <Show height={15} width={15} />
                ) : (
                  <Hide
                    height={17}
                    width={17}
                    style={{ fill: "var(--main-adminnumberheader-color)" }}
                  />
                )}
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder={t("Current Password")}
                className="search-bg emailforminput input-palceholder"
                name="current_password"
                autocomplete="new-password"
                onChange={handleChange}
                value={formdata.current_password}
              />
            </InputGroup>
            {errors.current_password && (
              <div className="text-danger error-ui ">
                {errors.current_password}
              </div>
            )}
          </div>
          <div className="my-3">
            <InputGroup className="">
              <InputGroup.Text
                onClick={togglePasswordVisibility2}
                style={{ cursor: "pointer" }}
                className="modal-icon"
              >
                {showPassword2 ? (
                  <Show height={15} width={15} />
                ) : (
                  <Hide
                    height={17}
                    width={17}
                    style={{ fill: "var(--main-adminnumberheader-color)" }}
                  />
                )}
              </InputGroup.Text>
              <Form.Control
                type={showPassword2 ? "text" : "password"}
                placeholder={t("New Password")}
                className="search-bg emailforminput input-palceholder"
                name="new_password"
                autocomplete="new-password"
                onChange={handleChange}
                value={formdata.new_password}
              />
            </InputGroup>
            {errors.new_password && (
              <div className="text-danger error-ui ">{errors.new_password}</div>
            )}
          </div>
          <div>
            <InputGroup className="">
              <InputGroup.Text
                onClick={togglePasswordVisibility3}
                style={{ cursor: "pointer" }}
                className="modal-icon"
              >
                {showPassword3 ? (
                  <Show height={15} width={15} />
                ) : (
                  <Hide
                    height={17}
                    width={17}
                    style={{ fill: "var(--main-adminnumberheader-color)" }}
                  />
                )}
              </InputGroup.Text>
              <Form.Control
                type={showPassword3 ? "text" : "password"}
                placeholder={t("Confirm New Password")}
                className="search-bg emailforminput input-palceholder"
                name="confirm_password"
                autocomplete="new-password"
                onChange={handleChange}
                value={formdata.confirm_password}
              />
            </InputGroup>
            {errors.confirm_password && (
              <div className="text-danger error-ui ">
                {errors.confirm_password}
              </div>
            )}
          </div>
        </Col>
        <Col lg={4}>
          <Form.Label className="modal-head mb-4" style={{ fontWeight: "500" }}>
            {t("Profile picture")}{" "}
          </Form.Label>
          <DragFile
            setFiles={setFiles}
            files={files}
            accept={"image/*"}
            setDragNotShow={setDragNotShow}
            dragShow={dragShow}
            removeFunction={removeFunction}
          />
        </Col>
        <div className="d-flex justify-content-start">
          {saveloading ? (
            <button className="btn_save">
              <Spinner animation="border" size="sm" />
            </button>
          ) : (
            <button className="btn_save py-1 px-2" onClick={handleSave}>
              {t("Update")}
            </button>
          )}
          <button
            className="btn_cancel ms-1 py-1 px-2"
            onClick={() => {
              setFormData({
                current_password: "",
                new_password: "",
                confirm_password: "",
              });
              setErrors({});
            }}
          >
            {t("Cancel")}
          </button>
        </div>
      </Row>
    </div>
  );
}
