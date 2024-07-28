const { Router } = require("express");
const { auth } = require('../middleware/auth');
const { userSignup, userLogin, userLogout } = require('../controllers/userAuthController')



const userRouter = Router();


userRouter.post("/signup", userSignup)
userRouter.post("/login", userLogin)
userRouter.get("/logout", auth, userLogout)


module.exports = userRouter;