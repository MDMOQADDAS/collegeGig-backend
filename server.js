const User = require('./model');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const app = express();
const bodyParser = require("body-parser");
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

    res.status(200).json({ token, expiresIn: 3600 ,  userId: user._id });
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

// Protected routes
router.get('/protected', authorize, (req, res) => {
  res.json({ message: true });
});

// Middleware for authorization
function authorize(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Check if user exists in database and add to req.userData
    // ...
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Auth failed' });
  }
}


//Logout route
router.post('/logout', authorize, (req, res) => {
  res.clearCookie('authToken')
  res.status(200).json({ message: 'Logout successful' });
  
})

// function authorize(req, res, next) {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, secret);
//     req.userData = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Auth failed' });
//   }
// }




// const User = require('./model');
// const express = require('express');
// const bcrypt = require('bcrypt')
// const router = require('express').Router();
// const app = express();
// const bodyParser = require("body-parser")
// const port = 3001;


// //it'll only allow the localhost:3000
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// })
// app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.json())
// app.use('/api', router);
// //all the api listening at /api/posts

// //secret for the session

// app.get('/', (req, res) => {
//   res.send('API Listening on ip:/api/posts');
// });

// //Start the server and listen on specified port
// app.listen(port, () => {
//   console.log(`Server listening at *:${port}`);
// });




// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     //console.log(email + " " + password)

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.send(false); // user not found
//     }

//     const validPassword = await bcrypt.compare(password, user.password);

//     if (validPassword) {
     
     
//       res.send(true);

//     } else {
//       res.send(false); // incorrect password
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error"); // handle internal server error
//   }
// })



// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;
//   // console.log("Singup : " + name + " " + email + " " + password);

//   const hashPassword = await bcrypt.hash(password, 12);
//   const user = new User({
//     name: name,
//     email: email,
//     password: hashPassword
//   })

//   try {
//     await user.save();
//     res.send(true)
//   } catch (error) {
//     console.error(error);
//     res.send(false);
//   }

// })







// // Create a new post
// router.post('/posts', (req, res) => {
//   const post = new Post({
//     title: req.body.title,
//     content: req.body.content,
//   });
//   post.save((error, post) => {
//     if (error) {
//       res.status(500).send(error);
//     } else {
//       res.status(201).send("Successfully saved the code");
//     }
//   });
// });

// // Get all posts
// router.get('/posts', (req, res) => {
//   Post.find((error, posts) => {
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
//   Post.findByIdAndUpdate(req.params.id, { title: req.body.title, content: req.body.content }, (error, post) => {
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

