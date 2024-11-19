import { Router } from "express";
import authUser from "../../middleware/authUser";
import copmanyFeature from "../../controllers/v1/copmanyFeature";

export const companyFeatureRoute = Router();

companyFeatureRoute.post("/add", authUser, copmanyFeature.addCompanyFeatue);
companyFeatureRoute.put("/edit", authUser, copmanyFeature.updateCompanyFeatue);
companyFeatureRoute.post("/detail", authUser, copmanyFeature.getFeatureDetail);
