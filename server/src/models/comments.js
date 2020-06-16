const { model, Schema } = require("mongoose");

const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "posts"
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    content: String
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("comments", commentSchema);
