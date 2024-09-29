from fastapi import Depends, HTTPException, Request
import httpx
import os
from dotenv import load_dotenv
load_dotenv()

KEYCLOAK_INTROSPECT_URL = f"{os.getenv('KEYCLOAK_HOST')}:{os.getenv('KEYCLOAK_PORT')}/realms/{os.getenv('KEYCLOAK_REALM')}/protocol/openid-connect/token/introspect"

async def verify_token(request: Request):
    token = request.headers.get("Authorization")
    if token is None or not token.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token eksik veya yanlış.")
    
    token = token.split(" ")[1]

    data = {
        "token": token,
        "client_id": os.getenv("KEYCLOAK_CLIENT_ID"),
        "client_secret": os.getenv("KEYCLOAK_CLIENT_SECRET")
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(KEYCLOAK_INTROSPECT_URL, data=data)
        
        if response.status_code == 200:
            token_data = response.json()
            if token_data.get("active"):
                client_name = os.getenv("KEYCLOAK_CLIENT_ID")
                roles = token_data.get("resource_access", {}).get(client_name, {}).get("roles", [])

                if "admin" not in roles and request.method != "GET":
                    raise HTTPException(status_code=403, detail="Bu işlemi gerçekleştirmek için yetkiniz yok.")
            else:
                raise HTTPException(status_code=401, detail="Token geçersiz.")
        else:
            raise HTTPException(status_code=500, detail="Keycloak doğrulama hatası.")
