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
import pstn_number from "../../models/pstn_number";



const addNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let tmp_pstn:any = data.pstn_number
    let user_type:any = data.user_type
    let extension_number:any = data.extension_number
    let first_name:any = data.first_name
    let last_name:any = data.last_name
    let password:any = data.password
    let email:any = data.email
    let mobile:any = data.mobile
    let country:any = data.country

   
    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }

     if(extension_number == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Extension Number Is Mandatory." 
      });
    }

     if(!REGEXP.extension.extension_number.test(extension_number)){
      return res.status(400).send({ 
        success: 0, 
        message: "Extension Number Is Invalid." 
      });
    }

    if(first_name == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "First Name Is Mandatory." 
      });
    }

     if(!REGEXP.extension.first_name.test(first_name)){
      return res.status(400).send({ 
        success: 0, 
        message: "First Name Is Invalid." 
      });
    }

    if(last_name == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Last Name Is Mandatory." 
      });
    }

     if(!REGEXP.extension.last_name.test(last_name)){
      return res.status(400).send({ 
        success: 0, 
        message: "Last Name Is Invalid." 
      });
    }

    if(password == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Password Is Mandatory." 
      });
    }

     if(!REGEXP.extension.password.test(password)){
      return res.status(400).send({ 
        success: 0, 
        message: "Password Is Invalid." 
      });
    }

    if(email == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Email Is Mandatory." 
      });
    }

     if(!REGEXP.extension.email.test(email)){
      return res.status(400).send({ 
        success: 0, 
        message: "Email Is Invalid." 
      });
    }

    if(mobile == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Mobile Is Mandatory." 
      });
    }

     if(!REGEXP.extension.mobile.test(mobile)){
      return res.status(400).send({ 
        success: 0, 
        message: "Mobile Is Invalid." 
      });
    }

    if(country == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Country Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(country)){
      return res.status(400).send({ 
        success: 0, 
        message: "Country Is Invalid." 
      });
    }

  let check_email:any = await extension.findOne({
    is_deleted:0,
    email:email
  })   

  if(check_email){
    return res.status(409).send({ 
      success: 0, 
      message: "Email Already Exist." 
    });
  }

  let check_extension:any = await extension.findOne({
    is_deleted:0,
    extension_number:extension_number
  })   
  
  if(check_extension){
    return res.status(409).send({ 
      success: 0, 
      message: "Extension Number Already Exist." 
    });
  }


    let create_extantion_obj: any = {
      pstn_number:tmp_pstn,
      user_type:user_type,
      extension_number:extension_number,
      first_name:first_name,
      last_name:last_name,
      password:password,
      email:email,
      mobile:mobile,
      country:country
    };

    const post = await extension.create(create_extantion_obj)

    

    await pstn_number.findByIdAndUpdate({
      _id:tmp_pstn
    },
    {
      isassigned:1,
      assigend_extensionId:post._id
    },
    {
      runValidators:true
    })
      
      console.log("post",post)
       return res.status(200).send({
        success: 1,
        message: "Extension added successfully",
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
    let extension_id:any = data.extension_id
    let tmp_pstn:any = data.pstn_number
    let user_type:any = data.user_type
    let extension_number:any = data.extension_number
    let first_name:any = data.first_name
    let last_name:any = data.last_name
    let password:any = data.password
    let email:any = data.email
    let mobile:any = data.mobile
    let country:any = data.country

   
    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }

     if(extension_number == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Extension Number Is Mandatory." 
      });
    }

     if(!REGEXP.extension.extension_number.test(extension_number)){
      return res.status(400).send({ 
        success: 0, 
        message: "Extension Number Is Invalid." 
      });
    }

    if(first_name == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "First Name Is Mandatory." 
      });
    }

     if(!REGEXP.extension.first_name.test(first_name)){
      return res.status(400).send({ 
        success: 0, 
        message: "First Name Is Invalid." 
      });
    }

    if(last_name == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Last Name Is Mandatory." 
      });
    }

     if(!REGEXP.extension.last_name.test(last_name)){
      return res.status(400).send({ 
        success: 0, 
        message: "Last Name Is Invalid." 
      });
    }

    if(password == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Password Is Mandatory." 
      });
    }

     if(!REGEXP.extension.password.test(password)){
      return res.status(400).send({ 
        success: 0, 
        message: "Password Is Invalid." 
      });
    }

    if(email == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Email Is Mandatory." 
      });
    }

     if(!REGEXP.extension.email.test(email)){
      return res.status(400).send({ 
        success: 0, 
        message: "Email Is Invalid." 
      });
    }

    if(mobile == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Mobile Is Mandatory." 
      });
    }

     if(!REGEXP.extension.mobile.test(mobile)){
      return res.status(400).send({ 
        success: 0, 
        message: "Mobile Is Invalid." 
      });
    }

    if(country == undefined){
      return res.status(400).send({ 
        success: 0, 
        message: "Country Is Mandatory." 
      });
    }

     if(REGEXP.COMMON.blnakString.test(country)){
      return res.status(400).send({ 
        success: 0, 
        message: "Country Is Invalid." 
      });
    }

  let check_email:any = await extension.findOne({
    _id:{$ne:extension_id},
    is_deleted:0,
    email:email
  })   

  if(check_email){
    return res.status(409).send({ 
      success: 0, 
      message: "Email Already Exist." 
    });
  }

  let check_extension:any = await extension.findOne({
    _id:{$ne:extension_id},
    is_deleted:0,
    extension_number:extension_number
  })   
  console.log(check_extension);
  
  if(check_extension){
    return res.status(409).send({ 
      success: 0, 
      message: "Extension Number Already Exist." 
    });
  }

  let old_extantion_detail:any = await extension.findById({
    _id:extension_id
  })
  console.log("old_extantion_detail",old_extantion_detail)
  let unassign_old_extation:any = await pstn_number.findByIdAndUpdate({
    _id:old_extantion_detail.pstn_number
  },{
    assigend_extensionId:null,
    isassigned:0
  },{
    new:true,
    runValidators:true
  })

console.log("unassign_old_extation",unassign_old_extation)

    let update_extantion_obj: any = {
      pstn_number:tmp_pstn,
      user_type:user_type,
      extension_number:extension_number,
      first_name:first_name,
      last_name:last_name,
      password:password,
      email:email,
      mobile:mobile,
      country:country
    };

    const post:any = await extension.findByIdAndUpdate({
    _id:extension_id
    },update_extantion_obj,
    {
    new:true,
    runValidators:true
    })

    await pstn_number.findByIdAndUpdate({
      _id:tmp_pstn
    },{
      assigend_extensionId:post._id,
      isassigned:1
    },{
      new:true,
      runValidators:true
    })
    


      console.log("post",post)
       return res.status(200).send({
        success: 1,
        message: "Extension Updated successfully",
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
    let extension_id:any = data.extension_id

    if(Object.keys(data).length === 0){
      return res.status(400).send({
         success: 0,
         message: "Request Body Params Is Empty"
       });
     }
     
     if(!mongoose.Types.ObjectId.isValid(extension_id)){
      return res.status(400).send({
        success: 0,
        message: "Extension Id Is Invalid."
      });
     }

     let get_extension:any = await extension.findById({
      _id:extension_id
     })

     if(get_extension == null){
      return res.status(404).send({
        success: 0,
        message: "Extension Not Exists."
      });
     }

     const post = await extension.findByIdAndUpdate({
      _id:extension_id
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
      message:"Eextension Deleted successfully",
    });

}
const getextantionlist = async (req:Request,res:Response,next:NextFunction)=>{
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
            first_name:{
              $regex: search,
             $options: "i",
            }
          },
          {
            last_name:{
              $regex: search,
             $options: "i",
            }
          },
          {
            extension_number:{
              $regex: search,
             $options: "i",
            }
          },
          {
            mobile:{
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
    console.dir(find_query, { depth: null });
    const extension_list:any = await extension.find(find_query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

    const extension_total_counts:any = await extension.find(find_query)
    .countDocuments();

    let total_page_count: any = Math.ceil(extension_total_counts / size);


      res.send({
        success: 1,
        message: "Extension List",
        usersData: extension_list,
        total_page_count:total_page_count,
        company_total_counts:extension_total_counts
      });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getExtensionDetailByid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let extension_id:any = data.extension_id
  if(Object.keys(data).length === 0){
    return res.status(400).send({
       success: 0,
       message: "Request Body Params Is Empty"
     });
   }

   if(!mongoose.Types.ObjectId.isValid(extension_id)){
    return res.status(400).send({
      success: 0,
      message: "Extension Id Is Invalid."
    });
   }
      const extension_data:any = await extension.findById({
        _id:extension_id
      })
      
    return res.status(200).send({
    success: 1,
    message: "Extantion Detail",
    ExtensionDetail:extension_data
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
  DeleteRocrd,
  getextantionlist,
  getExtensionDetailByid
};