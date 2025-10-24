import { Todo } from "@/lib/entities/Todo"
import moment from "moment"
import * as chrono from "chrono-node"

interface SearchOperators {
  id?: string;
  status?: string;
  statusNegate?: boolean;
  is?: string;
  priority?: string;
  priorityNegate?: boolean;
  after?: string;
  before?: string;
  title?: string;
  titleNegate?: boolean;
  comment?: string;
  commentNegate?: boolean;
  description?: string;
  descriptionNegate?: boolean;
  sort?: string;
  freeText?: string;
}

export function parseSearchQuery(query: string): SearchOperators {
  const operators: SearchOperators = {}
  let remainingQuery = query

  const operatorPatterns = [
    { key: "id", pattern: /id:(\S+)/gi, supportsNegate: false },
    { key: "status", pattern: /status:(!?)(\S*)/gi, supportsNegate: true },
    { key: "is", pattern: /is:(\S+)/gi, supportsNegate: false },
    { key: "priority", pattern: /priority:(!?)(\S*)/gi, supportsNegate: true },
    { key: "after", pattern: /after:(\S+)/gi, supportsNegate: false },
    { key: "before", pattern: /before:(\S+)/gi, supportsNegate: false },
    { key: "title", pattern: /title:(!?)(?:"([^"]+)"|(\S*))/gi, supportsNegate: true },
    { key: "comment", pattern: /comment:(!?)(?:"([^"]+)"|(\S*))/gi, supportsNegate: true },
    { key: "description", pattern: /description:(!?)(?:"([^"]+)"|(\S*))/gi, supportsNegate: true },
    { key: "sort", pattern: /sort:(\S+)/gi, supportsNegate: false },
  ]

  for (const { key, pattern, supportsNegate } of operatorPatterns) {
    const match = pattern.exec(query)
    if (match) {
      const value = supportsNegate ? (match[2] || match[3] || "") : (match[1] || "")

      if (value || match[0].endsWith(":")) {
        if (supportsNegate && match[1] === "!") {
          operators[`${key}Negate` as keyof SearchOperators] = true as any
        }
        (operators as any)[key] = value.toLowerCase()
        remainingQuery = remainingQuery.replace(match[0], "").trim()
      }
    }
  }

  if (remainingQuery.trim()) {
    operators.freeText = remainingQuery.trim()
  }

  return operators
}

export function searchTodos(todos: Todo[], searchQuery: string): Todo[] {
  if (!todos || todos.length === 0) {
    return []
  }

  if (!searchQuery.trim()) {
    return todos
  }

  const operators = parseSearchQuery(searchQuery)
  let filteredTodos = todos

  if (operators.id) {
    const todoId = parseInt(operators.id)
    filteredTodos = filteredTodos.filter(todo => todo.id === todoId)
  }

  if (operators.is) {
    const isValue = operators.is.toLowerCase()
    if (isValue === "open") {
      filteredTodos = filteredTodos.filter(todo => todo.status !== "Completed")
    } else if (isValue === "closed") {
      filteredTodos = filteredTodos.filter(todo => todo.status === "Completed")
    }
  }

  if (operators.status) {
    const statusMap: Record<string, string> = {
      "open": "Created",
      "created": "Created",
      "pending": "Pending",
      "wip": "Work in progress",
      "progress": "Work in progress",
      "blocked": "Blocked by",
      "completed": "Completed",
      "done": "Completed",
    }
    const targetStatus = statusMap[operators.status] || operators.status
    filteredTodos = filteredTodos.filter(todo => {
      const matches = todo.status.toLowerCase().includes(targetStatus.toLowerCase())
      return operators.statusNegate ? !matches : matches
    })
  }

  if (operators.priority) {
    filteredTodos = filteredTodos.filter(todo => {
      const matches = todo.priority.toLowerCase() === operators.priority
      return operators.priorityNegate ? !matches : matches
    })
  }

  if (operators.after) {
    let parsedDate = chrono.parseDate(operators.after)
    if (!parsedDate) {
      const momentDate = moment(operators.after, ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'], true)
      if (momentDate.isValid()) {
        parsedDate = momentDate.toDate()
      }
    }
    if (parsedDate) {
      const afterDate = moment(parsedDate)
      filteredTodos = filteredTodos.filter(todo =>
        moment(todo.created_at).isAfter(afterDate)
      )
    }
  }

  if (operators.before) {
    let parsedDate = chrono.parseDate(operators.before)
    if (!parsedDate) {
      const momentDate = moment(operators.before, ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'], true)
      if (momentDate.isValid()) {
        parsedDate = momentDate.toDate()
      }
    }
    if (parsedDate) {
      const beforeDate = moment(parsedDate)
      filteredTodos = filteredTodos.filter(todo =>
        moment(todo.created_at).isBefore(beforeDate)
      )
    }
  }

  if (operators.title !== undefined) {
    if (operators.title === "") {
      if (operators.titleNegate) {
        filteredTodos = []
      }
    } else {
      filteredTodos = filteredTodos.filter(todo => {
        const matches = todo.title.toLowerCase().includes(operators.title!.toLowerCase())
        return operators.titleNegate ? !matches : matches
      })
    }
  }

  if (operators.description !== undefined) {
    if (operators.description === "") {
      if (operators.descriptionNegate) {
        filteredTodos = filteredTodos.filter(todo => !todo.description || todo.description === "")
      }
    } else {
      filteredTodos = filteredTodos.filter(todo => {
        const matches = todo.description.toLowerCase().includes(operators.description!.toLowerCase())
        return operators.descriptionNegate ? !matches : matches
      })
    }
  }

  if (operators.comment !== undefined) {
    if (operators.comment === "") {
      if (operators.commentNegate) {
        filteredTodos = filteredTodos.filter(todo => !todo.comments || todo.comments.length === 0)
      }
    } else {
      filteredTodos = filteredTodos.filter(todo => {
        const matches = todo.comments?.some(comment =>
          comment.content.toLowerCase().includes(operators.comment!.toLowerCase())
        )
        return operators.commentNegate ? !matches : matches
      })
    }
  }

  if (operators.freeText) {
    const searchLower = operators.freeText.toLowerCase()
    filteredTodos = filteredTodos.filter(todo => {
      if (todo.title.toLowerCase().includes(searchLower)) return true
      if (todo.description?.toLowerCase().includes(searchLower)) return true
      if (todo.comments?.some(c => c.content.toLowerCase().includes(searchLower))) return true
      return false
    })
  }

  if (operators.sort) {
    const sortFields = operators.sort.split(",").map(field => field.trim())

    if (filteredTodos === todos) {
      filteredTodos = [...todos]
    }

    const priorityOrder: Record<string, number> = {
      "Critical": 0,
      "High": 1,
      "Medium": 2,
      "Low": 3,
    }

    const statusOrder: Record<string, number> = {
      "Blocked by": 0,
      "Work in progress": 1,
      "Pending": 2,
      "Created": 3,
      "Completed": 4,
    }

    const comparators: ((a: Todo, b: Todo) => number)[] = sortFields.map(field => {
      const isReverse = field.startsWith("!")
      const fieldName = isReverse ? field.substring(1).toLowerCase() : field.toLowerCase()
      let comparison = isReverse ? -1 : 1

      if (fieldName === "created") {
        return (a, b) => (a.created_at.getTime() - b.created_at.getTime()) * comparison
      } else if (fieldName === "priority") {
        return (a, b) => (priorityOrder[a.priority] - priorityOrder[b.priority]) * comparison
      } else if (fieldName === "status") {
        return (a, b) => (statusOrder[a.status] - statusOrder[b.status]) * comparison
      } else if (fieldName === "title") {
        return (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()) * comparison
      } else if (fieldName === "updated") {
        return (a, b) => (a.updated_at.getTime() - b.updated_at.getTime()) * comparison
      } else {
        return (a, b) => 0
      }
    })

    filteredTodos.sort((a, b) => {
      for (const comparator of comparators) {
        const result = comparator(a, b)
        if (result !== 0) {
          return result
        }
      }
      return 0
    })
  }

  return filteredTodos
}

