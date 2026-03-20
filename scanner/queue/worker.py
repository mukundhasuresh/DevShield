import os
import asyncio
import logging
from bullmq import Worker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("worker")

# Setup Redis connection pointing to the redis container created in docker-compose
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

async def process_job(job, job_token):
    logger.info(f"Processing job {job.name} (id={job.id})")
    
    # We expect 'analyze-pr' as the main job
    if job.name == 'analyze-pr':
        data = job.data
        logger.info(f"PR Data received: {data.get('repoName')} #{data.get('prNumber')}")
        
        # Phase 1: Haiku Triage relevant files
        # Phase 2: Sonnet deep scan each flagged file
        # Phase 3: Run static scanners (secret, dependabot)
        # Phase 4: Compute score and post GitHub PR Comment
        # Phase 5: Hash results and write to Polygon
        # Phase 6: Sync state to Supabase

        return {"status": "success", "message": "Stub complete for analyze-pr"}
    else:
        logger.warning(f"Unknown job type: {job.name}")
        return {"status": "ignored"}

async def main():
    logger.info(f"Starting DevShield Worker connecting to {REDIS_URL}")
    
    # Ensure queue name matches `scanQueue` from Next.js (`scan-jobs`)
    worker = Worker('scan-jobs', process_job, {"connection": REDIS_URL})
    
    try:
        # Prevent the main loop from exiting immediately
        await asyncio.Event().wait()
    finally:
        await worker.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Worker gracefully shutting down.")
