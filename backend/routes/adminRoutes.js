const { Router } = require("express");
const { adminAuth } = require("../middleware/auth");
const { getUserList, editUser, deleteUser, cardDetails } = require("../controllers/adminAuthController");



const adminRouter = Router();


adminRouter.post("/getuserlist", adminAuth, getUserList);
adminRouter.post("/edituser/:id", adminAuth, editUser);
adminRouter.get("/deleteuser/:id", adminAuth, deleteUser);
adminRouter.get("/carddetails", adminAuth, cardDetails);


module.exports = adminRouter;