import multer from "multer";
import fs from "fs"
var maxSize = 100 * 1024 * 1024; //100mb

const audio_uplod = multer({
        storage: multer.diskStorage({
                destination: function (req, file, cb) {
                        cb(null, "./")
                },
                filename: function (req, file, cb) {
                        var mimeType = file.mimetype.split("/")
                        console.log(mimeType);
                        
                        var myType = "/" + mimeType[0] + "/"
                        var dir = "../uploads" + myType

                        if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir, {
                                        recursive: true
                                })
                        }

                        var fileurl = dir + file.originalname
                        cb(null, fileurl)
                }
        }),
        fileFilter: function (req, file, cb) {
                console.log(file);
                
                if (file.mimetype === 'audio/wave' || file.mimetype === 'audio/mp3' || file.mimetype === 'audio/mpeg') {
                        cb(null, true);
                } else {
                        const errorMsg = new Error('Only WAV and MP3 files are allowed!')
                        cb(errorMsg);
                }
        },
        limits : {fileSize : maxSize}
}).single("audio")

export default audio_uplod