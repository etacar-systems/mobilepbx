import dotenv from "dotenv";
dotenv.config();

const MONGOURI = process.env.MONGOURI || "";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "";
const PORT = process.env.PORT
const SECRET_KEY = process.env.JWT_SECRATE_KEY || "";
const ENVIRONMENT = process.env.ENVIRONMENT || "";
let FREESWITCH_CLIENT_PORT:any = process.env.FREESWITCH_CLIENT_PORT
let FREESWITCH_CLIENT_HOST:any = process.env.FREESWITCH_CLIENT_HOST
let FREESWITCH_CLIENT_PASSWORD:any =  process.env.FREESWITCH_CLIENT_PASSWORD


export const config = {
  mongo: {
    uri: MONGOURI
  },
  server: {
    port: PORT
  },
  db: {
    dbname: MONGO_DB_NAME
  },
  key: {
    secret_key: SECRET_KEY
  },
  enviroment: {
    enviroment_type: ENVIRONMENT
  },
  service: {
  type:"",
  project_id:"",
  private_key_id:"",
  private_key:"",
  client_email:"",
  client_id:"",
  auth_uri:"",
  token_uri:"",
  auth_provider_x509_cert_url:"",
  client_x509_cert_url:"",
  universe_domain:""
  },
  freeSwitch_client_detail:{
    port:FREESWITCH_CLIENT_PORT,
    host:FREESWITCH_CLIENT_HOST,
    password:FREESWITCH_CLIENT_PASSWORD
  }
}