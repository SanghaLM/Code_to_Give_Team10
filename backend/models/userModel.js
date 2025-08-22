//Create a Mongoose Schema and generate approximately 30 mock data with students and parents
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'parent'],
        required: true
    },
    school: String,
    grade: Number,
    region: String,
    
    studentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

// ---- Mock data generation ----
async function generateMockUsers(count = 30) {
    await User.deleteMany({}); 
    const users = [];
    const regions = ['Central and Western District','Wan Chai District','Eastern District','Southern District','Yau Tsim Mong District','Sham Shui Po District','Kowloon City District','Wong Tai Sin District','Kwun Tong District','Tsuen Wan District','Tuen Mun District','Yuen Long District','North District','Tai Po District','Sha Tin District','Sai Kung District','Islands District'];
    

    for (let i = 0; i < count; i++) {
        const student = new User({
            username: faker.internet.userName(),
            password: faker.internet.password(), 
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
            role: 'student',
            school: faker.company.name(),
            grade: faker.number.int({ min: 1, max: 6 }),
            region: faker.helpers.arrayElement(regions)
        });
        users.push(student);
    }

    const teacher = new User({
        username: 'teacher.lee',
        password: 'password123',
        email: 'teacher@example.com',
        phoneNumber: faker.phone.number(),
        role: 'teacher',
        school: users[0].school, 
        region: faker.helpers.arrayElement(regions)
    });
    users.push(teacher);


    for (let i = 0; i < 5; i++) {
        const parent = new User({
            username: `parent.${users[i].username}`,
            password: 'password123',
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
            role: 'parent',
            region: faker.helpers.arrayElement(regions),
            studentIds: [users[i]._id] 
        });
        users.push(parent);
    }

    await User.insertMany(users);
    console.log(`Generated and saved ${users.length} mock users.`);
    return users;
}

module.exports = { User, generateMockUsers };
