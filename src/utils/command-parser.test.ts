import { getAutocompletions, parseQuery } from "./command-parser"

describe("parseQuery", () => {

  describe("create commands", () => {

    it("should recognize raw text as a create command", () => {
      const result = parseQuery("groceries")

      expect(result.create).toEqual({ title: "groceries" })
      expect(result.actions).toEqual([])
      expect(result.filters).toEqual([])
    })

    it("should create todo with single word title", () => {
      const result = parseQuery("meeting")

      expect(result.create).toEqual({ title: "meeting" })
    })

    it("should create todo with hyphenated title", () => {
      const result = parseQuery("follow-up")

      expect(result.create).toEqual({ title: "follow-up" })
    })

  })

  describe("string filters", () => {

    it("should parse title filter", () => {
      const result = parseQuery("title:Test")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "title",
        value: "Test",
        negated: false
      }])
      expect(result.create).toBeNull()
    })

    it("should parse status filter", () => {
      const result = parseQuery("status:Completed")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "status",
        value: "Completed",
        negated: false
      }])
    })

    it("should parse negated filters", () => {
      const result = parseQuery("status:!Completed")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "status",
        value: "Completed",
        negated: true
      }])
    })

    it("should parse quoted strings", () => {
      const result = parseQuery("title:\"Test Todo\"")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "title",
        value: "Test Todo",
        negated: false
      }])
    })

    it("should preserve case in value", () => {
      const result = parseQuery("title:test")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "title",
        value: "test",
        negated: false
      }])
    })

  })

  describe("date filters", () => {

    it("should parse created after date", () => {
      const result = parseQuery("created:after 2024-12-31")

      expect(result.filters).toHaveLength(1)
      expect(result.filters[0]).toMatchObject({
        type: "date",
        attribute: "created",
        operator: "after",
        negated: false
      })
    })

    it("should parse created before date", () => {
      const result = parseQuery("created:before 2025-01-10")

      expect(result.filters[0]).toMatchObject({
        type: "date",
        attribute: "created",
        operator: "before",
        negated: false
      })
    })

    it("should parse updated after date", () => {
      const result = parseQuery("updated:after 2025-01-10")

      expect(result.filters[0]).toMatchObject({
        type: "date",
        attribute: "updated",
        operator: "after",
        negated: false
      })
    })

    it("should parse negated date filters", () => {
      const result = parseQuery("created:!after 2025-01-10")

      expect(result.filters[0]).toMatchObject({
        type: "date",
        attribute: "created",
        operator: "after",
        negated: true
      })
    })

    it("should parse exact date match", () => {
      const result = parseQuery("created:2025-01-01")

      expect(result.filters[0]).toMatchObject({
        type: "date",
        attribute: "created",
        operator: "exact",
        negated: false
      })
    })

    it("should parse negated exact date match", () => {
      const result = parseQuery("created:!2025-01-01")

      expect(result.filters[0]).toMatchObject({
        type: "date",
        attribute: "created",
        operator: "exact",
        negated: true
      })
    })

  })

  describe("multiple filters", () => {

    it("should parse multiple filters", () => {
      const result = parseQuery("status:Pending priority:High")

      expect(result.filters).toHaveLength(2)
      expect(result.filters).toContainEqual({
        type: "string",
        attribute: "status",
        value: "Pending",
        negated: false
      })
      expect(result.filters).toContainEqual({
        type: "string",
        attribute: "priority",
        value: "High",
        negated: false
      })
    })

    it("should parse mix of string and date filters", () => {
      const result = parseQuery("status:Pending created:after 2024-12-31")

      expect(result.filters).toHaveLength(2)
      expect(result.filters[0]).toMatchObject({
        type: "string",
        attribute: "status"
      })
      expect(result.filters[1]).toMatchObject({
        type: "date",
        attribute: "created",
        operator: "after"
      })
    })

  })

  describe("actions", () => {

    it("should parse single action", () => {
      const result = parseQuery("status:Pending > status:Completed")

      expect(result.actions).toEqual([
        { attribute: "status", value: "Completed" }
      ])
      expect(result.create).toBeNull()
    })

    it("should parse multiple actions", () => {
      const result = parseQuery("status:Pending > status:Completed priority:Low")

      expect(result.actions).toEqual([
        { attribute: "status", value: "Completed" },
        { attribute: "priority", value: "Low" }
      ])
    })

    it("should parse actions with quoted strings", () => {
      const result = parseQuery("title:urgent > title:\"Not urgent anymore\"")

      expect(result.actions).toEqual([
        { attribute: "title", value: "Not urgent anymore" }
      ])
    })

    it("should return empty actions when no actions present", () => {
      const result = parseQuery("status:Pending")

      expect(result.actions).toEqual([])
    })

    it("should parse both filters and actions", () => {
      const result = parseQuery("status:Pending priority:High > status:WIP")

      expect(result.filters).toHaveLength(2)
      expect(result.actions).toEqual([
        { attribute: "status", value: "WIP" }
      ])
    })

  })

  describe("edge cases", () => {

    it("should parse filter only query", () => {
      const result = parseQuery("status:Pending")

      expect(result.filters).toHaveLength(1)
      expect(result.actions).toEqual([])
    })

    it("should parse raw string as create", () => {
      const result = parseQuery("text")

      expect(result.filters).toEqual([])
      expect(result.create).toEqual({ title: "text" })
    })

    it("should parse priority filter", () => {
      const result = parseQuery("priority:Critical")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "priority",
        value: "Critical",
        negated: false
      }])
    })

    it("should parse id filter", () => {
      const result = parseQuery("id:42")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "id",
        value: "42",
        negated: false
      }])
    })

    it("should parse is:open filter", () => {
      const result = parseQuery("is:open")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "is",
        value: "open",
        negated: false
      }])
    })

    it("should parse is:closed filter", () => {
      const result = parseQuery("is:closed")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "is",
        value: "closed",
        negated: false
      }])
    })

    it("should parse negated is:open filter", () => {
      const result = parseQuery("is:!open")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "is",
        value: "open",
        negated: true
      }])
    })

    it("should parse status:WIP priority:Critical", () => {
      const result = parseQuery("status:WIP priority:Critical")

      expect(result.actions).toEqual([])
      expect(result.filters).toContainEqual({
        type: "string",
        attribute: "status",
        negated: false,
        value: "WIP"
      })
      expect(result.filters).toContainEqual({
        type: "string",
        attribute: "priority",
        negated: false,
        value: "Critical"
      })
    })

    it("should parse status:null", () => {
      const result = parseQuery("status:null")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "status",
        value: null,
        negated: false
      }])
    })

    it("should parse status:!null", () => {
      const result = parseQuery("status:!null")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "status",
        value: null,
        negated: true
      }])
    })

    it("should parse priority:!null", () => {
      const result = parseQuery("priority:!null")

      expect(result.filters).toEqual([{
        type: "string",
        attribute: "priority",
        value: null,
        negated: true
      }])
    })

    it("should parse created:null", () => {
      const result = parseQuery("created:null")

      expect(result.filters).toEqual([{
        type: "date",
        attribute: "created",
        date: null,
        operator: "exact",
        negated: false
      }])
    })

    it("should parse needby:!null", () => {
      const result = parseQuery("needby:!null")

      expect(result.filters).toEqual([{
        type: "date",
        attribute: "needby",
        date: null,
        operator: "exact",
        negated: true
      }])
    })

  })

  describe("complex queries", () => {

    it("should parse complex multi-filter query", () => {
      const result = parseQuery("status:!Completed priority:High created:after 2024-12-01")

      expect(result.filters).toHaveLength(3)
      expect(result.filters[0]).toMatchObject({
        type: "string",
        attribute: "status",
        value: "Completed",
        negated: true
      })
      expect(result.filters[1]).toMatchObject({
        type: "string",
        attribute: "priority",
        value: "High"
      })
      expect(result.filters[2]).toMatchObject({
        type: "date",
        attribute: "created",
        operator: "after"
      })
    })

    it("should parse query with filters and multiple actions", () => {
      const result = parseQuery("priority:High status:Pending > status:Completed priority:Medium")

      expect(result.filters).toHaveLength(2)
      expect(result.actions).toEqual([
        { attribute: "status", value: "Completed" },
        { attribute: "priority", value: "Medium" }
      ])
    })

  })

  describe("sorting", () => {

    it("should parse single sort field", () => {
      const result = parseQuery("sort:created")

      expect(result.sort).toEqual([
        { field: "created", reverse: false }
      ])
    })

    it("should parse reverse sort field", () => {
      const result = parseQuery("sort:!created")

      expect(result.sort).toEqual([
        { field: "created", reverse: true }
      ])
    })

    it("should parse multiple sort fields", () => {
      const result = parseQuery("sort:!created priority")

      expect(result.sort).toEqual([
        { field: "created", reverse: true },
        { field: "priority", reverse: false }
      ])
    })

    it("should parse sort with filters", () => {
      const result = parseQuery("status:Pending sort:priority !updated")

      expect(result.sort).toEqual([
        { field: "priority", reverse: false },
        { field: "updated", reverse: true }
      ])
      expect(result.filters).toHaveLength(1)
    })

    it("should return empty array when no sort specified", () => {
      const result = parseQuery("status:Pending")

      expect(result.sort).toEqual([])
    })

  })

})

describe("getAutocompletions", () => {

  describe("attribute completion", () => {

    it("should suggest attributes when typing partial attribute", () => {
      const suggestions = getAutocompletions("sta", 3)

      expect(suggestions).toContain("status:")
    })

    it("should suggest status when typing \"s\"", () => {
      const suggestions = getAutocompletions("s", 1)

      expect(suggestions).toContain("status:")
    })

    it("should suggest multiple matching attributes", () => {
      const suggestions = getAutocompletions("c", 1)

      expect(suggestions).toContain("created:")
      expect(suggestions).toContain("completed:")
      expect(suggestions).toContain("comment:")
    })

    it("should suggest priority when typing \"pri\"", () => {
      const suggestions = getAutocompletions("pri", 3)

      expect(suggestions).toContain("priority:")
    })

    it("should suggest title when typing \"ti\"", () => {
      const suggestions = getAutocompletions("ti", 2)

      expect(suggestions).toContain("title:")
    })

    it("should include prefix when suggesting attributes", () => {
      const suggestions = getAutocompletions("status:Pending crea", 19)

      expect(suggestions).toContain("status:Pending created:")
    })

  })

  describe("value completion", () => {

    it("should suggest status values after \"status:\"", () => {
      const suggestions = getAutocompletions("status:", 7)

      expect(suggestions).toContain("status:created ")
      expect(suggestions).toContain("status:pending ")
      expect(suggestions).toContain("status:wip ")
      expect(suggestions).toContain("status:blocked by ")
      expect(suggestions).toContain("status:completed ")
    })

    it("should suggest priority values after \"priority:\"", () => {
      const suggestions = getAutocompletions("priority:", 9)

      expect(suggestions).toContain("priority:low ")
      expect(suggestions).toContain("priority:medium ")
      expect(suggestions).toContain("priority:high ")
      expect(suggestions).toContain("priority:critical ")
    })

    it("should filter status values based on partial input", () => {
      const suggestions = getAutocompletions("status:Pen", 10)

      expect(suggestions).toContain("status:pending ")
      expect(suggestions).not.toContain("status:completed ")
      expect(suggestions).not.toContain("status:created ")
    })

    it("should filter priority values based on partial input", () => {
      const suggestions = getAutocompletions("priority:C", 10)

      expect(suggestions).toContain("priority:critical ")
      expect(suggestions).not.toContain("priority:low ")
      expect(suggestions).not.toContain("priority:medium ")
    })

    it("should suggest is values after \"is:\"", () => {
      const suggestions = getAutocompletions("is:", 3)

      expect(suggestions).toContain("is:open ")
      expect(suggestions).toContain("is:closed ")
    })

    it("should filter is values based on partial input", () => {
      const suggestions = getAutocompletions("is:op", 5)

      expect(suggestions).toContain("is:open ")
      expect(suggestions).not.toContain("is:closed ")
    })

  })

  describe("date completion", () => {

    it("should suggest date keywords and values after attribute", () => {
      const suggestions = getAutocompletions("created:", 8)

      expect(suggestions).toContain("created:before ")
      expect(suggestions).toContain("created:after ")
      expect(suggestions).toContain("created:today ")
      expect(suggestions).toContain("created:yesterday ")
    })

    it("should suggest date keywords when typing partial keyword", () => {
      const suggestions = getAutocompletions("created:af", 10)

      expect(suggestions).toContain("created:after ")
      expect(suggestions).not.toContain("created:before ")
    })

    it("should suggest date values when typing partial date", () => {
      const suggestions = getAutocompletions("created:tod", 11)

      expect(suggestions).toContain("created:today ")
      expect(suggestions).not.toContain("created:yesterday ")
    })

    it("should suggest common date values after \"after\"", () => {
      const suggestions = getAutocompletions("created:after ", 14)

      expect(suggestions).toContain("created:after today ")
      expect(suggestions).toContain("created:after yesterday ")
      expect(suggestions).toContain("created:after last week ")
      expect(suggestions).toContain("created:after last month ")
    })

    it("should suggest attributes after completing date value", () => {
      const suggestions = getAutocompletions("created:before today ", 21)

      expect(suggestions).toContain("created:before today > ")
      expect(suggestions).toContain("created:before today status:")
      expect(suggestions).toContain("created:before today priority:")
    })

  })

  describe("multiple filters", () => {

    it("should suggest attributes after completing first filter", () => {
      const suggestions = getAutocompletions("status:Pending ", 15)

      expect(suggestions).toContain("status:Pending > ")
      expect(suggestions).toContain("status:Pending priority:")
      expect(suggestions).toContain("status:Pending title:")
      expect(suggestions).toContain("status:Pending created:")
    })

    it("should suggest attributes in middle of query", () => {
      const suggestions = getAutocompletions("status:Pending pri", 18)

      expect(suggestions).toContain("status:Pending priority:")
    })

    it("Should work with dates", () => {
      const suggestions = getAutocompletions("status:Pending created:", 24)

      expect(suggestions).toContain("status:Pending created:before ")
    })

  })

  describe("action completion", () => {

    it("should suggest \">\" for actions after filter", () => {
      const suggestions = getAutocompletions("status:Pending ", 15)

      expect(suggestions).toContain("status:Pending > ")
    })

    it("should suggest action attributes after \">\"", () => {
      const suggestions = getAutocompletions("status:Pending > ", 17)

      expect(suggestions).toContain("status:Pending > status:")
      expect(suggestions).toContain("status:Pending > priority:")
      expect(suggestions).toContain("status:Pending > title:")
      expect(suggestions).toContain("status:Pending > description:")
    })

    it("should suggest action attributes when typing partial", () => {
      const suggestions = getAutocompletions("status:Pending > sta", 20)

      expect(suggestions).toContain("status:Pending > status:")
    })

    it("should suggest status values in action context", () => {
      const suggestions = getAutocompletions("status:Pending > status:", 24)

      expect(suggestions).toContain("status:Pending > status:created ")
      expect(suggestions).toContain("status:Pending > status:completed ")
      expect(suggestions).toContain("status:Pending > status:wip ")
    })

    it("should suggest multiple action attributes after first action", () => {
      const suggestions = getAutocompletions("status:Pending > status:Completed ", 34)

      expect(suggestions).toContain("status:Pending > status:Completed priority:")
      expect(suggestions).toContain("status:Pending > status:Completed title:")
      expect(suggestions).not.toContain(">")
    })

  })

  describe("negation completion", () => {

    it("should suggest \"!\" before attribute value", () => {
      const suggestions = getAutocompletions("status:", 7)

      expect(suggestions).toContain("status:!")
    })

    it("should suggest negated status values after \"status:!\"", () => {
      const suggestions = getAutocompletions("status:!", 8)

      expect(suggestions).toContain("status:!created ")
      expect(suggestions).toContain("status:!pending ")
      expect(suggestions).toContain("status:!wip ")
      expect(suggestions).toContain("status:!completed ")
      expect(suggestions).not.toContain("status:!")
    })

    it("should filter negated status values after \"status:!p\"", () => {
      const suggestions = getAutocompletions("status:!p", 9)

      expect(suggestions).toContain("status:!pending ")
      expect(suggestions).not.toContain("status:!completed ")
      expect(suggestions).not.toContain("status:!created ")
    })

    it("should suggest wip when typing \"status:w\"", () => {
      const suggestions = getAutocompletions("status:w", 8)

      expect(suggestions).toContain("status:wip ")
    })

    it("should suggest null after \"status:\"", () => {
      const suggestions = getAutocompletions("status:", 7)

      expect(suggestions).toContain("status:null ")
    })

    it("should suggest null after \"status:n\"", () => {
      const suggestions = getAutocompletions("status:n", 8)

      expect(suggestions).toContain("status:null ")
    })

    it("should suggest !null after \"status:!\"", () => {
      const suggestions = getAutocompletions("status:!", 8)

      expect(suggestions).toContain("status:!null ")
    })

    it("should suggest !null after \"status:!n\"", () => {
      const suggestions = getAutocompletions("status:!n", 9)

      expect(suggestions).toContain("status:!null ")
    })

    it("should suggest null for date attributes", () => {
      const suggestions = getAutocompletions("created:", 8)

      expect(suggestions).toContain("created:null ")
    })

    it("should suggest null after \"created:n\"", () => {
      const suggestions = getAutocompletions("created:n", 9)

      expect(suggestions).toContain("created:null ")
    })

  })

  describe("sort completion", () => {

    it("should suggest sort attribute when typing \"so\"", () => {
      const suggestions = getAutocompletions("so", 2)

      expect(suggestions).toContain("sort:")
    })

    it("should suggest sort fields after \"sort:\"", () => {
      const suggestions = getAutocompletions("sort:", 5)

      expect(suggestions).toContain("sort:created ")
      expect(suggestions).toContain("sort:!created ")
      expect(suggestions).toContain("sort:priority ")
      expect(suggestions).toContain("sort:!priority ")
      expect(suggestions).toContain("sort:status ")
      expect(suggestions).toContain("sort:updated ")
    })

    it("should filter sort fields based on partial input", () => {
      const suggestions = getAutocompletions("sort:cre", 8)

      expect(suggestions).toContain("sort:created ")
      expect(suggestions).not.toContain("sort:priority ")
    })

    it("should suggest multiple sort fields after first one", () => {
      const suggestions = getAutocompletions("sort:created ", 13)

      expect(suggestions).toContain("sort:created priority ")
      expect(suggestions).toContain("sort:created !priority ")
      expect(suggestions).toContain("sort:created status ")
    })

    it("should suggest multiple sort fields after negated first one", () => {
      const suggestions = getAutocompletions("sort:!created ", 14)

      expect(suggestions).toContain("sort:!created created ")
      expect(suggestions).toContain("sort:!created priority ")
      expect(suggestions).toContain("sort:!created !priority ")
    })

    it("should suggest negated sort fields", () => {
      const suggestions = getAutocompletions("sort:!", 6)

      expect(suggestions).toContain("sort:!created ")
      expect(suggestions).toContain("sort:!priority ")
    })

    it("should prioritize negated sort fields when typing negation", () => {
      const suggestions = getAutocompletions("sort:!t", 7)

      expect(suggestions[0]).toBe("sort:!title ")
      expect(suggestions.length).toBe(1)
    })

    it("should prioritize negated sort fields with multiple matches", () => {
      const suggestions = getAutocompletions("sort:!c", 7)

      const negatedSuggestions = suggestions.filter(s => s.includes("!c"))
      const regularSuggestions = suggestions.filter(s => !s.includes("!c") && s.includes("c"))

      expect(negatedSuggestions.length).toBeGreaterThan(0)
      expect(negatedSuggestions.every((_, i) =>
        i >= regularSuggestions.length ? true : suggestions.indexOf(negatedSuggestions[0]) < suggestions.indexOf(regularSuggestions[0])
      )).toBe(true)
    })

    it("should suggest sort fields after filter", () => {
      const suggestions = getAutocompletions("status:Completed sort:", 22)

      expect(suggestions).toContain("status:Completed sort:created ")
      expect(suggestions).toContain("status:Completed sort:priority ")
      expect(suggestions).toContain("status:Completed sort:!created ")
    })

  })

  describe("quoted strings", () => {

    it("should not suggest inside quoted string", () => {
      const suggestions = getAutocompletions("title:\"My ", 10)

      expect(suggestions).toHaveLength(0)
    })

    it("should suggest after closing quote", () => {
      const suggestions = getAutocompletions("title:\"My Task\" ", 16)

      expect(suggestions).toContain("title:\"My Task\" > ")
      expect(suggestions).toContain("title:\"My Task\" status:")
      expect(suggestions).toContain("title:\"My Task\" priority:")
    })

  })

})
