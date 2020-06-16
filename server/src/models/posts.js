const { model, Schema } = require("mongoose");

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    content: String
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("posts", postSchema);
