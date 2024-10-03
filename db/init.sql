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
        INSERT INTO bakimsorumlulari (name) VALUES ('MUSTAFA');
        INSERT INTO bakimsorumlulari (name) VALUES ('HÜSEYİN');
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
        INSERT INTO sube (name) VALUES ('HACETTEPE');
        INSERT INTO sube (name) VALUES ('GÜVENLİK');
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
        INSERT INTO model (name) VALUES ('m4');
        INSERT INTO model (name) VALUES ('m5');
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
        INSERT INTO marka (name) VALUES ('M4');
        INSERT INTO marka (name) VALUES ('M5');

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
        INSERT INTO sys_model (name) VALUES ('m4');
        INSERT INTO sys_model (name) VALUES ('m5');
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
        INSERT INTO sys_marka (name) VALUES ('M4');
        INSERT INTO sys_marka (name) VALUES ('M5');

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
        INSERT INTO unsur (name) VALUES ('U4');
        INSERT INTO unsur (name) VALUES ('U5');

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
        INSERT INTO sys_type (name) VALUES ('tt4');
        INSERT INTO sys_type (name) VALUES ('tt5');

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

        INSERT INTO sistem (name, kullanma_amaci, kurulum_tarihi, frekans_k, frekans_b) VALUES ('yazılım sistemi 1', 'arama kyrtarma çalışması',  '2024-09-01', 200, 500);
        INSERT INTO sistem (name, kullanma_amaci, kurulum_tarihi, frekans_k, frekans_b) VALUES ('yazılım sistemi 2', 'Bilinmiyor', '2024-09-01', 100, 200);
        INSERT INTO sistem (name, kullanma_amaci, kurulum_tarihi, frekans_k, frekans_b) VALUES ('yazılım sistemi 3', 'Destek', '2021-01-01', 3784, 4234303);
        INSERT INTO sistem (name, kullanma_amaci, kurulum_tarihi, frekans_k, frekans_b) VALUES ('yazılım sistemi 4', 'Bilinmiyor', '2024-09-01', 100, 200);
        INSERT INTO sistem (name, kullanma_amaci, kurulum_tarihi, frekans_k, frekans_b) VALUES ('yazılım sistemi 5', 'Bilinmiyor', '2024-09-01', 100, 200);

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

        INSERT INTO type (name) VALUES ('Kategori 1');
        INSERT INTO type (name) VALUES ('Kategori 2');
        INSERT INTO type (name) VALUES ('Kategori 3');
        INSERT INTO type (name) VALUES ('Kategori 4');
        INSERT INTO type (name) VALUES ('Kategori 5');

    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'table_klima'
    ) THEN
        CREATE TABLE table_klima (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE,
            seri_num TEXT
        );
        INSERT INTO table_klima (name, seri_num) VALUES ('Klima 1', 'Klima Açıklama 1');
        INSERT INTO table_klima (name, seri_num) VALUES ('Klima 2', 'Klima Açıklama 2');
        INSERT INTO table_klima (name, seri_num) VALUES ('Klima 3', 'Klima Açıklama 3');
    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'iklim'
    ) THEN
        CREATE TABLE iklim (
            id SERIAL PRIMARY KEY,
            klima INTEGER[]
        );
        INSERT INTO iklim (klima) VALUES (ARRAY[1, 3]);
        INSERT INTO iklim (klima) VALUES (ARRAY[2, 3]);
        INSERT INTO iklim (klima) VALUES (ARRAY[2]);
    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'kabin'
    ) THEN
        CREATE TABLE kabin (
            id SERIAL PRIMARY KEY,
            rack_kabin TEXT
        );
        INSERT INTO kabin (rack_kabin) VALUES ('Rack Kabin 1');
        INSERT INTO kabin (rack_kabin) VALUES ('Rack Kabin 2');
        INSERT INTO kabin (rack_kabin) VALUES ('Rack Kabin 3');
    END IF;

    
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'k_alan'
    ) THEN
        CREATE TABLE k_alan (
            id SERIAL PRIMARY KEY,
            konteyner TEXT
        );
        INSERT INTO k_alan (konteyner) VALUES ('Konteyner 1');
        INSERT INTO k_alan (konteyner) VALUES ('Konteyner 2');
        INSERT INTO k_alan (konteyner) VALUES ('Konteyner 3');
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'table_jenerator'
    ) THEN
        CREATE TABLE table_jenerator (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE,
            seri_num TEXT
        );
        INSERT INTO table_jenerator (name, seri_num) VALUES ('Jeneratör 1', 'Jeneratör Açıklama 1');
        INSERT INTO table_jenerator (name, seri_num) VALUES ('Jeneratör 2', 'Jeneratör Açıklama 2');
        INSERT INTO table_jenerator (name, seri_num) VALUES ('Jeneratör 3', 'Jeneratör Açıklama 3');
    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'table_guck'
    ) THEN
        CREATE TABLE table_guck (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE,
            seri_num TEXT
        );
        INSERT INTO table_guck (name, seri_num) VALUES ('Güç Kaynağı 1', 'Güç Kaynağı Açıklama 1');
        INSERT INTO table_guck (name, seri_num) VALUES ('Güç Kaynağı 2', 'Güç Kaynağı Açıklama 2');
        INSERT INTO table_guck (name, seri_num) VALUES ('Güç Kaynağı 3', 'Güç Kaynağı Açıklama 3');
    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'table_regulator'
    ) THEN
        CREATE TABLE table_regulator (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE,
            seri_num TEXT
        );
        INSERT INTO table_regulator (name, seri_num) VALUES ('Regülatör 1', 'Regülatör Açıklama 1');
        INSERT INTO table_regulator (name, seri_num) VALUES ('Regülatör 2', 'Regülatör Açıklama 2');
        INSERT INTO table_regulator (name, seri_num) VALUES ('Regülatör 3', 'Regülatör Açıklama 3');
    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'enerji'
    ) THEN
        CREATE TABLE enerji (
            id SERIAL PRIMARY KEY,
            voltaj FLOAT,
            jenerator INTEGER[],
            guc_k INTEGER[],
            regulator INTEGER[]
        );
        INSERT INTO enerji (voltaj, jenerator, guc_k, regulator)
        VALUES (39, ARRAY[1,2], ARRAY[2,3], ARRAY[2]);
        INSERT INTO enerji (voltaj, jenerator, guc_k, regulator)
        VALUES (134, ARRAY[2], ARRAY[1], ARRAY[1,3]);
        INSERT INTO enerji (voltaj, jenerator, guc_k, regulator)
        VALUES (7, ARRAY[1,3], ARRAY[1,2], ARRAY[1]);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'haber'
    ) THEN
        CREATE TABLE haber (
            id SERIAL PRIMARY KEY,
            t TEXT,
            r_l TEXT,
            uydu TEXT,
            telekom TEXT,
            g_modem TEXT
        );
        INSERT INTO haber (t, r_l, uydu, telekom, g_modem)
        VALUES ('T1', 'Radyo Link 1', 'Uydu 1', 'Telekom 1', '3G/4G 1');
        INSERT INTO haber (t, r_l, uydu, telekom, g_modem)
        VALUES ('T2', 'Radyo Link 2', 'Uydu 2', 'Telekom 2', '3G/4G 2');
        INSERT INTO haber (t, r_l, uydu, telekom, g_modem)
        VALUES ('T3', 'Radyo Link 3', 'Uydu 3', 'Telekom 3', '3G/4G 3');
    END IF;



    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'alt_y'
    ) THEN
        CREATE TABLE alt_y (
            id SERIAL PRIMARY KEY,
            enerji_alty INTEGER REFERENCES enerji(id),
            iklim_alty INTEGER REFERENCES iklim(id),
            haberlesme_alty INTEGER REFERENCES haber(id),
            kabin_alty INTEGER REFERENCES kabin(id),
            kapali_alan_alty INTEGER REFERENCES k_alan(id)
        );

        INSERT INTO alt_y (enerji_alty, iklim_alty, haberlesme_alty, kabin_alty, kapali_alan_alty)
        VALUES (1, 2, 3, 1, 2);
        INSERT INTO alt_y (enerji_alty, iklim_alty, haberlesme_alty, kabin_alty, kapali_alan_alty)
        VALUES (2, 3, 1, 2, 3);
        INSERT INTO alt_y (enerji_alty, iklim_alty, haberlesme_alty, kabin_alty, kapali_alan_alty)
        VALUES (3, 1, 2, 3, 1);
        INSERT INTO alt_y (enerji_alty, iklim_alty, haberlesme_alty, kabin_alty, kapali_alan_alty)
        VALUES (1, 2, 3, 1, 2);
        INSERT INTO alt_y (enerji_alty, iklim_alty, haberlesme_alty, kabin_alty, kapali_alan_alty)
        VALUES (2, 3, 1, 2, 3);

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
            photos TEXT[],
            alt_y_id INTEGER REFERENCES alt_y(id),
            ip TEXT,
            state INTEGER DEFAULT 1,
            frequency FLOAT DEFAULT 5      
        );

        INSERT INTO mevzi (
            id, name, isim, kesif_tarihi, kordinat, rakim, yurt_i, lokasyon, ulasim, 
            bakim_sorumlusu_id, sube_id, kurulum_tarihi, d_sistemler, y_sistemler, 
            alt_y_id, ip, state, frequency
        ) VALUES (
            'd5a9f8d0-3e6c-4e8d-9f97-6d67a9c8d1be', 'Mevzi-001', 'İlk Mevzi', '2023-01-15', '38SMB4484', 1200.5, TRUE, 
            'ANKARA', 'Karayolu', 1, 2, '2023-03-01', 
            ARRAY['Sistem A', 'Sistem B'], ARRAY[1, 2], 1, '192.168.1.22', 0, 1.0);

        INSERT INTO mevzi (
            id, name, isim, kesif_tarihi, kordinat, rakim, yurt_i, lokasyon, ulasim, 
            bakim_sorumlusu_id, sube_id, kurulum_tarihi, d_sistemler, y_sistemler, 
            alt_y_id, ip, state, frequency
        ) VALUES (
            '9c1b3eaf-02ff-4b45-a458-c5f4a6f3b3ad','Mevzi-002', 'İkinci Mevzi', '2023-02-20', '39SMC9951', 850.0, FALSE, 
            'ALMANYA', 'Helikopter', 2, 3, '2023-04-10', 
            ARRAY['Sistem X', 'Sistem Y'], ARRAY[2, 3], 2, '192.168.1.30', 0, 1.0);

        INSERT INTO mevzi (
            id, name, isim, kesif_tarihi, kordinat, rakim, yurt_i, lokasyon, ulasim, 
            bakim_sorumlusu_id, sube_id, kurulum_tarihi, d_sistemler, y_sistemler, 
            alt_y_id, ip, state, frequency
        ) VALUES (
            'a16f634c-48ff-4f6b-90d4-7cbf8f9856e4', 'Mevzi-003', 'Üçüncü Mevzi', '2023-03-05', '40SMD5046', 500.0, TRUE, 
            'İZMİR', 'Destekli Ulaşım', 3, 1, '2023-06-15', 
            ARRAY['Sistem Q'], ARRAY[3], 3, '192.168.1.44', 0, 1.0);

        INSERT INTO mevzi (
           id, name, isim, kesif_tarihi, kordinat, rakim, yurt_i, lokasyon, ulasim, 
            bakim_sorumlusu_id, sube_id, kurulum_tarihi, d_sistemler, y_sistemler, 
            alt_y_id, ip, state, frequency
        ) VALUES (
            '4bfe4971-b15f-4aa9-96e3-78737b262b7b','Mevzi-004', 'Dördüncü Mevzi', '2023-04-25', '41SME8921', 1500.3, TRUE, 
            'BURSA', 'Karayolu', 4, 3, '2023-07-20', 
            ARRAY['Sistem Z'], ARRAY[4, 1], 4, '192.168.1.42', 0, 1.0);


        INSERT INTO mevzi (
            id, name, isim, kesif_tarihi, kordinat, rakim, yurt_i, lokasyon, ulasim, 
            bakim_sorumlusu_id, sube_id, kurulum_tarihi, d_sistemler, y_sistemler, 
            alt_y_id, ip, state, frequency
        ) VALUES (
            'd2719f0e-6a5e-43cf-b36a-67d2f6f6176c','Mevzi-005', 'Beşinci Mevzi', '2023-05-10', '42SMF1234', 975.0, FALSE, 
            'BELÇİKA', 'Karayolu', 5, 1, '2023-09-01', 
            ARRAY['Sistem V', 'Sistem W'], ARRAY[5], 5, '192.168.1.44', 0, 1.0);


        
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
            depo INTEGER, -- 0: birim depo / 1: yedek depo / 2: mevzi
            mevzi_id UUID REFERENCES mevzi(id) DEFAULT NULL,
            giris_tarihi DATE,
            photos TEXT[],
            description TEXT,
            ip TEXT,
            state INTEGER DEFAULT 1,
            frequency FLOAT DEFAULT 5           
        );

        INSERT INTO system (
            id, name, type_id, marka_id, mmodel_id, seri_num, ilskili_unsur,
            depo, mevzi_id, giris_tarihi, description, ip, state, frequency
        ) VALUES (
            'a0a5d8ec-b0d6-42e8-8e17-4b62b5a8f973', 'System-001', 1, 1, 1, 'SN-001-A', 
            ARRAY[1],
            0, null, '2023-06-01', 'Birinci sistem açıklaması', '192.168.1.44', 0, 1.0
        );

        INSERT INTO system (
            id, name, type_id, marka_id, mmodel_id, seri_num, ilskili_unsur,
            depo, mevzi_id, giris_tarihi, description, ip, state, frequency
        ) VALUES (
            'f5d13e7d-8a8b-4f44-9cd9-1e134a1b5a50', 'System-005', 2, 1, 3, 'SN-005-E', 
            ARRAY[3, 2],
            1, null, '2023-10-01', 'Beşinci sistem açıklaması', '192.168.1.44', 2, 1.0
        );

        INSERT INTO system (
            id, name, type_id, marka_id, mmodel_id, seri_num, ilskili_unsur,
            depo, mevzi_id, giris_tarihi, description, ip, state, frequency
        ) VALUES (
            'c87fbb45-40aa-4c72-9e26-6d73b9d1a2c5', 'System-002', 2, 2, 2, 'SN-002-B', 
            ARRAY[2],
            1, null, '2023-07-15', 'İkinci sistem açıklaması', '192.168.1.42', 0, 1.0
        );

        INSERT INTO system (
            id, name, type_id, marka_id, mmodel_id, seri_num, ilskili_unsur,
            depo, mevzi_id, giris_tarihi, description, ip, state, frequency
        ) VALUES (
            '09dbed9d-4e3b-42a2-9355-2d9272c1fabe', 'System-003', 3, 2, 3, 'SN-003-C', 
            ARRAY[1, 2, 3],
            2, 'd5a9f8d0-3e6c-4e8d-9f97-6d67a9c8d1be', '2023-08-10', 'Üçüncü sistem açıklaması', '192.168.1.43', 0, 1.0
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
            arizalar DATE[],
            onarimlar DATE[],
            photos TEXT[],
            bakimlar DATE[],
            ip TEXT,
            state INTEGER DEFAULT 1,
            frequency FLOAT DEFAULT 5      
        );


        INSERT INTO malzeme (
            id, name, description, seri_num, type_id, marka_id, mmodel_id, system_id, 
            depo, giris_tarihi, arizalar, onarimlar, bakimlar
        ) VALUES (
            'd1f8c8f7-3c2d-4d29-a6c3-2e25f7b7b9e7', 'Malzeme-001', 'Birinci malzeme açıklaması', 
            'SN-MALZ-001', 1, 1, 1, 'f5d13e7d-8a8b-4f44-9cd9-1e134a1b5a50', 
            0, '2024-09-01', 
            ARRAY['2024-09-05'::DATE, '2024-09-10'::DATE], 
            ARRAY['2024-09-06'::DATE], 
            ARRAY['2024-09-07'::DATE, '2024-09-14'::DATE]
        );

        INSERT INTO malzeme (
            id, name, description, seri_num, type_id, marka_id, mmodel_id, system_id, 
            depo, mevzi_id, giris_tarihi, arizalar, onarimlar, bakimlar
        ) VALUES (
            'e4a1b8f9-6d5e-41c2-9f17-8b3d1f8c4a19', 'Malzeme-002', 'İkinci malzeme açıklaması', 
            'SN-MALZ-002', 2, 2, 2, 'a0a5d8ec-b0d6-42e8-8e17-4b62b5a8f973', 
            2, 'a16f634c-48ff-4f6b-90d4-7cbf8f9856e4', '2024-09-02', 
            ARRAY['2024-09-08'::DATE], 
            ARRAY['2024-09-08'::DATE],
            ARRAY['2024-09-10'::DATE, '2024-09-17'::DATE]
        );

        INSERT INTO malzeme (
            id, name, description, seri_num, type_id, marka_id, mmodel_id, system_id, 
            depo, mevzi_id, giris_tarihi, arizalar, onarimlar, bakimlar
        ) VALUES (
            'f8e2b1d7-7c9a-4e5f-815e-2a9d7c6b2f3a', 'Malzeme-003', 'Üçüncü malzeme açıklaması', 
            'SN-MALZ-003', 3, 3, 3, 'c87fbb45-40aa-4c72-9e26-6d73b9d1a2c5', 
            2, '9c1b3eaf-02ff-4b45-a458-c5f4a6f3b3ad', '2024-09-03', 
            ARRAY['2024-09-11'::DATE, '2024-09-15'::DATE], 
            ARRAY['2024-09-12'::DATE], 
            ARRAY['2024-09-13'::DATE]
        );

        INSERT INTO malzeme (
            id, name, description, seri_num, type_id, marka_id, mmodel_id, system_id, 
            depo, giris_tarihi, arizalar, onarimlar, bakimlar
        ) VALUES (
            '09dbed9d-4e3b-42a2-9355-2d9272c1fabe', 'Malzeme-004', 'Dördüncü malzeme açıklaması', 
            'SN-MALZ-004', 4, 4, 4, '09dbed9d-4e3b-42a2-9355-2d9272c1fabe', 
            0, '2024-09-04', 
            ARRAY['2024-09-12'::DATE], 
            ARRAY['2024-09-13'::DATE], 
            ARRAY['2024-09-14'::DATE, '2024-09-18'::DATE]
        );

        INSERT INTO malzeme (
            id, name, description, seri_num, type_id, marka_id, mmodel_id, system_id, 
            depo, giris_tarihi, arizalar, onarimlar, bakimlar
        ) VALUES (
            'a9b7c8d3-1f2e-4c5b-98d6-3b2c1d4a5e6f', 'Malzeme-005', 'Beşinci malzeme açıklaması', 
            'SN-MALZ-005', 5, 5, 5, 'f5d13e7d-8a8b-4f44-9cd9-1e134a1b5a50', 
            1, '2024-09-05', 
            ARRAY['2024-09-14'::DATE, '2024-09-20'::DATE], 
            ARRAY['2024-09-15'::DATE], 
            ARRAY['2024-09-16'::DATE, '2024-09-22'::DATE]
        );

    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'malz_matches'
    ) THEN
        CREATE TABLE malz_matches (
            id SERIAL PRIMARY KEY,
            malzeme_name TEXT REFERENCES malzeme(name),
            mevzi_id UUID REFERENCES mevzi(id),
            ip TEXT DEFAULT '',
            state INTEGER DEFAULT 1  ---- 0: down, 1: unknown, 2: up
        );
    END IF;

END $$;
