import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import phonebookCtrl from "../../controllers/v1/phonebookCtrl";

export const phonebookRoute = Router();

phonebookRoute.post("/add", authUser, phonebookCtrl.addPhonebookData);
phonebookRoute.post("/detail", authUser, phonebookCtrl.getPhonrbookDataById);
phonebookRoute.put("/edit", authUser, phonebookCtrl.editPhonebookData);
phonebookRoute.delete("/delete", authUser, phonebookCtrl.deletePhonrbookData);
phonebookRoute.post("/list", phonebookCtrl.getPhonrbookRecord);
