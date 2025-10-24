import { Todo } from "@/lib/entities/Todo"
import { searchTodos } from "./todoSearch"
import moment from "moment"

export class TodoSearchManager {
  static isSearching(query: string): boolean {
    return query.trim().length > 0
  }

  static hasSearchOperators(query: string): boolean {
    return /status:|priority:|after:|before:|title:|comment:|description:|is:|sort:|id:/.test(query)
  }

  static hasIdFilter(query: string): boolean {
    return /id:\d+/.test(query)
  }

  static extractIdFromFilter(query: string): number | null {
    const match = query.match(/id:(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  static filterAndSortTodos(todos: Todo[], query: string): number[] {
    const filtered = searchTodos(todos, query)
    return filtered.map(t => t.id)
  }

  static getAutocompleteOptions(query: string): string[] {
    const input = query.toLowerCase()
    const lastWord = input.split(/\s+/).pop() || ""

    if (!lastWord.includes(":")) {
      return []
    }

    const options = this.computeOptions(lastWord)

    if (this.isCompleteFilter(lastWord, options)) {
      return []
    }

    return this.prefixOptions(options, input, lastWord)
  }

  static handleAutocompleteSelect(query: string, value: string): string {
    const words = query.split(/\s+/)
    words[words.length - 1] = value
    return words.join(" ") + " "
  }

  static isDefaultSearch(query: string): boolean {
    return query === "is:open sort:created,priority" || query === ''
  }

  private static computeOptions(lastWord: string): string[] {
    const statusValues = this.addBangs([
      "status:open",
      "status:created",
      "status:pending",
      "status:wip",
      "status:blocked",
      "status:completed"
    ])
    const priorityValues = this.addBangs([
      "priority:low",
      "priority:medium",
      "priority:high",
      "priority:critical"
    ])

    if (lastWord.startsWith("is:")) {
      const isValues = ["is:open", "is:closed"]
      if (lastWord === "is:") {
        return isValues
      }
      return isValues.filter(v => v.startsWith(lastWord))
    }

    if (lastWord.startsWith("sort:")) {
      const sortValues = [
        "sort:created",
        "sort:!created",
        "sort:updated",
        "sort:!updated",
        "sort:priority",
        "sort:!priority",
        "sort:status",
        "sort:title",
        "sort:!title",
        "sort:created,priority",
        "sort:!created,!priority",
        "sort:priority,created"
      ]
      if (lastWord === "sort:") {
        return sortValues
      }
      return sortValues.filter(v => v.startsWith(lastWord))
    }

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
      const today = moment().format("YYYY-MM-DD")
      return [
        `after:${today}`,
        "after:yesterday",
        "after:\"last week\"",
        "after:\"last month\"",
        "after:2024-01-01"
      ]
    }

    if (lastWord.startsWith("before:")) {
      const today = moment().format("YYYY-MM-DD")
      return [
        `before:${today}`,
        "before:tomorrow",
        "before:\"next week\"",
        "before:\"next month\"",
        "before:2024-12-31"
      ]
    }

    return []
  }

  private static isCompleteFilter(lastWord: string, options: string[]): boolean {
    return options.some(option => option === lastWord)
  }

  private static addBangs(options: string[]): string[] {
    return [
      ...options,
      ...options.map(it => it.substring(0, it.indexOf(":")) + ":!" + it.substring(it.indexOf(":") + 1))
    ]
  }

  private static prefixOptions(options: string[], input: string, lastWord: string): string[] {
    return options.map((option) =>
      input.substring(0, input.length - lastWord.length) + option
    )
  }
}

