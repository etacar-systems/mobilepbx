import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import outbound_route from "../../models/outbound_route";




const addNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let prepend:any = data.prepend;
    let prefix:any = data.prefix;
    let match_pattern:any = data.match_pattern;
    let selected_trunk:any = data.selected_trunk;

   
    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }

     if(!mongoose.Types.ObjectId.isValid(selected_trunk)){
      return res.status(400).send({
        success: 0,
        message: "Selected Trunk  Is Invalid."
      });
    }

     if(prepend == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Prepend Is Mandatory." 
      });
    }

     if(!REGEXP.outbound_route.prepend.test(prepend)){
      return res.status(400).send({ 
        success: 0, 
        message: "prepend Is Invalid." 
      });
    }

    if(prefix == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Prefix Is Mandatory." 
      });
    }

     if(!REGEXP.outbound_route.prefix.test(prefix)){
      return res.status(400).send({ 
        success: 0, 
        message: "Prefix Is Invalid." 
      });
    }

    if(match_pattern == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Match pattern Is Mandatory." 
      });
    }

     if(!REGEXP.outbound_route.match_pattern.test(match_pattern)){
      return res.status(400).send({ 
        success: 0, 
        message: "Match pattern Is Invalid." 
      });
    }


    let create_outboundroutes_obj: any = {
      prepend:prepend,
      prefix:prefix,
      match_pattern:match_pattern,
      selected_trunk:selected_trunk
    };

       const post = await outbound_route.create(create_outboundroutes_obj)

      console.log("post",post)
       return res.status(200).send({
        success: 1,
        message: "Outbound Route added successfully",
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
    let outbound_id:any = data.outbound_id
    let prepend:any = data.prepend;
    let prefix:any = data.prefix;
    let match_pattern:any = data.match_pattern;
    let selected_trunk:any = data.selected_trunk;

   
    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }
     
     if(!mongoose.Types.ObjectId.isValid(outbound_id)){
      return res.status(400).send({
        success: 0,
        message: "Outbound Id  Is Invalid."
      });
    }

     if(!mongoose.Types.ObjectId.isValid(selected_trunk)){
      return res.status(400).send({
        success: 0,
        message: "Selected Trunk  Is Invalid."
      });
    }

     if(prepend == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Prepend Is Mandatory." 
      });
    }

     if(!REGEXP.outbound_route.prepend.test(prepend)){
      return res.status(400).send({ 
        success: 0, 
        message: "prepend Is Invalid." 
      });
    }

    if(prefix == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Prefix Is Mandatory." 
      });
    }

     if(!REGEXP.outbound_route.prefix.test(prefix)){
      return res.status(400).send({ 
        success: 0, 
        message: "Prefix Is Invalid." 
      });
    }

    if(match_pattern == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Match pattern Is Mandatory." 
      });
    }

     if(!REGEXP.outbound_route.match_pattern.test(match_pattern)){
      return res.status(400).send({ 
        success: 0, 
        message: "Match pattern Is Invalid." 
      });
    }


    let edit_outboundroutes_obj: any = {
      prepend:prepend,
      prefix:prefix,
      match_pattern:match_pattern,
      selected_trunk:selected_trunk
    };

       const post = await outbound_route.findByIdAndUpdate({
        _id:outbound_id
       },edit_outboundroutes_obj
       ,{
        new:true,
        runValidators:true
       })

       return res.status(200).send({
        success: 1,
        message: "Outbound Route Updated successfully",
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
    let outbound_id:any = data.outbound_id

    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }
     
     if(!mongoose.Types.ObjectId.isValid(outbound_id)){
      return res.status(400).send({
        success: 0,
        message: "Outbound Id Is Invalid."
      });
     }

     let get_outbound_route:any = await outbound_route.findById({
      _id:outbound_id
     })

     if(get_outbound_route == null){
      return res.status(404).send({
        success: 0,
        message: "Outbound Route Not Exists."
      });
     }

     const post = await outbound_route.findByIdAndUpdate({
      _id:outbound_id
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
      message:"Outbound Route Deleted successfully",
    });

}
const getOutboundlist = async (req:Request,res:Response,next:NextFunction)=>{
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
    // if(search){
    //   find_query = {
    //     is_deleted:0,
    //     $or:[
    //       {
    //         ring_group_name:{
    //           $regex: search,
    //          $options: "i",
    //         }
    //       },
    //       {
    //         ring_group_phone_number:{
    //           $regex: search,
    //          $options: "i",
    //         }
    //       }
    //     ]
    //   }
    // }else{
      find_query = {
        is_deleted:0
      }
    //}

    console.log("find_query",find_query)
    
    const outbound_routes_list:any = await outbound_route.aggregate([
      {$match: find_query},
      {
        $lookup :{
          from:"trunks",
          localField:"selected_trunk",
          foreignField :"_id",
          as:"trunk_detail"
        }
      },
      {
        $unwind : "$trunk_detail"
      },
      {
        $sort :{createdAt : -1}
      },
      {
        $skip : skip
      },
      {
        $limit : limit
      },
      {
        $addFields: {
          trunk_name: "$trunk_detail.trunk_name"
        }
      },
      {
        $project : {
          prepend : 1,
          prefix :1,
          match_pattern : 1,
          trunk_name : 1
        }
      }
    ])
   

    const outbound_rout_total_counts:any = await outbound_route.find(find_query)
    .countDocuments();

    let total_page_count: any = Math.ceil(outbound_rout_total_counts / size);


      res.send({
        success: 1,
        message: "Outbound Route List",
        OutboundRoutelist: outbound_routes_list,
        total_page_count:total_page_count,
        outbound_route_total_counts:outbound_rout_total_counts
      });

  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getOutboundByid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let outbound_id:any = data.outbound_id
    
  if(Object.keys(data).length === 0){
    return res.status(400).send({
       success: 0,
       message: "Request Body Params Is Empty"
     });
   }

   if(!mongoose.Types.ObjectId.isValid(outbound_id)){
    return res.status(400).send({
      success: 0,
      message: "Outbound Id Is Invalid."
    });
   }

  const outbound_route_data:any = await outbound_route.findById({
    _id:outbound_id
  })
      
    return res.status(200).send({
    success: 1,
    message: "Outbound Route Detail",
    OutboundRouteDetail:outbound_route_data
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
  getOutboundlist,
  getOutboundByid
};