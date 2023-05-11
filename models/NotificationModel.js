const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const NotificationSchema = new mongoose.Schema(
    {
        notifiableId: {
            type: String,

        },
        notificationType: {
            type: String,
            // required:true
        }
        ,
        title: {
            type: String,
            required: [true, 'Notfication Title']
        },
        body: {
            type: String,
            required: [true, 'Notification Message']
        },

        date: {
            type: Date,
            default: Date.now,
        },
        isread: {
            type: Boolean,
            default: false
            //TODO may have to require later when listener is added to pouchdb
        },
        payload: {
            type: {
                type: String
            },
            id: {
                type: String
            }
        },

    },
    { timestamps: true }
);
NotificationSchema.plugin(mongoosePaginate);
NotificationSchema.index({ "$**": "text" });
module.exports = Notification = mongoose.model("Notification", NotificationSchema);
