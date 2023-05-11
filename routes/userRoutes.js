


const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
router.post("/register", userController.registerUser);
router.post("/registerAdmin", userController.registerAdmin);

router.post("/authUser", userController.authUser);
router.post("/authAdmin", userController.authAdmin);
router.post("/verifyAndREsetPassword", userController.verifyAndREsetPassword);


router.post("/editAdminProfile", userController.editAdminProfile);

router.post("/userverifyRecoverCode", userController.verifyRecoverCode);
router.post("/adminverifyRecoverCode", userController.adminverifyRecoverCode);

router.post("/userRecoverPassword", userController.recoverPassword);
router.post("/adminRecoverPassword", userController.adminRecoverPassword);

router.post("/userresetPassword", userController.resetPassword);
router.post("/adminresetPassword", userController.adminresetPassword);

router.post("/createSubscription", userController.createSubscription);
router.get("/getPackages", userController.getPackages);
router.get("/logs", userController.logs);
router.get("/paymentlogs", userController.paymentlogs);
router.get("/getCountofallCollection", userController.getCountofallCollection);


router.post("/userbuysubscription", userController.userbuysubscription);
router.post("/editPackage", userController.editPackage);

router.get("/packageDeail/:id", userController.packageDeail);
router.get("/getUserDetails/:id", userController.getUserDetails);
router.get("/toggle-active/:id",userController.toggleActiveStatus);
router.get("/deletePackage/:id",userController.deletePackage);
router.get("/notificationlogs",userController.notificationlogs);


module.exports = router;
