from fastapi import FastAPI

app = FastAPI()

@app.post('/generate')
def generate_code():
    return {'status': 'MCP endpoint ready'}