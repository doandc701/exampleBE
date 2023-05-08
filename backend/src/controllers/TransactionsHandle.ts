import { Request, Response } from "express";
import { ObjectTest } from "../models/transactions.model";
import { uuid } from "uuidv4";

export async function getTransactions(req: Request, res: Response) {
  const page = req.query.p || 0;
  const showLimitBooks: number = 3;
  ObjectTest.find({})
    .sort({ name: 1 })
    .limit(showLimitBooks)
    .skip(Number(page) * showLimitBooks)
    .then((blog) => {
      res.status(200).json(blog);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
}

export async function postTransaction(req: Request, res: Response) {
  console.log(req.body.name);
  const test = new ObjectTest(req.body);
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

export function patchTransactions(req: Request, res: Response) {
  ObjectTest.findByIdAndUpdate(req.params.id, req.body)
    .then((updated) => {
      res.status(200).json(updated);
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function deleteTransaction(req: Request, res: Response) {
  await ObjectTest.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      console.log(error);
    });
}
