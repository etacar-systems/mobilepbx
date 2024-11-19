import { Router } from "express";
import { whatsappLogin } from "../../controllers/v1/whatsappLogin";

export const whatsapplogIn = Router();

whatsapplogIn.post("/api", whatsappLogin);

