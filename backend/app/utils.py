from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from geoalchemy2 import WKTElement
# import geopandas as gpd
from shapely.geometry import Point
import subprocess
from ping3 import ping
import psycopg2
from psycopg2 import OperationalError
import os
from dotenv import load_dotenv
import httpx
import mgrs
import subprocess


load_dotenv()
SECRET_KEY = os.getenv("SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
# gdf = gpd.read_file("/app/turkey_administrative_data/tur_polbnda_adm1.shp")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_point(x, y):
    return f"POINT({x} {y})"

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(subject: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(subject: str):
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# # Function to find city
# def find_city(longitude, latitude, gdf=gdf):
#     point = Point(longitude, latitude)

#     for index, row in gdf.iterrows():
#         if row["geometry"].contains(point):
#             return row["adm1_tr"]

#     return "not found"


# # get city from car plates
# def get_city(city, plate, mode):
# plates = ["ADANA", "ADIYAMAN", "AFYONKARAHİSAR", "AĞRI", "AMASYA", "ANKARA",
#         "ANTALYA", "ARTVİN", "AYDIN", "BALIKESİR", "BİLECİK", "BİNGÖL", "BİTLİS",
#         "BOLU", "BURDUR", "BURSA", "ÇANAKKALE", "ÇANKIRI", "ÇORUM", "DENİZLİ", "DİYARBAKIR",
#         "EDİRNE", "ELAZIĞ", "ERZİNCAN", "ERZURUM", "ESKİŞEHIR", "GAZİANTEP", "GİRESUN", "GÜMÜŞHANE",
#         "HAKKARİ", "HATAY", "ISPARTA", "MERSİN", "İSTANBUL", "İZMİR", "KARS", "KASTAMONU",
#         "KAYSERİ", "KIRKLARELİ", "KIRŞEHİR", "KOCAELİ", "KONYA", "KÜTAHYA", "MALATYA", "MANİSA",
#         "KAHRAMANMARAŞ", "MARDİN", "MUĞLA", "MUŞ", "NEVŞEHİR", "NİĞDE", "ORDU", "RİZE", "SAKARYA",
#         "SAMSUN", "SİİRT", "SİNOP", "SİVAS", "TEKİRDAĞ", "TOKAT", "TRABZON", "TUNCELİ", "ŞANLIURFA",
#         "UŞAK", "VAN", "YOZGAT", "ZONGULDAK", "AKSARAY", "BAYBURT", "KARAMAN", "KIRIKKALE", "BATMAN",
#         "ŞIRNAK", "BARTIN", "ARDAHAN", "IĞDIR", "YALOVA", "KARABÜK", "KİLİS", "OSMANİYE", "DÜZCE"]

#     if mode:
#         if city != "not found":
#             return 1+ plates.index(city)
#         else: return 0
#     else:
#         if plate != 0:
#             return plates[plate-1]
#         else:
#             return "Tanımsız Alan"


# def find_city_indices(substring):
#     plates = ["ADANA", "ADIYAMAN", "AFYONKARAHİSAR", "AĞRI", "AMASYA", "ANKARA",
#             "ANTALYA", "ARTVİN", "AYDIN", "BALIKESİR", "BİLECİK", "BİNGÖL", "BİTLİS",
#             "BOLU", "BURDUR", "BURSA", "ÇANAKKALE", "ÇANKIRI", "ÇORUM", "DENİZLİ", "DİYARBAKIR",
#             "EDİRNE", "ELAZIĞ", "ERZİNCAN", "ERZURUM", "ESKİŞEHIR", "GAZİANTEP", "GİRESUN", "GÜMÜŞHANE",
#             "HAKKARİ", "HATAY", "ISPARTA", "MERSİN", "İSTANBUL", "İZMİR", "KARS", "KASTAMONU",
#             "KAYSERİ", "KIRKLARELİ", "KIRŞEHİR", "KOCAELİ", "KONYA", "KÜTAHYA", "MALATYA", "MANİSA",
#             "KAHRAMANMARAŞ", "MARDİN", "MUĞLA", "MUŞ", "NEVŞEHİR", "NİĞDE", "ORDU", "RİZE", "SAKARYA",
#             "SAMSUN", "SİİRT", "SİNOP", "SİVAS", "TEKİRDAĞ", "TOKAT", "TRABZON", "TUNCELİ", "ŞANLIURFA",
#             "UŞAK", "VAN", "YOZGAT", "ZONGULDAK", "AKSARAY", "BAYBURT", "KARAMAN", "KIRIKKALE", "BATMAN",
#             "ŞIRNAK", "BARTIN", "ARDAHAN", "IĞDIR", "YALOVA", "KARABÜK", "KİLİS", "OSMANİYE", "DÜZCE"]
#     substring_upper = substring.upper()
#     indices = [index + 1 for index, city in enumerate(plates) if substring_upper in city]

# return indices

def ping_check(host):
    param = "-n" if subprocess.os.name == "nt" else "-c"
    command = ["ping", param, "1", host]

    try:
        output = subprocess.check_output(command, timeout=2)
        return "Up"
    except subprocess.TimeoutExpired:
        return "Down"
    except subprocess.CalledProcessError:
        return "Down"


def check_postgres_connection():
    try:
        connection = psycopg2.connect(
            dbname=os.getenv('POSTGRES_DATABASE'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_HOST'),
            port=os.getenv('DOCKER_POSTGRES_PORT'),
        )
        connection.close()
        return True
    except OperationalError as e:
        return str(e)



def convert_mgrs_to_lat_long(mgrs_string):
    m = mgrs.MGRS()
    lat_long = m.toLatLon(mgrs_string)
    return lat_long


# # Example usage:
# mgrs_coordinate = "33TWN0008000800"
# latitude, longitude = convert_mgrs_to_lat_long(mgrs_coordinate)
# print(f"Latitude: {latitude}, Longitude: {longitude}")


def check_ip(ip_address):
    try:
        # For Windows, the command would be ['ping', '-n', '1', '-w', '200', ip_address]
        # For Unix/Linux, the command is as below
        result = subprocess.run(
            ["ping", "-c", "1", "-W", "0.3", ip_address],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        return result.returncode == 0
    except Exception as e:
        print(f"Error pinging {ip_address}: {e}")
        return False
