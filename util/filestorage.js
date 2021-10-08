const multer = require("multer");
const path = require("path");
const { CustomError } = require("./error");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // console.log("WWWW",file.filename);
    const extension = path.extname(file.originalname);
    const validExtensions = ["pdf", "doc", "docx"];
    if (validExtensions.includes(extension)) {
      return cb(new CustomError(400, "Only word and pdf  files are allowed!"), false);
    }

    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports.fileuploads = multer({  storage:storage });




// app.post("/upload", function(req, res, fields) {

//   const storage = multer.diskStorage({
//     destination: "public/data/",
//     filename: function(req, file, cb){
//       crypto.randomBytes(20, (err, buf) => {
//         cb(null, buf.toString("hex") + path.extname(file.originalname))
//       })
//     }
//   });

//   const upload = multer({
//     storage: storage
//   }).fields([{name: "pp"}, {name: "banner"}]);

//   upload(req, res, (err) => {
//     if (err) throw err;
//   });

// });