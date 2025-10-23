import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import type { Todo } from './Todo';

@Entity('comments')
export class Comment {

  // @ts-ignore
  public static name = "Comment"

  @PrimaryGeneratedColumn()
  // @ts-ignore
  id: number;

  @Column({ type: "integer" })
  // @ts-ignore
  todo_id: number;

  @ManyToOne('Todo', 'comments', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'todo_id' })
  todo?: Todo;

  @Column({ type: "text" })
  // @ts-ignore
  content: string;

  @CreateDateColumn()
  // @ts-ignore
  created_at: Date;
}

