const Users   = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt  = require('bcrypt');

const saltRounds = 10;
const JWT_SECRET = "newtonSchool";

/*
loginUser Controller

Get request json file structure
    obj =  {
        email:email,
        password: password,
    }


You need to complete the controller for user loginUser.
you need to login the user.
Complete the schema and to look the user schema look ../models/user.js
password is hashed using bcrypt saving it.


Response on different scenario

1. Invalid Password

403 Status code with 
json = {
        "message": 'Invalid Password, try again !!',
        "status": 'fail'
    }


2. Email Doesnot Exist

404 Status code with 
json = {
        "message": 'User with this E-mail does not exist !!',
        "status": 'fail'
    }

3. Success Login

//JWT token that will contain payload containing { userId }
generate a JSON web token (JWT) with the user's { userId } as the payload,
sign it with a JWT_SECRET key, and set the expiration time to 1 hour
//Don't change JWT_SECRET Secret Key.

200 Status code with 
json = {
  status: 'success',
  token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ.eyJ1c2VySWQiOi'
}



*/

const loginUser =async (req, res) => {

    const email  = req.body.email;
    const password = req.body.password;

    //Write your code here.
    try {
        const user = await Users.findOne({ email: email });
        if (!user) {
          return res.status(404).json({
            message: 'User with this E-mail does not exist !!', 
            status: 'fail'
          });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(403).json({
            message: 'Invalid Password, try again !!', 
            status: 'fail'
          });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: "1h",
        });

     
        res.status(200).json({
            status: 'success',
            token
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          message: `Error in LonginController ${error.message}`,
        });
      }

}



/*

Post request json file structure
    obj =  {
        name:name,
        email:email,
        password: password,
        role: role
    }


You need to complete the controller for user signupUser.
you need to register the user.
If any user with given mail allready exist than throw error.
Complete the schema and to look the user schema look ../models/user.js
you should hash the password using bcrypt before saving it.



Response on different scenario

1. On success reg

200 Status code with 
json = {
    "message": 'User SignedUp successfully',
    "status": 'success'
}

2. if user with given email all ready exist.

409 Status code with 
json = {
    "status": 'fail',
    "message": 'User with given Email allready register'.
}

3. if something went wrong

404 Status code with 
json = {
    "status": 'fail',
    "message": 'Something went wrong'
}

*/

const signupUser = async (req, res) => {

    const {email, password, name, role} = req.body;


     //Write your code here.
     try {
        const existedUser = await Users.findOne({ email: email });
        if (existedUser) {
          return res.status(409).json({
            message: 'User with given Email allready register' , 
            status: 'fail'
          });
        }
       
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new Users(req.body);
        await newUser.save();
        res.status(200).json({
            message: 'User SignedUp successfully', 
            status: 'success'
        });

      } catch (error) {
        console.log(error);
        res.status(404).send({
            message: 'Something went wrong' , 
            status: 'fail'
        });
      }

}

module.exports = { loginUser , signupUser };

