import express, { Request, Response, Router } from "express";

import path from "path";
const pathImages = path.join(__dirname, "..", "..", "public", "images");
const imageRouter = Router();

imageRouter.get("/:id", ({ params: { id } }: Request, res) => {
  res.sendFile(path.join(pathImages, `${id}`));
});
export default imageRouter;
