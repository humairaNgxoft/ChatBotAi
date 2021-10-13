const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();
const { CustomError } = require("../util/error");
const { encryptPassword, comparePassword } = require("../util/encryption");
const { uploads } = require("../util/storage");
const { fileuploads } = require("../util/filestorage");
const EmailTransporter = require("../util/email");

const { initializeUser } = require("../middlewares/security");

// MODELS
const { UserModel } = require("../models/user");
const { PostModel } = require("../models/post");
const { PostIssueModel } = require("../models/userIssuePost")
const { ChatCommentsModel } = require("../models/chatComments")






router.post(
  "/posts",

  initializeUser,
  uploads.single("image"),
  async (req, res, next) => {

    console.log(req.body, req);
    try {

      const posts = await new PostModel({
        ...req.body,
        image: req.file.filename,
        // image: req.file.filename,
        user: req.user._id,
      }).save();

      const user = await req.user.save();
      res.status(200).json({ success: true, posts, user });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/discussionsposts",

  initializeUser,
  // uploads.single("image"),
  async (req, res, next) => {

    console.log(req.body, req);
    try {

      const discussionTopic = await new PostIssueModel({
        ...req.body,
        // image: req.file.filename,

        user: req.user._id,
      }).save();

      const user = await req.user.save();
      res.status(200).json({ success: true, discussionTopic, user });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/addComment",

  initializeUser,
  // uploads.single("image"),
  async (req, res, next) => {

    console.log(req.body, req);
    try {

      const comments = await new ChatCommentsModel({
        ...req.body,
        user: req.user._id,
      }).save();

      const user = await req.user.save();
      res.status(200).json({ success: true, comments, user });
    } catch (error) {
      next(error);
    }
  }
);

router.put("/posts/:id",
  uploads.single("image"),
  async (req, res, next) => {
    console.log("here i m", req.params.id, req.body)
    try {
      let bodyy = req.body;
      bodyy['image'] = req.file.filename;
      delete bodyy._id;
      PostModel.findOneAndUpdate(
        { _id: req.params.id },

        { $set: bodyy },
        { new: true },
        (err, posts) => {

          if (err) {
            err.message = "id not found"
            return res.status(404).json(err)
          }

          res.json({ ...posts.toObject(), success: true });

        });
    }
    catch (error) {
      next(error);
    }
  })




router.get("/all-posts", async (req, res, next) => {
  try {
    PostModel.find({}, (err, items) => {
      if (err) {
        console.log(err);
      } else {
        res.send(items);
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/all-discussion-posts", async (req, res, next) => {
  try {
    const posts = await PostIssueModel.find({ ...req.query })
      .populate("user")
      .exec();

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
});

// router.get("/discussion-comments/:id", async (req, res, next) => {
//   req
//   try {
//     const comments = await ChatCommentsModel.findById(req.params.id)
//       .populate("user")
//       .exec();
//     res.status(200).json({ success: true, comments });
//   } catch (error) {
//     next(error);
//   }
// });
router.get("/discussion-comments", async (req, res, next) => {
  console.log(req, "kkkkk")
  try {
    const comments = await ChatCommentsModel.find({ ...req.query })
      .populate("user")
      .exec();

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/all-users", async (req, res, next) => {
  try {
    UserModel.find({}, (err, items) => {
      if (err) {
        console.log(err);
      } else {
        res.send(items);
      }
    });
  } catch (error) {
    next(error);
  }
});



router.delete("/posts/:id", initializeUser, async (req, res, next) => {
  try {
    PostModel.findByIdAndRemove(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
      console.log(post);
    });
  } catch (error) {
    next(error);
  }
});



// authentication
router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email }).exec();

    if (!user) throw new CustomError(404, "user doesnot exists");
    const match = await comparePassword(password, user.password);

    if (!match) throw new CustomError(400, "Wrong Password");

    const token = jwt.sign(
      {
        user,
      },
      process.env.SECRET
    );


    res.status(200).json({ success: true, user, token, });
    console.log(user, token)
  } catch (error) {
    next(error);
  }
});

// register
router.post("/signup",
  uploads.single("image"),
  async (req, res, next) => {
    // console.log(req.file);
    console.log(req.body);
    try {
      req.body.password = await encryptPassword(req.body.password);
      const userExists = await UserModel.findOne({ email: req.body.email });
      const token = crypto.randomBytes(64).toString("hex");

      if (userExists) throw new CustomError(400, "user already exists");
      // const url = `${req.protocol}://${req.get('host')}`;
      const userDoc = new UserModel({
        ...req.body,
        token,
        // image: `${url}/uploads/${req.file.filename}`,
        // role: req.body.role,
        // contactno:req.body.contactno,
      });
      const response = await userDoc.save();

      res.status(200).json({ success: true, user: response, verificationToken: `${process.env.DOMAIN}/verifyuser/${token}` });

    } catch (error) {
      next(error);
    }
  });


router.put("/forgot-password",
  async (req, res, next) => {
    const { email, pass } = req.body;

    try {
      const user = await UserModel.findOne({ email }).exec();
      // const {password} = user
      if (!user) throw new CustomError(404, "user doesnot exists");

      console.log('password to change', req.body.password);


      // user.password = pass;

      console.log('password changed:', req.body.password);

      res.status(200).json({ success: true, pass });
      console.log(user)
    } catch (error) {
      next(error);
    }

  })



// verify token
router.post("/verifyuser/:token", async (req, res, next) => {
  const token = req.params.token;
  try {
    if (!token) throw new CustomError(400, "invalid token");
    const user = await UserModel.findOne({ token });
    if (!user) throw new CustomError(404, "invalid token");
    user.isVerified = true;
    user.token = "";
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
