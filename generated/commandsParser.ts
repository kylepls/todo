// Generated from src/utils/commands.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { commandsListener } from "./commandsListener";
import { commandsVisitor } from "./commandsVisitor";


export class commandsParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly NULL = 3;
	public static readonly NOT = 4;
	public static readonly QUOTE = 5;
	public static readonly SORT = 6;
	public static readonly BEFORE = 7;
	public static readonly AFTER = 8;
	public static readonly DATE_ATTRIBUTE = 9;
	public static readonly STRING_ATTRIBUTE = 10;
	public static readonly TEXT = 11;
	public static readonly TEXT_CHARS = 12;
	public static readonly NUMBER = 13;
	public static readonly WS = 14;
	public static readonly RULE_query = 0;
	public static readonly RULE_action_query = 1;
	public static readonly RULE_filter_query = 2;
	public static readonly RULE_raw_string = 3;
	public static readonly RULE_actions = 4;
	public static readonly RULE_assignment = 5;
	public static readonly RULE_filters = 6;
	public static readonly RULE_filter = 7;
	public static readonly RULE_sort_filter = 8;
	public static readonly RULE_sort = 9;
	public static readonly RULE_date_filter = 10;
	public static readonly RULE_string_filter = 11;
	public static readonly RULE_string = 12;
	public static readonly RULE_date_value = 13;
	public static readonly RULE_value_token = 14;
	public static readonly RULE_quoted_string = 15;
	public static readonly RULE_quoted_content = 16;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"query", "action_query", "filter_query", "raw_string", "actions", "assignment", 
		"filters", "filter", "sort_filter", "sort", "date_filter", "string_filter", 
		"string", "date_value", "value_token", "quoted_string", "quoted_content",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'>'", "':'", "'null'", "'!'", "'\"'", "'sort'", "'before'", 
		"'after'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, "NULL", "NOT", "QUOTE", "SORT", "BEFORE", 
		"AFTER", "DATE_ATTRIBUTE", "STRING_ATTRIBUTE", "TEXT", "TEXT_CHARS", "NUMBER", 
		"WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(commandsParser._LITERAL_NAMES, commandsParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return commandsParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "commands.g4"; }

	// @Override
	public get ruleNames(): string[] { return commandsParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return commandsParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(commandsParser._ATN, this);
	}
	// @RuleVersion(0)
	public query(): QueryContext {
		let _localctx: QueryContext = new QueryContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, commandsParser.RULE_query);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 37;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 0, this._ctx) ) {
			case 1:
				{
				this.state = 34;
				this.action_query();
				}
				break;

			case 2:
				{
				this.state = 35;
				this.filter_query();
				}
				break;

			case 3:
				{
				this.state = 36;
				this.raw_string();
				}
				break;
			}
			this.state = 39;
			this.match(commandsParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public action_query(): Action_queryContext {
		let _localctx: Action_queryContext = new Action_queryContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, commandsParser.RULE_action_query);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 42;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << commandsParser.SORT) | (1 << commandsParser.DATE_ATTRIBUTE) | (1 << commandsParser.STRING_ATTRIBUTE))) !== 0)) {
				{
				this.state = 41;
				this.filters();
				}
			}

			this.state = 45;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === commandsParser.WS) {
				{
				this.state = 44;
				this.match(commandsParser.WS);
				}
			}

			this.state = 47;
			this.match(commandsParser.T__0);
			this.state = 49;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				{
				this.state = 48;
				this.match(commandsParser.WS);
				}
				break;
			}
			this.state = 52;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === commandsParser.DATE_ATTRIBUTE || _la === commandsParser.STRING_ATTRIBUTE) {
				{
				this.state = 51;
				this.actions();
				}
			}

			this.state = 55;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === commandsParser.WS) {
				{
				this.state = 54;
				this.match(commandsParser.WS);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public filter_query(): Filter_queryContext {
		let _localctx: Filter_queryContext = new Filter_queryContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, commandsParser.RULE_filter_query);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 57;
			this.filters();
			this.state = 59;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === commandsParser.WS) {
				{
				this.state = 58;
				this.match(commandsParser.WS);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public raw_string(): Raw_stringContext {
		let _localctx: Raw_stringContext = new Raw_stringContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, commandsParser.RULE_raw_string);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 61;
			this.value_token();
			this.state = 68;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === commandsParser.WS) {
				{
				{
				this.state = 62;
				this.match(commandsParser.WS);
				this.state = 64;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << commandsParser.SORT) | (1 << commandsParser.BEFORE) | (1 << commandsParser.AFTER) | (1 << commandsParser.DATE_ATTRIBUTE) | (1 << commandsParser.STRING_ATTRIBUTE) | (1 << commandsParser.TEXT))) !== 0)) {
					{
					this.state = 63;
					this.value_token();
					}
				}

				}
				}
				this.state = 70;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public actions(): ActionsContext {
		let _localctx: ActionsContext = new ActionsContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, commandsParser.RULE_actions);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 71;
			this.assignment();
			this.state = 76;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 72;
					this.match(commandsParser.WS);
					this.state = 73;
					this.assignment();
					}
					}
				}
				this.state = 78;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignment(): AssignmentContext {
		let _localctx: AssignmentContext = new AssignmentContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, commandsParser.RULE_assignment);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 79;
			_la = this._input.LA(1);
			if (!(_la === commandsParser.DATE_ATTRIBUTE || _la === commandsParser.STRING_ATTRIBUTE)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 80;
			this.match(commandsParser.T__1);
			this.state = 81;
			this.string();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public filters(): FiltersContext {
		let _localctx: FiltersContext = new FiltersContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, commandsParser.RULE_filters);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 83;
			this.filter();
			this.state = 88;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 10, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 84;
					this.match(commandsParser.WS);
					this.state = 85;
					this.filter();
					}
					}
				}
				this.state = 90;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 10, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public filter(): FilterContext {
		let _localctx: FilterContext = new FilterContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, commandsParser.RULE_filter);
		try {
			this.state = 94;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case commandsParser.STRING_ATTRIBUTE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 91;
				this.string_filter();
				}
				break;
			case commandsParser.DATE_ATTRIBUTE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 92;
				this.date_filter();
				}
				break;
			case commandsParser.SORT:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 93;
				this.sort_filter();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public sort_filter(): Sort_filterContext {
		let _localctx: Sort_filterContext = new Sort_filterContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, commandsParser.RULE_sort_filter);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 96;
			this.match(commandsParser.SORT);
			this.state = 97;
			this.match(commandsParser.T__1);
			this.state = 98;
			this.sort();
			this.state = 103;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 99;
					this.match(commandsParser.WS);
					this.state = 100;
					this.sort();
					}
					}
				}
				this.state = 105;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public sort(): SortContext {
		let _localctx: SortContext = new SortContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, commandsParser.RULE_sort);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 107;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === commandsParser.NOT) {
				{
				this.state = 106;
				this.match(commandsParser.NOT);
				}
			}

			this.state = 109;
			_la = this._input.LA(1);
			if (!(_la === commandsParser.DATE_ATTRIBUTE || _la === commandsParser.STRING_ATTRIBUTE)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public date_filter(): Date_filterContext {
		let _localctx: Date_filterContext = new Date_filterContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, commandsParser.RULE_date_filter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 111;
			this.match(commandsParser.DATE_ATTRIBUTE);
			this.state = 112;
			this.match(commandsParser.T__1);
			this.state = 114;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === commandsParser.NOT) {
				{
				this.state = 113;
				this.match(commandsParser.NOT);
				}
			}

			this.state = 124;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case commandsParser.NULL:
				{
				this.state = 116;
				this.match(commandsParser.NULL);
				}
				break;
			case commandsParser.QUOTE:
			case commandsParser.SORT:
			case commandsParser.BEFORE:
			case commandsParser.AFTER:
			case commandsParser.DATE_ATTRIBUTE:
			case commandsParser.STRING_ATTRIBUTE:
			case commandsParser.TEXT:
				{
				this.state = 121;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 16, this._ctx) ) {
				case 1:
					{
					this.state = 117;
					_la = this._input.LA(1);
					if (!(_la === commandsParser.BEFORE || _la === commandsParser.AFTER)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					this.state = 119;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === commandsParser.WS) {
						{
						this.state = 118;
						this.match(commandsParser.WS);
						}
					}

					}
					break;
				}
				this.state = 123;
				this.date_value();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public string_filter(): String_filterContext {
		let _localctx: String_filterContext = new String_filterContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, commandsParser.RULE_string_filter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 126;
			this.match(commandsParser.STRING_ATTRIBUTE);
			this.state = 127;
			this.match(commandsParser.T__1);
			this.state = 129;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === commandsParser.NOT) {
				{
				this.state = 128;
				this.match(commandsParser.NOT);
				}
			}

			this.state = 133;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case commandsParser.NULL:
				{
				this.state = 131;
				this.match(commandsParser.NULL);
				}
				break;
			case commandsParser.QUOTE:
			case commandsParser.SORT:
			case commandsParser.BEFORE:
			case commandsParser.AFTER:
			case commandsParser.DATE_ATTRIBUTE:
			case commandsParser.STRING_ATTRIBUTE:
			case commandsParser.TEXT:
				{
				this.state = 132;
				this.string();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public string(): StringContext {
		let _localctx: StringContext = new StringContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, commandsParser.RULE_string);
		try {
			let _alt: number;
			this.state = 144;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case commandsParser.QUOTE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 135;
				this.quoted_string();
				}
				break;
			case commandsParser.SORT:
			case commandsParser.BEFORE:
			case commandsParser.AFTER:
			case commandsParser.DATE_ATTRIBUTE:
			case commandsParser.STRING_ATTRIBUTE:
			case commandsParser.TEXT:
				this.enterOuterAlt(_localctx, 2);
				{
				{
				this.state = 136;
				this.value_token();
				this.state = 141;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 137;
						this.match(commandsParser.WS);
						this.state = 138;
						this.value_token();
						}
						}
					}
					this.state = 143;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
				}
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public date_value(): Date_valueContext {
		let _localctx: Date_valueContext = new Date_valueContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, commandsParser.RULE_date_value);
		try {
			let _alt: number;
			this.state = 155;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case commandsParser.QUOTE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 146;
				this.quoted_string();
				}
				break;
			case commandsParser.SORT:
			case commandsParser.BEFORE:
			case commandsParser.AFTER:
			case commandsParser.DATE_ATTRIBUTE:
			case commandsParser.STRING_ATTRIBUTE:
			case commandsParser.TEXT:
				this.enterOuterAlt(_localctx, 2);
				{
				{
				this.state = 147;
				this.value_token();
				this.state = 152;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 22, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 148;
						this.match(commandsParser.WS);
						this.state = 149;
						this.value_token();
						}
						}
					}
					this.state = 154;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 22, this._ctx);
				}
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public value_token(): Value_tokenContext {
		let _localctx: Value_tokenContext = new Value_tokenContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, commandsParser.RULE_value_token);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 157;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << commandsParser.SORT) | (1 << commandsParser.BEFORE) | (1 << commandsParser.AFTER) | (1 << commandsParser.DATE_ATTRIBUTE) | (1 << commandsParser.STRING_ATTRIBUTE) | (1 << commandsParser.TEXT))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public quoted_string(): Quoted_stringContext {
		let _localctx: Quoted_stringContext = new Quoted_stringContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, commandsParser.RULE_quoted_string);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 159;
			this.match(commandsParser.QUOTE);
			this.state = 160;
			this.quoted_content();
			this.state = 161;
			this.match(commandsParser.QUOTE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public quoted_content(): Quoted_contentContext {
		let _localctx: Quoted_contentContext = new Quoted_contentContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, commandsParser.RULE_quoted_content);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 164;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 163;
				_la = this._input.LA(1);
				if (!(_la === commandsParser.TEXT || _la === commandsParser.WS)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				}
				}
				this.state = 166;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === commandsParser.TEXT || _la === commandsParser.WS);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x10\xAB\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x03" +
		"\x02\x03\x02\x03\x02\x05\x02(\n\x02\x03\x02\x03\x02\x03\x03\x05\x03-\n" +
		"\x03\x03\x03\x05\x030\n\x03\x03\x03\x03\x03\x05\x034\n\x03\x03\x03\x05" +
		"\x037\n\x03\x03\x03\x05\x03:\n\x03\x03\x04\x03\x04\x05\x04>\n\x04\x03" +
		"\x05\x03\x05\x03\x05\x05\x05C\n\x05\x07\x05E\n\x05\f\x05\x0E\x05H\v\x05" +
		"\x03\x06\x03\x06\x03\x06\x07\x06M\n\x06\f\x06\x0E\x06P\v\x06\x03\x07\x03" +
		"\x07\x03\x07\x03\x07\x03\b\x03\b\x03\b\x07\bY\n\b\f\b\x0E\b\\\v\b\x03" +
		"\t\x03\t\x03\t\x05\ta\n\t\x03\n\x03\n\x03\n\x03\n\x03\n\x07\nh\n\n\f\n" +
		"\x0E\nk\v\n\x03\v\x05\vn\n\v\x03\v\x03\v\x03\f\x03\f\x03\f\x05\fu\n\f" +
		"\x03\f\x03\f\x03\f\x05\fz\n\f\x05\f|\n\f\x03\f\x05\f\x7F\n\f\x03\r\x03" +
		"\r\x03\r\x05\r\x84\n\r\x03\r\x03\r\x05\r\x88\n\r\x03\x0E\x03\x0E\x03\x0E" +
		"\x03\x0E\x07\x0E\x8E\n\x0E\f\x0E\x0E\x0E\x91\v\x0E\x05\x0E\x93\n\x0E\x03" +
		"\x0F\x03\x0F\x03\x0F\x03\x0F\x07\x0F\x99\n\x0F\f\x0F\x0E\x0F\x9C\v\x0F" +
		"\x05\x0F\x9E\n\x0F\x03\x10\x03\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03" +
		"\x12\x06\x12\xA7\n\x12\r\x12\x0E\x12\xA8\x03\x12\x02\x02\x02\x13\x02\x02" +
		"\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16" +
		"\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02\x02\x06\x03\x02\v\f\x03" +
		"\x02\t\n\x03\x02\b\r\x04\x02\r\r\x10\x10\x02\xB5\x02\'\x03\x02\x02\x02" +
		"\x04,\x03\x02\x02\x02\x06;\x03\x02\x02\x02\b?\x03\x02\x02\x02\nI\x03\x02" +
		"\x02\x02\fQ\x03\x02\x02\x02\x0EU\x03\x02\x02\x02\x10`\x03\x02\x02\x02" +
		"\x12b\x03\x02\x02\x02\x14m\x03\x02\x02\x02\x16q\x03\x02\x02\x02\x18\x80" +
		"\x03\x02\x02\x02\x1A\x92\x03\x02\x02\x02\x1C\x9D\x03\x02\x02\x02\x1E\x9F" +
		"\x03\x02\x02\x02 \xA1\x03\x02\x02\x02\"\xA6\x03\x02\x02\x02$(\x05\x04" +
		"\x03\x02%(\x05\x06\x04\x02&(\x05\b\x05\x02\'$\x03\x02\x02\x02\'%\x03\x02" +
		"\x02\x02\'&\x03\x02\x02\x02\'(\x03\x02\x02\x02()\x03\x02\x02\x02)*\x07" +
		"\x02\x02\x03*\x03\x03\x02\x02\x02+-\x05\x0E\b\x02,+\x03\x02\x02\x02,-" +
		"\x03\x02\x02\x02-/\x03\x02\x02\x02.0\x07\x10\x02\x02/.\x03\x02\x02\x02" +
		"/0\x03\x02\x02\x0201\x03\x02\x02\x0213\x07\x03\x02\x0224\x07\x10\x02\x02" +
		"32\x03\x02\x02\x0234\x03\x02\x02\x0246\x03\x02\x02\x0257\x05\n\x06\x02" +
		"65\x03\x02\x02\x0267\x03\x02\x02\x0279\x03\x02\x02\x028:\x07\x10\x02\x02" +
		"98\x03\x02\x02\x029:\x03\x02\x02\x02:\x05\x03\x02\x02\x02;=\x05\x0E\b" +
		"\x02<>\x07\x10\x02\x02=<\x03\x02\x02\x02=>\x03\x02\x02\x02>\x07\x03\x02" +
		"\x02\x02?F\x05\x1E\x10\x02@B\x07\x10\x02\x02AC\x05\x1E\x10\x02BA\x03\x02" +
		"\x02\x02BC\x03\x02\x02\x02CE\x03\x02\x02\x02D@\x03\x02\x02\x02EH\x03\x02" +
		"\x02\x02FD\x03\x02\x02\x02FG\x03\x02\x02\x02G\t\x03\x02\x02\x02HF\x03" +
		"\x02\x02\x02IN\x05\f\x07\x02JK\x07\x10\x02\x02KM\x05\f\x07\x02LJ\x03\x02" +
		"\x02\x02MP\x03\x02\x02\x02NL\x03\x02\x02\x02NO\x03\x02\x02\x02O\v\x03" +
		"\x02\x02\x02PN\x03\x02\x02\x02QR\t\x02\x02\x02RS\x07\x04\x02\x02ST\x05" +
		"\x1A\x0E\x02T\r\x03\x02\x02\x02UZ\x05\x10\t\x02VW\x07\x10\x02\x02WY\x05" +
		"\x10\t\x02XV\x03\x02\x02\x02Y\\\x03\x02\x02\x02ZX\x03\x02\x02\x02Z[\x03" +
		"\x02\x02\x02[\x0F\x03\x02\x02\x02\\Z\x03\x02\x02\x02]a\x05\x18\r\x02^" +
		"a\x05\x16\f\x02_a\x05\x12\n\x02`]\x03\x02\x02\x02`^\x03\x02\x02\x02`_" +
		"\x03\x02\x02\x02a\x11\x03\x02\x02\x02bc\x07\b\x02\x02cd\x07\x04\x02\x02" +
		"di\x05\x14\v\x02ef\x07\x10\x02\x02fh\x05\x14\v\x02ge\x03\x02\x02\x02h" +
		"k\x03\x02\x02\x02ig\x03\x02\x02\x02ij\x03\x02\x02\x02j\x13\x03\x02\x02" +
		"\x02ki\x03\x02\x02\x02ln\x07\x06\x02\x02ml\x03\x02\x02\x02mn\x03\x02\x02" +
		"\x02no\x03\x02\x02\x02op\t\x02\x02\x02p\x15\x03\x02\x02\x02qr\x07\v\x02" +
		"\x02rt\x07\x04\x02\x02su\x07\x06\x02\x02ts\x03\x02\x02\x02tu\x03\x02\x02" +
		"\x02u~\x03\x02\x02\x02v\x7F\x07\x05\x02\x02wy\t\x03\x02\x02xz\x07\x10" +
		"\x02\x02yx\x03\x02\x02\x02yz\x03\x02\x02\x02z|\x03\x02\x02\x02{w\x03\x02" +
		"\x02\x02{|\x03\x02\x02\x02|}\x03\x02\x02\x02}\x7F\x05\x1C\x0F\x02~v\x03" +
		"\x02\x02\x02~{\x03\x02\x02\x02\x7F\x17\x03\x02\x02\x02\x80\x81\x07\f\x02" +
		"\x02\x81\x83\x07\x04\x02\x02\x82\x84\x07\x06\x02\x02\x83\x82\x03\x02\x02" +
		"\x02\x83\x84\x03\x02\x02\x02\x84\x87\x03\x02\x02\x02\x85\x88\x07\x05\x02" +
		"\x02\x86\x88\x05\x1A\x0E\x02\x87\x85\x03\x02\x02\x02\x87\x86\x03\x02\x02" +
		"\x02\x88\x19\x03\x02\x02\x02\x89\x93\x05 \x11\x02\x8A\x8F\x05\x1E\x10" +
		"\x02\x8B\x8C\x07\x10\x02\x02\x8C\x8E\x05\x1E\x10\x02\x8D\x8B\x03\x02\x02" +
		"\x02\x8E\x91\x03\x02\x02\x02\x8F\x8D\x03\x02\x02\x02\x8F\x90\x03\x02\x02" +
		"\x02\x90\x93\x03\x02\x02\x02\x91\x8F\x03\x02\x02\x02\x92\x89\x03\x02\x02" +
		"\x02\x92\x8A\x03\x02\x02\x02\x93\x1B\x03\x02\x02\x02\x94\x9E\x05 \x11" +
		"\x02\x95\x9A\x05\x1E\x10\x02\x96\x97\x07\x10\x02\x02\x97\x99\x05\x1E\x10" +
		"\x02\x98\x96\x03\x02\x02\x02\x99\x9C\x03\x02\x02\x02\x9A\x98\x03\x02\x02" +
		"\x02\x9A\x9B\x03\x02\x02\x02\x9B\x9E\x03\x02\x02\x02\x9C\x9A\x03\x02\x02" +
		"\x02\x9D\x94\x03\x02\x02\x02\x9D\x95\x03\x02\x02\x02\x9E\x1D\x03\x02\x02" +
		"\x02\x9F\xA0\t\x04\x02\x02\xA0\x1F\x03\x02\x02\x02\xA1\xA2\x07\x07\x02" +
		"\x02\xA2\xA3\x05\"\x12\x02\xA3\xA4\x07\x07\x02\x02\xA4!\x03\x02\x02\x02" +
		"\xA5\xA7\t\x05\x02\x02\xA6\xA5\x03\x02\x02\x02\xA7\xA8\x03\x02\x02\x02" +
		"\xA8\xA6\x03\x02\x02\x02\xA8\xA9\x03\x02\x02\x02\xA9#\x03\x02\x02\x02" +
		"\x1B\',/369=BFNZ`imty{~\x83\x87\x8F\x92\x9A\x9D\xA8";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!commandsParser.__ATN) {
			commandsParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(commandsParser._serializedATN));
		}

		return commandsParser.__ATN;
	}

}

export class QueryContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(commandsParser.EOF, 0); }
	public action_query(): Action_queryContext | undefined {
		return this.tryGetRuleContext(0, Action_queryContext);
	}
	public filter_query(): Filter_queryContext | undefined {
		return this.tryGetRuleContext(0, Filter_queryContext);
	}
	public raw_string(): Raw_stringContext | undefined {
		return this.tryGetRuleContext(0, Raw_stringContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_query; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterQuery) {
			listener.enterQuery(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitQuery) {
			listener.exitQuery(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitQuery) {
			return visitor.visitQuery(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Action_queryContext extends ParserRuleContext {
	public filters(): FiltersContext | undefined {
		return this.tryGetRuleContext(0, FiltersContext);
	}
	public WS(): TerminalNode[];
	public WS(i: number): TerminalNode;
	public WS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(commandsParser.WS);
		} else {
			return this.getToken(commandsParser.WS, i);
		}
	}
	public actions(): ActionsContext | undefined {
		return this.tryGetRuleContext(0, ActionsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_action_query; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterAction_query) {
			listener.enterAction_query(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitAction_query) {
			listener.exitAction_query(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitAction_query) {
			return visitor.visitAction_query(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Filter_queryContext extends ParserRuleContext {
	public filters(): FiltersContext {
		return this.getRuleContext(0, FiltersContext);
	}
	public WS(): TerminalNode | undefined { return this.tryGetToken(commandsParser.WS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_filter_query; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterFilter_query) {
			listener.enterFilter_query(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitFilter_query) {
			listener.exitFilter_query(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitFilter_query) {
			return visitor.visitFilter_query(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Raw_stringContext extends ParserRuleContext {
	public value_token(): Value_tokenContext[];
	public value_token(i: number): Value_tokenContext;
	public value_token(i?: number): Value_tokenContext | Value_tokenContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Value_tokenContext);
		} else {
			return this.getRuleContext(i, Value_tokenContext);
		}
	}
	public WS(): TerminalNode[];
	public WS(i: number): TerminalNode;
	public WS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(commandsParser.WS);
		} else {
			return this.getToken(commandsParser.WS, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_raw_string; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterRaw_string) {
			listener.enterRaw_string(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitRaw_string) {
			listener.exitRaw_string(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitRaw_string) {
			return visitor.visitRaw_string(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ActionsContext extends ParserRuleContext {
	public assignment(): AssignmentContext[];
	public assignment(i: number): AssignmentContext;
	public assignment(i?: number): AssignmentContext | AssignmentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AssignmentContext);
		} else {
			return this.getRuleContext(i, AssignmentContext);
		}
	}
	public WS(): TerminalNode[];
	public WS(i: number): TerminalNode;
	public WS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(commandsParser.WS);
		} else {
			return this.getToken(commandsParser.WS, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_actions; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterActions) {
			listener.enterActions(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitActions) {
			listener.exitActions(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitActions) {
			return visitor.visitActions(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentContext extends ParserRuleContext {
	public string(): StringContext {
		return this.getRuleContext(0, StringContext);
	}
	public STRING_ATTRIBUTE(): TerminalNode | undefined { return this.tryGetToken(commandsParser.STRING_ATTRIBUTE, 0); }
	public DATE_ATTRIBUTE(): TerminalNode | undefined { return this.tryGetToken(commandsParser.DATE_ATTRIBUTE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_assignment; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterAssignment) {
			listener.enterAssignment(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitAssignment) {
			listener.exitAssignment(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitAssignment) {
			return visitor.visitAssignment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FiltersContext extends ParserRuleContext {
	public filter(): FilterContext[];
	public filter(i: number): FilterContext;
	public filter(i?: number): FilterContext | FilterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(FilterContext);
		} else {
			return this.getRuleContext(i, FilterContext);
		}
	}
	public WS(): TerminalNode[];
	public WS(i: number): TerminalNode;
	public WS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(commandsParser.WS);
		} else {
			return this.getToken(commandsParser.WS, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_filters; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterFilters) {
			listener.enterFilters(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitFilters) {
			listener.exitFilters(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitFilters) {
			return visitor.visitFilters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FilterContext extends ParserRuleContext {
	public string_filter(): String_filterContext | undefined {
		return this.tryGetRuleContext(0, String_filterContext);
	}
	public date_filter(): Date_filterContext | undefined {
		return this.tryGetRuleContext(0, Date_filterContext);
	}
	public sort_filter(): Sort_filterContext | undefined {
		return this.tryGetRuleContext(0, Sort_filterContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_filter; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterFilter) {
			listener.enterFilter(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitFilter) {
			listener.exitFilter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitFilter) {
			return visitor.visitFilter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Sort_filterContext extends ParserRuleContext {
	public SORT(): TerminalNode { return this.getToken(commandsParser.SORT, 0); }
	public sort(): SortContext[];
	public sort(i: number): SortContext;
	public sort(i?: number): SortContext | SortContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SortContext);
		} else {
			return this.getRuleContext(i, SortContext);
		}
	}
	public WS(): TerminalNode[];
	public WS(i: number): TerminalNode;
	public WS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(commandsParser.WS);
		} else {
			return this.getToken(commandsParser.WS, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_sort_filter; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterSort_filter) {
			listener.enterSort_filter(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitSort_filter) {
			listener.exitSort_filter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitSort_filter) {
			return visitor.visitSort_filter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SortContext extends ParserRuleContext {
	public STRING_ATTRIBUTE(): TerminalNode | undefined { return this.tryGetToken(commandsParser.STRING_ATTRIBUTE, 0); }
	public DATE_ATTRIBUTE(): TerminalNode | undefined { return this.tryGetToken(commandsParser.DATE_ATTRIBUTE, 0); }
	public NOT(): TerminalNode | undefined { return this.tryGetToken(commandsParser.NOT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_sort; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterSort) {
			listener.enterSort(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitSort) {
			listener.exitSort(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitSort) {
			return visitor.visitSort(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Date_filterContext extends ParserRuleContext {
	public DATE_ATTRIBUTE(): TerminalNode { return this.getToken(commandsParser.DATE_ATTRIBUTE, 0); }
	public NULL(): TerminalNode | undefined { return this.tryGetToken(commandsParser.NULL, 0); }
	public date_value(): Date_valueContext | undefined {
		return this.tryGetRuleContext(0, Date_valueContext);
	}
	public NOT(): TerminalNode | undefined { return this.tryGetToken(commandsParser.NOT, 0); }
	public BEFORE(): TerminalNode | undefined { return this.tryGetToken(commandsParser.BEFORE, 0); }
	public AFTER(): TerminalNode | undefined { return this.tryGetToken(commandsParser.AFTER, 0); }
	public WS(): TerminalNode | undefined { return this.tryGetToken(commandsParser.WS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_date_filter; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterDate_filter) {
			listener.enterDate_filter(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitDate_filter) {
			listener.exitDate_filter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitDate_filter) {
			return visitor.visitDate_filter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class String_filterContext extends ParserRuleContext {
	public STRING_ATTRIBUTE(): TerminalNode { return this.getToken(commandsParser.STRING_ATTRIBUTE, 0); }
	public NULL(): TerminalNode | undefined { return this.tryGetToken(commandsParser.NULL, 0); }
	public string(): StringContext | undefined {
		return this.tryGetRuleContext(0, StringContext);
	}
	public NOT(): TerminalNode | undefined { return this.tryGetToken(commandsParser.NOT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_string_filter; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterString_filter) {
			listener.enterString_filter(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitString_filter) {
			listener.exitString_filter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitString_filter) {
			return visitor.visitString_filter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StringContext extends ParserRuleContext {
	public quoted_string(): Quoted_stringContext | undefined {
		return this.tryGetRuleContext(0, Quoted_stringContext);
	}
	public value_token(): Value_tokenContext[];
	public value_token(i: number): Value_tokenContext;
	public value_token(i?: number): Value_tokenContext | Value_tokenContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Value_tokenContext);
		} else {
			return this.getRuleContext(i, Value_tokenContext);
		}
	}
	public WS(): TerminalNode[];
	public WS(i: number): TerminalNode;
	public WS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(commandsParser.WS);
		} else {
			return this.getToken(commandsParser.WS, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_string; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterString) {
			listener.enterString(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitString) {
			listener.exitString(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitString) {
			return visitor.visitString(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Date_valueContext extends ParserRuleContext {
	public quoted_string(): Quoted_stringContext | undefined {
		return this.tryGetRuleContext(0, Quoted_stringContext);
	}
	public value_token(): Value_tokenContext[];
	public value_token(i: number): Value_tokenContext;
	public value_token(i?: number): Value_tokenContext | Value_tokenContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Value_tokenContext);
		} else {
			return this.getRuleContext(i, Value_tokenContext);
		}
	}
	public WS(): TerminalNode[];
	public WS(i: number): TerminalNode;
	public WS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(commandsParser.WS);
		} else {
			return this.getToken(commandsParser.WS, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_date_value; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterDate_value) {
			listener.enterDate_value(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitDate_value) {
			listener.exitDate_value(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitDate_value) {
			return visitor.visitDate_value(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Value_tokenContext extends ParserRuleContext {
	public TEXT(): TerminalNode | undefined { return this.tryGetToken(commandsParser.TEXT, 0); }
	public DATE_ATTRIBUTE(): TerminalNode | undefined { return this.tryGetToken(commandsParser.DATE_ATTRIBUTE, 0); }
	public STRING_ATTRIBUTE(): TerminalNode | undefined { return this.tryGetToken(commandsParser.STRING_ATTRIBUTE, 0); }
	public SORT(): TerminalNode | undefined { return this.tryGetToken(commandsParser.SORT, 0); }
	public BEFORE(): TerminalNode | undefined { return this.tryGetToken(commandsParser.BEFORE, 0); }
	public AFTER(): TerminalNode | undefined { return this.tryGetToken(commandsParser.AFTER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_value_token; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterValue_token) {
			listener.enterValue_token(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitValue_token) {
			listener.exitValue_token(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitValue_token) {
			return visitor.visitValue_token(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Quoted_stringContext extends ParserRuleContext {
	public QUOTE(): TerminalNode[];
	public QUOTE(i: number): TerminalNode;
	public QUOTE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(commandsParser.QUOTE);
		} else {
			return this.getToken(commandsParser.QUOTE, i);
		}
	}
	public quoted_content(): Quoted_contentContext {
		return this.getRuleContext(0, Quoted_contentContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_quoted_string; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterQuoted_string) {
			listener.enterQuoted_string(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitQuoted_string) {
			listener.exitQuoted_string(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitQuoted_string) {
			return visitor.visitQuoted_string(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Quoted_contentContext extends ParserRuleContext {
	public TEXT(): TerminalNode[];
	public TEXT(i: number): TerminalNode;
	public TEXT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(commandsParser.TEXT);
		} else {
			return this.getToken(commandsParser.TEXT, i);
		}
	}
	public WS(): TerminalNode[];
	public WS(i: number): TerminalNode;
	public WS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(commandsParser.WS);
		} else {
			return this.getToken(commandsParser.WS, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return commandsParser.RULE_quoted_content; }
	// @Override
	public enterRule(listener: commandsListener): void {
		if (listener.enterQuoted_content) {
			listener.enterQuoted_content(this);
		}
	}
	// @Override
	public exitRule(listener: commandsListener): void {
		if (listener.exitQuoted_content) {
			listener.exitQuoted_content(this);
		}
	}
	// @Override
	public accept<Result>(visitor: commandsVisitor<Result>): Result {
		if (visitor.visitQuoted_content) {
			return visitor.visitQuoted_content(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


