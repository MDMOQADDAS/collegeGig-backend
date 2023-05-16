const { User, Post } = require('./model');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const app = express();
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const port = 3001;

//it'll only allow the localhost:3000
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
//all the api listening at /api/posts

//secret for the session
const secret = "mysecret";

app.get('/', (req, res) => {
  res.send('API Listening on ip:/api/posts');
});

//Start the server and listen on specified port
app.listen(port, () => {
  console.log(`Server listening at *:${port}`);
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Auth failed' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Auth failed' });
    }

    // create jwt token
    const token = jwt.sign({ email: user.email, userId: user._id }, secret, { expiresIn: '1h' });
    //console.log(user._id)
    res.status(200).json({ token, expiresIn: 3600, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error"); // handle internal server error
  }
});

// User Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name: name,
      email: email,
      password: hashPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error"); // handle internal server error
  }
});

//Protected routes
router.get('/protected', authorize, (req, res) => {
  res.json({ message: true });
});

// Middleware for authorization
async function authorize(req, res, next) {
  let requestedUserId=null;
  
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secret);

    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Check if user is authorized to access the resource
    if (req.params.id) {
      try {
        const post = await Post.findById(req.params.id).exec();
        if (post) {
          requestedUserId = post.userId.toString();
        }
      } catch (err) {
        console.log(err);
      }
    }

    //  if (req.params.id)
    //  { Post.findById(req.params.id , (err, result)=>{
     
    //    if(result){
    //      requestedUserId = result.userId.toString()
    //     //console.log(requestedUserId)
    //   }
    //   else(err) => console.log(err)
    //  })}
   //here we have to work
   //we have to write in such a way read and add don't lie in condition
   //updated and delete go inside condition and after this take action

   //console.log("post id: "  + req.params.id+ " userid: " + decoded.userId + " Request User Id: "+ requestedUserId)
    if (req.params.id &&  decoded.userId !== requestedUserId) {
   //  console.log("inside 403 error")
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
}




//Logout route
router.post('/logout', authorize, (req, res) => {
  res.clearCookie('authToken')
  res.status(200).json({ message: 'Logout successful' });

})



// Create a new post
router.post('/posts', authorize,  (req, res) => {
  
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId, // set the user id to the post
    mediaUrl: req.body.mediaUrl // set the media url to the post
  });
  post.save((error, post) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(201).send("Successfully saved the post");
    }
  });
});

//Get all the posts
router.get('/posts', authorize,(req, res) => {
  Post.find({})
    .populate('userId', 'name email') // populate the user object with only name and email fields
    .exec((error, posts) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(posts);
      }
    });
});

// Get a single post by ID
router.get('/posts/:id', authorize, (req, res) => {
  Post.findById(req.params.id)
    .populate('userId', 'name email') // populate the user object with only name and email fields
    .exec((error, post) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(post);
      }
    });
});

// Update a post by ID
router.put('/posts/:id', authorize, (req, res) => {

  Post.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title, description: req.body.description, mediaUrl: req.body.mediaUrl }, { new: true }, (error, post) => {
    if (error) {
      res.status(500).send(error);
    } else if (!post) {
      res.status(404).send("Post not found or unauthorized");
    } else {
      res.send(post);
    }
  });
});

// Delete a post by ID
router.delete('/posts/:id', authorize,  (req, res) => {
  
  Post.findOneAndDelete({ _id: req.params.id }, (error, post) => {
    if (error) {
      res.status(500).send(error);
    } else if (!post) {
      res.status(404).send("Post not found or unauthorized");
    } else {
      res.send(post);
    }
  });
});

// function authorize(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Authorization header missing or invalid' });
//     }
//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, secret);
//     if (!decoded.userId) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     // Check if user exists in database and add to req.userData
//     // ...
//     req.userData = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Auth failed' });
//   }
// }

// // Create a new post
// router.post('/posts', (req, res) => {
//   const post = new Post({
//     title: req.body.title,
//     description: req.body.description,
//   });
//   post.save((error, post) => {
//     if (error) {
//       res.status(500).send(error);
//     } else {
//       res.status(201).send("Successfully saved the post");
//     }
//   });
// });

// //Get all the posts

// router.get('/posts', (req, res) => {
//   Post.find({}, (error, posts) => {
//     if (error) {
//       res.status(500).send(error);
//     } else {
//       res.send(posts);
//     }
//   });
// });


// // Get a single post by ID
// router.get('/posts/:id', (req, res) => {
//   Post.findById(req.params.id, (error, post) => {
//     if (error) {
//       res.status(500).send(error);
//     } else {
//       res.send(post);
//     }
//   });
// });

// // Update a post by ID
// router.put('/posts/:id', (req, res) => {
//   Post.findByIdAndUpdate(req.params.id, { title: req.body.title, description: req.body.description }, (error, post) => {
//     if (error) {
//       res.status(500).send(error);
//     } else {
//       res.send(post);
//     }
//   });
// });

// // Delete a post by ID
// router.delete('/posts/:id', (req, res) => {
//   Post.findByIdAndDelete(req.params.id, (error, post) => {
//     if (error) {
//       res.status(500).send(error);
//     } else {
//       res.send(post);
//     }
//   });
// });


// //object storeage in local disk
// // Set the storage engine for multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//   }
// });

// // Initialize multer middleware
// const upload = multer({ storage: storage });

// router.post('/notes', upload.single('file'), (req, res) => {

//   const filePath = req.file.path;
//   // Save the file path and other details to the database or perform any other actions
//   // In this example, we're just sending back the saved file path and details
//   // res.json({ filePath, title, description });
//   res.status(200).send("file saved")
// });