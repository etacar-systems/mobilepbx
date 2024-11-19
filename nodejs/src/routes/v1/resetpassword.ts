import { Router } from "express";
import ResetPassword from "../../controllers/v1/ResetPassword";

export const resetUserpass = Router();

resetUserpass.post("/reset_password", ResetPassword.resetPassword);
resetUserpass.put("/update_password", ResetPassword.updatePassword);
