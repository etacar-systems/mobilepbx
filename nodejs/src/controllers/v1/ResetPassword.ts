import { NextFunction, Request, Response } from "express";
import { config } from "../../config";
import REGEXP from "../../regexp";
import user from "../../models/user";
import jwt from "jsonwebtoken";
import company from "../../models/company";

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: any = req.body;

    let email: any = data.email.toLowerCase();

    if (!email) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Email Is Mandatory.",
      });
    }

    if (!REGEXP.USER.user_email.test(email)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Email Is Invalid.",
      });
    }

    const findUser: any = await user
      .findOne({
        user_email: email,
        is_deleted: 0,
      })
      .populate({
        path: "role",
        model: "role",
        select: "_id type name",
      })
      .select("user_email cid _id");

    //   console.log(findUser);

    if (!findUser) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Email Does Not Found.",
      });
    }

    if (findUser?.role?.type === 3) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Copmany Not Found.`,
      });
    }

    if (findUser) {
      const token = jwt.sign(
        {
          uid: findUser?._id,
        },
        config.key.secret_key,
        {
          expiresIn: "10m",
        }
      );
      const decoded = jwt.verify(token, config.key.secret_key);
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        token,
      });
    } else {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Fail To Reset Password",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: any = req.body;

    let token: any = data.token;
    let password: any = data.password;

    if (token === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Token Is Mandatory.",
      });
    }

    if (password === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Password Is Mandatory.",
      });
    }

    if (!REGEXP.USER.password.test(password)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Password Is Invalid.",
      });
    }

    const decoded: any = jwt.verify(token, config.key.secret_key);

    if (!decoded) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Token Is Expired",
      });
    }
    //   console.log(decoded);

    const findUser: any = await user.findOneAndUpdate(
      {
        _id: decoded?.uid,
        is_deleted: 0,
      },
      {
        password: password,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (findUser?.pstn_number === null) {
      const companyUpdate: any = await company.findOneAndUpdate(
        {
          _id: findUser?.cid,
          is_deleted: 0,
        },
        {
          company_password: password,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!companyUpdate) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: "Fail To Reset Password.",
        });
      }
    }

    //  console.log(findUser);

    if (!findUser) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Fail To Reset Password.",
      });
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Password Reset Successfully ||",
    });
  } catch (error: any) {
    //  console.log(error.name);

    if (error.name == config.RESPONSE.ERROR.EXPIRETOKEN) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Token is expired.",
      });
    } else if (error.name == config.RESPONSE.ERROR.WEBTOKEN) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Token is invalid.",
      });
    } else {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  }
};

export default { resetPassword, updatePassword };
