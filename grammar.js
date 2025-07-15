/**
 * @file Nunjucks grammar for tree-sitter
 * @author Jeff Nelson (https://tidaltheory.io)
 * @license ISC
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
	name: "nunjucks",

	rules: {
		// TODO: add the actual grammar rules
		source_file: ($) => "hello",
	},
});
