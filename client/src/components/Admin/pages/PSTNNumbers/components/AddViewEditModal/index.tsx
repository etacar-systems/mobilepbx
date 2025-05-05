import React from "react";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ReactComponent as Closeicon } from "../../../../../../Assets/Icon/close.svg";
import CustomTooltipModal from "../../../../../CustomTooltipModal";
import {
  IGetCompaniesNamesOutput,
  IGetTrunksNamesOutput,
} from "../../../../../../requests/queries";
import {
  NUMBER_POOL_MAXIMUM_LENGTH,
  NUMBER_POOL_MINIMUM_LENGTH,
  pstnNumberRangeDto,
  TPSTNNumberFormArgs,
} from "./form.dto";
import { DropDown } from "../../../../../shared";

interface IAddViewEditModalProps {
  close: () => void;
  isSubmitting?: boolean;
  companiesNames: IGetCompaniesNamesOutput;
  trunksNames: IGetTrunksNamesOutput;
  mode: "edit" | "add";
  defaultValues?: Partial<TPSTNNumberFormArgs>;
  onSubmit: (data: TPSTNNumberFormArgs) => void;
}

export const AddViewEditModal = ({
  close,
  isSubmitting,
  companiesNames,
  trunksNames,
  mode,
  defaultValues,
  onSubmit,
}: IAddViewEditModalProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<TPSTNNumberFormArgs>({
    resolver: zodResolver(
      pstnNumberRangeDto(
        trunksNames.map((trunkName: {
          _id: string;
          gateway_name: string;
      }) => trunkName._id),
        companiesNames.map((companyName: {
          _id: string;
          company_name: string;
          domain_name: string;
          domain_uuid: string;
      }) => companyName._id)
      )
    ),
    defaultValues: {
      destination_number_start: defaultValues?.destination_number_start,
      destination_number_end: defaultValues?.destination_number_end,
      company_id: defaultValues?.company_id || companiesNames[0]._id,
      gateway_id: defaultValues?.gateway_id || trunksNames[0]._id,
    },
  });

  const handleKeyPress = (e: any) => {
    const { value, selectionStart } = e.target;
    const plusCount = (value.match(/\+/g) || []).length;

    if (
      (e.key < "0" || e.key > "9") &&
      !(
        e.key === "+" &&
        plusCount < 1 &&
        (selectionStart === 0 || value[selectionStart - 1] === " ")
      )
    ) {
      e.preventDefault();
    }
  };

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
            <h6>{mode === "add" ? t("Add new PSTN pool") : t("Edit PSTN")}</h6>
            <Closeicon width={23} onClick={close} height={23} />
          </div>
        </div>
        <div className="p-3">
          <div
            style={{
              borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
              padding: "0px 7px",
            }}
          >
            <Row className="mb-3">
              <Col lg={3}>
                <Form.Label
                  className="modal-head"
                  style={{ marginLeft: "6px" }}
                >
                  {t("Provider")}
                  <CustomTooltipModal
                    tooltip={t(
                      "Select the Gateway to use with this outbound route."
                    )}
                  />
                </Form.Label>
                <DropDown
                  valueKey={"_id"}
                  labelKey={"gateway_name"}
                  options={trunksNames}
                  value={watch("gateway_id")}
                  {...register("gateway_id")}
                />
              </Col>
              <Col lg={6}>
                <Form.Label className="modal-head">
                  {t("Number pool")}
                  <CustomTooltipModal
                    tooltip={t("Please enter PSTN number pool range")}
                  />
                </Form.Label>
                <div className="d-flex align-items-center justify-content-between">
                  <Form.Control
                    className="input_padding search-bg"
                    {...register("destination_number_start")}
                    disabled={mode === "edit"}
                    onKeyPress={handleKeyPress}
                  />
                  <div className="px-2">-</div>
                  <Form.Control
                    className="input_padding search-bg"
                    {...register("destination_number_end")}
                    disabled={mode === "edit"}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                {(errors.destination_number_start?.message ||
                  errors.destination_number_end?.message) && (
                  <div className="text-danger error-ui">
                    {t(
                      (errors.destination_number_start?.message ||
                        errors.destination_number_end?.message)!,
                      errors.destination_number_start?.type === "custom" ||
                        errors.destination_number_end?.type === "custom"
                        ? {
                            start: NUMBER_POOL_MINIMUM_LENGTH,
                            end: NUMBER_POOL_MAXIMUM_LENGTH,
                          }
                        : {}
                    )}
                  </div>
                )}
              </Col>
              <Col lg={3}>
                <Form.Label
                  className="modal-head"
                  style={{ marginLeft: "6px" }}
                >
                  {t("Company")}
                </Form.Label>
                <DropDown
                  valueKey={"_id"}
                  labelKey={"company_name"}
                  options={companiesNames}
                  value={watch("company_id")}
                  {...register("company_id")}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div
          className="d-flex justify-content-end "
          style={{ marginBottom: "37px", marginRight: "33px" }}
        >
          <button
            className="btn_cancel me-2"
            onClick={close}
            disabled={isSubmitting}
          >
            {t("Cancel")}
          </button>
          {isSubmitting ? (
            <button className="btn_save">
              <Spinner animation="border" size="sm" />
            </button>
          ) : (
            <button 
            disabled={!isValid} 
            type={"submit"} className="btn_save">
              {t("Save")}
            </button>
          )}
        </div>
      </Form>
    </Modal>
  );
};
