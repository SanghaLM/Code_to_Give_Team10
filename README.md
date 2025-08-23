# ReachOut - Morgan Stanley Asia Code to Give Hackathon 2025

**A mobile-first platform centralizing parent engagement for Hong Kong kindergarten education**

## 🎯 Challenge Context

Parents play a critical role in a child's learning journey, but for many families supported by Story Seeds, access to learning resources and guidance is fragmented and inconsistent. Assignments and learning materials are often distributed through printouts or relayed via school teachers, leading to difficulties in finding reliable guidance for engaging children at home. Additionally, there is no digital platform where parents can connect, share concerns, or exchange advice.

## 💡 Our Solution: ReachOut

ReachOut replaces fragmented WhatsApp workflows with a centralized digital platform featuring:

- **Video-based homework submissions** from parents (verbal homework)
- **Staff review and quick feedback** system
- **Teacher weekly performance uploads** for classes/children
- **Gamified points system** with progress tracking (child-friendly approach)
- **Parent forum** for peer support and Q&A (anonymous, kindergarten-labeled)
- **Bilingual UI** (English and Traditional Chinese)

## 🏗️ Architecture Overview

### **Mobile App** (React Native + Expo)
- **Parent**: Upload videos, view portfolio, track progress, read teacher summaries, access resources, participate in forum
- **Teacher**: Manage classes, upload weekly summaries, view submission history
- **Staff**: Review submissions, moderate points, manage resources, moderate forum

### **Backend**
- API for auth, submissions, reviews, points, progress tracking, resources, forum
- Real-time updates for feedback and progress
- Local storage for video files (hackathon deployment)

## 👥 Key User Flows

### **Parent**
1. Select child → upload verbal-homework video → add metadata → submit
2. View submission status and staff feedback
3. Track progress and skill development over time
4. Browse resource videos and participate in parent forum

### **Teacher**
1. View classes and rosters
2. Upload weekly performance summaries with rubrics
3. Review past submissions and class progress

### **Staff**
1. Review parent submissions → provide feedback and scoring
2. Monitor teacher submissions and progress data
3. Manage resources and moderate community forum

## 🎮 Gamification & Progress System

Instead of competitive leaderboards, we focus on **individual progress tracking**:
- **Skill level progression** based on consistent practice
- **Achievement milestones** celebrating improvement
- **Peer connection** showing "friends at similar levels" without direct comparison
- **Encouraging feedback** emphasizing personal growth over competition

## 📊 Data Model Overview

### Core Entities
- **User**: Parent, Teacher, Staff roles with kindergarten associations
- **Child**: Student profiles linked to parents and classes
- **Submission**: Parent video uploads with review status
- **Review**: Staff feedback and scoring on submissions
- **TeacherSubmission**: Weekly class/child performance summaries
- **PointsTransaction**: Gamification tracking for engagement
- **ResourceVideo**: Educational content library
- **ForumPost**: Community discussion platform

### Key Features
- **Privacy-first**: Anonymized leaderboards, consent-based uploads
- **Role-based access**: Parents see only their children, teachers see only their classes
- **Bilingual support**: English and Traditional Chinese UI
- **Mobile-optimized**: Designed for Hong Kong families in subdivided flats

## 🛠️ Quick Start

### Backend Setup
```bash
cd backend
npm install
npm install mongoose bcryptjs @faker-js/faker
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
npx expo start
```

## 📱 Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: TBD (Firebase Auth recommended)
- **Storage**: Local (hackathon), Cloud (production)
- **Real-time**: Socket.io or REST polling
- **Internationalization**: i18next

## 🎯 MVP Features

### For Parents
- Video homework submission with metadata
- Progress tracking and skill level visualization
- Staff feedback viewing
- Teacher weekly summary access (read-only)
- Resource video library
- Anonymous community forum participation

### For Teachers
- Class roster management
- Weekly performance upload with rubrics
- Submission history tracking
- Class-level and individual child summaries

### For Staff
- Submission review queue with video playback
- Scoring system (1-5 scale) with tags (Pronunciation, Fluency, Confidence)
- Teacher submission monitoring
- Resource management
- Forum moderation tools

## 🌟 Social Impact

- **Centralized learning support** for Hong Kong kindergarten families
- **Improved parent-teacher communication** and collaboration
- **Child-friendly progress tracking** that builds confidence without harmful competition
- **Community building** among parents facing similar challenges
- **Accessible mobile-first design** for families in subdivided flats
- **Bilingual accessibility** for diverse Hong Kong families

## 🚀 Future Roadmap

- Integration with existing REACH student app
- Cloud storage and enhanced security
- Advanced analytics dashboards for kindergartens
- Expanded community features and teacher recognition
- Configurable rubrics and assessment tools

## 🏆 Hackathon Alignment

- **Relevance**: Directly addresses fragmented parent engagement in Hong Kong kindergarten education
- **Effectiveness**: Simple, mobile-first solution with clear user flows
- **Technical Design**: Scalable architecture with role-based access and real-time features
- **Innovation**: Child-friendly gamification and anonymous community building
- **Social Impact**: Targets real constraints of Hong Kong families while improving educational outcomes

---

*Built for Morgan Stanley Asia Code to Give Hackathon 2025 - Team 10*