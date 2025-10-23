import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/data-source';
import { Comment } from '@/lib/entities/Comment';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { content } = body;
  
  const dataSource = await getDataSource();
  const commentRepository = dataSource.getRepository(Comment);
  
  const comment = commentRepository.create({
    todo_id: parseInt(id),
    content,
  });
  
  await commentRepository.save(comment);
  
  logger.info(`Created comment commentId=${comment.id} todoId=${id}`);
  
  return NextResponse.json(comment);
}

