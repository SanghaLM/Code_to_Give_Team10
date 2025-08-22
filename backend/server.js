const express = require('express');
const connectDB = require('./config/database');
const { User, generateMockUsers } = require('./models/userModel');
const { Assignment, generateMockAssignments } = require('./models/assignmentModel');
const { Submission, generateMockSubmissions } = require('./models/submissionModel');

const app = express();

// connect DB and generate Mock Data
const runMockData = async () => {
    await connectDB();
    const mockUsers = await generateMockUsers(30);
    const teacherUser = mockUsers.find(user => user.role === 'teacher');
    const mockAssignments = await generateMockAssignments(teacherUser._id);
    await generateMockSubmissions(mockUsers, mockAssignments);
    console.log('All mock data generated successfully!');
};

runMockData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
