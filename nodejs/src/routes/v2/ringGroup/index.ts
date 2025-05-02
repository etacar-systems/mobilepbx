import { TRPCError } from "@trpc/server";
import axios from "axios";

import company from "../../../models/company";
import { router } from "../../../utils/trpc";
import { authorizedProcedure } from "../dashboardRouter/procedure";
import { config } from "../../../config";
import { getRingGroupDetails } from "../adminRouter/ringGroup/ringGroup.dto";
import { TRingGroupDetails } from "../adminRouter/ringGroup/types";

export const ringGroupRouter = router({
  namelist: authorizedProcedure.query(async ({ ctx: { user } }) => {
    const companyDetails = await company.findById(user.cid).select({
      domain_uuid: true,
    });

    if (!companyDetails?.domain_uuid) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.RING_GROUP.NAMELIST,
      auth: config.PBX_API.AUTH,
      data: {
        domain_id: companyDetails?.domain_uuid,
      },
    };

    try {
      const namelist = await axios.request<
        Array<{
          app: string;
          data: string;
          extension: string;
          name: string;
          uuid: string;
        }>
      >(api_config);
      if (namelist.status === 200) {
        return namelist.data || [];
      } else {
        throw new TRPCError({ code: "BAD_GATEWAY" });
      }
    } catch (e) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
  details: authorizedProcedure
    .input(getRingGroupDetails)
    .query(async ({ ctx: { user }, input }) => {
      const companyDetails = await company.findById(user.cid).select({
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
});
