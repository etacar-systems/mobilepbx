import { Router } from "express";
import adminCtrl from "../../controllers/v1/adminCtrl";
export const adminroutes = Router();

adminroutes.post("/add",adminCtrl.addadmin)
adminroutes.post("/login",adminCtrl.adminlogin)