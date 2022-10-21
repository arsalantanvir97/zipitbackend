const Feedback = require("../models/FeedbackModel");
const generateEmail = require("../services/generateEmail");

const createFeedback = async (req, res) => {
  console.log("recoverPassword");
  const { Name, email, company, message } = req.body;
  const data = req.body;
  const feedback = new Feedback(data);
  console.log("feedback", feedback);
  const feedbackcreated = await feedback.save();
  console.log("FeedbackCreated", feedbackcreated);
  const html = `<p>${Name} from mail: ${email} sent you the following message.
    \n\n ${message}      
          </p>`;
  await generateEmail("Zipitsolar@gmail.com", "ZipIt - Contact Us", html);

  return res.status(201).json({
    message: "Message sent successfully to Zipit",
  });
};

module.exports = {
  createFeedback,
};
