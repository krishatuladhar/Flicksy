import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
//securty packges
import helmet from "helmet";
import dbConnection from "./config/mongodb.js"
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

const __dirname = path.resolve(path.dirname(""));

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "views/build")));

const PORT = 8800;

dbConnection();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
  "https://flicksy-sigma.vercel.app",
  "http://localhost:8800"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));


app.use(morgan("dev"));
app.use(router);

//error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Backend API is running');
});
