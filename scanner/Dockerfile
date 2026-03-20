FROM python:3.11-slim

WORKDIR /app

# Ensure curl and necessary C-bindings libraries for any dependencies are available
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Exposed for FastAPI if serving an API
EXPOSE 8000

# By default, we run uvicorn. 
# In docker-compose, the worker will override this command with: python -m queue.worker
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
