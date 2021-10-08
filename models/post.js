const { Schema, model } = require("mongoose");

const PostSchema = new Schema({
    title: String,
    desc: String,
    date: { type: Date, default: Date.now },
    image: String,

    user: { type: Schema.Types.ObjectId, ref: "user" },
});

const PostModel = model("posts", PostSchema);

module.exports = { PostSchema, PostModel };
