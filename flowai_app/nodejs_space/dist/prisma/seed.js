"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    const hashedPassword = await bcrypt.hash('johndoe123', 10);
    const testUser = await prisma.user.upsert({
        where: { email: 'john@doe.com' },
        update: {},
        create: {
            email: 'john@doe.com',
            password: hashedPassword,
            name: 'John Doe',
            ispremium: true,
            avatarurl: null,
        },
    });
    console.log(`✅ Created test user: ${testUser.email}`);
    const preferences = await prisma.userpreference.upsert({
        where: { userid: testUser.id },
        update: {},
        create: {
            userid: testUser.id,
            darkmode: true,
            language: 'pt-BR',
            notificationsenabled: true,
            aisuggestpriority: true,
            ainaturallanguage: true,
        },
    });
    console.log(`✅ Created preferences for ${testUser.email}`);
    const tasks = [
        {
            title: 'Complete project proposal',
            description: 'Finish the Q2 project proposal for the new client',
            duedate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            priority: 'high',
            category: 'Work',
            status: 'pending',
        },
        {
            title: 'Weekly team meeting',
            description: 'Discuss progress and blockers',
            duedate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            priority: 'medium',
            category: 'Work',
            status: 'pending',
        },
        {
            title: 'Review pull requests',
            description: 'Code review for the authentication module',
            duedate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            priority: 'medium',
            category: 'Work',
            status: 'pending',
        },
        {
            title: 'Grocery shopping',
            description: 'Buy vegetables, fruits, and milk',
            duedate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            priority: 'low',
            category: 'Personal',
            status: 'pending',
        },
        {
            title: 'Doctor appointment',
            description: 'Annual checkup at 3pm',
            duedate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            priority: 'high',
            category: 'Health',
            status: 'pending',
        },
    ];
    for (const taskData of tasks) {
        const task = await prisma.task.create({
            data: {
                userid: testUser.id,
                ...taskData,
            },
        });
        console.log(`✅ Created task: ${task.title}`);
    }
    const habits = [
        {
            name: 'Morning meditation',
            description: '10 minutes of mindfulness',
            frequency: 'daily',
        },
        {
            name: 'Exercise',
            description: '30 minutes workout',
            frequency: 'daily',
        },
    ];
    for (const habitData of habits) {
        const habit = await prisma.habit.create({
            data: {
                userid: testUser.id,
                ...habitData,
            },
        });
        console.log(`✅ Created habit: ${habit.name}`);
        const today = new Date();
        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            await prisma.habitcompletion.upsert({
                where: {
                    habitid_date: {
                        habitid: habit.id,
                        date: dateStr,
                    },
                },
                update: {},
                create: {
                    habitid: habit.id,
                    userid: testUser.id,
                    date: dateStr,
                },
            });
        }
        console.log(`✅ Created 5-day streak for habit: ${habit.name}`);
    }
    const calendarEvent = await prisma.calendarevent.create({
        data: {
            userid: testUser.id,
            title: 'Lunch with team',
            startdate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
            enddate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000),
            allday: false,
            source: 'local',
        },
    });
    console.log(`✅ Created calendar event: ${calendarEvent.title}`);
    const insights = [
        {
            type: 'productivity',
            content: 'You\'re 30% more productive in the mornings. Schedule important tasks before noon!',
        },
        {
            type: 'suggestion',
            content: 'You have 3 high-priority tasks. Consider focusing on one at a time for better results.',
        },
        {
            type: 'pattern',
            content: 'You consistently complete Work tasks faster than Personal tasks. Great focus!',
        },
    ];
    for (const insightData of insights) {
        const insight = await prisma.aiinsight.create({
            data: {
                userid: testUser.id,
                ...insightData,
                dismissed: false,
            },
        });
        console.log(`✅ Created AI insight: ${insight.type}`);
    }
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Test account credentials:');
    console.log('   Email: john@doe.com');
    console.log('   Password: johndoe123');
    console.log('   Premium: Yes\n');
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map