"use client"

import { CompletionChart } from "@/components/CompletionChart"
import { TodoCard } from "@/components/TodoCard"
import { TodoDetail } from "@/components/TodoDetail"
import { useTodos } from "@/contexts/TodoContext"
import { Todo, TodoPriority, TodoStatus } from "@/lib/entities/Todo"
import { TodoSearchManager, DEFAULT_SEARCH_QUERY } from "@/utils/TodoSearchManager"
import { parseTodoListDates, parseTodoDates } from "@/utils/dateParser"
import { Autocomplete, Button, Card, Container, Group, Stack, Text } from "@mantine/core"
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

    const handleGlobalEscape = (e: KeyboardEvent) => {
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
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('keydown', handleGlobalEscape)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('keydown', handleGlobalEscape)
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

    const title = searchInput.trim()
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

  const filteredAndSortedTodoIds = useMemo(() => {
    return TodoSearchManager.filterAndSortTodos(todos, searchInput)
  }, [todos, searchInput])

  const autocompleteOptions = useMemo(() => {
    return TodoSearchManager.getAutocompleteOptions(searchInput)
  }, [searchInput])

  const invalidDateRanges = useMemo(() => {
    const ranges: Array<{ start: number; end: number }> = []
    const datePattern = /(after|before):([A-Za-z0-9-]+|".*?")/g
    let match: RegExpExecArray | null

    while ((match = datePattern.exec(searchInput)) !== null) {
      const dateString = match[2]
      const matchStart = match.index
      const matchEnd = matchStart + match[0].length

      const parsedDate = chrono.parseDate(dateString)
      const isMomentValid = moment(dateString, ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'], true).isValid()

      if (!parsedDate && !isMomentValid) {
        ranges.push({ start: matchStart, end: matchEnd })
      }
    }

    return ranges
  }, [searchInput])

  const isSearching = TodoSearchManager.isSearching(searchInput)
  const hasSearchOperators = TodoSearchManager.hasSearchOperators(searchInput)
  const showChart = TodoSearchManager.isDefaultSearch(searchInput)
  const hasIdFilter = TodoSearchManager.hasIdFilter(searchInput)
  const selectedTodoId = TodoSearchManager.extractIdFromFilter(searchInput)

  if (isLoading || !todos) {
    return (
      <Container size="lg" py="xl">
        <Text>Loading...</Text>
      </Container>
    )
  }

  const handleAutocompleteSelect = (value: string) => {
    const newValue = TodoSearchManager.handleAutocompleteSelect(searchInput, value)
    setSearchInput(newValue)
  }

  const handleChartBarClick = (date: string) => {
    const nextDayStr = moment(date).add(1, 'day').format('YYYY-MM-DD')
    const newQuery = `before:${nextDayStr} after:${date} is:closed`
    setSearchInput(newQuery)
    const url = new URL(window.location.href)
    url.searchParams.set('q', newQuery)
    window.history.pushState({}, '', url.toString())
  }

  return (
    <Container size="xl" py="xl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", ...(hasIdFilter ? {} : { height: "100vh" }) }}>
      <Stack gap="xl" style={{ ...(hasIdFilter ? {} : { flex: 1, minHeight: 0 }) }}>
        <div style={{ display: showChart && !hasIdFilter ? "block" : "none" }}>
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
                      if (e.key === "Enter" && !hasSearchOperators && isSearching) {
                        e.preventDefault()
                        createTodo()
                      }
                    }}
                    style={{ width: '100%' }}
                    styles={invalidDateRanges.length > 0 ? {
                      input: {
                        borderColor: '#fa5252',
                      }
                    } : undefined}
                    size="md"
                    limit={10}
                    comboboxProps={{
                      position: "bottom-start",
                      shadow: "md",
                    }}
                    spellCheck={false}
                    error={invalidDateRanges.length > 0}
                  />
                  {invalidDateRanges.length > 0 && (
                    <Text size="xs" c="red" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px' }}>
                      Invalid date format in filter
                    </Text>
                  )}
                </div>
                {isSearching && !hasSearchOperators && (
                  <Button onClick={createTodo} size="md">
                    Add Todo
                  </Button>
                )}
              </Group>
            </div>
          </Stack>
        </Card>

        {hasIdFilter && selectedTodoId && (
          <TodoDetail
            todoId={selectedTodoId}
            initialTodo={todosById.get(selectedTodoId) || null}
            onBack={handleBackFromDetail}
          />
        )}

        <div style={{ display: hasIdFilter ? "none" : "flex", flex: 1, minHeight: 0 }}>
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
