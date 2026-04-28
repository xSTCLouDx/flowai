import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create test user (john@doe.com / johndoe123)
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

  // Create default preferences for test user
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

  // Create sample tasks
  const tasks = [
    {
      title: 'Complete project proposal',
      description: 'Finish the Q2 project proposal for the new client',
      duedate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      priority: 'high',
      category: 'Work',
      status: 'pending',
    },
    {
      title: 'Weekly team meeting',
      description: 'Discuss progress and blockers',
      duedate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
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

  // Create sample habits
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

    // Create some completions for streak demonstration
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

  // Create a sample calendar event
  const calendarEvent = await prisma.calendarevent.create({
    data: {
      userid: testUser.id,
      title: 'Lunch with team',
      startdate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000), // Tomorrow at noon
      enddate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000), // Tomorrow at 1pm
      allday: false,
      source: 'local',
    },
  });

  console.log(`✅ Created calendar event: ${calendarEvent.title}`);

  // Create sample AI insights
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
