// Generated from src/utils/commands.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
 * This interface defines a complete listener for a parse tree produced by
 * `commandsParser`.
 */
export interface commandsListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `commandsParser.query`.
	 * @param ctx the parse tree
	 */
	enterQuery?: (ctx: QueryContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.query`.
	 * @param ctx the parse tree
	 */
	exitQuery?: (ctx: QueryContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.action_query`.
	 * @param ctx the parse tree
	 */
	enterAction_query?: (ctx: Action_queryContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.action_query`.
	 * @param ctx the parse tree
	 */
	exitAction_query?: (ctx: Action_queryContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.filter_query`.
	 * @param ctx the parse tree
	 */
	enterFilter_query?: (ctx: Filter_queryContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.filter_query`.
	 * @param ctx the parse tree
	 */
	exitFilter_query?: (ctx: Filter_queryContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.raw_string`.
	 * @param ctx the parse tree
	 */
	enterRaw_string?: (ctx: Raw_stringContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.raw_string`.
	 * @param ctx the parse tree
	 */
	exitRaw_string?: (ctx: Raw_stringContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.actions`.
	 * @param ctx the parse tree
	 */
	enterActions?: (ctx: ActionsContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.actions`.
	 * @param ctx the parse tree
	 */
	exitActions?: (ctx: ActionsContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.assignment`.
	 * @param ctx the parse tree
	 */
	enterAssignment?: (ctx: AssignmentContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.assignment`.
	 * @param ctx the parse tree
	 */
	exitAssignment?: (ctx: AssignmentContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.filters`.
	 * @param ctx the parse tree
	 */
	enterFilters?: (ctx: FiltersContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.filters`.
	 * @param ctx the parse tree
	 */
	exitFilters?: (ctx: FiltersContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.filter`.
	 * @param ctx the parse tree
	 */
	enterFilter?: (ctx: FilterContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.filter`.
	 * @param ctx the parse tree
	 */
	exitFilter?: (ctx: FilterContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.sort_filter`.
	 * @param ctx the parse tree
	 */
	enterSort_filter?: (ctx: Sort_filterContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.sort_filter`.
	 * @param ctx the parse tree
	 */
	exitSort_filter?: (ctx: Sort_filterContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.sort`.
	 * @param ctx the parse tree
	 */
	enterSort?: (ctx: SortContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.sort`.
	 * @param ctx the parse tree
	 */
	exitSort?: (ctx: SortContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.date_filter`.
	 * @param ctx the parse tree
	 */
	enterDate_filter?: (ctx: Date_filterContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.date_filter`.
	 * @param ctx the parse tree
	 */
	exitDate_filter?: (ctx: Date_filterContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.string_filter`.
	 * @param ctx the parse tree
	 */
	enterString_filter?: (ctx: String_filterContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.string_filter`.
	 * @param ctx the parse tree
	 */
	exitString_filter?: (ctx: String_filterContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.string`.
	 * @param ctx the parse tree
	 */
	enterString?: (ctx: StringContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.string`.
	 * @param ctx the parse tree
	 */
	exitString?: (ctx: StringContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.date_value`.
	 * @param ctx the parse tree
	 */
	enterDate_value?: (ctx: Date_valueContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.date_value`.
	 * @param ctx the parse tree
	 */
	exitDate_value?: (ctx: Date_valueContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.value_token`.
	 * @param ctx the parse tree
	 */
	enterValue_token?: (ctx: Value_tokenContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.value_token`.
	 * @param ctx the parse tree
	 */
	exitValue_token?: (ctx: Value_tokenContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.quoted_string`.
	 * @param ctx the parse tree
	 */
	enterQuoted_string?: (ctx: Quoted_stringContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.quoted_string`.
	 * @param ctx the parse tree
	 */
	exitQuoted_string?: (ctx: Quoted_stringContext) => void;

	/**
	 * Enter a parse tree produced by `commandsParser.quoted_content`.
	 * @param ctx the parse tree
	 */
	enterQuoted_content?: (ctx: Quoted_contentContext) => void;
	/**
	 * Exit a parse tree produced by `commandsParser.quoted_content`.
	 * @param ctx the parse tree
	 */
	exitQuoted_content?: (ctx: Quoted_contentContext) => void;
}

