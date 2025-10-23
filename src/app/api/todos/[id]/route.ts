import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/data-source';
import { Todo } from '@/lib/entities/Todo';
import { Comment } from '@/lib/entities/Comment';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dataSource = await getDataSource();
  const todoRepository = dataSource.getRepository(Todo);
  const commentRepository = dataSource.getRepository(Comment);
  
  const todo = await todoRepository.findOne({ where: { id: parseInt(id) } });
  
  if (!todo) {
    logger.warn(`Todo not found id=${id}`);
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }
  
  const comments = await commentRepository.find({
    where: { todo_id: parseInt(id) },
    order: { created_at: 'ASC' },
  });
  
  logger.info(`Fetched todo id=${id} commentCount=${comments.length}`);
  
  return NextResponse.json({ ...todo, comments });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  const dataSource = await getDataSource();
  const todoRepository = dataSource.getRepository(Todo);
  
  const todo = await todoRepository.findOne({ where: { id: parseInt(id) } });
  
  if (!todo) {
    logger.warn(`Todo not found for update id=${id}`);
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }
  
  const allowedFields = ['title', 'description', 'status', 'priority', 'need_by_date', 'blocked_by_id', 'completed_at'];
  
  let hasUpdates = false;
  for (const field of allowedFields) {
    if (field in body) {
      (todo as any)[field] = body[field];
      hasUpdates = true;
    }
  }
  
  if (!hasUpdates) {
    logger.warn(`No fields to update id=${id}`);
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }
  
  await todoRepository.save(todo);
  
  logger.info(`Updated todo id=${id}`);
  
  return NextResponse.json(todo);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dataSource = await getDataSource();
  const todoRepository = dataSource.getRepository(Todo);
  
  await todoRepository.delete(parseInt(id));
  
  logger.info(`Deleted todo id=${id}`);
  
  return NextResponse.json({ success: true });
}

