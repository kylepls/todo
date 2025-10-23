"use client"

import { Comment } from "@/lib/entities/Comment"
import { Button, Card, Group, Stack, TextInput } from "@mantine/core"
import { useState } from "react"
import { CommentItem } from "./CommentItem"

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onUpdateComment: (commentId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export function CommentSection({ comments, onAddComment, onUpdateComment, onDeleteComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (!newComment.trim()) {
      return
    }
    onAddComment(newComment.trim())
    setNewComment("")
  }

  return (
    <Card padding="lg" radius="md" withBorder>
      <Stack gap="md">
        {comments.length > 0 && (
          <Stack gap="sm">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onUpdate={(content) => onUpdateComment(comment.id, content)}
                onDelete={() => onDeleteComment(comment.id)}
              />
            ))}
          </Stack>
        )}

        <Group gap="md">
          <TextInput
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            style={{ flex: 1 }}
            size="md"
          />
          <Button onClick={handleAddComment} size="md">
            Add Comment
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}

