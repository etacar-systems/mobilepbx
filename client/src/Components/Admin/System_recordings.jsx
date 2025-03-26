import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import { toast } from "react-toastify";
import DatePickers from "./DatePickers";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import { ReactComponent as Call_logo } from "../../Assets/Icon/call_logo.svg";
import System from "../Modal/System";
import DeleteModal from "../Modal/DeleteModal";
import ListenRecordingModal from "../Modal/ListnerRecord";
import Paginationall from "../Pages/Paginationall";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { deleteapiAll, getapiAll, postapiAll } from "../../Redux/Reducers/ApiServices";
import { useTranslation } from "react-i18next";
import axios from "axios";
import config from "../../config";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import Loader from "../Loader";
import { ClearSearch } from "../ClearSearch";

export default function System_recordings() {
  const { t } = useTranslation();
  const systemlist = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/system/record/list`;
  const deleteapi = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/system/record/delete`;
  const recordUploadUrl = `${process.env.REACT_APP_PBX_API_BASE_URL}${process.env.REACT_APP_ADD_RECORDING_API}`;
  const updaterecordUploadUrl = `${process.env.REACT_APP_PBX_API_BASE_URL}${process.env.REACT_APP_UPDATE_RECORDING_API}`;
  const abortControllerRef = useRef(null);
  const voip_username = process.env.REACT_APP_VOIP_USERNAME;
  const voip_password = process.env.REACT_APP_VOIP_PASSWORD;

  let Token = Cookies.get("Token");
  let domain_uuid = Cookies.get("domain_uuid");
  const systemrecordingdata = useSelector(
    (item) => item.getapiall?.getapiall?.systemrecordinglist?.data
  );
  const dispatch = useDispatch();
  const [value, setvalue] = useState([]);
  const [dragShow, setDragNotShow] = useState(true);
  const [searchTerm, setSearchterm] = useState("");
  const [select, setselect] = useState(10);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [deletemodal, setDeletemodal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveloading, setsaveLoading] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [sortedColumn, setSortedColumn] = useState("");
  const [savedata, setsavedata] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [listner, setListner] = useState(false);
  const [clearFlag, setClearFlag] = useState(true);
  const [files, setFiles] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEdit, setIsEdit] = useState("");
  const [editData, setEditData] = useState("");
  const [recordDate, setRecordDate] = useState();
  const [formData, setFormData] = useState({
    recname: "",
    recdesc: "",
  });
  const [recordingUrl, setRecordingUrl] = useState("");
  const [duplicateData, setDuplicateData] = useState();
  useEffect(() => {
    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    dispatch(
      getapiAll({
        // inputData: inputData,
        Api: systemlist,
        Token: Token,
        urlof: "systemrecording",
        signal: abortController.signal,
      })
    ).then((response) => {
      if (response?.error?.message == "Rejected") {
        setLoading(true);
      } else {
        setDuplicateData(response?.payload?.response?.data);
        setLoading(false);
      }
      setSortedColumn("");
    });
  }, [savedata]);
  const remaneFile = (file) => {
    const timestamp = new Date().getTime();
    const fileNameParts = file.name.split(".");
    const fileExtension = fileNameParts.pop();

    const originalFileNameWithoutExtension = fileNameParts.join(".").replace(/\s+/g, "_");

    const newFileName = `${originalFileNameWithoutExtension}_${timestamp}.${fileExtension}`;

    return new File([file], newFileName, {
      type: file.type,
      lastModified: file.lastModified,
    });
  };
  const handlesavedata = () => {
    const newFile = remaneFile(files[0]);

    setsaveLoading(true);
    const formData1 = new FormData();
    formData1.append("file", newFile);
    formData1.append("domain", domain_uuid);
    formData1.append("description", formData.recdesc);
    formData1.append("name", formData.recname);

    axios
      .post(`${recordUploadUrl}`, formData1, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        auth: {
          username: voip_username,
          password: voip_password,
        },
      })
      .then((res) => {
        setsaveLoading(false);
        if (res?.data?.message == "Failed to Upload Recording File !!") {
          toast.error(res?.data?.message, {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        } else {
          setShow(false);
          toast.success(res?.data?.message, {
            autoClose: config.TOST_AUTO_CLOSE,
          });
          setFiles("");
          setFormData("");
          setsavedata(!savedata);
        }
      })
      .catch((err) => {
        toast.error("Internal Server Error", {
          autoClose: config.TOST_AUTO_CLOSE,
        });
        setsaveLoading(false);
      });
  };

  const handleeditsavedata = () => {
    // const newFile = remaneFile(files[0]);
    let newFile;
    if (files) {
      newFile = remaneFile(files[0]);
    } else {
      newFile = "";
    }

    setsaveLoading(true);

    let data = new FormData();
    data.append("domain", domain_uuid);
    data.append("name", formData?.recname);
    data.append("description", formData?.recdesc);
    data.append("file", newFile);
    data.append("recording_id", editData?.recording_uuid);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: updaterecordUploadUrl,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      auth: {
        username: voip_username,
        password: voip_password,
      },
      data: data,
    };

    axios
      .request(config)
      .then((res) => {
        setsaveLoading(false);
        if (res?.data?.message == "Failed to Upload Recording File !!") {
          toast.error(res?.data?.message, {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        } else {
          setShow(false);
          toast.success(res?.data?.message, {
            autoClose: config.TOST_AUTO_CLOSE,
          });
          setFiles("");
          setFormData("");
          setsavedata(!savedata);
        }
      })
      .catch((err) => {
        toast.error("Internal Server Error", {
          autoClose: config.TOST_AUTO_CLOSE,
        });
        setsaveLoading(false);
      });
  };

  useEffect(() => {
    setvalue(systemrecordingdata);
  }, [systemrecordingdata]);

  const handlelistner = (val) => {
    setListner(true);
    setRecordingUrl(val.recording_url);
    setRecordDate(val.insert_date);
  };

  const handleCloseListner = () => {
    setListner(false);
    setRecordingUrl("");
    setIsEdit("");
  };

  const DeleteItem = () => {
    setDeleteLoading(true);

    const data = {
      record_id: deleteId,
    };
    dispatch(
      deleteapiAll({
        inputData: data,
        Api: deleteapi,
        Token: Token,
        urlof: "deletesystemrecording",
      })
    )
      .then((res) => {
        if (res?.payload?.error) {
          toast.error(res?.payload?.error?.message, {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        } else {
          setDeleteLoading(false);
          handleCloseDelete();
          setCurrentPage(1);
          setsavedata(!savedata);
          setSearchterm("");
          toast.success(res?.payload?.response?.message, {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        }
      })
      .catch((err) => {});
  };

  const openDelete = (id) => {
    setDeletemodal(true);
    setDeleteId(id);
  };

  const handleCloseDelete = () => {
    setDeletemodal(false);
  };

  const openModal = (mode, data) => {
    setIsEdit(mode);
    setEditData(data);
    setShow(true);
    setHeader(t("Add new recording"));
  };

  const openEditModal = (data) => {
    setIsEdit("edit");
    setEditData(data);
    setFormData({
      recname: data?.recording_name,
      recdesc: data?.recording_description,
    });
    // downloadFile(data?.recording_url)
    setShow(true);
    setHeader(t("Edit recording"));
  };

  const handleClose = () => {
    setShow(false);
    setFormData("");
    setFiles("");
  };

  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 445;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData.getData("text/plain");
    if (!clipboardData.startsWith(" ")) {
      setSearchterm(clipboardData.trim());
    }
  };

  const handleSearch = (e) => {
    setLoading(true);
    handlefilter2();
    const search = e?.target?.value.toLowerCase();
    const newSearchTerm = e.target.value;

    const fieldsToInclude = ["recording_filename", "recording_description", "recording_name"];
    if (!newSearchTerm.trim()) {
      setSearchterm("");
      setvalue(systemrecordingdata || []);
      setClearFlag(!clearFlag);
      setLoading(false);
    } else {
      setSearchterm(newSearchTerm);
      setvalue(
        duplicateData?.filter((data) => {
          return Object.entries(data)
            .filter(([key]) => fieldsToInclude.includes(key))
            .some(([, value]) => value?.toString().toLowerCase().includes(search));
        }) || []
      );
      setLoading(false);

      setCurrentPage(1);
    }
  };

  const sortingTable = (name) => {
    if (!value) return;
    let newAscending = ascending;
    setCurrentPage(1);
    if (sortedColumn !== name) {
      newAscending = true;
    }
    const isNumber = (value) => !isNaN(value);

    const sortData = [...value]?.sort((a, b) => {
      if (isNumber(a[name])) {
        if (newAscending) {
          return a[name] - b[name];
        } else {
          return b[name] - a[name];
        }
      } else {
        if (newAscending) {
          return a[name].localeCompare(b[name]);
        } else {
          return b[name].localeCompare(a[name]);
        }
      }
    });
    setSortedColumn(name);
    setAscending(!newAscending);
    setvalue(sortData);
  };
  const clearFilter = () => {
    setvalue(systemrecordingdata);
  };
  const arrowShow = (val) => {
    return (
      <div>
        <Uparrow
          width={10}
          height={20}
          style={{
            filter: sortedColumn === val && ascending ? "opacity(0.5)" : "",
          }}
        />
        <Downarrow
          width={10}
          height={20}
          style={{
            filter: sortedColumn === val && !ascending ? "opacity(0.5)" : "",
            marginLeft: "-4px",
          }}
        />
      </div>
    );
  };

  let displayArr = [];
  if (value?.length > 0) {
    displayArr = [];
    for (
      let i = (currentPage - 1) * select;
      i < Math.min(currentPage * select, value?.length);
      i++
    ) {
      displayArr.push(value[i]);
    }
  }
  const handlefilter = () => {
    setLoading(true);
    let filteredList = systemrecordingdata;

    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate).setHours(0, 0, 0, 0);
      const formattedEndDate = new Date(endDate).setHours(23, 59, 59, 999);

      filteredList = filteredList.filter((data) => {
        const callTimestamp = new Date(data.insert_date).getTime();
        return callTimestamp >= formattedStartDate && callTimestamp <= formattedEndDate;
      });
    }
    setLoading(false);
    setvalue(filteredList);
  };
  const [filter, setfilter] = useState(false);
  const handlefilter2 = () => {
    if (startDate && endDate) {
      setvalue(systemrecordingdata);
      setStartDate("");
      setEndDate("");
      setfilter(!filter);
    }
  };
  const clearSearch = () => {
    setSearchterm("");
  };
  return (
    <div className="tablespadding">
      <AdminHeader openModal={openModal} pathname={t("System recordings")} />
      <DatePickers
        clear={true}
        date_picker={true}
        btn_name={t("Search")}
        fontwidth="500"
        marginb="mb-0"
        bgcolor="white"
        handlefilter={handlefilter}
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        handlefilter2={handlefilter2}
        lg={2}
        width="100%"
      />
      <div className="num_table">
        <div className="table_header">
          <div className="show">
            <h6>{t("Show")}</h6>
            <div className="select_entry">
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => (setselect(e.target.value), setCurrentPage(1))}
                value={select}
              >
                <option>10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Form.Select>
            </div>
            <h6>{t("entries")}</h6>
          </div>
          <div className="table_search">
            <h6>{t("Search")}:</h6>
            <Form.Control
              type="text"
              height={38}
              className="search-bg new-search-add"
              onChange={handleSearch}
              onPaste={handlePaste}
              value={searchTerm}
            />
            {searchTerm && <ClearSearch clearSearch={clearSearch} />}
          </div>
        </div>
        <div
          style={{ overflowX: "auto", height: dynamicHeight, width: "100%" }}
          className="sidebar_scroll"
        >
          <table className="responshive">
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "18%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("recording_name")}
                  >
                    <p className="mb-0">{t("Name")}</p>
                    {arrowShow("recording_name")}
                  </div>
                </th>
                <th style={{ width: "18%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("recording_description")}
                  >
                    <p className="mb-0">{t("Description")} </p>
                    {arrowShow("recording_description")}
                  </div>
                </th>
                <th style={{ width: "25%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("recording_filename")}
                  >
                    <p className="mb-0"> {t("Sound file")}</p>
                    {arrowShow("recording_filename")}
                  </div>
                </th>
                <th style={{ width: "12%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("update_date")}
                  >
                    <p className="mb-0">{t("Date")}</p>
                    {arrowShow("update_date")}
                  </div>
                </th>
                <th style={{ width: "15%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Actions")}</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr style={{ height: dynamicHeight - 50 }}>
                  <td style={{ width: "100%", textAlign: "center" }} colSpan="6">
                    <Loader />
                  </td>
                </tr>
              ) : (
                <>
                  {value && value.length > 0 ? (
                    displayArr?.map((val, index) => {
                      const date = new Date(val?.insert_date);
                      const formattedDate = new Date(date)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, ".");
                      function renameFile(fileName) {
                        return fileName.replace(/_\d+\.(mp3|wav)$/, ".$1");
                      }
                      return (
                        <>
                          <tr className="table_body">
                            <td>{val.recording_name}</td>
                            <td>{val.recording_description}</td>
                            <td>{renameFile(val.recording_filename)}</td>
                            <td>{formattedDate}</td>
                            <td className="table_edit2">
                              <button
                                onClick={() => {
                                  handlelistner(val);
                                }}
                              >
                                <Call_logo width={14} height={14} className="edithover" />
                              </button>

                              <button className="ms-1" onClick={() => openEditModal(val)}>
                                <Edit_logo width={14} height={14} className="edithover" />
                              </button>
                              <button
                                className="ms-1"
                                onClick={() => openDelete(val.recording_uuid)}
                              >
                                <Delete_logo width={14} height={14} className="edithover" />
                              </button>
                            </td>
                          </tr>
                        </>
                      );
                    })
                  ) : (
                    <tr style={{ height: dynamicHeight - 50 }}>
                      <td style={{ width: "100%", textAlign: "center" }} colSpan="6">
                        {t("No data found")}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="show show2 mt-2  d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {(currentPage - 1) * select + 1} {t("to")}{" "}
            {Math.min(currentPage * select, value?.length || 0)} {t("of")} {value?.length || 0}{" "}
            {t("entries")}
          </h6>
          <div>
            <Paginationall
              totalPages={Math.ceil(value?.length / select)}
              currentPage={currentPage}
              setcurrenPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
      {show && (
        <System
          handleClose={handleClose}
          show={show}
          header={header}
          handlesavedata={handlesavedata}
          files={files}
          setFiles={setFiles}
          loader={saveloading}
          formData={formData}
          setFormData={setFormData}
          handleeditsavedata={handleeditsavedata}
          isEdit={isEdit}
        />
      )}
      {deletemodal && (
        <DeleteModal
          handleClose={handleCloseDelete}
          show={deletemodal}
          onDelete={DeleteItem}
          loader={deleteLoading}
        />
      )}
      {listner && (
        <ListenRecordingModal
          show={listner}
          onHide={handleCloseListner}
          recordingUrl={recordingUrl}
          recordDate={recordDate}
        />
      )}
    </div>
  );
}
