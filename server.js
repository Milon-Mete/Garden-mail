const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// ✅ Create Schema & Model (inline)
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: { createdAt: 'Send_at'} }
);

const Contact = mongoose.model('Contact', contactSchema);

// ✅ Route to handle form submission
app.post('/getmail', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    console.log('✅ New contact saved:', newContact);

    res.status(201).json({ success: true, message: 'Message saved successfully!' });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({ success: false, message: 'Failed to save message' });
  }
});

// ✅ Optional: View all messages (for testing/admin)
app.get('/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// ✅ Start server
app.listen(8000, () => {
  console.log('🚀 Server is running on: http://localhost:8000');
});
