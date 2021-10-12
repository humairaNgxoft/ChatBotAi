const { Schema, model } = require("mongoose");

const ChatCommentsSchema = new Schema({
    postID : { type: Schema.Types.ObjectId, ref: "discussionTopic" },
    messageComment: String,
    // date: { type: Date, default: Date.now },
    // image: String,

    user: { type: Schema.Types.ObjectId, ref: "user" },
});

const ChatCommentsModel = model("chatComments", ChatCommentsSchema);

module.exports = { ChatCommentsSchema, ChatCommentsModel };
