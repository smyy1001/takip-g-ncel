# **TAKİP**
**Takip**; adminlerin çeşitli envanterler oluşturarak içerisine obje ekleyebilececkleri, kullanıcılarının ise adminler tarafından yerleştirilmiş itemleri görüntüleyebildikleri bir Envanter Takip Sistemidir.

## Kurulum

Takip'i admin olarak çalıştırmak için = takip/frontend/.env dosyasındaki REACT_APP_ROLE değişkenini 'admin' olarak bırakın. Kullanıcı olarak kullanmak istiyorsanız 'user' olarak değiştirin. (keycloak kullanılacağı için giriş ve çıkış özellikleri geçici olarak kaldırılmıştır.)

takip/frontend/.env dosyasındaki MAP_TILE_URL ifadesini kullanılacak harita altlığının adresi ile değiştirdikten sonra,
"takip" klasörünün içerisinde `docker compose up --build` komutunu çalıştırınız.

Tarayıcınızdan "http://localhost:7070/home" adresine gidin.

>7070 portu dolu ise, takip/.env dosyasının altındaki FRONTEND_PORT değişkeni ile değiştirilebilir.
>5432 postgres portu dolu ise takip/.env dosyasındaki POSTGRES_PORT değişkeni ile bu port değiştirilebilir. (DOCKER_POSTGRES_PORT değişkeni değiştirilmemelidir!)

## Kullanıcı Özellikleri

Kullanıcılar ekleme, silme, değiştirme haricindeki tüm görüntüleme, arama, filtreleme işlemlerini yapabilirler.

## Admin Özellikleri

### Envanter Ekleme / Düzenleme / Silme / Görüntüleme
- Ekleme: Anasayfanın sol kısmında bulunan panelde "Envanterler" başlığının yanında bulunan artı işareti ile yeni envanterler oluşturulabilir.

- Düzenleme: Sol panelde "Envanterler" başlığı altında, envanterin isminin yanında bulunan kalem ikonuna tıklayarak güncelleme yapılabilir.

- Silme: Sol panelde "Envanterler" başlığı altında, envanterin isminin yanında bulunan çöp kutusu ikonuna tıklayarak envanter sistemden tamamen silinebilir.
>DİKKAT: Envanterin silinmesi, içerisinde bulunan tüm objelerin de silinmesi anlamına gelir!

- Görüntüleme: Sol panelde "Envanterler" başlığı altında, her bir envanter tıklanabilir özelliğe sahiptir ve tıklandığında envanterin içerisindeki objeler görüntülenebilir. Bu objeler tıklanabilir özelliğe sahiptir ve tıklandığında detayları görüntülenebilir.


### Obje Ekleme / Silme / Düzenleme / Görüntüleme

- Ekleme: Sol panelde "Envanterler" başlığı altında, bir envanter seçilerek isminin yanında bulunan artı ikonuna tıklayarak, seçilen envantere yeni bir obje eklenebilir. Eklenecek objenin kordinatları elle girebileceği gibi, haritaya tıklayarak da seçebilir. Haritada bir noktaya tıklandığında, objeleri belirten "Pin" ikonuna benzer ancak daha küçük bir ikon belirir. Bu ikonun konumu "Obje Ekle" sekmesinde bulunan kordinatlar kısmına otomatik bir şekilde eklenir. Haritadaki bu ikon obje oluşturulduğunda kendiliğinden obje ikonuna dönüşür. İkonun haritada herhangi bir alana tekrar tıklanana kadar tamamen yok olması için ikona tıklayarak üzerinde açılan baloncuktan "KAPAT" butonuna tıklanabilir.

- Düzenleme: Sol panelde "Objeler" başlığı altında, objenin isminin yanında bulunan kalem ikonuna tıklayarak güncelleme yapılabilir. 

- Silme: Sol panelde "Objeler" başlığı altında, objenin isminin yanında bulunan çöp kutusu ikonuna tıklayarak envanter sistemden tamamen silinebilir.

> Ayrıca, envanterlerin içerisindeki objeleri görüntüleme ekranından da objeler düzenlenebilir  ve silinebilir.

- Görüntüleme: Totalde sisteme kayıtl olan tüm objeler envanter ayırmaksızın, sol panelde "Objeler" başlığı altında listelenir. Herhangi bir objenin üzerine tıklandığında detayları görüntülenebilir. 

>DİKKAT: Sol panelde "Objeler" başlığı altında bulunan 'Detaylı tabular görünüm için tıklayınız' seçeneği ile, tüm objeleri yeni açılacak ekranda tablo yapısı sayesinde bir arada görüntüleyebilirsiniz. Bu ekranda envantere göre filtreleme, sağlık durumunua göre sıralama ve arama özellikleri gibi aranan bir objeyi bulmayı kolaylaştıracak özellikler bulunur. Arama ve filtreleme özellikleri beraber (aynı anda) kullanılabilir. Ayrıca istenen objeler bu sayfada da silinebilir.

### Arama & Filtreleme

- Ana Sayfada haritanın sağ üstüne bulunan arama çubuğu ile envanter isimleri, obje isimleri, açıklamaları, adresi, bulunduğu şehir ve sağlık kontrolü için gerek duyduğu işlem gibi tüm alanlarda arama yapılabilir.

- Şehre göre filtreleme özelliği ise objeleri belirli bir şehre indirger.


>Bu arama ve filtreleme özellikleri beraber (aynı anda) kullanılabilir.
>Sonuçlar hem haritaya hem de sol panelde bulunan obje listesine yansır. 