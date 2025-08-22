//Generate some simulated submission records for some students
const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    assignmentTitle: String,
    type: {
        type: String,
        enum: ['quiz', 'audio', 'game'],
        required: true
    },
    content: mongoose.Schema.Types.Mixed,
    result: mongoose.Schema.Types.Mixed,
    status: {
        type: String,
        enum: ['submitted', 'graded'],
        default: 'submitted'
    }
}, {
    timestamps: true
});

const Submission = mongoose.model('Submission', submissionSchema);

// ---- Mock submission generation ----
async function generateMockSubmissions(users, assignments) {
    await Submission.deleteMany({});

    const submissions = [];
    const students = users.filter(u => u.role === 'student');

    
    for (let i = 0; i < 5; i++) {
        const student = students[i];
        const quiz = assignments.quizAssignment;
        submissions.push(new Submission({
            userId: student._id,
            assignmentId: quiz._id,
            assignmentTitle: quiz.title,
            type: 'quiz',
            content: {
                answers: [
                    { questionIndex: 0, selectedOption: 0 },
                    { questionIndex: 1, selectedOptions: [0, 2] } 
                ]
            },
            result: {
                score: 100,
                correctCount: 2,
                totalCount: 2,
                pointsEarned: 10
            },
            status: 'graded'
        }));
    }

  
    for (let i = 5; i < 10; i++) {
        const student = students[i];
        const audio = assignments.audioAssignment;
        submissions.push(new Submission({
            userId: student._id,
            assignmentId: audio._id,
            assignmentTitle: audio.title,
            type: 'audio',
            content: {
                prompt: audio.content.prompt,
                audioUrl: `https://mockstorage.com/audio/${student._id}_${audio._id}.mp3`,
                duration: 3.2
            },
            status: 'submitted' 
        }));
    }

    await Submission.insertMany(submissions);
    console.log(`Generated and saved ${submissions.length} mock submissions.`);
}

module.exports = { Submission, generateMockSubmissions };
