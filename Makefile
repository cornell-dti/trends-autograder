default:
	bun run index.ts

setup:
	curl -fsSL https://bun.sh/install | bash
	bun add --global pnpm
	bun install
	
clean:
	rm -rf tmp/
	rm cms.csv

test:
	bun test modules --watch