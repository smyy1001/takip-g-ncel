from pydantic import BaseModel, UUID4, Field
from typing import List, Optional, Dict
from datetime import date, datetime


class SubeBase(BaseModel):
    name: str


class SubeCreate(SubeBase):
    pass


class Sube(SubeBase):
    id: int


class BakimsorumlulariBase(BaseModel):
    name: str


class BakimsorumlulariCreate(BakimsorumlulariBase):
    pass


class Bakimsorumlulari(BakimsorumlulariBase):
    id: int


class SysTypeBase(BaseModel):
    name: str


class SysTypeCreate(SysTypeBase):
    pass


class SysType(SysTypeBase):
    id: int


class MarkaBase(BaseModel):
    name: str


class MarkaCreate(MarkaBase):
    pass


class Marka(MarkaBase):
    id: int


class SysMarkaBase(BaseModel):
    name: str


class SysMarkaCreate(SysMarkaBase):
    pass


class SysMarka(SysMarkaBase):
    id: int


class UnsurBase(BaseModel):
    name: str


class UnsurCreate(UnsurBase):
    pass


class Unsur(UnsurBase):
    id: int


class ModelBase(BaseModel):
    name: str


class ModelCreate(ModelBase):
    pass


class Model(ModelBase):
    id: int


class SysModelBase(BaseModel):
    name: str


class SysModelCreate(SysModelBase):
    pass


class SysModel(SysModelBase):
    id: int


class SystemBase(BaseModel):
    name: str
    type_id: Optional[int] = None
    marka_id: Optional[int] = None
    mmodel_id: Optional[int] = None
    seri_num: Optional[str] = None
    ilskili_unsur: Optional[List[int]] = None
    depo: Optional[int] = None
    mevzi_id: Optional[UUID4] = None
    giris_tarihi: Optional[date] = None
    photos: Optional[List[str]] = None
    description: Optional[str] = None


class SystemCreate(SystemBase):
    pass


class System(SystemBase):
    id: UUID4

    class Config:
        from_attributes = True


class MalzemeBase(BaseModel):
    name: str
    description: Optional[str] = None
    type_id: Optional[int] = None
    marka_id: Optional[int] = None
    mmodel_id: Optional[int] = None
    seri_num: Optional[str] = None
    system_id: Optional[UUID4] = None
    depo: Optional[int] = None
    mevzi_id: Optional[UUID4] = None
    giris_tarihi: Optional[datetime] = None
    arizalar: Optional[List[datetime]] = None
    onarimlar: Optional[List[datetime]] = None
    bakimlar: Optional[List[datetime]] = None


class MalzemeCreate(MalzemeBase):
    pass


class Malzeme(MalzemeBase):
    id: UUID4

    class Config:
        from_attributes = True

class ArizaCreate(BaseModel):
    malzeme_id: UUID4
    ariza_timestamp: datetime


class OnarimCreate(BaseModel):
    malzeme_id: UUID4
    onarim_timestamp: datetime


class BakimCreate(BaseModel):
    malzeme_id: UUID4
    bakim_timestamp: datetime


class SistemBase(BaseModel):
    name: str
    kullanma_amaci: Optional[str] = None
    kurulum_tarihi: Optional[date] = None
    frekans_k: Optional[float] = None
    frekans_b: Optional[float] = None


class SistemCreate(SistemBase):
    pass


class Sistem(SistemBase):
    id: int

    class Config:
        from_attributes = True


class TypeBase(BaseModel):
    name: str


class TypeCreate(TypeBase):
    pass


class Type(TypeBase):
    id: int

    class Config:
        from_attributes = True


class MevziBase(BaseModel):
    name: str
    isim: Optional[str] = None
    yurt_i: Optional[bool] = None
    lokasyon: Optional[str] = None
    kesif_tarihi: Optional[date] = None
    kurulum_tarihi: Optional[date] = None
    ulasim: Optional[str] = None
    kordinat: Optional[str] = None
    rakim: Optional[float] = None
    bakim_sorumlusu_id: Optional[int] = None
    sube_id: Optional[int] = None
    d_sistemler: Optional[List[str]] = None
    y_sistemler: Optional[List[int]] = None
    ip_list: Optional[Dict[str, str]] = Field(
        default=None,
        example={"Main Server": "192.168.1.1", "Backup Server": "192.168.1.2"},
    )
    foto_albums: Optional[List[str]] = (
        None
    )
    alt_y: Optional[Dict[str, str]] = Field(
        default=None,
        example={"klima": "Var", "kgk": "Var"},
    )

    class Config:
        json_schema_extra = {
            "example": {
                "ip_list": {"Main Server": "192.168.1.1", "Backup Server": "192.168.1.2"}
            }
        }

class MevziCreate(MevziBase):
    pass


class Mevzi(MevziBase):
    id: UUID4

    class Config:
        from_attributes = True
