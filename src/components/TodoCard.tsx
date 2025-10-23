import { Todo, TodoPriority, TodoStatus } from "@/lib/entities/Todo"
import { Card, Group, NativeSelect, Stack, Text } from "@mantine/core"
import moment from "moment"
import React, { useCallback, useMemo } from "react"

const cardStyle = {
  cursor: "pointer",
  backgroundColor: "var(--mantine-color-secondary-filled)",
  borderRadius: 0
}

const stackStyle = { flex: 1 }

const prioritySelectStyle = { width: 120 }
const statusSelectStyle = { width: 200 }

const priorityColors: Record<TodoPriority, string> = {
  "Low": "var(--mantine-color-gray-6)",
  "Medium": "var(--mantine-color-blue-6)",
  "High": "var(--mantine-color-orange-6)",
  "Critical": "var(--mantine-color-red-6)",
}

const statusColors: Record<TodoStatus, string> = {
  "Created": "",
  "Pending": "var(--mantine-color-yellow-6)",
  "Work in progress": "var(--mantine-color-violet-6)",
  "Blocked by": "var(--mantine-color-pink-6)",
  "Completed": "var(--mantine-color-green-6)",
}

const TodoCardComponent = ({ todo, onStatusChange, onPriorityChange, onNavigate }: {
  todo: Todo;
  onStatusChange: (id: number, status: TodoStatus) => void;
  onPriorityChange: (id: number, priority: TodoPriority) => void;
  onNavigate: (id: number) => void;
}) => {
  const handleNavigate = useCallback(() => {
    onNavigate(todo.id)
  }, [onNavigate, todo.id])

  const handlePriorityChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    onPriorityChange(todo.id, event.target.value as TodoPriority)
  }, [onPriorityChange, todo.id])

  const handleStatusChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(todo.id, event.target.value as TodoStatus)
  }, [onStatusChange, todo.id])

  const priorityStyles = useMemo(() => ({
    input: {
      backgroundColor: priorityColors[todo.priority],
      borderColor: priorityColors[todo.priority],
      color: "var(--mantine-color-white)",
      fontWeight: 500,
    }
  }), [todo.priority])

  const statusStyles = useMemo(() => ({
    input: {
      backgroundColor: statusColors[todo.status],
      borderColor: statusColors[todo.status],
      color: "var(--mantine-color-white)",
      fontWeight: 500,
    }
  }), [todo.status])

  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      style={cardStyle}
    >
      <Group justify="space-between" wrap="nowrap" onClick={handleNavigate}>
        <Stack gap="xs" style={stackStyle}>
          <Text size="lg" fw={500}>{todo.title}</Text>
          {todo.description && (
            <Text size="sm" c="dimmed" lineClamp={1}>{todo.description}</Text>
          )}
          {todo.need_by_date && (
            <Text size="xs" c="dimmed">
              Due: {moment(todo.need_by_date).format("MMM D, YYYY")}
            </Text>
          )}
        </Stack>
        <Group gap="sm" wrap="nowrap">
          <style type="text/css">{`
          option {
              background: var(--mantine-color-gray-8);
          } 
          `}</style>
          <NativeSelect
            value={todo.priority}
            onChange={handlePriorityChange}
            data={["Low", "Medium", "High", "Critical"]}
            style={prioritySelectStyle}
            styles={priorityStyles}
            onClick={(e) => e.stopPropagation()}
          />
          <NativeSelect
            value={todo.status}
            onChange={handleStatusChange}
            data={["Created", "Pending", "Work in progress", "Blocked by", "Completed"]}
            style={statusSelectStyle}
            styles={statusStyles}
            onClick={(e) => e.stopPropagation()}
          />
        </Group>
      </Group>
    </Card>
  )
}

export const TodoCard = React.memo(TodoCardComponent)

TodoCard.displayName = "TodoCard"
