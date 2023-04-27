import { Request, Response } from "express";
import { ObjectUsers } from "../../models/auth/user.model";

export async function getUsers(req: Request, res: Response) {
  const page = req.query.p || 0;
  const showLimitBooks: number = 3;
  ObjectUsers.find({})
    .sort({ name: 1 })
    .limit(showLimitBooks)
    .skip(Number(page) * showLimitBooks)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
}

export async function postUsers(req: Request, res: Response) {
  console.log(req.body.name);
  const test = new ObjectUsers(req.body);
  await test
    .save()
    .then((add) => {
      res.json(add);
    })
    .catch((error) => {
      console.log(error);
      return;
    });
}
