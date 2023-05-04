import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
const users = [
  { name: "Luana", password: "1234" },
  { name: "Maria", password: "admin" },
];
const secretKey = "secret_key_cake";
const authRouter = Router();

authRouter.post(
  "/login",
  async ({ body: { username, password } }: Request, res: Response) => {
    if (!username || !password) {
      res.status(400).json({ message: "Bad request" });
    } else {
      const userFound = users.find(({ name }) => name === username);
      if (!userFound || userFound.password !== password) {
        res
          .status(400)
          .json({ message: "Bad request - username or password not valid" });
      } else {
        const token = jwt.sign({ user: userFound.name }, secretKey, {
          expiresIn: "1h",
        });
        res.status(200).json({ token });
      }
    }
  }
);

authRouter.get("/check-auth", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "need a token" });
  } else {
    try {
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          res.status(401).json({ message: err.message });
        }
        if (decoded) {
          res.status(200).json({ message: "ok" });
        }
      });
    } catch (error) {}
  }
});

export default authRouter;
