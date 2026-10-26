const { createUser, findUserByEmail, findUserByID, updateUserById } = require("../helpers/queries");

const editUser = async (req, res) => {
  if (req.params.id == req.user.id){
    await updateUserById(req.user.id, req.body.name, req.body.bio)
    res.status(201).json("edited")
  }else{
    res.status(401).json("Wrong User")
  }
};

module.exports = {
  editUser,
}