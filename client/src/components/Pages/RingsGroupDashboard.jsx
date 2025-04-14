import React, { useEffect, useRef, useState } from "react";
import { Button, Card } from "react-bootstrap";
import ProgressCircle from "./CustomeChart";
import { ReactComponent as Usersicon } from "../../Assets/Icon/users-svgrepo.svg";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import RingGroupModal from "../Modal/RingGroupModal";
import Cookies from "js-cookie";
import {
  getapiAll,
  postapiAll,
  putapiall,
} from "../../Redux/Reducers/ApiServices";
import { toast } from "react-toastify";
import config from "../../config";
import { TypeInnumber } from "../ConstantConfig";
function RingsGroupDashboard() {
  const data = useSelector(
    (state) =>
      state.getapiall.getapiall.dashboardData?.DashboardDetail
        ?.ring_group_detail?.ring_group_list
  );
  const userdata = useSelector(
    (state) => state?.postapiAll?.postapiall?.Extension?.usersData
  );
  const { t } = useTranslation();
  let Token = Cookies.get("Token");
  const dispatch = useDispatch();
  const [mode, setmode] = useState("");
  const [selectedValuesSecond, setSelectedValuesSecond] = useState([]);
  const [show, setShow] = useState(false);
  const [savedata, setsavedata] = useState("");
  const [Loader, setLoader] = useState(false);
  const [filteredData, setFilteredData] = useState(null);
  const [EditId, seteditid] = useState(0);
  const [value, setvalue] = useState([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [loader2, setloader2] = useState(true);
  const [ringDropdown, setRingDropDown] = useState({});
  const [allDropdown, setAllDropDown] = useState({});
  const [huntsliderValue, setHuntsliderValue] = useState(0);
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

  useEffect(() => {
    setloader2(true);
    dispatch(
      getapiAll({
        Api: config.EXTENSIONUSERLIST,
        Token: Token,
        urlof: config.EXTENSIONUSERKEY,
      })
    ).then((res) => {
      setloader2(false);
      setvalue(res?.payload?.response?.usersData);
    });
  }, [EditId, show]);

  useEffect(() => {
    if (!filteredData && filteredList?.length > 0) {
      setFilteredData(
        filteredList.find(
          (data) => data.data === editsvalues?.ring_group_timeout_data
        )
      );
    }
  }, [filteredList, userdata, editsvalues]);

  useEffect(() => {
    if (show && editsvalues) {
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
  }, [show, editsvalues, filteredData]);

  useEffect(() => {
    if (show && EditId && value) {
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
        if (values?._id) {
          seteditid(values?._id);
        }
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
  }, [value, show]);

  const OpenModal = (id) => {
    setmode("edit");
    setShow(true);
    setFilteredData("");
    setSelectExtension("");
    setEditsvalues("");
    seteditid(id);
    setFormData([]);
  };
  useEffect(() => {
    setFormData((prevdata) => ({
      ...prevdata,
      ring_group_call_timeout: sliderValue,
    }));
  }, [sliderValue]);

  const handlesavedata = () => {
    const valuesinextion = selectedValuesSecond?.map((item) => item._id);
    const listinvalues = {
      name: formData.name,
      extension: formData.extension,
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
      if (response.payload.response.success == 1) {
        setLoader(false);
        setsavedata(!savedata);
        setFormData("");
        setSelectedValuesFirst([]);
        setSelectedValuesSecond([]);
        setSliderValue(0);
        setSelectExtension("");
        setSelectType("");
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

  const handleClose = () => {
    setFilteredData("");
    setShow(false);
    seteditid("");
    setFormData({
      name: "",
      extension: "",
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

  // console.log("reportsdata", data);
  return (
    <Card className="dear-card">
      <Card.Header className="call_metrics">
        <h2 style={{ marginBottom: "20px" }}>{t("Ring groups")}</h2>
      </Card.Header>

      <div className="table-container3 dashboardtablescroll">
        <div className="table-responsive">
          <table className=" table-news table m-0 ">
            <tbody>
              {data?.map((ele, index) => {
                return (
                  <>
                    <tr
                      className="table-custom-body-trs"
                      style={{
                        borderBottom: "5px solid var(--main-grey-color)",
                      }}
                    >
                      <td className="w40 table-custom-body-td">
                        <div className="icon-in-bg1 bg-orange text-white rounded-circle">
                          <Usersicon className="icon-users fa-2x call-in-icon" />
                        </div>
                      </td>
                      <td className="table-custom-body-td">
                        <small className="small-cusnam">
                          {ele?.ring_group_details?.name}
                        </small>
                        <h6 className="mb-0 small-cusnum">
                          {ele?.ring_group_details?.extension}
                        </h6>
                        <Button
                          size="sm"
                          className="mr-2 new-button-ui"
                          data-toggle="modal"
                          data-target="#routing"
                          onClick={() => OpenModal(ele?.ring_group_details?.ring_group_uuid)}
                        >
                          {t("Open")}
                        </Button>
                      </td>
                      <td className="table-custom-body-td">
                        <ProgressCircle
                          passWholeProgress="progress-circle1"
                          classNames="progress-circle__svg1"
                          pragressLable="progress-circle__label2"
                          Totalcall={ele?.answered + ele?.missed}
                          Answeredcall={ele?.answered}
                          Title1={t("Answered")}
                          Title2={t("Missed")}
                        />
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {show && (
        <RingGroupModal
          ringDropdown={ringDropdown}
          apidropdown={allDropdown}
          handleClosee={handleClose}
          show={show}
          header={t("Ring group")}
          datasaving={handlesavedata}
          formData={formData}
          setFormData={setFormData}
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          selectedValuesFirst={selectedValuesFirst}
          setSelectedValuesFirst={setSelectedValuesFirst}
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
    </Card>
  );
}

export default RingsGroupDashboard;
