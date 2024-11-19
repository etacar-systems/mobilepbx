import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import trunks from "../../models/trunks";



const addNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let trunk_name:any = data.trunk_name;
    let description:any = data.description;
    let secret:any = data.secret;
    let authentication:any = data.authentication;
    let registration:any = data.registration;
    let sip_server:any = data.sip_server;
    let sip_server_port:any = data.sip_server_port;
    let context:any = data.context;
    let transport:any = data.transport;

   
    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }

     if(trunk_name == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Trunk Name Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(trunk_name)){
      return res.status(400).send({ 
        success: 0, 
        message: "Trunk Name Is Invalid." 
      });
    }

    if(description == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "DescriptionIs Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(description)){
      return res.status(400).send({ 
        success: 0, 
        message: "Description Is Invalid." 
      });
    }

    if(secret == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Secret Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(secret)){
      return res.status(400).send({ 
        success: 0, 
        message: "Secret Is Invalid." 
      });
    }

    if(authentication == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Authentication Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(authentication)){
      return res.status(400).send({ 
        success: 0, 
        message: "Authentication Is Invalid." 
      });
    }

    if(registration == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Registration Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(registration)){
      return res.status(400).send({ 
        success: 0, 
        message: "Registration Is Invalid." 
      });
    }

    if(sip_server == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Sip Server Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(sip_server)){
      return res.status(400).send({ 
        success: 0, 
        message: "Sip Server Is Invalid." 
      });
    }

    if(sip_server_port == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Sip Server Port Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(sip_server_port)){
      return res.status(400).send({ 
        success: 0, 
        message: "Sip Server Port Is Invalid." 
      });
    }

    if(context == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Context Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(context)){
      return res.status(400).send({ 
        success: 0, 
        message: "Context Is Invalid." 
      });
    }

    if(transport == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Transport Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(transport)){
      return res.status(400).send({ 
        success: 0, 
        message: "Transport Is Invalid." 
      });
    }


    let create_trunk_obj: any = {
      trunk_name: trunk_name,
      description: description,
      secret: secret,
      authentication: authentication,
      registration: registration,
      sip_server: sip_server,
      sip_server_port: sip_server_port,
      context: context,
      transport: transport,
    };

       const post = await trunks.create(create_trunk_obj)
      console.log("post",post)
       return res.status(200).send({
        success: 1,
        message: "New Trunk added successfully",
      });
  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const EditNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let trunk_id:any = data.trunk_id
    let trunk_name:any = data.trunk_name;
    let description:any = data.description;
    let secret:any = data.secret;
    let authentication:any = data.authentication;
    let registration:any = data.registration;
    let sip_server:any = data.sip_server;
    let sip_server_port:any = data.sip_server_port;
    let context:any = data.context;
    let transport:any = data.transport;

   
    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }
     
     if(!mongoose.Types.ObjectId.isValid(trunk_id)){
      return res.status(400).send({
        success: 0,
        message: "Trunk Id Is Invalid."
      });
     }

     let get_trunk:any = await trunks.findById({
      _id:trunk_id
     })

     if(get_trunk == null){
      return res.status(404).send({
        success: 0,
        message: "Trunk Not Exists."
      });
     }

     if(trunk_name == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Trunk Name Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(trunk_name)){
      return res.status(400).send({ 
        success: 0, 
        message: "Trunk Name Is Invalid." 
      });
    }

    if(description == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "DescriptionIs Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(description)){
      return res.status(400).send({ 
        success: 0, 
        message: "Description Is Invalid." 
      });
    }

    if(secret == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Secret Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(secret)){
      return res.status(400).send({ 
        success: 0, 
        message: "Secret Is Invalid." 
      });
    }

    if(authentication == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Authentication Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(authentication)){
      return res.status(400).send({ 
        success: 0, 
        message: "Authentication Is Invalid." 
      });
    }

    if(registration == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Registration Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(registration)){
      return res.status(400).send({ 
        success: 0, 
        message: "Registration Is Invalid." 
      });
    }

    if(sip_server == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Sip Server Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(sip_server)){
      return res.status(400).send({ 
        success: 0, 
        message: "Sip Server Is Invalid." 
      });
    }

    if(sip_server_port == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Sip Server Port Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(sip_server_port)){
      return res.status(400).send({ 
        success: 0, 
        message: "Sip Server Port Is Invalid." 
      });
    }

    if(context == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Context Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(context)){
      return res.status(400).send({ 
        success: 0, 
        message: "Context Is Invalid." 
      });
    }

    if(transport == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Transport Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(transport)){
      return res.status(400).send({ 
        success: 0, 
        message: "Transport Is Invalid." 
      });
    }


    let update_trunk_obj: any = {
      trunk_name: trunk_name,
      description: description,
      secret: secret,
      authentication: authentication,
      registration: registration,
      sip_server: sip_server,
      sip_server_port: sip_server_port,
      context: context,
      transport: transport,
    };

       const post = await trunks.findByIdAndUpdate({
        _id:trunk_id
       },update_trunk_obj,
       {
        runValidators:true
       })
      console.log("post",post)

       return res.status(200).send({
        success: 1,
        message: "Trunk Updated successfully",
      });
  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const DeleteRocrd = async (req:Request,res:Response,next:NextFunction) =>{
    let data:any = req.body;
    let trunk_id:any = data.trunk_id

    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }
     
     if(!mongoose.Types.ObjectId.isValid(trunk_id)){
      return res.status(400).send({
        success: 0,
        message: "Trunk Id Is Invalid."
      });
     }

     let get_trunk:any = await trunks.findById({
      _id:trunk_id
     })

     if(get_trunk == null){
      return res.status(404).send({
        success: 0,
        message: "Trunk Not Exists."
      });
     }

     const post = await trunks.findByIdAndUpdate({
      _id:trunk_id
     },
     {
      is_deleted:1
     },
     {
      runValidators:true
     })
    console.log("post",post)

    return res.status(200).send({
      success: 1,
      message: "Trunk Deleted successfully",
    });

}
const gettrunkslist = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    let data:any = req.body
    let page: any = data.page;
    let size: any = data.size;
    let search: any = data.search?.toString();
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    let find_query:{[key:string]:any}={};
    if(search){
      find_query = {
        is_deleted:0,
        trunk_name:{
          $regex: search,
         $options: "i",
        }
      }
    }else{
      find_query = {
        is_deleted:0
      }
    }

    console.log("find_query",find_query)
    
    const trunk_list:any = await trunks.find(find_query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

    const trunk_total_counts:any = await trunks.find(find_query)
    .countDocuments();

    let total_page_count: any = Math.ceil(trunk_total_counts / size);


      res.send({
        success: 1,
        message: "Trunk List",
        usersData: trunk_list,
        total_page_count:total_page_count,
        company_total_counts:trunk_total_counts
      });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getTrunkdetailByid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let trunk_id:any = data.trunk_id
  if(Object.keys(data).length === 0){
    return res.status(400).send({
       success: 0,
       message: "Request Body Params Is Empty"
     });
   }

   if(!mongoose.Types.ObjectId.isValid(trunk_id)){
    return res.status(400).send({
      success: 0,
      message: "trunk_id Id Is Invalid."
    });
   }
      const trunk_data:any = await trunks.findById({
        _id:trunk_id
      })
      
       return res.status(200).send({
        success: 1,
        message: "Trunk Detail",
        TrunkDetail:trunk_data
      });
  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}

const getTrunkNameList = async (req:Request , res:Response , next:NextFunction)=>{

  try{

      const comnayName:any [] = await trunks.find({
        is_deleted:0
      }).select("trunk_name")

      return res.status(200).send({
        success : 1,
        message: "Company Name List Successfully.",
        comnayNameList : comnayName
      })
  }catch(error){
    return res.status(500).send({
      success:0,
      message:"Internal Server Error"
    })
  }
  
}

export default {
  addNewRecord,
  EditNewRecord,
  DeleteRocrd,
  gettrunkslist,
  getTrunkdetailByid,
  getTrunkNameList
};