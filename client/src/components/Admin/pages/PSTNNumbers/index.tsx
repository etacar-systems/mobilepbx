import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";

import { AdminHeader } from "../../AdminHeader";
import {
  AddViewEditModal,
  SuccessModal,
  DeleteModal,
  SortArrows,
} from "./components";
import Paginationall from "../../../Pages/Paginationall";
import Loader from "../../../Loader";
import { ClearSearch } from "../../../ClearSearch";
import {
  useCompaniesNames,
  useListPSTNNumber,
  usePSTNDetails,
  useTrunksNames,
} from "../../../../requests/queries";
import { DropDown, Select } from "../../../shared";
import { useQueryParams } from "../../../../hooks";

import { ReactComponent as DeleteIcon } from "../../../../Assets/Icon/delete.svg";
import { ReactComponent as EditIcon } from "../../../../Assets/Icon/edit.svg";
import { TPSTNNumberFormArgs } from "./components/AddViewEditModal/form.dto";
import {
  ICreatePSTNNumberOutput,
  useCreatePSTNNumber,
  useDeletePSTNNumber,
} from "../../../../requests/mutations";
import config from "../../../../config";

import styles from "./pstnNumbers.module.scss";
import { useUpdatePSTNNumber } from "../../../../requests/mutations/updatePSTNNumber";

export default function PSTNNumbersPage() {
  const { t } = useTranslation();
  const {
    search,
    edit,
    del,
    page,
    limit,
    company,
    sort_column,
    sort_direction,
  } = useQueryParams(
    [
      { key: "search" as const },
      { key: "page" as const },
      { key: "limit" as const },
      { key: "company" as const },
      { key: "edit" as const },
      { key: "del" as const },
      {
        key: "sort_column" as const,
        allowedValues: ["destination", "trunk_name", "company_name"] as const,
      },
      {
        key: "sort_direction" as const,
        allowedValues: ["asc", "desc"] as const,
      },
    ],
    {
      page: 1,
      limit: 10,
    }
  );

  const [searchInput, setSearchInput] = useState<string | undefined>(
    search.value
  );

  const { names: companiesNames } = useCompaniesNames();
  const { names: trunksNames } = useTrunksNames();

  const [mode, setMode] = useState<
    "edit" | "add" | "delete" | "view" | undefined
  >(edit.value ? "edit" : del.value ? "delete" : undefined);
  const [creationData, setCreationData] = useState<ICreatePSTNNumberOutput>();

  const { addPSTNNumber, isFetching: isAdding } = useCreatePSTNNumber();
  const { deletePSTNNumber, isFetching: isDeleting } = useDeletePSTNNumber({
    page: Number(page.value),
    limit: Number(limit.value),
    cid: company.value,
    search: search.value,
    sort_direction: sort_direction.value,
    sort_column: sort_column.value,
  });
  const { updatePSTNNumber, isFetching: isUpdating } = useUpdatePSTNNumber({
    page: Number(page.value),
    limit: Number(limit.value),
    cid: company.value,
    search: search.value,
    sort_direction: sort_direction.value,
    sort_column: sort_column.value,
  });

  const { data: pstnForEdit } = usePSTNDetails({ uuid: edit.value });

  const clearSearch = useCallback(() => {
    search.set(undefined);
    setSearchInput(undefined);
  }, [search]);

  const handleCompanyChange = useCallback(
    (event: { target: { value: string } }) => {
      page.set(1);
      company.set(event.target.value);
    },
    [page, company]
  );

  const openEdit = useCallback(
    (id: string) => {
      setMode("edit");
      edit.set(id);
      del.set(undefined);
    },
    [edit, del]
  );

  const openDelete = useCallback(
    (id: string) => {
      setMode("delete");
      del.set(id);
      edit.set(undefined);
    },
    [del, edit]
  );

  const onAddClick = useCallback(() => {
    setMode("add");
    edit.set(undefined);
    del.set(undefined);
  }, [edit, del]);

  const handleClose = useCallback(() => {
    setMode(undefined);
    edit.set(undefined);
    del.set(undefined);
  }, [edit, del]);

  const handleSearchChange = useMemo(() => {
    const debounced = debounce((newSearch: string) => {
      if (!newSearch.trim()) {
        search.set(undefined);
      } else {
        search.set(newSearch);
      }
      page.set(1);
    }, 300);

    return debounced;
  }, [page, search]);

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    handleSearchChange(event.target.value);
  };

  const onSubmit = useCallback(
    (data: TPSTNNumberFormArgs) => {
      if (mode === "add") {
        addPSTNNumber(
          {
            ...data,
            destination_number: data.destination_number_start,
            range: data.number_range,
          },
          {
            onSuccess(data) {
              setCreationData(data);
              setMode("view");
            },
          }
        );
      } else if (mode === "edit" && edit.value) {
        updatePSTNNumber({
          ...data,
          uuid: edit.value
        }, {
          onSuccess() {
            handleClose();
          }
        })
      }
    },
    [mode, addPSTNNumber, updatePSTNNumber, edit, handleClose]
  );

  const onDelete = useCallback(() => {
    if (!del.value) return;
    deletePSTNNumber(
      { uuid: del.value },
      {
        onSuccess(data) {
          handleClose();
          toast.success(t(data.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
          page.set(1);
        },
        onError(error) {
          toast.error(t(error.message || ""), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        },
      }
    );
  }, [deletePSTNNumber, del.value, handleClose, page, t]);
  //   const datavalues = {
  //     type: "inbound",
  //     caller_id_name: "",
  //     caller_id_number: "",
  //     destination_condition: "",
  //     cid: formData.Domain,
  //     user: "",
  //     description: "",
  //     destination_enabled: true,
  //     gateway_id: formData?.gateway_id,
  //   };

  //   // if (mode === "add") {
  //   //   setsaveLoading(true);
  //   //   const data = {
  //   //     ...datavalues,
  //   //     destination: formData.destination_number,
  //   //     create_range: +Math.abs(formData.range - formData.destination_number),
  //   //   };
  //   //   dispatch(
  //   //     postapiAll({
  //   //       inputData: data,
  //   //       Api: config.PSTN_NUMBER.ADD,
  //   //       Token: Token,
  //   //       urlof: config.PSTN_NUMBER_KEY.ADD,
  //   //     })
  //   //   ).then((res) => {
  //   //     if (res.payload.response) {
  //   //       setsaveLoading(false);
  //   //       setModalData(res.payload.response);
  //   //       setShowSuccessModal(true);
  //   //       handleClose();
  //   //       setsavedata(!savedata);
  //   //       setCurrentPage(1);
  //   //       setSearchterm("");
  //   //     } else {
  //   //       setsaveLoading(false);
  //   //       toast.error(t(res.payload.error.message), {
  //   //         autoClose: config.TOST_AUTO_CLOSE,
  //   //       });
  //   //     }
  //   //   });
  //   // } else {
  //   //   console.log(formData, "formData");
  //   //   setsaveLoading(true);
  //   //   const data = {
  //   //     ...datavalues,
  //   //     destination: formData.Number.trim(""),
  //   //     destination_number: formData.destination_number.trim(""),
  //   //     range: formData.range,
  //   //     pstn_id: formData.pstn_id,
  //   //     pstn_range_uuid: EditId,
  //   //   };
  //   //   dispatch(
  //   //     putapiall({
  //   //       inputData: data,
  //   //       Api: config.PSTN_NUMBER.EDIT,
  //   //       Token: Token,
  //   //       urlof: config.PSTN_NUMBER_KEY.EDIT,
  //   //     })
  //   //   ).then((res) => {
  //   //     if (res.payload.response) {
  //   //       setsaveLoading(false);
  //   //       handleClose();
  //   //       setsavedata(!savedata);
  //   //       setCurrentPage(1);
  //   //       setFormData("");
  //   //       setSearchterm("");
  //   //       toast.success(t(res.payload.response.message), {
  //   //         autoClose: config.TOST_AUTO_CLOSE,
  //   //       });
  //   //     } else {
  //   //       console.log(res, "res");
  //   //       setsaveLoading(false);
  //   //       toast.error(t(res?.payload?.error?.message), {
  //   //         autoClose: config.TOST_AUTO_CLOSE,
  //   //       });
  //   //     }
  //   //   });
  //   // }
  // };

  const sortFunctionFabric = useCallback(
    (columnName: "destination" | "trunk_name" | "company_name") => {
      return () => {
        if (sort_column.value !== columnName) {
          sort_column.set(columnName);
          sort_direction.set("asc");
        } else if (sort_direction.value === "asc") {
          sort_direction.set("desc");
        } else {
          sort_direction.set("asc");
        }
      };
    },
    [sort_column, sort_direction]
  );

  const { data, isFetching } = useListPSTNNumber({
    page: Number(page.value),
    limit: Number(limit.value),
    cid: company.value,
    search: search.value,
    sort_direction: sort_direction.value,
    sort_column: sort_column.value,
  });

  const onLimitChange = useCallback(
    (value: string) => {
      limit.set(Number(value));
      page.set(1);
    },
    [limit, page]
  );

  const { startEntry, endEntry } = useMemo(() => {
    const startEntry = (Number(page.value) - 1) * Number(limit.value) + 1;
    let endEntry = Number(page.value) * Number(limit.value);
    if (endEntry > data?.pstn_total_counts) {
      endEntry = data?.pstn_total_counts;
    }

    return { startEntry, endEntry };
  }, [page.value, limit.value, data?.pstn_total_counts]);

  return (
    <div className={styles.page}>
      <AdminHeader openModal={onAddClick} addBtn={false} />
      <div className={["num_table", styles.page__tableWrapper].join(" ")}>
        <div className="table_header">
          <div className="show">
            <h6>{t("Show")}</h6>
            <div className="select_entry">
              <Select
                value={Number(limit.value)}
                onChange={onLimitChange}
                options={[
                  { value: 10, label: 10 },
                  { value: 25, label: 25 },
                  { value: 50, label: 50 },
                  { value: 100, label: 100 },
                ]}
              />
            </div>
            <h6>{t("entries")}</h6>
          </div>
          <div
            className="table_search searchwidth pstnnumber"
            style={{ width: "55%" }}
          >
            <h6>{t("Search")}:</h6>
            <Form.Control
              type="text"
              height={38}
              // onPaste={handlePaste}
              value={searchInput || ""}
              onChange={onSearchChange}
              className="search-bg new-search-add"
            />
            {search.value && (
              <ClearSearch clearSearch={clearSearch} number={true} />
            )}

            <div className="companyfilter">
              <h6 style={{ width: "120px", marginLeft: "15px" }}>
                {t("Select Company")}:
              </h6>
              <div style={{ width: "140px" }}>
                <DropDown
                  labelKey={"company_name"}
                  valueKey={"_id"}
                  value={company.value}
                  onChange={handleCompanyChange}
                  options={
                    companiesNames
                      ? [
                          { company_name: "All", _id: undefined },
                          ...companiesNames,
                        ]
                      : []
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ overflow: "auto", height: "100%" }}
          className="sidebar_scroll"
        >
          <table
            className="responshive"
            style={isFetching || !data?.data?.length ? { height: "100%" } : {}}
          >
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "23%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={sortFunctionFabric("trunk_name")}
                  >
                    <p className="mb-0">{t("Provider")}</p>
                    <div>
                      <SortArrows
                        direction={
                          sort_column.value === "trunk_name"
                            ? sort_direction.value
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </th>
                <th style={{ width: "23%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={sortFunctionFabric("destination")}
                  >
                    <p className="mb-0">{t("Destination Number")}</p>
                    <div>
                      <SortArrows
                        direction={
                          sort_column.value === "destination"
                            ? sort_direction.value
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </th>
                <th style={{ width: "24%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={sortFunctionFabric("company_name")}
                  >
                    <p className="mb-0">{t("Customer")}</p>
                    <div>
                      <SortArrows
                        direction={
                          sort_column.value === "company_name"
                            ? sort_direction.value
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </th>
                <th style={{ width: "15%" }}>{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td
                    style={{
                      width: "100%",
                      textAlign: "center",
                      margin: "auto",
                    }}
                    colSpan={6}
                  >
                    <Loader />
                  </td>
                </tr>
              ) : (
                <>
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((val, index) => (
                      <tr className="table_body" key={val._id}>
                        <td>{val?.trunk_name}</td>

                        <td>{val?.destination}</td>
                        <td>{val?.company_name}</td>
                        <td className="table_edit">
                          <button
                            onClick={() => openEdit(val?.pstn_range_uuid)}
                          >
                            <EditIcon
                              width={14}
                              height={14}
                              className="edithover"
                            />
                          </button>
                          <button
                            className="ms-1"
                            onClick={() => openDelete(val?.pstn_range_uuid)}
                          >
                            <DeleteIcon
                              width={14}
                              height={14}
                              className="edithover"
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        style={{
                          width: "100%",
                          textAlign: "center",
                          margin: "auto",
                        }}
                        colSpan={6}
                      >
                        {t("No data found")}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div
          className={[
            "show show2 d-flex align-items-center justify-content-between",
            styles.page__pagination,
          ].join(" ")}
        >
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")}{" "}
            {data?.pstn_total_counts || 0} {t("entries")}
          </h6>
          <div>
            <Paginationall
              totalPages={data?.total_page_count}
              currentPage={Number(page.value)}
              setcurrenPage={page.set}
            />
          </div>
        </div>
      </div>
      {(mode === "add" || (mode === "edit" && pstnForEdit)) &&
        companiesNames?.length &&
        trunksNames?.length && (
          <AddViewEditModal
            close={handleClose}
            onSubmit={onSubmit}
            isSubmitting={isAdding}
            defaultValues={
              mode === "edit"
                ? {
                    destination_number_start: pstnForEdit?.destination_start,
                    destination_number_end: pstnForEdit?.destination_end,
                    company_id: pstnForEdit?.cid,
                    gateway_id: pstnForEdit?.gateway_id,
                  }
                : undefined
            }
            companiesNames={companiesNames}
            trunksNames={trunksNames}
            mode={mode}
          />
        )}
      {mode === "delete" && (
        <DeleteModal
          close={handleClose}
          onDelete={onDelete}
          isSubmitting={isDeleting || isUpdating}
        />
      )}
      {mode === "view" && creationData && (
        <SuccessModal data={creationData} close={handleClose} />
      )}
    </div>
  );
}
