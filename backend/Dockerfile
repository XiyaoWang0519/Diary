FROM python:3.12-slim as builder

WORKDIR /app

RUN pip install poetry && \
    poetry config virtualenvs.in-project true

# Copy all files at once to prevent caching issues
COPY . .

RUN poetry install --no-dev --no-interaction --no-ansi

FROM python:3.12-slim

WORKDIR /app
COPY --from=builder /app/.venv ./.venv
COPY --from=builder /app/diary_backend ./diary_backend

ENV PATH="/app/.venv/bin:$PATH"
CMD ["python", "-m", "uvicorn", "diary_backend.app.main:app", "--host", "0.0.0.0", "--port", "8080"]
