import { TRPCError } from "@trpc/server";
import axios from "axios";

import company from "../../../models/company";
import { router } from "../../../utils/trpc";
import { authorizedProcedure } from "../dashboardRouter/procedure";
import { config } from "../../../config";

export const recordingRouter = router({
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
      url: config.PBX_API.RECORDING.NAMELIST,
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
          recording_filename: string;
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
});
