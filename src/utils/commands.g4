grammar commands;

query: (action_query | filter_query | raw_string)? EOF;
action_query: filters? WS? '>' WS? actions? WS?;
filter_query: filters WS?;

raw_string: value_token (WS value_token?)*;

actions: assignment (WS assignment)*;
assignment: (STRING_ATTRIBUTE | DATE_ATTRIBUTE) ':' string;

filters: filter (WS filter)*;
filter: string_filter | date_filter | sort_filter;

sort_filter: SORT ':' sort ( WS sort )* ;
sort: NOT? (STRING_ATTRIBUTE | DATE_ATTRIBUTE);

date_filter: DATE_ATTRIBUTE ':' NOT? (NULL | ((BEFORE | AFTER) WS?)? date_value);

string_filter: STRING_ATTRIBUTE ':' NOT? (NULL | string);
string: quoted_string | (value_token (WS value_token)*);
date_value: quoted_string | (value_token (WS value_token)*);
value_token: TEXT | DATE_ATTRIBUTE | STRING_ATTRIBUTE | SORT | BEFORE | AFTER;
quoted_string: QUOTE quoted_content QUOTE;
quoted_content: (TEXT | WS)+;

NULL: 'null';
NOT: '!';
QUOTE: '"';
SORT: 'sort';
BEFORE: 'before';
AFTER: 'after';
DATE_ATTRIBUTE: 'created' | 'updated' | 'completed' | 'needby';
STRING_ATTRIBUTE: 'id' | 'title' | 'description' | 'status' | 'priority' | 'blockedby' | 'comment' | 'is';
TEXT: [-a-zA-Z0-9']+;
TEXT_CHARS: [-a-zA-Z0-9'];
NUMBER: [1-9][0-9]*;
WS: [ ]+;

