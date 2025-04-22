import { NextFunction, Request, Response } from "express";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import phonebook from "../../models/phonebook";

const addPhonebookData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let first_name: any = data.first_name;
    let last_name: any = data.last_name;
    let phone_number: any = data.phone_number;
    let mobile_number: any = data.mobile_number;
    let company: any = data.company;
    let position: any = data.position;

    if (Object.keys(data).length === 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (first_name == undefined) {
      return res.status(400).send({
        success: 0,
        message: "First name Is Mandatory.",
      });
    }
    if (!REGEXP.phonebook.first_name.test(first_name)) {
      return res.status(400).send({
        success: 0,
        message: "First name Is Invalid.",
      });
    }

    if (last_name == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Last name Is Mandatory.",
      });
    }
    if (!REGEXP.phonebook.last_name.test(last_name)) {
      return res.status(400).send({
        success: 0,
        message: "Last name Is Invalid.",
      });
    }

    if (phone_number == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Phone number Is Mandatory.",
      });
    }

    if (!REGEXP.phonebook.phone_number.test(phone_number)) {
      return res.status(400).send({
        success: 0,
        message: "Phone number Is Invalid.",
      });
    }

    if (mobile_number == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Mobile number Is Mandatory.",
      });
    }

    if (!REGEXP.phonebook.mobile.test(mobile_number)) {
      return res.status(400).send({
        success: 0,
        message: "Mobile number Is Invalid.",
      });
    }

    if (company == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Company Is Mandatory.",
      });
    }

    if (!REGEXP.phonebook.company.test(company)) {
      return res.status(400).send({
        success: 0,
        message: "Company Is Invalid.",
      });
    }
    if (position == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Posiiton Is Mandatory.",
      });
    }

    if (!REGEXP.phonebook.position.test(position)) {
      return res.status(400).send({
        success: 0,
        message: "Position Is Invalid.",
      });
    }
    let newObject = {
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      mobile_number: mobile_number,
      company: company,
      position: position,
    };

    console.log(newObject);

    const dataAdd = await phonebook.create(newObject);

    return res.status(200).send({
      success: 1,
      message: "Contact added successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};

const editPhonebookData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let phonebook_id: any = data.phonebook_id;
    let first_name: any = data.first_name;
    let last_name: any = data.last_name;
    let phone_number: any = data.phone_number;
    let mobile_number: any = data.mobile_number;
    let company: any = data.company;
    let position: any = data.position;

    if (Object.keys(data).length === 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (first_name == undefined) {
      return res.status(400).send({
        success: 0,
        message: "First name Is Mandatory.",
      });
    }
    if (!REGEXP.phonebook.first_name.test(first_name)) {
      return res.status(400).send({
        success: 0,
        message: "First name Is Invalid.",
      });
    }

    if (last_name == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Last name Is Mandatory.",
      });
    }
    if (!REGEXP.phonebook.last_name.test(last_name)) {
      return res.status(400).send({
        success: 0,
        message: "Last name Is Invalid.",
      });
    }

    if (phone_number == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Phone number Is Mandatory.",
      });
    }

    if (!REGEXP.phonebook.phone_number.test(phone_number)) {
      return res.status(400).send({
        success: 0,
        message: "Phone number Is Invalid.",
      });
    }

    if (mobile_number == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Mobile number Is Mandatory.",
      });
    }

    if (!REGEXP.phonebook.mobile.test(mobile_number)) {
      return res.status(400).send({
        success: 0,
        message: "Mobile number Is Invalid.",
      });
    }

    if (company == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Company Is Mandatory.",
      });
    }

    if (!REGEXP.phonebook.company.test(company)) {
      return res.status(400).send({
        success: 0,
        message: "Company Is Invalid.",
      });
    }
    if (position == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Posiiton Is Mandatory.",
      });
    }

    if (!REGEXP.phonebook.position.test(position)) {
      return res.status(400).send({
        success: 0,
        message: "Position Is Invalid.",
      });
    }
    let newObject = {
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      mobile_number: mobile_number,
      company: company,
      position: position,
    };
    const dataAdd = await phonebook.findByIdAndUpdate(
      {
        _id: phonebook_id,
      },
      newObject,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).send({
      success: 1,
      message: "Phonebook updated successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};

const getPhonrbookRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let page: any = data.page;
    let size: any = data.size;
    let search: any = data.search?.toString();
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    let find_query: { [key: string]: any } = {};

    if (search) {
      find_query = {
        is_deleted: 0,
        $or: [
          {
            first_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            last_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            phone_number: {
              $regex: search,
              $options: "i",
            },
          },
          {
            mobile_number: {
              $regex: search,
              $options: "i",
            },
          },
          {
            company: {
              $regex: search,
              $options: "i",
            },
          },
          {
            position: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
    } else {
      find_query = {
        is_deleted: 0,
      };
    }
    console.dir(find_query, { depth: null });

    const phonebook_list: any = await phonebook
      .find(find_query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total_msg_count: any = await phonebook
      .find(find_query)
      .countDocuments();

    const total_pages: any = Math.ceil(total_msg_count / size);

    return res.status(200).send({
      success: 1,
      message: "Phonebook list get successfully",
      PhonebooksData: phonebook_list,
      total_page_count: total_pages,
      phonebook_total_counts: total_msg_count,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};

const deletePhonrbookData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let phonebook_id: any = data.phonebook_id;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(phonebook_id)) {
      return res.status(400).send({
        success: 0,
        message: "Phonebook Id Is Invalid.",
      });
    }

    let getPhonebookId = await phonebook.findById({
      _id: phonebook_id,
    });

    if (getPhonebookId == null) {
      return res.status(400).send({
        success: 0,
        message: "Phonebook Not Exists.",
      });
    }

    await phonebook.deleteOne({
      _id: phonebook_id,
    });

    return res.status(200).send({
      success: 1,
      message: "Contact Deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};

const getPhonrbookDataById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let phonebook_id: any = data.phonebook_id;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(phonebook_id)) {
      return res.status(400).send({
        success: 0,
        message: "Phonebook Id Is Invalid.",
      });
    }

    let getPhonebookId = await phonebook.findById({
      _id: phonebook_id,
    });

    if (getPhonebookId == null) {
      return res.status(400).send({
        success: 0,
        message: "Phonebook Not Exists.",
      });
    }

    return res.status(200).send({
      success: 1,
      message: "Phonebook Detail successfully",
      PhonebookDetail: getPhonebookId,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};

export default {
  addPhonebookData,
  getPhonrbookRecord,
  editPhonebookData,
  deletePhonrbookData,
  getPhonrbookDataById,
};
