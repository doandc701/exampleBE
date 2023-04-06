"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
var mongodb_1 = require("mongodb");
var index_1 = require("../index");
var routes = function (app) {
    // routes
    app.get("/", function (req, res) {
        res.json("Wellcome to api");
    });
    app.get("/books", function (req, res) {
        var page = req.query.p || 0;
        var showLimitBooks = 3;
        var books = [];
        //db.collection('books').find() <=> db.books.find()
        index_1.db.collection('books')
            .find()
            .sort({ author: 1 })
            .skip(Number(page) * showLimitBooks)
            .limit(showLimitBooks)
            .forEach(function (book) { return books.push(book); })
            .then(function () {
            res.status(200).json(books);
        })
            .catch(function () {
            res.status(500).json({ error: 'Could not fetch the documents' });
        });
    });
    // get one item in collection mongodb
    app.get('/books/:id', function (req, res) {
        // get param :id = req.params.id
        if (mongodb_1.ObjectId.isValid(req.params.id)) {
            index_1.db.collection('books').findOne({ _id: new mongodb_1.ObjectId(req.params.id) })
                .then(function (item) {
                res.status(200).json(item);
            })
                .catch(function () {
                res.status(500).json({ error: 'Could not fetch the documents' });
            });
        }
        else {
            res.json('Not a valid ID');
        }
    });
    // add one item
    app.post('/books', function (req, res) {
        //  get information body : req.body
        var book = req.body;
        index_1.db.collection('books').insertOne(book)
            .then(function (result) {
            res.status(201).json(result);
        })
            .catch(function () {
            res.status(500).json({ error: 'Could not post the documents' });
        });
    });
    // add more than item
    app.post('/books/addMany', function (req, res) {
        //  get information body : req.body
        var book = req.body;
        index_1.db.collection('books').insertMany(book)
            .then(function (result) {
            res.status(201).json(result);
        })
            .catch(function () {
            res.status(500).json({ error: 'Could not post the documents' });
        });
    });
    // update one item 
    app.patch('/books/:id', function (req, res) {
        var reqId = req.params.id;
        var updateBody = req.body;
        if (mongodb_1.ObjectId.isValid(req.params.id)) {
            index_1.db.collection('books').updateOne({ _id: new mongodb_1.ObjectId(reqId) }, { $set: updateBody })
                .then(function (updated) {
                res.status(200).json(updated);
            })
                .catch(function () {
                res.status(500).json({ error: 'Could not fetch the documents' });
            });
        }
        else {
            res.json('Not a valid ID');
        }
    });
    //  delete item 
    app.delete('/books/:id', function (req, res) {
        var reqId = req.params.id;
        if (mongodb_1.ObjectId.isValid(req.params.id)) {
            index_1.db.collection('books').deleteOne({ _id: new mongodb_1.ObjectId(reqId) })
                .then(function (deleted) {
                res.status(200).json(deleted);
            })
                .catch(function () {
                res.status(500).json({ error: 'Could not fetch the documents' });
            });
        }
        else {
            res.json('Not a valid ID');
        }
    });
};
exports.routes = routes;
