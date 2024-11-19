import { NextFunction, Request, Response } from "express";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import company from "../../models/company";
import firewall from "../../models/firewall";

const addFirewallData = async (req: Request, res: Response, next: NextFunction) => {
        try {
                let data: any = req.body
                let company_select = data.company_select
                let network: any = data.network
                let add_assign_zone: any = data.add_assign_zone
                let description = data.description

                if (Object.keys(data).length === 0) {
                        return res.status(400).send({
                                success: 0,
                                message: "Request Body Params Is Empty"
                        })
                }

                if (network == undefined) {
                        return res.status(400).send({
                                success: 0,
                                message: "Network Is Mandatory."
                        });
                }
                if (!REGEXP.firewall.firewall_network.test(network)) {
                        return res.status(400).send({
                                success: 0,
                                message: "Network Is Invalid."
                        });
                }

                if (description == undefined) {
                        return res.status(400).send({
                                success: 0,
                                message: "Description Is Mandatory."
                        });
                }
                if (!REGEXP.firewall.firewall_description.test(description)) {
                        return res.status(400).send({
                                success: 0,
                                message: "Description Is Invalid."
                        });
                }

                if (company_select == undefined) {
                        return res.status(400).send({
                                success: 0,
                                message: "Company Select Is Mandatory."
                        });
                }

                if (!mongoose.Types.ObjectId.isValid(company_select)) {
                        return res.status(400).send({
                                success: 0,
                                message: "Company Id Is Invalid."
                        });
                }

                if (add_assign_zone == undefined) {
                        return res.status(400).send({
                                success: 0,
                                message: "Add asign zone Is Mandatory."
                        });
                }


                let newObject = {

                        company_select: new mongoose.Types.ObjectId(company_select),
                        network: network,
                        description: description,
                        add_assign_zone: add_assign_zone
                }

                console.log(newObject);

                const dataAdd = await firewall.create(newObject)

                return res.status(200).send({
                        success: 1,
                        message: "Firewall added successfully",
                });

        } catch (error) {
                return res.status(500).send({
                        success: 0,
                        message: "Internal Server Error"
                });
        }
}

const editFirewallData = async (req: Request, res: Response, next: NextFunction) => {
        try {
                let data: any = req.body
                let firewall_id: any = data.firewall_id
                let company_select = data.company_select
                let network: any = data.network
                let add_assign_zone: any = data.add_assign_zone
                let description = data.description

                if (Object.keys(data).length === 0) {
                        return res.status(400).send({
                                success: 0,
                                message: "Request Body Params Is Empty"
                        })
                }

                if (!mongoose.Types.ObjectId.isValid(firewall_id)) {
                        return res.status(400).send({
                                success: 0,
                                message: "Firewall Id Is Invalid."
                        });
                }

                if (network == undefined) {
                        return res.status(400).send({
                                success: 0,
                                message: "Network Is Mandatory."
                        });
                }
                if (!REGEXP.firewall.firewall_network.test(network)) {
                        return res.status(400).send({
                                success: 0,
                                message: "Network Is Invalid."
                        });
                }

                if (description == undefined) {
                        return res.status(400).send({
                                success: 0,
                                message: "Description Is Mandatory."
                        });
                }
                if (!REGEXP.firewall.firewall_description.test(description)) {
                        return res.status(400).send({
                                success: 0,
                                message: "Description Is Invalid."
                        });
                }

                if (company_select == undefined) {
                        return res.status(400).send({
                                success: 0,
                                message: "Company Select Is Mandatory."
                        });
                }

                if (!mongoose.Types.ObjectId.isValid(company_select)) {
                        return res.status(400).send({
                                success: 0,
                                message: "Company Id Is Invalid."
                        });
                }

                if (add_assign_zone == undefined) {
                        return res.status(400).send({
                                success: 0,
                                message: "Add asign zone Is Mandatory."
                        });
                }


                let update_firewall_obj: any = {
                        company_select: new mongoose.Types.ObjectId(company_select),
                        network: network,
                        description: description,
                        add_assign_zone: add_assign_zone
                }

                console.log(update_firewall_obj);

                const dataAdd = await firewall.findByIdAndUpdate({
                        _id: firewall_id
                }, update_firewall_obj,
                        {
                                new: true,
                                runValidators: true
                        })

                return res.status(200).send({
                        success: 1,
                        message: "Firewall updated successfully",
                });

        } catch (error) {
                return res.status(500).send({
                        success: 0,
                        message: "Internal Server Error"
                });
        }
}

const getFirewallRecord = async (req: Request, res: Response, next: NextFunction) => {
        try {
                let data: any = req.body
                let page: any = data.page;
                let size: any = data.size;
                let search: any = data.search?.toString();
                if (!page) page = 1;
                if (!size) size = 20;
                const limit = parseInt(size);
                const skip = (page - 1) * size;

                let find_query: { [key: string]: any } = {};
                let company_query: { [key: string]: any } = {};
                if (search) {
                        find_query = {
                                is_deleted: 0,
                                $or: [
                                        {
                                                network: {
                                                        $regex: search,
                                                        $options: "i",
                                                }
                                        },
                                        {
                                                description: {
                                                        $regex: search,
                                                        $options: "i",
                                                }
                                        }
                                ]
                        }
                } else {
                        find_query = {
                                is_deleted: 0
                        }
                }
                console.dir(find_query, { depth: null });

                const firewall_list: any = await firewall.aggregate([
                        { $match: find_query },
                        {
                                $lookup: {
                                        from: "companies",
                                        localField: "company_select",
                                        foreignField: "_id",
                                        as: "company_detail"
                                }
                        },
                        {
                                $unwind: "$company_detail"
                        },
                        {
                                $sort: { createdAt: -1 }
                        },
                        {
                                $skip: skip
                        },      
                        {
                                $limit: limit
                        },
                        {
                                $addFields: {
                                        company_name: "$company_detail.company_name"
                                }
                        },
                        {
                                $project: {
                                        network: 1,
                                        add_assign_zone: 1,
                                        description: 1,
                                        company_name: 1
                                }
                        }
                ])

                console.log(firewall_list);

                const total_msg_count: any = await firewall.find(find_query).countDocuments()

                const total_pages: any = Math.ceil(total_msg_count / size)

                return res.status(200).send({
                        success: 1,
                        message: "Firewall list get successfully",
                        firewallsData: firewall_list,
                        total_page_count: total_pages,
                        firewall_total_counts: total_msg_count
                });

        } catch (error) {
                console.log(error);

                return res.status(500).send({
                        success: 0,
                        message: "Internal Server Error"
                });
        }
}

const deleteFirewallData = async (req: Request, res: Response, next: NextFunction) => {
        try {
                let data: any = req.body
                let firewall_id: any = data.firewall_id

                if (Object.keys(data).length == 0) {
                        return res.status(400).send({
                                success: 0,
                                message: "Request Body Params Is Empty"
                        })
                }

                if (!mongoose.Types.ObjectId.isValid(firewall_id)) {
                        return res.status(400).send({
                                success: 0,
                                message: "Firewall Id Is Invalid."
                        });
                }

                let getFirewallId = await firewall.findById({
                        _id: firewall_id
                })

                if (getFirewallId == null) {
                        return res.status(400).send({
                                success: 0,
                                message: "Firewall Not Exists."
                        })
                }

                const deleteData = await firewall.findByIdAndUpdate({
                        _id: firewall_id
                }, {
                        is_deleted: 1
                }, {
                        runValidators: true
                })

                return res.status(200).send({
                        success: 1,
                        message: "Firewall Deleted successfully",
                });

        } catch (error) {
                console.log(error);

                return res.status(500).send({
                        success: 0,
                        message: "Internal Server Error"
                });
        }
}

const getFirewallDataById = async (req: Request, res: Response, next: NextFunction) => {
        try {
                let data: any = req.body
                let firewall_id: any = data.firewall_id

                if (Object.keys(data).length == 0) {
                        return res.status(400).send({
                                success: 0,
                                message: "Request Body Params Is Empty"
                        })
                }

                if (!mongoose.Types.ObjectId.isValid(firewall_id)) {
                        return res.status(400).send({
                                success: 0,
                                message: "Firewall Id Is Invalid."
                        });
                }

                let getFirewallId = await firewall.findById({
                        _id: firewall_id
                })

                if (getFirewallId == null) {
                        return res.status(400).send({
                                success: 0,
                                message: "Firewall Not Exists."
                        })
                }


                return res.status(200).send({
                        success: 1,
                        message: "Firewall Detail successfully",
                        firewallDetail: getFirewallId
                });

        } catch (error) {
                console.log(error);

                return res.status(500).send({
                        success: 0,
                        message: "Internal Server Error"
                });
        }
}



export default { addFirewallData, getFirewallRecord, deleteFirewallData, getFirewallDataById, editFirewallData }
