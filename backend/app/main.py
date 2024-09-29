import uvicorn
from fastapi import FastAPI, HTTPException
from .db.database import init_db
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.routers.router import api_router
from app.utils import check_postgres_connection, check_ip
from app.db.database import SessionLocal
from app.db.models import MalzMatch
import asyncio
from sqlalchemy.orm import Session
from fastapi import Depends
from .token_verification import verify_token  
from .keycloak import token_router 


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router, prefix="/api", dependencies=[Depends(verify_token)])

app.include_router(token_router, prefix="/api/keycloak")

# async def update_ip_statuses():
#     while True:
#         try:
#             db: Session = SessionLocal()

#             matches = db.query(MalzMatch).all()

#             for match in matches:
#                 ip_address = match.ip
#                 is_up = check_ip(ip_address)

#                 match.state = 2 if is_up else 0

#             db.commit()
#             db.close()

#         except Exception as e:
#             print(f"Error updating IP statuses: {e}")

#         await asyncio.sleep(60)


@app.on_event("startup")
def on_startup():
    init_db()
    # asyncio.create_task(update_ip_statuses())


@app.get("/health")
def health_check():
    db_status = check_postgres_connection()

    if db_status is True:
        return {"status_code": 200 , "detail": "ok"}
    else:
        raise HTTPException(
            status_code=500, detail=f"Database connection failed: {db_status}"
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
