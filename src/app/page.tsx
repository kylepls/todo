"use client"

import { CompletionChart } from "@/components/CompletionChart"
import { TodoCard } from "@/components/TodoCard"
import { TodoDetail } from "@/components/TodoDetail"
import { useTodos } from "@/contexts/TodoContext"
import { Todo, TodoPriority, TodoStatus } from "@/lib/entities/Todo"
import { TodoSearchManager } from "@/utils/TodoSearchManager"
import { parseTodoListDates, parseTodoDates } from "@/utils/dateParser"
import { Autocomplete, Button, Card, Container, Group, Stack, Text } from "@mantine/core"
import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Virtuoso } from "react-virtuoso"
import moment from "moment"

export default function Home() {
  const { todos, setTodos } = useTodos()
  const [isLoading, setIsLoading] = useState(true)

  const [searchInput, setSearchInput] = useState("")

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
    setSearchInput("is:open sort:!created,priority")

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

      const updatedTodo: Todo = await res.json()
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

      const updatedTodo: Todo = await res.json()
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
    setSearchInput(`id:${id}`)
  }, [])

  const handleBackFromDetail = useCallback(() => {
    setSearchInput("is:open sort:!created,priority")
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
        />
      </div>
    )
  }, [todosById, updateTodoStatus, updateTodoPriority, handleNavigate, itemWrapperStyle])

  const filteredAndSortedTodoIds = useMemo(() => {
    return TodoSearchManager.filterAndSortTodos(todos, searchInput)
  }, [todos, searchInput])

  const autocompleteOptions = useMemo(() => {
    return TodoSearchManager.getAutocompleteOptions(searchInput)
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
    setSearchInput(`before:${nextDayStr} after:${date} is:closed`)
  }

  return (
    <Container size="xl" py="xl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", ...(hasIdFilter ? {} : { height: "100vh" }) }}>
      <Stack gap="xl" style={{ ...(hasIdFilter ? {} : { flex: 1, minHeight: 0 }) }}>
        <div style={{ display: showChart && !hasIdFilter ? "block" : "none" }}>
          <CompletionChart onBarClick={handleChartBarClick}/>
        </div>

        <Card padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group gap="md">
              <Autocomplete
                placeholder="New or search (is:open is:closed sort:!created,priority status: priority: title: before: after: comment: description:)"
                value={searchInput}
                onChange={it => setSearchInput(it)}
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
                style={{ flex: 1 }}
                size="md"
                limit={10}
                comboboxProps={{
                  position: "bottom-start",
                  shadow: "md",
                }}
              />
              {isSearching && !hasSearchOperators && (
                <Button onClick={createTodo} size="md">
                  Add Todo
                </Button>
              )}
            </Group>
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
          <Virtuoso
            style={{ flex: 1, minHeight: 0, overflowY: "auto" }}
            data={filteredAndSortedTodoIds}
            itemContent={renderTodoItem}
          />
        </div>
      </Stack>
    </Container>
  )
}
