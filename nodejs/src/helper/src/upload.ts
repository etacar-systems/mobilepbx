import multer from 'multer';
var maxSize = 100 * 1024 * 1024; //100mb
import fs from 'fs';


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./");
    },
    filename: function (req, file, cb) {
      console.log("file mimetype", file)
      var mimeType = file.mimetype.split("/");
      var myType = "/" + mimeType[0] + "/";
      const dir = "../uploads" + myType;
      let file_type_nm = mimeType[0]
      let file_format = mimeType[1]
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true,
        });
      }
      var fileUrl = dir + file.originalname;
      // let file_extantion_tmp: any = file.originalname.split(".");
      // let file_extantion: any = file_extantion_tmp[file_extantion_tmp.length - 1];
      // let fileUrl: any = dir + file_type_nm + "__" + Date.now() + "." + file_extantion;
      cb(null, fileUrl);
    },
  }),
  limits: { fileSize: maxSize },
}).single("file");


export default upload;