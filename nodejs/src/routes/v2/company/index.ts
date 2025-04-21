import company from "../../../models/company";
import { router } from "../../../utils/trpc";
import { authorizedProcedure } from "../dashboardRouter/procedure";

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
