import moment from 'moment'
import { Todo } from '@/lib/entities/Todo'

export function parseTodoDates(todo: Todo): Todo {
  return {
    ...todo,
    created_at: moment(todo.created_at).toDate(),
    updated_at: moment(todo.updated_at).toDate(),
  }
}

export function parseTodoListDates(todos: Todo[]): Todo[] {
  return todos.map(parseTodoDates)
}

