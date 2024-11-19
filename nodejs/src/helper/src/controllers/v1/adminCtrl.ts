import { Request,Response,NextFunction } from "express";
import user_admin from "../../models/user_admin";
import user_admin_token from "../../models/user_admin_token";
import jwt,{ Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";


const addadmin = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        let data:any = req.body 
        let user_name:any = data.user_name 
        let user_email:any = data.user_email 
        let user_password:any = data.user_password 
        let user_mobileNumber:any = data.user_mobileNumber 
        let user_address:any = data.user_address 

        if(user_name == undefined ){
           return res.status(403).send({
                success:0,
                message:"user_name is Required Field"
            })
        }

        if(user_email == undefined ){
            return res.status(403).send({
                success:0,
                message:"user_email is Required Field"
            })
        }

        if(user_password == undefined ){
            return res.status(403).send({
                success:0,
                message:"user_password is Required Field"
            })
        }
        if(user_mobileNumber == undefined ){
            return res.status(403).send({
                success:0,
                message:"user_mobileNumber is Required Field"
            })
        }
        if(user_address == undefined ){
            return res.status(403).send({
                success:0,
                message:"user_address is Required Field"
            })
        }

        let check_user_exixst:any = await user_admin.findOne({
            user_email:user_email,
            is_deleted:0
        })

        if(check_user_exixst){
            return res.status(403).send({
                success:0,
                message:"User Email Already Exists"
            })
        }

        let create_admin_obj:any = {
            user_name:user_name,
            user_email:user_email,
            user_password:user_password,
            user_mobileNumber:user_mobileNumber,
            user_address:user_address
        }

        let created_admin:any = await user_admin.create(create_admin_obj)

        let created_admin_detail:any = await user_admin.findById({
            _id:created_admin._id
        }).select("user_name user_email user_mobileNumber user_address")

        

        return res.status(201).send({
            success:1,
            message:"Admin User Created Successfully",
            AdminDetail:created_admin_detail
        })

    } catch (error) {
        return res.status(500).send({
            success:1,
            message:"Internal Server Error"
        })
    }
}
const adminlogin = async (req:Request,res:Response,next:NextFunction)=>{
    console.log("Routes call for login",req.body)
    try {
        let data:any = req.body
        let user_email:any = data.user_email
        let user_password:any = data.user_password

        if(user_email == undefined ){
            return res.status(403).send({
                success:0,
                message:"user_email is Required Field"
            })
        }
        if(user_password == undefined ){
            return res.status(403).send({
                success:0,
                message:"user_password is Required Field"
            })
        }

        let check_admin_email:any = await user_admin.findOne({
            user_email:user_email,
            is_deleted:0
        })

        if(check_admin_email == null){
            return res.status(403).send({
                success:0,
                message:"User Email Adderess is Invalid"
            })
        }

        let check_admin_password:any = await user_admin.findOne({
            user_password:user_password,
            is_deleted:0
        })

        if(check_admin_password == null){
            return res.status(403).send({
                success:0,
                message:"User Password is Invalid"
            })
        }

        let check_admin:any = await user_admin.findOne({
            user_email:user_email,
            user_password:user_password,
            is_deleted:0
        }).select("user_name user_email user_mobileNumber user_address")

        if(check_admin == null){
            return res.status(403).send({
                success:0,
                message:"User Login credentials is Invalid"
            })
        }

        let login_token:any = jwt.sign({
            uid:check_admin._id
        },config.key.secret_key,{
            expiresIn:"1d"
        })

        let token_obj:any = {
            admin_id:check_admin._id,
            token:login_token
        }
        
        let created_token:any = await user_admin_token.create(token_obj)

        let admin_user_detail:any = {
            Admin_userDetail:check_admin,
            token:created_token.token
        }

        return res.status(200).send({
            success:1,
            message:"User Login Successfully",
            AdminDetail:admin_user_detail
        })

    } catch (error) {
        return res.status(500).send({
            success:0,
            message:"Internal Server Error"
        })
    }
}
export default {
    addadmin,
    adminlogin
}