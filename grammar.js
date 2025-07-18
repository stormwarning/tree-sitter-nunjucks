/**
 * @file Nunjucks grammar for tree-sitter
 * @author Jeff Nelson (https://tidaltheory.io)
 * @license ISC
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const { rules: expressionRules } = require('./grammar-expressions.js')
const { rules: literalRules } = require('./grammar-literals.js')
const { rules: statementRules } = require('./grammar-statements.js')

module.exports = grammar({
	name: 'nunjucks',

	extras: (_) => [],
	externals: ($) => [$.raw_start, $._raw_char, $.raw_end, $._inline_words],

	rules: {
		source: ($) =>
			repeat(
				choice($.statement, $.expression, $.content, $.raw_block, $.comment),
			),

		...literalRules,
		...expressionRules,
		...statementRules,

		expression: ($) =>
			seq(
				choice('{{', '{{-', '{{+'),
				optional(seq($._expression, optional($.ternary_expression))),
				choice('}}', '-}}', '+}}'),
			),

		statement: ($) =>
			seq(choice('{%', '{%-', '{%+'), $._statement, choice('-%}', '%}', '+%}')),

		raw_block: ($) =>
			seq($.raw_start, alias(repeat($._raw_char), $.raw_body), $.raw_end),

		comment: (_) =>
			choice(
				// Is this for inline jinja? Might not be needed.
				seq('##', /[^\r\n]*/, /\r?\n/),
				seq('{#', repeat(choice(/[^#]+/, '#')), '#}'),
			),
	},
})
