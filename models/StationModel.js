const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const StationSchema = new mongoose.Schema(
  {
    StationName: { type: String },
    StreetAddress: { type: String },
    City: { type: String },
    State: { type: String },
    ZIP: { type: String },
  },
  { timestamps: true }
);
StationSchema.plugin(mongoosePaginate);
StationSchema.index({ "$**": "text" });
module.exports = Station = mongoose.model("Station", StationSchema);
