/**
 * @file Nunjucks grammar for tree-sitter
 * @author Jeff Nelson (https://tidaltheory.io)
 * @license ISC
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
	name: 'nunjucks',

	extras: (_) => [/\s/],
	externals: ($) => [$.raw_start, $._raw_char, $.raw_end, $._inline_words],

	rules: {
		template: ($) =>
			repeat(choice($.expression_tag, $.statement_tag, $.comment_tag, $.content)),

		expression_tag: ($) =>
			seq(
				choice('{{', '{{-', '{{+'),
				optional(seq($.expression, optional($.ternary_expression))),
				choice('}}', '-}}', '+}}'),
			),

		statement_tag: ($) =>
			seq(
				choice('{%', '{%-', '{%+'),
				optional($.statement),
				choice('-%}', '%}', '+%}'),
			),

		comment_tag: (_) => seq('{#', repeat(choice(/[^#]+/, '#')), '#}'),

		/**
		 * Expressions.
		 */

		expression: ($) =>
			prec.left(
				choice(
					$.unary_expression,
					seq($.expression, $.binary_operator, $.unary_expression),
					seq($.expression, '.', $.expression),
					seq($.expression, '[', $.expression, ']'),
				),
			),

		ternary_expression: ($) =>
			seq('if', $.expression, optional(seq('else', $.expression))),

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
				'===',
				'!=',
				'!==',
				'>',
				'>=',
				'<',
				'<=',
				'and',
				'or',
				// "|",
				// "~",
			),

		unary_expression: ($) =>
			choice($.primary_expression, seq($.unary_operator, $.unary_expression)),
		unary_operator: (_) => choice('not', '!'),

		primary_expression: ($) =>
			choice(
				$.function_call,
				$.literal,
				$.identifier,
				seq('(', $.expression, ')'),
			),

		/** @todo Should the args be its own type? */
		function_call: ($) =>
			seq(
				$.identifier,
				'(',
				separated(seq($.expression, optional($.ternary_expression))),
				')',
			),

		/**
		 * Statements.
		 */

		statement: ($) => choice($.if_statement, $.for_statement, $.end_statement),

		if_statement: ($) => seq('if', $.expression),

		for_statement: ($) =>
			seq('for', separated1($.identifier), 'in', $.expression),

		end_statement: ($) => choice('endif', 'endfor'),

		/**
		 * Literals.
		 */

		literal: ($) =>
			choice(
				$.boolean_literal,
				$.null_literal,
				$.number_literal,
				$.float_literal,
				$.list_literal,
				// $.tuple_literal,
				$.string_literal,
				$.dict_literal,
			),
		boolean_literal: (_) => choice('true', 'false'),
		null_literal: (_) => choice('null', 'none'),
		number_literal: ($) =>
			seq(
				optional(choice('-', '+')),
				choice(
					$.dec_literal,
					$.oct_literal,
					$.bin_literal,
					$.hex_literal,
					$.big_dec_literal,
				),
			),
		dec_literal: (_) => /\d[\d_]*/,
		big_dec_literal: ($) =>
			seq($.dec_literal, choice('e', 'e+', 'e-'), optional('_'), $.dec_literal),
		oct_literal: (_) => /0[oO][0-7_]+/,
		bin_literal: (_) => /0[bB][01_]+/,
		hex_literal: (_) => /0[xX][\da-fA-F_]+/,
		float_literal: ($) => prec(2, seq($.dec_literal, '.', $.dec_literal)),

		list_literal: ($) => seq('[', separated($.expression), optional(','), ']'),
		// tuple_literal: ($) =>
		//   prec(1, seq("(", separated($.expression), optional(","), ")")),
		dict_literal: ($) =>
			seq('{', separated(seq($.expression, ':', $.expression)), '}'),

		string_literal: (_) =>
			choice(
				seq('"', repeat(choice(/[^"]/, '\\"')), '"'),
				seq("'", repeat(choice(/[^']/, "\\'")), "'"),
			),

		/**
		 * Generic types.
		 */

		content: (_) =>
			prec.right(repeat1(choice(/[^\{]/, /\{[^\#\%]/, '#', '# '))),

		identifier: (_) => /[a-zA-Z_][\w\d_]*/,
	},
})

/**
 * @param {Rule} rule
 * @param {string} sep
 * @returns {SeqRule}
 */
function separated1(rule, sep = ',') {
	return seq(rule, repeat(seq(sep, rule)))
}

/**
 * @param {Rule} rule
 * @param {string} sep
 * @returns {ChoiceRule}
 */
function separated(rule, sep = ',') {
	return optional(separated1(rule, sep))
}
