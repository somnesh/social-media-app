const resetEmailTemplate = require("./resetEmailTemplate");
const sendEmail = require("./sendEmail");

const sendResetEmail = async ({ name, email, resetToken, origin }) => {
  const verifyEmail = `${origin}/auth/user/reset-password?token=${resetToken}&email=${email}`;
  const message = resetEmailTemplate(verifyEmail, name);

  return sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: message,
  });
};

module.exports = sendResetEmail;
