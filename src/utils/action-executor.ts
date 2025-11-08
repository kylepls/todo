import { Todo } from "@/lib/entities/Todo"

export type ActionUpdate = {
  todoId: number
  updates: Partial<Todo>
}

export type CommentAction = {
  todoId: number
  comment: string
}

export type ActionExecutionPlan = {
  todoUpdates: ActionUpdate[]
  commentActions: CommentAction[]
}

export function buildActionExecutionPlan(
  todoIds: number[],
  actions: Partial<Todo> | null
): ActionExecutionPlan {
  if (!actions) {
    return {
      todoUpdates: [],
      commentActions: []
    }
  }

  const todoUpdates: ActionUpdate[] = []
  const commentActions: CommentAction[] = []

  const todoActions = { ...actions }
  let commentValue: string | null = null

  if ('comment' in todoActions) {
    commentValue = todoActions.comment as string
    delete todoActions.comment
  }

  todoIds.forEach(todoId => {
    if (Object.keys(todoActions).length > 0) {
      todoUpdates.push({
        todoId,
        updates: todoActions
      })
    }

    if (commentValue) {
      commentActions.push({
        todoId,
        comment: commentValue
      })
    }
  })

  return {
    todoUpdates,
    commentActions
  }
}

