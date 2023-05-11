const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");
const bcrypt= require("bcryptjs")

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String
    },
    phone: {
      type: String
    },
    expiryDate: { type: Date },
    paymentResult: { type: Object },
    status: { type: Boolean, default: true },

    subscriptionid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package"
    },
    subscription: { type: Object, default: null },
    is_recurring: { type: Boolean },
  },
  {
    timestamps: true
  }
);
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.plugin(mongoosePaginate);
UserSchema.index({ "$**": "text" });


module.exports = User = mongoose.model("User", UserSchema);
