((content) @injection.content
	(#set! injection.language "html")
	(#set! injection.combined))

((front_matter) @injection.content
	(#match? @injection.content "\\A---(javascript|js)\\b")
	(#set! injection.language "javascript"))

((front_matter) @injection.content
	(#set! injection.language "yaml"))
