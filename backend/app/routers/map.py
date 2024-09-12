from fastapi import  APIRouter
import os
from dotenv import load_dotenv
load_dotenv()

router = APIRouter()

@router.get("/map_tile", summary="Get Map Tile")
async def get_map_tile():
    MAP_TILE = ""
    MAP_TILE = str(os.getenv("MAP_TILES_URL"))
    if MAP_TILE:
        return MAP_TILE
    return {"error" : "Harita altlığı adresi environment dosyasında bulunamadı!"}
