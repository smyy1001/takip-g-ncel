from fastapi import APIRouter
from app.routers import system, sistem, malzeme, mevzi, type, map, systype, marka, model, unsur, sys_model, sys_marka, bakimsorumlulari, sube, alt_y

api_router = APIRouter()
api_router.include_router(system.router, prefix="/system", tags=["system"])
api_router.include_router(sistem.router, prefix="/sistem", tags=["sistem"])
api_router.include_router(malzeme.router, prefix="/malzeme", tags=["malzeme"])
api_router.include_router(mevzi.router, prefix="/mevzi", tags=["mevzi"])
api_router.include_router(type.router, prefix="/type", tags=["type"])
api_router.include_router(map.router, prefix='/map', tags=["map"])
api_router.include_router(systype.router, prefix='/systype', tags=["systype"])
api_router.include_router(model.router, prefix='/model', tags=["model"])
api_router.include_router(marka.router, prefix='/marka', tags=["marka"])
api_router.include_router(unsur.router, prefix='/unsur', tags=["unsur"])
api_router.include_router(sys_model.router, prefix='/sys_model', tags=["sys_model"])
api_router.include_router(sys_marka.router, prefix='/sys_marka', tags=["sys_marka"])
api_router.include_router(bakimsorumlulari.router, prefix='/bakimsorumlulari', tags=["bakimsorumlulari"])
api_router.include_router(sube.router, prefix='/sube', tags=["sube"])
api_router.include_router(alt_y.router, prefix='/alt_y', tags=["alt_y"])
