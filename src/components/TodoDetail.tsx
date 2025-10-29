"use client"

import { CommentSection } from "@/components/CommentSection"
import { useTodos } from "@/contexts/TodoContext"
import { Comment } from "@/lib/entities/Comment"
import { Todo, TodoPriority, TodoStatus } from "@/lib/entities/Todo"
import { Button, Card, Container, Group, Select, Stack, Text, Textarea, TextInput } from "@mantine/core"
import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import moment from "moment"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

const priorityColors: Record<TodoPriority, string> = {
  "Low": "var(--mantine-color-gray-6)",
  "Medium": "var(--mantine-color-blue-6)",
  "High": "var(--mantine-color-orange-6)",
  "Critical": "var(--mantine-color-red-6)",
}

const statusColors: Record<TodoStatus, string> = {
  "Created": "var(--mantine-color-gray-6)",
  "Pending": "var(--mantine-color-yellow-6)",
  "Work in progress": "var(--mantine-color-violet-6)",
  "Blocked by": "var(--mantine-color-pink-6)",
  "Completed": "var(--mantine-color-green-6)",
}

interface TodoDetailProps {
  todoId: number;
  initialTodo: Todo | null;
  onBack?: () => void;
}

export function TodoDetail({ todoId, initialTodo, onBack }: TodoDetailProps) {
  const router = useRouter()
  const { todos: contextTodos, updateTodoInCache, deleteTodoFromCache } = useTodos()

  const [todo, setTodo] = useState<Todo | null>(initialTodo)
  const [comments, setComments] = useState<Comment[]>(initialTodo?.comments || [])

  const [title, setTitle] = useState(initialTodo?.title || "")
  const [description, setDescription] = useState(initialTodo?.description || "")
  const [status, setStatus] = useState<TodoStatus>(initialTodo?.status || "Created")
  const [priority, setPriority] = useState<TodoPriority>(initialTodo?.priority || "Medium")
  const [needByDate, setNeedByDate] = useState(initialTodo?.need_by_date || "")
  const [blockedById, setBlockedById] = useState<string | null>(initialTodo?.blocked_by_id ? initialTodo.blocked_by_id.toString() : null)

  const priorityStyles = useMemo(() => ({
    input: {
      backgroundColor: priorityColors[priority],
      borderColor: priorityColors[priority],
      color: "var(--mantine-color-white)",
      fontWeight: 500,
    }
  }), [priority])

  const statusStyles = useMemo(() => ({
    input: {
      backgroundColor: statusColors[status],
      borderColor: statusColors[status],
      color: "var(--mantine-color-white)",
      fontWeight: 500,
    }
  }), [status])

  const loadTodo = async () => {
    const todoRes = await fetch(`/api/todos/${todoId}`, { cache: "no-store" })
    const todoData = await todoRes.json()

    setTodo(todoData)
    setComments(todoData.comments || [])

    setTitle(todoData.title)
    setDescription(todoData.description || "")
    setStatus(todoData.status)
    setPriority(todoData.priority)
    setNeedByDate(todoData.need_by_date || "")
    setBlockedById(todoData.blocked_by_id ? todoData.blocked_by_id.toString() : null)
  }

  useEffect(() => {
    if (initialTodo) {
      loadTodo()
    } else {
      const cachedTodo = localStorage.getItem(`todo-${todoId}`)
      if (cachedTodo) {
        const todoData = JSON.parse(cachedTodo)
        setTodo(todoData)
        setComments(todoData.comments || [])
        setTitle(todoData.title)
        setDescription(todoData.description || "")
        setStatus(todoData.status)
        setPriority(todoData.priority)
        setNeedByDate(todoData.need_by_date || "")
        setBlockedById(todoData.blocked_by_id ? todoData.blocked_by_id.toString() : null)
      }
      loadTodo()
    }
  }, [todoId])

  useEffect(() => {
    const contextTodo = contextTodos.find(t => t.id === todoId)
    if (contextTodo) {
      setTodo(contextTodo)
      setTitle(contextTodo.title)
      setDescription(contextTodo.description || "")
      setStatus(contextTodo.status)
      setPriority(contextTodo.priority)
      setNeedByDate(contextTodo.need_by_date || "")
      setBlockedById(contextTodo.blocked_by_id ? contextTodo.blocked_by_id.toString() : null)
      setComments(contextTodo.comments || [])
    }
  }, [contextTodos, todoId])

  const updateTodo = async (updates: Partial<Todo>) => {
    const previousTodo = todo
    
    setTodo(prev => prev ? { ...prev, ...updates } : prev)
    updateTodoInCache(todoId, updates)

    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!res.ok) {
        throw new Error(`Failed to update todo: ${res.statusText}`)
      }

      const updatedTodo = await res.json()
      setTodo(updatedTodo)
      
      localStorage.setItem(`todo-${todoId}`, JSON.stringify({ ...updatedTodo, comments }))
      localStorage.removeItem("todos")

      notifications.show({
        title: "Todo updated",
        message: "Your changes have been saved",
        color: "green",
      })
    } catch (error) {
      setTodo(previousTodo)
      if (previousTodo) {
        updateTodoInCache(todoId, previousTodo)
      }
      
      modals.open({
        title: "Failed to update todo",
        children: (
          <Text size="sm">
            There was an error updating your todo. Please try again.
          </Text>
        ),
      })
    }
  }

  const addComment = async (content: string) => {
    const tempId = -Date.now()
    
    const optimisticComment: Comment = {
      id: tempId,
      todo_id: todoId,
      content,
      created_at: new Date(),
    }

    const updatedComments = [...comments, optimisticComment]
    setComments(updatedComments)

    try {
      const res = await fetch(`/api/todos/${todoId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (!res.ok) {
        throw new Error(`Failed to add comment: ${res.statusText}`)
      }

      const comment = await res.json()
      const finalComments = updatedComments.map(c => c.id === tempId ? comment : c)
      setComments(finalComments)

      if (todo) {
        localStorage.setItem(`todo-${todoId}`, JSON.stringify({ ...todo, comments: finalComments }))
      }

      notifications.show({
        title: "Comment added",
        message: "Your comment has been added",
        color: "green",
      })
    } catch (error) {
      setComments(comments)
      
      modals.open({
        title: "Failed to add comment",
        children: (
          <Text size="sm">
            There was an error adding your comment. Please try again.
          </Text>
        ),
      })
    }
  }

  const updateComment = async (commentId: number, content: string) => {
    const previousComments = comments
    
    const optimisticComments = comments.map(c => 
      c.id === commentId ? { ...c, content } : c
    )
    setComments(optimisticComments)

    try {
      const res = await fetch(`/api/todos/${todoId}/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (!res.ok) {
        throw new Error(`Failed to update comment: ${res.statusText}`)
      }

      const updatedComment = await res.json()
      const updatedComments = comments.map(c => c.id === commentId ? updatedComment : c)
      setComments(updatedComments)

      if (todo) {
        localStorage.setItem(`todo-${todoId}`, JSON.stringify({ ...todo, comments: updatedComments }))
      }

      notifications.show({
        title: "Comment updated",
        message: "Your comment has been updated",
        color: "green",
      })
    } catch (error) {
      setComments(previousComments)
      
      modals.open({
        title: "Failed to update comment",
        children: (
          <Text size="sm">
            There was an error updating your comment. Please try again.
          </Text>
        ),
      })
    }
  }

  const deleteComment = async (commentId: number) => {
    const previousComments = comments
    const updatedComments = comments.filter(c => c.id !== commentId)
    
    setComments(updatedComments)

    try {
      const res = await fetch(`/api/todos/${todoId}/comments/${commentId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error(`Failed to delete comment: ${res.statusText}`)
      }

      if (todo) {
        localStorage.setItem(`todo-${todoId}`, JSON.stringify({ ...todo, comments: updatedComments }))
      }

      notifications.show({
        title: "Comment deleted",
        message: "Your comment has been deleted",
        color: "green",
      })
    } catch (error) {
      setComments(previousComments)
      
      modals.open({
        title: "Failed to delete comment",
        children: (
          <Text size="sm">
            There was an error deleting your comment. Please try again.
          </Text>
        ),
      })
    }
  }

  const handleStatusChange = (newStatus: string | null) => {
    if (!newStatus) {
      return
    }
    const typedStatus = newStatus as TodoStatus
    setStatus(typedStatus)

    const completedAt = typedStatus === "Completed" ? moment().toISOString() : null
    updateTodo({ status: typedStatus, completed_at: completedAt })
  }

  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Delete To Do",
      children: (
        <Text size="sm">
          Are you sure you want to permanently delete this to do? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        await fetch(`/api/todos/${todoId}`, {
          method: "DELETE",
        })

        deleteTodoFromCache(todoId)
        localStorage.removeItem(`todo-${todoId}`)
        localStorage.removeItem("todos")

        notifications.show({
          title: "To Do deleted",
          message: "Your to do has been permanently deleted",
          color: "red",
        })

        if (onBack) {
          onBack()
        } else {
          router.push("/")
        }
      },
    })
  }

  const blockableTodos = contextTodos.filter(t => t.id.toString() !== todoId.toString())

  return (
    <Stack gap="xl" style={{ width: "100%" }}>
      <Group justify="flex-start">
        <Button variant="subtle" color="red" onClick={handleDelete}>
          Delete To Do
        </Button>
      </Group>

        <Card padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <style type="text/css">{`
              option {
                background: var(--mantine-color-gray-8);
              }
            `}</style>
            <TextInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => updateTodo({ title })}
              size="md"
            />

            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => updateTodo({ description })}
              minRows={4}
              size="md"
            />

            <Group grow>
              <Select
                label="Status"
                value={status}
                onChange={handleStatusChange}
                styles={statusStyles}
                data={[
                  { value: "Created", label: "Created" },
                  { value: "Pending", label: "Pending" },
                  { value: "Work in progress", label: "Work in progress" },
                  { value: "Blocked by", label: "Blocked by" },
                  { value: "Completed", label: "Completed" },
                ]}
              />

              <Select
                label="Priority"
                value={priority}
                onChange={(value) => {
                  setPriority(value as TodoPriority)
                  updateTodo({ priority: value as TodoPriority })
                }}
                styles={priorityStyles}
                data={[
                  { value: "Low", label: "Low" },
                  { value: "Medium", label: "Medium" },
                  { value: "High", label: "High" },
                  { value: "Critical", label: "Critical" },
                ]}
              />
            </Group>

            <TextInput
              label="Need By Date"
              type="date"
              value={needByDate}
              onChange={(e) => setNeedByDate(e.target.value)}
              onBlur={() => updateTodo({ need_by_date: needByDate || null })}
              size="md"
            />

            {status === "Blocked by" && (
              <Select
                label="Blocked By"
                value={blockedById}
                onChange={(value) => {
                  setBlockedById(value)
                  updateTodo({ blocked_by_id: value ? parseInt(value) : null })
                }}
                data={blockableTodos.map(t => ({
                  value: t.id.toString(),
                  label: t.title,
                }))}
                clearable
                searchable
                onKeyDown={(e) => {
                  if (e.key === "Tab" && e.currentTarget.getAttribute("data-expanded") === "true") {
                    const activeOption = document.querySelector("[data-combobox-option][data-combobox-active=\"true\"]")
                    if (activeOption) {
                      e.preventDefault()
                      const value = activeOption.getAttribute("data-value")
                      setBlockedById(value)
                      updateTodo({ blocked_by_id: value ? parseInt(value) : null })
                    }
                  }
                }}
              />
            )}
          </Stack>
        </Card>

        <CommentSection
          comments={comments}
          onAddComment={addComment}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
        />
    </Stack>
  )
}

