import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/data-source';
import { Comment } from '@/lib/entities/Comment';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const { commentId } = await params;
  const body = await request.json();
  const { content } = body;

  const dataSource = await getDataSource();
  const commentRepository = dataSource.getRepository(Comment);

  const comment = await commentRepository.findOne({
    where: { id: parseInt(commentId) },
  });

  if (!comment) {
    logger.warn(`Comment not found for update commentId=${commentId}`);
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  comment.content = content;
  await commentRepository.save(comment);

  logger.info(`Updated comment commentId=${commentId}`);

  return NextResponse.json(comment);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const { commentId } = await params;

  const dataSource = await getDataSource();
  const commentRepository = dataSource.getRepository(Comment);

  await commentRepository.delete(parseInt(commentId));

  logger.info(`Deleted comment commentId=${commentId}`);

  return NextResponse.json({ success: true });
}

