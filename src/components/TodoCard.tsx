import { Todo, TodoPriority, TodoStatus } from "@/lib/entities/Todo"
import { ActionIcon, Card, Group, NativeSelect, Popover, Stack, Text } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { IconCalendar, IconTrash, IconCheck } from "@tabler/icons-react"
import moment from "moment"
import React, { useCallback, useMemo, useState } from "react"

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

const TodoCardComponent = ({ todo, onStatusChange, onPriorityChange, onNavigate, onDateChange, onDelete }: {
  todo: Todo;
  onStatusChange: (id: number, status: TodoStatus) => void;
  onPriorityChange: (id: number, priority: TodoPriority) => void;
  onNavigate: (id: number) => void;
  onDateChange: (id: number, date: Date | null) => void;
  onDelete: (id: number, undo?: () => void) => void;
}) => {
  const [calendarOpened, setCalendarOpened] = useState(false)
  const [dateValue, setDateValue] = useState<Date | null>(todo.need_by_date ? new Date(todo.need_by_date) : null)
  const handleNavigate = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      onNavigate(todo.id)
    }
  }, [onNavigate, todo.id])

  const handlePriorityChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    onPriorityChange(todo.id, event.target.value as TodoPriority)
  }, [onPriorityChange, todo.id])

  const handleStatusChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(todo.id, event.target.value as TodoStatus)
  }, [onStatusChange, todo.id])

  const handleComplete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onStatusChange(todo.id, todo.status === "Completed" ? "Created" : "Completed")
  }, [onStatusChange, todo.id, todo.status])

  const handleDateChange = useCallback((value: Date | string | null) => {
    const dateValue = typeof value === 'string' ? new Date(value) : value
    setDateValue(dateValue)
    onDateChange(todo.id, dateValue)
    setCalendarOpened(false)
  }, [onDateChange, todo.id])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const undo = () => {
      console.log('Undo delete called for todo:', todo.id)
    }
    onDelete(todo.id, undo)
  }, [onDelete, todo.id])

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
    <a 
      href={`/?q=id:${todo.id}`}
      onClick={handleNavigate}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <Card
        padding="lg"
        radius="md"
        withBorder
        style={cardStyle}
      >
        <Group justify="space-between" wrap="nowrap">
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
          <Popover 
            opened={calendarOpened} 
            onChange={setCalendarOpened}
            position="bottom"
            withArrow
          >
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setCalendarOpened(!calendarOpened)
                }}
              >
                <IconCalendar size={20} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown onClick={(e) => e.stopPropagation()}>
              <DatePicker
                value={dateValue}
                onChange={handleDateChange as any}
                defaultDate={dateValue || undefined}
              />
            </Popover.Dropdown>
          </Popover>
          <ActionIcon
            variant="subtle"
            color="red"
            size="lg"
            onClick={handleDelete}
          >
            <IconTrash size={20} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color={todo.status === "Completed" ? "green" : "gray"}
            size="lg"
            onClick={handleComplete}
          >
            <IconCheck size={20} />
          </ActionIcon>
        </Group>
      </Group>
      </Card>
    </a>
  )
}

export const TodoCard = React.memo(TodoCardComponent)

TodoCard.displayName = "TodoCard"
