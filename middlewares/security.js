const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const { CustomError } = require("../util/error");


module.exports.initializeUser = async (req, res, next) => {

  const token = req.headers["auth"];
  console.log(token,"cdjsj")
  try {
    const { user } = jwt.verify(token, process.env.SECRET);
    const match = await UserModel.findById(user._id);
    if (!match) throw new CustomError(404, "user not found");
    req.user = match;
    next();
  } catch (error) {
    next(error);
  }
};
