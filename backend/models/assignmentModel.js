const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const assignmentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['quiz', 'audio', 'game'],
        required: true
    },
    content: mongoose.Schema.Types.Mixed,
    points: {
        type: Number,
        default: 10
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

// ---- Mock assignments generation ----
async function generateMockAssignments(creatorId) {
    await Assignment.deleteMany({});

    const quizAssignment = new Assignment({
        title: 'Animals Quiz',
        type: 'quiz',
        content: {
            questions: [
                {
                    questionText: "What sound does a cow make?",
                    type: "multiple-choice",
                    options: ["Moo", "Woof", "Meow", "Oink"],
                    correctAnswer: 0
                },
                {
                    questionText: "Which of these are farm animals?",
                    type: "multiple-select",
                    options: ["Cow", "Lion", "Pig", "Shark"],
                    correctAnswer: [0, 2]
                }
            ]
        },
        points: 10,
        creatorId: creatorId
    });

    const audioAssignment = new Assignment({
        title: "Pronounce: 'Apple'",
        type: 'audio',
        content: {
            prompt: "Apple"
        },
        points: 5,
        creatorId: creatorId
    });

    const gameAssignment = new Assignment({
        title: "Memory Card Game: Fruits",
        type: 'game',
        content: {
            gameId: "memory_fruits_v1"
        },
        points: 15,
        creatorId: creatorId
    });

    await Assignment.insertMany([quizAssignment, audioAssignment, gameAssignment]);
    console.log('Generated and saved 3 mock assignments.');
    return { quizAssignment, audioAssignment, gameAssignment };
}

module.exports = { Assignment, generateMockAssignments };
