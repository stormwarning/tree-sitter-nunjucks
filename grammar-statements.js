const { separated, separated1 } = require('./grammar-rules.js')

exports.rules = {
	_statement: ($) =>
		seq(
			choice(
				'endfor',
				seq('elif', $._expression),
				'else',
				'endif',
				'endblock',
				'endwith',
				'endfilter',
				'endmacro',
				'endcall',
				'endset',
				'endtrans',
				'continue',
				'break',
				'debug',
				'endautoescape',
				$.do_statement,
				$.include_statement,
				$.import_statement,
				$.set_statement,
				$.for_statement,
				$.if_expression,
				$.with_statement,
				$.call_statement,
				$.set_statement,
				$.extends_statement,
				$.macro_statement,
				$.filter_statement,
				$.block_statement,
				$.pluralize_statement,
				$.trans_statement,
				$.autoescape_statement,
			),
		),

	do_statement: ($) => seq('do', $._expression),
	autoescape_statement: ($) => seq('autoescape', optional($.boolean_literal)),
	trans_statement: ($) =>
		seq('trans', separated(choice($.identifier, $.assignment_expression))),
	pluralize_statement: ($) => seq('pluralize', optional($.identifier)),
	ternary_expression: ($) =>
		seq('if', $._expression, optional(seq('else', $._expression))),
	block_statement: ($) => seq('block', $.identifier),
	filter_statement: ($) => seq('filter', $._expression),
	macro_statement: ($) => seq('macro', $.function_call),
	extends_statement: ($) =>
		prec.right(
			seq(
				'extends',
				choice($.string_literal, $.identifier),
				optional($.ternary_expression),
			),
		),
	call_statement: ($) =>
		seq('call', optional(seq('(', $.identifier, ')')), $.function_call),
	with_statement: ($) => seq('with', repeat($.assignment_expression)),
	import_statement: ($) =>
		seq(
			optional($.import_from),
			'import',
			seq(choice(separated1($.identifier), $.string_literal)),
			optional($.import_as),
			optional($.import_attribute),
		),
	import_from: ($) => seq('from', $.string_literal),
	import_as: ($) => seq('as', separated1($.identifier)),
	import_attribute: ($) => $.attribute_context,
	include_statement: ($) =>
		seq(
			'include',
			choice($.string_literal, $.identifier, $.list_literal, $.tuple_literal),
			repeat($.include_attribute),
		),
	include_attribute: ($) => choice($.attribute_ignore, $.attribute_context),
	attribute_ignore: (_) => seq('ignore', 'missing'),
	attribute_context: (_) => seq(choice('with', 'without'), 'context'),
	set_statement: ($) =>
		seq(
			'set',
			separated1($._expression),
			alias('=', $.binary_operator),
			$._expression,
			optional($.ternary_expression),
		),
	for_statement: ($) =>
		seq(
			'for',
			$.in_expression,
			optional($.ternary_expression),
			optional('recursive'),
		),
	if_expression: ($) => seq('if', $._expression),

	content: (_) => prec.right(repeat1(choice(/[^\{]/, /\{[^\#\%]/, '#', '# '))),
	identifier: (_) => /[a-zA-Z_][\w\d_]*/,
	comment: (_) =>
		choice(
			seq('##', /[^\r\n]*/, /\r?\n/),
			seq('{#', repeat(choice(/[^#]+/, '#')), '#}'),
		),
}
