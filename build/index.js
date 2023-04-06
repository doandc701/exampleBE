"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var express_1 = __importDefault(require("express"));
var db_1 = require("./config/db");
var index_1 = require("./routes/index");
var app = (0, express_1.default)();
var port = 3000;
app.use(express_1.default.json());
(0, index_1.routes)(app);
(0, db_1.connectToDb)(function (error) {
    if (!error) {
        app.listen(port, function () {
            console.log("app listening on port http://localhost:".concat(port));
        });
        exports.db = (0, db_1.getDb)();
    }
});
