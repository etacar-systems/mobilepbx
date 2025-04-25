import { Types } from "mongoose";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import pstn_number from "../../../../models/pstn_number";
import { publicProcedure, router } from "../../../../utils/trpc";
import { superAdminProcedure } from "../procedure";
import {
  getPSTNDetails,
  pstnListDto,
  pstnNumberRangeDto,
  selectionDto,
  updateDto,
} from "./pstn.dto";
import company from "../../../../models/company";
import trunks from "../../../../models/trunks";
import { config } from "../../../../config";
import extension from "../../../../models/extension";

export const pstnRouter = router({
  add: superAdminProcedure
    .input(pstnNumberRangeDto)
    .mutation(async ({ ctx: { admin }, input }) => {
      const gatewayIdDetail = await trunks.findOne({
        _id: input.gateway_id,
        is_deleted: 0,
      });

      const companyDetail = await company.findOne({
        _id: input.company_id,
        is_deleted: 0,
      });

      if (!companyDetail || !gatewayIdDetail) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const numbers: Array<string> = [];

      for (let i = 0; i <= input.range; i++) {
        numbers.push((Number(input.destination_number) + i).toString());
      }

      const existing_numbers: Array<{ destination: string; _id: string }> =
        await pstn_number
          .find({ is_deleted: 0, destination: { $in: numbers } })
          .select({
            destination: true,
          });

      if (existing_numbers.length !== 0) {
        return {
          duplicateNumbers: existing_numbers.map(
            (number) => number.destination
          ),
          createdNumbers: [],
        };
      }

      const api_config = {
        method: "post",
        maxBodyLength: Infinity,
        url: config.PBX_API.PSTN.BULK_ADD,
        auth: config.PBX_API.AUTH,
        data: {
          domain: companyDetail?.domain_uuid,
          type: "inbound",
          user: "",
          create_range: input.range,
          destination: input.destination_number,
          caller_id_name: "",
          caller_id_number: "",
          destination_condition: "",
          destination_action: "",
          description: "",
          destination_enabled: "true",
          trunk_id: gatewayIdDetail?.trunks_uuid,
        },
      };

      try {
        const data = await axios.request(api_config);

        const duplicateNumbers: Array<number> = data.data.duplicate_numbers;
        delete data.data.duplicate_numbers;
        const newNumbers: Array<{
          msg: string;
          destination_number: number;
          id: string;
        }> = Object.values(data.data);

        if (data.status === 200) {
          const obj = {
            type: api_config.data.type,
            user: api_config.data.user,
            caller_id_name: api_config.data.caller_id_name,
            caller_id_number: api_config.data.caller_id_number,
            destination_condition: api_config.data.destination_condition,
            description: api_config.data.description,
            destination_enabled: api_config.data.destination_enabled,
            last_updated_user: admin._id,
            cid: input.company_id,
            gateway_id: input.gateway_id,
            pstn_range_uuid: uuidv4(),
          };
          type TPSTNNumbersList = Array<
            typeof obj & {
              assigend_extensionId: null;
              pstn_uuid: string;
              destination: string;
              updatedAt: string;
              createdAt: string;
              is_deleted: number;
              isassigned: number;
              select_type: null;
              select_type_uuid: string;
              _id: string;
            }
          >;
          const createdNumbers: TPSTNNumbersList =
            (await pstn_number.insertMany(
              newNumbers.map((number) => ({
                ...obj,
                pstn_uuid: number.id,
                destination: number.destination_number,
              }))
            )) as unknown as TPSTNNumbersList;

          return {
            duplicateNumbers,
            createdNumbers,
          };
        } else {
          throw new TRPCError({ code: "BAD_GATEWAY" });
        }
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  list: superAdminProcedure.input(pstnListDto).query(async ({ input }) => {
    let find_query: { [key: string]: any } = {
      is_deleted: 0,
    };
    if (input.cid) {
      find_query.cid = new Types.ObjectId(input.cid);
    }
    if (input.search) {
      find_query.$or = [
        {
          destination: {
            $regex: input.search,
            $options: "i",
          },
        },
        {
          "trunk_detail.gateway_name": {
            $regex: input.search,
            $options: "i",
          },
        },
        {
          "cid_detail.company_name": {
            $regex: input.search,
            $options: "i",
          },
        },
      ];
    }

    const aggregateCondition = [
      {
        $lookup: {
          from: "trunks",
          localField: "gateway_id",
          foreignField: "_id",
          pipeline: [{ $match: { is_deleted: 0 } }],
          as: "trunk_detail",
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "cid",
          foreignField: "_id",
          pipeline: [{ $match: { is_deleted: 0 } }],
          as: "cid_detail",
        },
      },
      { $match: find_query },
    ];

    const pages = await pstn_number.aggregate([
      ...aggregateCondition,
      {
        $group: {
          _id: "$pstn_range_uuid",
        },
      },
      {
        $group: {
          _id: null,
          totalGroups: { $sum: 1 },
        },
      },
    ]);

    const data: Array<{
      count: number;
      documents: Array<{
        cid: string;
        destination: string;
        gateway_id: string;
        pstn_range_uuid: string;
        type: "inbound";
        _id: string;
        trunk_detail: [
          {
            gateway_name: string;
          }
        ];
        cid_detail: [{ company_name: string }];
      }>;
    }> = await pstn_number.aggregate([
      ...aggregateCondition,
      {
        $addFields: {
          intDestination: { $toInt: "$destination" },
        },
      },
      {
        $project: {
          destination: 1,
          cid: 1,
          gateway_id: 1,
          trunk_name: 1,
          company_name: 1,
          intDestination: 1,
          type: 1,
          pstn_range_uuid: 1,
          trunk_detail: {
            gateway_name: 1,
          },
          cid_detail: { company_name: 1 },
        },
      },
      {
        $sort: {
          ...(input.sort_column === "company_name"
            ? {
                "cid_detail.company_name":
                  input.sort_direction === "asc" ? 1 : -1,
              }
            : {}),
          ...(input.sort_column === "trunk_name"
            ? {
                "trunk_detail.gateway_name":
                  input.sort_direction === "asc" ? 1 : -1,
              }
            : {}),
          intDestination:
            input.sort_column === "destination"
              ? input.sort_direction === "asc"
                ? 1
                : -1
              : 1,
        },
      },
      {
        $group: {
          _id: "$pstn_range_uuid",
          count: { $sum: 1 },
          documents: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          ...(input.sort_column === "company_name"
            ? {
                "documents.cid_detail.company_name":
                  input.sort_direction === "asc" ? 1 : -1,
              }
            : {}),
          ...(input.sort_column === "trunk_name"
            ? {
                "documents.trunk_detail.gateway_name":
                  input.sort_direction === "asc" ? 1 : -1,
              }
            : {}),
          "documents.intDestination":
            input.sort_column === "destination"
              ? input.sort_direction === "asc"
                ? 1
                : -1
              : 1,
        },
      },
      {
        $skip: (input.page - 1) * input.limit,
      },
      {
        $limit: input.limit,
      },
    ]);

    return {
      data: data.map((pstn_entity) => ({
        ...pstn_entity.documents[0],
        company_name: pstn_entity?.documents[0]?.cid_detail[0]
          ?.company_name as string,
        destination:
          pstn_entity.documents[
            input.sort_column === "destination" &&
            input.sort_direction === "desc"
              ? pstn_entity.documents.length - 1
              : 0
          ].destination +
          "-" +
          pstn_entity.documents[
            input.sort_column === "destination" &&
            input.sort_direction === "desc"
              ? 0
              : pstn_entity.documents.length - 1
          ].destination,
        trunk_name: (pstn_entity?.documents[0]?.trunk_detail[0]?.gateway_name ||
          "") as string,
      })),
      total_page_count: Math.ceil((pages[0]?.totalGroups || 0) / input.limit),
      pstn_total_counts: (pages[0]?.totalGroups || 0) as number,
    };
  }),
  detail: superAdminProcedure
    .input(getPSTNDetails)
    .query(async ({ input: { uuid } }) => {
      const pstn_details: Array<{
        _doc: {
          assigend_extensionId: string | null;
          caller_id_name: string;
          caller_id_number: string;
          cid: string;
          createdAt: string;
          description: string;
          destination: string;
          destination_action: Array<any>;
          destination_condition: string;
          destination_enabled: boolean;
          gateway_id: string;
          is_deleted: number;
          isassigned: number;
          last_updated_user: string | null;
          pstn_range_uuid: string;
          pstn_uuid: string;
          select_type: string | null;
          select_type_uuid: string;
          type: "inbound";
          updatedAt: string;
          user: string;
          _id: string;
        };
      }> = await pstn_number.find(
        {
          pstn_range_uuid: uuid,
          is_deleted: 0,
        },
        undefined,
        {
          sort: {
            destination: 1,
          },
        }
      );

      if (!pstn_details?.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        ...pstn_details[0]._doc,
        destination_start: pstn_details[0]._doc.destination,
        destination_end: pstn_details[pstn_details.length - 1]._doc.destination,
      };
    }),
  delete: superAdminProcedure
    .input(getPSTNDetails)
    .mutation(async ({ input }) => {
      // let data:any = req.body
      // let cid:any = data.cid

      // if(Object.keys(data).length === 0){
      //   return res.status(400).send({
      //      success: 0,
      //      message: "Request Body Params Is Empty"
      //    });
      //  }

      //  if(cid == undefined){
      //   return res.status(400).send({
      //     success: 0,
      //     message: "Company Id Is Mandatory."
      //   });
      //  }

      //  if(!mongoose.Types.ObjectId.isValid(cid)){
      //   return res.status(400).send({
      //     success: 0,
      //     message: "Company Id Is Invalid."
      //   });
      //  }

      const pstn_ids: Array<Record<"_id" | "pstn_uuid", string>> =
        await pstn_number
          .find({
            pstn_range_uuid: input.uuid,
            is_deleted: 0,
          })
          .select({
            _id: true,
            pstn_uuid: true,
          });

      let check_assigned_pstn: any = await extension
        .find({
          pstn_number: { $in: pstn_ids.map((ids) => ids._id) },
        })
        .countDocuments();

      if (check_assigned_pstn > 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Copmany Pstn Number already assigned to Extension  pls Unassign First.",
        });
      }

      try {
        let api_config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: `${config.PBX_API.PSTN.REMOVE}${pstn_ids
            .map((id) => "'" + id.pstn_uuid + "'")
            .join(",")}`,
          auth: config.PBX_API.AUTH,
        };

        const data: any = await axios.request(api_config);

        await pstn_number.deleteMany({
          pstn_range_uuid: input.uuid,
        });
      } catch (e) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return {
        pstn_details: pstn_ids,
        message: "Pstn Deleted Successfully.",
      };
    }),
  update: superAdminProcedure
    .input(updateDto)
    .mutation(async ({ input, ctx }) => {
      const gatewayIdDetail = await trunks.findOne({
        _id: input.gateway_id,
        is_deleted: 0,
      });

      const companyDetail = await company.findOne({
        _id: input.company_id,
        is_deleted: 0,
      });

      if (!companyDetail || !gatewayIdDetail) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const pstn_ids: Array<Record<"_id" | "pstn_uuid", string>> =
        await pstn_number
          .find({
            pstn_range_uuid: input.uuid,
            is_deleted: 0,
          })
          .select({
            _id: true,
            pstn_uuid: true,
          });

      let api_config_update = {
        method: "put",
        maxBodyLength: Infinity,
        url: config.PBX_API.PSTN.UPDATE,
        auth: config.PBX_API.AUTH,
        data: {
          domain: companyDetail?.domain_uuid,
          type: "inbound",
          destination_ids: pstn_ids
            .map((id) => "'" + id.pstn_uuid + "'")
            .join(","),
        },
      };

      try {
        const response = await axios.request(api_config_update);

        if (response.status === 200) {
          const updatedNumbers = await pstn_number.updateMany(
            {
              pstn_range_uuid: input.uuid,
            },
            {
              cid: input.company_id,
              gateway_id: input.gateway_id,
              last_updated_user: ctx.admin._id,
            }
          );

          return {
            updated: updatedNumbers,
            companyName: companyDetail.company_name.toString(),
            trunkName: gatewayIdDetail.gateway_name.toString(),
          };
        } else {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      } catch (e) {
        console.log(e);
      }
    }),
});
