const { StatusCodes } = require("http-status-codes");
const Notification = require("../models/Notification");
const { userSocketMap } = require("../services/socket");

const sendNotification = async (
  io,
  sender_id,
  receiver_Id,
  link,
  notificationMessage,
  session
) => {
  console.log(sender_id, " | ", receiver_Id, " | ", link);

  if (sender_id._id.toString() !== receiver_Id) {
    const notificationDetails = await Notification.create(
      [
        {
          sender: sender_id._id,
          receiver_Id: receiver_Id,
          link: link,
          message: notificationMessage,
        },
      ],
      { session }
    );
    console.log(notificationDetails);

    const socketId = userSocketMap[receiver_Id];

    if (socketId) {
      const message = {
        _id: notificationDetails[0]._id,
        sender: sender_id,
        link: link,
        message: notificationMessage,
      };
      io.to(socketId).emit("receiveNotification", { message });
    }

    return notificationDetails[0];
  }
};

const getNotifications = async (req, res) => {
  const userId = req.user;
  // console.log(userId);

  const notificationDetails = await Notification.find({
    receiver_Id: userId,
  })
    .populate({ path: "sender", select: "name avatar avatarBg" })
    .sort({ createdAt: -1 });
  console.log("nicely done");

  res.status(StatusCodes.OK).json({ notificationDetails });
};
module.exports = { sendNotification, getNotifications };
