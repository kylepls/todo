"use client"

import { TodoDetail } from "@/components/TodoDetail"
import { useTodos } from "@/contexts/TodoContext"
import { Container, Text } from "@mantine/core"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function TodoDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { getTodoById } = useTodos()

  const initialTodo = getTodoById(parseInt(id))
  const [isLoading] = useState(!initialTodo)

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Text>Loading...</Text>
      </Container>
    )
  }

  return <TodoDetail todoId={parseInt(id)} initialTodo={initialTodo} />
}

