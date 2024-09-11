const sendEmail = require("./sendEmail");
const verificationEmailTemplate = require("./verificationEmailTemplate");

const sendVerificationEmail = async ({ name, email, refreshToken, origin }) => {
  const verifyEmail = `${origin}auth/user/verify-email?token=${refreshToken}&email=${email}`;
  const message = verificationEmailTemplate(verifyEmail, name);

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: message,
  });
};

module.exports = sendVerificationEmail;
