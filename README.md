# 💪 Fitness Tracker App

A modern, user-friendly fitness activity tracker that helps you monitor daily fitness activities including steps, workouts, calories burned, and more.

## ✨ Features

### 📊 Dashboard
- **Daily Progress Summary**: Track steps, calories burned, workout duration, and activity count
- **Real-time Progress Bars**: Visual representation of goal progress
- **Weekly Analytics**: Charts showing calorie trends and activity distribution
- **Today's Activities**: Quick view of all logged activities for the day

### ➕ Activity Logging
- **Multiple Activity Types**: Running, Walking, Cycling, Gym Workouts, Yoga, Swimming, Sports, and more
- **Comprehensive Data Entry**: Log duration, calories, steps, distance, and notes
- **Date Selection**: Log activities for any date, past or present
- **Quick Logging**: Simple and intuitive form interface

### 📋 History & Analytics
- **Activity History**: View all logged activities with sorting and filtering
- **Date Range Filtering**: Filter activities by specific date ranges
- **Detailed Activity View**: See complete information for each activity
- **Data Export**: Export your fitness data as JSON for backup

### ⚙️ Settings & Customization
- **Custom Goals**: Set personalized daily goals for steps and calories
- **User Profile**: Store personal information (name, height, weight)
- **Data Management**: Clear all data or export for backup
- **Persistent Storage**: All data saved locally using browser storage

## 🎨 User Interface

- **Clean & Modern Design**: Responsive layout that works on desktop, tablet, and mobile
- **Dark Mode Support**: Easy on the eyes with a light, professional color scheme
- **Intuitive Navigation**: Sidebar navigation with easy tab switching
- **Visual Feedback**: Toast notifications for user actions
- **Emoji Icons**: Fun and recognizable icons for different activity types

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No framework dependencies
- **Chart.js**: Beautiful data visualization
- **LocalStorage API**: Client-side data persistence

### Backend (Optional)
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Firebase**: Cloud database and authentication (optional)
- **CORS**: Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/paripalliakhila22-collab/codeAlpha_taska-2.git
   cd codeAlpha_taska-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables** (optional for Firebase)
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:5000`

5. **For development with auto-reload**
   ```bash
   npm run dev
   ```

## 📖 Usage Guide

### Logging Your First Activity

1. Click on **"➕ Log Activity"** tab
2. Select an activity type from the dropdown
3. Choose the date (defaults to today)
4. Enter duration (minutes) and calories burned
5. Optionally add distance, steps, and notes
6. Click **"Log Activity"** button

### Viewing Your Progress

1. Go to the **"📊 Dashboard"** tab
2. Select a date using the date picker to view specific day's data
3. See your progress bars and daily statistics
4. Check the weekly calorie chart and activity distribution

### Filtering History

1. Navigate to **"📋 History"** tab
2. Select start and end dates
3. Click **"Filter"** to see activities within that range
4. Click delete to remove any activity

### Customizing Goals

1. Go to **"⚙️ Settings"** tab
2. Adjust daily goals for steps and calories
3. Save your goals
4. Goals will be reflected in the dashboard progress bars

## 💾 Data Storage

### Local Storage Mode (Default)
- All data is stored in your browser's local storage
- Data persists across browser sessions
- No server required
- Perfect for personal use

### Firebase Mode (Optional)
- Setup Firebase credentials in `.env` file
- Data synced to cloud
- Access your data from any device
- Automatic backups

## 📊 Sample Data Structure

```json
{
  "userId": "user_1234567890",
  "activities": [
    {
      "id": "activity_1234567890",
      "type": "running",
      "date": "2024-01-15T07:30:00.000Z",
      "duration": 30,
      "calories": 300,
      "steps": 5000,
      "distance": 5.2,
      "notes": "Morning run in the park"
    }
  ],
  "goals": {
    "steps": 10000,
    "calories": 500
  },
  "userInfo": {
    "name": "John Doe",
    "height": 180,
    "weight": 75
  }
}
```

## 🎯 Activity Types

- 🏃 Running
- 🚶 Walking
- 🚴 Cycling
- 🏋️ Gym Workout
- 🧘 Yoga
- 🏊 Swimming
- ⚽ Sports
- 👟 Steps
- 📝 Other

## 📱 Responsive Design

The app is fully responsive and optimized for:
- 💻 Desktop (1200px and above)
- 📱 Tablet (768px - 1199px)
- 📱 Mobile (below 768px)

## 🔄 API Endpoints (Backend)

### POST /api/activities
Log a new fitness activity

**Request Body:**
```json
{
  "userId": "user_123",
  "type": "running",
  "duration": 30,
  "calories": 300,
  "date": "2024-01-15",
  "notes": "Morning run"
}
```

### GET /api/activities/:userId
Get user's activities with optional date filtering

**Query Parameters:**
- `startDate`: Filter from date (ISO format)
- `endDate`: Filter to date (ISO format)

### GET /api/summary/:userId/:date
Get daily summary for a specific date

### DELETE /api/activities/:activityId
Delete an activity

## 🐛 Troubleshooting

### Activities not saving?
- Check if local storage is enabled in your browser
- Try clearing browser cache
- Ensure you have enough storage space

### Charts not displaying?
- Make sure Chart.js is loaded
- Check browser console for errors
- Try refreshing the page

### Firebase connection issues?
- Verify `.env` file has correct credentials
- Check Firebase project is active
- Ensure security rules allow read/write access

## 🔐 Privacy & Security

- All data is stored locally by default
- No data is sent to external servers unless you configure Firebase
- Your activity data remains completely private
- You can export and delete all data anytime

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests with:
- Bug fixes
- New features
- UI improvements
- Documentation updates

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Created by [@paripalliakhila22-collab](https://github.com/paripalliakhila22-collab)

## 🙏 Acknowledgments

- Chart.js for beautiful charts
- Firebase for cloud database support
- All contributors and users who have provided feedback

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section

---

**Stay fit, track your progress! 💪**
