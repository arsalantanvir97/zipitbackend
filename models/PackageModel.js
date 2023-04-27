const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const PackageSchema = new mongoose.Schema(
  {
    packagename: { type: String,},
    duration: { type: Number,},
  details: { type: String },
  amount: { type: Number,},
  },
  { timestamps: true }
);
PackageSchema.plugin(mongoosePaginate);
PackageSchema.index({ "$**": "text" });
module.exports = Package = mongoose.model("Package", PackageSchema);
