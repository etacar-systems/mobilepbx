import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TRPCError } from "@trpc/server";

import { router } from "../../../utils/trpc";
import { config } from "../../../config";
import { authorizedProcedure } from "./procedure";

import company from "../../../models/company";

import { callMetricsQueryDto, statisticQueryDto } from "./dashboard.dto";

dayjs.extend(utc);
dayjs.extend(timezone);

interface IStatistic {
  data: Array<{
    extension: string;
    caller_name: string;
    answered: string;
    missed: string;
    no_answer: string;
    busy: string;
    avg_call_length: null;
    inbound_calls: string;
    inbound_duration: null;
    local_calls: string;
    local_duration: null;
    outbound_calls: string;
    outbound_duration: null;
    response_seconds: null;
    total_calls: number;
    calld_percentage: number;
    answer_percentage: number;
    missed_percentage: number;
    extension_uuid: string;
  }>;
  sla: {
    missed_call: number;
    answered_call: number;
  };
  call_comparison: {
    called: number;
    local: number;
    answered_call: number;
  };
  total_counts: {
    total_calls: number;
    total_outbound: number;
    total_local: number;
    total_answered: number;
    total_missed: number;
    total_duration_sec: number;
    avg_response_sec: number;
    today_total_calls: number;
    today_missed_calls: number;
    today_missed_calls_percentage: number;
    today_answered_calls: number;
  };
}

interface IRingGroup {
  answer_percentage: number;
  answered: string;
  avg_call_length: any;
  busy: string;
  calld_percentage: number;
  inbound_calls: string;
  inbound_duration: any;
  missed: string;
  missed_percentage: number;
  no_answer: string;
  outbound_calls: string;
  outbound_duration: any;
  response_seconds: any;
  ring_group_extension: string;
  ring_group_name: string;
  ring_group_uuid: string;
  total_calls: string;
}

export const dashboardRouter = router({
  statistic: authorizedProcedure
    .input(statisticQueryDto)
    .query(
      async ({ ctx: { user }, input: { endDate, startDate, timeZone } }) => {
        const companyDetail: any = await company.findOne({
          _id: user.cid,
          is_deleted: 0,
        });

        if (!companyDetail) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const start_date = dayjs
          .utc(startDate + " 00:00")
          .utcOffset(dayjs().tz(timeZone).utcOffset() * -1)
          .format("YYYY-MM-DD HH:mm");

        const end_date = dayjs
          .utc(endDate + " 24:00")
          .utcOffset(dayjs().tz(timeZone).utcOffset() * -1)
          .format("YYYY-MM-DD HH:mm");

        const api_config = {
          method: "post",
          maxBodyLength: Infinity,
          url: config.PBX_API.DASHBOARD.GET_REPORTS,
          auth: config.PBX_API.AUTH,
          data: {
            domain_id: companyDetail.domain_uuid,
            start_date,
            end_date,
            time_zone: timeZone,
          },
        };

        let api_ring_groups = {
          method: "post",
          maxBodyLength: Infinity,
          url: config.PBX_API.DASHBOARD.GET_RINGGROUP_CALL,
          auth: config.PBX_API.AUTH,
          data: {
            domain_id: companyDetail.domain_uuid,
            start_date,
            end_date,
          },
        };

        try {
          const reports_api_data = await axios.request<IStatistic>(api_config);
          const ring_group_api_data = await axios.request<{ data: Array<IRingGroup> }>(api_ring_groups);

          if (
            reports_api_data.status === 200 &&
            ring_group_api_data.status === 200
          ) {
            return {
              ...reports_api_data.data,
              ring_group: ring_group_api_data.data.data,
            };
          } else {
            throw new TRPCError({ code: "BAD_GATEWAY" });
          }
        } catch (e) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }
    ),
  callMetrics: authorizedProcedure
    .input(callMetricsQueryDto)
    .query(async ({ ctx: { user }, input }) => {
      const companyDetail: any = await company.findOne({
        _id: user.cid,
        is_deleted: 0,
      });

      if (!companyDetail) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const api_config = {
        method: "post",
        maxBodyLength: Infinity,
        url: config.PBX_API.DASHBOARD.GET_CALL_MATRICS,
        auth: config.PBX_API.AUTH,
        data: {
          domain_id: companyDetail.domain_uuid,
          type: input.type,
          // extension: user.role === "agent" ? user.extension_uuid : undefined,
          time_zone: input.timeZone,
        },
      };

      try {
        const callMetrics = await axios.request<{
          data: Array<{
            answered_calls: string;
            inbound_calls: string;
            interval: string;
            local_calls: string;
            missed_calls: string;
            outbound_calls: string;
          }>;
          total_counts: {
            total_answered: number;
            total_local: number;
            total_missed: number;
          };
        }>(api_config);
        if (callMetrics.status === 200) {
          return callMetrics.data;
        }
      } catch (e) {
        console.log(e);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  missedCalls: authorizedProcedure
    .input(callMetricsQueryDto)
    .query(async ({ ctx: { user }, input }) => {
      const companyDetail: any = await company.findOne({
        _id: user.cid,
        is_deleted: 0,
      });

      if (!companyDetail) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const api_config = {
        method: "post",
        maxBodyLength: Infinity,
        url: config.PBX_API.DASHBOARD.GET_MISSED_CALL,
        auth: config.PBX_API.AUTH,
        data: {
          domain_id: companyDetail.domain_uuid,
          type: input.type,
          // extension: user.role === "agent" ? user.extension_uuid : undefined,
          time_zone: input.timeZone,
        },
      };

      try {
        const missedCalls = await axios.request<{
          data: Array<{
            answered_calls: string;
            interval: string;
            missed_calls: string;
            total_calls: string;
            total_response_time: string;
          }>;
          total_counts: {
            average_waiting_time: number;
            total_calls: number;
            total_missed: number;
          };
        }>(api_config);
        if (missedCalls.status === 200) {
          return missedCalls.data;
        }
      } catch (e) {
        console.log(e);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
