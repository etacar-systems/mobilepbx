import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useTranslation } from "react-i18next";
import { InputGroup } from "react-bootstrap";
import noUiSlider from "nouislider";
import Spinner from "react-bootstrap/Spinner";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  remoteNoAnswerStrategy,
  ringGroupsFormDto,
  ringStrategy,
  TRingGroupsFormArgs,
} from "./form.dto";
import { DropDown } from "../../../../../shared";
import { withNameList } from "../../../../../../hocs";
import {
  TExtensionNamesOutputs,
  useNameListQuery,
} from "../../../../../../requests/queries";
import CustomTooltipModal from "../../../../../CustomTooltipModal";

import "nouislider/dist/nouislider.css";

import { ReactComponent as Closeicon } from "../../../../../../Assets/Icon/close.svg";
import switchimg from "../../../../../../Assets/Image/switch.png";

interface IRingGroupModalProps {
  mode: "edit" | "add";
  extensions: TExtensionNamesOutputs;
  handleClose: () => void;
  onSubmit?: (
    data: TRingGroupsFormArgs & {
      ring_group_timeout_data: string;
      ring_group_timeout_app: string;
    }
  ) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<TRingGroupsFormArgs>;
}

export const RingGroupModal = withNameList(
  ({
    handleClose,
    extensions,
    mode,
    onSubmit: onExternalSubmit,
    isSubmitting,
    defaultValues,
  }: IRingGroupModalProps) => {
    const { t } = useTranslation();
    const sliderRef = useRef<HTMLDivElement>(null);

    const {
      register,
      handleSubmit,
      getValues,
      setValue,
      watch,
      formState: { errors },
    } = useForm<TRingGroupsFormArgs>({
      resolver: zodResolver(ringGroupsFormDto),
      defaultValues: {
        ...defaultValues,
        duration: defaultValues?.duration || 0,
      },
    });

    const { data: namelist } = useNameListQuery({
      enabled: !!watch("remote_no_answer_strategy"),
      key: watch("remote_no_answer_strategy"),
    });

    useEffect(() => {
      if (sliderRef.current) {
        const slider = noUiSlider.create(sliderRef.current, {
          start: [getValues("duration")],
          connect: "lower",
          step: getValues("strategy") === "sequence" ? 5 : 1,
          range: {
            min: 0,
            max: 100,
          },
        });
        slider.on("slide", (values, handle) => {
          setValue("duration", parseInt(values[handle].toString()));
        });

        return () => {
          slider.destroy();
        };
      }
    }, [getValues, setValue, watch("strategy")]);

    const handleKeyPress = (e: KeyboardEvent<any>) => {
      if (e.key < "0" || e.key > "9") {
        e.preventDefault();
      }
    };

    const handleAddExtensionToGroup = useCallback(
      (extension: string) => {
        const prev = getValues("extensions") || [];

        if (!prev.includes(extension)) {
          setValue("extensions", [...prev, extension].sort());
        }
      },
      [getValues, setValue]
    );

    const handleRemoveExtensionFromGroup = useCallback(
      (extension: string) => {
        const prev = getValues("extensions") || [];

        if (prev.includes(extension)) {
          setValue(
            "extensions",
            prev.filter((val) => val !== extension)
          );
        }
      },
      [getValues, setValue]
    );

    const onSubmit: SubmitHandler<TRingGroupsFormArgs> = useCallback(
      (data) => {
        const uuid = data.endpoint_uuid;
        const currentEndpoint = namelist?.find(
          (endpoint) => endpoint.uuid === uuid
        );

        if (!currentEndpoint) return;

        onExternalSubmit &&
          onExternalSubmit({
            ...data,
            ring_group_timeout_data: currentEndpoint.data,
            ring_group_timeout_app: currentEndpoint.app,
          });
      },
      [namelist, onExternalSubmit]
    );
    return (
      <Modal show={true} size="lg">
        <Form onSubmit={handleSubmit(onSubmit)} className="modal-data">
          <div
            className="p-3"
            style={{
              borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between add_new_num">
              <h6>
                {mode === "edit"
                  ? t("Edit ring groups")
                  : t("Add new ring groups")}
              </h6>
              <Closeicon width={23} onClick={handleClose} height={23} />
            </div>
          </div>
          <div className="p-3">
            <div
              style={{
                borderBottom:
                  "1px solid var(--main-bordermodaldashboard-color)",
                paddingBottom: "30px",
              }}
            >
              <Row>
                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Ring group name")}
                    <CustomTooltipModal tooltip={t("Enter name")} />
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      className="search-bg"
                      {...register("name")}
                    />
                  </InputGroup>
                  {errors.name?.message && (
                    <div className="text-danger error-ui">
                      {t(errors.name.message)}
                    </div>
                  )}
                </Col>

                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Ring group description")}
                    <CustomTooltipModal tooltip={t("Enter the description")} />
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      className="search-bg"
                      {...register("description")}
                    />
                  </InputGroup>
                  {errors.description?.message && (
                    <div className="text-danger error-ui">
                      {t(errors.description.message)}
                    </div>
                  )}
                </Col>
                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Ring group extension")}
                    <CustomTooltipModal tooltip={t("Enter extension number")} />
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      disabled={mode === "edit"}
                      className="search-bg"
                      {...register("extension")}
                      onKeyPress={handleKeyPress}
                    />
                  </InputGroup>
                  {errors.extension?.message && (
                    <div className="text-danger error-ui">
                      {t(errors.extension.message)}
                    </div>
                  )}
                </Col>
                <Col lg={4} className="mt-5">
                  <div className="mb-2">
                    <Form.Label className="modal-head">
                      {t("Ring group strategy")}
                      <CustomTooltipModal
                        tooltip={t("Select the ring strategy")}
                      />
                    </Form.Label>
                    <DropDown
                      valueKey={"key"}
                      labelKey={"label"}
                      options={
                        ringStrategy as unknown as Array<{
                          [key: string]: string;
                        }>
                      }
                      placeHolder={t("None selected")}
                      value={watch("strategy")}
                      {...register("strategy", {
                        onChange() {
                          setValue("duration", 0);
                        },
                      })}
                    />
                    {errors.strategy?.message && (
                      <div className="text-danger error-ui">
                        {t(errors.strategy.message)}
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: "30px" }}>
                    <Form.Label className="modal-head">
                      {watch("strategy") === "sequence"
                        ? t("Ring Hunt")
                        : t("Ring group duration")}
                    </Form.Label>
                    <div style={{ marginLeft: "2px" }} ref={sliderRef}></div>
                    <div className="second_sek">
                      <strong>{t("Seconds")}:</strong> {watch("duration")}{" "}
                      {t("sec")}
                    </div>
                    {errors.duration?.message && (
                      <div className="text-danger error-ui">
                        {t(
                          watch("strategy") === "sequence"
                            ? "Ring hunt "
                            : "Ring group "
                        ) + errors.duration.message}
                      </div>
                    )}
                  </div>
                  <Col
                    xs={12}
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <div className="record-modal-head d-flex justify-content-between">
                      {t("Record calls")}
                      <label
                        className="record_switch"
                        style={{ marginLeft: "8px" }}
                      >
                        <input
                          type="checkbox"
                          {...register("record_calls")}
                        />
                        <span className="record_slider"></span>
                      </label>
                    </div>
                  </Col>
                </Col>
                <Col lg={8} className="mt-5">
                  <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ width: "46%" }}>
                      <Form.Label className="modal-head">
                        {t("Select extensions")}
                      </Form.Label>

                      <div
                        className=""
                        style={{
                          width: "100%",
                          height: "200px",
                          border:
                            "1px solid var(--main-bordermodaldashboard-color)",
                          overflowY: "auto",
                          borderRadius: "3px",
                        }}
                      >
                        {extensions
                          .filter(
                            (val) =>
                              !(watch("extensions") || []).includes(
                                val.extension
                              )
                          )
                          .map((val) => (
                            <div
                              key={val.uuid}
                              style={{
                                fontSize: "14px",
                                borderBottom:
                                  "1px solid var(--main-bordermodaldashboard-color)",
                                padding: "3px 7px",
                                fontWeight: "300",
                              }}
                              className="valueofdrag"
                              onClick={() =>
                                handleAddExtensionToGroup(val.extension)
                              }
                            >
                              {val.extension}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        width: "8%",
                      }}
                    >
                      <img src={switchimg} alt="img" height={21} width={21} />
                    </div>
                    <div style={{ width: "46%" }}>
                      <Form.Label className="modal-head">
                        {t("Selected extensions")}
                      </Form.Label>
                      <InputGroup className="">
                        <div
                          className=""
                          style={{
                            width: "100%",
                            height: "200px",
                            border:
                              "1px solid var(--main-bordermodaldashboard-color)",
                            overflowY: "auto",
                            borderRadius: "3px",
                          }}
                        >
                          {watch("extensions")?.map((val) => (
                            <div
                              key={val}
                              style={{
                                fontSize: "14px",
                                padding: "3px 7px",
                                borderBottom:
                                  "1px solid var(--main-bordermodaldashboard-color)",
                                fontWeight: "300",
                              }}
                              className="valueofdrag"
                              onClick={() =>
                                handleRemoveExtensionFromGroup(val)
                              }
                            >
                              {val}
                            </div>
                          ))}
                        </div>
                      </InputGroup>
                      {errors.extensions?.message && (
                        <div className="text-danger error-ui ">
                          {t(errors.extensions.message)}
                        </div>
                      )}
                    </div>
                  </div>
                </Col>

                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">
                    {t("Remote no answer")}
                  </Form.Label>
                  <DropDown
                    valueKey={"key"}
                    labelKey={"label"}
                    options={
                      remoteNoAnswerStrategy as unknown as Array<{
                        label: string;
                        key: string;
                      }>
                    }
                    placeHolder={t("None selected")}
                    value={watch("remote_no_answer_strategy")}
                    {...register("remote_no_answer_strategy", {
                      onChange: () => {
                        setValue("endpoint_uuid", "");
                      },
                    })}
                  />

                  {errors.remote_no_answer_strategy?.message && (
                    <p className="text-danger error-ui">
                      {t(errors.remote_no_answer_strategy.message)}
                    </p>
                  )}
                </Col>

                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">
                    {t("No answer endpoint")}
                  </Form.Label>
                  <DropDown
                    valueKey={"uuid"}
                    labelKey={
                      watch("remote_no_answer_strategy") === "recording"
                        ? "name"
                        : "extension"
                    }
                    options={namelist}
                    placeHolder={t("None selected")}
                    value={watch("endpoint_uuid")}
                    {...register("endpoint_uuid")}
                  />
                  {errors.endpoint_uuid?.message && (
                    <p className="text-danger error-ui">
                      {t(errors.endpoint_uuid.message)}
                    </p>
                  )}
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head m-0">
                    {t("Automatic SMS sender")}
                  </Form.Label>
                  <div
                    className="musicback border-0"
                    style={{ gap: "6px", padding: "0.75rem 0" }}
                  >
                    {t("Activate")}
                    <label className="switch">
                      <input
                        {...register("active")}
                        type="checkbox"
                        id="skipBusyAgent"
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <Row className="align-items-center my-2">
                    <Col xs={12}>
                      <textarea
                        placeholder={t("SMS message")}
                        style={{
                          width: "100%",
                          padding: "6px 12px",
                          height: "100px",
                          borderColor: "var(--main-bordermodaldashboard-color)",
                        }}
                        className="search-bg"
                        {...register("sms")}
                      ></textarea>
                    </Col>
                    {/* <Col xs={12} className="status_namm"> */}
                    {/* <h6> */}
                    {/* {" "} */}
                    {/* {maxLength - message.length}{" "} */}
                    {/* {t("characters remaining.")} */}
                    {/* </h6> */}
                    {/* </Col> */}
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
          <div
            className="d-flex justify-content-end me-4"
            style={{ marginBottom: "37px" }}
          >
            <button
              className="btn_cancel me-3"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t("Cancel")}
            </button>
            {isSubmitting ? (
              <button className="btn_save">
                <Spinner animation="border" size="sm" />
              </button>
            ) : (
              <button type="submit" className="btn_save">
                {t("Save")}
              </button>
            )}
          </div>
        </Form>
      </Modal>
    );
  },
  { extension: true }
);
