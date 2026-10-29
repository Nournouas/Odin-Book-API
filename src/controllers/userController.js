const { updateUserById, findUser, findUsers, deleteUser, userFollow, existingFollow} = require("../helpers/queries");

const editUser = async (req, res) => {
  if (req.params.id == req.user.id && req.body.name && req.body.bio){
    await updateUserById(req.user.id, req.body.name, req.body.bio);
    res.status(201).json("edited");
  }else{
    res.status(401).json("Wrong User");
  }
};

const getUser = async (req, res) => {
  try{
    const user = await findUser(req.params.id);
    if (!user) return res.status(404).json("User Does Not Exist")
    res.status(200).json({user: user});
  }catch(err){
    console.error(err);
    res.status(500).json("Something went wrong");
  }
}

const getUsers = async (req, res) => {
  const users = await findUsers();
  res.status(201).json({users: users});
}

const delUser = async (req, res) => {
  if (req.params.id == req.user.id){
    await deleteUser(req.params.id);
    res.status(200).json("deleted");
  }else{
    res.status(401).json("Unauthorised")
  }
}

const followUser = async (req, res) => {
  if (req.params.id != req.user.id){
    const followsAlready = await existingFollow(req.user.id, req.params.id);
    if (followsAlready) res.status(400).json("already following")
      
    await userFollow(req.user.id, req.params.id);
    res.status(201).json("followed successfully")
  }else{
    res.status(400).json("cant follow yourself")
  }
  
}


module.exports = {
  editUser,
  getUser,
  getUsers,
  delUser,
  followUser
}