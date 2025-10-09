import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import blogRoute from "./routes/blogRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

 const PORT = process.env.PORT || 8016;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// const allowedOrigins = process.env.FRONTEND_ORIGIN.split(",");
 app.use(cors({
     origin: "https://blogenzoauthelite.onrender.com",
     credentials: true,
 }));


app.use('/user', userRoute);
app.use("/blog", blogRoute);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));

 app.get("*", (_, res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
 });

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
