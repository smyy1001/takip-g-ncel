from fastapi import FastAPI, HTTPException, Depends, Request, APIRouter, Form
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from urllib.parse import urlencode
import time
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict
import httpx

load_dotenv()

token_router = APIRouter()

KEYCLOAK_HOST = os.getenv("KEYCLOAK_HOST")
KEYCLOAK_PORT = os.getenv("KEYCLOAK_PORT")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM")
CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID")
CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET")
REDIRECT_URI_BASE = os.getenv("REDIRECT_URI")

TOKEN_ENDPOINT = f"{KEYCLOAK_HOST}:{KEYCLOAK_PORT}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/token"


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    id_token: str

@token_router.post("/token")
async def get_token(code: str = Form(...), currentPath: str = Form(...)):
    try:
        redirect_uri = REDIRECT_URI_BASE + currentPath
        data = {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri
        }

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                TOKEN_ENDPOINT, 
                data=data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )

            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=400, detail="Token alınamadı")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Token alınamadı: {str(e)}"})


@token_router.post("/token/refresh")
async def refresh_token(refresh_token: str = Form(...)):
    try:
        data = {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "refresh_token",
            "refresh_token": refresh_token
        }

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                TOKEN_ENDPOINT, 
                data=data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )

            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=400, detail="Refresh token alınamadı")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Refresh token alınamadı: {str(e)}"})