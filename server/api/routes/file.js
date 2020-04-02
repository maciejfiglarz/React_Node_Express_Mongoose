const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const assert = require("assert");
const path = require("path");
const multer = require("multer");

// const upload = require('./../helper/upload');

router.get("/post-temponary/:fileName", async (req, res) => {
  const id = req.params.fileName;

  res.sendFile(
    path.join(__dirname, `../public/uploads/post-temponary/${fileName}`)
  );
});

module.exports = router;