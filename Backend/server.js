// server.js (ES module syntax)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Replace <db_password> with your actual password in the connection string
const MONGO_URI = 'mongodb+srv://eCellUser:eCell2025@ecell.h6v3ahv.mongodb.net/<dbname>?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schemas & Models

const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  excerpt: String,
  author: String,
  date: String,
  image: String,
  tags: [String],
});

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  time: String,
  location: String,
  image: String,
  category: String,
  registrationOpen: Boolean,
});

const teamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String,
  bio: String,
  linkedin: String,
  twitter: String,
  email: String,
  team: String,
});
// Add at top with other schemas
const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  submittedAt: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const Event = mongoose.model('Event', eventSchema);
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
const Contact = mongoose.model('Contact', contactSchema);

// REST API Routes

// BlogPosts
app.get('/api/blogposts', async (req, res) => {
  const posts = await BlogPost.find().sort({ date: -1 });
  res.json(posts);
});

app.post('/api/blogposts', async (req, res) => {
  const post = new BlogPost(req.body);
  await post.save();
  res.status(201).json(post);
});

app.put('/api/blogposts/:id', async (req, res) => {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
});

app.delete('/api/blogposts/:id', async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.json({ message: 'BlogPost deleted' });
});

// Events
app.get('/api/events', async (req, res) => {
  const events = await Event.find().sort({ date: -1 });
  res.json(events);
});

app.post('/api/events', async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.status(201).json(event);
});

app.put('/api/events/:id', async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(event);
});

app.delete('/api/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Event deleted' });
});

// TeamMembers
app.get('/api/team', async (req, res) => {
  const team = await TeamMember.find();
  res.json(team);
});

app.post('/api/team', async (req, res) => {
  const member = new TeamMember(req.body);
  await member.save();
  res.status(201).json(member);
});

app.put('/api/team/:id', async (req, res) => {
  const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(member);
});

app.delete('/api/team/:id', async (req, res) => {
  await TeamMember.findByIdAndDelete(req.params.id);
  res.json({ message: 'Team member deleted' });
});

app.get('/api/contacts', async (req, res) => {
  const contacts = await Contact.find().sort({ submittedAt: -1 });
  res.json(contacts);
});

// Submit a contact form
app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
