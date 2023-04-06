"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.connectToDb = void 0;
var mongodb_1 = require("mongodb");
var dbConnetion;
var uriCloud = 'mongodb+srv://books:j7yjNzJntNrwXHxp@clbook.lvbipmz.mongodb.net/?retryWrites=true&w=majority';
var uriLocal = 'mongodb://localhost:27017/test';
var connectToDb = function (callback) {
    mongodb_1.MongoClient.connect(uriCloud)
        .then(function (client) {
        dbConnetion = client.db();
        return callback();
    }).catch(function (error) {
        console.log(error);
        return callback(error);
    });
};
exports.connectToDb = connectToDb;
var getDb = function () { return dbConnetion; };
exports.getDb = getDb;
