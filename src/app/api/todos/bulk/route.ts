import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/data-source';
import { Todo } from '@/lib/entities/Todo';
import { Comment } from '@/lib/entities/Comment';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

type TodoUpdate = {
  todoId: number;
  updates: Partial<Todo>;
};

type CommentAction = {
  todoId: number;
  comment: string;
};

type BulkActionRequest = {
  todoUpdates: TodoUpdate[];
  commentActions: CommentAction[];
};

export async function POST(request: NextRequest) {
  const body: BulkActionRequest = await request.json();
  const { todoUpdates, commentActions } = body;

  const dataSource = await getDataSource();
  const todoRepository = dataSource.getRepository(Todo);
  const commentRepository = dataSource.getRepository(Comment);

  const updatedTodos: Todo[] = [];
  const createdComments: Comment[] = [];

  for (const { todoId, updates } of todoUpdates) {
    const todo = await todoRepository.findOne({ where: { id: todoId } });

    if (!todo) {
      logger.warn(`Todo not found for bulk update id=${todoId}`);
      continue;
    }

    const allowedFields = ['title', 'description', 'status', 'priority', 'need_by_date', 'blocked_by_id', 'completed_at'];

    let hasUpdates = false;
    for (const field of allowedFields) {
      if (field in updates) {
        (todo as any)[field] = (updates as any)[field];
        hasUpdates = true;
      }
    }

    if (hasUpdates) {
      await todoRepository.save(todo);
      updatedTodos.push(todo);
      logger.info(`Bulk updated todo id=${todoId}`);
    }
  }

  for (const { todoId, comment: content } of commentActions) {
    const comment = commentRepository.create({
      todo_id: todoId,
      content,
    });

    await commentRepository.save(comment);
    createdComments.push(comment);
    logger.info(`Bulk created comment todoId=${todoId}`);
  }

  logger.info(`Bulk action completed updatedCount=${updatedTodos.length} commentsCreated=${createdComments.length}`);

  return NextResponse.json({
    updatedTodos,
    createdComments,
    success: true,
  });
}

