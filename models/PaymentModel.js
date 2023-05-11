const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const PaymentSchema = new mongoose.Schema(
  {
    amount:{type:Number},
    subscriptionid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package"
      },
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
  },
  { timestamps: true }
);
PaymentSchema.plugin(mongoosePaginate);
PaymentSchema.index({ "$**": "text" });
module.exports = Payment = mongoose.model("Payment", PaymentSchema);
