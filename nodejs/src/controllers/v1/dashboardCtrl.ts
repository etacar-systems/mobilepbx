import { Request, Response, NextFunction } from "express";
import company from "../../models/company";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import axios from "axios";
import moment from "moment";
import ring_group from "../../models/ring_group";
import user from "../../models/user";
import CdrModel from "../../models/cdrs";
import { PipelineStage } from "mongoose";
import role from "../../models/role";
import { CDRLogs } from "../../routes/v1/cdr_logs";

function convertISODate(date: String): String {
  return new Date(`${date.replace(" ", "T")}Z`).toISOString();
}

const getDasboardDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = await get_token(req);
    const user_detail = await User_token(token);
    let dashboard_response_obj: { [key: string]: any } = {};

    let companyDetail: any = await company.findOne({
      _id: user_detail?.cid,
      is_deleted: 0,
    });

    console.log("companyDetail", user_detail);

    if (!companyDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Company Not Found.",
      });
    }

    let start_date: any = req.query.start_date;
    let end_date: any = req.query.end_date;
    let call_matrics_type: any = req.query.call_matrics_type;
    let type_value: any = ["today", "week", "month", "year"];

    if (start_date == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `Start Date Is Mandatory.`,
      });
    }

    if (end_date == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `End Date Is Mandatory.`,
      });
    }

    if (call_matrics_type == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `Call Matrics Type Is Mandatory.`,
      });
    }

    if (start_date == "" || !moment(start_date, "YYYY-MM-DD HH:mm", true).isValid()) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `Start Date Is Invalid.`,
      });
    }

    if (end_date == "" || !moment(end_date, "YYYY-MM-DD HH:mm", true).isValid()) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `End Date Is Invalid.`,
      });
    }

    if (call_matrics_type == "" || !type_value.includes(call_matrics_type)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `Call Matrics Type Is Invalid.`,
      });
    }

    const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.DASHBOARD.GET_REPORTS,
      auth: config.PBX_API.AUTH,
      data: {
        domain_id: companyDetail.domain_uuid,
        // start_date: convertISODate(start_date),
        // end_date: convertISODate(end_date),
        // defaultTimezone,
      },
    };

    // console.log(convertISODate(start_date), convertISODate(end_date))

    // interface ICdr extends Document {
    //   domain_uuid: string;
    //   start_stamp: string; // Could be Date in the database or string in the model
    //   answer_stamp: string; // Same as start_stamp, either Date or string
    //   // Other fields can be added as necessary
    // }

    // const getTotalAnswerDuration = async (domain_uuid: string): Promise<number> => {
    //   try {
    //     // Fetch all documents matching the domain_uuid, ensuring both start_stamp and answer_stamp exist
    //     const data: ICdr[] = await CdrModel.find({
    //       domain_uuid: domain_uuid,
    //       answer_stamp: { $exists: true },
    //       start_stamp: { $exists: true },
    //     }).exec();

    //     // Calculate the total answer duration using reduce
    //     const totalAnswerDuration = data.reduce((total, record) => {
    //       // Ensure that both start_stamp and answer_stamp are valid Date objects
    //       const startStamp = new Date(record.start_stamp);
    //       const answerStamp = new Date(record.answer_stamp);

    //       // If both timestamps are valid, calculate the duration in seconds
    //       if (!isNaN(startStamp.getTime()) && !isNaN(answerStamp.getTime())) {
    //         const durationInSeconds = (answerStamp.getTime() - startStamp.getTime()) / 1000; // Convert milliseconds to seconds
    //         return total + durationInSeconds;
    //       }
    //       return total; // If the timestamps are invalid, return the accumulated total
    //     }, 0);

    //     console.log(totalAnswerDuration, "Total Answer Duration in Seconds");
    //     return totalAnswerDuration; // Return the total answer duration
    //   } catch (error) {
    //     console.error("Error fetching total answer duration:", error);
    //     throw error; // Handle errors
    //   }
    // };

    // getTotalAnswerDuration(companyDetail.domain_uuid)
    //   .then((totalAnswerDuration) => {
    //     console.log("Total Answer Duration in Seconds:", totalAnswerDuration); // Log the total duration
    //   })
    //   .catch((err) => {
    //     console.error("Error:", err); // Handle any errors during the function execution
    //   });

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      console.log(
        start_date,
        "start_date",
        end_date,
        "end_date",
        new Date(start_date + "Z"),
        new Date(end_date + "Z")
      );
      const data = await CdrModel.aggregate([
        {
          $match: {
            domain_uuid: companyDetail.domain_uuid,
            start_stamp: {
              $gte: new Date(start_date + "Z"),
              $lt: new Date(end_date + "Z"),
            },
          },
        },
        {
          $set: {
            start_stamp: { $toDate: "$start_stamp" },
            answer_stamp: { $toDate: "$answer_stamp" },
            response_time_sec: {
              $divide: [
                { $subtract: [{ $toDate: "$answer_stamp" }, { $toDate: "$start_stamp" }] },
                1000,
              ],
            },
          },
        },

        {
          $group: {
            _id: null,
            total_calls: {
              $sum: {
                $cond: [{ $eq: ["$leg", "a"] }, 1, 0],
              },
            },
            total_duration_sec: {
              $sum: {
                $cond: [{ $eq: ["$leg", "a"] }, "$duration", 0],
              },
            },
            avg_response_sec: {
              $avg: {
                $cond: [{ $eq: ["$leg", "a"] }, "$response_time_sec", null],
              },
            },
            today_total_calls: {
              $sum: {
                $cond: [
                  { $and: [{ $gte: ["$start_stamp", today] }, { $eq: ["$leg", "a"] }] },
                  1,
                  0
                ],
              },
            },
            today_missed_calls: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$status", "missed"] },
                      { $gte: ["$start_stamp", today] },
                      { $eq: ["$leg", "a"] }
                    ]
                  },
                  1,
                  0
                ],
              },
            },
            total_missed: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ["$status", "missed"] }, { $eq: ["$leg", "a"] }] },
                  1,
                  0
                ],
              },
            },
            total_answered: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ["$status", "answered"] }, { $eq: ["$leg", "a"] }] },
                  1,
                  0
                ],
              },
            },
            voicemailCalls: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ["$status", "voicemail"] }, { $eq: ["$leg", "a"] }] },
                  1,
                  0
                ],
              },
            },
            total_outbound: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ["$status", "outbound_calls"] }, { $eq: ["$leg", "a"] }] },
                  1,
                  0
                ],
              },
            },
            total_local: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ["$direction", "local"] }, { $eq: ["$leg", "a"] }] },
                  1,
                  0
                ],
              },
            },
            inboundCalls: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ["$direction", "inbound"] }, { $eq: ["$leg", "a"] }] },
                  1,
                  0
                ],
              },
            },
          },
        },


        // {
        //   $group: {
        //     _id: null,
        //     total_calls: { $sum: 1 },
        //     total_duration_sec: { $sum: "$duration" },
        //     avg_response_sec: { $avg: "$response_time_sec" },
        //     today_total_calls: {
        //       $sum: {
        //         $cond: [{ $gte: ["$start_stamp", today] }, 1, 0],
        //       },
        //     },
        //     today_missed_calls: {
        //       $sum: {
        //         $cond: [
        //           // { $and: [{ $eq: ["$status", "missed"] }, { $gte: ["$start_stamp", today] }] },
        //           { $and: [{ $ne: ["$status", "answered"] }, { $gte: ["$start_stamp", today] }] },
        //           1,
        //           0,
        //         ],
        //       },
        //     },
        //     total_missed: {
        //       $sum: {
        //         $cond: [{ $ne: ["$status", "answered"] }, 1, 0],
        //         // $cond: [{ $eq: ["$status", "missed"] }, 1, 0],
        //       },
        //     },
        //     total_answered: {
        //       $sum: {
        //         $cond: [{ $eq: ["$status", "answered"] }, 1, 0],
        //       },
        //     },
        //     voicemailCalls: {
        //       $sum: {
        //         $cond: [{ $eq: ["$status", "voicemail"] }, 1, 0],
        //       },
        //     },
        //     total_outbound: {
        //       $sum: {
        //         $cond: [{ $eq: ["$status", "outbound_calls"] }, 1, 0],
        //       },
        //     },
        //     total_local: {
        //       $sum: {
        //         $cond: [{ $eq: ["$direction", "local"] }, 1, 0],
        //       },
        //     },
        //     inboundCalls: {
        //       $sum: {
        //         $cond: [{ $eq: ["$direction", "inbound"] }, 1, 0],
        //       },
        //     },
        //   },
        // },

        {
          $project: {
            _id: 0,
            total_calls: 1,
            total_duration_sec: 1,
            today_total_calls: 1,
            today_missed_calls: 1,
            today_missed_call_percentage: {
              $cond: [
                { $eq: ["$today_total_calls", 0] },
                0,
                {
                  $round: [
                    { $divide: ["$today_missed_calls", "$today_total_calls"] },
                    2, // Rounds to 2 decimal places
                  ],
                },
              ],
            },
            avg_response_sec: 1,
            total_missed: 1,
            total_answered: 1,
            total_outbound: 1,
            total_local: 1,
            voicemailCalls: 1,
            inboundCalls: 1,
          },
        },
      ]);
      console.log(
        {
          ...(data ? data[0] : ""),
        },
        "--data--"
      );

      // const missedCallCount = async (domain_uuid: any) => {
      //   try {
      //     const data = await CdrModel.countDocuments({
      //       domain_uuid: domain_uuid,
      //       start_stamp: {
      //         $gte: new Date(start_date + "Z"),
      //         $lt: new Date(end_date + "Z"),
      //       }, // Add filter for start_stamp within the date range
      //     }).exec();
      //     console.log(data, "missed");
      //     return data; // Return the result
      //   } catch (error) {
      //     console.error("Error fetching data:", error);
      //     throw error;
      //   }
      // };

      // missedCallCount(companyDetail.domain_uuid);
      dashboard_response_obj.reports_counts_updated = {
        ...(data ? data[0] : ""),
      };
      // return res.json({
      //   success: 1,
      //   message: "Dashboard Detail",
      //   DashboardDetail: {
      //     reports_counts: {
      //       ...data[0],
      //       today_missed_call_percentage: data[0].today_missed_calls
      //         ? (data[0].today_missed_calls / data[0].today_total_calls) * 100
      //         : 0,
      //     },
      //   },
      //   extra: {
      //     domain_uuid: companyDetail.domain_uuid,
      //     start_date: convertISODate(start_date),
      //     end_date: convertISODate(end_date),
      //   },
      // });
    } catch (error) {
      console.error("Error fetching call statistics:", error);
      throw error;
    }

    //  console.log("khanjan_api_config", api_config);

    // const userData: any = await user.findOne({
    //   _id: user_detail?.uid,
    //   is_deleted: 0,
    // });

    // const userType: any = await role.findOne({
    //   _id: userData?.role
    // })


    try {
      const reports_api_data: any = await axios.request(api_config);
      dashboard_response_obj.reports_counts_updated = {
        ...dashboard_response_obj.reports_counts_updated,
        sla: reports_api_data?.data?.sla,
        call_comparison: reports_api_data?.data?.call_comparison,
      };

      // const pipeline: PipelineStage[] = [
      //   {
      //     $match: {

      //       cid: companyDetail._id, // Always filter by domain_uuid
      //       user_extension: { $ne: "" },
      //       is_deleted: 0,
      //       // logType
      //       // ...(userType.type === 1 ? { extension_uuid: userData.extension_uuid } : {}),
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "cdrs", // Join with the 'cdrs' collection
      //       localField: "extension_uuid", // users.extension_uuid
      //       foreignField: "extension_uuid", // cdrs.extension_uuid
      //       as: "cdrDetails",
      //     },
      //   },
      //   {
      //     $match: {
      //       $and: [
      //         { "cdrDetails.start_stamp": { $gte: start_date } }, // Start date filter
      //         { "cdrDetails.start_stamp": { $lte: end_date } },  // End date filter
      //       ],
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$cdrDetails",
      //       preserveNullAndEmptyArrays: true // Ensure users with no matching cdrs are included
      //     },
      //   },

      //   {
      //     $group: {
      //       _id: { extension_uuid: "$extension_uuid" }, // Group by extension UUID

      //       total_calls: { $sum: { $cond: [{ $ifNull: ["$cdrDetails", false] }, 1, 0] } }, // Count total calls only if cdrDetails exists
      //       answered: {
      //         $sum: {
      //           $cond: [
      //             {
      //               $and: [
      //                 { $eq: ["$cdrDetails.status", "answered"] },
      //                 { $ne: ["$cdrDetails.direction", "agent"] },
      //               ],
      //             },
      //             1,
      //             0,
      //           ],
      //         },
      //       },
      //       missed: {
      //         $sum: {
      //           $cond: [{ $eq: ["$cdrDetails.status", "missed"] }, 1, 0],
      //         },
      //       },
      //       no_answer: {
      //         $sum: {
      //           $cond: [{ $eq: ["$cdrDetails.hangup_cause", "NO_ANSWER"] }, 1, 0],
      //         },
      //       },
      //       busy: {
      //         $sum: {
      //           $cond: [{ $eq: ["$cdrDetails.hangup_cause", "USER_BUSY"] }, 1, 0],
      //         },
      //       },
      //       avg_call_length: { $avg: "$cdrDetails.duration" }, // Average call length
      //       inbound_calls: {
      //         $sum: {
      //           $cond: [{ $eq: ["$cdrDetails.direction", "inbound"] }, 1, 0],
      //         },
      //       },
      //       inbound_duration: {
      //         $sum: {
      //           $cond: [{ $eq: ["$cdrDetails.direction", "inbound"] }, "$cdrDetails.duration", 0],
      //         },
      //       },
      //       local_calls: {
      //         $sum: {
      //           $cond: [{ $eq: ["$cdrDetails.direction", "local"] }, 1, 0],
      //         },
      //       },
      //       local_duration: {
      //         $sum: {
      //           $cond: [{ $eq: ["$cdrDetails.direction", "local"] }, "$cdrDetails.duration", 0],
      //         },
      //       },
      //       outbound_calls: {
      //         $sum: {
      //           $cond: [{ $eq: ["$cdrDetails.direction", "outbound"] }, 1, 0],
      //         },
      //       },
      //       outbound_duration: {
      //         $sum: {
      //           $cond: [{ $eq: ["$cdrDetails.direction", "outbound"] }, "$cdrDetails.duration", 0],
      //         },
      //       },
      //       userDetails: { $first: "$$ROOT" }, // Include the first userDetails
      //     },
      //   },
      //   { $sort: { _id: 1 } }, // Sort by extension UUID
      // ];

      const pipeline: PipelineStage[] = [
        {
          $match: {
            cid: companyDetail._id, // Filter by company ID
            user_extension: { $ne: "" },
            is_deleted: 0,
          },
        },
        {
          $lookup: {
            from: "cdrs", // Join with the 'cdrs' collection
            let: { extensionUuid: "$extension_uuid" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$extension_uuid", "$$extensionUuid"] }, // Match extension_uuid
                      { $gte: ["$start_stamp", new Date(start_date)] }, // Filter by start_date
                      { $lte: ["$start_stamp", new Date(end_date)] },  // Filter by end_date
                    ],
                  },
                },
              },
            ],
            as: "cdrDetails",
          },
        },
        {
          $unwind: {
            path: "$cdrDetails",
            preserveNullAndEmptyArrays: true, // Include users with no matching cdrs
          },
        },
        {
          $group: {
            _id: { extension_uuid: "$extension_uuid" }, // Group by extension UUID
            total_calls: { $sum: { $cond: [{ $ifNull: ["$cdrDetails", false] }, 1, 0] } }, // Count total calls only if cdrDetails exists
            answered: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$cdrDetails.status", "answered"] },
                      { $ne: ["$cdrDetails.direction", "agent"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            missed: {
              $sum: {
                $cond: [{ $eq: ["$cdrDetails.status", "missed"] }, 1, 0],
              },
            },
            no_answer: {
              $sum: {
                $cond: [{ $eq: ["$cdrDetails.hangup_cause", "NO_ANSWER"] }, 1, 0],
              },
            },
            busy: {
              $sum: {
                $cond: [{ $eq: ["$cdrDetails.hangup_cause", "USER_BUSY"] }, 1, 0],
              },
            },
            avg_call_length: { $avg: "$cdrDetails.duration" }, // Average call length
            inbound_calls: {
              $sum: {
                $cond: [{ $eq: ["$cdrDetails.direction", "inbound"] }, 1, 0],
              },
            },
            inbound_duration: {
              $sum: {
                $cond: [{ $eq: ["$cdrDetails.direction", "inbound"] }, "$cdrDetails.duration", 0],
              },
            },
            local_calls: {
              $sum: {
                $cond: [{ $eq: ["$cdrDetails.direction", "local"] }, 1, 0],
              },
            },
            local_duration: {
              $sum: {
                $cond: [{ $eq: ["$cdrDetails.direction", "local"] }, "$cdrDetails.duration", 0],
              },
            },
            outbound_calls: {
              $sum: {
                $cond: [{ $eq: ["$cdrDetails.direction", "outbound"] }, 1, 0],
              },
            },
            outbound_duration: {
              $sum: {
                $cond: [{ $eq: ["$cdrDetails.direction", "outbound"] }, "$cdrDetails.duration", 0],
              },
            },
            userDetails: { $first: "$$ROOT" }, // Include the first userDetails
          },
        },
        { $sort: { _id: 1 } }, // Sort by extension UUID
      ];


      const extension_list = await user.aggregate(pipeline).exec();

      console.log("extension_listextension_list", extension_list);

      if (
        reports_api_data?.data?.data ||
        reports_api_data?.data?.total_counts ||
        reports_api_data?.data?.sla ||
        reports_api_data?.data?.call_comparison ||
        extension_list
      ) {
        // const mergedArray = reports_api_data?.data?.data?.map((u: any) => {
        //   const matchingCall = extension_list.find((c: any) => c.user_extension === u.extension);
        //   return { ...u, ...matchingCall };
        // });
        // console.log("mergers arraymergers array",mergedArray);

        let extension_detail_data: any = {
          // extensions: mergedArray,
          extensions: reports_api_data?.data?.data,
          extension_list: extension_list,
        };
        dashboard_response_obj.extensions_detail = extension_detail_data;

        let reports_counts: any = {
          total_calls: reports_api_data?.data?.total_counts?.total_calls,
          total_outbound: reports_api_data?.data?.total_counts?.total_outbound,
          total_local: reports_api_data?.data?.total_counts?.total_local,
          total_answered: reports_api_data?.data?.total_counts?.total_answered,
          total_missed: reports_api_data?.data?.total_counts?.total_missed,
          total_duration_sec: reports_api_data?.data?.total_counts?.total_duration_sec,
          avg_response_sec: reports_api_data?.data?.total_counts?.avg_response_sec,
          today_total_calls: (reports_api_data?.data?.total_counts?.today_total_calls),
          today_missed_calls: reports_api_data?.data?.total_counts?.today_missed_calls,
          today_missed_calls_percentage:
            reports_api_data?.data?.total_counts?.today_missed_calls_percentage,
          sla: reports_api_data?.data?.sla,
          call_comparison: reports_api_data?.data?.call_comparison,
        };
        dashboard_response_obj.reports_counts = reports_counts;
      }
    } catch (error: any) {
      console.log("error", error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to Get Reports",
      });
    }

    let api_config_call_metrix = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.DASHBOARD.GET_CALL_MATRICS,
      auth: config.PBX_API.AUTH,
      data: {
        domain_id: companyDetail.domain_uuid,
        type: call_matrics_type,
      },
    };

    try {
      const call_metrix_api_data: any = await axios.request(api_config_call_metrix);

      // new
      const pipeline2 = [
        {
          $match: {
            domain_uuid: companyDetail?.domain_uuid, // Add your specific domain_uuid here
          }
        },
        {
          $facet: {
            total_calls: [
              { $count: "total_calls" }
            ],
            inbound_calls: [
              {
                $match: {
                  direction: "inbound",
                  // $or: [{ cc_side: null }, { cc_side: { $ne: "agent" } }]
                }
              },
              { $count: "inbound_calls" }
            ],
            local_calls: [
              {
                $match: {
                  direction: "local",
                  // $or: [{ cc_side: null }, { cc_side: { $ne: "agent" } }]
                }
              },
              { $count: "local_calls" }
            ],
            outbound_calls: [
              { $match: { direction: "outbound" } },
              { $count: "outbound_calls" }
            ],
            no_answer: [
              {
                $match: {
                  hangup_cause: "NO_ANSWER",
                  $and: [
                    // { $or: [{ cc_side: { $ne: null } }, { cc_side: "agent" }] },
                    { $or: [{ direction: "inbound" }, { direction: "local" }] }
                  ]
                }
              },
              { $count: "no_answer" }
            ],
            answered: [
              {
                $match: {
                  missed_call: false,
                  // $or: [{ cc_side: null }, { cc_side: { $ne: "agent" } }],
                  $or: [{ direction: "inbound" }, { direction: "local" }]
                }
              },
              { $count: "answered" }
            ],
            missed: [
              {
                $match: {
                  missed_call: true,
                  // $or: [{ cc_side: null }, { cc_side: { $ne: "agent" } }]
                }
              },
              { $count: "missed" }
            ]
          }
        },
        {
          $project: {
            total_calls: { $arrayElemAt: ["$total_calls.total_calls", 0] },
            inbound_calls: { $arrayElemAt: ["$inbound_calls.inbound_calls", 0] },
            local_calls: { $arrayElemAt: ["$local_calls.local_calls", 0] },
            outbound_calls: { $arrayElemAt: ["$outbound_calls.outbound_calls", 0] },
            no_answer: { $arrayElemAt: ["$no_answer.no_answer", 0] },
            answered: { $arrayElemAt: ["$answered.answered", 0] },
            missed: { $arrayElemAt: ["$missed.missed", 0] }
          }
        }
      ];

      const call_matrix_new = await CdrModel.aggregate(pipeline2).exec();

      if (call_metrix_api_data?.data?.data && call_metrix_api_data?.data?.total_counts) {
        let call_matrics_data = {
          call_metrics: call_metrix_api_data?.data?.data,
          total_inbound: call_metrix_api_data?.data?.total_counts.total_inbound,
          total_outbound: call_metrix_api_data?.data?.total_counts.total_outbound,
          total_local: call_metrix_api_data?.data?.total_counts.total_local,
          total_answered: call_metrix_api_data?.data?.total_counts.total_answered,
          total_unanswered: call_metrix_api_data?.data?.total_counts.total_unanswered,
          total_missed: call_metrix_api_data?.data?.total_counts.total_missed,
        };
        dashboard_response_obj.call_metrics_detail = call_matrics_data;
        dashboard_response_obj.call_metrics_new_detail = call_matrix_new;
      }
    } catch (error: any) {
      console.log("error", error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to Get Reports",
      });
    }

    let api_config_missed_call = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.DASHBOARD.GET_MISSED_CALL,
      auth: config.PBX_API.AUTH,
      data: {
        domain_id: companyDetail.domain_uuid,
        start_date: start_date,
        end_date: end_date,
      },
    };

    try {
      const missed_call_api_data: any = await axios.request(api_config_missed_call);
      if (missed_call_api_data?.data?.data && missed_call_api_data?.data?.total_counts) {
        let missed_call_data = {
          missed_call: missed_call_api_data?.data?.data,
          total_missed: missed_call_api_data?.data?.total_counts.total_missed,
          total_missed_persentage: missed_call_api_data?.data?.total_counts.total_missed_persentage,
          avg_wait_sec: missed_call_api_data?.data?.total_counts.avg_wait_sec,
        };
        dashboard_response_obj.missed_call_detail = missed_call_data;
      }
    } catch (error: any) {
      console.log("error in misscalled api", error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to Get Reports",
      });
    }

    let api_ring_groups = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.DASHBOARD.GET_RINGGROUP_CALL,
      auth: config.PBX_API.AUTH,
      data: {
        domain_id: companyDetail.domain_uuid,
        // start_date: start_date,
        // end_date: end_date,
      },
    };
    console.log("api_ring_groups", api_ring_groups);
    try {
      const ringroup_api_data: any = await axios.request(api_ring_groups);

      // CHANGED
      const ring_group_list: any = await ring_group.find({
        cid: companyDetail._id,
        is_deleted: 0,
        // createdAt: {
        //   $gte: start_date,
        //   $lt: end_date,
        // },
      });

      const ring_group_data: any = await ring_group.find({
        cid: companyDetail._id,
        is_deleted: 0,
        // createdAt: {
        //   $gte: start_date,
        //   $lt: end_date,
        // },
      });
      console.log("ring_group_data", ring_group_data);
      // console.log("ringroup_api_data",ringroup_api_data)

      if (
        ringroup_api_data?.data?.data ||
        ring_group_list // new
      ) {
        // const mergedArray = ringroup_api_data?.data?.data?.map((r: any) => {
        //   const matchingCall = ring_group_list.find(
        //     (c: any) => c.ring_group_uuid === r.ring_group_uuid
        //   );
        //   return { ...r, ...matchingCall };
        // });

        let ring_group_call_data = {
          // ring_group_call: mergedArray,
          ring_group_call: ring_group_data,
          ring_group_list: ring_group_list, //new
        };
        dashboard_response_obj.ring_group_detail = ring_group_call_data;
      }
    } catch (error: any) {
      console.log("error in misscalled api", error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to Get Reports",
      });
    }

    //new 
    try {
      const getLast7Days = () => {
        const dates = [];
        const currentDate = new Date();

        for (let i = 0; i < 7; i++) {
          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() - i + 1);

          date.setHours(0, 0, 0, 0); // Set to the start of the day
          dates.push(date);
        }
        return dates.reverse(); // Reverse to get chronological order
      }

      const last7Days = getLast7Days();
      console.log("currentdata", last7Days);
      const startDate = last7Days[0]; // Start date is 7 days ago
      const endDate = new Date(); // End date is today

      try {
        const missed_data = await CdrModel.aggregate([
          // {
          //   $match: {
          //     domain_uuid : companyDetail?.domain_uuid,
          //     status: { $ne: 'answered' },
          //     // missed_call: "true",
          //     start_stamp: { $gte: startDate, $lte: endDate },
          //   },
          // },
          // {
          //   $project: {
          //     missed_number: "$caller_id_number",
          //     day: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$start_stamp" } } },
          //     waiting_time: {
          //       $dateDiff: {
          //         startDate: { $toDate: "$start_stamp" },
          //         endDate: { $toDate: "$answer_stamp" },
          //         unit: "second", // Calculate in seconds
          //       },
          //     },
          //   },
          // },
          // {
          //   $group: {
          //     _id: "$day",
          //     missed_calls: { $push: "$missed_number" },
          //     count: { $sum: 1 },
          //     total_waiting_time: { $sum: "$waiting_time" }, // Sum of waiting times
          //   },
          // },
          // {
          //   $addFields: {
          //     average_waiting_time: {
          //       $cond: {
          //         if: { $eq: ["$count", 0] }, // Avoid division by zero
          //         then: 0,
          //         else: { $divide: ["$total_waiting_time", "$count"] }, // Calculate average
          //       },
          //     },
          //   },
          // },
          // {
          //   $sort: { _id: 1 }, // Sort by day
          // },

          {
            $match: {
              domain_uuid: companyDetail?.domain_uuid,
              status: { $ne: 'answered' },
              start_stamp: { $gte: startDate, $lte: endDate },
              leg: { $eq: 'a' }
            },
          },
          {
            $project: {
              missed_number: "$caller_id_number",
              day: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$start_stamp" } } },
              duration: 1, // Include the duration field
            },
          },
          {
            $group: {
              _id: "$day",
              missed_calls: { $push: "$missed_number" },
              count: { $sum: 1 },
              total_waiting_time: { $sum: "$duration" }, // Sum of durations
            },
          },
          {
            $addFields: {
              average_waiting_time: {
                $cond: {
                  if: { $eq: ["$count", 0] }, // Avoid division by zero
                  then: 0,
                  else: {  $round: [{ $divide: ["$total_waiting_time", "$count"] }, 2]  }, // Calculate average
                },
              },
            },
          },
          {
            $sort: { _id: 1 }, // Sort by day
          },
        ]);

        // Merge results with last 7 days to include empty days
        const result = last7Days.map((day) => {
          const formattedDay = day.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          const record = missed_data.find((item: any) => item._id === formattedDay);
          return {
            day: formattedDay,
            missed_calls: record ? record.missed_calls : [],
            count: record ? record.count : 0,
            total_waiting_time: record ? record.total_waiting_time : 0,
            average_waiting_time: record ? record.average_waiting_time : 0,
          };
        });

        dashboard_response_obj.missed_call_new = result;

        console.log("Missed Calls Grouped by Date:", result);
      } catch (err) {
        console.error("Error fetching missed calls:", err);
      }
    } catch (error) {
      console.log("error in misscalled api", error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to Get Reports",
      });
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Dashboard Detail",
      DashboardDetail: dashboard_response_obj,
    });
  } catch (error) {
    console.log(error);

    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
export default {
  getDasboardDetail,
};