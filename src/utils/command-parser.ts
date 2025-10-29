import { commandsLexer } from "@generated/commandsLexer"
import {
  Action_queryContext,
  ActionsContext,
  AssignmentContext,
  commandsParser,
  Date_filterContext,
  Filter_queryContext,
  FilterContext,
  FiltersContext,
  QueryContext,
  Quoted_stringContext,
  Raw_stringContext,
  String_filterContext,
  StringContext
} from "@generated/commandsParser"
import { commandsVisitor } from "@generated/commandsVisitor"
import { ANTLRErrorListener, ANTLRInputStream, CommonTokenStream, RecognitionException, Recognizer } from "antlr4ts"
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor"
import * as chrono from "chrono-node"

export type StringFilter = {
  type: "string"
  attribute: string
  value: string | null
  negated: boolean
}

export type DateFilter = {
  type: "date"
  attribute: string
  date: Date | null
  operator: "before" | "after" | "exact"
  negated: boolean
}

export type Filter = StringFilter | DateFilter

export type Action = {
  attribute: string
  value: string
}

export type SortField = {
  field: string
  reverse: boolean
}

export type ParsedQuery = {
  filters: Filter[]
  actions: Action[]
  create: { title: string } | null
  sort: SortField[]
  error?: string
}

class ThrowingErrorListener implements ANTLRErrorListener<any> {
  syntaxError<T>(
    recognizer: Recognizer<T, any>,
    offendingSymbol: T | undefined,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | undefined
  ): void {
    throw new Error(`Parse error at ${line}:${charPositionInLine} - ${msg}`)
  }
}

class CommandVisitor extends AbstractParseTreeVisitor<any> implements commandsVisitor<any> {

  private filters: Filter[] = []
  private actions: Action[] = []
  private createTitle: string | null = null
  private sortFields: SortField[] = []

  getResult(): ParsedQuery {
    const create = this.createTitle ? { title: this.createTitle } : null
    return {
      filters: this.filters,
      actions: this.actions,
      create,
      sort: this.sortFields
    }
  }

  visitQuery(context: QueryContext): any {
    return context.action_query()?.accept(this) ||
      context.filter_query()?.accept(this) ||
      context.raw_string()?.accept(this) ||
      null
  }

  visitAction_query(context: Action_queryContext) {
    context.filters()?.accept(this)
    context.actions()?.accept(this)
    return null
  }

  visitFilter_query(context: Filter_queryContext) {
    context.filters()?.accept(this)
    return null
  }

  visitRaw_string(context: Raw_stringContext) {
    this.createTitle = context.TEXT().text
    return null
  }

  visitFilters(context: FiltersContext) {
    context.filter().forEach(filter => filter.accept(this))
    return null
  }

  visitFilter(context: FilterContext): any {
    return context.string_filter()?.accept(this) ||
      context.date_filter()?.accept(this) ||
      context.sort_filter()?.accept(this)
  }

  visitString_filter(context: String_filterContext) {
    const attribute = context.STRING_ATTRIBUTE().text
    const negated = context.NOT() !== undefined
    const isNull = context.NULL() !== undefined
    
    let value: string | null = null
    if (!isNull) {
      const stringContext = context.string()
      if (stringContext) {
        value = this.extractString(stringContext)
      }
    }

    this.filters.push({
      type: "string",
      attribute,
      value,
      negated
    })
    return null
  }

  visitDate_filter(context: Date_filterContext) {
    const attribute = context.DATE_ATTRIBUTE().text
    const negated = context.NOT() !== undefined
    const isNull = context.NULL() !== undefined

    if (isNull) {
      this.filters.push({
        type: "date",
        attribute,
        date: null,
        operator: "exact",
        negated
      })
      return null
    }

    const stringContext = context.string()
    if (!stringContext) {
      throw new Error("Date filter requires a date value or null")
    }

    const hasBeforeAfter = context.BEFORE() !== undefined || context.AFTER() !== undefined
    const isAfter = context.AFTER() !== undefined
    const dateString = this.extractString(stringContext)

    let parsedDate = chrono.parseDate(dateString)

    if (!parsedDate) {
      if (/^\d{4}$/.test(dateString)) {
        parsedDate = new Date(`${dateString}-01-01`)
      } else {
        const jsDate = new Date(dateString)
        if (!isNaN(jsDate.getTime())) {
          parsedDate = jsDate
        }
      }
    }

    if (!parsedDate) {
      throw new Error(`Could not parse date: ${dateString}`)
    }

    const operator = hasBeforeAfter ? (isAfter ? "after" : "before") : "exact"
    this.filters.push({
      type: "date",
      attribute,
      date: parsedDate,
      operator,
      negated
    })
    return null
  }

  visitSort_filter(context: any) {
    const sorts = context.sort()
    sorts.forEach((sortCtx: any) => sortCtx.accept(this))
    return null
  }

  visitSort(context: any) {
    const reverse = context.NOT() !== undefined
    const field = (context.STRING_ATTRIBUTE() || context.DATE_ATTRIBUTE())!.text
    this.sortFields.push({ field, reverse })
    return null
  }

  visitActions(context: ActionsContext) {
    context.assignment().forEach(assignment => assignment.accept(this))
    return null
  }

  visitAssignment(context: AssignmentContext) {
    const attribute = (context.STRING_ATTRIBUTE() || context.DATE_ATTRIBUTE())!.text
    const value = this.extractString(context.string())

    this.actions.push({ attribute, value })
    return null
  }

  visitString(context: StringContext): string {
    if (context.quoted_string()) {
      return context.quoted_string()!.accept(this)
    }
    return context.TEXT()?.text || ""
  }

  visitQuoted_string(context: Quoted_stringContext) {
    const content = context.quoted_content()
    const children = content.children || []

    const parts: string[] = []
    children.forEach(child => {
      parts.push(child.text)
    })

    return parts.join("")
  }

  private extractString(context: StringContext): string {
    return context.accept(this)
  }

  protected defaultResult(): any {
    return null
  }
}

export function parseQuery(input: string): ParsedQuery {
  const inputStream = new ANTLRInputStream(input)
  const lexer = new commandsLexer(inputStream)
  lexer.removeErrorListeners()
  lexer.addErrorListener(new ThrowingErrorListener())

  const tokenStream = new CommonTokenStream(lexer)
  const parser = new commandsParser(tokenStream)
  parser.removeErrorListeners()
  parser.addErrorListener(new ThrowingErrorListener())

  const tree = parser.query()

  const visitor = new CommandVisitor()
  visitor.visit(tree)

  return visitor.getResult()
}

const ATTRIBUTES = [
  "id",
  "title",
  "description",
  "status",
  "priority",
  "needby",
  "blockedby",
  "completed",
  "updated",
  "comment",
  "created",
  "is",
  "sort"
]

const SORT_ATTRIBUTES = [
  "created",
  "updated",
  "priority",
  "status",
  "title"
]

const ACTION_ATTRIBUTES = [
  "title",
  "description",
  "status",
  "priority",
  "needby"
]

const DATE_ATTRIBUTES = [
  "created",
  "updated",
  "completed",
  "needby"
]

const STATUS_VALUES = [
  "created",
  "pending",
  "wip",
  "blocked by",
  "completed"
]

const PRIORITY_VALUES = [
  "low",
  "medium",
  "high",
  "critical"
]

const IS_VALUES = [
  "open",
  "closed"
]

const DATE_VALUES = [
  "today",
  "yesterday",
  "tomorrow",
  "last week",
  "last month",
  "next week",
  "next month"
]

type CompletionContext =
  | { type: "attribute" }
  | { type: "value", attribute: string }
  | { type: "date_keyword", attribute: string }
  | { type: "date_value", attribute: string }
  | { type: "sort_value" }
  | { type: "action_start" }
  | { type: "action_attribute" }
  | { type: "action_value", attribute: string }
  | { type: "quoted_string" }
  | { type: "none" }

export function getAutocompletions(input: string, cursorPosition: number): string[] {
  const textBeforeCursor = input.substring(0, cursorPosition)

  if (isInsideQuotedString(textBeforeCursor)) {
    return []
  }

  const context = determineContext(textBeforeCursor)
  const suggestions = getSuggestionsForContext(context, textBeforeCursor)

  const endsWithSpace = textBeforeCursor !== textBeforeCursor.trimEnd()
  const trimmed = textBeforeCursor.trimEnd()

  let lastToken = ""
  let prefixEnd = textBeforeCursor.length

  if (!endsWithSpace) {
    if (context.type === "sort_value") {
      const sortIndex = trimmed.lastIndexOf("sort:")
      if (sortIndex !== -1) {
        const colonIndex = sortIndex + 4
        const afterColon = trimmed.substring(colonIndex + 1)
        const lastSpaceIndex = afterColon.lastIndexOf(" ")
        if (lastSpaceIndex !== -1) {
          lastToken = afterColon.substring(lastSpaceIndex + 1)
          prefixEnd = colonIndex + 1 + lastSpaceIndex + 1
        } else {
          lastToken = afterColon
          prefixEnd = colonIndex + 1
        }
      }
    } else if (context.type === "value" || context.type === "date_keyword" || context.type === "date_value" || context.type === "action_value") {
      const colonIndex = trimmed.lastIndexOf(":")
      if (colonIndex !== -1) {
        lastToken = trimmed.substring(colonIndex + 1)
        if (context.type === "date_value") {
          const spaceAfterColon = trimmed.indexOf(" ", colonIndex)
          if (spaceAfterColon !== -1) {
            lastToken = trimmed.substring(spaceAfterColon + 1)
            prefixEnd = spaceAfterColon + 1
          } else {
            prefixEnd = colonIndex + 1
          }
        } else {
          prefixEnd = colonIndex + 1
        }
      }
    } else {
      lastToken = getLastToken(trimmed)
      prefixEnd = trimmed.length - lastToken.length
    }
  }

  const prefix = textBeforeCursor.substring(0, prefixEnd)

  return suggestions.map(suggestion => prefix + suggestion)
}

function isInsideQuotedString(text: string): boolean {
  let inQuote = false
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\"") {
      inQuote = !inQuote
    }
  }
  return inQuote
}

function determineContext(text: string): CompletionContext {
  const endsWithSpace = text !== text.trimEnd()
  const trimmed = text.trimEnd()

  if (trimmed.includes(">")) {
    const parts = trimmed.split(">")
    const afterAction = parts[1]
    const afterActionTrimmed = afterAction.trim()
    const afterActionEndsWithSpace = afterAction !== afterActionTrimmed

    if (afterActionTrimmed === "") {
      return { type: "action_start" }
    }

    if (afterActionEndsWithSpace) {
      const hasCompleteValue = afterActionTrimmed.match(/\w+:\S+$/)
      if (hasCompleteValue) {
        return { type: "action_attribute" }
      }
    }

    const lastToken = getLastToken(afterActionTrimmed)

    if (lastToken.endsWith(":")) {
      const attribute = lastToken.slice(0, -1)
      return { type: "action_value", attribute }
    }

    const valueMatch = afterActionTrimmed.match(/(\w+):(\S+)$/)
    if (valueMatch && !afterActionEndsWithSpace) {
      return { type: "action_value", attribute: valueMatch[1] }
    }

    return { type: "action_attribute" }
  }

  const lastToken = getLastToken(trimmed)

  const sortMatch = trimmed.match(/sort:(!?\w+\s+)*!?\S*$/)
  if (sortMatch) {
    return { type: "sort_value" }
  }

  if (endsWithSpace) {
    const hasDateKeyword = trimmed.match(/(\w+):(before|after)$/)
    if (hasDateKeyword) {
      return { type: "date_value", attribute: hasDateKeyword[1] }
    }

    const hasDateValue = trimmed.match(/(\w+):(before|after)\s+.+$/)
    if (hasDateValue) {
      return { type: "attribute" }
    }

    const hasCompleteFilter = trimmed.match(/\w+:(\S+|"[^"]*")$/)
    if (hasCompleteFilter) {
      return { type: "attribute" }
    }
  }

  if (lastToken === "") {
    return { type: "attribute" }
  }

  if (lastToken.endsWith(":") && !lastToken.includes(" ")) {
    const attribute = lastToken.slice(0, -1)

    if (attribute === "sort") {
      return { type: "sort_value" }
    }

    if (DATE_ATTRIBUTES.includes(attribute)) {
      return { type: "date_keyword", attribute }
    }

    return { type: "value", attribute }
  }

  if (lastToken === "before" || lastToken === "after") {
    const beforeLastToken = trimmed.substring(0, trimmed.length - lastToken.length).trim()
    const match = beforeLastToken.match(/(\w+):$/)
    if (match) {
      return { type: "date_value", attribute: match[1] }
    }
  }

  const dateValueMatch = trimmed.match(/(\w+):(before|after)\s+\S*$/)
  if (dateValueMatch) {
    return { type: "date_value", attribute: dateValueMatch[1] }
  }

  const valueMatch = trimmed.match(/(\w+):!?\S*$/)
  if (valueMatch && !endsWithSpace) {
    const attribute = valueMatch[1]
    if (DATE_ATTRIBUTES.includes(attribute)) {
      return { type: "date_keyword", attribute }
    }
    return { type: "value", attribute }
  }

  return { type: "attribute" }
}

function getLastToken(text: string): string {
  let inQuote = false
  let lastSpaceIndex = -1

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\"") {
      inQuote = !inQuote
    } else if (text[i] === " " && !inQuote) {
      lastSpaceIndex = i
    }
  }

  return text.substring(lastSpaceIndex + 1)
}

function getSuggestionsForContext(context: CompletionContext, text: string): string[] {
  const trimmed = text.trimEnd()
  const lastToken = getLastToken(trimmed)
  const endsWithSpace = text !== trimmed

  switch (context.type) {
    case "attribute":
      const hasCompleteFilter = trimmed.match(/\w+:(\S+|"[^"]*")$/)
      const hasCompleteDateFilter = trimmed.match(/\w+:(before|after)\s+.+$/)

      if ((hasCompleteFilter || hasCompleteDateFilter) && endsWithSpace) {
        const allAttributes = ATTRIBUTES.map(attr => `${attr}:`)
        return ["> ", ...allAttributes]
      }

      const attributeSuggestions = ATTRIBUTES
        .map(attr => `${attr}:`)
        .filter(attr => attr.toLowerCase().startsWith(lastToken.toLowerCase()))

      return attributeSuggestions

    case "value":
      const valueSuggestions: string[] = []

      const valueMatch = text.match(/:\s*(!?)(\S*)$/)
      const hasNegation = valueMatch?.[1] === "!"
      const valueAfterColon = valueMatch?.[2] || ""

      if ("null".startsWith(valueAfterColon.toLowerCase())) {
        if (hasNegation) {
          valueSuggestions.push("!null ")
        } else {
          valueSuggestions.push("null ")
        }
      }

      if (context.attribute === "status") {
        const filtered = STATUS_VALUES
          .filter(v => v.toLowerCase().startsWith(valueAfterColon.toLowerCase()))
        
        if (hasNegation) {
          valueSuggestions.push(...filtered.map(v => `!${v} `))
        } else {
          valueSuggestions.push(...filtered.map(v => `${v} `))
        }
      } else if (context.attribute === "priority") {
        const filtered = PRIORITY_VALUES
          .filter(v => v.toLowerCase().startsWith(valueAfterColon.toLowerCase()))
        
        if (hasNegation) {
          valueSuggestions.push(...filtered.map(v => `!${v} `))
        } else {
          valueSuggestions.push(...filtered.map(v => `${v} `))
        }
      } else if (context.attribute === "is") {
        const filtered = IS_VALUES
          .filter(v => v.toLowerCase().startsWith(valueAfterColon.toLowerCase()))
        
        if (hasNegation) {
          valueSuggestions.push(...filtered.map(v => `!${v} `))
        } else {
          valueSuggestions.push(...filtered.map(v => `${v} `))
        }
      }

      if (valueAfterColon === "" && !hasNegation && context.attribute !== "is") {
        valueSuggestions.unshift("!")
      }

      return valueSuggestions

    case "date_keyword":
      const colonIndex = trimmed.lastIndexOf(":")
      const afterColon = colonIndex !== -1 ? trimmed.substring(colonIndex + 1) : ""

      const dateKeywordSuggestions: string[] = []

      if ("null".startsWith(afterColon.toLowerCase())) {
        dateKeywordSuggestions.push("null ")
      }

      if (afterColon === "") {
        return [...dateKeywordSuggestions, "before ", "after ", ...DATE_VALUES.map(v => `${v} `)]
      }
      const keywords = ["before ", "after "].filter(kw =>
        kw.trim().startsWith(afterColon.toLowerCase())
      )
      const dates = DATE_VALUES
        .filter(v => v.toLowerCase().startsWith(afterColon.toLowerCase()))
        .map(v => `${v} `)
      return [...dateKeywordSuggestions, ...keywords, ...dates]

    case "date_value":
      if (endsWithSpace) {
        return DATE_VALUES.map(v => `${v} `)
      }
      return DATE_VALUES
        .filter(v => v.toLowerCase().startsWith(lastToken.toLowerCase()))
        .map(v => `${v} `)

    case "sort_value":
      const sortSuggestions = SORT_ATTRIBUTES.flatMap(attr => [`${attr} `, `!${attr} `])

      const sortKeywordIndex = trimmed.lastIndexOf("sort:")
      if (sortKeywordIndex === -1) {
        return sortSuggestions
      }

      const sortColonIndex = sortKeywordIndex + 4
      const sortAfterColon = trimmed.substring(sortColonIndex + 1)
      const lastSpaceIndex = sortAfterColon.lastIndexOf(" ")
      const lastSortToken = lastSpaceIndex !== -1
        ? sortAfterColon.substring(lastSpaceIndex + 1)
        : sortAfterColon

      if (lastSortToken === "" || endsWithSpace) {
        return sortSuggestions
      }

      const isTypingNegation = lastSortToken.startsWith("!")
      const tokenToMatch = isTypingNegation ? lastSortToken.slice(1) : lastSortToken

      if (isTypingNegation) {
        return sortSuggestions
          .filter(v => v.startsWith("!"))
          .filter(v => v.replace("!", "").trim().toLowerCase().startsWith(tokenToMatch.toLowerCase()))
      }

      return sortSuggestions.filter(v =>
        v.replace("!", "").trim().toLowerCase().startsWith(tokenToMatch.toLowerCase())
      )

    case "action_start":
      return ACTION_ATTRIBUTES.map(attr => `${attr}:`)

    case "action_attribute":
      if (endsWithSpace || lastToken === "") {
        return ACTION_ATTRIBUTES.map(attr => `${attr}:`)
      }
      return ACTION_ATTRIBUTES
        .map(attr => `${attr}:`)
        .filter(attr => attr.toLowerCase().startsWith(lastToken.toLowerCase()))

    case "action_value":
      const actionAfterColon = text.split(":").pop() || ""
      if (context.attribute === "status") {
        return STATUS_VALUES
          .filter(v => v.toLowerCase().startsWith(actionAfterColon.trim().toLowerCase()))
          .map(v => `${v} `)
      } else if (context.attribute === "priority") {
        return PRIORITY_VALUES
          .filter(v => v.toLowerCase().startsWith(actionAfterColon.trim().toLowerCase()))
          .map(v => `${v} `)
      }
      return []

    case "quoted_string":
      return []

    case "none":
      return []
  }
}
