// const nodemailer = require("nodemailer");

// const sendSubscriptionEmail = async (toEmail, userName) => {
//   try {
//     // use this when using the rene paid service

//     // const transporter = nodemailer.createTransport({
//     //   service: "gmail",
//     //   auth: {
//     //     user: process.env.EMAIL_USER,      // your email
//     //     pass: process.env.EMAIL_PASS,      // app password
//     //   },
//     // });
//     // fore rene free service, this configuration works
// const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,            // VERY IMPORTANT
//       secure: false,        // false for 587
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

// const mailOptions = {
//   from: `"IET Placement Tracker" <${process.env.EMAIL_USER}>`,
//   to: toEmail,
//   subject: "Consultation Booking Confirmed – IET Placement Tracker",

//   html: `
//     <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      
//       <h2>Hi ${userName},</h2>

//       <p>Thank you for booking your <strong>1-on-1 consultation</strong> with IET Placement Tracker 🎯</p>

//       <p>
//         We have received your request and are currently sharing your details with our seniors.
//       </p>

//       <p>
//         We will get back to you soon with the available time slots and meeting link on this email ID.
//       </p>

//       <p>
//         📌 This consultation is only to solve your placement-related doubts.
//       </p>

//       <p>
//         If you have any urgent queries, feel free to reach out at 
//         <strong>ietplacementtracker@gmail.com</strong>
//       </p>

//       <br/>

//       <p>Looking forward to helping you 🚀</p>

//       <p>
//         Best regards,<br/>
//         <strong>Team IET Placement Tracker</strong>
//       </p>

//       <hr/>

//     </div>
//   `,
// };

//     await transporter.sendMail(mailOptions);

//     console.log("Email sent successfully");
//   } catch (error) {
//     console.error("Email error:", error);
//   }
// };

// module.exports = sendSubscriptionEmail;



const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendSubscriptionEmail = async (toEmail, userName) => {
  try {
    await resend.emails.send({
      from: "IET Placement Tracker <onboarding@resend.dev>",
      to: toEmail,
      subject: "Consultation Booking Confirmed – IET Placement Tracker",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          
          <h2>Hi ${userName},</h2>

          <p>Thank you for booking your <strong>1-on-1 consultation</strong> with IET Placement Tracker 🎯</p>

          <p>
            We have received your request and are currently sharing your details with our seniors.
          </p>

          <p>
            We will get back to you soon with the available time slots and meeting link on this email ID.
          </p>

          <p>
            📌 This consultation is only to solve your placement-related doubts.
          </p>

          <p>
            If you have any urgent queries, feel free to reach out at 
            <strong>ietplacementtracker@gmail.com</strong>
          </p>

          <br/>

          <p>Looking forward to helping you 🚀</p>

          <p>
            Best regards,<br/>
            <strong>Team IET Placement Tracker</strong>
          </p>

          <hr/>

        </div>
      `,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email error:", error);
  }
};

module.exports = sendSubscriptionEmail;