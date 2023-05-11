const Notification = require("../models/NotificationModel");
    
exports.CreateNotification = async(data)=>{
    try {
    const {notifiableId,notificationType,title,body,payload} = data

    
         const notification  = new Notification({
            notifiableId:notifiableId,
            notificationType:notificationType,
            title:title,
            body:body,
            payload:payload

        })
console.log('notification',notification)
        await notification.save()
    }catch (error) {
        console.log(error)
    }

}
