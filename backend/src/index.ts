import express from "express";
import { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { engine } from "express-handlebars";
import methodOverride from "method-override";
import session from "express-session";
import cookieParser from "cookie-parser";
import numbro from "numbro";
import { connectToDb, getDb, connectMongoose } from "./config/connectDB";
import { routes } from "./routes/index";
import { apiLimit } from "./services/rateLimit.service";
const app = express();
const port = 3008;
// const corsOptions = {
//   origin: "http://localhost:8081",
// };
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// static
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
// cookie parser middleware
app.use(cookieParser());
// session
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);


// session cart
app.use(function (req, res, next) {
  res.locals.session = req.session;
  // console.log("req.session",res.locals.session)
  next();
});
app.use(apiLimit);
// cors
app.use(cors());
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// template engines
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    helpers: {
      // tạo function index + 1
      sum: (a: any, b: any) => a + b,
      formatAmount: (amount: any) => {
        const result = numbro(amount).format({ thousandSeparated: true });
        return result;
      },
    },
  })
);
app.set("view engine", ".hbs");
app.set("views", "./src/views");

routes(app);
connectMongoose();
app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});
