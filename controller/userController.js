const User = require("../models/UserModel");
const Admin = require("../models/AdminModel");

const Reset = require("../models/ResetModel");
const Package = require("../models/PackageModel");

const {
    createResetToken,
    validateEmail,
    generateCode,
    validateCode,
    comparePassword,
    verifyPassword,
    generateHash,
    generateToken
  } = require("../queries/index");
const generatemail = require("../services/generateEmail");
  
const registerUser = async (req, res) => {
    const { firstName,phone,
        lastName, confirmpassword, email, password } = req.body;
    console.log("req.body", req.body);
    if (!comparePassword(password, confirmpassword))
      return res.status(401).json({ error: "Password does not match" });
    const UserExists = await User.findOne({ email });
  
    if (UserExists) {
      return res.status(401).json({
        error: "User already exist"
      });
    }
  
    const user = await User.create({
      firstName,
        lastName,
      password,
      email,
      phone,
    });
    console.log("user", user);
    if (user) {
  
      // const notification = {
      //   notifiableId: null,
      //   notificationType: "User",
      //   title: `${type} Created`,
      //   body: `A ${type} name ${username} has registered`,
      //   payload: {
      //     type: "USER",
      //     id: user._id
      //   }
      // };
      // CreateNotification(notification);
      await user.save();
      await res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone:user.phone,
        subscription:user.subscription,

        token: generateToken(user._id),
        message: "Successfully created user!"
      });
    } else {
      return res.status(401).json({
        error: "false"
      });
    }
  };

  const registerAdmin = async (req, res) => {
    const { firstName,
      lastName,
      email,
      password } = req.body;
    console.log("req.body", req.body);
    const AdminExists = await Admin.findOne({ email });
  
    if (AdminExists) {
      return res.status(401).json({
        error: "Admin already exist"
      });
    }
  
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password
    });
    console.log("admin", admin);
    if (admin) {
  
      // const notification = {
      //   notifiableId: null,
      //   notificationType: "admin",
      //   title: `${type} Created`,
      //   body: `A ${type} name ${adminname} has registered`,
      //   payload: {
      //     type: "admin",
      //     id: admin._id
      //   }
      // };
      // CreateNotification(notification);
      await admin.save();
      await res.status(201).json({
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,

        token: generateToken(admin._id),
        message: "Successfully created Admin!"
      });
    } else {
      return res.status(401).json({
        error: "false"
      });
    }
  };
  
  const authUser = (async (req, res) => {
    console.log("authAdmin", req.body);
    const { email, password,  } = req.body;
  
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      await res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        expiryDate:user.expiryDate,
        paymentResult:user.paymentResult,
        phone:user.phone,
        status:user.status,
        subscriptionid:user.subscriptionid,
        subscription:user.subscription,
        is_recurring:user.is_recurring,
        token: generateToken(user._id),
      });
    } else {
      console.log("error");
      return res.status(201).json({
        message: "Invalid Email or Password"
      });
    }
  });
  const authAdmin = (async (req, res) => {
    console.log("authAdmin", req.body);
    const { email, password,  } = req.body;
  
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      await res.status(200).json({
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        userImage: admin.userImage,

        token: generateToken(admin._id),
      });
    } else {
      console.log("error");
      return res.status(201).json({
        message: "Invalid Email or Password"
      });
    }
  });
  const recoverPassword = async (req, res) => {
    console.log("recoverPassword");
    const { email } = req.body;
    console.log("req.body", req.body);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("!user");
      return res.status(401).json({
        message: "Invalid Email or Password"
      });
    } else {
      const status = generateCode();
      await createResetToken(email, status);
  
      const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
            \n\n Your verification status is ${status}:\n\n
            \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
            </p>`;
      await generatemail(email, "Zip IT Solar - Password Reset", html);
      return res.status(201).json({
        message:
          "Recovery status Has Been Emailed To Your Registered Email Address"
      });
    }
  };
  const verifyRecoverCode = async (req, res) => {
    const { code, email } = req.body;
    console.log("req.body", req.body);
    const reset = await Reset.findOne({ email, code });
  
    if (reset)
      return res.status(200).json({ message: "Recovery status Accepted" });
    else {
      return res.status(400).json({ message: "Invalid Code" });
    }
    // console.log("reset", reset);
  };
  const resetPassword = async (req, res) => {
    try {
      console.log("reset");
  
      const { password, confirm_password, code, email } = req.body;
      console.log("req.body", req.body);
      if (!comparePassword(password, confirm_password))
        return res.status(400).json({ message: "Password does not match" });
      const reset = await Reset.findOne({ email, code });
      console.log("reset", reset);
      if (!reset)
        return res.status(400).json({ message: "Invalid Recovery status" });
      else {
        console.log("resetexist");
        const user = await User.findOne({ email });
        user.password = password;
        await user.save();
        console.log("user", user);
        res.status(201).json({
          _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone:user.phone,

        email: user.email,
        expiryDate:user.expiryDate,
        paymentResult:user.paymentResult,
        status:user.status,
        subscriptionid:user.subscriptionid,
        subscription:user,subscription,
        is_recurring:user.is_recurring,
        token: generateToken(user._id),
        });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(400).json({ message: error.toString() });
    }
  
    // return updatedadmin
    // await res.status(201).json({
    //   message: "Password Updated",
    // });
  };
  const createSubscription = async (req, res) => {
    const { packagename,
      duration,
      details,
      amount } = req.body;
    console.log("req.bodycreateSubscription", req.body);
    try {
      const package = new Package({
        packagename,
        duration,
        details,
        amount
      });
      console.log("package", package);
      //   const feedbackcreated = await Feedback.create(
      //     feedback
      //   );
      //   console.log('feedbackcreated',feedbackcreated)
      const packagee = await package.save();
      console.log("allOfSubscriptions", packagee);
      if (packagee) {
        res.status(201).json({
          packagee
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  const getPackages = async (req, res) => {
    try {

        const packages = await Package.find(
          
        );
        res.status(201).json({
          packages
        });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  const userbuysubscription = async (req, res) => {
    const {
      packagee,
      card_holder_name,
      card_number,
      userid,
    } = req.body;
    console.log('packagee',packagee)
    try {
      var now = new Date();
      const user = await User.findById({ _id: userid });
      const subscriptionn = await Package.findOne({ _id: packagee._id });
      console.log("user", user);
      user.subscriptionid = packagee._id;
      user.subscription = subscriptionn;
      user.paymentResult = {
        card_holder_name,
        card_number,
      };
      user.expiryDate = new Date(
        now.setDate(now.getDate() + subscriptionn.duration)
      );
  
      const updateduser = await user.save();
  
      console.log("paymentOfSubscription");
      await res.status(201).json({
          _id: updateduser._id,
          firstName: updateduser.firstName,
          lastName: updateduser.lastName,
          email: updateduser.email,
          expiryDate:updateduser.expiryDate,
          paymentResult:updateduser.paymentResult,
          phone:updateduser.phone,
          status:updateduser.status,
          subscriptionid:updateduser.subscriptionid,
          subscription:updateduser.subscription,
          is_recurring:updateduser.is_recurring,
          token: generateToken(updateduser._id),
      });
    } catch (err) {
      console.log("error", err);
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  const packageDeail = async (req, res) => {
    try {

        const package = await Package.findById(
          req.params.id
        );
        res.status(201).json({
          package
        });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  const editAdminProfile = (async (req, res) => {
    try {
      const { firstName, lastName } = req.body;
      let user_image =
        req.files &&
        req.files.user_image &&
        req.files.user_image[0] &&
        req.files.user_image[0].path;
    console.log('user_image',user_image,req.body)

      const admin = await Admin.findOne();
      console.log('admin',admin)
      admin.firstName = firstName ? firstName : admin.firstName;
      admin.lastName = lastName ? lastName : admin.lastName;
      admin.userImage = user_image ? user_image : admin.userImage;
    
      await admin.save();
      // await res.status(201).json({
      //   message: "Admin Update",
      //   admin,
      // });
      await res.status(201).json({
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        userImage: admin.userImage,
        token: generateToken(admin._id)
      });
    } catch (error) {
      res.status(500).json({
        message: error.toString()
      });
    }
  
  });
  module.exports = {packageDeail,
    registerUser,userbuysubscription,
authUser,
recoverPassword,
editAdminProfile,
verifyRecoverCode,
resetPassword,
registerAdmin,
authAdmin,
createSubscription,getPackages,

  };
  