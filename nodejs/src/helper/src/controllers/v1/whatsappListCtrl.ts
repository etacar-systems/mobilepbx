import { NextFunction, Request, Response } from "express";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import company from "../../models/company";
import mongoose from "mongoose";
import user from "../../models/user";
import Whatsapp from "../../models/Whatsapp";
import user_assigned from "../../models/user_assigned";

const getChatList = async (req: Request, res: Response, next: NextFunction) => {
        try {

                const token = await get_token(req);
                const user_detail = await User_token(token);
                console.log(user_detail);

                var cid: any = user_detail?.cid;
                var uid: any = user_detail?.uid;
                // var cid: any = new mongoose.Types.ObjectId("66728523f6d1c780ee124c51")

                const getList = await company.aggregate([
                        {
                                $match: {
                                        _id: cid,
                                        is_deleted: 0
                                }
                        },
                        {
                                $project: {
                                        company_phone_number: 1
                                }
                        },
                 
                        {
                                $lookup: {
                                        from: "whatsapps",
                                        localField: "_id",
                                        foreignField: "cid",
                                        let: { companyPhoneNumber: "$company_phone_number" },
                                        pipeline: [{
                                                $match: {
                                                        $expr: {
                                                                $ne: ["$sender_id", "$$companyPhoneNumber"]
                                                        }
                                                }
                                        }],
                                        as: "messages"
                                }
                        },
                        {
                                $unwind: {
                                        path: "$messages"
                                }
                        },
                        {
                                $sort: {
                                        "messages.createdAt": -1
                                }
                        },
                        {
                                $group: {
                                        _id: "$messages.sender_id",
                                        messages: { $first: "$messages" }
                                }
                        },
                        {
                                $addFields: {
                                        last_message_time: "$messages.createdAt",
                                        last_message: "$messages.message",
                                        last_media_type: "$messages.media_type",
                                        name: "$messages.user_name",
                                        image: "",
                                }
                        },
                        {
                                $project: {
                                        _id: 1,
                                        last_message_time: 1,
                                        last_message: 1,
                                        last_media_type: 1,
                                        name: 1,
                                        image: 1,
                                        assigned_id : 1
                                }
                        },
                        {
                                $lookup : {
                                        from:"user_assigneds",
                                        localField :"_id",
                                        foreignField :"receiver_id",
                                        as:"assigne_data"
                                }
                        },
                        {
                                $addFields: {
                                        assigned_id :{
                                                $ifNull: [{ $arrayElemAt: ["$assigne_data.assigned_id", 0] }, null]
                                        }
                                }
                        },
                        {
                                $project: {
                                        _id: 1,
                                        last_message_time: 1,
                                        last_message: 1,
                                        last_media_type: 1,
                                        name: 1,
                                        image: 1,
                                        assigned_id : 1
                                }
                        }
                ]).sort({
                        last_message_time: -1
                })

                const getUserwiseList = await Whatsapp.aggregate([
                        {
                                $match: {
                                        agent_id: uid
                                }
                        },
                        {
                                $sort: {
                                        sent_time: -1
                                }
                        },
                        {
                                $addFields: {
                                        last_message: "",
                                        last_message_time: "",
                                        last_mediatype: "",
                                        name: "",
                                        image: ""
                                }
                        },
                        {
                                $group: {
                                        _id: "$receiver_id",
                                        last_message: { $first: "$message" },
                                        last_message_time: { $first: "$sent_time" },
                                        last_mediatype: { $first: "$media_type" },
                                        image: { $first: "" },
                                        name: { $first: "$user_name" }
                                }
                        },
                        {
                                $project: {
                                        _id: 1,
                                        last_message: 1,
                                        last_message_time: 1,
                                        last_mediatype: 1,
                                        image: 1,
                                        name: 1
                                }
                        }
                ]).sort({
                        last_message_time: -1
                })

                const getCompanyDetail = await company.findOne({_id:cid})
                


                console.log("user_chat_list", JSON.stringify(getUserwiseList, null, 2));
                console.log("company_chat_list", JSON.stringify(getList, null, 2));

                return res.status(200).send({
                        success: 1,
                        message: "Whatsapp business chat list",
                        company_chat_list: getList,
                        user_chat_list: getUserwiseList,
                        CompanyDetail : getCompanyDetail
                })

        } catch (error) {
                res.status(500).send({
                        success: 0,
                        message: "Internal server error"
                })
        }
}

const whatsappCompanyRecord = async (req: Request, res: Response, next: NextFunction) => {
        try {
                let receiver_id: any = req.params.receiver_id
                let page: any = req.query.page;
                let size: any = req.query.size;
                if (!page) page = 1;
                if (!size) size = 20;
                const limit = parseInt(size);
                const skip = (page - 1) * size;

                const token = await get_token(req);
                const user_detail = await User_token(token);

                var cid: any = user_detail?.cid;
                var agent_id: any = user_detail?.uid;

                const sender = await company.findOne({ _id: cid }).select("company_phone_number")
                const sender_id = sender ? sender.company_phone_number : null;

                const senderAndReceiver = {
                        is_deleted: 0,
                        cid: cid,
                        $or: [
                                { receiver_id: receiver_id, sender_id: sender_id },
                                { receiver_id: sender_id, sender_id: receiver_id }
                        ]
                }
                const getRecordCount = await Whatsapp.find(senderAndReceiver).countDocuments()

                const allRecord = await Whatsapp.find(senderAndReceiver)
                        .sort({ createdAt: -1 })
                        .limit(limit)
                        .skip(skip)


                console.log(getRecordCount);

                return res.status(200).send({
                        success: 1,
                        message: "Company wise conversation list",
                        user_conversation: allRecord,
                        totalMessageCount: getRecordCount
                })

        } catch (error) {
                console.log(error);

                res.status(500).send({
                        success: 0,
                        message: "Internal server error"
                })
        }
}

const whatsappUserRecord = async (req: Request, res: Response, next: NextFunction) => {
        try {
                let receiver_id: any = req.params.receiver_id
                let page: any = req.query.page;
                let size: any = req.query.size;
                if (!page) page = 1;
                if (!size) size = 20;
                const limit = parseInt(size);
                const skip = (page - 1) * size;

                const token = await get_token(req);
                const user_detail = await User_token(token);

                var cid: any = user_detail?.cid;
                var agent_id: any = user_detail?.uid;

                const sender = await company.findOne({ _id: cid }).select("company_phone_number")
                const sender_id = sender ? sender.company_phone_number : null;

                const senderAndReceiver = {
                        is_deleted: 0,
                        cid: cid,
                        agent_id : agent_id,
                        receiver_id : receiver_id
                }
                const getRecordCount = await Whatsapp.find(senderAndReceiver).countDocuments()

                const allRecord = await Whatsapp.find(senderAndReceiver)
                        .sort({ createdAt: -1 })
                        .limit(limit)
                        .skip(skip)


                console.log(allRecord);

                return res.status(200).send({
                        success: 1,
                        message: "Company wise conversation list",
                        group_conversation: allRecord,
                        totalMessageCount: getRecordCount
                })

        } catch (error) {
                console.log(error);

                res.status(500).send({
                        success: 0,
                        message: "Internal server error"
                })
        }
}

const assign_user =  async (req: Request, res: Response, next: NextFunction) => {
        try{
               let cid = req.body.cid
               let assigned_id = req.body.assigned_id
               let receiver_id = req.body.receiver_id

               let obj = {
                cid : cid,
                assigned_id :assigned_id,
                receiver_id :receiver_id
               }

               const create = await user_assigned.create(obj)

               return res.status(200).send({
                success: 1,
                message: "Assigned added successfully",
                create,
              });
        }catch{

        }
}
export default { getChatList, whatsappCompanyRecord ,whatsappUserRecord ,assign_user}