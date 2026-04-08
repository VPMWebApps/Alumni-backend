// services/mail.service.js
const { sendMail } = require("./Mailer");

const sendEventConfirmationMail = async ({
  email,
  name,
  eventId,
}) => {
  await sendMail({
    to: email,
    subject: "Event Registration Confirmed",
    html: `
      <p>Hi ${name || "there"},</p>
      <p>Your registration for the event is confirmed.</p>
      <p><strong>Event ID:</strong> ${eventId}</p>
      <p>We’ll remind you on the day of the event.</p>
    `,
  });
};

module.exports = {sendEventConfirmationMail};
