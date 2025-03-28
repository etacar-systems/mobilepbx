import React, { useEffect, useRef, useState } from "react";
import {AdminHeader} from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import RingGroupModal from "../Modal/RingGroupModal";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  deleteapiAll,
  getapiAll,
  postapiAll,
  putapiall,
} from "../../Redux/Reducers/ApiServices";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import DeleteModal from "../Modal/DeleteModal";
import Paginationall from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
import { AlertLink } from "react-bootstrap";
import config from "../../config";
import { TypeInnumber } from "../ConstantConfig";
import Loader1 from "../Loader";
import { ClearSearch } from "../ClearSearch";

export default function RingGroupTable() {
  const { t } = useTranslation();

  // Api config

  let Token = Cookies.get("Token");
  const abortControllerRef = useRef(null);

  const entries = useSelector(
    (state) =>
      state?.postapiAll?.postapiall?.ringgrouplist?.ring_group_total_counts
  );

  const pages = useSelector(
    (state) => state?.postapiAll?.postapiall?.ringgrouplist?.total_page_count
  );
  const gorups = useSelector(
    (state) => state.postapiAll?.postapiall?.ringgrouplist?.RingGroupList
  );
  const dataaaa = useSelector(
    (state) => state?.postapiAll?.postapiall?.Extension?.usersData
  );
  const dispatch = useDispatch();

  const [Row, setRow] = useState([]);
  const [selectedValuesSecond, setSelectedValuesSecond] = useState([]);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [searchTerm, setSearchterm] = useState("");
  const [select, setselect] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletemodal, setDeletemodal] = useState(false);
  const [mode, setmode] = useState("");
  const [savedata, setsavedata] = useState("");
  const [Loader, setLoader] = useState(false);
  const [filteredData, setFilteredData] = useState(null);
  const [deleteId, setDeleteId] = useState(0);
  const [EditId, seteditid] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [sortedColumn, setSortedColumn] = useState("");
  const [datavalues, setdatavalues] = useState([]);
  const [value, setvalue] = useState([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [ascending, setAscending] = useState(true);
  const [loader2, setloader2] = useState(true);
  const [ringDropdown, setRingDropDown] = useState({});
  const [allDropdown, setAllDropDown] = useState({});
  const [huntsliderValue, setHuntsliderValue] = useState(0);
  const [recordCall, setRecordCall] = useState(false);
  const [selectType, setSelectType] = useState({
    id: "",
    display: "",
  });

  const [editsvalues, setEditsvalues] = useState();
  const [filteredList, setFilteredList] = useState([]);
  const [selectExtension, setSelectExtension] = useState({
    app: "",
    data: "",
    display: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    extension: "",
    record_calls: false, //new
    ring_group_description: "",
    ring_group_greeting: "",
    ring_group_strategy: "",
    ring_group_call_timeout: 0,
    ring_group_caller_id_number: "",
    ring_group_caller_id_name: "",
    destinations: [],
    ring_group_ringback: "",
    ring_group_missed_call_app: "",
    ring_group_missed_call_data: "",
    ring_group_forward_number: "",
    ring_group_forward_destination: "",
    ring_group_timeout_data: "",
    ring_group_timeout_app: "",
    ring_group_forward_toll_allow: "",
    ring_group_call_forward_enabled: false,
    destination: "",
    skip_busy_agent: false,
  });

  const [selectedValuesFirst, setSelectedValuesFirst] = useState([]);
  useEffect(() => {
    setSelectedValuesFirst(value);
  }, [value]);
  let startEntry = (currentPage - 1) * select + 1;
  if (entries === 0) {
    startEntry = 0;
  }
  let endEntry = currentPage * select;
  if (endEntry > entries) {
    endEntry = entries;
  }
  useEffect(() => {
    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const inputData = {
      search: searchTerm.toLowerCase(),
      page: currentPage,
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
      }
      setSortedColumn("");
    });
  }, [searchTerm, select, currentPage, savedata]);

  useEffect(() => {
    setRow(gorups);
  }, [gorups]);

  useEffect(() => {
    setloader2(true);
    dispatch(
      getapiAll({
        Api: config.EXTENSIONUSERLIST,
        Token: Token,
        urlof: config.EXTENSIONUSERKEY,
      })
    ).then((res) => {
      if (res.payload.response) {
        setloader2(false);
        setvalue(res?.payload?.response?.usersData);
      }
    });
  }, [mode, EditId]);
  useEffect(() => {
    if (!filteredData && filteredList?.length > 0) {
      setFilteredData(
        filteredList.find(
          (data) => data.data === editsvalues?.ring_group_timeout_data
        )
      );
    }
  }, [filteredList, dataaaa, editsvalues]);

  useEffect(() => {
    if (mode === "edit" && editsvalues) {
      setSelectExtension({
        app: editsvalues.ring_group_timeout_app,
        data: editsvalues.ring_group_timeout_data,
        display: filteredData?.extension || filteredData?.name,
      });
      setSelectType({
        id: editsvalues.ring_group_caller_id_number?.toString(),
        display:
          TypeInnumber.find(
            (t) => t.value == editsvalues.ring_group_caller_id_number
          )?.type || "",
      });
    }
  }, [mode, editsvalues, filteredData]);

  useEffect(() => {
    if (mode === "edit" && EditId && value) {
      setloader2(true);
      setLoader(true);
      const data = { ring_group_id: EditId };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.RING_GROUP.DETAIL,
          Token: Token,
          urlof: config.RING_GROUP_KEY.DETAIL,
        })
      ).then((response) => {
        setloader2(false);
        setLoader(false);
        const values = response?.payload?.response?.RingGroupDatil;
        setEditsvalues(values);
        setFormData({
          ring_group_uuid: values?.ring_group_uuid,
          context: values?.context,
          domain_id: values?.domain_id,
          name: values?.name,
          extension: values?.extension,
          record_calls: values?.record_calls, //new
          ring_group_description: values?.ring_group_description,
          ring_group_greeting: values?.ring_group_greeting,
          ring_group_strategy: values?.ring_group_strategy,
          ring_group_call_timeout: values?.ring_group_call_timeout,
          ring_group_caller_id_number: values?.ring_group_caller_id_number,
          ring_group_caller_id_name: values?.ring_group_caller_id_name,
          timeout_destination: values?.timeout_destination,
          call_timeout: values?.call_timeout,
          destinations: values?.destinations,
          ring_group_follow_me_enabled: values?.ring_group_follow_me_enabled,
          ring_group_ringback: values?.ring_group_ringback,
          user_list: values?.user_list,
          ring_group_call_forward_enabled:
            values?.ring_group_call_forward_enabled === "true", // Convert to boolean
          ring_group_missed_call_app: values?.ring_group_missed_call_app,
          ring_group_missed_call_data: values?.ring_group_missed_call_data,
          ring_group_forward_enabled: values?.ring_group_forward_enabled,
          ring_group_forward_number: values?.ring_group_forward_number,
          ring_group_forward_destination:
            values?.ring_group_forward_destination,
          ring_group_timeout_data: values?.ring_group_timeout_data,
          ring_group_timeout_app: values?.ring_group_timeout_app,
          ring_group_forward_toll_allow: values?.ring_group_forward_toll_allow,
          ring_group_enabled: values?.ring_group_enabled,
          skip_busy_agent:
            values?.skip_busy_agent == undefined ? "false" : "true",
        });
        setRecordCall(values?.record_calls);
        setHuntsliderValue(values?.ring_hunt_timeout);
        setSliderValue(values?.ring_group_call_timeout);
        const selectedIds = values?.destinations || [];
        const matchedObjects =
          value
            ?.filter((item) => selectedIds.includes(item._id))
            .sort(
              (a, b) => selectedIds.indexOf(a._id) - selectedIds.indexOf(b._id)
            ) || [];
        const unmatchedObjects =
          value?.filter((item) => !selectedIds.includes(item._id)) || [];
        setSelectedValuesFirst(unmatchedObjects);
        setSelectedValuesSecond(matchedObjects);
      });
    }
  }, [value, mode]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    if (!newSearchTerm.trim()) {
      setSearchterm("");
    } else {
      setSearchterm(newSearchTerm);
      setCurrentPage(1);
    }
  };

  const handleEdit = (id) => {
    setFilteredData("");
    setSelectExtension("");
    setEditsvalues("");
    setmode("edit");
    seteditid(id);
    setShow(true);
    setFormData({
      name: "",
      extension: "",
      record_calls: false,
      ring_group_description: "",
      ring_group_greeting: "",
      ring_group_strategy: "",
      ring_group_call_timeout: 0,
      ring_group_caller_id_number: "",
      ring_group_caller_id_name: "",
      destinations: [],
      ring_group_ringback: "",
      ring_group_missed_call_app: "",
      ring_group_missed_call_data: "",
      ring_group_forward_number: "",
      ring_group_forward_destination: "",
      ring_group_timeout_data: "",
      ring_group_timeout_app: "",
      ring_group_forward_toll_allow: "",
      ring_group_call_forward_enabled: false,
      destination: "",
      skip_busy_agent: false,
    });
    setHeader(t("Edit ring groups"));
  };
  useEffect(() => {
    setFormData((prevdata) => ({
      ...prevdata,
      ring_group_call_timeout: sliderValue,
    }));
  }, [sliderValue]);

  useEffect(() => {
    setFormData((prevdata) => ({
      ...prevdata,
      record_calls: recordCall,
    }));
  }, [recordCall]);

  const handlesavedata = () => {
    const valuesinextion = selectedValuesSecond?.map((item) => item._id);
    const listinvalues = {
      name: formData.name,
      extension: formData.extension,
      record_calls: formData.record_calls,
      ring_group_description: formData.ring_group_description,
      ring_group_greeting: "Lights(chosic.com).mp3",
      ring_group_strategy: formData.ring_group_strategy,
      ring_group_call_timeout: formData.ring_group_call_timeout,
      ring_group_caller_id_number: selectType.id,
      ring_group_caller_id_name: "RingGroup",
      timeout_destination: formData.timeout_destination,
      destinations: valuesinextion,
      // ring_group_follow_me_enabled: checkboxStates.ring_group_follow_me_enabled ? "true" : "false",
      ring_group_ringback: "${us-ring}",
      ring_group_call_forward_enabled: "true",
      ring_group_missed_call_app: formData.ring_group_missed_call_app,
      ring_group_missed_call_data: formData.ring_group_missed_call_data,
      ring_group_forward_enabled: "true",
      ring_group_forward_number: formData.ring_group_forward_number,
      ring_group_forward_destination: formData.ring_group_forward_destination,
      ring_group_timeout_data: selectExtension.data,
      ring_group_timeout_app: selectExtension.app,
      ring_group_forward_toll_allow: formData.ring_group_forward_toll_allow,
      ring_group_enabled: "true",
      ring_group_follow_me_enabled: "true",
      skip_busy_agent: formData.skip_busy_agent,
      ring_hunt_timeout: huntsliderValue,
    };
    if (mode === "add") {
      setLoader(true);
      const data = listinvalues;
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.RING_GROUP.ADD,
          Token: Token,
          urlof: config.RING_GROUP_KEY.ADD,
        })
      ).then((response) => {
        if (response.payload.response) {
          setLoader(false);
          setsavedata(!savedata);
          setCurrentPage(1);
          setSearchterm("");
          setFormData("");
          setSelectExtension("");
          setSelectType("");
          setSelectedValuesFirst([]);
          setSelectedValuesSecond([]);
          setSliderValue(0);
          // setCheckboxStates([]);
          setmode("");
          toast.success(t(response?.payload?.response?.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
          handleClose();
        } else {
          setLoader(false);
          toast.error(t(response?.payload?.error?.response?.data?.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        }
      });
    }
    if (mode === "edit") {
      setLoader(true);
      const data = {
        ring_group_id: EditId,
        ...listinvalues,
        ring_group_uuid: formData.ring_group_uuid,
        domain_id: formData.domain_id,
        context: formData.context,
      };

      dispatch(
        putapiall({
          inputData: data,
          Api: config.RING_GROUP.UPDATE,
          Token: Token,
          urlof: config.RING_GROUP_KEY.UPDATE,
        })
      ).then((response) => {
        if (response.payload.response) {
          setLoader(false);
          setsavedata(!savedata);
          setCurrentPage(1);
          setSearchterm("");
          setFormData("");
          setSelectedValuesFirst([]);
          setSelectedValuesSecond([]);
          setSliderValue(0);
          setSelectExtension("");
          setSelectType("");
          // setCheckboxStates([]);
          setmode("");
          toast.success(t(response.payload.response.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
          handleClose();
        } else {
          setLoader(false);
          toast.error(t(response.payload.error.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        }
      });
    }
  };

  const DeleteItem = () => {
    setLoader(true);
    let data = {
      ring_group_id: deleteId,
    };
    dispatch(
      deleteapiAll({
        inputData: data,
        Api: config.RING_GROUP.DELETE,
        Token: Token,
        urlof: config.RING_GROUP_KEY.DELETE,
      })
    ).then((response) => {
      if (response.payload.response) {
        handleCloseDelete();
        setsavedata(!savedata);
        setLoader(false);
        handleCloseDelete();
        setCurrentPage(1);
        setsavedata(!savedata);
        setSearchterm("");
        toast.success(t(response.payload.response.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      } else {
        setLoader(false);
        toast.error(t(response.payload.error.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      }
    });
  };

  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.DROPDOWN.URL.RING,
        Token: Token,
        urlof: config.DROPDOWN.KEY.RING,
      })
    ).then((response) => {
      setRingDropDown(response?.payload?.response?.data || {});
    });
  }, []);

  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.DROPDOWN.URL.ALL_GET,
        Token: Token,
        urlof: config.DROPDOWN.KEY.ALL_GET,
      })
    ).then((response) => {
      setAllDropDown(response?.payload?.response?.data || {});
    });
  }, []);

  const openDelete = (id) => {
    setLoader(false);
    setDeletemodal(true);
    setDeleteId(id);
  };

  const handleCheckboxChange = () => {
    setRecordCall(!recordCall);
  };

  const handleCloseDelete = () => {
    setLoader(false);
    setDeletemodal(false);
    setDeleteId("");
  };

  const openModal = () => {
    setSelectedValuesFirst([]);
    setSelectedValuesSecond([]);
    setShow(true);
    setHeader(t("Add new ring groups"));
    setmode("add");
    setFormData("");
    setSelectExtension("");
    // setCheckboxStates("");
    setSliderValue(0);
  };

  const handleClose = () => {
    setFilteredData("");
    setShow(false);
    seteditid("");
    setmode("");
    setFormData({
      name: "",
      extension: "",
      record_calls: false, //new
      ring_group_description: "",
      ring_group_greeting: "",
      ring_group_strategy: "",
      ring_group_call_timeout: "",
      ring_group_caller_id_number: "",
      ring_group_caller_id_name: "",
      destinations: [],
      ring_group_ringback: "",
      ring_group_missed_call_app: "",
      ring_group_missed_call_data: "",
      ring_group_forward_number: "",
      ring_group_forward_destination: "",
      ring_group_timeout_data: "",
      ring_group_timeout_app: "",
      ring_group_forward_toll_allow: "",
      ring_group_call_forward_enabled: false,
      destination: "",
      skip_busy_agent: false,
    });
    setSelectedValuesFirst([]);
    setSelectedValuesSecond([]);
    setSelectType("");
    setSelectExtension("");
  };

  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 300;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);

  const sortingTable = (name) => {
    if (!Row) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }

    const sortData = [...Row].sort((a, b) => {
      const valueA = a[name];
      const valueB = b[name];
      if (
        name === "ring_group_phone_number" ||
        name === "ring_group_duration"
      ) {
        const stra = parseInt(valueA);
        const strb = parseInt(valueB);
        return newAscending ? stra - strb : strb - stra;
      } else {
        const strA = String(valueA);
        const strB = String(valueB);
        return newAscending
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      }
    });
    setSortedColumn(name);
    setAscending(!newAscending);
    setRow(sortData);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData.getData("text/plain");
    if (!clipboardData.startsWith(" ")) {
      setSearchterm(clipboardData.trim());
    }
  };
  const clearSearch = () => {
    setSearchterm("");
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

  return (
    <div className="tablespadding">
      <AdminHeader openModal={openModal} />
      <div className="num_table">
        <div className="table_header">
          <div className="show">
            <h6>{t("Show")}</h6>
            <div className="select_entry">
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => {
                  setselect(e.target.value);
                  setCurrentPage(1);
                }}
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
              onChange={handleSearchChange}
              value={searchTerm}
              onPaste={handlePaste}
            />
            {searchTerm && <ClearSearch clearSearch={clearSearch} />}
          </div>
        </div>
        <div
          style={{ overflowX: "auto", height: dynamicHeight }}
          className="sidebar_scroll"
        >
          <table className="responshive">
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "19%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("name")}
                  >
                    <p className="mb-0">{t("Name")}</p>
                    {arrowShow("name")}
                  </div>
                </th>
                <th style={{ width: "20%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("ring_group_description")}
                  >
                    <p className="mb-0">{t("Description")}</p>
                    {arrowShow("ring_group_description")}
                  </div>
                </th>
                <th style={{ width: "19%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("assign_pstn_number")}
                  >
                    <p className="mb-0">{t("Phone Number")}</p>
                    {arrowShow("assign_pstn_number")}
                  </div>
                </th>
                <th style={{ width: "18%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("extension")}
                  >
                    <p className="mb-0">{t("Extension")}</p>
                    {arrowShow("extension")}
                  </div>
                </th>

                <th style={{ width: "12%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("createdAt")}
                  >
                    <p className="mb-0">{t("Date")}</p>
                    {arrowShow("createdAt")}
                  </div>
                </th>
                <th style={{ width: "12%" }}>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {Loading ? (
                <tr style={{ height: dynamicHeight - 50 }}>
                  <td
                    style={{ width: "100%", textAlign: "center" }}
                    colSpan="6"
                  >
                    <Loader1 />
                  </td>
                </tr>
              ) : (
                <>
                  {Row && Row.length > 0 ? (
                    <>
                      {Row?.map((val, index) => {
                        const date = new Date(val?.createdAt);
                        const formattedDate = new Date(date)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, ".");
                        // const localDateString = date.toLocaleString();
                        return (
                          <tr key={index} className="table_body">
                            <td>{val.name}</td>
                            <td>{val.ring_group_description}</td>
                            <td>
                              {val.assign_pstn_number
                                ? val.assign_pstn_number
                                : t("Not Assigned")}
                            </td>
                            <td>{val.extension}</td>
                            <td>{formattedDate}</td>
                            <td className="table_edit">
                              <button onClick={() => handleEdit(val?._id)}>
                                <Edit_logo
                                  width={14}
                                  height={14}
                                  className="edithover"
                                />
                              </button>
                              <button
                                className="ms-1"
                                onClick={() => openDelete(val?._id)}
                              >
                                <Delete_logo
                                  width={14}
                                  height={14}
                                  className="edithover"
                                />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <tr style={{ height: dynamicHeight - 50 }}>
                      <td
                        style={{ width: "100%", textAlign: "center" }}
                        colSpan="6"
                      >
                        {t("No data found")}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>{" "}
        </div>
        <div className="show show2 mt-2  d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")} {entries}{" "}
            {t("entries")}
          </h6>
          <Paginationall
            totalPages={pages}
            currentPage={currentPage}
            setcurrenPage={setCurrentPage}
          />
        </div>
      </div>
      {show && (
        <RingGroupModal
          handleRecordCall={handleCheckboxChange}
          recordCall={recordCall}
          ringDropdown={ringDropdown}
          apidropdown={allDropdown}
          handleClosee={handleClose}
          show={show}
          header={header}
          datasaving={handlesavedata}
          formData={formData}
          setFormData={setFormData}
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          selectedValuesFirst={selectedValuesFirst}
          setSelectedValuesFirst={setSelectedValuesFirst}
          // checkboxStates={checkboxStates}
          // setCheckboxStates={setCheckboxStates}
          selectedValuesSecond={selectedValuesSecond}
          setSelectedValuesSecond={setSelectedValuesSecond}
          loader={Loader}
          loader2={loader2}
          selectType={selectType}
          setSelectType={setSelectType}
          setSelectExtension={setSelectExtension}
          selectExtension={selectExtension}
          filteredList={filteredList}
          setFilteredList={setFilteredList}
          mode={mode}
          huntsliderValue={huntsliderValue}
          setHuntsliderValue={setHuntsliderValue}
        />
      )}
      {deletemodal && (
        <DeleteModal
          handleClose={handleCloseDelete}
          show={deletemodal}
          onDelete={DeleteItem}
          loader={Loader}
        />
      )}
    </div>
  );
}
