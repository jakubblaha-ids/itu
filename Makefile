pack:
	zip -r ../01_xblaha36_source.zip README.txt apps packages package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json --exclude '*/.turbo/*' '*/.svelte-kit/*' '*/node_modules/*' '*/.vscode/*' '*/.editorconfig' '*/dist/*'
	