import dotenv from 'dotenv';
import express from 'express';
import { dbConnection } from './db/db_connection.js';

dotenv.config();

const app = express();

dbConnection();

app.listen(process.env.PORT || 3000, (req, res)=>{
    console.log(`App listining at port ${process.env.PORT}`);
})

app.get('/', (req, res)=>{
    res.send("Hi User");
})