import express from "express";
import { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { connectToDb, getDb, connectMongoose } from "./config/db";
import { routes } from "./routes/index";
import { apiLimit } from "./middlewares/rateLimit";

const app = express();
const port = 3000;

app.use(express.json());
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
app.use(apiLimit);
routes(app);

export let db: any;
// connectToDb((error: string) => {
//   if (!error) {
//     db = getDb();
//   }
// });

connectMongoose();

const corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));
// set port, listen for requests
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });
app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});
