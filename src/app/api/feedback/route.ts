import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { chatMessageId, isHelpful, correction } = await req.json();

    if (!chatMessageId || typeof isHelpful !== 'boolean') {
      return NextResponse.json({ error: 'chatMessageId and isHelpful are required' }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        chatMessageId,
        isHelpful,
        correction: correction || null,
        status: 'Pending', // Pending admin review
      },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Feedback API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
