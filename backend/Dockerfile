FROM python:3.12-slim as builder

WORKDIR /app/diary_backend

RUN pip install poetry

COPY pyproject.toml poetry.lock ./
COPY app ./app

RUN poetry config virtualenvs.in-project true && \
    poetry install --no-dev --no-interaction --no-ansi

FROM python:3.12-slim

WORKDIR /app/diary_backend
COPY --from=builder /app/diary_backend/.venv ./.venv
COPY --from=builder /app/diary_backend/app ./app

ENV PATH="/app/diary_backend/.venv/bin:$PATH"
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
