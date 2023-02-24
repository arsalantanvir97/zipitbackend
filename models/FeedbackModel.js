const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const FeedbackSchema = new mongoose.Schema(
  {
    Name: { type: String },
    email: { type: String },
    company: { type: String },
    message: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);
FeedbackSchema.plugin(mongoosePaginate);
FeedbackSchema.index({ "$**": "text" });
module.exports = Feedback = mongoose.model("Feedback", FeedbackSchema);
