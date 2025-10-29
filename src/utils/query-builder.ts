import { Comment } from "@/lib/entities/Comment"
import { Todo } from "@/lib/entities/Todo"
import { Filter, Action, SortField, ParsedQuery } from "./command-parser"

export type QueryResult = {
  filter: (todo: Todo) => boolean
  actions: Partial<Todo> | null
  create: { title: string } | null
  sort: SortField[] | null
}

export function buildQuery(parsed: ParsedQuery): QueryResult {
  const filterFunctions = parsed.filters.map(f => buildFilterFunction(f))
  const filter = filterFunctions.length > 0
    ? (todo: Todo) => filterFunctions.every(fn => fn(todo))
    : () => true

  const actions = parsed.actions.length > 0 ? buildActions(parsed.actions) : null
  const sort = parsed.sort.length > 0 ? parsed.sort : null

  return {
    filter,
    actions,
    create: parsed.create,
    sort
  }
}

function buildFilterFunction(filter: Filter): (todo: Todo) => boolean {
  if (filter.type === "string") {
    return buildStringFilter(filter.attribute, filter.value, filter.negated)
  }
  return buildDateFilter(filter.attribute, filter.date, filter.operator, filter.negated)
}

function buildStringFilter(
  attribute: string,
  value: string | null,
  negated: boolean
): (todo: Todo) => boolean {
  if (value === null) {
    return (todo: Todo) => {
      const todoValue = getTodoValue(todo, attribute)
      const isNull = todoValue === "" || todoValue === "null" || todoValue === "undefined"
      return negated ? !isNull : isNull
    }
  }

  if (attribute === "is") {
    return (todo: Todo) => {
      const isOpen = todo.status !== "Completed"
      const matches = value.toLowerCase() === "open" ? isOpen : !isOpen
      return negated ? !matches : matches
    }
  }

  if (attribute === "comment") {
    return (todo: Todo) => {
      const comments = (todo.comments || []) as Comment[]
      const matchingComments = comments.filter(it => it.content.toLowerCase().includes(value.toLowerCase()))
      const matches = matchingComments.length > 0
      return negated ? !matches : matches
    }
  }

  return (todo: Todo) => {
    const todoValue = getTodoValue(todo, attribute)
    const matches = todoValue.toLowerCase().includes(value.toLowerCase())
    return negated ? !matches : matches
  }
}

function buildDateFilter(
  attribute: string,
  date: Date | null,
  operator: "before" | "after" | "exact",
  negated: boolean
): (todo: Todo) => boolean {
  if (date === null) {
    return (todo: Todo) => {
      const todoDate = getTodoDateValue(todo, attribute)
      const isNull = todoDate === null
      return negated ? !isNull : isNull
    }
  }

  if (operator === "exact") {
    return (todo: Todo) => {
      const todoDate = getTodoDateValue(todo, attribute)
      if (!todoDate) return negated

      const todoDateStr = todoDate.toISOString().split("T")[0]
      const filterDateStr = date.toISOString().split("T")[0]
      const matches = todoDateStr === filterDateStr

      return negated ? !matches : matches
    }
  }

  return (todo: Todo) => {
    const todoDate = getTodoDateValue(todo, attribute)
    if (!todoDate) return negated

    const comparison = operator === "after"
      ? todoDate.getTime() > date.getTime()
      : todoDate.getTime() < date.getTime()

    return negated ? !comparison : comparison
  }
}

function getTodoValue(todo: Todo, attribute: string): string {
  const mapping: Record<string, keyof Todo | string> = {
    "id": "id",
    "title": "title",
    "description": "description",
    "status": "status",
    "priority": "priority",
  }

  const key = mapping[attribute]
  const value = todo[key as keyof Todo]

  if (key === "status" && value === "Work in progress") {
    return "wip"
  }

  return String(value)
}

function getTodoDateValue(todo: Todo, attribute: string): Date | null {
  const mapping: Record<string, keyof Todo> = {
    "created": "created_at",
    "updated": "updated_at",
    "completed": "completed_at",
    "needby": "need_by_date",
  }

  const key = mapping[attribute]
  const value = todo[key]

  if (!value) return null
  return value instanceof Date ? value : new Date(value as string)
}

function buildActions(actions: Action[]): Partial<Todo> {
  const mapping: Record<string, keyof Todo> = {
    "title": "title",
    "description": "description",
    "status": "status",
    "priority": "priority",
    "needby": "need_by_date",
  }

  const result: Partial<Todo> = {}
  actions.forEach(action => {
    const key = mapping[action.attribute]
    if (key) {
      result[key] = action.value as any
    }
  })

  return result
}

