import { NextFunction, Request, Response } from "express";
import { config } from "../../config";
import mongoose from "mongoose";
import user from "../../models/user";
import constant from "../../constant";
import company from "../../models/company";
import fileUpload, { UploadedFile } from 'express-fileupload';
import uploadFile from "../../upload";
import {MESSAGE} from "../../constant_message";
import path from "path";
import sharp from "sharp";
import Ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
let new_fs_path: any = ffmpegPath.path;
Ffmpeg.setFfmpegPath(new_fs_path);

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let upload_file_detail = await uploadFile(req, res);
      if(upload_file_detail.profile_picture){
        var myUrl = upload_file_detail.profile_picture.file_path;
        let get_file_name: any = upload_file_detail.profile_picture.file_path.split("/");
        //console.log("get_file_name",get_file_name)
        let name: any = get_file_name[3];
        //console.log("name",name)
        let name_split: any = name.split(".");
        let final_name: any = name_split[0];
        let folder_nm: any = get_file_name[2];

        let thumbnail_nm: any = path.join(
          '..',
          '..',
          "..",
          "uploads",
          folder_nm,
          "thumbnails__" + final_name + ".png"
        );
        //console.log("thumbnail_nm", thumbnail_nm);
        // if (upload_file_detail.profile_picture.file_mimetype.includes("image/")) {
        //   sharp.cache({ files: 0 });
        //   const data = await sharp(myUrl);
        //   data.metadata().then(function (metadata: any) {
        //     return data
        //       .toFormat("png", { palette: true })
        //       .resize(Math.round(metadata?.width / (metadata?.width * 0.01)))
        //       .toFile(thumbnail_nm);
        //   });
        // }
        // if (upload_file_detail.profile_picture.file_mimetype.includes("video/")) {
        //   let viedio_file_nm: any = "thumbnails__" + final_name + ".png";
        //   let foleder_path: any = "../uploads/" + folder_nm + "/";
        //   console.log("viedio upoaded", viedio_file_nm);
        //   console.log("myUrl", myUrl);
        //   console.log("foleder_path", foleder_path);
        //   Ffmpeg(myUrl)
        //     .screenshots({
        //       timestamps: [0],
        //       filename: viedio_file_nm,
        //       folder: foleder_path,
        //       size: "100x100",
        //     })
        //     .on("progress", function (progress: any) {
        //       console.log("Processing: " + progress.percent + "% done");
        //     })
        //     .on("error", function (err) {
        //       console.log("An error occurred: " + err.message);
        //     })
        //     .on("end", function () {
        //       console.log("Processing finished !");
        //     });
        // }
      }
    let { current_password, new_password, confirm_password, user_id, role ,user_image} =
      req.body;

    const checkFiled = {
      user_id: "User id",
      role: "Role",
    };

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    for (const [field, name] of Object.entries(checkFiled)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Id Is Invalid !!",
      });
    }

    const findUser: any = await user.findById({ _id: user_id });

    if (!findUser) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Not Found User !!",
      });
    }

    if (current_password !== undefined && current_password !== findUser?.password) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Current Password Does Not Match !!",
      });
    }

    if (current_password !== undefined && current_password !== new_password && confirm_password !== new_password) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "New And Confirm Password Does Not Match !!",
      });
    }

    let get_user_detail:any =  await user.findByIdAndUpdate(
      { _id: user_id }
    );
  
    
    if(upload_file_detail.profile_picture){
      user_image = myUrl.replace("../uploads", "uploads");
    }else{
      user_image = user_image
    }

    await user.findByIdAndUpdate(
      { _id: user_id },
      { password: new_password ,user_image:user_image},
      { new: true, runValidators: true }
    );

    if (role == constant.ROLE.ADMIN) {
      await company.findByIdAndUpdate(
        { _id: findUser?.cid },
        { company_password: new_password },
        { new: true, runValidators: true }
      );
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "User Detail Updated Successfully",
      profile_url:user_image
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const UpdateUserDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name,user_id} =
      req.body;

    const checkFiled = {
      first_name:"First Name",
      last_name:"Last Name",
      user_id: "User id"
    };

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    for (const [field, name] of Object.entries(checkFiled)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Id Is Invalid !!",
      });
    }

    const findUser: any = await user.findById({ _id: user_id });

    if (!findUser) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Not Found User !!",
      });
    }

    let update_user_detail:any =  await user.findByIdAndUpdate(
      { _id: user_id },
      {first_name:first_name,last_name:last_name},
      {new:true}
    );

    let User_Data:any={
      first_name:update_user_detail.first_name,
      last_name:update_user_detail.last_name
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Detail Change Successfully !!",
      UserDetail:User_Data
      
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

export default { changePassword ,UpdateUserDetail};
