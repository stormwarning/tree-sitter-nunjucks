package tree_sitter_nunjucks_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_nunjucks "github.com/stormwarning/tree-sitter-nunjucks/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_nunjucks.Language())
	if language == nil {
		t.Errorf("Error loading Nunjucks grammar")
	}
}
