import { Router } from "express";
import axios from "axios";

import company from "../../../models/company";
import user from "../../../models/user";
import { router } from "../../../utils/trpc";
import { authorizedProcedure } from "../dashboardRouter/procedure";
import authUser from "../../../middleware/authUser";
import { config } from "../../../config";

export const companyRouter = router({
  namesList: authorizedProcedure.query(async () => {
    const companyNames: Array<{
      _id: string;
      company_name: string;
      domain_name: string;
      domain_uuid: string;
    }> = await company
      .find({
        is_deleted: 0,
      })
      .select({
        _id: true,
        company_name: true,
        domain_name: true,
        domain_uuid: true,
      });

    return companyNames;
  }),
});

export const expressRouter = Router();

expressRouter.get(
  "/company/call_record/:year/:month/:day/:filename",
  authUser,
  async (req, res) => {
    const params = req.params;

    // @ts-ignore
    const requester = await user.findOne(req.user_id).select({ cid: true });

    if (!requester) {
      return res.status(403);
    }

    const companyDetails = await company
      .findOne(requester.cid)
      .select({ domain_name: true });

    if (!companyDetails?.domain_name) {
      return res.status(403);
    }

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", 'inline; filename="audio.wav"');

    try {
      const response = await axios.get(
        config.PBX_API.RECORDING.GET_AUDIO,
        {
          params: {
            ...params,
            filename: params.filename.split('.')[0],
            domain: companyDetails.domain_name,
          },
          responseType: "stream",
          auth: config.PBX_API.AUTH,
        }
      );
      if (response.status === 200) {
        return response.data.pipe(res);
      } else {
        return res.status(response.status);
      }
    } catch (e) {
      return res.status(500);
    }
  }
);