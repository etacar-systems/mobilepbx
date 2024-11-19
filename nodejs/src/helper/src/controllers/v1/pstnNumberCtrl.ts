import { Request, Response, NextFunction } from "express";
import company from "../../models/company";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import pstn_number from "../../models/pstn_number";
import trunks from "../../models/trunks";
import extension from "../../models/extension";


const addNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let selected_company:any = data.selected_company;
    let number_pool:any= data.number_pool
    let provider:any = data.provider
   
    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }

     if(selected_company == undefined){
      return res.status(400).send({
        success: 0,
        message: "Company Id Is Mandatory."
      });
     }
  
     if(!mongoose.Types.ObjectId.isValid(selected_company)){
      return res.status(400).send({
        success: 0,
        message: "Company Id Is Invalid."
      });
     }

     let check_company:any = await company.findOne({
      _id:selected_company,
      is_deleted:0
     })

     if(check_company == null){
        return res.status(404).send({
        success: 0,
        message: "Selected Company Not Exists."
      });
     }


     if(provider == undefined){
      return res.status(400).send({
        success: 0,
        message: "Provider Is Mandatory."
      });
     }
  
     if(!mongoose.Types.ObjectId.isValid(provider)){
      return res.status(400).send({
        success: 0,
        message: "Provider  Is Invalid."
      });
     }

     let check_provider:any = await trunks.findOne({
      _id:provider,
      is_deleted:0
     })

     if(check_provider == null){
        return res.status(404).send({
        success: 0,
        message: "Selected Provider Not Exists."
      });
     }

     const normalizedRangeStr = number_pool.startsWith('+') ? number_pool.substring(1) : number_pool;
     const [baseStr, countStr] = normalizedRangeStr.split('-');
     const baseNumber = parseInt(baseStr);
     const count = parseInt(countStr);
     const rangeArray:any = [];
   
     for (let i = baseNumber; i <= count; i++) {
       rangeArray.push({
        provider:provider,
        cid:selected_company,
        pstn_number:`+${i}`
       });
     }
console.log(rangeArray);

     if(rangeArray.length == 0  )
      {
        return res.status(400).send({
          success: 0,
          message: "Please assign validate number pool."
        });
      }

    const post = await pstn_number.insertMany(rangeArray)
      return res.status(200).send({
      success: 1,
      message: "Pstn Number added successfully",
    });

  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getpstnNumberList = async (req:Request,res:Response,next:NextFunction)=>{
  try{
    let data:any = req.body
    let page: any = data.page;
    let size: any = data.size;
    let search: any = data.search?.toString();
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;


    let get_pstn_number_List:any []= await pstn_number.aggregate([
      {
        $sort:{
          createdAt:1
        }
      },
      {
        $lookup:{
          from:"companies",
          foreignField:"_id",
          localField:"cid",
          as:"CompanyDetail"
        }
      },
      {
        $unwind:"$CompanyDetail"
      },
      {
        $lookup:{
          from:"trunks",
          foreignField:"_id",
          localField:"provider",
          as:"ProviderDatil"
        }
      },
      {
        $unwind:"$ProviderDatil"
      },
      {
        $project:{
          _id:1,
          cid:1,
          pstn_number:1,
          is_deleted:1,
          createdAt:1,
          company_name:"$CompanyDetail.company_name",
          provider_name:"$ProviderDatil.trunk_name"
        }
      },
      {
        $group:{
          _id:"$cid",
          compnay_pstn_count:{$sum:1},
          pstn_number:{$first:"$pstn_number"},
          createdAt:{$first:"$createdAt"},
          is_deleted:{$first:"$is_deleted"},
          company_name:{$first:"$company_name"},
          provider_name:{$first:"$provider_name"}
        }
      },
      {
        $project:{
          cid:"$_id",
          pstn_number:1,
          is_deleted:1,
          createdAt:1,
          company_name:1,
          provider_name:1,
          number_pool:"$compnay_pstn_count"
        }
      },
      {
        $sort:{
          createdAt:-1
        }
      },
      {
        $match:{
          is_deleted:0,
          $or:[
            {
              company_name:{
                $regex: search,
                $options: "i",
              }
            },
            {
              provider_name:{
                $regex: search,
               $options: "i",
              }
            }
          ]
        }
      },
      {
        $project:{
          cid:1,
          is_deleted:1,
          createdAt:1,
          company_name:1,
          provider_name:1,
          number_pool:{
            $concat:["$pstn_number","-",{ $toString: "$number_pool"}]
          }
        }
      }
    ]).sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

    let get_pstn_number_counts:any []= await pstn_number.aggregate([
      {
        $sort:{
          createdAt:1
        }
      },
      {
        $lookup:{
          from:"companies",
          foreignField:"_id",
          localField:"cid",
          as:"CompanyDetail"
        }
      },
      {
        $unwind:"$CompanyDetail"
      },
      {
        $lookup:{
          from:"trunks",
          foreignField:"_id",
          localField:"provider",
          as:"ProviderDatil"
        }
      },
      {
        $unwind:"$ProviderDatil"
      },
      {
        $project:{
          _id:1,
          cid:1,
          pstn_number:1,
          is_deleted:1,
          createdAt:1,
          company_name:"$CompanyDetail.company_name",
          provider_name:"$ProviderDatil.trunk_name"
        }
      },
      {
        $group:{
          _id:"$cid",
          compnay_pstn_count:{$sum:1},
          pstn_number:{$first:"$pstn_number"},
          createdAt:{$first:"$createdAt"},
          is_deleted:{$first:"$is_deleted"},
          company_name:{$first:"$company_name"},
          provider_name:{$first:"$provider_name"}
        }
      },
      {
        $project:{
          cid:"$_id",
          pstn_number:1,
          is_deleted:1,
          createdAt:1,
          company_name:1,
          provider_name:1,
          number_pool:{$subtract:["$compnay_pstn_count",1]}
        }
      },
      {
        $sort:{
          createdAt:-1
        }
      },
      {
        $match:{
          is_deleted:0,
          $or:[
            {
              company_name:{
                $regex: search,
                $options: "i",
              }
            },
            {
              provider_name:{
                $regex: search,
               $options: "i",
              }
            }
          ]
        }
      },
      {
        $project:{
          cid:1,
          is_deleted:1,
          createdAt:1,
          company_name:1,
          provider_name:1,
          number_pool:{
            $concat:["$pstn_number","-",{ $toString: "$number_pool"}]
          }
        }
      }
    ])

    let total_page_count: any = Math.ceil(get_pstn_number_counts.length / size);

    return res.status(200).send({
      success:1,
      message:"Pstn Number List",
      PstnList:get_pstn_number_List,
      total_page_count:total_page_count,
      pstn_total_counts:get_pstn_number_counts.length
    })
  }catch(error){
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    })
  }
}
const removepstn = async (req:Request,res:Response,next:NextFunction)=>{
  try{
    let data:any = req.body
    let cid:any = data.cid

    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }

     if(cid == undefined){
      return res.status(400).send({
        success: 0,
        message: "Company Id Is Mandatory."
      });
     }
  
     if(!mongoose.Types.ObjectId.isValid(cid)){
      return res.status(400).send({
        success: 0,
        message: "Company Id Is Invalid."
      });
     }

     let get_company_pstn:any []= await pstn_number.find({
      cid:cid
     }).distinct("_id")

     let check_assigned_pstn:any = await extension.find({
      pstn_number:{$in:get_company_pstn}
     }).countDocuments()


     if(check_assigned_pstn > 0){
      return res.status(403).send({
        success:0,
        message:"Copmany Pstn Number already assigned to Extension  pls Unassign First."
      })
     }

    await pstn_number.updateMany({
      cid:cid
    },{
      is_deleted:1
    },{
      new:true
    })

    return res.status(200).send({
      success: 1,
      message: "Pstn Deleted Successfully."
    });

  }catch(error){
    return res.status(500).send({
      success:0,
      message:"Internal Server Error"
    })
  }
}
const getAnAssignedPstnNumberList = async (req:Request,res:Response,next:NextFunction)=>{
  try{

     let get_anassigned_pstn:any []= await pstn_number.find({
      isassigned:0,
      is_deleted:0
     }).select("pstn_number")

    return res.status(200).send({
      success: 1,
      message: "Pstn List Successfully.",
      PstnList:get_anassigned_pstn
    });

  }catch(error){
    return res.status(500).send({
      success:0,
      message:"Internal Server Error"
    })
  }
}
export default {
  addNewRecord,
  getpstnNumberList,
  removepstn,
  getAnAssignedPstnNumberList
};