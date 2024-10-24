.PHONY: setup
setup:
	uv venv
	. .venv/bin/activate && uv pip install -e .

.PHONY: setup-dev
setup-dev: setup
	. .venv/bin/activate && uv pip install -e ".[dev]"

.PHONY: run
run:
	fastapi dev

.PHONY: clean
clean:
	rm -rf .venv
	find . -type d -name "__pycache__" -exec rm -rf {} +
	rm -rf *.egg-info