import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  InputGroup,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { useTranslation } from "react-i18next";

const ContactModal = ({ setContactlistOpen }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const user = useSelector((state) => state.getapiall.getapiall.ContactList);
  const [serchVal, setSearchVal] = useState("");
  const [member, setMember] = useState([]);
  const call_function = useSelector(
    (state) => state.calling_function.calling_function
  );
  useEffect(() => {
    setMember(user?.response?.UserData);
  }, [user]);

  const filterName = (e) => {
    let values = e.target.value;
    setSearchVal(e.target.value.replace(/[^0-9]/g, ""));
    if (values == "") return setMember(user?.response?.UserData);
    setMember((state) => {
      return state?.filter((val) => {
        const allData = `${val.first_name} ${val.last_name} ${val.endpointNumber}`;
        return allData?.toLowerCase()?.includes(values?.toLowerCase());
      });
    });
  };

  const makeCall = () => {
    const flag = 1;
    const number = selectedValue?.endpointNumber;
    const name = selectedValue?.first_name + " " + selectedValue?.last_name;
    if (number) {
      call_function(number, name, flag);
      setContactlistOpen(false);
      setSearchVal("");
    }
  };
  const { t } = useTranslation();
  return (
    <div className="contact_box new-dial">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="add_call">{t("Add call")}</h6>
        <Closeicon
          width={25}
          onClick={() => {
            setContactlistOpen(false);
          }}
          height={25}
        />
      </div>
      <InputGroup className="mb-3">
        <FormControl
          placeholder={t("search user")}
          aria-label="search user"
          onChange={filterName}
          className="search-bg"
        />
      </InputGroup>
      <div className="addcall_height">
        {serchVal.length !== 0 && (
          <Row className="align-items-center">
            <Col xs={2}>
              <div className="custome_avtar">{serchVal[0]}</div>
            </Col>
            <Col xs={8}>
              <div className="add_name ps-2">
                <p>{serchVal}</p>
              </div>
            </Col>
            <Col xs={2}>
              <Form.Check
                type="radio"
                aria-label="radio 1"
                checked={selectedValue?._id === "new"}
                onChange={() =>
                  setSelectedValue({
                    endpointNumber: serchVal,
                    first_name: "Unknown",
                    last_name: "",
                    _id: "new",
                  })
                }
                value={"new"}
              />
            </Col>
            <hr className="my-2" />
          </Row>
        )}
        {member?.map((m) => (
          <Row key={m._id} className="align-items-center">
            <Col xs={2}>
              <div className="custome_avtar">{m.first_name[0]}</div>
            </Col>
            <Col xs={8}>
              <div className="add_name ps-2">
                <p>
                  {m.first_name} {m.last_name}
                </p>
                <p>{m.endpointNumber}</p>
              </div>
            </Col>
            <Col xs={2}>
              <Form.Check
                type="radio"
                aria-label="radio 1"
                checked={selectedValue?._id === m._id}
                onChange={() => setSelectedValue(m)}
                value={m._id}
              />
            </Col>
            <hr className="my-2" />
          </Row>
        ))}
      </div>
      <Button
        style={{ width: "100%", background: "var(--main-orange-color)" }}
        onClick={makeCall}
        onTouchStart={makeCall}
      >
        {t("Call")}
      </Button>
    </div>
  );
};

export default ContactModal;
