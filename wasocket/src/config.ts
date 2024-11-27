import dotenv from "dotenv";
dotenv.config();

const MONGOURI = process.env.MONGOURI || "";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "";
const PORT = process.env.PORT



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

}