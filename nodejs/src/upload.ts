import fs from "fs";
import fileUpload, { UploadedFile } from "express-fileupload";
import { NextFunction, Request, Response } from "express";
import path from "path";
import { config } from "./config";

const uploadFile = (req: Request, res: Response) => {
  let file_uloaded_object:{ [key: string]: any } = {}
  if (!req.files || Object.keys(req.files).length === 0) {
    return file_uloaded_object;
  }
  const files = req.files as {
    profile_picture?: UploadedFile;
    small_logo?:UploadedFile;
    logo_text:UploadedFile,
    dark_small_logo:UploadedFile,
    dark_logo_text:UploadedFile
  };

  if (files.profile_picture) {
    let profile_picture = files.profile_picture;
    let mimeTypeParts = profile_picture?.mimetype.split("/");
    let fileType = mimeTypeParts[0];

    let uploadDir = path.join("..", "uploads", fileType);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    let upload_path =  path.join("..", "uploads", fileType,profile_picture.name);

    profile_picture.mv(upload_path, (err) => {
      if (err) {
        return res.status(500).json({ success:0,message: 'Failed to upload profile_picture', error: err });
      }
    });
   
    file_uloaded_object["profile_picture"] =  {
      file_path:upload_path,
      file_name:profile_picture.name,
      file_mimetype:profile_picture?.mimetype
    }
  }
  if (files.small_logo) {
    let small_logo = files.small_logo;
    let mimeTypeParts = small_logo?.mimetype.split("/");
    let fileType = mimeTypeParts[0];

    let uploadDir = path.join("..", "uploads", fileType);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    let upload_path =  path.join("..", "uploads", fileType,small_logo.name);

    small_logo.mv(upload_path, (err) => {
      if (err) {
        return res.status(500).json({ success:0,message: 'Failed to upload small_logo', error: err });
      }
    });
   
    file_uloaded_object["small_logo"] =  {
      file_path:upload_path,
      file_name:small_logo.name,
      file_mimetype:small_logo?.mimetype
    }
  }
  if (files.logo_text) {
    let logo_text = files.logo_text;
    let mimeTypeParts = logo_text?.mimetype.split("/");
    let fileType = mimeTypeParts[0];

    let uploadDir = path.join("..", "uploads", fileType);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    let upload_path =  path.join("..", "uploads", fileType,logo_text.name);

    logo_text.mv(upload_path, (err) => {
      if (err) {
        return res.status(500).json({ success:0,message: 'Failed to upload logo_text', error: err });
      }
    });
   
    file_uloaded_object["logo_text"] =  {
      file_path:upload_path,
      file_name:logo_text.name,
      file_mimetype:logo_text?.mimetype
    }
  }
  if (files.dark_small_logo) {
    let dark_small_logo = files.dark_small_logo;
    let mimeTypeParts = dark_small_logo?.mimetype.split("/");
    let fileType = mimeTypeParts[0];

    let uploadDir = path.join("..", "uploads", fileType);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    let upload_path =  path.join("..", "uploads", fileType,dark_small_logo.name);

    dark_small_logo.mv(upload_path, (err) => {
      if (err) {
        return res.status(500).json({ success:0,message: 'Failed to upload dark_small_logo', error: err });
      }
    });
   
    file_uloaded_object["dark_small_logo"] =  {
      file_path:upload_path,
      file_name:dark_small_logo.name,
      file_mimetype:dark_small_logo?.mimetype
    }
  }
  if (files.dark_logo_text) {
    let dark_logo_text = files.dark_logo_text;
    let mimeTypeParts = dark_logo_text?.mimetype.split("/");
    let fileType = mimeTypeParts[0];

    let uploadDir = path.join("..", "uploads", fileType);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    let upload_path =  path.join("..", "uploads", fileType,dark_logo_text.name);

    dark_logo_text.mv(upload_path, (err) => {
      if (err) {
        return res.status(500).json({ success:0,message: 'Failed to upload dark_logo_text', error: err });
      }
    });
   
    file_uloaded_object["dark_logo_text"] =  {
      file_path:upload_path,
      file_name:dark_logo_text.name,
      file_mimetype:dark_logo_text?.mimetype
    }
  }
  return file_uloaded_object;
};

export default uploadFile;
