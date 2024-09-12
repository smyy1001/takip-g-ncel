CREATE DATABASE takip_db
  WITH ENCODING 'UTF8'
  LC_COLLATE='tr_TR.UTF-8'
  LC_CTYPE='tr_TR.UTF-8'
  TEMPLATE=template0;

GRANT ALL PRIVILEGES ON DATABASE takip_db TO admin;

\c takip_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'bakimsorumlulari'
    ) THEN
        CREATE TABLE bakimsorumlulari (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );

        INSERT INTO bakimsorumlulari (name) VALUES ('AHMET');
        INSERT INTO bakimsorumlulari (name) VALUES ('MEHMET');
        INSERT INTO bakimsorumlulari (name) VALUES ('NECİP');
    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'sube'
    ) THEN
        CREATE TABLE sube (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );

        INSERT INTO sube (name) VALUES ('BİLKENT');
        INSERT INTO sube (name) VALUES ('ODTÜ');
        INSERT INTO sube (name) VALUES ('ATATÜRK');
    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'model'
    ) THEN
        CREATE TABLE model (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );

        INSERT INTO model (name) VALUES ('m1');
        INSERT INTO model (name) VALUES ('m2');
        INSERT INTO model (name) VALUES ('m3');
    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'marka'
    ) THEN
        CREATE TABLE marka (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );

        INSERT INTO marka (name) VALUES ('M1');
        INSERT INTO marka (name) VALUES ('M2');
        INSERT INTO marka (name) VALUES ('M3');

    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'sys_model'
    ) THEN
        CREATE TABLE sys_model (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );

        INSERT INTO sys_model (name) VALUES ('m1');
        INSERT INTO sys_model (name) VALUES ('m2');
        INSERT INTO sys_model (name) VALUES ('m3');
    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'sys_marka'
    ) THEN
        CREATE TABLE sys_marka (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );

        INSERT INTO sys_marka (name) VALUES ('M1');
        INSERT INTO sys_marka (name) VALUES ('M2');
        INSERT INTO sys_marka (name) VALUES ('M3');

    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'unsur'
    ) THEN
        CREATE TABLE unsur (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );

        INSERT INTO unsur (name) VALUES ('U1');
        INSERT INTO unsur (name) VALUES ('U2');
        INSERT INTO unsur (name) VALUES ('U3');

    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'sys_type'
    ) THEN
        CREATE TABLE sys_type (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );

        INSERT INTO sys_type (name) VALUES ('tt1');
        INSERT INTO sys_type (name) VALUES ('tt2');
        INSERT INTO sys_type (name) VALUES ('tt3');

    END IF;

    
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'sistem'
    ) THEN
        CREATE TABLE sistem (
            id SERIAL PRIMARY KEY,   
            name VARCHAR(255) UNIQUE NOT NULL,
            kullanma_amaci TEXT,
            kurulum_tarihi DATE,
            frekans_k FLOAT,
            frekans_b FLOAT
        );

        INSERT INTO sistem (name, kullanma_amaci) VALUES ('s1', 'arama kyrtarma çalışması');
        INSERT INTO sistem (name, frekans_k, frekans_b) VALUES ('s2', 100, 200);
        INSERT INTO sistem (name, kurulum_tarihi) VALUES ('s3', '2021-01-01');

    END IF;



    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'type'
    ) THEN
        CREATE TABLE type (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
            -- eklenebilir
        );

        INSERT INTO type (name) VALUES ('t1');
        INSERT INTO type (name) VALUES ('t2');
        INSERT INTO type (name) VALUES ('t3');

    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'mevzi'
    ) THEN
        CREATE TABLE mevzi (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) UNIQUE NOT NULL,
            isim VARCHAR(255),
            kesif_tarihi DATE,
            kordinat VARCHAR(255),
            rakim FLOAT, ---metre
            yurt_i BOOLEAN DEFAULT NULL,
            lokasyon TEXT,
            ulasim TEXT,  ---karayolu, helikopter, destekli ulaşım
            bakim_sorumlusu_id INTEGER REFERENCES bakimsorumlulari(id),  
            sube_id INTEGER REFERENCES sube(id),
            kurulum_tarihi DATE,   -- ilk sistem kurulum tarihi
            d_sistemler TEXT[],  ---- DIŞ KURUM SISTEMLERI
            y_sistemler INTEGER[],
            foto_albums TEXT[], ----- fotoğraflar (tarih tarih arşivlenecek)
            
            ---additionla 
            ip_list JSONB,    --- malzeme id: ip, malzeme id: ip,..
            alt_y JSONB
            
        );

        INSERT INTO mevzi (name) VALUES ('m1');
        INSERT INTO mevzi (name) VALUES ('m2');
        INSERT INTO mevzi (name) VALUES ('m3');
        
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'system'  ---- büyük, ana sistemler
    ) THEN
        CREATE TABLE system (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            type_id INTEGER REFERENCES sys_type(id),
            marka_id INTEGER REFERENCES sys_marka(id),
            mmodel_id INTEGER REFERENCES sys_model(id),
            seri_num TEXT,
            ilskili_unsur INTEGER[],
            photos TEXT[],
            depo INTEGER, -- 0: birim depo / 1: yedek depo / 2: mevzi
            mevzi_id UUID REFERENCES mevzi(id) DEFAULT NULL,
            giris_tarihi DATE,
            description TEXT
        );
    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'malzeme'
    ) THEN
        CREATE TABLE malzeme (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            seri_num VARCHAR(255),
            type_id INTEGER REFERENCES type(id),
            marka_id INTEGER REFERENCES marka(id),
            mmodel_id INTEGER REFERENCES model(id),
            system_id UUID REFERENCES system(id) DEFAULT NULL,
            depo INTEGER, -- 0: birim depo / 1: yedek depo / 2: mevzi
            mevzi_id UUID REFERENCES mevzi(id) DEFAULT NULL,
            giris_tarihi TIMESTAMP,
            arizalar TIMESTAMP[],
            onarimlar TIMESTAMP[],
            bakimlar TIMESTAMP[]
        );
    END IF;


END $$;
