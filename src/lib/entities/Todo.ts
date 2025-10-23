import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm"

export type TodoStatus = "Created" | "Pending" | "Work in progress" | "Blocked by" | "Completed";
export type TodoPriority = "Low" | "Medium" | "High" | "Critical";

@Entity("todos")
export class Todo {

  // @ts-ignore
  public static name = "Todo"

  @PrimaryGeneratedColumn()
  // @ts-ignore
  id: number

  @Column({ type: "text" })
  // @ts-ignore
  title: string

  @Column({ type: "text", default: "" })
  // @ts-ignore
  description: string

  @Column({ type: "text", default: "Created" })
  // @ts-ignore
  status: TodoStatus

  @Column({ type: "text", default: "Medium" })
  // @ts-ignore
  priority: TodoPriority

  @Column({ type: "text", nullable: true })
  // @ts-ignore
  need_by_date: string | null

  @Column({ type: "integer", nullable: true })
  // @ts-ignore
  blocked_by_id: number | null

  @ManyToOne('Todo', { nullable: true })
  @JoinColumn({ name: "blocked_by_id" })
  blocked_by?: Todo | null

  @Column({ type: "text", nullable: true })
  // @ts-ignore
  completed_at: string | null

  @CreateDateColumn()
  // @ts-ignore
  created_at: Date

  @UpdateDateColumn()
  // @ts-ignore
  updated_at: Date

  @OneToMany('Comment', 'todo')
  comments?: any[]
}

