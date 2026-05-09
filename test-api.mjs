import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAPI() {
  console.log("Fetching a test user...");
  const user = await prisma.user.findFirst({ where: { email: 'client1@example.com' } });
  
  if (!user) {
    console.error("Test user not found!");
    process.exit(1);
  }

  console.log(`Testing Chat API with User ID: ${user.id}...`);
  
  try {
    const chatRes = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        message: 'What is covered under my health policy?'
      })
    });
    
    const chatData = await chatRes.json();
    console.log("Chat Response:", chatData);

    if (chatData.chatMessageId) {
      console.log(`\nTesting Feedback API for Message ID: ${chatData.chatMessageId}...`);
      const feedbackRes = await fetch('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatMessageId: chatData.chatMessageId,
          isHelpful: false,
          correction: 'The AI did not specify dental coverage details.'
        })
      });
      
      const feedbackData = await feedbackRes.json();
      console.log("Feedback Response:", feedbackData);
    }
  } catch (err) {
    console.error("Test Failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();
