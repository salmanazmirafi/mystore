const express =  require("express");
const { 
    createUser,
    getAllUsers, 
    deleteUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword, 
    getUserById, 
    getLoginUserDetails,
    updateUser} = require("../controllers/usersController");
const checkLogin = require("../middleware/checkLogin");
const router  = express.Router();


// users routes
router.get("/users/all",checkLogin, getAllUsers);
router.post("/users/signup", createUser);
router.get("/users/one/:id",checkLogin, getUserById);
router.post("/users/update/one/:id",checkLogin, updateUser);
router.delete("/users/delete/:id",checkLogin, deleteUser);
router.post("/users/login", loginUser);
router.get("/users/me",checkLogin, getLoginUserDetails);
router.post("/users/password/forgot",forgotPassword);
router.post("/users/password/reset/:id", resetPassword);
router.get("/users/logout", logoutUser);


//export default
module.exports = router;