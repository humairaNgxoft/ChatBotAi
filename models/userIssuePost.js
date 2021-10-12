const { Schema, model } = require("mongoose");

const PostIssueSchema = new Schema({
    subject: String,
    query: String,
    // date: { type: Date, default: Date.now },
    // image: String,
    username: { type: Schema.Types.ObjectId, ref: "user" },
    user: { type: Schema.Types.ObjectId, ref: "user" },
});

const PostIssueModel = model("discussionTopic", PostIssueSchema);

module.exports = { PostIssueSchema, PostIssueModel };
