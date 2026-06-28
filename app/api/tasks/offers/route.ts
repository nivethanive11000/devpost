import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { taskId, workerId, amount, message } = await req.json();

    if (!taskId || !workerId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if offer already exists
    const existingOffer = await prisma.taskOffer.findFirst({
      where: { taskId, workerId },
    });

    if (existingOffer) {
      return NextResponse.json(
        { error: 'You already submitted an offer for this task' },
        { status: 409 }
      );
    }

    const offer = await prisma.taskOffer.create({
      data: {
        taskId,
        workerId,
        amount,
        message: message || '',
      },
      include: {
        worker: {
          select: { id: true, name: true, avatar: true, rating: true },
        },
      },
    });

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    console.error('Create offer error:', error);
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
