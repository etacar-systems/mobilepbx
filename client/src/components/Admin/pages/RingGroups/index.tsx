import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

import { AdminHeader } from "../../AdminHeader";
import Paginationall from "../../../Pages/Paginationall";
import Loader from "../../../Loader";
import { ClearSearch } from "../../../ClearSearch";
import {
  useRingGroupDetails,
  useListRingGroups,
} from "../../../../requests/queries";
import { IQueryParamResult, useQueryParams } from "../../../../hooks";
import { SortArrows, DeleteModal } from "../../../shared";
import { RingGroupModal } from "./components";
import { TRingGroupsFormArgs } from "./components/AddEditModal/form.dto";
import {
  useCreateRingGroup,
  useDeleteRingGroup,
  useUpdateRingGroup,
} from "../../../../requests/mutations";
import config from "../../../../config";

import styles from "./ringGroups.module.scss";

import { ReactComponent as EditIcon } from "../../../../Assets/Icon/edit.svg";
import { ReactComponent as DeleteIcon } from "../../../../Assets/Icon/delete.svg";

export default function RingGroupsPage() {
  const { t } = useTranslation();

  const { page, limit, edit, del, add, sort_column, sort_direction, search } =
    useQueryParams(
      [
        { key: "page" as const },
        { key: "limit" as const },
        { key: "search" as const },
        { key: "edit" as const },
        { key: "del" as const },
        { key: "add" as const, allowedValues: ["true"] as const },
        {
          key: "sort_column" as const,
          allowedValues: [
            "name",
            "description",
            "phone_number",
            "extension",
            "date",
          ] as const,
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
  const handleSearchChange = useCallback(
    debounce(
      (
        newSearch: string,
        {
          search,
          page,
        }: {
          search: IQueryParamResult<undefined>;
          page: IQueryParamResult<undefined>;
        }
      ) => {
        if (!newSearch.trim()) {
          search.set(undefined);
        } else {
          search.set(newSearch);
        }
        page.set(1);
      },
      300
    ),
    []
  );

  const onSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchInput(event.target.value);
      handleSearchChange(event.target.value, { search, page });
    },
    [search, page, handleSearchChange]
  );

  const fetchParams = {
    page: Number(page.value),
    limit: Number(limit.value),
    search: search.value,
    sort_column: sort_column.value,
    sort_direction: sort_direction.value,
  };

  const { data, isFetching } = useListRingGroups(fetchParams);

  const clearSearch = useCallback(() => {
    search.set(undefined);
    setSearchInput(undefined);
  }, [search]);

  const { startEntry, endEntry } = useMemo(() => {
    const startEntry = (Number(page.value) - 1) * Number(limit.value) + 1;
    let endEntry = Number(page.value) * Number(limit.value);
    if (endEntry > (data?.ring_group_total_counts || 0)) {
      endEntry = data?.ring_group_total_counts || 0;
    }

    return { startEntry, endEntry };
  }, [page.value, limit.value, data?.ring_group_total_counts]);

  const handleClose = useCallback(() => {
    edit.set(undefined);
    del.set(undefined);
    add.set(undefined);
  }, [edit, del, add]);

  const sortFunctionFabric = useCallback(
    (
      columnName: "name" | "description" | "phone_number" | "extension" | "date"
    ) => {
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

  const onLimitChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      limit.set(Number(e.target.value));
      handleClose();
      page.set(1);
    },
    [page, limit, handleClose]
  );

  const { data: editEntity } = useRingGroupDetails({ uuid: edit.value });

  const onAddClick = useCallback(() => {
    handleClose();
    add.set("true");
  }, [add, handleClose]);

  const onEditClick = useCallback(
    (id: string) => {
      handleClose();
      edit.set(id);
    },
    [edit, handleClose]
  );

  const onDeleteClick = useCallback(
    (id: string) => {
      handleClose();
      del.set(id);
    },
    [del, handleClose]
  );

  const { addRingGroup, isFetching: isCreating } = useCreateRingGroup();
  const { deleteRingGroup, isFetching: isDeleting } =
    useDeleteRingGroup(fetchParams);
  const { updateRingGroup, isFetching: isUpdating } =
    useUpdateRingGroup(fetchParams);

  const onSubmit = useCallback(
    (
      data: TRingGroupsFormArgs & {
        ring_group_timeout_data: string;
        ring_group_timeout_app: string;
      }
    ) => {
      if (add.value) {
        addRingGroup(data, {
          onSuccess() {
            handleClose();
          },
          onError(error) {
            if (error.data?.code === "BAD_REQUEST") {
              toast.error(t("Ring group with this extension already exist"), {
                autoClose: config.TOST_AUTO_CLOSE,
              });
            }
          },
        });
      } else if (edit.value) {
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
    [edit, add, addRingGroup, handleClose, updateRingGroup, t]
  );

  const onDelete = useCallback(() => {
    if (!del.value) return;
    deleteRingGroup(
      { uuid: del.value },
      {
        onSuccess(data) {
          handleClose();
          toast.success(t(data.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
          // page.set(1);
        },
        onError(error) {
          toast.error(t(error.message || ""), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        },
      }
    );
  }, [deleteRingGroup, handleClose, del.value, t]);

  return (
    <div className={styles.page}>
      <AdminHeader openModal={onAddClick} />
      <div className={["num_table", styles.page__tableWrapper].join(" ")}>
        <div className="table_header">
          <div className="show">
            <h6>{t("Show")}</h6>
            <div className="select_entry">
              <Form.Select
                aria-label="Default select example"
                onChange={onLimitChange}
                value={limit.value}
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
              value={searchInput || ""}
              onChange={onSearchChange}
            />
            {search.value && (
              <ClearSearch
                className={styles.clear_fix}
                clearSearch={clearSearch}
                number={false}
              />
            )}
          </div>
        </div>
        <div
          className="sidebar_scroll"
          style={{ overflow: "auto", height: "100%" }}
        >
          <table
            className="responshive"
            style={isFetching || !data?.data?.length ? { height: "100%" } : {}}
          >
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "19%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={sortFunctionFabric("name")}
                  >
                    <p className="mb-0">{t("Name")}</p>
                    <SortArrows
                      direction={
                        sort_column.value === "name"
                          ? sort_direction.value
                          : undefined
                      }
                    />
                  </div>
                </th>
                <th style={{ width: "20%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={sortFunctionFabric("description")}
                  >
                    <p className="mb-0">{t("Description")}</p>
                    <SortArrows
                      direction={
                        sort_column.value === "description"
                          ? sort_direction.value
                          : undefined
                      }
                    />
                  </div>
                </th>
                <th style={{ width: "19%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={sortFunctionFabric("phone_number")}
                  >
                    <p className="mb-0">{t("Phone Number")}</p>
                    <SortArrows
                      direction={
                        sort_column.value === "phone_number"
                          ? sort_direction.value
                          : undefined
                      }
                    />
                  </div>
                </th>
                <th style={{ width: "18%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={sortFunctionFabric("extension")}
                  >
                    <p className="mb-0">{t("Extension")}</p>
                    <SortArrows
                      direction={
                        sort_column.value === "extension"
                          ? sort_direction.value
                          : undefined
                      }
                    />
                  </div>
                </th>

                <th style={{ width: "12%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={sortFunctionFabric("date")}
                  >
                    <p className="mb-0">{t("Date")}</p>
                    <SortArrows
                      direction={
                        sort_column.value === "date"
                          ? sort_direction.value
                          : undefined
                      }
                    />
                  </div>
                </th>
                <th style={{ width: "12%" }}>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td
                    style={{ width: "100%", textAlign: "center" }}
                    colSpan={6}
                  >
                    <Loader />
                  </td>
                </tr>
              ) : data?.data?.length ? (
                data.data.map((val, index) => {
                  const date = new Date(val?.insert_date);
                  const formattedDate = new Date(date)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, ".");
                  return (
                    <tr key={index} className="table_body">
                      <td>{val.ring_group_name}</td>
                      <td>{val.ring_group_description}</td>
                      <td>
                        {val.ring_group_caller_id_number
                          ? val.ring_group_caller_id_number
                          : t("Not Assigned")}
                      </td>
                      <td>{val.ring_group_extension}</td>
                      <td>{formattedDate}</td>
                      <td className="table_edit">
                        <button
                          onClick={() => onEditClick(val.ring_group_uuid)}
                        >
                          <EditIcon
                            width={14}
                            height={14}
                            className="edithover"
                          />
                        </button>
                        <button
                          className="ms-1"
                          onClick={() => onDeleteClick(val.ring_group_uuid)}
                        >
                          <DeleteIcon
                            width={14}
                            height={14}
                            className="edithover"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    style={{ width: "100%", textAlign: "center" }}
                    colSpan={6}
                  >
                    {t("No data found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>{" "}
        </div>
        <div
          className={[
            "show show2 d-flex align-items-center justify-content-between",
            styles.page__pagination,
          ].join(" ")}
        >
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")}{" "}
            {data?.ring_group_total_counts || 0} {t("entries")}
          </h6>
          <Paginationall
            totalPages={data?.total_page_count}
            currentPage={Number(page.value)}
            setcurrenPage={page.set}
          />
        </div>
      </div>
      {(add.value || (edit.value && editEntity)) && (
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
          isSubmitting={isCreating || isUpdating}
          mode={add.value ? "add" : "edit"}
        />
      )}
      {del.value && (
        <DeleteModal
          close={handleClose}
          onDelete={onDelete}
          isSubmitting={isDeleting}
        />
      )}
    </div>
  );
}
