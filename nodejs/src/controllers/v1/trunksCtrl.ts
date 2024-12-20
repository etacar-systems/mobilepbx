import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import trunks from "../../models/trunks";
import company from "../../models/company";
import axios from "axios";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const addNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    const {
      setid,
      destination,
      socket,
      state,
      weight,
      priority,
      attrs,
      description
    } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    const requiredFields = {
      setid: "Set ID",
      destination: "Destination",
      socket: "Socket",
      state: "State",
      weight: "Weight",
      priority: "Priority",
      attrs: "Attrs",
      description: "Description"
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    try {
      const trunk = await prisma.dispatcher.create({
        data: { setid, destination, socket, state, weight, priority, attrs, description }
      })

      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: 'Trunk added Successfully',
      });
    } catch (error) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Create Trunks",
      })
    }

  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const EditNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);

    const {
      trunk_id,
      setid,
      destination,
      socket,
      state,
      weight,
      priority,
      attrs,
      description
    } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    const requiredFields = {
      trunk_id: "Trunk ID",
      setid: "Set ID",
      destination: "Destination",
      socket: "Socket",
      state: "State",
      weight: "Weight",
      priority: "Priority",
      attrs: "Attrs",
      description: "Description"
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    const existingTrunk = await prisma.dispatcher.findUnique({
      where: {
        id: trunk_id,
      },
    });

    if (!existingTrunk) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: "Trunk Not Exists.",
      });
    }
    
    try {
      await prisma.dispatcher.update({
        where: {
          id: trunk_id,
        },
        data: {
          setid,
          destination,
          socket,
          state,
          weight,
          priority,
          attrs,
          description
        }
      });

      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "Trunk updated Successfully",
      })
    } catch (error) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Update Trunks",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const DeleteRocrd = async (req: Request, res: Response, next: NextFunction) => {
  let data: any = req.body;
  let trunk_id: any = data.trunk_id;

  if (Object.keys(data).length === 0) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
      success: 0,
      message: "Request Body Params Is Empty",
    });
  }

  const existingDispatcher = await prisma.dispatcher.findUnique({
    where: {
      id: trunk_id,
    },
  });

  if (!existingDispatcher) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: "Trunk Not Exists.",
    });
  }

  try {

    await prisma.dispatcher.delete({
      where: {
        id: trunk_id,
      },
    })

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Trunk deleted Successfully",
    });
  } catch (error: any) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      error: error.message,
    });
  }
};
const gettrunkslist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body;
    let page: any = data.page;
    let size: any = data.size;
    let search: any = data.search;
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;
    const where = search
      ? {
        OR: [
          {
            destination: {
              contains: search
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
      }
      : undefined;

    const [trunk_list, total] = await prisma.$transaction([
      prisma.dispatcher.findMany({
        skip,
        take: limit,
        where
      }),
      prisma.dispatcher.count({
        where
      }),
    ]);

    res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Trunk List",
      data: trunk_list,
      total,
      total_page_count: Math.ceil(total / size),
      currentPage: Number(page),
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const getTrunkdetailByid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body;
    let trunk_id: any = data.trunk_id;
    if (Object.keys(data).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(trunk_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "trunk_id Id Is Invalid.",
      });
    }
    
    const trunk_data = await prisma.dispatcher.findUnique({
      where: {
        id: trunk_id,
      }
    })

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Trunk Detail",
      TrunkDetail: trunk_data,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

export default {
  addNewRecord,
  EditNewRecord,
  DeleteRocrd,
  gettrunkslist,
  getTrunkdetailByid
};
