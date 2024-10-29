const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Import multer
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors({
    origin: ['http://127.0.0.1:5501', 'http://localhost:5501'],
    credentials: true
}));

const upload = multer(); // Initialize multer

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Use EMAIL_USER from .env
        pass: process.env.EMAIL_PASS,   // Use EMAIL_PASS from .env
    },
});

// Endpoint to handle form submission
app.post('/send-email', upload.none(), (req, res) => { // Use multer here
    console.log('Incoming request data:', req.body); // Log incoming data

    const { experience, date, attendees, name, email, phone, comments } = req.body;

    // Check for required fields
    if (!email) {
        return res.status(400).send({ message: 'Email is required.' });
    }

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Use EMAIL_USER for the sender's address
        to: `${email}, ${process.env.EMAIL_USER}`, // Send confirmation to the customer's email
        subject: 'Reservation Confirmation',
        text: `Hello ${name},\n\nThank you for your reservation!\n\n` +
        `Here are your reservation details:\n` +
        `----------------------------------------\n` +
        `| Field                 | Information     |\n` +
        `----------------------------------------\n` +
        `| Experience            | ${experience}   |\n` +
        `| Date                  | ${date}        |\n` +
        `| Number of Attendees   | ${attendees}   |\n` +
        `| Phone                 | ${phone}       |\n` +
        `| Comments              | ${comments}    |\n` +
        `----------------------------------------\n` +
        `We will contact you soon.\n\n` +
        `Best regards,\n` +
        `Suhaila Cooking Experience`,
    };

    console.log('Preparing to send email...');
    
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        console.log('Email sending process initiated.');
        
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send({ message: 'Error sending email.' });
        }
        
        console.log('Email sent:', info.response);
        res.status(200).send({ message: 'Reservation confirmed!' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
