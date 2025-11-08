// Generated from src/utils/commands.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { QueryContext } from "./commandsParser";
import { Action_queryContext } from "./commandsParser";
import { Filter_queryContext } from "./commandsParser";
import { Raw_stringContext } from "./commandsParser";
import { ActionsContext } from "./commandsParser";
import { AssignmentContext } from "./commandsParser";
import { FiltersContext } from "./commandsParser";
import { FilterContext } from "./commandsParser";
import { Sort_filterContext } from "./commandsParser";
import { SortContext } from "./commandsParser";
import { Date_filterContext } from "./commandsParser";
import { String_filterContext } from "./commandsParser";
import { StringContext } from "./commandsParser";
import { Date_valueContext } from "./commandsParser";
import { Value_tokenContext } from "./commandsParser";
import { Quoted_stringContext } from "./commandsParser";
import { Quoted_contentContext } from "./commandsParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `commandsParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface commandsVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `commandsParser.query`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQuery?: (ctx: QueryContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.action_query`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAction_query?: (ctx: Action_queryContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.filter_query`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFilter_query?: (ctx: Filter_queryContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.raw_string`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRaw_string?: (ctx: Raw_stringContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.actions`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitActions?: (ctx: ActionsContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.assignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignment?: (ctx: AssignmentContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.filters`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFilters?: (ctx: FiltersContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.filter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFilter?: (ctx: FilterContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.sort_filter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSort_filter?: (ctx: Sort_filterContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.sort`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSort?: (ctx: SortContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.date_filter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDate_filter?: (ctx: Date_filterContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.string_filter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitString_filter?: (ctx: String_filterContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.string`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitString?: (ctx: StringContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.date_value`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDate_value?: (ctx: Date_valueContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.value_token`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitValue_token?: (ctx: Value_tokenContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.quoted_string`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQuoted_string?: (ctx: Quoted_stringContext) => Result;

	/**
	 * Visit a parse tree produced by `commandsParser.quoted_content`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQuoted_content?: (ctx: Quoted_contentContext) => Result;
}

