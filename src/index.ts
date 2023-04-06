import express from "express";
import { connectToDb, getDb, connectMongoose } from "./config/db";
import { routes } from "./routes/index";

const app = express();
const port = 3000;

app.use(express.json());
routes(app);

export let db: any;
// connectToDb((error: string) => {
//   if (!error) {
//     db = getDb();
//   }
// });
connectMongoose();
app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});
