"use client"

import { useTodos } from "@/contexts/TodoContext"
import { Todo, TodoPriority, TodoStatus } from "@/lib/entities/Todo"
import { searchTodos } from "@/utils/todoSearch"
import { Autocomplete, Badge, Button, Card, Container, Group, Select, Stack, Switch, Text, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface CompletionData {
  date: string;
  count: number;
}

const statusColors: Record<TodoStatus, string> = {
  "Created": "gray",
  "Pending": "blue",
  "Work in progress": "yellow",
  "Blocked by": "red",
  "Completed": "green",
}

const priorityColors: Record<TodoPriority, string> = {
  "Low": "gray",
  "Medium": "blue",
  "High": "orange",
  "Critical": "red",
}

export default function Home() {
  const router = useRouter()
  const { todos, setTodos: setContextTodos } = useTodos()
  const [completionData, setCompletionData] = useState<CompletionData[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showCompleted, setShowCompleted] = useState(false)

  const setTodos = (newTodos: Todo[]) => {
    setContextTodos(newTodos)
  }

  const loadData = async () => {
    const [todosRes, statsRes] = await Promise.all([
      fetch("/api/todos", { cache: "no-store" }),
      fetch("/api/stats/completion?days=7", { cache: "no-store" }),
    ])

    const todosData = await todosRes.json()
    const statsData = await statsRes.json()

    setTodos(todosData)
    setCompletionData(statsData)
    setIsLoading(false)
  }

  useEffect(() => {
    const cachedTodos = localStorage.getItem("todos")
    const cachedStats = localStorage.getItem("completionStats")

    if (cachedTodos && cachedStats) {
      setTodos(JSON.parse(cachedTodos))
      setCompletionData(JSON.parse(cachedStats))
      setIsLoading(false)
    }

    loadData().then(() => {
      localStorage.setItem("todos", JSON.stringify(todos))
      localStorage.setItem("completionStats", JSON.stringify(completionData))
    })
  }, [])

  const createTodo = async () => {
    if (!searchInput.trim()) {
      return
    }

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: searchInput }),
    })

    const newTodo = await res.json()
    setTodos([newTodo, ...todos])
    setSearchInput("")

    localStorage.setItem("todos", JSON.stringify([newTodo, ...todos]))

    notifications.show({
      title: "Todo created",
      message: "Your todo has been created successfully",
      color: "green",
    })
  }

  const updateTodoStatus = async (id: number, status: TodoStatus) => {
    const completedAt = status === "Completed" ? new Date().toISOString() : null

    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, completed_at: completedAt }),
    })

    const updatedTodo = await res.json()
    const newTodos = todos.map(t => t.id === id ? updatedTodo : t)
    setTodos(newTodos)

    localStorage.setItem("todos", JSON.stringify(newTodos))

    if (status === "Completed") {
      loadData()
    }
  }

  const updateTodoPriority = async (id: number, priority: TodoPriority) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    })

    const updatedTodo = await res.json()
    const newTodos = todos.map(t => t.id === id ? updatedTodo : t)
    setTodos(newTodos)

    localStorage.setItem("todos", JSON.stringify(newTodos))
  }

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().subtract(6 - i, "day").format("YYYY-MM-DD")
    const dataPoint = completionData.find(d => d.date === date)
    return {
      date: dayjs(date).format("MMM D"),
      count: dataPoint?.count || 0,
    }
  })

  const isSearching = searchInput.trim().length > 0
  const hasSearchOperators = /status:|priority:|after:|before:|title:|comment:|description:/.test(searchInput)

  const filteredTodos = searchTodos(todos, searchInput).filter(todo =>
    isSearching || showCompleted || todo.status !== "Completed"
  )

  const autocompleteOptions = useMemo(() => {
    const input = searchInput.toLowerCase()
    const lastWord = input.split(/\s+/).pop() || ""

    function addBangs(options: string[]): string[] {
      return [
        ...options,
        ...options.map(it => it.substring(0, it.indexOf(":")) + ":!" + it.substring(it.indexOf(":") + 1))
      ]
    }

    function computeOptions() {
      if (!lastWord.includes(":")) {
        return []
      }

      const statusValues = addBangs(["status:open", "status:created", "status:pending", "status:wip", "status:blocked", "status:completed"])
      const priorityValues = addBangs(["priority:low", "priority:medium", "priority:high", "priority:critical"])

      if (lastWord.startsWith("status:")) {
        if (lastWord === "status:") {
          return statusValues
        }
        return statusValues.filter(v => v.replace("!", "").startsWith(lastWord))
      }

      if (lastWord.startsWith("priority:")) {
        if (lastWord === "priority:") {
          return priorityValues
        }
        return priorityValues.filter(v => v.replace("!", "").startsWith(lastWord))
      }

      if (lastWord.startsWith("title:")) {
        return ["title:", "title:!\"text\"", "title:word"]
      }

      if (lastWord.startsWith("description:")) {
        return ["description:", "description:!\"text\"", "description:word"]
      }

      if (lastWord.startsWith("comment:")) {
        return ["comment:", "comment:!\"text\"", "comment:word"]
      }

      if (lastWord.startsWith("after:")) {
        const today = new Date().toISOString().split("T")[0]
        return [`after:${today}`, "after:2024-01-01", "after:2024"]
      }

      if (lastWord.startsWith("before:")) {
        const today = new Date().toISOString().split("T")[0]
        return [`before:${today}`, "before:2024-12-31", "before:2025"]
      }

      return []
    }

    function prefixOptions(options: string[]) {
      return options.map((option) =>
        input.substring(0, input.length - lastWord.length) + option
      )
    }

    return prefixOptions(computeOptions())
  }, [searchInput])

  const handleAutocompleteSelect = (value: string) => {
    const words = searchInput.split(/\s+/)
    words[words.length - 1] = value
    setSearchInput(words.join(" ") + " ")
  }

  if (isLoading || !todos) {
    return (
      <Container size="lg" py="xl">
        <Text>Loading...</Text>
      </Container>
    )
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Card padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">Completion Chart (Last 7 Days)</Title>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
              <XAxis dataKey="date" stroke="#71717a"/>
              <YAxis stroke="#71717a"/>
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a" }}
                labelStyle={{ color: "#fafafa" }}
              />
              <Bar dataKey="count" fill="#22c55e"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group gap="md">
              <Autocomplete
                placeholder="New or search (status:open priority:high title:buy before:2023 after: comment: description:)"
                value={searchInput}
                onChange={setSearchInput}
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
            {!isSearching && (
              <Switch
                label="Show completed todos"
                checked={showCompleted}
                onChange={(event) => setShowCompleted(event.currentTarget.checked)}
              />
            )}
          </Stack>
        </Card>

        <Stack gap="md">
          {filteredTodos.map((todo) => (
            <Card
              key={todo.id}
              padding="lg"
              radius="md"
              withBorder
              style={{ cursor: "pointer" }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Stack gap="xs" style={{ flex: 1 }} onClick={() => router.push(`/todos/${todo.id}`)}>
                  <Text size="lg" fw={500}>{todo.title}</Text>
                  {todo.description && (
                    <Text size="sm" c="dimmed" lineClamp={1}>{todo.description}</Text>
                  )}
                  {todo.need_by_date && (
                    <Text size="xs" c="dimmed">
                      Due: {dayjs(todo.need_by_date).format("MMM D, YYYY")}
                    </Text>
                  )}
                </Stack>
                <Group gap="sm" wrap="nowrap">
                  <Select
                    value={todo.priority}
                    onChange={(value) => updateTodoPriority(todo.id, value as TodoPriority)}
                    data={[
                      { value: "Low", label: "Low" },
                      { value: "Medium", label: "Medium" },
                      { value: "High", label: "High" },
                      { value: "Critical", label: "Critical" },
                    ]}
                    renderOption={({ option }) => (
                      <Badge color={priorityColors[option.value as TodoPriority]} fullWidth>
                        {option.label}
                      </Badge>
                    )}
                    styles={{
                      input: {
                        fontWeight: 500,
                        color: `var(--mantine-color-${priorityColors[todo.priority]}-6)`,
                      }
                    }}
                    style={{ width: 120 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Select
                    value={todo.status}
                    onChange={(value) => updateTodoStatus(todo.id, value as TodoStatus)}
                    data={[
                      { value: "Created", label: "Created" },
                      { value: "Pending", label: "Pending" },
                      { value: "Work in progress", label: "Work in progress" },
                      { value: "Blocked by", label: "Blocked by" },
                      { value: "Completed", label: "Completed" },
                    ]}
                    style={{ width: 200 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}
