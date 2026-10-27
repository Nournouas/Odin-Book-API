const { updateUserById, findUser } = require("../helpers/queries");

const editUser = async (req, res) => {
  if (req.params.id == req.user.id && req.body.name && req.body.bio){
    await updateUserById(req.user.id, req.body.name, req.body.bio)
    res.status(201).json("edited")
  }else{
    res.status(401).json("Wrong User")
  }
};

const getUser = async (req, res) => {
  try{
    const user = await findUser(req.params.id);
    res.status(201).json({user: user})
  }catch(err){
    console.error(err);
    res.status(404).json("user doesnt exist!");
  }

}

module.exports = {
  editUser,
  getUser,
}