const Feedback = require("../models/FeedbackModel");
const generateEmail = require("../services/generateEmail");
const createFeedback = async (req, res) => {
  console.log("recoverPassword");
  const { Name, email, company, message, phone } = req.body;
  try {
    const feedback = new Feedback({
      Name,
      email,
      company,
      message,
      phone,
    });
    console.log("feedback", feedback);
    const feedbackcreated = await feedback.save();
    console.log("FeedbackCreated", feedbackcreated);
    const html = `<p>${Name} with phone: ${phone} from mail: ${email} sent you the following message.
      \n\n ${message}      
            </p>`;
    await generateEmail("info@zipitsolar.com", "ZipIt - Contact Us", html);
    return res.status(201).json({
      message: "Message sent successfully to Zipit",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.toString(),
    });
  }
};

module.exports = {
  createFeedback,
};
