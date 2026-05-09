import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRelevantFAQs } from '@/lib/rag';
import { generateAIResponse } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const { userId, message } = await req.json();

    if (!userId || !message) {
      return NextResponse.json({ error: 'userId and message are required' }, { status: 400 });
    }

    // 1. Save User Message
    await prisma.chatHistory.create({
      data: {
        userId,
        message,
        sender: 'user',
      },
    });

    // 2. Fetch User Context (Live Data)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        policies: true,
        claims: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Retrieve Context from Knowledge Base (RAG)
    const faqs = await getRelevantFAQs(message);
    const faqContext = faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');

    // 4. Construct System Prompt
    const systemPrompt = `
You are the Policy Assist AI, an intelligent customer support agent for an insurance company called "Byte Brains".
Be concise, helpful, and friendly. Answer the user's questions based primarily on the context provided below.
If the context does not contain the answer, politely say that you don't have that information and they should contact support.

--- USER CONTEXT (LIVE DATA) ---
Name: ${user.name}
Email: ${user.email}

Policies:
${user.policies.map(p => `- Policy [${p.id}]: Type: ${p.type}, Coverage: ₹${p.coverageAmount}, Status: ${p.status}, Renewal Date: ${p.renewalDate.toISOString().split('T')[0]}`).join('\n')}

Claims:
${user.claims.map(c => `- Claim [${c.id}]: Status: ${c.status}, Filed: ${c.dateFiled.toISOString().split('T')[0]}, Desc: ${c.description}`).join('\n')}

--- KNOWLEDGE BASE (FAQs) ---
${faqContext || 'No relevant FAQs found.'}
    `;

    // 5. Generate AI Response
    let aiResponseText = "";
    try {
      aiResponseText = await generateAIResponse(systemPrompt, message);
    } catch (e) {
      console.error(e);
      aiResponseText = "I'm currently experiencing technical difficulties connecting to my brain. Please try again later.";
    }

    // 6. Save AI Response
    const aiMessageRecord = await prisma.chatHistory.create({
      data: {
        userId,
        message: aiResponseText,
        sender: 'ai',
      },
    });

    // 7. Return Response to Client
    return NextResponse.json({
      message: aiResponseText,
      chatMessageId: aiMessageRecord.id,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
