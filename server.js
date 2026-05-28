import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Firebase Initialization
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase initialized successfully');
} catch (error) {
  console.log('Firebase not configured. Using local storage mode.');
}

const db = admin.firestore();

// Routes

// Add fitness activity
app.post('/api/activities', async (req, res) => {
  try {
    const { userId, type, duration, calories, date, notes } = req.body;
    
    const activity = {
      userId,
      type,
      duration,
      calories,
      date: new Date(date),
      notes,
      createdAt: new Date(),
    };

    const docRef = await db.collection('activities').add(activity);
    res.status(201).json({ id: docRef.id, ...activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's activities
app.get('/api/activities/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    let query = db.collection('activities').where('userId', '==', userId);

    if (startDate) {
      query = query.where('date', '>=', new Date(startDate));
    }
    if (endDate) {
      query = query.where('date', '<=', new Date(endDate));
    }

    const snapshot = await query.orderBy('date', 'desc').get();
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get daily summary
app.get('/api/summary/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const snapshot = await db
      .collection('activities')
      .where('userId', '==', userId)
      .where('date', '>=', startOfDay)
      .where('date', '<=', endOfDay)
      .get();

    const activities = snapshot.docs.map(doc => doc.data());
    const summary = {
      date,
      totalSteps: activities
        .filter(a => a.type === 'steps')
        .reduce((sum, a) => sum + (a.value || 0), 0),
      totalCalories: activities.reduce((sum, a) => sum + (a.calories || 0), 0),
      totalDuration: activities.reduce((sum, a) => sum + (a.duration || 0), 0),
      workoutCount: activities.filter(a => a.type !== 'steps').length,
      activities,
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete activity
app.delete('/api/activities/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;
    await db.collection('activities').doc(activityId).delete();
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
