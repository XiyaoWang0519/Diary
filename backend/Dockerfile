FROM python:3.12-slim as builder

WORKDIR /app

RUN pip install poetry

COPY pyproject.toml poetry.lock ./
COPY app/ ./app/

RUN poetry config virtualenvs.in-project true && \
    poetry install --no-dev --no-interaction --no-ansi

FROM python:3.12-slim

WORKDIR /app
COPY --from=builder /app/.venv ./.venv
COPY --from=builder /app/app ./app

ENV PATH="/app/.venv/bin:$PATH"
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
