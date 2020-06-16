//const Query = require("./query");
//const Mutation = require("./mutation");

const { ApolloError } = require("apollo-server-express");

const { generateToken } = require("../../utils/token");

module.exports = {
  Query: {
    getPosts: (parent, args, { user, models: { PostModel } }) => {
      if (!user) {
        throw new ApolloError("UNAUTHORIZED");
      }
      return PostModel.find({}).sort({ createdAt: -1 });
    },
    getPostById: (parent, { id }, { user, models: { PostModel } }) => {
      if (!user) {
        throw new ApolloError("UNAUTHORIZED");
      }
      return PostModel.findById(id);
    }
  },
  Mutation: {
    login: (_, { input }, { models: { UserModel } }) => {
      if (!input.email || !input.password) {
        throw new ApolloError("INVALID_DATA");
      }
      return UserModel.findOne({ email: input.email }).then(user => {
        if (!user) {
          throw new ApolloError("INVALID_EMAIL");
        }
        if (!user.isValidPassword(input.password)) {
          throw new ApolloError("INVALID_PASSWORD");
        }
        const token = generateToken({ _id: user._id });
        return token;
      });
    },
    register: (_, { input }, { models: { UserModel } }) => {
      if (!input.email || !input.username || !input.password) {
        throw new ApolloError("INVALID_DATA");
      }

      const query = {
        $or: [{ email: input.email }, { username: input.username }]
      };

      return UserModel.findOne(query).then(user => {
        if (user) {
          throw new ApolloError("USER_EXISTS");
        }
        return new UserModel(input).save().then(user => {
          const token = generateToken({ _id: user._id });
          return token;
        });
      });
    },
    createPost: (_, { content }, { user, models: { PostModel } }) => {
      if (!user) {
        throw new ApolloError("UNAUTHORIZED");
      }
      return new PostModel({ content, userId: user.id }).save();
    },
    deletePost: (_, { id }, { user, models: { PostModel } }) => {
      if (!user) {
        throw new ApolloError("UNAUTHORIZED");
      }
      return PostModel.findById(id).then(post => {
        if (!post) {
          throw new ApolloError("DATA_NOT_FOUND");
        }
        if (!post.userId.equals(user._id)) {
          throw new ApolloError("UNAUTHORIZED");
        }
        return post.remove().then(() => true);
      });
    },
    createComment: (
      _,
      { postId, content },
      { user, models: { CommentModel } }
    ) => {
      if (!user) {
        throw new ApolloError("UNAUTHORIZED");
      }
      if (!postId || !content) {
        throw new ApolloError("INVALID_DATA");
      }
      return new CommentModel({ postId, content, userId: user._id }).save();
    }
  },
  deleteComment: (
    _,
    { postId, commentId },
    { user, models: { CommentModel } }
  ) => {
    if (!user) {
      throw new ApolloError("UNAUTHORIZED");
    }
    return CommentModel.findById(commentId).then(comment => {
      if (!comment) {
        throw new ApolloError("DATA_NOT_FOUND");
      }
      if (!comment.userId.equals(user._id)) {
        throw new ApolloError("UNAUTHORIZED");
      }
      return comment.remove().then(() => true);
    });
  },
  likePost: (_, { postId }, { user, models: { LikeModel } }) => {
    if (!user) {
      throw new ApolloError("UNAUTHORIZED");
    }
    return LikeModel.findById(postId).then(like => {
      if (!like) {
        throw new ApolloError("DATA_NOT_FOUND");
      }
      if (!like.userId.equals(user._id)) {
        throw new ApolloError("UNAUTHORIZED");
      }
      return like.filter(like.userId.equals(user._id));
    });
  },
  Post: {
    author: (parent, args, { models: { UserModel } }) =>
      UserModel.findById(parent.userId),
    isViewerAuthor: (parent, args, { user }) => {
      return user._id.equals(parent.userId);
    },
    comments: (parent, args, { models: { CommentModel } }) => {
      return CommentModel.find({ postId: parent._id });
    },
    lastComment: (parent, args, { models: { CommentModel } }) => {
      return CommentModel.findOne({ postId: parent._id }).sort({
        createdAt: -1
      });
    }
  },
  Comment: {
    author: (parent, args, { models: { UserModel } }) =>
      UserModel.findById(parent.userId),
    isViewerAuthor: (parent, args, { user }) => {
      return user._id.equals(parent.userId);
    }
  }
};
