import { Request, Response, NextFunction } from "express";

import ring_group from "../../models/ring_group";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import { config } from "../../config";

const getRingGrouplist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let page: any = data.page;
    let size: any = data.size;
    let search: any = data.search?.toString();
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;
    const token = await get_token(req);
    const user_detail = await User_token(token);
    
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let cid: any = user_detail?.cid;

    let find_query: { [key: string]: any } = {};
    if (search) {
      find_query = {
        is_deleted: 0,
        cid: cid,
        $or: [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            extension: {
              $regex: search,
              $options: "i",
            },
          },
          {
            ring_group_description: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
    } else {
      find_query = {
        cid: cid,
        is_deleted: 0,
      };
    }
    // console.log(find_query);
    // const ring_group_list: any = await ring_group
    //   .find(find_query)
    //   .sort({ createdAt: -1 })
    //   .limit(limit)
    //   .skip(skip);
    // console.log(ring_group_list);

    const ring_group_list = await ring_group.aggregate([
      {
        $match: find_query, // Apply the filtering conditions
      },
      {
        $addFields: {
          destinations: {
            $map: {
              input: "$destinations",
              as: "id",
              in: "$$id", // Convert string IDs to ObjectId
            },
          },
        },
      },
      {
        $lookup: {
          from: "users", // The collection to join
          localField: "destinations", // The field in ring_group (array of user IDs)
          foreignField: "extension_uuid", // The field in users collection
          as: "user_details", // Output array containing matched users
        },
      },
      {
        $unwind: "$user_details",
      },
      {
        $group: {
          _id: "$_id", // Group by ring_group ID
          ring_group_data: { $first: "$$ROOT" }, // Preserve the first ring_group data
          user_details: { $push: "$user_details" }, // Collect all user details in an array
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$ring_group_data",
              { user_details: "$user_details" },
            ],
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    let userOnline = 0;

    ring_group_list.forEach((group) => {
      group.user_details?.forEach((val: any) => {
        if (val.is_online === 1) {
          userOnline += 1;
        }
      });
    });
    const ring_group_total_counts: any = await ring_group
      .find(find_query)
      .countDocuments();
    // console.log(ring_group_total_counts);

    let total_page_count: any = Math.ceil(ring_group_total_counts / size);

    res.send({
      success: 1,
      message: "Ring Group List",
      RingGroupList: ring_group_list,
      total_page_count: total_page_count,
      groupUserOnline: userOnline,
      ring_group_total_counts: ring_group_total_counts,
    });
  } catch (error) {
    console.log(error)
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

export default {
  getRingGrouplist,
};
