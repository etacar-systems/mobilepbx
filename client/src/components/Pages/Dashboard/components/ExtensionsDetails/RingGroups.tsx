import React, { useCallback } from "react";
import { Button, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import ProgressCircle from "../../../Dashboard/CustomeChart";
import { RingGroupModal } from "../../../../Admin/pages/RingGroups/components";
import { useQueryParams } from "../../../../../hooks";
import {
  IGetDashboardStatisticOutput,
  useRingGroupDetails,
} from "../../../../../requests/queries";
import { useUpdateRingGroup } from "../../../../../requests/mutations";
import { TRingGroupsFormArgs } from "../../../../Admin/pages/RingGroups/components/AddEditModal/form.dto";

import { ReactComponent as Usersicon } from "../../../../../Assets/Icon/users-svgrepo.svg";

interface IRingGroups {
  ringGroups?: NonNullable<IGetDashboardStatisticOutput>["ring_group"];
}

export const RingGroups = ({ ringGroups }: IRingGroups) => {
  const { t } = useTranslation();

  const { edit } = useQueryParams([{ key: "edit" as const }]);

  const handleClose = useCallback(() => {
    edit.set(undefined);
  }, [edit]);

  const onEditClick = useCallback(
    (id: string) => {
      handleClose();
      edit.set(id);
    },
    [edit, handleClose]
  );

  const { data: editEntity } = useRingGroupDetails({ uuid: edit.value });

  const { updateRingGroup, isFetching: isUpdating } = useUpdateRingGroup();

  const onSubmit = useCallback(
    (
      data: TRingGroupsFormArgs & {
        ring_group_timeout_data: string;
        ring_group_timeout_app: string;
      }
    ) => {
      if (edit.value) {
        updateRingGroup(
          {
            ...data,
            uuid: edit.value,
          },
          {
            onSuccess() {
              handleClose();
            },
          }
        );
      }
    },
    [edit, handleClose, updateRingGroup]
  );

  return (
    <Card className="dear-card">
      <Card.Header className="call_metrics">
        <h2 style={{ marginBottom: "20px" }}>{t("Ring groups")}</h2>
      </Card.Header>

      <div className="table-container3 dashboardtablescroll">
        <div className="table-responsive">
          <table className=" table-news table m-0 ">
            <tbody>
              {ringGroups?.map((ele) => {
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
                          {ele?.ring_group_name}
                        </small>
                        <h6 className="mb-0 small-cusnum">
                          {ele?.ring_group_extension}
                        </h6>
                        <Button
                          size="sm"
                          className="mr-2 new-button-ui"
                          data-toggle="modal"
                          data-target="#routing"
                          onClick={() => onEditClick(ele?.ring_group_uuid)}
                        >
                          {t("Open")}
                        </Button>
                      </td>
                      <td className="table-custom-body-td">
                        <ProgressCircle
                          passWholeProgress="progress-circle1"
                          classNames="progress-circle__svg1"
                          pragressLable="progress-circle__label2"
                          Totalcall={
                            Number(ele?.answered || 0) +
                            Number(ele?.missed || 0)
                          }
                          Answeredcall={Number(ele?.answered || 0)}
                          Title1={t("Answered")}
                          Title2={t("Missed")}
                          completedColor={undefined}
                          bgcolor={undefined}
                          mode={undefined}
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
      {edit.value && editEntity && (
        <RingGroupModal
          handleClose={handleClose}
          onSubmit={onSubmit}
          defaultValues={{
            name: editEntity?.name,
            description: editEntity?.ring_group_description,
            extension: editEntity?.extension,
            extensions: editEntity?.destinations,
            strategy: editEntity?.ring_group_strategy,
            duration: !!editEntity?.duration
              ? Number(editEntity.duration)
              : undefined,
            record_calls: editEntity?.record_calls,
            active: false,
            remote_no_answer_strategy: editEntity?.remote_no_answer_strategy,
            endpoint_uuid: editEntity?.endpoint_uuid,
            sms: undefined,
          }}
          isSubmitting={isUpdating}
          mode={"edit"}
        />
      )}
    </Card>
  );
};
