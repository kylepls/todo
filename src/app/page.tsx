"use client"

import { CompletionChart } from "@/components/CompletionChart"
import { TodoCard } from "@/components/TodoCard"
import { TodoDetail } from "@/components/TodoDetail"
import { useTodos } from "@/contexts/TodoContext"
import { Todo, TodoPriority, TodoStatus } from "@/lib/entities/Todo"
import { parseQuery, getAutocompletions } from "@/utils/command-parser"
import { buildQuery } from "@/utils/query-builder"
import { buildActionExecutionPlan } from "@/utils/action-executor"

const DEFAULT_SEARCH_QUERY = "is:open sort:!created priority"
import { parseTodoListDates, parseTodoDates } from "@/utils/dateParser"
import { Autocomplete, Button, Card, Container, Group, Stack, Text, Kbd } from "@mantine/core"
import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Virtuoso } from "react-virtuoso"
import moment from "moment"
import * as chrono from "chrono-node"

export default function Home() {
  const { todos, setTodos } = useTodos()
  const [isLoading, setIsLoading] = useState(true)
  const [searchInput, setSearchInput] = useState("")
  const searchInputRef = useRef<any>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('q')
    if (query) {
      setSearchInput(query)
    } else {
      setSearchInput(DEFAULT_SEARCH_QUERY)
    }

    const handlePopState = (event: PopStateEvent) => {
      const params = new URLSearchParams(window.location.search)
      const query = params.get('q')
      setSearchInput(query || DEFAULT_SEARCH_QUERY)
    }

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setSearchInput(DEFAULT_SEARCH_QUERY)
        const url = new URL(window.location.href)
        url.searchParams.set('q', DEFAULT_SEARCH_QUERY)
        window.history.pushState({}, '', url.toString())
        setTimeout(() => {
          if (searchInputRef.current) {
            const input = searchInputRef.current.querySelector('input')
            if (input) {
              input.select()
              input.focus()
            }
          }
        }, 0)
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        if (searchInputRef.current) {
          const input = searchInputRef.current.querySelector('input')
          if (input) {
            input.select()
            input.focus()
          }
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [])

  const loadData = async () => {
    const todosRes = await fetch("/api/todos", { cache: "no-store" })
    const todosData = await todosRes.json()

    setTodos(parseTodoListDates(todosData))
    setIsLoading(false)
  }

  useEffect(() => {
    const cachedTodos = localStorage.getItem("todos")

    if (cachedTodos) {
      setTodos(parseTodoListDates(JSON.parse(cachedTodos)))
      setIsLoading(false)
    }

    loadData().then(() => {
      localStorage.setItem("todos", JSON.stringify(todos))
    })
  }, [])

  const createTodo = async () => {
    if (!searchInput.trim()) {
      return
    }

    if (!parsedQuery.create) {
      return
    }

    const title = parsedQuery.create.title
    const tempId = -Date.now()

    const optimisticTodo: Todo = {
      id: tempId,
      title,
      description: "",
      status: "Created",
      priority: "Medium",
      need_by_date: null,
      blocked_by_id: null,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
      comments: [],
    }

    setTodos([optimisticTodo, ...todos])
    setSearchInput(DEFAULT_SEARCH_QUERY)
    const url = new URL(window.location.href)
    url.searchParams.set('q', DEFAULT_SEARCH_QUERY)
    window.history.pushState({}, '', url.toString())

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })

      if (!res.ok) {
        throw new Error(`Failed to create todo: ${res.statusText}`)
      }

      const newTodo = parseTodoDates(await res.json())

      setTodos(prevTodos => {
        const updatedTodos = prevTodos.map(t => t.id === tempId ? newTodo : t)
        localStorage.setItem("todos", JSON.stringify(updatedTodos))
        return updatedTodos
      })

      notifications.show({
        title: "Todo created",
        message: "Your todo has been created successfully",
        color: "green",
      })
    } catch (error) {
      setTodos(prevTodos => prevTodos.filter(t => t.id !== tempId))

      modals.open({
        title: "Failed to create todo",
        children: (
          <Text size="sm">
            There was an error creating your todo. Please try again.
          </Text>
        ),
      })
    }
  }

  const executeAction = async () => {
    if (!parsedQuery.actions) {
      return
    }

    const filteredTodos = todos.filter(parsedQuery.filter)
    const todoIds = filteredTodos.map(t => t.id)

    if (todoIds.length === 0) {
      notifications.show({
        title: "No todos to update",
        message: "No todos match the filter criteria",
        color: "yellow",
      })
      return
    }

    const executionPlan = buildActionExecutionPlan(todoIds, parsedQuery.actions)

    const previousTodos = [...todos]

    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        const update = executionPlan.todoUpdates.find(u => u.todoId === todo.id)
        if (update) {
          return { ...todo, ...update.updates }
        }
        return todo
      })
    })

    try {
      const res = await fetch("/api/todos/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(executionPlan),
      })

      if (!res.ok) {
        throw new Error(`Failed to execute action: ${res.statusText}`)
      }

      await loadData()

      const actionCount = executionPlan.todoUpdates.length + executionPlan.commentActions.length
      notifications.show({
        title: "Action executed",
        message: `Successfully executed action on ${todoIds.length} todo${todoIds.length !== 1 ? 's' : ''}`,
        color: "green",
      })
    } catch (error) {
      setTodos(previousTodos)

      modals.open({
        title: "Failed to execute action",
        children: (
          <Text size="sm">
            There was an error executing the action. Please try again.
          </Text>
        ),
      })
    }
  }

  const updateTodoStatus = useCallback(async (id: number, status: TodoStatus) => {
    const completedAt = status === "Completed" ? moment().toISOString() : null

    let previousTodo: Todo | undefined
    setTodos((prevTodos: Todo[]) => {
      previousTodo = prevTodos.find(t => t.id === id)
      return prevTodos.map((t: Todo) =>
        t.id === id ? { ...t, status, completed_at: completedAt } : t
      )
    })

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, completed_at: completedAt }),
      })

      if (!res.ok) {
        throw new Error(`Failed to update status: ${res.statusText}`)
      }

      const updatedTodo: Todo = parseTodoDates(await res.json())
      setTodos((prevTodos: Todo[]) => {
        const newTodos = prevTodos.map((t: Todo) => t.id === id ? updatedTodo : t)
        localStorage.setItem("todos", JSON.stringify(newTodos))
        return newTodos
      })
    } catch (error) {
      if (previousTodo) {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map((t: Todo) => t.id === id ? previousTodo! : t)
        )
      }

      modals.open({
        title: "Failed to update status",
        children: (
          <Text size="sm">
            There was an error updating the status. Please try again.
          </Text>
        ),
      })
    }
  }, [])

  const updateTodoPriority = useCallback(async (id: number, priority: TodoPriority) => {
    console.log(`updateTodoPriority called id=${id} priority=${priority}`)

    let previousTodo: Todo | undefined
    setTodos((prevTodos: Todo[]) => {
      previousTodo = prevTodos.find(t => t.id === id)
      return prevTodos.map((t: Todo) => t.id === id ? { ...t, priority } : t)
    })

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      })

      if (!res.ok) {
        throw new Error(`Failed to update priority: ${res.statusText}`)
      }

      const updatedTodo: Todo = parseTodoDates(await res.json())
      setTodos((prevTodos: Todo[]) => {
        const newTodos = prevTodos.map((t: Todo) => t.id === id ? updatedTodo : t)
        localStorage.setItem("todos", JSON.stringify(newTodos))
        return newTodos
      })
    } catch (error) {
      if (previousTodo) {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map((t: Todo) => t.id === id ? previousTodo! : t)
        )
      }

      modals.open({
        title: "Failed to update priority",
        children: (
          <Text size="sm">
            There was an error updating the priority. Please try again.
          </Text>
        ),
      })
    }
  }, [])

  const updateTodoDate = useCallback(async (id: number, date: Date | null) => {
    const needByDate = date ? moment(date).format('YYYY-MM-DD') : null

    let previousTodo: Todo | undefined
    setTodos((prevTodos: Todo[]) => {
      previousTodo = prevTodos.find(t => t.id === id)
      return prevTodos.map((t: Todo) => t.id === id ? { ...t, need_by_date: needByDate } : t)
    })

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ need_by_date: needByDate }),
      })

      if (!res.ok) {
        throw new Error(`Failed to update date: ${res.statusText}`)
      }

      const updatedTodo: Todo = parseTodoDates(await res.json())
      setTodos((prevTodos: Todo[]) => {
        const newTodos = prevTodos.map((t: Todo) => t.id === id ? updatedTodo : t)
        localStorage.setItem("todos", JSON.stringify(newTodos))
        return newTodos
      })
    } catch (error) {
      if (previousTodo) {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map((t: Todo) => t.id === id ? previousTodo! : t)
        )
      }

      modals.open({
        title: "Failed to update date",
        children: (
          <Text size="sm">
            There was an error updating the date. Please try again.
          </Text>
        ),
      })
    }
  }, [])

  const deleteTodo = useCallback(async (id: number, undo?: () => void) => {
    const previousTodo = todos.find(t => t.id === id)
    setTodos(prevTodos => prevTodos.filter(t => t.id !== id))

    const undoDelete = () => {
      if (previousTodo) {
        setTodos(prevTodos => [...prevTodos, previousTodo].sort((a, b) => a.id - b.id))
      }
    }

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error(`Failed to delete todo: ${res.statusText}`)
      }

      localStorage.removeItem("todos")

      notifications.show({
        title: "Todo deleted",
        message: (
          <div>
            The todo has been deleted.{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                undoDelete()
              }}
              style={{ color: 'var(--mantine-color-blue-4)', textDecoration: 'underline' }}
            >
              Undo
            </a>
          </div>
        ),
        color: "red",
        autoClose: 5000,
      })
    } catch (error) {
      if (previousTodo) {
        setTodos(prevTodos => [...prevTodos, previousTodo].sort((a, b) => a.id - b.id))
      }

      modals.open({
        title: "Failed to delete todo",
        children: (
          <Text size="sm">
            There was an error deleting the todo. Please try again.
          </Text>
        ),
      })
    }
  }, [todos])

  const todosById = useMemo(() => {
    if (!todos) return new Map<number, Todo>()
    const cache = new Map<number, Todo>()
    todos.forEach(todo => {
      cache.set(todo.id, todo)
    })
    return cache
  }, [todos])

  const itemWrapperStyle = useMemo(() => ({ marginBottom: "12px" }), [])

  const handleNavigate = useCallback((id: number) => {
    const newQuery = `id:${id}`
    setSearchInput(newQuery)
    const url = new URL(window.location.href)
    url.searchParams.set('q', newQuery)
    window.history.pushState({}, '', url.toString())
  }, [])

  const handleBackFromDetail = useCallback(() => {
    setSearchInput(DEFAULT_SEARCH_QUERY)
    const url = new URL(window.location.href)
    url.searchParams.set('q', DEFAULT_SEARCH_QUERY)
    window.history.pushState({}, '', url.toString())
  }, [])

  const renderTodoItem = useCallback((index: number, todoId: number) => {
    const todo = todosById.get(todoId)!
    return (
      <div style={itemWrapperStyle}>
        <TodoCard
          todo={todo}
          onStatusChange={updateTodoStatus}
          onPriorityChange={updateTodoPriority}
          onNavigate={handleNavigate}
          onDateChange={updateTodoDate}
          onDelete={deleteTodo}
        />
      </div>
    )
  }, [todosById, updateTodoStatus, updateTodoPriority, handleNavigate, updateTodoDate, deleteTodo, itemWrapperStyle])

  const parsedQuery = useMemo(() => {
    try {
      const parsed = parseQuery(searchInput)
      return buildQuery(parsed)
    } catch (error) {
      return {
        filter: () => true,
        actions: null,
        create: null,
        sort: null,
        error: error instanceof Error ? error.message : 'Parse error'
      }
    }
  }, [searchInput])

  const lastValidQueryRef = useRef(parsedQuery)

  useEffect(() => {
    if (!('error' in parsedQuery)) {
      lastValidQueryRef.current = parsedQuery
    }
  }, [parsedQuery])

  const activeQuery = useMemo(() => {
    if ('error' in parsedQuery && parsedQuery.error) {
      return lastValidQueryRef.current
    }
    return parsedQuery
  }, [parsedQuery])

  const filteredAndSortedTodoIds = useMemo(() => {
    let filtered = todos.filter(activeQuery.filter)

    if (activeQuery.sort && activeQuery.sort.length > 0) {
      filtered = [...filtered]

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

      filtered.sort((a, b) => {
        for (const sortField of activeQuery.sort!) {
          const field = sortField.field
          const multiplier = sortField.reverse ? -1 : 1
          let comparison = 0

          if (field === 'created') {
            comparison = a.created_at.getTime() - b.created_at.getTime()
          } else if (field === 'updated') {
            comparison = a.updated_at.getTime() - b.updated_at.getTime()
          } else if (field === 'priority') {
            comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          } else if (field === 'status') {
            comparison = statusOrder[a.status] - statusOrder[b.status]
          } else if (field === 'title') {
            comparison = a.title.toLowerCase().localeCompare(b.title.toLowerCase())
          }

          if (comparison !== 0) {
            return comparison * multiplier
          }
        }
        return 0
      })
    }

    return filtered.map(t => t.id)
  }, [todos, activeQuery])

  const autocompleteOptions = useMemo(() => {
    try {
      return getAutocompletions(searchInput, searchInput.length)
    } catch (error) {
      return []
    }
  }, [searchInput])

  const errorMessage = useMemo(() => {
    if ('error' in parsedQuery && parsedQuery.error) {
      return parsedQuery.error
    }

    const datePattern = /(after|before):([A-Za-z0-9-]+|".*?")/g
    let match: RegExpExecArray | null
    let hasInvalidDate = false

    while ((match = datePattern.exec(searchInput)) !== null) {
      const dateString = match[2].replace(/"/g, '')

      let isValid = false

      const parsedDate = chrono.parseDate(dateString)
      if (parsedDate) {
        isValid = true
      } else if (/^\d{4}$/.test(dateString)) {
        isValid = true
      } else {
        const jsDate = new Date(dateString)
        if (!isNaN(jsDate.getTime())) {
          isValid = true
        }
      }

      if (!isValid) {
        hasInvalidDate = true
        break
      }
    }

    return hasInvalidDate ? 'Invalid date format in filter' : null
  }, [searchInput, parsedQuery])

  const isSearching = searchInput.trim().length > 0
  const hasSearchOperators = /status:|priority:|created:|updated:|completed:|title:|comment:|description:|id:|sort:/.test(searchInput)
  const hasActionOperator = searchInput.includes('>')
  const showChart = searchInput === DEFAULT_SEARCH_QUERY || searchInput === ''
  const hasIdFilter = /id:\d+/.test(searchInput)
  const selectedTodoId = useMemo(() => {
    const match = searchInput.match(/id:(\d+)/)
    return match ? parseInt(match[1]) : null
  }, [searchInput])

  const showDetailView = useMemo(() => {
    if (hasIdFilter && selectedTodoId && todosById.get(selectedTodoId)) {
      return true
    }
    if (filteredAndSortedTodoIds.length === 1 && !hasIdFilter) {
      return true
    }
    return false
  }, [hasIdFilter, selectedTodoId, todosById, filteredAndSortedTodoIds])

  const detailTodoId = useMemo(() => {
    if (hasIdFilter && selectedTodoId) {
      return selectedTodoId
    }
    if (filteredAndSortedTodoIds.length === 1) {
      return filteredAndSortedTodoIds[0]
    }
    return null
  }, [hasIdFilter, selectedTodoId, filteredAndSortedTodoIds])

  if (isLoading || !todos) {
    return (
      <Container size="lg" py="xl">
        <Text>Loading...</Text>
      </Container>
    )
  }

  const handleAutocompleteSelect = (value: string) => {
    setSearchInput(value)
    setTimeout(() => {
      if (searchInputRef.current) {
        const input = searchInputRef.current.querySelector('input')
        if (input) {
          input.focus()
          input.setSelectionRange(input.value.length, input.value.length)
        }
      }
    }, 0)
  }

  const handleChartBarClick = (dateString: string) => {
    const today = moment()
    const date = moment(dateString)

    let newQuery: string;
    if (today.isSame(date, 'day')) {
      newQuery = 'completed:today'
    } else if (today.subtract(1, 'day').isSame(date, 'day')) {
      newQuery = 'completed:yesterday'
    } else {
      newQuery = `completed:${date.format('dddd').toLowerCase()}`
    }

    setSearchInput(newQuery)
    const url = new URL(window.location.href)
    url.searchParams.set('q', newQuery)
    window.history.pushState({}, '', url.toString())
  }

  return (
    <Container size="xl" py="xl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", ...(showDetailView ? {} : { height: "100vh" }) }}>
      <Stack gap="xl" style={{ ...(showDetailView ? {} : { flex: 1, minHeight: 0 }) }}>
        <div style={{ display: showChart && !showDetailView ? "block" : "none" }}>
          <CompletionChart onBarClick={handleChartBarClick}/>
        </div>

        <Card padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <div style={{ position: 'relative' }}>
              <Group gap="md">
                <div style={{ flex: 1, position: 'relative' }}>
                  <Autocomplete
                    ref={searchInputRef}
                    placeholder="New or search (is:open is:closed sort:!created,priority status: priority: title: before: after: comment: description:)"
                    value={searchInput}
                    onChange={it => setSearchInput(it)}
                    onBlur={() => {
                      const url = new URL(window.location.href)
                      const currentQuery = url.searchParams.get('q')
                      if (currentQuery !== searchInput) {
                        url.searchParams.set('q', searchInput)
                        window.history.replaceState({}, '', url.toString())
                      }
                    }}
                    onOptionSubmit={handleAutocompleteSelect}
                    filter={it => it.options}
                    data={autocompleteOptions || []}
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && autocompleteOptions.length > 0) {
                        e.preventDefault()
                        const firstOption = autocompleteOptions[0]
                        if (firstOption) {
                          handleAutocompleteSelect(firstOption)
                        }
                      }
                      if (e.key === "Enter") {
                        if (hasActionOperator && parsedQuery.actions && !errorMessage) {
                          e.preventDefault()
                          executeAction()
                        } else if (!hasSearchOperators && isSearching) {
                          e.preventDefault()
                          createTodo()
                        }
                      }
                    }}
                    style={{ width: '100%' }}
                    styles={errorMessage ? {
                      input: {
                        borderColor: '#fa5252',
                      }
                    } : hasActionOperator && parsedQuery.actions ? {
                      input: {
                        borderColor: 'var(--mantine-color-blue-5)',
                        borderWidth: '2px',
                      }
                    } : undefined}
                    size="md"
                    limit={10}
                    comboboxProps={{
                      position: "bottom-start",
                      shadow: "md",
                    }}
                    spellCheck={false}
                    error={!!errorMessage}
                  />
                  {errorMessage && (
                    <Text size="xs" c="red" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px' }}>
                      {errorMessage}
                    </Text>
                  )}
                  {hasActionOperator && parsedQuery.actions && !errorMessage && (
                    <Text size="xs" c="blue" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px' }}>
                      Action will be executed on {filteredAndSortedTodoIds.length} todo{filteredAndSortedTodoIds.length !== 1 ? 's' : ''}
                    </Text>
                  )}
                </div>
                {isSearching && !hasSearchOperators && (
                  <Button onClick={createTodo} size="md">
                    Add Todo
                  </Button>
                )}
                {hasActionOperator && parsedQuery.actions && !errorMessage && (
                  <Button onClick={executeAction} size="md" color="blue">
                    Execute Action
                  </Button>
                )}
              </Group>
            </div>
          </Stack>
        </Card>

        {showDetailView && detailTodoId && (
          <TodoDetail
            todoId={detailTodoId}
            initialTodo={todosById.get(detailTodoId) || null}
            onBack={handleBackFromDetail}
          />
        )}

        <div style={{ display: showDetailView ? "none" : "flex", flex: 1, minHeight: 0 }}>
          {filteredAndSortedTodoIds.length === 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              color: 'var(--mantine-color-dimmed)'
            }}>
              <Text size="lg">No results found</Text>
            </div>
          ) : (
            <Virtuoso
              style={{ flex: 1, minHeight: 0, overflowY: "auto" }}
              data={filteredAndSortedTodoIds}
              itemContent={renderTodoItem}
            />
          )}
        </div>
      </Stack>
    </Container>
  )
}
