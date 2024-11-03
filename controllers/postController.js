import Post from '../models/post.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// GET all posts
const getPosts = catchAsync( async (req, res, next) => {
  const { year, month, date } = req.query;
  const filter = {};
  
  if (year) filter['datePosted.year'] = year;
  if (month) filter['datePosted.month'] = month;
  if (date) filter['datePosted.date'] = date;

  const posts = await Post.find(filter);

  res.status(200).json({
    status: 'success',
    message: "Posts found successfully",
    data: {
        posts
    }
    });
});

// CREATE a post
const createPost = catchAsync( async (req, res, next) => {

  const { title, description, category } = req.body;

  // console.log(title, '\n', description, '\n' ,category);
  // console.log(req.user);
  
  const post = new Post({
    title,
    description,
    category,
    postedBy: {
      id: req.user._id,
      name: req.user.username,
      role: req.user.role,
    },
    approved: false,
  });
  
  await post.save({ validateBeforeSave: false });

  res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: {
          post
      }
  });
});

// APPROVING POST
const approvePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;  
  
  const post = await Post.findByIdAndUpdate(postId, { approved: true }, { new: true });
  
  if (!post) return next(new AppError('Post not found', 404));

  res.status(200).json({
    status:'success',
    message: 'Post approved',
    data: {
      post
    }
  });
})

// GET SPECIFIED POSTS

const getSinglePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) return next(new AppError('Post not found', 404));

  res.status(200).json({ 
    status:'success',
    message: 'Post fetched',
    data: {
      post
    }
  });
});

// DELETE POST

const deletePost = catchAsync( async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findByIdAndDelete(postId);

  if (!post) return next(new AppError('Post not found', 404));

  res.status(204).json({ 
    status:'success',
    message: 'Post deleted'
  });
});


export {
    getPosts,
    createPost,
    approvePost,
    getSinglePost,
    deletePost
}