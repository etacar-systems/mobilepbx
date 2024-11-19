import mongoose,{ Schema,Document } from "mongoose";


interface user_wallpaper{
    wallpaper_type:Number;
    wallpaper_url:String;
}
export interface user_wallpaperModel extends user_wallpaper,Document{}

const prepSchema:Schema = new Schema({
    wallpaper_type: {
        type:Number,
        required: "wallpaper_type is required"
    },
    wallpaper_url: {
      type:String,
      required: "wallpaper_url is required"
    }
  },
  {
    timestamps: true,
  }
  );


export default mongoose.model<user_wallpaperModel>("user_wallpaper", prepSchema);