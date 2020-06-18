const { model, Schema } = require("mongoose");

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    content: { type: String, required: true },
    likes: {
      type: [Schema.ObjectId],
      default: []
    }
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("posts", postSchema);
