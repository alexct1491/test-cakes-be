import { NextFunction, Request, Response, Router } from "express";
import uuid from "short-uuid";
import fs from "fs";
import path from "path";
import multer from "multer";
import { DestinationCallback, FileNameCallback } from "../models/multer";
import { Database } from "../models/Database";

const dbPath = path.join(__dirname, "..", "..", "data", "db.json");
const pathImages = path.join(__dirname, "..", "..", "public", "images");
const cakesRouter = Router();

const imgStorage = multer.memoryStorage();

const uploadImage = multer({ storage: imgStorage });

cakesRouter.get("/", async (req: Request, res: Response) => {
  try {
    fs.readFile(dbPath, (error, data) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "error read file", error });
      }
      const db = JSON.parse(data.toString()) as Database;

      res.status(200).json(db.cakes);
    });
  } catch (error) {
    console.log(error);
  }
});

cakesRouter.post(
  "/create",
  uploadImage.single("file"),
  async (
    {
      file,
      body: { name, price, description, ingredients, available },
    }: Request,
    res: Response
  ) => {
    const id = uuid.generate();
    let nameImg = "";
    if (!name || !price || !description) {
      res.status(400).json({ message: "missing data" });
    } else {
      if (file) {
        const { buffer, originalname } = file;
        nameImg = `${id}${path.extname(originalname)}`;
        fs.writeFile(pathImages + `/${nameImg}`, buffer, (err) => {
          console.log(err);
          if (err) throw err;
        });
      }
      fs.readFile(dbPath, (error, data) => {
        if (error) {
          console.log(error);
          res.status(500).json({ message: "error read file", error });
        }
        const newDb = JSON.parse(data.toString()) as Database;
        if (!newDb.cakes) newDb["cakes"] = [];
        newDb.cakes.push({
          id,
          name,
          price: Number(price),
          description,
          available: available
            ? (Array.from({ length: available }).fill({
                date: new Date(),
                timestamp: Date.now(),
              }) as { date: string; timestamp: number }[])
            : [],
          image: nameImg,
          ingredients: ingredients ? [...ingredients] : [],
        });
        fs.writeFile(dbPath, JSON.stringify(newDb), (err) => {
          if (err) {
            console.log(err);
            throw err;
          }
        });
        res.status(200).json({ message: "cake added" });
      });
    }
  }
);

cakesRouter.delete("/:id", ({ params: { id } }: Request, res: Response) => {
  if (!id) res.status(400).json({ message: "Bad request" });

  try {
    fs.readFile(dbPath, (error, data) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "error read file", error });
      }
      let db = JSON.parse(data.toString()) as Database;
      const cakeToDelete = db.cakes.find(({ id: idCake }) => id === idCake);
      if (!cakeToDelete) {
        res.status(404).json({ message: "Not found" });
      } else {
        if (cakeToDelete.image) {
          fs.unlink(`${pathImages}/${cakeToDelete.image}`, () => {});
        }

        fs.writeFile(
          dbPath,
          JSON.stringify({
            ...db,
            cakes: [...db.cakes.filter(({ id }) => id !== cakeToDelete.id)],
          }),
          (err) => {
            if (err) {
              console.log(err);
              throw err;
            }
          }
        );
        res.status(200).json({ message: "delete ok" });
      }
    });
  } catch (error) {}
});

cakesRouter.put(
  "/add-quantity/:id",
  ({ params: { id }, body: { quantity } }: Request, res: Response) => {
    if (!id || !quantity) {
      return res.status(400).json({ message: "Bad request" });
    }
    try {
      fs.readFile(dbPath, (error, data) => {
        if (error) {
          console.log(error);
          res.status(500).json({ message: "error read file", error });
        }
        let db = JSON.parse(data.toString()) as Database;
        const indexCake = db.cakes.findIndex(({ id: idCake }) => id === idCake);
        const newQuantityToAdd = Number(quantity);

        if (newQuantityToAdd) {
          db.cakes[indexCake].available.push(
            ...(Array.from({ length: newQuantityToAdd }).fill({
              date: new Date(),
              timestamp: Date.now(),
            }) as { date: string; timestamp: number }[])
          );

        }

        fs.writeFile(dbPath, JSON.stringify(db), (err) => {
          if (err) {
            console.log(err);
            throw err;
          }
        });
        res.status(200).json({ message: "quantity added" });
      });
    } catch (error) {
      res.status(500).json({message:"Status 500"})
    }
  }
);

cakesRouter.get("/:id", async ({ params: { id } }: Request, res: Response) => {
  if (!id) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    fs.readFile(dbPath, (error, data) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "error read file", error });
      }
      let db = JSON.parse(data.toString()) as Database;
      const cakeFound = db.cakes.find(({ id: idCake }) => id === idCake);
      if (!cakeFound) {
        res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(cakeFound);
    });
  } catch (error) {
    console.log(error);
  }
});

export default cakesRouter;
