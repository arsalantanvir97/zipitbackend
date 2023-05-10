


const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
router.post("/register", userController.registerUser);
router.post("/registerAdmin", userController.registerAdmin);

router.post("/authUser", userController.authUser);
router.post("/authAdmin", userController.authAdmin);

router.post("/editAdminProfile", userController.editAdminProfile);

router.post("/userverifyRecoverCode", userController.verifyRecoverCode);
router.post("/userRecoverPassword", userController.recoverPassword);
router.post("/userresetPassword", userController.resetPassword);
router.post("/createSubscription", userController.createSubscription);
router.get("/getPackages", userController.getPackages);
router.post("/userbuysubscription", userController.userbuysubscription);

router.get("/packageDeail/:id", userController.packageDeail);


module.exports = router;
