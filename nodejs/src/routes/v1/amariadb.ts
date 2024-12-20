import { PrismaClient } from "@prisma/client";
import { Router } from "express";
export const amariaDB = Router();

const prisma = new PrismaClient()

amariaDB.get("/", async (req, res) => {
    const users = await prisma.dispatcher.findMany()
    console.log(users);
    
    res.json(users)
});
amariaDB.post("/", async (req, res) => {
    const { setid , destination, socket , state , weight , priority , attrs , description } = req.body
    const user = await prisma.dispatcher.create({
        data: {
            setid , destination, socket , state , weight , priority , attrs , description
        }
    })
    res.json(user)
});

amariaDB.get("/user", async (req, res) => {
    const users = await prisma.user.findMany()
    console.log(users);
    
    res.json(users)
});
amariaDB.post("/user", async (req, res) => {
    const { name, email, age } = req.body
    const user = await prisma.user.create({
        data: {
            name, email, age
        }
    })
    res.json(user)
});
