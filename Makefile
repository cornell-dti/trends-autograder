default:
	bun run index.ts
	
clean:
	rm -rf Submissions/
	rm -rf tmp/
	rm cms.csv

test:
	bun test modules --watch --coverage