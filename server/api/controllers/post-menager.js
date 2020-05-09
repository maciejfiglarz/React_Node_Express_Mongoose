const mongoose = require("mongoose");

const Post = require("../models/post");
const fileGetContents = require("file-get-contents");
const domino = require("domino");
const PostService = require("../services/post");
const FileService = require("../services/file");
const PostMenagerService = require("../services/post-menager");

const fs = require("fs");
const multer = require("multer");
const path = require("path");

exports.insert_post = async (req, res, next) => {
  const { body } = req;
  console.log("reqInsertPost", body);
  const postMenagerService = new PostMenagerService();
  const result = await postMenagerService.insertPost(body);
  const { post } = result;
  res.status(200).json({ success, post });
};

exports.remove_photo_temponary = async (req, res, next) => {
  const { body } = req;
  const { photo } = body;
  const path = `./public/uploads/post-temponary/${photo}`;

  const postMenagerService = new PostMenagerService();
  postMenagerService.remove(path);

  res.status(200).json({ success: true });
};

exports.upload_photo_temponary = async (req, res, next) => {
  // const fileService = new FileService();
  // const fileName = await fileService.upload("post-temponary", req, res);
  // console.log('ffffffff',fileName);
  // fileService.saveTemponaryImageInDB(fileName);
  // res.status(200).json({ fileName });

  let fileName = "";
  const storage = multer.diskStorage({
    destination: "./public/uploads/post-temponary",
    filename: function (req, file, cb) {
      extension = path.extname(path.extname(file.originalname));
      fileName = "IMAGE-" + Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
  }).single("photo");

  await upload(req, res, (err) => {
    const fileService = new FileService();
    fileService.saveTemponaryImageInDB(fileName);
    res.status(200).json({ fileName: fileName });
  });
};

exports.get_link_data = async (req, res, next) => {
  const url = req.body.url;

  fileGetContents(url, { encoding: "utf-8" })
    .then((text) => {
      const window = domino.createWindow(text);
      const document = window.document;
      const title = document
        .querySelector("meta[property='og:title']")
        .getAttribute("content");
      const image = document
        .querySelector("meta[property='og:image']")
        .getAttribute("content");
      const description = document
        .querySelector("meta[property='og:description']")
        .getAttribute("content");
      var urlParts = url
        .replace("http://", "")
        .replace("https://", "")
        .split(/[/?#]/);
      const siteName = urlParts[0].replace('www.','');;

      res.status(200).json({
        success: true,
        params: {
          title: title,
          description: description,
          image: image,
          siteName: siteName,
        },
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        params: {},
      });
    });
};

exports.create_graphic = (req, res, next) => {
  // let document = domino.createDocument()
  // let template = document.createElement("template");
  // template.innerHTML = "<canvas>Test</canvas>";

  // var fragment = template.content;

  // console.log(fragment,fragment.outerHTML);

  // domtoimage
  //   .toPng(fragment)
  //   .then(function (dataUrl) {
  //     // var img = new Image();
  //     // img.src = dataUrl;
  //     // console.log('dataUrl',dataUrl);
  //     // // document.appendChild(img);
  //   })
  //   .catch(function (error) {
  //     console.error("oops, something went wrong!", error);
  //   });
  res.status(201).json({ status: "OK" });
};