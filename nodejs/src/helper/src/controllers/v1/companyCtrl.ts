import { Request, Response, NextFunction } from "express";
import company from "../../models/company";
import user from "../../models/user";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import userCtrl from "./userCtrl";
import REGEXP from "../../regexp";
import mongoose from "mongoose";


const addNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let company_name:any = data.company_name;
    let company_street_address:any = data.company_street_address;
    let company_zipcode:any = data.company_zipcode;
    let company_city:any = data.company_city;
    let company_country:any = data.company_country;
    let company_vat:any = data.company_vat;
    let company_contact_person:any = data.company_contact_person;
    let company_password:any = data.company_password;
    let company_email:any = data.company_email;
    let company_phone_number:any = data.company_phone_number;
  if(Object.keys(data).length === 0){
    return res.status(400).send({
       success: 0,
       message: "Request Body Params Is Empty"
     });
   }

  if(company_password == undefined){
    return res.status(400).send({
      success: 0,
      message: "Company Password Is Mandatory."
    });
   }
   if(!REGEXP.company.company_password.test(company_password)){
    return res.status(400).send({ 
      success: 0, 
      message: "Company Password Is Invalid." 
    });
  }

  if(company_name == undefined){
    return res.status(400).send({
      success: 0,
      message: "Company Name Is Mandatory."
    });
   }
   if(!REGEXP.company.company_name.test(company_name)){
    return res.status(400).send({ 
      success: 0, 
      message: "Company Name Is Invalid." 
    });
  }

  if(company_email == undefined){
    return res.status(400).send({
      success: 0,
      message: "Company Email Is Mandatory."
    });
   }
   if(!REGEXP.company.company_email.test(company_email)){
    return res.status(400).send({ 
      success: 0, 
      message: "Company Email Is Invalid." 
    });
  }


    let create_company_obj:any ={
      company_name:company_name,
      company_street_address:company_street_address !== undefined ? company_street_address : "",
      company_zipcode:company_zipcode !== undefined ? company_zipcode : "",
      company_city:company_city !== undefined ? company_city : "",
      company_country:company_country !== undefined ? company_country : "",
      company_vat:company_vat !== undefined ? company_vat : "",
      company_contact_person:company_contact_person !== undefined ? company_contact_person : "",
      company_password: company_password,
      company_email:company_email,
      company_phone_number:company_phone_number !== undefined ? company_phone_number : ""
    }

      const post = await company.create(create_company_obj)
       return res.status(200).send({
        success: 1,
        message: "New company added successfully",
        post,
      });
  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getCompnayUsersById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    var uid = user_detail?.uid
    var cid = user_detail?.cid
    if (cid) {
      const usersData = await user.find({
        cid: cid,
        is_deleted: 0,
        _id: { $ne: uid }
      }).sort({
        first_name: 1
      })
      res.send({
        success: 1,
        message: "Company UsersData",
        usersData: usersData,
      });
    } else {
      res.send({
        success: 0,
        message: "some params is missing",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getCompnanylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
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
        company_name:{
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
    
    const company_list:any = await company.find(find_query)
    .select("company_name company_phone_number company_country company_city  company_street_address company_zipcode createdAt")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

    const company_total_counts:any = await company.find(find_query)
    .countDocuments();

    let total_page_count: any = Math.ceil(company_total_counts / size);


      res.send({
        success: 1,
        message: "Company UsersData",
        usersData: company_list,
        total_page_count:total_page_count,
        company_total_counts:company_total_counts
      });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const editCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let cid:any = data.cid
    let company_name:any = data.company_name;
    let company_street_address:any = data.company_street_address;
    let company_zipcode:any = data.company_zipcode;
    let company_city:any = data.company_city;
    let company_country:any = data.company_country;
    let company_vat:any = data.company_vat;
    let company_contact_person:any = data.company_contact_person;
    let company_password:any = data.company_password;
    let company_email:any = data.company_email;
    let company_phone_number:any = data.company_phone_number;
  if(Object.keys(data).length === 0){
    return res.status(400).send({
       success: 0,
       message: "Request Body Params Is Empty"
     });
   }

   if(!mongoose.Types.ObjectId.isValid(cid)){
    return res.status(400).send({
      success: 0,
      message: "Company Id Is Invalid."
    });
   }

  if(company_password == undefined){
    return res.status(400).send({
      success: 0,
      message: "Company Password Is Mandatory."
    });
   }
   if(!REGEXP.company.company_password.test(company_password)){
    return res.status(400).send({ 
      success: 0, 
      message: "Company Password Is Invalid." 
    });
  }

  if(company_name == undefined){
    return res.status(400).send({
      success: 0,
      message: "Company Name Is Mandatory."
    });
   }
   if(!REGEXP.company.company_name.test(company_name)){
    return res.status(400).send({ 
      success: 0, 
      message: "Company Name Is Invalid." 
    });
  }

  if(company_email == undefined){
    return res.status(400).send({
      success: 0,
      message: "Company Email Is Mandatory."
    });
   }
   if(!REGEXP.company.company_email.test(company_email)){
    return res.status(400).send({ 
      success: 0, 
      message: "Company Email Is Invalid." 
    });
  }

    let update_company_obj:any ={
      company_name:company_name,
      company_street_address:company_street_address !== undefined ? company_street_address : "",
      company_zipcode:company_zipcode !== undefined ? company_zipcode : "",
      company_city:company_city !== undefined ? company_city : "",
      company_country:company_country !== undefined ? company_country : "",
      company_vat:company_vat !== undefined ? company_vat : "",
      company_contact_person:company_contact_person !== undefined ? company_contact_person : "",
      company_password: company_password,
      company_email:company_email,
      company_phone_number:company_phone_number !== undefined ? company_phone_number : ""
    } 

      const updated_data:any = await company.findByIdAndUpdate({
        _id:cid
      },update_company_obj,
      {
        new:true,
        runValidators:true
      })
       return res.status(200).send({
        success: 1,
        message: "New company Updated successfully",
        Company_detail:updated_data,
      });
  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const DeleteCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let cid:any = data.cid
  if(Object.keys(data).length === 0){
    return res.status(400).send({
       success: 0,
       message: "Request Body Params Is Empty"
     });
   }

   if(!mongoose.Types.ObjectId.isValid(cid)){
    return res.status(400).send({
      success: 0,
      message: "Company Id Is Invalid."
    });
   }

      const updated_data:any = await company.findByIdAndUpdate({
        _id:cid
      },
      {
        is_deleted:1
      },
      {
        new:true,
        runValidators:true
      })
       return res.status(200).send({
        success: 1,
        message: "Company Deleted successfully"
      });
  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getCompanyDetailbyID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data:any = req.body;
    let cid:any = data.cid
  if(Object.keys(data).length === 0){
    return res.status(400).send({
       success: 0,
       message: "Request Body Params Is Empty"
     });
   }

   if(!mongoose.Types.ObjectId.isValid(cid)){
    return res.status(400).send({
      success: 0,
      message: "Company Id Is Invalid."
    });
   }
      const company_data:any = await company.findById({
        _id:cid
      })
      
       return res.status(200).send({
        success: 1,
        message: "Company Detail",
        CompanyDatil:company_data
      });
  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
  }
const getCompanyNameList = async (req:Request , res:Response , next:NextFunction)=>{

  try{

      const comnayName:any [] = await company.find({
        is_deleted:0
      }).select("company_name")

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
  getCompnayUsersById,
  getCompnanylist,
  editCompany,
  DeleteCompany,
  getCompanyDetailbyID,
  getCompanyNameList
};