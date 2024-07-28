const { Router } = require("express");
const { auth } = require("../middleware/auth");
const { 
    userSignup, userLogin, userLogout,
    getUserList, editUser, deleteUser, 
    cardDetails, graphData
} = require("../controllers/userController");



const userRouter = Router();


/* Auth */
userRouter.post("/signup", userSignup)
userRouter.post("/login", userLogin)
userRouter.get("/logout", auth, userLogout)

/* User */
userRouter.post("/getuserlist", auth, getUserList);
userRouter.post("/edituser/:id", auth, editUser);
userRouter.get("/deleteuser/:id", auth, deleteUser);

/* Dashboard */
userRouter.get("/carddetails", auth, cardDetails);
userRouter.post("/getgraphdata", auth, graphData);



module.exports = userRouter;