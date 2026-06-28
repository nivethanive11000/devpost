import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        creator: {
          select: { id: true, name: true, avatar: true, rating: true },
        },
        offers: { where: { status: 'accepted' } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, category, budget, deadline, creatorId } =
      await req.json();

    if (!title || !description || !budget || !creatorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        category,
        budget,
        deadline: new Date(deadline),
        creatorId,
      },
      include: {
        creator: {
          select: { id: true, name: true, avatar: true, rating: true },
        },
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
