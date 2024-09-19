from pydantic import BaseModel, UUID4, Field
from typing import List, Optional, Dict
from datetime import date, datetime
from fastapi import UploadFile


class EnerjiBase(BaseModel):
    voltaj: Optional[float] = None
    jenerator: Optional[str] = None
    guc_k: Optional[str] = None
    regulator: Optional[str] = None


class EnerjiCreate(EnerjiBase):
    pass


class Enerji(EnerjiBase):
    id: int


class HaberBase(BaseModel):
    t: Optional[str] = None
    r_l: Optional[str] = None
    uydu: Optional[str] = None
    telekom: Optional[str] = None
    g_modem: Optional[str] = None

class HaberCreate(HaberBase):
    pass


class Haber(HaberBase):
    id: int


class IklimBase(BaseModel):
    klima: Optional[str] = None


class IklimCreate(IklimBase):
    pass


class Iklim(IklimBase):
    id: int


class KabinBase(BaseModel):
    rack_kabin: Optional[str] = None


class KabinCreate(KabinBase):
    pass


class Kabin(KabinBase):
    id: int


class KAlanBase(BaseModel):
    konteyner: Optional[str] = None


class KAlanCreate(KAlanBase):
    pass


class KAlan(KAlanBase):
    id: int


class AltYBase(BaseModel):
    enerji_alty: Optional[int] = None
    iklim_alty: Optional[int] = None
    haberlesme_alty: Optional[int] = None
    kabin_alty: Optional[int] = None
    kapali_alan_alty: Optional[int] = None


class AltYCreate(AltYBase):
    pass


class AltY(AltYBase):
    id: int


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

    images: Optional[List[UploadFile]] = None

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
    giris_tarihi: Optional[date] = None
    arizalar: Optional[List[date]] = None
    onarimlar: Optional[List[date]] = None
    bakimlar: Optional[List[date]] = None
    photos: Optional[List[str]] = None


class MalzemeCreate(MalzemeBase):
    images: Optional[List[UploadFile]] = None


class Malzeme(MalzemeBase):
    id: UUID4

    class Config:
        from_attributes = True

class ArizaCreate(BaseModel):
    malzeme_id: UUID4
    ariza_timestamp: date


class OnarimCreate(BaseModel):
    malzeme_id: UUID4
    onarim_timestamp: date


class BakimCreate(BaseModel):
    malzeme_id: UUID4
    bakim_timestamp: date


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
    alt_y_id: Optional[int] = None
    y_sistemler: Optional[List[int]] = None
    photos: Optional[List[str]] = None

class MevziCreate(MevziBase):
    images: Optional[List[UploadFile]] = None


class Mevzi(MevziBase):
    id: UUID4

    class Config:
        from_attributes = True


class MalzMathchBase(BaseModel):
    malzeme_name: Optional[str] = None
    mevzi_id: Optional[UUID4] = None
    ip: Optional[str] = None


class MalzMatchCreate(MalzMathchBase):
    pass


class MalzMatch(MalzMathchBase):
    id: int
