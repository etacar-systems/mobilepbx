import { TRPCError } from "@trpc/server";
import axios from "axios";

import { config } from "../../../../config";
import company from "../../../../models/company";
import { router } from "../../../../utils/trpc";
import { adminProcedure } from "../procedure";
import {
  getRingGroupDetails,
  ringGroupDto,
  ringGroupsFormDto,
} from "./ringGroup.dto";
import user from "../../../../models/user";
import { TRingGroupDetails } from "./types";
import ring_group from "../../../../models/ring_group";

export const ringGroupRouter = router({
  list: adminProcedure
    .input(ringGroupDto)
    .query(async ({ ctx: { admin }, input }) => {
      const companyDetails = await company.findById(admin.cid).select({
        domain_uuid: true,
      });

      if (!companyDetails?.domain_uuid) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      let queryParams = `&limit=${input.limit}&page=${input.page}`;

      if (input.search) {
        queryParams += `&search=${input.search}`;
      }
      if (input.sort_column) {
        queryParams += `&sort_column=${input.sort_column}&sort_direction=${
          input.sort_direction || "asc"
        }`;
      }

      const api_config = {
        method: "get",
        maxBodyLength: Infinity,
        url:
          config.PBX_API.RING_GROUP.LIST +
          companyDetails.domain_uuid +
          queryParams,
        auth: config.PBX_API.AUTH,
      };

      try {
        const list = await axios.request<{
          data: Array<{
            insert_date: string;
            ring_group_caller_id_number: string;
            ring_group_description: string;
            ring_group_extension: string;
            ring_group_name: string;
            ring_group_uuid: string;
          }>;
          total: number;
        }>(api_config);

        if (list.status === 200) {
          return {
            data: list.data.data,
            ring_group_total_counts: list.data.total,
            total_page_count: Math.ceil(list.data.total / input.limit),
          };
        } else {
          throw new TRPCError({ code: "BAD_GATEWAY" });
        }
      } catch (e) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  details: adminProcedure
    .input(getRingGroupDetails)
    .query(async ({ ctx: { admin }, input }) => {
      const companyDetails = await company.findById(admin.cid).select({
        domain_uuid: true,
      });

      if (!companyDetails?.domain_uuid) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const api_config = {
        method: "get",
        maxBodyLength: Infinity,
        url:
          config.PBX_API.RING_GROUP.DETAILS +
          input.uuid +
          `&domain_uuid=${companyDetails.domain_uuid}`,
        auth: config.PBX_API.AUTH,
      };

      try {
        const response = await axios.request<TRingGroupDetails>(api_config);

        if (response.status === 200) {
          return {
            ...response.data[0],
            context: response.data[0].domain_name,
            destinations: response.data[0].destinations.slice(1, -1).split(","),
            domain_id: response.data[0].domain_uuid,
            extension: response.data[0].ring_group_extension,
            name: response.data[0].ring_group_name,
            record_calls: false,
            // ring_group_caller_id_number: 5,
          };
        } else {
          throw new TRPCError({ code: "BAD_GATEWAY" });
        }
      } catch (e) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  add: adminProcedure
    .input(ringGroupsFormDto)
    .mutation(async ({ ctx: { admin }, input }) => {
      const companyDetails = await company.findById(admin.cid).select({
        domain_uuid: true,
        domain_name: true,
      });

      if (!companyDetails?.domain_uuid) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const is_exist_api_config = {
        method: "get",
        maxBodyLength: Infinity,
        url:
          config.PBX_API.RING_GROUP.DETAILS_BY_EXTENSION +
          input.extension +
          `&domain_uuid=${companyDetails.domain_uuid}`,
        auth: config.PBX_API.AUTH,
      };

      try {
        const response = await axios.request<TRingGroupDetails>(
          is_exist_api_config
        );

        if (response.status === 200 && response?.data[0]?.ring_group_uuid) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }
      } catch (e) {
        if (e instanceof TRPCError) {
          throw e;
        }

        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const {
        name,
        extension,
        strategy,
        description,
        ring_group_timeout_app,
        ring_group_timeout_data,
        extensions,
        duration,
      } = input;

      const extension_data = await user.find({
        user_extension: { $in: extensions },
        is_deleted: 0,
      });

      if (extension_data.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const api_config = {
        method: "post",
        maxBodyLength: Infinity,
        url: config.PBX_API.RING_GROUP.ADD,
        auth: config.PBX_API.AUTH,
        data: {
          name,
          extension,
          domain_id: companyDetails.domain_uuid,
          context: companyDetails.domain_name,
          ring_group_strategy: strategy,
          ring_group_enabled: "true",
          ring_group_description: description,
          ring_group_greeting: "Lights(chosic.com).mp3",
          ring_group_caller_id_name: "RingGroup",
          ring_group_forward_enabled: "true",
          ring_group_call_timeout: strategy !== "sequence" ? duration : 30,
          ring_group_timeout_app,
          ring_group_timeout_data,
          ring_group_call_forward_enabled: "true",
          ring_group_follow_me_enabled: "true",
          ring_group_destinations: extension_data.map((ext) => ({
            destination_number: ext.user_extension,
            destination_delay: 10,
            destination_timeout: strategy === "sequence" ? duration : 30,
            destination_enabled: "true",
            destination_prompt: "NULL",
          })),
        },
      };

      try {
        const response = await axios.request(api_config);

        if (response.status === 200) {
          // TODO: remove it
          await ring_group.create({
            ...api_config.data,
            cid: admin.cid,
            destinations: extension_data.map(extension => extension.extension_uuid),
            record_calls: input.record_calls,
            ring_group_uuid: response.data.id,
            ring_group_destinations: undefined,
          });

          return response.data;
        } else {
          throw new TRPCError({ code: "BAD_GATEWAY" });
        }
      } catch (e) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  update: adminProcedure
    .input(ringGroupsFormDto.merge(getRingGroupDetails))
    .mutation(async ({ ctx: { admin }, input }) => {
      const companyDetails = await company.findById(admin.cid).select({
        domain_uuid: true,
        domain_name: true,
      });

      if (!companyDetails?.domain_uuid) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const {
        name,
        extension,
        strategy,
        description,
        ring_group_timeout_app,
        ring_group_timeout_data,
        extensions,
        duration,
      } = input;

      const extension_data = await user.find({
        user_extension: { $in: extensions },
        is_deleted: 0,
      });

      if (extension_data.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const api_config = {
        method: "put",
        maxBodyLength: Infinity,
        url: config.PBX_API.RING_GROUP.UPDATE,
        auth: config.PBX_API.AUTH,
        data: {
          name,
          extension,
          ring_group_id: input.uuid,
          domain_id: companyDetails.domain_uuid,
          context: companyDetails.domain_name,
          ring_group_strategy: strategy,
          ring_group_enabled: "true",
          ring_group_description: description,
          ring_group_greeting: "Lights(chosic.com).mp3",
          ring_group_caller_id_name: "RingGroup",
          ring_group_forward_enabled: "true",
          ring_group_call_timeout: strategy !== "sequence" ? duration : "30",
          ring_group_timeout_app,
          ring_group_timeout_data,
          ring_group_call_forward_enabled: "true",
          ring_group_follow_me_enabled: "true",
          ring_group_destinations: extension_data.map((ext) => ({
            destination_number: ext.user_extension,
            destination_delay: "10",
            destination_timeout: strategy === "sequence" ? duration : "30",
            destination_enabled: "true",
            destination_prompt: "NULL",
          })),
        },
      };

      try {
        const response = await axios.request(api_config);

        if (response.status === 200) {
          // TODO: remove it
          await ring_group.updateOne({ ring_group_uuid: input.uuid },  {
            ...api_config.data,
            cid: admin.cid,
            destinations: extension_data.map(extension => extension.extension_uuid),
            record_calls: input.record_calls,
            ring_group_uuid: response.data.id,
            ring_group_destinations: undefined,
          });
          return response.data;
        } else {
          throw new TRPCError({ code: "BAD_GATEWAY" });
        }
      } catch (e) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  delete: adminProcedure
    .input(getRingGroupDetails)
    .mutation(async ({ ctx: { admin }, input: { uuid } }) => {
      const companyDetails = await company.findById(admin.cid).select({
        domain_uuid: true,
      });

      if (!companyDetails?.domain_uuid) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const api_config = {
        method: "delete",
        maxBodyLength: Infinity,
        url:
          config.PBX_API.RING_GROUP.REMOVE +
          uuid +
          `&domain_uuid=${companyDetails.domain_uuid}`,
        auth: config.PBX_API.AUTH,
      };

      try {
        const response = await axios.request(api_config);

        if (response.status === 200) {
          await ring_group.deleteOne({ ring_group_uuid: uuid })
          return response.data;
        } else {
          throw new TRPCError({ code: "BAD_GATEWAY" });
        }
      } catch (e) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
