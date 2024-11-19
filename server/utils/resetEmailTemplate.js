const resetEmailTemplate = (link, name) => `<p>Hello ${name},</p>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <a href="${link}" target="_blank">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thanks,</p>
      <p>Connectify Team</p>
    `;

module.exports = resetEmailTemplate;
