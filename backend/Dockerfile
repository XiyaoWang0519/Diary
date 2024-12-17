FROM python:3.12-slim

WORKDIR /app

# Install poetry and configure it
RUN pip install poetry && \
    poetry config virtualenvs.in-project true

# Copy all files
COPY . .

# Debug: show directory contents
RUN echo "=== Root directory ===" && \
    ls -la && \
    echo "=== diary_backend directory ===" && \
    ls -la diary_backend && \
    echo "=== diary_backend/app directory ===" && \
    ls -la diary_backend/app

# Install dependencies and package
RUN poetry install --no-dev --no-interaction --no-ansi

ENV PATH="/app/.venv/bin:$PATH"
CMD ["python", "-m", "uvicorn", "diary_backend.app.main:app", "--host", "0.0.0.0", "--port", "8080"]
