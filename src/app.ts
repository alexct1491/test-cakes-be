import express, { Request, Response } from "express";
import indexRoutes from "./routes/indexRoutes";
import path from "path";
const cors = require('cors');
const app = express();
const PORT = 5001;
app.use(cors({
    origin: '*'
}));
const pathImages=path.join(__dirname, "..", "public", "images")
app.use(express.static(pathImages));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/v1", indexRoutes);



app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
