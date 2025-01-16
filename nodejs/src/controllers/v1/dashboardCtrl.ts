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
import momentTimezone from "moment-timezone";
import { countryTimeZones } from "../../helper/timezone";
import { log } from "winston";

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
    const countries: any = companyDetail?.company_country;
    // const timezone = "Asia/Dubai";
    const timezone = countryTimeZones[countries.replace(/ /g, "_")];
    const startDateInTimeZone = momentTimezone.tz(start_date, timezone).startOf('day').toDate(); // Start of day in the timezone
    const endDateInTimeZone = momentTimezone.tz(end_date, timezone).endOf('day').toDate(); // End of day in the timezone

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
              $gte: startDateInTimeZone,
              $lt: endDateInTimeZone,
              // $gte: new Date(start_date + "Z"),
              // $lt: new Date(end_date + "Z"),
            },
          },
        },
        {
          $set: {
            start_stamp: { $toDate: "$start_stamp" },
            answer_stamp: { $toDate: "$answer_stamp" },
            // response_time_sec: {
            //   $divide: [
            //     { $subtract: [{ $toDate: "$answer_stamp" }, { $toDate: "$start_stamp" }] },
            //     1000,
            //   ],
            // },
            response_time_sec: {
              // $cond: {
              //   if: {
              //     $and: [
              //       // { $eq: ["$status", "answered"] }, // Check if status is "answered"
              //       { $eq: ["$leg", "a"] } // Check if leg is "a"
              //     ]
              //   },
              //   then: {
              //     // If status is "answered", perform the calculation
              //     // $subtract: [
              //     //   "$duration", // Original duration in seconds
              //     // {
              //     $divide: [
              //       // Convert the difference from milliseconds to seconds
              //       {
              //         $subtract: [
              //           { $toDate: "$answer_stamp" }, // Convert answer_stamp to milliseconds
              //           { $toDate: "$start_stamp" }, // Convert start_stamp to milliseconds
              //         ],
              //       },
              //       1000, // Convert milliseconds to seconds
              //     ],
              //     // },
              //     // ],
              //   },
              //   else: null, // If status is not "answered", set final_duration_sec as null
              // },
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$answer_stamp", null] },
                    { $ne: ["$start_stamp", null] },
                    { $gte: [{ $toDate: "$answer_stamp" }, { $toDate: "$start_stamp" }] } // Ensure valid range
                  ]
                },
                then: {
                  $divide: [
                    {
                      $subtract: [
                        { $toDate: "$answer_stamp" },
                        { $toDate: "$start_stamp" }
                      ]
                    },
                    1000 // Convert milliseconds to seconds
                  ]
                },
                else: 0 // Set waiting time to 0 if invalid range
              }
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
              $sum: {
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
                // $cond: [
                //   {
                //     $or: [
                //       // Case 1: When status is "answered" and destination_number contains "*"
                //       {
                //         $and: [
                //           { $eq: ["$status", "answered"] },
                //           { $eq: ["$leg", "a"] },
                //           { $regexMatch: { input: "$destination_number", regex: /\*/ } }
                //         ]
                //       },
                //       // Case 2: When status is not "answered" (e.g., missed call)
                //       { $and: [{ $ne: ["$status", "answered"] }, { $eq: ["$leg", "a"] },{ $gte: ["$start_stamp", today] },] },
                //     ]
                //   },
                //   1, // Count as 1
                //   0  // Otherwise, count as 0
                // ]
                $cond: [
                  {
                    $and: [
                      { $ne: ["$status", "answered"] },
                      // { $eq: ["$status", "missed"] },
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
                // $cond: [
                //   {
                //     $or: [
                //       // Case 1: When status is "answered" and destination_number contains "*"
                //       {
                //         $and: [
                //           { $eq: ["$status", "answered"] },
                //           { $eq: ["$leg", "a"] },
                //           { $regexMatch: { input: "$destination_number", regex: /\*/ } }
                //         ]
                //       },
                //       // Case 2: When status is not "answered" (e.g., missed call)
                //       { $and: [{ $ne: ["$status", "answered"] }, { $eq: ["$leg", "a"] }] },
                //     ]
                //   },
                //   1, // Count as 1
                //   0  // Otherwise, count as 0
                // ]

                $cond: [
                  { $and: [{ $ne: ["$status", "answered"] }, { $eq: ["$leg", "a"] }] },
                  // { $and: [{ $eq: ["$status", "missed"] }, { $eq: ["$leg", "a"] }] },
                  1,
                  0
                ],
              },
            },
            total_answered: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ["$status", "answered"] }, { $eq: ["$leg", "a"] }] },
                  // { $and: [{ $eq: ["$status", "answered"] }, { $eq: ["$leg", "a"] }, { $not: [{ $regexMatch: { input: "$destination_number", regex: /\*/ } }] }] },
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
            // _id: { extension_uuid: "$extension_uuid" }, // Group by extension UUID
            // total_calls: { $sum: { $cond: [{ $ifNull: ["$cdrDetails", false] }, 1, 0] } }, // Count total calls only if cdrDetails exists
            // answered: {
            //   $sum: {
            //     $cond: [
            //       {
            //         $and: [
            //           { $eq: ["$cdrDetails.status", "answered"] },
            //           { $ne: ["$cdrDetails.direction", "agent"] },
            //         ],
            //       },
            //       1,
            //       0,
            //     ],
            //   },
            // },
            // missed: {
            //   $sum: {
            //     $cond: [{ $eq: ["$cdrDetails.status", "missed"] }, 1, 0],
            //   },
            // },
            // no_answer: {
            //   $sum: {
            //     $cond: [{ $eq: ["$cdrDetails.hangup_cause", "NO_ANSWER"] }, 1, 0],
            //   },
            // },
            // busy: {
            //   $sum: {
            //     $cond: [{ $eq: ["$cdrDetails.hangup_cause", "USER_BUSY"] }, 1, 0],
            //   },
            // },
            // avg_call_length: { $avg: "$cdrDetails.duration" }, // Average call length
            // inbound_calls: {
            //   $sum: {
            //     $cond: [{ $eq: ["$cdrDetails.direction", "inbound"] }, 1, 0],
            //   },
            // },
            // inbound_duration: {
            //   $sum: {
            //     $cond: [{ $eq: ["$cdrDetails.direction", "inbound"] }, "$cdrDetails.duration", 0],
            //   },
            // },
            // local_calls: {
            //   $sum: {
            //     $cond: [{ $eq: ["$cdrDetails.direction", "local"] }, 1, 0],
            //   },
            // },
            // local_duration: {
            //   $sum: {
            //     $cond: [{ $eq: ["$cdrDetails.direction", "local"] }, "$cdrDetails.duration", 0],
            //   },
            // },
            // outbound_calls: {
            //   $sum: {
            //     $cond: [{ $eq: ["$cdrDetails.direction", "outbound"] }, 1, 0],
            //   },
            // },
            // outbound_duration: {
            //   $sum: {
            //     $cond: [{ $eq: ["$cdrDetails.direction", "outbound"] }, "$cdrDetails.duration", 0],
            //   },
            // },
            _id: { extension_uuid: "$extension_uuid" }, // Group by extension UUID
            total_calls: { $sum: { $cond: [{ $ifNull: ["$cdrDetails", false] }, 1, 0] } }, // Count total calls only if cdrDetails exists
            answered: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$cdrDetails.status", "answered"] },
                      { $eq: ["$cdrDetails.leg", "b"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            missed: {
              $sum: {
                // $cond: [{ $eq: ["$cdrDetails.status", "missed"] }, 1, 0],
                $cond: [
                  {
                    $and: [
                      // { $in: ["$cdrDetails.status", ["missed", "busy", "no_answer", "failed"]] },
                      { $ne: ["$cdrDetails.status", "answered"] },
                      { $eq: ["$cdrDetails.leg", "b"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            local_calls: {
              $sum: {
                // $cond: [{ $eq: ["$cdrDetails.direction", "local"] }, 1, 0],
                $cond: [
                  {
                    $and: [
                      { $eq: ["$cdrDetails.direction", "local"] },
                      { $eq: ["$cdrDetails.leg", "a"] },
                    ],
                  },
                  1,
                  0,
                ],
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


    function createHourlyAggregation(date: any, hours: string[]): PipelineStage[] {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0); // Set to 12:00 AM

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999); // Set to 11:59 PM
      const pipeline: PipelineStage[] = [
        {
          $match: {
            domain_uuid: companyDetail.domain_uuid,
            start_stamp: { $gte: startOfDay, $lte: endOfDay },
            leg: "a",
          },
        },
        {
          $addFields: {
            hour: {
              $dateToString: {
                format: "%H", // Extract only the hour (0-23)
                date: "$start_stamp",
                timezone: timezone, // Specify the desired timezone, e.g., "Asia/Dubai"
              },
            },
          },
        },
        {
          $group: {
            _id: "$hour", // Group by the timezone-corrected hour
            total_calls: { $sum: 1 },
            inbound_calls: { $sum: { $cond: [{ $eq: ["$direction", "inbound"] }, 1, 0] } },
            local_calls: { $sum: { $cond: [{ $eq: ["$direction", "local"] }, 1, 0] } },
            outbound_calls: { $sum: { $cond: [{ $eq: ["$direction", "outbound"] }, 1, 0] } },
            no_answer: { $sum: { $cond: [{ $eq: ["$status", "no_answer"] }, 1, 0] } },
            answered: { $sum: { $cond: [{ $eq: ["$status", "answered"] }, 1, 0] } },
            missed: { $sum: { $cond: [{ $ne: ["$status", "answered"] }, 1, 0] } },
            // missed: { $sum: { $cond: [{ $eq: ["$status", "missed"] }, 1, 0] } },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            hour: "$_id", // Include the hour field
            total_calls: { $ifNull: ["$total_calls", 0] },
            inbound_calls: { $ifNull: ["$inbound_calls", 0] },
            local_calls: { $ifNull: ["$local_calls", 0] },
            outbound_calls: { $ifNull: ["$outbound_calls", 0] },
            no_answer: { $ifNull: ["$no_answer", 0] },
            answered: { $ifNull: ["$answered", 0] },
            missed: { $ifNull: ["$missed", 0] },
          },
        },
      ];

      return pipeline;
    }

    function createWeeklyAggregation(date: any) {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Adjust to Sunday (start of week)

      // End of the week (Saturday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Adjust to Saturday (end of week)

      // Days of the week (Sunday to Saturday)
      const daysOfWeek = [];
      const dayNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i); // Add i days to the start date
        const formattedDate = day.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
        daysOfWeek.push({ day: dayNames[i], date: formattedDate });
      }

      // console.log("daysOfWeek", daysOfWeek);
      // Aggregation pipeline
      const pipeline = [
        {
          $match: {
            domain_uuid: companyDetail.domain_uuid,
            start_stamp: { $gte: startOfWeek, $lte: endOfWeek },
            leg: 'a',
          },
        },
        {
          $addFields: {
            dayOfWeek: { $dayOfWeek: "$start_stamp" }, // 1 = Sunday, 2 = Monday, ..., 7 = Saturday
          },
        },
        {
          $group: {
            _id: "$dayOfWeek",
            total_calls: { $sum: 1 },
            inbound_calls: { $sum: { $cond: [{ $eq: ["$direction", "inbound"] }, 1, 0] } },
            local_calls: { $sum: { $cond: [{ $eq: ["$direction", "local"] }, 1, 0] } },
            outbound_calls: { $sum: { $cond: [{ $eq: ["$direction", "outbound"] }, 1, 0] } },
            no_answer: { $sum: { $cond: [{ $eq: ["$status", "no_answer"] }, 1, 0] } },
            answered: { $sum: { $cond: [{ $eq: ["$status", "answered"] }, 1, 0] } },
            missed: { $sum: { $cond: [{ $ne: ["$status", "answered"] }, 1, 0] } },
            // missed: { $sum: { $cond: [{ $eq: ["$status", "missed"] }, 1, 0] } },
          },
        },
        {
          $sort: { _id: 1 } as Record<string, 1>,
        },
        {
          $project: {
            date: {
              $arrayElemAt: [
                daysOfWeek,
                { $subtract: ["$_id", 1] }, // Convert MongoDB day (1-7) to index (0-6)
              ],
            },
            total_calls: { $ifNull: ["$total_calls", 0] },
            inbound_calls: { $ifNull: ["$inbound_calls", 0] },
            local_calls: { $ifNull: ["$local_calls", 0] },
            outbound_calls: { $ifNull: ["$outbound_calls", 0] },
            no_answer: { $ifNull: ["$no_answer", 0] },
            answered: { $ifNull: ["$answered", 0] },
            missed: { $ifNull: ["$missed", 0] },
          },
        },
        {
          $project: {
            date: "$date.date", // Get just the date from the object
            day: "$date.day", // Get just the day name from the object
            total_calls: 1,
            inbound_calls: 1,
            local_calls: 1,
            outbound_calls: 1,
            no_answer: 1,
            answered: 1,
            missed: 1,
          },
        },
      ];

      return pipeline;
    }

    function createMonthlyAggregation(months: any) {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const endOfYear = new Date(new Date().getFullYear(), 12, 0, 23, 59, 59, 999);
      // console.log("startofyear",startOfYear,endOfYear);

      const pipeline = [
        {
          $match: {
            domain_uuid: companyDetail.domain_uuid, // Match by domain_uuid
            start_stamp: {
              $gte: startOfYear, // Starting date
              $lte: endOfYear, // Ending date (December)
            },
            leg: "a",
          },
        },
        {
          $project: {
            year: { $year: "$start_stamp" },
            month: { $month: "$start_stamp" },
            total_calls: 1,
            inbound_calls: { $cond: [{ $eq: ["$direction", "inbound"] }, 1, 0] },
            local_calls: { $cond: [{ $eq: ["$direction", "local"] }, 1, 0] },
            outbound_calls: { $cond: [{ $eq: ["$direction", "outbound"] }, 1, 0] },
            no_answer: { $cond: [{ $eq: ["$status", "no_answer"] }, 1, 0] },
            answered: { $cond: [{ $eq: ["$status", "answered"] }, 1, 0] },
            missed: { $cond: [{ $ne: ["$status", "answered"] }, 1, 0] },
            // missed: { $cond: [{ $eq: ["$status", "missed"] }, 1, 0] },
          },
        },
        {
          $group: {
            _id: { year: "$year", month: "$month" },
            total_calls: { $sum: 1 },
            inbound_calls: { $sum: "$inbound_calls" },
            local_calls: { $sum: "$local_calls" },
            outbound_calls: { $sum: "$outbound_calls" },
            no_answer: { $sum: "$no_answer" },
            answered: { $sum: "$answered" },
            missed: { $sum: "$missed" },
          },
        },
        {
          $project: {
            month_name: {
              $arrayElemAt: [
                months,
                { $subtract: ["$_id.month", 1] }, // Array is 0-indexed, so subtract 1
              ],
            },
            total_calls: 1,
            inbound_calls: 1,
            local_calls: 1,
            outbound_calls: 1,
            no_answer: 1,
            answered: 1,
            missed: 1,
          },
        },
        {
          $sort: { "_id.month": 1 } as Record<string, 1>,
        },
      ];

      return pipeline;
    }

    type WeeklyData = {
      _id: string; // Day of the week (e.g., "Monday", "Tuesday", etc.)
      total_calls: number;
      inbound_calls: number;
      local_calls: number;
      outbound_calls: number;
      no_answer: number;
      answered: number;
      missed: number;
      date: string; // The date corresponding to the day
      day: string; // Day of the week (e.g., Monday)
    };

    function createWeeklyAggregationFormat(weekData: WeeklyData[]): WeeklyData[] {
      // Array to match day names to their index for easier calculation
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      // Extract the first date from weekData to determine the starting day of the week
      const firstDataDate = new Date(weekData[0].date);
      const startDayIndex = firstDataDate.getDay(); // Sunday = 0, Monday = 1, etc.

      // Initialize the start of the week based on the first date's day
      const startOfWeek = new Date(firstDataDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + startDayIndex); // Adjust to the start of the week

      // Generate all days of the week and their corresponding dates
      const daysOfWeek = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i); // Add i days to the start date
        const formattedDate = day.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
        daysOfWeek.push({ day: dayNames[(startDayIndex + i) % 7], date: formattedDate });
      }

      // Fill in the data for the week
      const filledData: WeeklyData[] = daysOfWeek.map((dayOfWeek) => {
        // Find the existing data for the current day
        const existingData = weekData.find((item) => item.day === dayOfWeek.day);

        // If data exists for this day, return it; otherwise, fill with default data
        if (existingData) {
          return {
            ...existingData,
            date: dayOfWeek.date, // Correct the date for the current day
          };
        } else {
          // Fill with default data (zeros)
          return {
            _id: dayOfWeek.day,
            total_calls: 0,
            inbound_calls: 0,
            local_calls: 0,
            outbound_calls: 0,
            no_answer: 0,
            answered: 0,
            missed: 0,
            date: dayOfWeek.date,
            day: dayOfWeek.day,
          };
        }
      });

      return filledData;
    }

    async function findTotal(timePeriod: string, date: string) {
      let startOfDay, endOfDay, startOfWeek, endOfWeek, startOfYear, endOfYear;

      // Get the provided date
      const dateObj = new Date(date);

      if (timePeriod === "today") {
        // Today's date range (24-hour period)
        startOfDay = new Date(dateObj.setHours(0, 0, 0, 0)); // Start of the day (12:00 AM)
        endOfDay = new Date(dateObj.setHours(23, 59, 59, 999)); // End of the day (11:59 PM)
      }

      if (timePeriod === "week") {
        // Week's date range (from Sunday to Saturday)
        const firstDayOfWeek = new Date(dateObj);
        firstDayOfWeek.setDate(dateObj.getDate() - dateObj.getDay()); // Set to Sunday
        firstDayOfWeek.setHours(0, 0, 0, 0); // Start of the day (Sunday)
        startOfWeek = firstDayOfWeek;

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Set to Saturday
        lastDayOfWeek.setHours(23, 59, 59, 999); // End of the day (Saturday)
        endOfWeek = lastDayOfWeek;
      }

      if (timePeriod === "year") {
        // Year's date range (from January 1st to December 31st)
        startOfYear = new Date(dateObj.getFullYear(), 0, 1); // January 1st
        startOfYear.setHours(0, 0, 0, 0);

        endOfYear = new Date(dateObj.getFullYear(), 11, 31); // December 31st
        endOfYear.setHours(23, 59, 59, 999);
      }

      // Determine which date range to use based on the timePeriod
      let startDate, endDate;

      if (timePeriod === "today") {
        startDate = startOfDay;
        endDate = endOfDay;
      } else if (timePeriod === "week") {
        startDate = startOfWeek;
        endDate = endOfWeek;
      } else if (timePeriod === "year") {
        startDate = startOfYear;
        endDate = endOfYear;
      }

      try {
        const data = await CdrModel.aggregate([
          {
            $match: {
              domain_uuid: companyDetail.domain_uuid,
              start_stamp: {
                $gte: startDate, // Use the calculated start date
                $lt: endDate, // Use the calculated end date
              },
              leg: 'a',
            },
          },
          {
            $group: {
              _id: null,
              total_calls: { $sum: 1 },

              total_missed: {
                $sum: {
                  $cond: [{ $ne: ["$status", "answered"] }, 1, 0],
                  // $cond: [{ $eq: ["$status", "missed"] }, 1, 0],
                },
              },
              total_answered: {
                $sum: {
                  $cond: [{ $eq: ["$status", "answered"] }, 1, 0],
                },
              },
              total_unanswered: {
                $sum: {
                  $cond: [{ $eq: ["$status", "no_answer"] }, 1, 0],
                },
              },
              total_voicemailCalls: {
                $sum: {
                  $cond: [{ $eq: ["$status", "voicemail"] }, 1, 0],
                },
              },
              total_outbound: {
                $sum: {
                  $cond: [{ $eq: ["$status", "outbound_calls"] }, 1, 0],
                },
              },
              total_local: {
                $sum: {
                  $cond: [{ $eq: ["$direction", "local"] }, 1, 0],
                },
              },
              total_inboundCalls: {
                $sum: {
                  $cond: [{ $eq: ["$direction", "inbound"] }, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              total_calls: 1,
              total_unanswered: 1,
              total_missed: 1,
              total_answered: 1,
              total_outbound: 1,
              total_local: 1,
              total_voicemailCalls: 1,
              total_inboundCalls: 1,
            },
          },
        ]);

        // Return or process the data
        return data;
      } catch (error) {
        console.error("Error in aggregation:", error);
        throw error;
      }
    }

    const weekData: WeeklyData[] = [
      {
        _id: "Monday",
        total_calls: 10,
        inbound_calls: 0,
        local_calls: 10,
        outbound_calls: 0,
        no_answer: 2,
        answered: 4,
        missed: 3,
        date: "2024-12-30",
        day: "Monday",
      },
      // More data can be provided for other days if available
    ];

    function getFormatedDate(date: any) {
      const newDate = new Date(date);
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, "0");
      const day = String(newDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    async function getMonthlyCallMetrics(domain_uuid: string, year: number, month: number) {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      try {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
        // console.log("startofmonth", startOfMonth, endOfMonth);

        const datesInMonth = [];
        for (let day = 1; day <= endOfMonth.getDate(); day++) {
          const date = new Date(year, month - 1, day);
          datesInMonth.push({
            date: getFormatedDate(date),
            day: daysOfWeek[date.getDay()],
            total_calls: 0,
            inbound_calls: 0,
            local_calls: 0,
            outbound_calls: 0,
            no_answer: 0,
            answered: 0,
            missed: 0,
            total_no_answer: 0,
          });
        }
        // console.log("datesInMonth", datesInMonth);

        const result = await CdrModel.aggregate([
          // {
          //   $match: {
          //     domain_uuid: domain_uuid,
          //     start_stamp: {
          //       $gte: startOfMonth,
          //       $lte: endOfMonth,
          //     },
          //     leg: 'a',
          //   },
          // },
          // {
          //   $group: {
          //     _id: { day: { $dayOfMonth: "$start_stamp" } },
          //     date: { $first: "$start_stamp" },
          //     total_calls: { $sum: 1 },
          //     inbound_calls: { $sum: { $cond: [{ $eq: ["$direction", "inbound"] }, 1, 0] } },
          //     local_calls: { $sum: { $cond: [{ $eq: ["$direction", "local"] }, 1, 0] } },
          //     outbound_calls: { $sum: { $cond: [{ $eq: ["$direction", "outbound"] }, 1, 0] } },
          //     no_answer: { $sum: { $cond: [{ $eq: ["$status", "no_answer"] }, 1, 0] } },
          //     answered: { $sum: { $cond: [{ $eq: ["$status", "answered"] }, 1, 0] } },
          //     missed: { $sum: { $cond: [{ $ne: ["$status", "answered"] }, 1, 0] } },
          //     // missed: { $sum: { $cond: [{ $eq: ["$status", "missed"] }, 1, 0] } },
          //   },
          // },
          // {
          //   $sort: { "_id.day": 1 },
          // },

          {
            $match: {
              domain_uuid: domain_uuid,
              start_stamp: {
                $gte: startOfMonth,
                $lte: endOfMonth,
              },
              leg: 'a',
            },
          },
          {
            $addFields: {
              start_stamp_local: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$start_stamp",
                  timezone: timezone, // Replace with your desired timezone
                },
              },
            },
          },
          {
            $group: {
              _id: { day: "$start_stamp_local" },
              date: { $first: "$start_stamp" },
              total_calls: { $sum: 1 },
              inbound_calls: { $sum: { $cond: [{ $eq: ["$direction", "inbound"] }, 1, 0] } },
              local_calls: { $sum: { $cond: [{ $eq: ["$direction", "local"] }, 1, 0] } },
              outbound_calls: { $sum: { $cond: [{ $eq: ["$direction", "outbound"] }, 1, 0] } },
              no_answer: { $sum: { $cond: [{ $eq: ["$status", "no_answer"] }, 1, 0] } },
              answered: { $sum: { $cond: [{ $eq: ["$status", "answered"] }, 1, 0] } },
              missed: { $sum: { $cond: [{ $ne: ["$status", "answered"] }, 1, 0] } },
            },
          },
          {
            $sort: { "_id.day": 1 },
          },
        ]);
        // console.log("result",result);


        const callMetrics = datesInMonth.map((dateObj) => {
          const dayData = result.find(
            (item) => item?._id?.day === dateObj.date
            // (item) => new Date(item.date).toISOString().split("T")[0] === dateObj.date
          );
          return dayData
            ? {
              ...dateObj,
              total_calls: dayData.total_calls,
              inbound_calls: dayData.inbound_calls,
              local_calls: dayData.local_calls,
              outbound_calls: dayData.outbound_calls,
              no_answer: dayData.no_answer,
              answered: dayData.answered,
              missed: dayData.missed,
            }
            : dateObj;
        });

        const totals = callMetrics.reduce(
          (acc, item) => {
            acc.total_inbound += item.inbound_calls;
            acc.total_outbound += item.outbound_calls;
            acc.total_local += item.local_calls;
            acc.total_answered += item.answered;
            acc.total_unanswered += item.no_answer;
            acc.total_missed += item.missed;
            return acc;
          },
          {
            total_inbound: 0,
            total_outbound: 0,
            total_local: 0,
            total_answered: 0,
            total_unanswered: 0,
            total_missed: 0,
          }
        );

        return {
          call_metrics: callMetrics,
          ...totals,
        };
      } catch (error) {
        console.error("Error fetching monthly call metrics:", error);
        throw error;
      }
    }
    console.log("-----getMonthlyCallMetrics------");
    if (call_matrics_type === "today") {
      // Create the pipeline

      const hours = [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ];
      const pipeline = createHourlyAggregation(getFormatedDate(new Date()), hours);

      // console.log("pipeline", JSON.stringify(pipeline));

      const result = await CdrModel.aggregate(pipeline);
      console.log(result);

      const filledData = hours.map((hour) => {
        // Check if this hour is already in the dataset
        const existingData = result.find((item) => item._id === hour);

        // If the hour exists, return it, otherwise return a default object
        if (existingData) {
          return existingData;
        } else {
          return {
            _id: hour,
            hour: hour,
            total_calls: 0,
            inbound_calls: 0,
            local_calls: 0,
            outbound_calls: 0,
            no_answer: 0,
            answered: 0,
            missed: 0,
          };
        }
      });

      findTotal("today", getFormatedDate(new Date()))
        .then((result) => {
          console.log("Today:", result);
          console.log(filledData, "-----today-----");
          dashboard_response_obj.call_metrics_detail = {
            call_metrics: filledData,
            ...result[0],
          };
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (call_matrics_type === "week") {
      // Create the pipeline
      const pipelineweek = createWeeklyAggregation(getFormatedDate(new Date()));

      const weekresult: WeeklyData[] = await CdrModel.aggregate(pipelineweek);
      console.log(weekresult);

      // Call the function to fill in missing days and increment the date
      const result = createWeeklyAggregationFormat(weekresult);
      findTotal("week", getFormatedDate(new Date()))
        .then((res) => {
          console.log("This week:", res);
          console.log(result, "------week------");
          dashboard_response_obj.call_metrics_detail = {
            call_metrics: result,
            ...res[0],
          };
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (call_matrics_type === "year") {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const newdata = createMonthlyAggregation(months);
      const result = await CdrModel.aggregate(newdata);
      console.log(result, "----------result-----------");

      const filledResult = months.map((month, index) => {
        const monthData = result.find((item) => item.month_name === month);
        return {
          month_name: month,
          total_calls: (monthData ? monthData.total_calls : 0).toString(),
          inbound_calls: (monthData ? monthData.inbound_calls : 0).toString(),
          local_calls: (monthData ? monthData.local_calls : 0).toString(),
          outbound_calls: (monthData ? monthData.outbound_calls : 0).toString(),
          no_answer: (monthData ? monthData.no_answer : 0).toString(),
          answered: (monthData ? monthData.answered : 0).toString(),
          missed: (monthData ? monthData.missed : 0).toString(),
        };
      });

      findTotal("year", getFormatedDate(new Date()))
        .then((result) => {
          console.log("This year:", result);
          console.log("Monthly Data: ", filledResult);
          dashboard_response_obj.call_metrics_detail = {
            call_metrics: filledResult,
            ...result[0],
          };
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (call_matrics_type === "month") {
      const data = await getMonthlyCallMetrics(
        companyDetail.domain_uuid,
        new Date().getFullYear(),
        new Date().getMonth() + 1
      );

      dashboard_response_obj.call_metrics_detail = data;
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
                  status: { $ne: "answered" }
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
        dashboard_response_obj.call_metrics_detail_old = call_matrics_data;
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
        start_date: start_date,
        end_date: end_date,
      },
    };
    // console.log("api_ring_groups", api_ring_groups);
    try {
      const ringroup_api_data: any = await axios.request(api_ring_groups);

      // CHANGED
      // const ring_group_list: any = await ring_group.find({
      //   cid: companyDetail._id,
      //   is_deleted: 0,
      //   // createdAt: {
      //   //   $gte: start_date,
      //   //   $lt: end_date,
      //   // },
      // });


      const ring_group_list: any = await ring_group.aggregate([
        // Step 1: Match ring_group based on cid and is_deleted
        {
          $match: {
            cid: companyDetail._id,
            is_deleted: 0,
          },
        },
        // Step 2: Lookup to join ring_group with companies
        {
          $lookup: {
            from: "companies",
            localField: "cid",
            foreignField: "_id",
            as: "company",
          },
        },
        // Step 3: Unwind the company array
        {
          $unwind: "$company",
        },
        // Step 4: Lookup to join the company with cdrs based on domain_uuid
        {
          $lookup: {
            from: "cdrs",
            let: {
              domain_uuid: "$company.domain_uuid",
              start_date: startDateInTimeZone, // Replace with your actual start_date
              end_date: endDateInTimeZone // Replace with your actual end_date
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$domain_uuid", "$$domain_uuid"] },
                      { $eq: ["$module_name", "ring_group"] },
                      { $eq: ["$leg", "a"] },
                      { $gte: ["$start_stamp", "$$start_date"] }, // Start date filter
                      { $lte: ["$start_stamp", "$$end_date"] }  // End date filter
                    ],
                  },
                },
              },
            ],
            as: "cdrs_logs",
          },
        },

        // Step 5: Unwind cdrs_logs with preserveNullAndEmptyArrays
        {
          $unwind: {
            path: "$cdrs_logs",
            preserveNullAndEmptyArrays: true,
          },
        },
        // Step 6: Group and calculate the required metrics
        {
          $group: {
            _id: "$_id", // Group by the ring_group ID
            ring_group_details: { $first: "$$ROOT" },
            answered: {
              $sum: {
                $cond: [
                  { $and: [{ $ifNull: ["$cdrs_logs", false] }, { $eq: ["$cdrs_logs.status", "answered"] }] },
                  1,
                  0,
                ],
              },
            },
            inbound_calls: {
              $sum: {
                $cond: [
                  { $and: [{ $ifNull: ["$cdrs_logs", false] }, { $eq: ["$cdrs_logs.direction", "inbound"] }] },
                  1,
                  0,
                ],
              },
            },
            outbound_calls: {
              $sum: {
                $cond: [
                  { $and: [{ $ifNull: ["$cdrs_logs", false] }, { $eq: ["$cdrs_logs.direction", "outbound"] }] },
                  1,
                  0,
                ],
              },
            },
            missed: {
              $sum: {
                $cond: [
                  { $and: [{ $ifNull: ["$cdrs_logs", false] }, { $ne: ["$cdrs_logs.status", "answered"] }] },
                  1,
                  0,
                ],
              },
            },
            inbound_duration: {
              $sum: {
                $cond: [
                  { $and: [{ $ifNull: ["$cdrs_logs", false] }, { $eq: ["$cdrs_logs.direction", "inbound"] }] },
                  "$cdrs_logs.duration",
                  0,
                ],
              },
            },
            outbound_duration: {
              $sum: {
                $cond: [
                  { $and: [{ $ifNull: ["$cdrs_logs", false] }, { $eq: ["$cdrs_logs.direction", "outbound"] }] },
                  "$cdrs_logs.duration",
                  0,
                ],
              },
            },
            no_answer: {
              $sum: {
                $cond: [
                  { $and: [{ $ifNull: ["$cdrs_logs", false] }, { $eq: ["$cdrs_logs.status", "no_answer"] }] },
                  1,
                  0,
                ],
              },
            },
            busy: {
              $sum: {
                $cond: [
                  { $and: [{ $ifNull: ["$cdrs_logs", false] }, { $eq: ["$cdrs_logs.status", "busy"] }] },
                  1,
                  0,
                ],
              },
            },
            total_calls: {
              $sum: {
                $cond: [{ $ifNull: ["$cdrs_logs", false] }, 1, 0],
              },
            },
          },
        },
        // Step 7: Add calculated fields for percentages
        {
          $addFields: {
            answered_percentage: {
              $cond: [
                { $eq: ["$total_calls", 0] },
                0,
                { $multiply: [{ $divide: ["$answered", "$total_calls"] }, 100] },
              ],
            },
            missed_percentage: {
              $cond: [
                { $eq: ["$total_calls", 0] },
                0,
                { $multiply: [{ $divide: ["$missed", "$total_calls"] }, 100] },
              ],
            },
          },
        },
        // Step 8: Project final output including ring_group details
        {
          $project: {
            _id: 0,
            ring_group_id: "$_id",
            ring_group_name: "$ring_group_details.name", // Include additional details from ring_group if required
            ring_group_details: "$ring_group_details",
            answered: 1,
            answered_percentage: 1,
            inbound_calls: 1,
            outbound_calls: 1,
            missed: 1,
            missed_percentage: 1,
            inbound_duration: 1,
            outbound_duration: 1,
            no_answer: 1,
            busy: 1,
          },
        },
      ]);


      if (
        // ringroup_api_data?.data?.data ||
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
          // ring_group_call: ring_group_data,
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
      // const getLast7Days = () => {
      //   const dates = [];
      //   const currentDate = new Date();

      //   for (let i = 0; i < 7; i++) {
      //     const date = new Date(currentDate);
      //     date.setDate(currentDate.getDate() - i);

      //     date.setHours(0, 0, 0, 0); // Set to the start of the day
      //     dates.push(date);
      //   }
      //   return dates.reverse(); // Reverse to get chronological order
      // }

      // const last7Days = getLast7Days();
      // console.log("currentdata", last7Days);
      // const startDate = last7Days[0]; // Start date is 7 days ago
      // const endDate = new Date(); // End date is today

      // try {
      //   const missed_data = await CdrModel.aggregate([
      //     // {
      //     //   $match: {
      //     //     domain_uuid : companyDetail?.domain_uuid,
      //     //     status: { $ne: 'answered' },
      //     //     // missed_call: "true",
      //     //     start_stamp: { $gte: startDate, $lte: endDate },
      //     //   },
      //     // },
      //     // {
      //     //   $project: {
      //     //     missed_number: "$caller_id_number",
      //     //     day: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$start_stamp" } } },
      //     //     waiting_time: {
      //     //       $dateDiff: {
      //     //         startDate: { $toDate: "$start_stamp" },
      //     //         endDate: { $toDate: "$answer_stamp" },
      //     //         unit: "second", // Calculate in seconds
      //     //       },
      //     //     },
      //     //   },
      //     // },
      //     // {
      //     //   $group: {
      //     //     _id: "$day",
      //     //     missed_calls: { $push: "$missed_number" },
      //     //     count: { $sum: 1 },
      //     //     total_waiting_time: { $sum: "$waiting_time" }, // Sum of waiting times
      //     //   },
      //     // },
      //     // {
      //     //   $addFields: {
      //     //     average_waiting_time: {
      //     //       $cond: {
      //     //         if: { $eq: ["$count", 0] }, // Avoid division by zero
      //     //         then: 0,
      //     //         else: { $divide: ["$total_waiting_time", "$count"] }, // Calculate average
      //     //       },
      //     //     },
      //     //   },
      //     // },
      //     // {
      //     //   $sort: { _id: 1 }, // Sort by day
      //     // },

      //     {
      //       $match: {
      //         domain_uuid: companyDetail?.domain_uuid,
      //         status: { $ne: 'answered' },
      //         start_stamp: { $gte: startDate, $lte: endDate },
      //         leg: { $eq: 'a' }
      //       },
      //     },
      //     {
      //       $project: {
      //         missed_number: "$caller_id_number",
      //         day: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$start_stamp" } } },
      //         duration: 1, // Include the duration field
      //       },
      //     },
      //     {
      //       $group: {
      //         _id: "$day",
      //         missed_calls: { $push: "$missed_number" },
      //         count: { $sum: 1 },
      //         total_waiting_time: { $sum: "$duration" }, // Sum of durations
      //       },
      //     },
      //     {
      //       $addFields: {
      //         average_waiting_time: {
      //           $cond: {
      //             if: { $eq: ["$count", 0] }, // Avoid division by zero
      //             then: 0,
      //             else: { $round: [{ $divide: ["$total_waiting_time", "$count"] }, 2] }, // Calculate average
      //           },
      //         },
      //       },
      //     },
      //     {
      //       $sort: { _id: 1 }, // Sort by day
      //     },
      //   ]);

      //   // Merge results with last 7 days to include empty days
      //   const result = last7Days.map((day) => {
      //     const formattedDay = day.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      //     const record = missed_data.find((item: any) => item._id === formattedDay);
      //     return {
      //       day: formattedDay,
      //       missed_calls: record ? record.missed_calls : [],
      //       count: record ? record.count : 0,
      //       total_waiting_time: record ? record.total_waiting_time : 0,
      //       average_waiting_time: record ? record.average_waiting_time : 0,
      //     };
      //   });

      //   dashboard_response_obj.missed_call_new = result;

      //   console.log("Missed Calls Grouped by Date:", result);
      // } catch (err) {
      //   console.error("Error fetching missed calls:", err);
      // }

      try {


        const getHoursInRange = (start: string | Date, end: string | Date) => {
          const result = [];

          const startDate = new Date(start);
          const year = startDate.getFullYear();
          const month = String(startDate.getMonth() + 1).padStart(2, "0");
          const day = String(startDate.getDate()).padStart(2, "0");
          // let hourstring = String(startDate.getUTCHours()).padStart(2, "0");
          // let hours = Number(hourstring);
          // console.log("hours", startDate, hours);

          const baseDate = `${year}-${month}-${day}`;

          for (let hour = 0; hour < 24; hour++) {

            const hourString = hour.toString().padStart(2, "0");
            result.push(`${hourString}`);
            // result.push(`${hours}`);
            // hours = hours + 1;
            // if (hours == 24) {
            //   hours = 0;
            // }
          }

          return result;
        };

        const getDaysInRange = (start: string | Date, end: string | Date) => {
          const result = [];

          const startDate = new Date(start);
          const endDate = new Date(end);

          let currentDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          );
          const endDateObj = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

          while (currentDate <= endDateObj) {
            const day = currentDate.getDate().toString().padStart(2, "0");
            const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
            const year = currentDate.getFullYear();

            result.push(`${day}/${month}/${year}`);
            currentDate.setDate(currentDate.getDate() + 1);
          }

          return result;
        };

        const getMonthsInRange = (start: string | Date, end: string | Date) => {
          const startDate = new Date(start);
          const endDate = new Date(end);
          console.log("startDate", startDate, endDate);
          console.log("startDate", startDate.getMonth() + 1, endDate.getMonth() + 1);

          const months = [];
          while (startDate <= endDate) {
            // const monthKey = startDate.toISOString().slice(0, 7);
            const monthKey = `${startDate.getMonth() + 1}`.padStart(2, '0') + '/' + startDate.getFullYear();

            months.push(monthKey);
            startDate.setDate(1);
            startDate.setMonth(startDate.getMonth() + 1);
          }
          console.log("months", months);


          return months;
        };

        // Convert `start_date` and `end_date` to ISO strings if needed
        const startDateISO = getFormatedDate(start_date) + "T00:00:00Z";
        const endDateISO = getFormatedDate(end_date) + "T23:59:59Z";


        const dateDifferenceInDays =
          (endDateInTimeZone.getTime() - startDateInTimeZone.getTime()) / (1000 * 60 * 60 * 24);
        // (new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24);

        const dateGroupFormat = (() => {
          if (!start_date || !end_date) return "%d/%m/%Y %H:00";
          if (dateDifferenceInDays >= 30) return "%m/%Y";
          if (dateDifferenceInDays >= 1) return "%d/%m/%Y";
          return "%H";
          // return "%Y-%m-%d %H:00";
        })();

        // const missed_data = await CdrModel.aggregate([
        //   {
        //     $match: {
        //       domain_uuid: companyDetail?.domain_uuid,
        //       status: { $ne: "answered" },
        //       start_stamp: { $gte: startDateInTimeZone, $lte: endDateInTimeZone },
        //       // start_stamp: { $gte: new Date(startDateISO), $lte: new Date(endDateISO) },
        //       leg: "a",
        //     },
        //   },
        //   {
        //     $project: {
        //       missed_number: "$caller_id_number",
        //       group_key
        //         : {
        //         $dateToString: { format: dateGroupFormat, date: { $toDate: "$start_stamp" }, timezone: timezone, },
        //       },
        //       duration: 1,
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: "$group_key",
        //       missed_calls: { $push: "$missed_number" },
        //       count: { $sum: 1 },
        //       total_waiting_time: { $sum: "$duration" },
        //     },
        //   },
        //   {
        //     $addFields: {
        //       average_waiting_time: {
        //         $cond: {
        //           if: { $eq: ["$count", 0] },
        //           then: 0,
        //           else: { $round: [{ $divide: ["$total_waiting_time", "$count"] }, 2] },
        //         },
        //       },
        //     },
        //   },
        //   {
        //     $sort: { _id: 1 },
        //   },
        // ]);

        // const missed_data = await CdrModel.aggregate([
        //   {
        //     $match: {
        //       domain_uuid: companyDetail?.domain_uuid,
        //       start_stamp: { $gte: startDateInTimeZone, $lte: endDateInTimeZone },
        //       leg: "a",
        //     },
        //   },
        //   {
        //     $project: {
        //       missed_number: {
        //         $cond: { if: { $ne: ["$status", "answered"] }, then: "$caller_id_number", else: null },
        //       },
        //       group_key: {
        //         $dateToString: {
        //           format: dateGroupFormat,
        //           date: { $toDate: "$start_stamp" },
        //           timezone: timezone,
        //         },
        //       },
        //       duration: 1,
        //       status: 1, // Include status for condition checks
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: "$group_key",
        //       missed_calls: {
        //         $push: {
        //           $cond: { if: { $ne: ["$status", "answered"] }, then: "$missed_number", else: null },
        //         },
        //       },
        //       count: {
        //         $sum: {
        //           $cond: { if: { $ne: ["$status", "answered"] }, then: 1, else: 0 },
        //         },
        //       },
        //       total_count: { $sum: 1 },
        //       total_waiting_time: { $sum: "$duration" },
        //     },
        //   },
        //   {
        //     $addFields: {
        //       average_waiting_time: {
        //         $cond: {
        //           if: { $eq: ["$total_count", 0] },
        //           then: 0,
        //           else: { $round: [{ $divide: ["$total_waiting_time", "$total_count"] }, 2] },
        //         },
        //       },
        //     },
        //   },
        //   {
        //     $sort: { _id: 1 },
        //   },
        // ]);

        const missed_data = await CdrModel.aggregate([
          {
            $match: {
              domain_uuid: companyDetail?.domain_uuid,
              start_stamp: { $gte: startDateInTimeZone, $lte: endDateInTimeZone },
              leg: "a",
            },
          },
          {
            $project: {
              missed_number: {
                $cond: { if: { $ne: ["$status", "answered"] }, then: "$caller_id_number", else: null },
              },
              group_key: {
                $dateToString: {
                  format: dateGroupFormat,
                  date: { $toDate: "$start_stamp" },
                  timezone: timezone,
                },
              },
              waiting_time: {
                $cond: {
                  if: {
                    $and: [
                      { $ne: ["$answer_stamp", null] },
                      { $ne: ["$start_stamp", null] },
                      { $gte: [{ $toDate: "$answer_stamp" }, { $toDate: "$start_stamp" }] } // Ensure valid range
                    ]
                  },
                  then: {
                    $divide: [
                      {
                        $subtract: [
                          { $toDate: "$answer_stamp" },
                          { $toDate: "$start_stamp" }
                        ]
                      },
                      1000 // Convert milliseconds to seconds
                    ]
                  },
                  else: 0 // Set waiting time to 0 if invalid range
                }
              },

              status: 1, // Include status for condition checks
            },
          },
          {
            $group: {
              _id: "$group_key",
              missed_calls: {
                $push: {
                  $cond: { if: { $ne: ["$status", "answered"] }, then: "$missed_number", else: null },
                },
              },
              count: {
                $sum: {
                  $cond: { if: { $ne: ["$status", "answered"] }, then: 1, else: 0 },
                },
              },
              total_count: { $sum: 1 },
              total_waiting_time: { $sum: "$waiting_time" }, // Sum of calculated waiting times
            },
          },
          {
            $addFields: {
              average_waiting_time: {
                $cond: {
                  if: { $eq: ["$total_count", 0] },
                  then: 0,
                  else: { $round: [{ $divide: ["$total_waiting_time", "$total_count"] }, 2] },
                },
              },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ]);

        const dynamicGrouping = (() => {
          if (dateGroupFormat === "%m/%Y") return getMonthsInRange(start_date, end_date);
          if (dateGroupFormat === "%d/%m/%Y") return getDaysInRange(start_date, end_date);
          return getHoursInRange(startDateInTimeZone, endDateInTimeZone);
        })();

        const result = dynamicGrouping.map((key) => {
          const record = missed_data.find((item: any) => item._id === key);
          return {
            key,
            missed_calls: record ? record.missed_calls : [],
            count: record ? record.count : 0,
            total_count: record ? record.total_count : 0,
            total_waiting_time: record ? record.total_waiting_time : 0,
            average_waiting_time: record ? record.average_waiting_time : 0,
          };
        });

        dashboard_response_obj.missed_call_new = result;
        console.log("Missed Calls Grouped by Dynamic Key:", result);
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