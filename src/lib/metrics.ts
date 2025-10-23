import { Gauge, Registry } from 'prom-client';

export const register = new Registry();

export const totalTasksGauge = new Gauge({
  name: 'todo_tasks_total',
  help: 'Total number of tasks',
  registers: [register],
});

export const tasksCreatedGauge = new Gauge({
  name: 'todo_tasks_created_total',
  help: 'Total number of tasks created',
  registers: [register],
});

export const tasksCompletedGauge = new Gauge({
  name: 'todo_tasks_completed_total',
  help: 'Total number of tasks completed',
  registers: [register],
});

export const tasksByStatusGauge = new Gauge({
  name: 'todo_tasks_by_status',
  help: 'Number of tasks in each status',
  labelNames: ['status'],
  registers: [register],
});

