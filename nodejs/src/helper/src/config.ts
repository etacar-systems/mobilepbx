import dotenv from "dotenv";
dotenv.config();


const MONGOURI = process.env.MONGOURI || "";
const PORT =  process.env.PORT
const DBNAME = process.env.DBNAME 
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";


export const config = {
    mongo:{
        uri:MONGOURI,
    },
    db:{
        dbname:DBNAME
    },
    server:{
        port:PORT
    },
    key:{
        secret_key:JWT_SECRET_KEY
    }
}
