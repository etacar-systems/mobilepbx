import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import emailCtrl from "../../controllers/v1/emailCtrl";

export const emailRoute = Router();


  emailRoute.get('/',authUser,emailCtrl.emailList);
  emailRoute.get('/:id',authUser,emailCtrl.getEmail);
  emailRoute.put('/:id',authUser,emailCtrl.updateEmail);
  





