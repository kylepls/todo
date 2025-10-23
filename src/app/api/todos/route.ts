import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/data-source';
import { Todo } from '@/lib/entities/Todo';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dataSource = await getDataSource();
  const todoRepository = dataSource.getRepository(Todo);
  
  const todos = await todoRepository.find({
    relations: ['comments'],
    order: { created_at: 'DESC' },
  });
  
  logger.info(`Fetched todos count=${todos.length}`);
  
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description = '', status = 'Created', priority = 'Medium', need_by_date = null, blocked_by_id = null } = body;
  
  const dataSource = await getDataSource();
  const todoRepository = dataSource.getRepository(Todo);
  
  const todo = todoRepository.create({
    title,
    description,
    status,
    priority,
    need_by_date,
    blocked_by_id,
  });
  
  await todoRepository.save(todo);
  
  logger.info(`Created todo id=${todo.id} title="${todo.title}"`);
  
  return NextResponse.json(todo);
}

