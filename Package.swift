// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterNunjucks",
    products: [
        .library(name: "TreeSitterNunjucks", targets: ["TreeSitterNunjucks"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterNunjucks",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterNunjucksTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterNunjucks",
            ],
            path: "bindings/swift/TreeSitterNunjucksTests"
        )
    ],
    cLanguageStandard: .c11
)
