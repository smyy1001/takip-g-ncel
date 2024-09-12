from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    ForeignKey,
    Date,
    Float,
    Boolean,
    Table,
    ARRAY,
)
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()


class Sys_Type(Base):
    __tablename__ = "sys_type"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))


class Sys_Model(Base):
    __tablename__ = "sys_model"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))


class Sys_Marka(Base):
    __tablename__ = "sys_marka"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))


class Sube(Base):
    __tablename__ = "sube"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))


class Unsur(Base):
    __tablename__ = "unsur"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))


class Bakimsorumlulari(Base):
    __tablename__ = "bakimsorumlulari"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))


class Model(Base):
    __tablename__ = "model"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))


class Marka(Base):
    __tablename__ = "marka"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))


class System(Base):
    __tablename__ = "system"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    type_id = Column(Integer, ForeignKey("sys_type.id"))
    marka_id = Column(Integer, ForeignKey("sys_marka.id"))
    mmodel_id = Column(Integer, ForeignKey("sys_model.id"))
    seri_num = Column(String(255))
    ilskili_unsur = Column(ARRAY(Integer))
    depo = Column(Integer)
    mevzi_id = Column(UUID(as_uuid=True), ForeignKey("mevzi.id"), nullable=True)
    giris_tarihi = Column(Date)
    photos = Column(ARRAY(String(255)))
    description = Column(Text)

    type = relationship("Sys_Type")
    marka = relationship("Sys_Marka")
    model = relationship("Sys_Model")
    mevzi = relationship("Mevzi")

class Malzeme(Base):
    __tablename__ = "malzeme"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    type_id = Column(Integer, ForeignKey("type.id"))
    marka_id = Column(Integer, ForeignKey("marka.id"))
    mmodel_id = Column(Integer, ForeignKey("model.id"))
    seri_num = Column(String(255))
    system_id = Column(UUID(as_uuid=True), ForeignKey("system.id"), nullable=True)
    depo = Column(Integer)
    mevzi_id = Column(UUID(as_uuid=True), ForeignKey("mevzi.id"), nullable=True)
    giris_tarihi = Column(TIMESTAMP)
    arizalar = Column(ARRAY(TIMESTAMP))
    onarimlar = Column(ARRAY(TIMESTAMP))
    bakimlar = Column(ARRAY(TIMESTAMP))

    type = relationship("Type")
    marka = relationship("Marka")
    model = relationship("Model")
    system = relationship("System")
    mevzi = relationship("Mevzi")

class Sistem(Base):
    __tablename__ = "sistem"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    kullanma_amaci = Column(Text)
    kurulum_tarihi = Column(Date)
    frekans_k = Column(Float)
    frekans_b = Column(Float)


class Type(Base):
    __tablename__ = "type"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))


class Mevzi(Base):
    __tablename__ = "mevzi"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    isim = Column(String(255), default='')
    yurt_i = Column(Boolean, nullable=True)
    lokasyon = Column(Text)
    kesif_tarihi = Column(Date)
    kurulum_tarihi = Column(Date)
    ulasim = Column(Text)
    kordinat = Column(String(255))
    rakim = Column(Float)
    bakim_sorumlusu_id = Column(Integer, ForeignKey("bakimsorumlulari.id"))
    sube_id = Column(Integer, ForeignKey("sube.id"))
    d_sistemler = Column(ARRAY(Text))
    y_sistemler = Column(ARRAY(Integer))
    foto_albums = Column(ARRAY(String(255)))  # MinIO bucket names, implied as date storage

    ip_list = Column(JSONB)
    alt_y = Column(JSONB)

    bakim_sorumlusu = relationship("Bakimsorumlulari")
    sube = relationship("Sube")
