const { Schema, model } = require("mongoose");

const PostIssueSchema = new Schema({
    title: String,
    desc: String,
    date: { type: Date, default: Date.now },
    // image: String,

    user: { type: Schema.Types.ObjectId, ref: "user" },
});

const PostIssueModel = model("discussionTopic", PostIssueSchema);

module.exports = { PostIssueSchema, PostIssueModel };
