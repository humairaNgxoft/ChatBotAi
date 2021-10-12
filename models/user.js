const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: String,
  image: String,
  password: String,
  email: String,
  
  blocked: {
    type: Boolean,
    default: false,
  },

  isVerified: { type: Boolean, default: false },
  token: { type: String, default: "" },
 
  role: String,
  // contactno:String,
});

const UserModel = model("user", UserSchema);

module.exports = { UserSchema, UserModel };
