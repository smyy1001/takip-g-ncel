# **TAKİP**

## Kurulum

takip/frontend/.env dosyasındaki MAP_TILE_URL ifadesini kullanılacak harita altlığının adresi ile değiştirdikten sonra, keycloak konfigrasyonlarını env dosyalarından değiştirmeyi unutmayınız. Keycloak arayüzünden client'e admin rolünü ekleyiniz. Rolün adının admin olması gerekmektedir. Başka isimle rol atamanız halinde sadece get isteklerini yerine getirebilirsiniz. Client' e ait admin rolünü, kullanıcıları oluşturuken kullanıcılara atamayı unutmayınız. Eğer admin rolünü atamazsanız yine sadece get isteklerini yerine getirebilirsiniz.
"takip" klasörünün içerisinde `docker compose up --build` komutunu çalıştırınız.

Tarayıcınızdan "http://host:port/home" adresine gidin.

> 7071 portu dolu ise, takip/.env dosyasının altındaki FRONTEND_PORT değişkeni ile değiştirilebilir.
> 5433 postgres portu dolu ise takip/.env dosyasındaki POSTGRES_PORT değişkeni ile bu port değiştirilebilir. (DOCKER_POSTGRES_PORT değişkeni değiştirilmemelidir!)
