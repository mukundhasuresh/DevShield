from fastapi import FastAPI

app = FastAPI(title="DevShield Scanner Engine")

@app.get("/health")
def health_check():
    return {"status": "ok"}
