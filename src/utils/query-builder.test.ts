import { Comment } from "@/lib/entities/Comment"
import { Todo } from "@/lib/entities/Todo"
import { ParsedQuery } from "./command-parser"
import { buildQuery } from "./query-builder"

const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 1,
  title: "Test Todo",
  description: "Test description",
  status: "Created",
  priority: "Medium",
  need_by_date: null,
  blocked_by_id: null,
  completed_at: null,
  created_at: new Date("2025-01-01T00:00:00Z"),
  updated_at: new Date("2025-01-15T00:00:00Z"),
  ...overrides,
})

describe("buildQuery", () => {

  describe("string filters", () => {

    it("should build string filter for wip", () => {
      const parsed: ParsedQuery = {
        filters: [
          { type: "string", attribute: "status", value: "wip", negated: false }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ title: "Test Todo", status: "Work in progress" })
      const todo2 = createMockTodo({ title: "Other" })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

    it("should build string filter for null comment", () => {
      const parsed: ParsedQuery = {
        filters: [
          { type: "string", attribute: "comment", value: "null", negated: false }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({
        title: "Test Todo", status: "Work in progress", comments: [<Comment>{
          content: "test"
        }]
      })
      const todo2 = createMockTodo({ title: "Other" })

      expect(result.filter(todo1)).toBe(false)
      expect(result.filter(todo2)).toBe(true)
    })

    it("should build string filter for comment", () => {
      const parsed: ParsedQuery = {
        filters: [
          { type: "string", attribute: "comment", value: "test", negated: false }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({
        title: "Test Todo", status: "Work in progress", comments: [<Comment>{
          content: "test"
        }]
      })
      const todo2 = createMockTodo({ title: "Other" })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

    it("should build string filter", () => {
      const parsed: ParsedQuery = {
        filters: [
          { type: "string", attribute: "title", value: "Test", negated: false }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ title: "Test Todo" })
      const todo2 = createMockTodo({ title: "Other" })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

    it("should build negated string filter", () => {
      const parsed: ParsedQuery = {
        filters: [
          { type: "string", attribute: "status", value: "Completed", negated: true }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ status: "Pending" })
      const todo2 = createMockTodo({ status: "Completed" })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

    it("should build is:open filter", () => {
      const parsed: ParsedQuery = {
        filters: [
          { type: "string", attribute: "is", value: "open", negated: false }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ status: "Pending" })
      const todo2 = createMockTodo({ status: "Completed" })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

    it("should build status:null filter", () => {
      const parsed: ParsedQuery = {
        filters: [
          { type: "string", attribute: "description", value: null, negated: false }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ description: "" })
      const todo2 = createMockTodo({ description: "Has content" })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

    it("should build status:!null filter", () => {
      const parsed: ParsedQuery = {
        filters: [
          { type: "string", attribute: "description", value: null, negated: true }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ description: "Has content" })
      const todo2 = createMockTodo({ description: "" })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

  })

  describe("date filters", () => {

    it("should build after date filter", () => {
      const parsed: ParsedQuery = {
        filters: [
          {
            type: "date",
            attribute: "created",
            date: new Date("2024-12-31"),
            operator: "after",
            negated: false
          }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ created_at: new Date("2025-01-01") })
      const todo2 = createMockTodo({ created_at: new Date("2024-12-30") })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

    it("should build before date filter", () => {
      const parsed: ParsedQuery = {
        filters: [
          {
            type: "date",
            attribute: "created",
            date: new Date("2025-01-10"),
            operator: "before",
            negated: false
          }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ created_at: new Date("2025-01-01") })
      const todo2 = createMockTodo({ created_at: new Date("2025-01-15") })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

    it("should build exact date filter", () => {
      const parsed: ParsedQuery = {
        filters: [
          {
            type: "date",
            attribute: "created",
            date: new Date("2025-01-01"),
            operator: "exact",
            negated: false
          }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ created_at: new Date("2025-01-01T10:30:00Z") })
      const todo2 = createMockTodo({ created_at: new Date("2025-01-02T00:00:00Z") })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

    it("should build needby:null filter", () => {
      const parsed: ParsedQuery = {
        filters: [
          {
            type: "date",
            attribute: "needby",
            date: null,
            operator: "exact",
            negated: false
          }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ need_by_date: null })
      const todo2 = createMockTodo({ need_by_date: "2025-12-31" })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

    it("should build needby:!null filter", () => {
      const parsed: ParsedQuery = {
        filters: [
          {
            type: "date",
            attribute: "needby",
            date: null,
            operator: "exact",
            negated: true
          }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ need_by_date: "2025-12-31" })
      const todo2 = createMockTodo({ need_by_date: null })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

  })

  describe("multiple filters", () => {

    it("should combine multiple filters with AND logic", () => {
      const parsed: ParsedQuery = {
        filters: [
          { type: "string", attribute: "status", value: "Pending", negated: false },
          { type: "string", attribute: "priority", value: "High", negated: false }
        ],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)
      const todo1 = createMockTodo({ status: "Pending", priority: "High" })
      const todo2 = createMockTodo({ status: "Pending", priority: "Low" })

      expect(result.filter(todo1)).toBe(true)
      expect(result.filter(todo2)).toBe(false)
    })

  })

  describe("actions", () => {

    it("should build single action", () => {
      const parsed: ParsedQuery = {
        filters: [],
        actions: [
          { attribute: "status", value: "Completed" }
        ],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)

      expect(result.actions).toEqual({ status: "Completed" })
    })

    it("should build multiple actions", () => {
      const parsed: ParsedQuery = {
        filters: [],
        actions: [
          { attribute: "status", value: "Completed" },
          { attribute: "priority", value: "Low" }
        ],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)

      expect(result.actions).toEqual({
        status: "Completed",
        priority: "Low"
      })
    })

    it("should return null when no actions", () => {
      const parsed: ParsedQuery = {
        filters: [],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)

      expect(result.actions).toBeNull()
    })

    it("should parse date string for needby action", () => {
      const parsed: ParsedQuery = {
        filters: [],
        actions: [
          { attribute: "needby", value: "2025-12-31" }
        ],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)

      expect(result.actions).toHaveProperty("need_by_date")
      expect(result.actions?.need_by_date).toBe("2025-12-31")
    })

    it("should parse chrono date for needby action", () => {
      const parsed: ParsedQuery = {
        filters: [],
        actions: [
          { attribute: "needby", value: "today" }
        ],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)

      expect(result.actions).toHaveProperty("need_by_date")
      expect(typeof result.actions?.need_by_date).toBe("string")
      expect(result.actions?.need_by_date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

  })

  describe("sort", () => {

    it("should pass through sort fields", () => {
      const parsed: ParsedQuery = {
        filters: [],
        actions: [],
        create: null,
        sort: [
          { field: "created", reverse: true },
          { field: "priority", reverse: false }
        ]
      }

      const result = buildQuery(parsed)

      expect(result.sort).toEqual([
        { field: "created", reverse: true },
        { field: "priority", reverse: false }
      ])
    })

    it("should return null when no sort", () => {
      const parsed: ParsedQuery = {
        filters: [],
        actions: [],
        create: null,
        sort: []
      }

      const result = buildQuery(parsed)

      expect(result.sort).toBeNull()
    })

  })

})

