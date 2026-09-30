setup:
	@echo "No dependencies to install."

dev:
	npx vercel dev

static:
	cd frontend && python3 -m http.server 8080
