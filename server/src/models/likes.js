const { model, Schema } = require("mongoose");

const likeSchema = new Schema(
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

module.exports = model("likes", likeSchema);
