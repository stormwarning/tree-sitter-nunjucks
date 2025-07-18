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

module.exports = {
	separated,
	separated1,
}
