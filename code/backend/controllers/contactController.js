const { sendContactEmail } = require("../services/emailService");

const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const success = await sendContactEmail(name, email, subject, message);

        if (success) {
            return res.status(200).json({ message: "Message sent successfully" });
        } else {
            return res.status(500).json({ message: "Failed to send message. Please try again later." });
        }
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ message: "Server error handling contact form" });
    }
};

module.exports = { submitContactForm };
