const { createUser, findUserByEmail } = require("../helpers/queries");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  if (req.body.email && req.body.name && req.body.password) {
    const userExists = await findUserByEmail(req.body.email);
    if (userExists) return res.status(409).json("email already in use!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await createUser(req.body.email, req.body.name, hashedPassword);
    res.status(201).json("Account Created")
  }else{
    res.status(400).json("Missing Arguments");
  }
}

const login = async (req, res) => {
  if (req.body.email && req.body.name && req.body.password){
    const exisitingUser = await findUserByEmail(req.body.email);
    if (exisitingUser){
      const passMatch = await bcrypt.compare(req.body.password, exisitingUser.password);
      if (!passMatch) return res.status(400).json("Wrong Password Or Email");
      
      const payload = {id: exisitingUser.id, name: exisitingUser.name, email: exisitingUser.email};


      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: "2h"},
        (err, token) => {
          if (err) throw err;
          res.status(200).json({token: token});
        });
    }else{
      return res.status(401).json("Wrong Password Or Email");
    }
  }else{
    res.status(400).json("Missing Arguments")
  }
  
}

module.exports = {
  signup,
  login
}