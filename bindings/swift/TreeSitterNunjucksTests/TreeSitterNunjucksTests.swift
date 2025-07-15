import XCTest
import SwiftTreeSitter
import TreeSitterNunjucks

final class TreeSitterNunjucksTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_nunjucks())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Nunjucks grammar")
    }
}
