# **TAKİP**

## Kurulum

Takip'i admin olarak çalıştırmak için = takip/frontend/.env dosyasındaki REACT_APP_ROLE değişkenini 'admin' olarak bırakın. Kullanıcı olarak kullanmak istiyorsanız 'user' olarak değiştirin. (keycloak kullanılacağı için giriş ve çıkış özellikleri geçici olarak kaldırılmıştır.)

takip/frontend/.env dosyasındaki MAP_TILE_URL ifadesini kullanılacak harita altlığının adresi ile değiştirdikten sonra,
"takip" klasörünün içerisinde `docker compose up --build` komutunu çalıştırınız.

Tarayıcınızdan "http://localhost:7070/home" adresine gidin.

>7070 portu dolu ise, takip/.env dosyasının altındaki FRONTEND_PORT değişkeni ile değiştirilebilir.
>5432 postgres portu dolu ise takip/.env dosyasındaki POSTGRES_PORT değişkeni ile bu port değiştirilebilir. (DOCKER_POSTGRES_PORT değişkeni değiştirilmemelidir!)
