const { updateUserById, findUser, findUsers, deleteUser, userFollow, existingFollow, findFollowers, userUnfollow, findFollowing, findUserName} = require("../helpers/queries");

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

const searchUser = async (req, res) => {
  try{
    const users = await findUserName(req.query.name);
    if (users.length == 0) return res.status(404).json([])
    res.status(200).json(users);
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
  const user = await findUser(req.params.id);
  if (!user) return res.status(404).json("User Does Not Exist")

  if (req.params.id != req.user.id){
    const followsAlready = await existingFollow(req.user.id, req.params.id);
    if (followsAlready) return res.status(400).json("already following")
      
    await userFollow(req.user.id, req.params.id);
    res.status(201).json("followed successfully")
  }else{
    res.status(400).json("cant follow yourself")
  }
}

const checkFollow = async (req, res) => {
  const user = await findUser(req.params.id);
  if (!user) return res.status(404).json("User Does Not Exist")

  if (req.params.id != req.user.id){
    const followsAlready = await existingFollow(req.user.id, req.params.id);
    if (followsAlready) {
      res.status(201).json(true);
    }else{
      res.status(201).json(false);
    }
    
  }else{
    res.status(400).json("cant follow yourself")
  }
}

const unfollowUser = async (req, res) => {
  const user = await findUser(req.params.id);
  if (!user) return res.status(404).json("User Does Not Exist")

  if (req.params.id != req.user.id){
    const followsAlready = await existingFollow(req.user.id, req.params.id);
    if (!followsAlready) return res.status(400).json("Not currently Following");
    await userUnfollow(req.user.id, req.params.id)
    res.status(200).json("unfollowed successfully")
  }else{
    res.status(400).json("cant unfollow yourself")
  }
}

const getFollowers = async (req, res) => {
  const user = await findUser(req.params.id);
  if (!user) return res.status(404).json("User Does Not Exist")
  const followers =  await findFollowers(req.params.id);
  res.status(200).json({followers: followers})
}

const getFollowing = async (req, res) => {
  const user = await findUser(req.params.id);
  if (!user) return res.status(404).json("User Does Not Exist");
  const following =  await findFollowing(req.params.id);
  res.status(200).json({following: following})
}


module.exports = {
  editUser,
  getUser,
  getUsers,
  delUser,
  followUser,
  getFollowers,
  unfollowUser,
  getFollowing,
  checkFollow,
  searchUser
}