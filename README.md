# ReachOut - Morgan Stanley Asia Code to Give Hackathon 2025

**A mobile-first platform centralizing parent engagement for Hong Kong kindergarten education**

## 🎯 Issue

Learning materials and children's progress records are scattered across multiple channels. The lack of a centralized digital space for storing and accessing these resources causes parents to become disconnected from their child's educational journey.

Assignments and learning materials are distributed via physical printouts or manual communication by teachers, resulting in an inefficient submission and feedback process. This makes it challenging to track learning progress and build a structured student portfolio.

There is an absence of an effective incentive mechanism to encourage parents and children to consistently and promptly submit homework assignments, making it difficult to boost participation and motivation.

Parents lack a secure digital platform where they can communicate concerns, share experiences, and seek advice. This absence hinders the formation of a supportive peer network, leading to feelings of isolation.

## 💡 Solution

The platform serves as a unified learning center that hosts all learning materials and incorporates gamified elements such as the points-based leaderboard.

Provide a centralized digital space for parents to upload completed assignments (including video and other multimedia formats), automatically building a continuous student growth portfolio.

Introduce a gamified points system where children earn points by submitting homework on time, homework accuracy, learning time, etc.

Create a secure parent community forum that supports anonymous posts and is categorized by class (e.g., kindergarten).

## 🎯 Challenge Context

Parents play a critical role in a child's learning journey, but for many families supported by Story Seeds, access to learning resources and guidance is fragmented and inconsistent. Assignments and learning materials are often distributed through printouts or relayed via school teachers, leading to difficulties in finding reliable guidance for engaging children at home. Additionally, there is no digital platform where parents can connect, share concerns, or exchange advice. Parental engagement is critical to fulfil our mission and ensure proper support for children.

## 🔧 Technical Challenge

Design and develop a centralized, real-time, collaborative digital platform that offers resources and guidance needed for parents to actively participate in their child's educational development. Include these features:

The solution should work like a centralized digital platform to host all learning materials and allow parents to upload completed work, forming a student portfolio to help staff monitor progress, give feedback, and keep parents aligned with the child's learning journey.

Having a gamified point-based system to encourage timely homework uploads by rewarding parents and children. Points will appear on a school-wide leaderboard, promoting friendly competition and recognizing consistent effort with tangible rewards.

## 📱 Overview

ReachOut is a mobile-first platform that centralizes engagement by REACH. It replaces fragmented WhatsApp workflows with:
- Video-based/Duolingo-like homework submissions (verbal homework)
- Staff review and quick feedback
- Teacher weekly performance uploads for classes/children
- Gamified points and weekly/monthly leaderboards (kindergarten-only, anonymized)
- Parent forum for peer support and Q&A (anonymous, kindergarten-labeled)
- Bilingual UI (English and Traditional Chinese), with i18next recommended

## 🎯 Goals

- Increase timely homework submissions
- Simplify staff/teacher reporting and tracking
- Improve parent engagement and community support
- Provide a foundation for future integration with the existing REACH student app

## 👥 Key User Flows (MVP)

### **Parent**
- Select child → upload verbal-homework video → add minimal metadata → submit OR submit Duolingo-like homework
- View submission status and staff feedback
- Earn points and see kindergarten leaderboard (weekly/monthly)
- Browse resource videos
- Participate in the parent forum (anonymous, labeled by kindergarten)
- Read teacher weekly summaries for their child (read-only)

### **Teacher**
- View My Classes and class rosters
- Upload weekly performance summary (by class and/or child) with quick rubric and optional notes
- Review their past submissions

### **Staff**
- Review queue of parent submissions → play video → set status/score/tags → add feedback
- View/acknowledge teacher weekly submissions; optionally annotate
- Moderate points and leaderboard as needed
- Upload/manage resource videos
- Moderate the parent forum

## 🏗️ Architecture Overview

### **Mobile App** (React Native + Expo)
- **Parent**: upload, portfolio, points, leaderboard, teacher summaries (read-only), resources, forum
- **Teacher**: My Classes, class roster, weekly upload form, submission history
- **Staff**: review queue, teacher submissions viewer, leaderboard moderation, resources, forum moderation
- **Bilingual**: i18next recommended

### **Backend**
- API for auth, submissions, teacher summaries, reviews, points, leaderboard, resources, forum
- Localhost deployment (or anything you want)
- Real-time approach: TODO (recommend choose between REST polling and Socket.io)
- Storage: localhost for video files (or anything you want)

## 🔄 Data Flow

**Parent upload** → video stored (localhost) → submission record created → staff reviews → points awarded/updated → leaderboard recalculates → parent sees feedback and points

**Teacher weekly upload** → summary stored → visible to staff and to parents (read-only) → staff may optionally acknowledge/annotate

## 📊 Entities and Data Model (TODO: Should be Simplified)

### **User**
id, role: parent | teacher | staff | admin
displayName, email, kindergartenId (for label), createdAt, locale

### **ParentProfile**
userId, childrenIds[]

### **TeacherProfile**
userId, kindergartenId, classIds[]

### **StaffProfile**
userId, roleLevel: reviewer | admin

### **Child**
id, nameAlias, kindergartenId, classId, parentIds[], createdAt
Note: Parents can have multiple children; each child maps to one kindergarten/class

### **Kindergarten**
id, name

### **Class**
id, kindergartenId, name, teacherIds[]

### **Submission** (Parent submission)
id, childId, parentId, subject, language, dueDate, videoUrl, status: Pending | Reviewed | NeedsReupload, createdAt, updatedAt

### **Review** (Staff review on parent submissions)
id, submissionId, staffId, score (e.g., 1–5), tags[] (Pronunciation, Fluency, Confidence), feedbackText, createdAt

### **TeacherSubmission** (Teacher weekly summary)
id, classId, childId? (optional for class-level summary), teacherId, period (e.g., ISO week YYYY-WW), subject, performance: { participation: 1–5, pronunciation: 1–5, confidence: 1–5, notes?: string }, attachments?: [urls], createdAt, status?: Visible | Hidden, staffAnnotation?: string

### **PointsTransaction**
id, userId (parent), childId, type (UploadOnTime, UploadLate, Reviewed, StreakBonus, etc.), points, createdAt, metadata

### **LeaderboardSnapshot**
id, kindergartenId, window: Week | Month, startAt, endAt, entries: [{aliasOrNickname, pointsTotal, rank}]

### **ResourceVideo**
id, title, url, subject, tags[], language, createdAt, uploadedBy

### **ForumPost**
id, kindergartenId (for label), authorUserId, authorRole: parent | teacher | staff, isAnonymous: boolean (true for parents), title, content, createdAt, updatedAt

### **ForumComment**
id, postId, authorUserId, authorRole, isAnonymous, content, createdAt

## 🆔 Identifiers

TODO: Confirm whether REACH will provide kindergarten/Class/Student IDs or we mint demo IDs
For hackathon: use seed/demo IDs

## 📹 Video Upload Specifications

- Max duration/size/formats: TODO
- Upload source: gallery for MVP; optional compression — TODO
- Required metadata: child, subject, dueDate, language, consent flag — TODO to finalize exact required fields
- Staff review rubric: status, score(1–5), tags (Pronunciation, Fluency, Confidence), short text: TODO

## 🎮 Gamification Rules (Initial Proposal — adjust later)

### **Points** (proposed defaults; adjust during build)
- Upload before due date: +20
- Upload after due date: +10
- Staff-reviewed (approved or reviewed): +10
- Weekly streak (≥3 on-time uploads in a week): +30

### **Badges** (examples; TODO finalize)
- "Streak Starter": 3-day streak
- "On-Time Hero": 4 consecutive on-time uploads
- "Practice Champ": 10 total uploads

### **Leaderboard resets**
Weekly and Monthly; timezone: HKT

## 🔒 Privacy, Consent, Safety

- **Consent**: Parent must accept consent before first upload
- **Anonymization**: Leaderboard shows alias or nickname; no real names
- **Retention**: Demo policy e.g., retain videos for 30 days; document in app and README
- **Teacher visibility**: Teachers can access only their classes; parents can view only their own child's teacher summaries
- **Forum**: Anonymous posting for parents; teachers and staff can be labeled by role; moderation tools for staff

## 🌐 Bilingual Support

i18next recommended for React Native; languages: English and Traditional Chinese
Localize core UI (buttons, toasts, menu, submission states); staff/teacher comments remain free text

## 🔗 Integration with Existing REACH Student App

Future work: Define import mapping and IDs for cross-app data sharing; out of scope for hackathon MVP

## 🛠️ Tech Stack and Infra (to be decided; recommendations included)

- **Mobile stack**: TODO decide (recommend React Native; Expo managed)
- **Backend**: TODO decide. Auth: TODO (recommend Firebase Auth if not constrained)
- **Storage**: Localhost for hackathon (or anything you want)
- **Database**: TODO decide
- **Real-time**: TODO decide; recommendation: choose between REST polling and Socket.io

## 🔌 API Specification (Draft; TODO: Should be Simplified)

### **Auth**
- POST /auth/signup
- POST /auth/login
- GET /auth/me

### **Directory**
- GET /kindergartens
- GET /classes?kindergartenId=
- GET /children (parent: list own children; teacher/staff: by class)
- GET /teacher/classes (teacher)
- GET /teacher/classes/{classId}/children (teacher)

### **Parent Submissions**
- POST /submissions
  body: { childId, subject, dueDate, language, consent: boolean, videoUploadMethod }
  returns: { submissionId, uploadUrl or uploadEndpoint }
- GET /submissions?childId=&status=
- GET /submissions/{id}

### **Staff Reviews** (on Parent Submissions)
- PATCH /submissions/{id}/review (staff)
  body: { status, score, tags[], feedbackText }

### **Teacher Weekly Submissions**
- POST /teacher/submissions (teacher)
  body: { classId, period, subject, childId?, performance: { participation, pronunciation, confidence, notes? }, attachments? }
- GET /teacher/submissions?classId=&period= (teacher/staff)
- GET /teacher/summary?childId=&period= (parent)
- PATCH /teacher/submissions/{id} (staff; optional)
  body: { status?, staffAnnotation? }

### **Points and Leaderboard**
- GET /points/me?childId=
- GET /leaderboard?kindergartenId=&window=week|month
- POST /admin/points/override (staff admin)

### **Resources**
- GET /resources?subject=&tag=
- POST /resources (staff)

### **Forum**
- GET /forum/posts?kindergartenId=&page=
- POST /forum/posts (parent: anonymous, labeled by kindergarten; teacher/staff: role label)
- GET /forum/posts/{id}
- POST /forum/posts/{id}/comments
- PATCH /forum/posts/{id} (staff moderation: lock/hide/pin) — optional
- PATCH /forum/comments/{id} (staff moderation) — optional

### **Reports**
- GET /reports/summary?childId=&window=week|month
- GET /reports/pdf?childId=&window=week|month&includeTeacher=true

## 🔐 Security and Roles

**Roles**: parent, teacher, staff (reviewer), admin

**Access control examples**:
- **Parents**: only their children's parent submissions/points and teacher summaries
- **Teachers**: only their classes; create/read TeacherSubmissions; no access to parent submissions or leaderboard moderation
- **Staff**: review parent submissions; view teacher submissions across assigned kindergarten(s); moderation
- **Admin**: global access; points override; resource management

## 🛠️ Staff/Teacher Tools (TODO: In-App or another web for MVP)

### **Staff**
- Review queue (filters: kindergarten, class, status)
- Review screen: play video, set status/score/tags/feedback, submit
- Leaderboard viewer (kindergarten)
- Resource upload manager
- Forum moderation (remove/lock posts, pin official answers)
- Teacher Submissions tab: filter by kindergarten/class/period; acknowledge/annotate

### **Teacher**
- My Classes → Class Roster
- Weekly Upload Form (period picker, subject, quick rubric 1–5 for participation/pronunciation/confidence, notes, optional attachments)
- Submission history per class

## 📱 Client UX Notes

- **Parent upload**: minimal steps, clear "Submitted → Pending Review" status
- **Clear on-time/late indicator** and due date
- **Points/leaderboard**: show current rank, top 10, and personal standing (alias/nickname)
- **Teacher weekly summary**: concise rubric with notes; visible to parents and staff
- **Forum**: kindergarten label on anonymous parent posts; report/mute tools; staff moderation

## 🎬 Demo Flow (for judges)

1. Parent logs in → selects Child A → picks video from gallery → adds subject/due date → submits
2. Parent sees Pending → points currently at X
3. Staff logs in → review queue → plays video → marks Reviewed, score 4/5 + feedback → save
4. Parent refreshes → sees feedback and updated points; leaderboard rank changes
5. Teacher logs in → opens My Classes → selects Class 1 → uploads weekly summary (participation 4, pronunciation 3, confidence 4, notes) → submit
6. Parent opens Child A → sees "Teacher Weekly Summary" card for this week
7. Optional: Staff opens Teacher Submissions tab → acknowledges and adds a short annotation
8. Parent browses resource videos; opens forum and posts an anonymous question

## 🏆 Judging Alignment

- **Relevance**: Centralizes submissions and weekly updates; replaces WhatsApp; enables teacher participation; engages parents via forum and gamification
- **Effectiveness & Feasibility**: Simple, mobile-first; localhost deploy for hackathon; extendable post-event
- **Technical Design & UX**: Clear flows for three roles, bilingual, anonymized leaderboard, role-based access
- **Creativity & Innovation**: Gamified incentives for parents; anonymous, kindergarten-labeled forum; teacher weekly summaries elevate visibility of progress
- **Social Impact**: Targets constraints of subdivided flats; improves timely feedback and parent–kindergarten collaboration

## 🚀 Roadmap (Post-hackathon)

- Integrate with REACH student app data and IDs
- Move storage to cloud; strengthen RBAC and audit logs
- Configurable rubrics; analytics dashboards for kindergartens
- Expand community features and resource curation; teacher recognition features

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

---

*Built for Morgan Stanley Asia Code to Give Hackathon 2025 - Team 10*