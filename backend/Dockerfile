FROM python:3.12-slim as builder

WORKDIR /app

# Install poetry and configure it
RUN pip install poetry && \
    poetry config virtualenvs.in-project true

# Copy all files at once
COPY . .

# Debug: List contents to verify files are copied
RUN ls -la && ls -la diary_backend

# Install dependencies and package
RUN poetry install --no-dev --no-interaction --no-ansi

FROM python:3.12-slim

WORKDIR /app
COPY --from=builder /app/.venv ./.venv
COPY --from=builder /app/diary_backend ./diary_backend

ENV PATH="/app/.venv/bin:$PATH"
CMD ["python", "-m", "uvicorn", "diary_backend.app.main:app", "--host", "0.0.0.0", "--port", "8080"]
