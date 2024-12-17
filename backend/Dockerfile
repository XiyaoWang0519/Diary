FROM python:3.12-slim as builder

WORKDIR /app

# Copy poetry files first
COPY pyproject.toml poetry.lock ./

# Install poetry and configure it
RUN pip install poetry && \
    poetry config virtualenvs.in-project true

# Install dependencies
RUN poetry install --no-dev --no-interaction --no-ansi

# Copy the actual package files
COPY diary_backend ./diary_backend

# Install the package itself
RUN poetry install --no-dev --no-interaction --no-ansi

FROM python:3.12-slim

WORKDIR /app
COPY --from=builder /app/.venv ./.venv
COPY --from=builder /app/diary_backend ./diary_backend

ENV PATH="/app/.venv/bin:$PATH"
CMD ["python", "-m", "uvicorn", "diary_backend.app.main:app", "--host", "0.0.0.0", "--port", "8080"]
