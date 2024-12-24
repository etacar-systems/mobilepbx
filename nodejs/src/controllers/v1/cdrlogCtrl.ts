import { Request, Response, NextFunction } from "express";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import axios from "axios";
import { config } from "../../config";
import company from "../../models/company";
import user from "../../models/user";
import REGEXP from "../../regexp";
import ring_group from "../../models/ring_group";
import IVR from "../../models/IVR";
import conferncers from "../../models/conferncers";
import time_condition from "../../models/time_condition";
import cdrs from "../../models/cdrs";

const getAllRecordByDomain = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);

    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }
    const companyDetail = await company.findOne({
      _id: user_detail?.cid,
      is_deleted: 0,
    });

    // console.log(user_detail);
    let api_config = {
      method: "get",
      maxBodyLength: Infinity,
      url: config.PBX_API.CDR.GET_BY_DOMAIN + companyDetail?.domain_uuid,
      auth: config.PBX_API.AUTH,
    };

    try {
      const data: any = await axios.request(api_config);
      if (data?.data?.message || data?.data[0]?.message) {
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "CDR logs fetched successfully",
          data: [],
        });
      }
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "CDR logs fetched successfully",
        data: data.data,
      });
    } catch (error: any) {
      // console.log(error, "11");
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to fetch CDR logs",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const getAllRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);

    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    // console.log(user_detail);
    let api_config = {
      method: "get",
      maxBodyLength: Infinity,
      url: config.PBX_API.CDR.GET_BY_EXTENSION + user_detail?.extension_uuid,
      auth: config.PBX_API.AUTH,
    };

    try {
      const data: any = await axios.request(api_config);
      if (data?.data?.message || data?.data[0]?.message) {
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "CDR logs fetched successfully",
          data: [],
        });
      }
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "CDR logs fetched successfully",
        data: data.data,
      });
    } catch (error: any) {
      console.log(error, "11");
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to fetch CDR logs",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const getAllRecordings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const search = data.search;
    const per_page = data.size;
    const page = data.page;
    const direction = data.direction;
    const start_date = data.start_date;
    const end_date = data.end_date;
    const cid = data.cid;
    const extensionId = data.extension_id;

    const extensionDetail = await user.findOne({
      _id: extensionId,
      is_deleted: 0,
    });

    const companyDetail = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });

    let newParamString = `&search=${search || ""}&per_page=${per_page || ""}&page=${
      page || ""
    }&direction=${direction || ""}&start_date=${start_date || ""}&end_date=${
      end_date || ""
    }&extension=${extensionDetail?.extension_uuid || ""}`;
    // console.log(data,newParamString)
    const token = await get_token(req);
    const user_detail = await User_token(token);

    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    // console.log(user_detail);
    let api_config = {
      method: "get",
      maxBodyLength: Infinity,
      url: config.PBX_API.RECORDING.GET + companyDetail?.domain_uuid + newParamString,
      auth: config.PBX_API.AUTH,
    };
    console.log(api_config);

    try {
      const data: any = await axios.request(api_config);
      console.log(data);
      if (data?.data?.total_rows === 0 || data?.data?.total_pages === 0) {
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "Data fetched successfully",
          data: {
            list: [],
            total_page: 0,
            total_record: 0,
          },
        });
      }
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "Data fetched successfully",
        data: {
          list:
            Object.keys(data.data)
              .filter((key) => !isNaN(+key))
              .map((key) => data?.data[key]) || [],
          total_page: data?.data?.total_pages,
          total_record: data?.data?.total_rows,
        },
      });
    } catch (error: any) {
      console.log(error, "11");
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to fetch data",
      });
    }
  } catch (error) {
    console.log(error, "11");
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getAllDataByDomain = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const search = data.search;
    const per_page = data.size;
    const page = data.page;
    const direction = data.direction;
    const start_date = data.start_date;
    const end_date = data.end_date;
    const cid = data.cid;
    const extensionId = data.extension_id;
    const select_type = data.select_type;

    let module_name: any = "";
    let extension: any = "";
    if (select_type && select_type == config.SELECT_NAME.IVR) {
      module_name = "ivr";
      let ivrDetail: any = await IVR.findOne({
        _id: extensionId,
        is_deleted: 0,
      });
      if (ivrDetail) {
        extension = ivrDetail?.extension;
      }
    } else if (select_type && select_type == config.SELECT_NAME.RINGGROUP) {
      module_name = "ring_group";
      let ringgroupDetail: any = await ring_group.findOne({
        _id: extensionId,
        is_deleted: 0,
      });
      if (ringgroupDetail) {
        extension = ringgroupDetail?.extension;
      }
    } else if (select_type && select_type == config.SELECT_NAME.EXTENSION) {
      module_name = "extension";
      let extensionDetail: any = await user.findOne({
        _id: extensionId,
        is_deleted: 0,
      });
      if (extensionDetail) {
        extension = extensionDetail?.user_extension;
      }
    } else if (select_type && select_type == config.SELECT_NAME.CONFERENCE) {
      module_name = "conference";
      let conferenceDetail: any = await conferncers.findOne({
        _id: extensionId,
        is_deleted: 0,
      });
      if (conferenceDetail) {
        extension = conferenceDetail?.extension_number;
      }
    } else if (select_type && select_type == config.SELECT_NAME.TIMECONDTION) {
      module_name = "time_condition";
      let time_conditionDetail: any = await time_condition.findOne({
        _id: extensionId,
        is_deleted: 0,
      });
      if (time_conditionDetail) {
        extension = time_conditionDetail?.extension;
      }
    } else {
      module_name = "";
    }
    // console.log("extension:::::::::::::::::::::::::", extension);
    const companyDetail = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });

    let newParamString: any;
    if (direction) {
      newParamString = `&per_page=${per_page || ""}&page=${page || ""}&direction=${
        direction || ""
      }&start_date=${start_date || ""}&end_date=${end_date || ""}&extension=${extension || ""}`;
    } else {
      newParamString = `&per_page=${per_page || ""}&page=${page || ""}&extension=${
        extension || ""
      }&start_date=${start_date || ""}&end_date=${end_date || ""}`;
    }
    if (module_name) {
      newParamString = newParamString + `&module=${module_name || ""}`;
    }
    console.log("search", search, REGEXP.COMMON.checkStringISNumber.test(search));
    if (search && REGEXP.COMMON.checkStringISNumber.test(search)) {
      console.log("caller_number if called");
      newParamString = newParamString + `&caller_number=${search || ""}`;
    }
    console.log("search", search, REGEXP.COMMON.checkIsString.test(search));
    if (search && REGEXP.COMMON.checkIsString.test(search)) {
      console.log("caller_name if called");
      newParamString = newParamString + `&caller_name=${search || ""}`;
    }

    const token = await get_token(req);
    const user_detail = await User_token(token);
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let api_config = {
      method: "get",
      maxBodyLength: Infinity,
      url: config.PBX_API.CDR.GET_BY_EXTENSION_NUMBER + companyDetail?.domain_uuid + newParamString,
      auth: config.PBX_API.AUTH,
    };
    //  console.log("api_config", api_config);
    try {
      const data: any = await axios.request(api_config);
      console.log("data", data);
      if (data?.data?.total_rows === 0 || data?.data?.total_pages === 0) {
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "CDR logs fetched successfully",
          data: {
            list: [],
            total_page: 0,
            total_record: 0,
          },
        });
      }
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "CDR logs fetched successfully",
        data: {
          list:
            Object.keys(data.data)
              .filter((key) => !isNaN(+key))
              .map((key) => data?.data[key]) || [],
          total_page: data?.data?.total_pages,
          total_record: data?.data?.total_rows,
        },
      });
    } catch (error: any) {
      console.log(error, "11");
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to fetch data",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

// ----------------------------------------------- NEW -----------------------------------------------

const getAllDataByDomainList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const search = data.search;
    const per_page = data.size;
    const page = data.page;
    const direction = data.direction;
    const start_date = data.start_date;
    const end_date = data.end_date;
    const cid = data.cid;
    const extensionId = data.extension_id;
    const select_type = data.select_type;

    let module_name: any = "";
    let extension: any = "";
    if (select_type && select_type == config.SELECT_NAME.IVR) {
      module_name = "ivr";
      let ivrDetail: any = await IVR.findOne({
        _id: extensionId,
        is_deleted: 0,
      });
      if (ivrDetail) {
        extension = ivrDetail?.extension;
      }
    } else if (select_type && select_type == config.SELECT_NAME.RINGGROUP) {
      module_name = "ring_group";
      let ringgroupDetail: any = await ring_group.findOne({
        _id: extensionId,
        is_deleted: 0,
      });
      if (ringgroupDetail) {
        extension = ringgroupDetail?.extension;
      }
    } else if (select_type && select_type == config.SELECT_NAME.EXTENSION) {
      module_name = "extension";
      let extensionDetail: any = await user.findOne({
        _id: extensionId,
        is_deleted: 0,
      });
      if (extensionDetail) {
        extension = extensionDetail?.user_extension;
      }
    } else if (select_type && select_type == config.SELECT_NAME.CONFERENCE) {
      module_name = "conference";
      let conferenceDetail: any = await conferncers.findOne({
        _id: extensionId,
        is_deleted: 0,
      });
      if (conferenceDetail) {
        extension = conferenceDetail?.extension_number;
      }
    } else if (select_type && select_type == config.SELECT_NAME.TIMECONDTION) {
      module_name = "time_condition";
      let time_conditionDetail: any = await time_condition.findOne({
        _id: extensionId,
        is_deleted: 0,
      });
      if (time_conditionDetail) {
        extension = time_conditionDetail?.extension;
      }
    } else {
      module_name = "";
    }
    console.log("extension:::::::::::::::::::::::::", extension);
    const companyDetail = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });

    let newParamString: any;
    if (direction) {
      newParamString = `&per_page=${per_page || ""}&page=${page || ""}&direction=${
        direction || ""
      }&start_date=${start_date || ""}&end_date=${end_date || ""}&extension=${extension || ""}`;
    } else {
      newParamString = `&per_page=${per_page || ""}&page=${page || ""}&extension=${
        extension || ""
      }&start_date=${start_date || ""}&end_date=${end_date || ""}`;
    }
    if (module_name) {
      newParamString = newParamString + `&module=${module_name || ""}`;
    }
    console.log("search", search, REGEXP.COMMON.checkStringISNumber.test(search));
    if (search && REGEXP.COMMON.checkStringISNumber.test(search)) {
      console.log("caller_number if called");
      newParamString = newParamString + `&caller_number=${search || ""}`;
    }
    console.log("search", search, REGEXP.COMMON.checkIsString.test(search));
    if (search && REGEXP.COMMON.checkIsString.test(search)) {
      console.log("caller_name if called");
      newParamString = newParamString + `&caller_name=${search || ""}`;
    }

    const token = await get_token(req);
    const user_detail = await User_token(token);
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let api_config = {
      method: "get",
      maxBodyLength: Infinity,
      url: config.PBX_API.CDR.GET_BY_EXTENSION_NUMBER + companyDetail?.domain_uuid + newParamString,
      auth: config.PBX_API.AUTH,
    };
    console.log("api_config", api_config);
    try {
      const data: any = await axios.request(api_config);

      // new
      let find_query: { [key: string]: any } = {};

      find_query = {
        ...find_query,
        domain_uuid: companyDetail?.domain_uuid,
        $expr: {
          $and: [
            {
              $gte: [
                {
                  $dateToString: { format: "%Y-%m-%d", date: "$start_stamp" },
                },
                start_date,
              ],
            },
            {
              $lte: [
                {
                  $dateToString: { format: "%Y-%m-%d", date: "$start_stamp" },
                },
                end_date,
              ],
            },
          ],
        },
      };

      if (search) {
        find_query = {
          ...find_query,
          $or: [
            {
              caller_id_name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              caller_id_number: {
                $regex: search,
                $options: "i",
              },
            },
            {
              direction: {
                $regex: search,
                $options: "i",
              },
            },
            {
              destination_number: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        };
      }

      const reports_list = await cdrs.find(find_query);

      // Calculate the starting index for the data based on the page and per_page
      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;

      // Assuming `reports_list` is the full list of CDR logs that you have fetched
      const paginatedReports = reports_list.slice(startIndex, endIndex);

      // Get total records count (if available) for pagination purposes
      const totalRecords = reports_list.length; // Or fetch this from your database if necessary
      const totalPages = Math.ceil(totalRecords / per_page);
      //  console.log("start_end_data",reports_list)
      if (data?.data?.total_rows === 0 || data?.data?.total_pages === 0 || reports_list === null) {
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "CDR logs fetched successfully",
          data: {
            cdr_list: [],
            total_page: 0,
            total_record: 0,
          },
        });
      }
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "CDR logs fetched successfully",
        data: {
          cdr_list: paginatedReports, // Only the sliced part of the original list
          total_page: totalPages, // Total number of pages
          total_record: totalRecords, // Total number of records
        },
      });
    } catch (error: any) {
      console.log(error, "11");
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to fetch data",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
export default {
  getAllRecord,
  getAllRecordByDomain,
  getAllRecordings,
  getAllDataByDomain,
  getAllDataByDomainList,
};
