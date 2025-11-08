"use client"

import { Comment } from "@/lib/entities/Comment"
import { Button, Card, Group, Stack, Text, Textarea } from "@mantine/core"
import moment from "moment"
import { useState } from "react"
import { MarkdownContent } from "@/components/MarkdownContent"

interface CommentItemProps {
  comment: Comment;
  onUpdate: (content: string) => void;
  onDelete: () => void;
}

export function CommentItem({ comment, onUpdate, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)

  const handleSave = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onUpdate(editContent)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditContent(comment.content)
    setIsEditing(false)
  }

  return (
    <Card padding="md" radius="sm" withBorder>
      {isEditing ? (
        <Stack gap="sm">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleSave()
              } else if (e.key === "Escape") {
                handleCancel()
              }
            }}
            minRows={2}
            autoFocus
            placeholder="Supports Markdown formatting"
          />
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              {moment(comment.created_at).format("MMM D, YYYY h:mm A")}
            </Text>
            <Group gap="xs">
              <Button size="xs" variant="subtle" onClick={handleSave}>
                ✓
              </Button>
              <Button size="xs" variant="subtle" color="red" onClick={onDelete}>
                Delete
              </Button>
            </Group>
          </Group>
        </Stack>
      ) : (
        <>
          <div style={{ cursor: "pointer", fontSize: "0.875rem" }} onClick={() => setIsEditing(true)}>
            <MarkdownContent content={comment.content} />
          </div>
          <Group justify="space-between" mt="xs">
            <Text size="xs" c="dimmed">
              {moment(comment.created_at).format("MMM D, YYYY h:mm A")}
            </Text>
            <Button size="xs" variant="subtle" color="red" onClick={onDelete}>
              Delete
            </Button>
          </Group>
        </>
      )}
    </Card>
  )
}

