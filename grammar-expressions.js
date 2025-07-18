const { separated, separated1 } = require('./grammar-rules')

exports.rules = {
	_expression: ($) =>
		prec.left(
			choice(
				$.binary_expression,
				seq($._expression, '.', $._expression),
				seq($._expression, '[', $._expression, ']'),
			),
		),

	binary_expression: ($) =>
		choice(
			$.unary_expression,
			seq($.binary_expression, $.binary_operator, $.unary_expression),
			seq(
				$.binary_expression,
				alias('is', $.binary_operator),
				choice($.unary_expression, $.builtin_test),
			),
		),

	// Are these needed in Nunjucks?
	builtin_test: ($) =>
		prec.left(
			choice(
				'boolean',
				'callable',
				'defined',
				seq('divisibleby', $._expression),
				seq('eq', $._expression),
				'escaped',
				'even',
				'filter',
				'float',
				seq('ge', $._expression),
				seq('gt', $._expression),
				seq('in', $.list_literal),
				'integer',
				'iterable',
				seq('le', $._expression),
				'lower',
				seq('lt', $._expression),
				'mapping',
				seq('ne', $._expression),
				'number',
				'odd',
				seq('sameas', $._expression),
				'sequence',
				'string',
				'test',
				'undefined',
				'upper',
			),
		),

	assignment_expression: ($) =>
		seq(
			separated1($.identifier, '.'),
			alias('=', $.binary_operator),
			$._expression,
		),

	in_expression: ($) =>
		prec(
			1,
			seq(
				separated1($.identifier),
				alias('in', $.binary_operator),
				$._expression,
			),
		),

	binary_operator: (_) =>
		choice(
			'+',
			'-',
			'*',
			'/',
			'//',
			'%',
			'**',
			'==',
			'!=',
			'>',
			'>=',
			'<',
			'<=',
			'and',
			'or',
			'|',
			'~',
		),

	unary_expression: ($) =>
		choice($.primary_expression, seq($.unary_operator, $.unary_expression)),
	unary_operator: (_) => choice('not', '!'),

	primary_expression: ($) =>
		choice(
			$.function_call,
			$.literal,
			$.inline_trans,
			$.identifier,
			seq('(', $._expression, ')'),
		),

	function_call: ($) => seq($.identifier, '(', separated($.arg), ')'),
	arg: ($) =>
		seq(
			optional(seq($.identifier, alias('=', $.binary_operator))),
			$._expression,
		),
	inline_trans: ($) => seq('_', '(', $._expression, ')'),
}
