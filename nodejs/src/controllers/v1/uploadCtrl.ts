import { MESSAGE } from "../../constant";
import { Request, Response, NextFunction, request } from "express";
import sharp from "sharp";
import Ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import path from "path";
let new_fs_path: any = ffmpegPath.path;
Ffmpeg.setFfmpegPath(new_fs_path);
import fs from "fs";
import fileUpload, { UploadedFile } from "express-fileupload";
import { config } from "../../config";
// const uploadFile1 = async (req: Request, res: Response) => {
//   // console.log(req);

//   upload(req, res, async (error) => {
//     if (req?.file) {
//       if (error) {
//         res.status(500).send({
//           message: error,
//         });
//       } else {
//         console.log("req.file", req.file);
//         var myUrl = req.file.path;
//         let get_file_name: any = req.file.filename.split("/");
//         let name: any = get_file_name[3];
//         let name_split: any = name.split(".");
//         let final_name: any = name_split[0];
//         let folder_nm: any = get_file_name[2];

//         let thumbnail_nm: any = path.join(
//           __dirname,
//           "..",
//           "..",
//           "..",
//           "..",
//           "uploads",
//           folder_nm,
//           "thumbnails" + final_name + ".png"
//         );
//         console.log("thumbnail_nm", thumbnail_nm);
//         if (req.file.mimetype.includes("image/")) {
//           sharp.cache({ files: 0 });
//           const data = await sharp(myUrl);
//           data.metadata().then(function (metadata: any) {
//             return data
//               .toFormat("png", { palette: true })
//               .resize(Math.round(metadata?.width / (metadata?.width * 0.01)))
//               .toFile(thumbnail_nm);
//           });
//         }
//         if (req.file.mimetype.includes("video/")) {
//           let viedio_file_nm: any = "thumbnails__" + final_name + ".png";
//           let foleder_path: any = "../uploads/" + folder_nm + "/";
//           console.log("viedio upoaded", viedio_file_nm);
//           console.log("myUrl", myUrl);
//           console.log("foleder_path", foleder_path);
//           Ffmpeg(myUrl)
//             .screenshots({
//               timestamps: [0],
//               filename: viedio_file_nm,
//               folder: foleder_path,
//               size: "100x100",
//             })
//             .on("progress", function (progress: any) {
//               console.log("Processing: " + progress.percent + "% done");
//             })
//             .on("error", function (err) {
//               console.log("An error occurred: " + err.message);
//             })
//             .on("end", function () {
//               console.log("Processing finished !");
//             });
//         }
//         myUrl = myUrl.replace("../uploads", "uploads");
//         var mimetype = req.file.mimetype.includes("image/")
//           ? MESSAGE.MESSAGE_MEDIA_TYPES.IMAGE
//           : req.file.mimetype.includes("video/")
//           ? MESSAGE.MESSAGE_MEDIA_TYPES.VIDEO
//           : req.file.mimetype.includes("audio/")
//           ? MESSAGE.MESSAGE_MEDIA_TYPES.AUDIO
//           : MESSAGE.MESSAGE_MEDIA_TYPES.DOCUMENTS;
//         res.send({
//           success: 1,
//           message: "Upload File Successfully",
//           originalName: req.file.originalname,
//           url: myUrl,
//           mimetype: mimetype,
//         });
//       }
//     } else {
//       res.send({
//         success: 0,
//         message: "File not found",
//       });
//     }
//   });
// };

const uploadFile = (req: Request, res: Response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const file: any = req?.files;
  console.log(file.file);

  const fileData: any = file.file;
  console.log(fileData.name);

  const mimeTypeParts = fileData?.mimetype.split("/");
  const fileType = mimeTypeParts[0];

  const uploadDir = path.join("..", "uploads", fileType);
  console.log(uploadDir);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileData?.name);
  const myUrl = filePath.replace("../uploads", "uploads");

  fileData?.mv(filePath, (err: any) => {
    if (err) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "File upload failed",
      });
    }
    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "File uploaded successfully",
      filePath: myUrl,
    });
  });
};

export default {
  uploadFile,
};
