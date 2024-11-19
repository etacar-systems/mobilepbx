import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import trunks from "../../models/trunks";
import extension from "../../models/extension";
import ring_group from "../../models/ring_group";



const addNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let ring_group_name:any = data.ring_group_name
    let ring_group_description:any = data.ring_group_description
    let ring_group_phone_number:any = data.ring_group_phone_number
    let ring_group_duration:any = data.ring_group_duration
    let select_extensions:any = data.select_extensions
    let isenable_music_on_hold:any = data.isenable_music_on_hold
    let isenable_skip_busy_agent:any = data.isenable_skip_busy_agent
    let isenable_remote_call_pickup:any = data.isenable_remote_call_pickup
    let ring_group_strategy:any = data.ring_group_strategy
    let remote_no_answer:any = data.remote_no_answer
    let no_answer_endpoint:any = data.no_answer_endpoint

   
    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }

     if(ring_group_name == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Name Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.ring_group_name.test(ring_group_name)){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Name Is Invalid." 
      });
    }

    if(ring_group_description == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Description Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.ring_group_description.test(ring_group_description)){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Description Is Invalid." 
      });
    }

    if(ring_group_phone_number == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group PhoneNumber Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.ring_group_phone_number.test(ring_group_phone_number)){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Phone Number Is Invalid." 
      });
    }

    if(ring_group_strategy == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Strategy Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.ring_group_strategy.test(ring_group_strategy)){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Strategy Is Invalid." 
      });
    }

    if(remote_no_answer == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Remote No Answer Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.remote_no_answer.test(remote_no_answer)){
      return res.status(400).send({ 
        success: 0, 
        message: "Remote No Answer Is Invalid." 
      });
    }

    if(no_answer_endpoint == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "No Answer Endpoint Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.no_answer_endpoint.test(no_answer_endpoint)){
      return res.status(400).send({ 
        success: 0, 
        message: "No Answer Endpoint Is Invalid." 
      });
    }


    let create_ringgroup_obj: any = {
      ring_group_name:ring_group_name,
      ring_group_description:ring_group_description,
      ring_group_phone_number:ring_group_phone_number,
      ring_group_duration:ring_group_duration > 0 ? ring_group_duration : 0,
      select_extensions:select_extensions.length > 0 ? select_extensions : [],
      isenable_music_on_hold:isenable_music_on_hold,
      isenable_skip_busy_agent:isenable_skip_busy_agent,
      isenable_remote_call_pickup:isenable_remote_call_pickup,
      ring_group_strategy:ring_group_strategy,
      remote_no_answer:remote_no_answer,
      no_answer_endpoint:no_answer_endpoint
    };

       const post = await ring_group.create(create_ringgroup_obj)

      console.log("post",post)
       return res.status(200).send({
        success: 1,
        message: "Ring Group added successfully",
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
    let ring_group_id:any = data.ring_group_id
    let ring_group_name:any = data.ring_group_name
    let ring_group_description:any = data.ring_group_description
    let ring_group_phone_number:any = data.ring_group_phone_number
    let ring_group_duration:any = data.ring_group_duration
    let select_extensions:any = data.select_extensions
    let isenable_music_on_hold:any = data.isenable_music_on_hold
    let isenable_skip_busy_agent:any = data.isenable_skip_busy_agent
    let isenable_remote_call_pickup:any = data.isenable_remote_call_pickup
    let ring_group_strategy:any = data.ring_group_strategy
    let remote_no_answer:any = data.remote_no_answer
    let no_answer_endpoint:any = data.no_answer_endpoint

   
    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }

     if(ring_group_id == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Id Is Mandatory."
      });
    }
    if(!mongoose.Types.ObjectId.isValid(ring_group_id)){
      return res.status(400).send({ 
        success: 0, 
        message: "Invalid Ring Group Id ObjectId" 
      });
    }


     if(ring_group_name == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Name Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.ring_group_name.test(ring_group_name)){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Name Is Invalid." 
      });
    }

    if(ring_group_description == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Description Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.ring_group_description.test(ring_group_description)){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Description Is Invalid." 
      });
    }

    if(ring_group_phone_number == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group PhoneNumber Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.ring_group_phone_number.test(ring_group_phone_number)){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Phone Number Is Invalid." 
      });
    }

    if(ring_group_strategy == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Strategy Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.ring_group_strategy.test(ring_group_strategy)){
      return res.status(400).send({ 
        success: 0, 
        message: "Ring Group Strategy Is Invalid." 
      });
    }

    if(remote_no_answer == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Remote No Answer Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.remote_no_answer.test(remote_no_answer)){
      return res.status(400).send({ 
        success: 0, 
        message: "Remote No Answer Is Invalid." 
      });
    }

    if(no_answer_endpoint == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "No Answer Endpoint Is Mandatory." 
      });
    }

     if(!REGEXP.ring_gorup.no_answer_endpoint.test(no_answer_endpoint)){
      return res.status(400).send({ 
        success: 0, 
        message: "No Answer Endpoint Is Invalid." 
      });
    }


    let updated_ringgroup_obj: any = {
      ring_group_name:ring_group_name,
      ring_group_description:ring_group_description,
      ring_group_phone_number:ring_group_phone_number,
      ring_group_duration:ring_group_duration > 0 ? ring_group_duration : 0,
      select_extensions:select_extensions.length > 0 ? select_extensions : [],
      isenable_music_on_hold:isenable_music_on_hold,
      isenable_skip_busy_agent:isenable_skip_busy_agent,
      isenable_remote_call_pickup:isenable_remote_call_pickup,
      ring_group_strategy:ring_group_strategy,
      remote_no_answer:remote_no_answer,
      no_answer_endpoint:no_answer_endpoint
    };

       const post = await ring_group.findByIdAndUpdate({
        _id:ring_group_id
       },
       updated_ringgroup_obj
       ,
       {
        runValidators:true
       })

      console.log("post",post)
       return res.status(200).send({
        success: 1,
        message: "Ring Group Updated successfully",
      });
  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const DeleteRecord = async (req:Request,res:Response,next:NextFunction) =>{
    let data:any = req.body;
    let ring_group_id:any = data.ring_group_id

    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }
     
     if(!mongoose.Types.ObjectId.isValid(ring_group_id)){
      return res.status(400).send({
        success: 0,
        message: "Ring Group Id Is Invalid."
      });
     }

     let get_ring_group:any = await ring_group.findById({
      _id:ring_group_id
     })

     if(get_ring_group == null){
      return res.status(404).send({
        success: 0,
        message: "Ring Group Not Exists."
      });
     }

     const post = await ring_group.findByIdAndUpdate({
      _id:ring_group_id
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
      message:"Ring Group Deleted successfully",
    });

}
const getRingGrouplist = async (req:Request,res:Response,next:NextFunction)=>{
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
        $or:[
          {
            ring_group_name:{
              $regex: search,
             $options: "i",
            }
          },
          {
            ring_group_phone_number:{
              $regex: search,
             $options: "i",
            }
          }
        ]
      }
    }else{
      find_query = {
        is_deleted:0
      }
    }

    console.log("find_query",find_query)
    
    const ring_group_list:any = await ring_group.find(find_query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

    const ring_group_total_counts:any = await ring_group.find(find_query)
    .countDocuments();

    let total_page_count: any = Math.ceil(ring_group_total_counts / size);


      res.send({
        success: 1,
        message: "Ring Group List",
        RingGroupList: ring_group_list,
        total_page_count:total_page_count,
        ring_group_total_counts:ring_group_total_counts
      });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getRingGroupDetailByid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let ring_group_id:any = data.ring_group_id
  if(Object.keys(data).length === 0){
    return res.status(400).send({
       success: 0,
       message: "Request Body Params Is Empty"
     });
   }

   if(!mongoose.Types.ObjectId.isValid(ring_group_id)){
    return res.status(400).send({
      success: 0,
      message: "Ring Group Id Id Is Invalid."
    });
   }
      const ring_group_data:any = await ring_group.findById({
        _id:ring_group_id
      })
      
    return res.status(200).send({
    success: 1,
    message: "Ring Group Detail",
    RingGroupDatil:ring_group_data
  });
  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
export default {
  addNewRecord,
  EditNewRecord,
  DeleteRecord,
  getRingGrouplist,
  getRingGroupDetailByid
};