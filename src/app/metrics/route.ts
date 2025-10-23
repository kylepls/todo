import { NextResponse } from 'next/server';
import { getDataSource } from '@/lib/data-source';
import { Todo } from '@/lib/entities/Todo';
import { 
  register, 
  totalTasksGauge, 
  tasksCreatedGauge, 
  tasksCompletedGauge, 
  tasksByStatusGauge 
} from '@/lib/metrics';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dataSource = await getDataSource();
  const todoRepository = dataSource.getRepository(Todo);
  
  const totalTasks = await todoRepository.count();
  const completedTasks = await todoRepository.count({ where: { status: 'Completed' } });
  
  const createdTasks = await todoRepository.count({ where: { status: 'Created' } });
  const pendingTasks = await todoRepository.count({ where: { status: 'Pending' } });
  const inProgressTasks = await todoRepository.count({ where: { status: 'Work in progress' } });
  const blockedTasks = await todoRepository.count({ where: { status: 'Blocked by' } });
  
  totalTasksGauge.set(totalTasks);
  tasksCreatedGauge.set(createdTasks);
  tasksCompletedGauge.set(completedTasks);
  
  tasksByStatusGauge.set({ status: 'Created' }, createdTasks);
  tasksByStatusGauge.set({ status: 'Pending' }, pendingTasks);
  tasksByStatusGauge.set({ status: 'Work in progress' }, inProgressTasks);
  tasksByStatusGauge.set({ status: 'Blocked by' }, blockedTasks);
  tasksByStatusGauge.set({ status: 'Completed' }, completedTasks);
  
  logger.info(`Metrics updated total=${totalTasks} completed=${completedTasks} created=${createdTasks} pending=${pendingTasks} inProgress=${inProgressTasks} blocked=${blockedTasks}`);
  
  const metrics = await register.metrics();
  
  return new NextResponse(metrics, {
    headers: {
      'Content-Type': register.contentType,
    },
  });
}

