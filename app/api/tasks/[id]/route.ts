import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: { id: true, name: true, avatar: true, rating: true, bio: true },
        },
        offers: {
          include: {
            worker: {
              select: { id: true, name: true, avatar: true, rating: true },
            },
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();

    const task = await prisma.task.update({
      where: { id: params.id },
      data: { status },
      include: {
        creator: {
          select: { id: true, name: true, avatar: true, rating: true },
        },
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
