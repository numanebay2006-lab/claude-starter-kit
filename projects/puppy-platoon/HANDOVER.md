# PROJE DEVİR BELGESİ: Puppy Platoon Shopify Mağazası

Güncelleme: 2026-10-22, ~17:40 UTC. Repo: `numanebay2006-lab/claude-starter-kit`, branch `claude/puppy-platoon-store`, klasör `projects/puppy-platoon/`.

İşaretler: **[D]** = API sorgusu, tarayıcı testi ya da md5 ile doğrulandı. **[V]** = varsayım ya da doğrulanmadı.

---

## 1. Projenin amacı

Tek ürünlü dropshipping mağazası **"Puppy Platoon"**. Ürün: **Puppy Soldier Dog Costume**. Köpeği ayakta duran küçük bir asker gibi gösteren kostüm: kamuflaj kask ve kulaklık, bayraklı yelek, peluş kollar ve peluş oyuncak tüfek. Fiyatı $42, bedenler S/M/L/XL/2XL. Tedarikçi CJ Dropshipping.

Kullanıcının istekleri (ilk talepten):
- Yüksek dönüşüm sağlayan, mobil öncelikli bir site. Ne satıldığı anında anlaşılmalı.
- Animasyonlu karakter (maskot), daha iyi sticky sepete ekle butonu ve sepet çekmecesi.
- Teklifler ve paketler, ürün sayfasında küçük bir oyun, daha iyi renk/font ve metinler.
- Higgsfield bağlıysa stüdyo fotoğrafları.
- **İki pazar: ABD ve Worldwide.**
- **Ücretsiz kargo ve $2.55 Express kargo. Kargo süresi "5–7 gün" olarak gösterilmeli.**
- **$3 paket koruması (package protection).**
- Planı ve master prompt'u 10 alt ajan yazacak, ana ajan inceleyip uygulayacak. Bitince 10 ajan tüm mağazayı inceleyecek (pazarlar, kargo dahil) ve hatalar **izin sorulmadan** düzeltilecek.
- Kullanıcı tam yetki verdi: "her şeyi kendin yap, yayınla".

Kullanıcı Türkçe konuşuyor ve yanıtları Türkçe istiyor. Mağaza metinleri İngilizce (hedef ABD alıcısı).

---

## 2. Mevcut durum

### Mağaza ve admin tarafı (hepsi API ile yapıldı)

| Konu | Durum |
|---|---|
| Pazarlar | **[D]** "United States" `gid://shopify/Market/65004994808` (US, USD). "Worldwide" `gid://shopify/Market/64989823224`: eski "Türkiye" pazarı yeniden adlandırıldı, 233 ülke (TR dahil, US hariç), USD, primary. İkisi de web presence `gid://shopify/MarketWebPresence/58392707320`'e bağlı. |
| US kataloğu | **[D]** Catalog `gid://shopify/MarketCatalog/127955403000`, publication `gid://shopify/Publication/224875249912` (ALL_PRODUCTS, autoPublish). İçinde iki ürün de var. |
| Gönderim ülkeleri | **[D]** `shop.shipsToCountries` içinde US **var** (kullanıcı admin'de bir şey değiştirdikten sonra geldi). Hariç kalanlar sadece AC, AN, BV, CU, HM, IR, KP, SY, TA, UM, ZZ. |
| Stok / satılabilirlik | **[D]** 5 varyantın hepsi `availableForSale`, toplam 36.609 adet, `cjdropshipping` lokasyonunda. Tarayıcı testi: US, DE, GB, FR, IT, ES'de satılabilir ve `/cart/add.js` 200 dönüyor. |
| Kargo profili (eski API) | **[D]** General profile `117340504312`. Bölgeler "United States" (kullanıcı yeniden oluşturdu, id 515752165624) ve "Worldwide" (rest of world). İkisinde de Free Standard $0 "5–7 business days" ve Express $2.55 var. **AMA checkout bunları kullanmıyor (bkz. bölüm 6).** |
| Package Protection | **[D]** Ürün `gid://shopify/Product/15438753628408`, varyant `67770384613624`. $3, `requiresShipping:false`, stok takipsiz, `seo.hidden=1`. Online Store ve US kataloğunda yayında. |
| Ana ürün | **[D]** `gid://shopify/Product/15436873138424`, handle `puppy-soldier-clothes-suit`. Başlık "Puppy Soldier Dog Costume", vendor "Puppy Platoon", SEO başlık/açıklama ve İngilizce açıklama yazıldı. Medya sırası değişti (1. dachshund, 2. Louie M, 3. Milo S, 4. üçlü köpek, 5. Frenchie beyaz zemin, 6. kutu seti, 7. set). Alt metinler yazıldı. |
| İndirimler | **[D]** Otomatik "Battle Buddies: 15% off 2 suits" `DiscountAutomaticNode/1581329449208`. Otomatik "The Squad: 25% off 3+ suits" `…/1581329481976`. Kod **TREAT10**: %10 sipariş indirimi, min $35, müşteri başına 1 kez, bundle ile birleşir (`DiscountCodeNode/1581329514744`). |
| Diller | **[D]** `tr` primary ve yayında. `en` etkin ama **yayında değil ve varsayılan değil**. |
| Sayfalar | **[D]** Bu oturumda oluşturuldu: Size Guide `164593500408` (template `size-guide`), FAQ `164593533176` (`faq`), Track Your Order `164593565944` (`track`), About Puppy Platoon `164593598712`. "İletişim" sayfası (`164551819512`, template `contact`) "Contact Us" olarak yeniden adlandırıldı. |

### Tema "Puppy Platoon v1"

- **[D]** `gid://shopify/OnlineStoreTheme/188335325432`, **YAYINLANMAMIŞ**. Canlı tema hâlâ Horizon `188307865848`. Canlı temaya yazmak MCP aracıyla engelli.
- **[D]** Tüm `pp-*` dosyaları, şablonlar, layout ve ayarlar yüklendi. md5'ler `manifest.txt` ile eşleşiyor. Tek istisna `config/settings_data.json`: Shopify başına yorum ekledi, içerik aynı.
- **[D]** Önizleme render oluyor: `https://er1tj9-rh.myshopify.com/?preview_theme_id=188335325432`. Ana sayfada Liquid hatası yok. pp-* JS konsol hatası görülmedi; sadece Shopify önizleme çubuğunun kendi hataları var.
- Çalışan özellikler (önizleme ekran görüntüsünde görüldü **[D]**):
  - Duyuru çubuğu, header, mobil menü.
  - Hero ve maskot (Sergeant Pup, CSS animasyonlu SVG).
  - "What you get", fotoğraf şeridi, 3'lü paket kartları.
  - Kilo ile beden bulucu, occasions bölümü, dürüst sezon notu (Halloween sonrası teslim uyarısı), güven şeridi.
  - SSS (FAQPage schema), final CTA, footer.
  - Ürün sayfası: galeri, beden hapları, beden bulucu, paket seçici, teslim tarihi tahmini, akordeonlar, Treat Drill oyun kartı.
- **[V] Test edilmedi:** gerçek sepete ekleme → özel çekmece açılması, ilerleme çubuğu/upsell/koruma anahtarı, sticky bar davranışı, oyun kazanma akışı. Tema önizleme ajanının raporu gelmedi.

---

## 3. Teknik yapı

- **Platform:** Shopify (Basic plan), Horizon teması (2025, blok tabanlı) üzerine özel `pp-*` dosyaları.
- **Diller:** Liquid, vanilla JS (ES2020, kütüphane yok), CSS (custom properties), JSON şablonlar.
- **Fontlar:** Google Fonts'tan Lilita One (başlıklar), DM Sans (gövde) ve Black Ops One (logo ve damga etiketleri).
- **Mimari:**
  - `layout/theme.liquid` yeniden yazıldı. Horizon header/footer grupları `pp-header`/`pp-footer` ile değiştirildi. Horizon cart drawer render edilmiyor, onun yerine `pp-cart-drawer` var. `settings.cart_type = "page"`.
  - `pp-cart.js`: AJAX Cart API (`/cart.js`, `/cart/add.js`, `/cart/change.js`, `/cart/update.js`), tek kuyrukla yarışsız çalışır. `/cart` linkine tıklanınca çekmece açılır. Koruma ürünü sepette tek başına ya da 1'den fazla kalmaz.
  - Global API: `window.PPCart.add(items)`, `.open()`, `.close()`, `.refresh()`. Olaylar: `pp:cart`, `pp:added`, `pp:cart-open`, `pp:cart-close`.
  - Yapılandırma `snippets/pp-config.liquid` içinde `window.PP_CFG`: moneyFormat, mainProductId, protectionVariantId, `tiers [{qty:2,pct:15},{qty:3,pct:25}]`, upsellVariants.
  - Beden verisi tek kaynak: `snippets/pp-size-data.liquid` (CJ beden tablosu). `mode:'json'` JS için, `mode:'table'` HTML için.
- **Araçlar:**
  - Shopify Admin GraphQL, MCP `mcp__Shopify__*` üzerinden. Şema 2026-01'e sabit. Gerekirse ToolSearch ile `select:mcp__Shopify__graphql_query,mcp__Shopify__graphql_mutation,mcp__Shopify__graphql_schema` yükle.
  - Playwright + Chromium (`NODE_PATH=/opt/node22/lib/node_modules`).
  - Python 3, git.
- **Eksik API yetkileri [D]:** `write_legal_policies` (politikalar), ödeme ayarları, `read_delivery_customizations`, yeni pazar bazlı kargo (`Market.delivery`) alanları, varsayılan dil değiştirme ve tema yayınlama (araç engelliyor).

---

## 4. Dosyalar (`projects/puppy-platoon/`)

| Yol | Görev |
|---|---|
| `theme/` | Temanın yerel kaynağı. Mağazadaki tema yollarının birebir aynısı. |
| `theme/layout/theme.liquid` | Fontlar, `pp-base.css`, `pp-config`, `pp-cart-drawer`, `pp-cart.js` ve `pp-ui.js`'i yükler. |
| `theme/assets/pp-base.css` | Tasarım tokenları (`--pp-bg #FBF6EC`, `--pp-olive #4B5D2A`, `--pp-cta #C2410C`, `--pp-gold #F2C14E` …), butonlar, header/footer, çekmece, maskot animasyonları, sticky bar. |
| `theme/assets/pp-cart.js` | Sepet çekmecesi: ilerleme çubuğu, upsell (marjinal fiyatla "+$29.40"), koruma anahtarı, indirim satırları. |
| `theme/assets/pp-ui.js` | Duyuru döngüsü, mobil menü, maskot selamı ve 15 sn sonra dinlenme, konuşma balonu, reveal, teslim tarihi, ana sayfa sticky bar, beden bulucu. |
| `theme/assets/pp-product.{css,js}` | Ürün sayfası: galeri, beden/paket seçimi, ATC, sticky ATC, beden bulucu, dialoglar. |
| `theme/assets/pp-game.js`, `sections/pp-game.liquid` | Treat Drill oyunu: 20 sn'de 8 kemik yakala, kazanınca TREAT10. Kodu `/cart/update.js {discount}` ile sepete uygular. "Skip" linki var. |
| `theme/assets/pp-home.css` | Ana sayfa ve içerik sayfası stilleri. |
| `theme/sections/pp-*.liquid` | announcement, header, footer, hero, explainer, photos, bundles, sizer, occasions, trust, faq, final, product, game, page, size-page, contact, track, 404. |
| `theme/snippets/pp-*.liquid` | config, cart-drawer, mascot (SVG), logo-mark, size-data. |
| `theme/templates/*.json` | index, product, page, page.faq, page.size-guide, page.contact, page.track, 404. |
| `theme/config/settings_data.json` | Horizon renkleri, `cart_type: page`. |
| `manifest.txt` | Her tema dosyasının md5'i ve boyutu, yüklemeyi doğrulamak için. |
| `BRIEF.md` | Ajanlara verilen proje özeti. |
| `plans/plan_*.md` | Uzman planları (brand, copy, home, pdp, offers, cart, mascot). game, ops ve assets planları sadece workflow journal'ında kaldı, MASTER_PLAN'e işlendi. |
| `MASTER_PLAN.md` | 10 plandan sentezlenmiş master prompt ve build spec (~120 KB). |
| `POLICIES.md` | Admin'e yapıştırılacak İngilizce politika metinleri. |
| `qa/REVIEW_BRIEF.md`, `qa/reports/*.md` | 10 ajanlık incelemenin brief'i ve gelen raporlar. |
| `qa/scripts/*.js` | Playwright test scriptleri (`avail.js US,DE` → ülke bazında satılabilirlik). |
| `reference/*.jpg` | Ürün fotoğrafları ve CJ beden tablosu (`sizechart.jpg`). |
| `tools/` | `extract_plans.py`, `shot.js`. |
| `STATUS.md` | Kısa durum notu. Bu belge onun güncel ve detaylı hali. |

---

## 5. Alınan kararlar

1. **Canlı temayı değil, kopyasını düzenle.** MCP canlı temaya yazmayı engelliyor, ayrıca canlı mağazayı bozma riski var. Bu yüzden `themeDuplicate` ile "Puppy Platoon v1" oluşturuldu.
2. **Horizon bloklarını özelleştirmek yerine bağımsız `pp-*` section'lar yazıldı.** Böylece davranış tamamen kontrol altında, Horizon güncellemelerinden de etkilenmiyor. Horizon header, footer ve cart drawer devre dışı.
3. **Uygulama yok.** Sticky ATC, çekmece, paketler, koruma ve oyun tema içinde yazıldı. İndirimler native otomatik indirim olarak kuruldu.
4. **Paket indirimi ürüne özel otomatik indirim.** 2 adette %15, 3+ adette %25. Birbirleriyle birleşmiyorlar. Koruma ürünü indirim dışı.
5. **Koruma varsayılan KAPALI.** AB'de önceden işaretlenmiş ücretli ek hizmet yasak. Sepette satır olarak değil, anahtar olarak gösteriliyor.
6. **Sahte yorum, sahte sayaç, sahte compare-at fiyat yok.** "Most popular" rozeti yok, "Best value" sadece 3'lü pakette. Tüfek her yerde "plush toy rifle (soft fabric, not a real or replica weapon)" olarak geçiyor. Askeri kurumla bağ olmadığına dair uyarı var.
7. **Beden tablosu CJ'nin gerçek tablosundan:** S 5–12 lb, M 12–22, L 22–35, XL 35–60, 2XL 55–90. PDP planındaki uydurma tablo kullanılmadı. Örnekler: Milo 6 lb → S, Louie 22 lb → M.
8. **Pazarlar:** eski Türkiye pazarı silinmedi, "Worldwide" yapıldı. Primary pazar silinemiyor. TR de bu pazarın içinde.
9. **Tema dosyalarını yükleme yöntemi:** `themeFilesUpsert` body `{type:"URL"}` ve GitHub raw URL'si, commit SHA ile. Metni araç çağrısına yapıştırmaktan çok daha hızlı. Repo public olduğu için çalışıyor.
10. **İnceleme ajanları sadece okuma yaptı.** 10 ajanın aynı anda mağazayı değiştirmesi çakışma riski taşıyor. Düzeltmeleri ana ajan yapıyor.
11. **Higgsfield kullanılmadı.** Sadece 10 kredi vardı (free plan). Mevcut 7 fotoğraf ve kodla çizilmiş grafikler kullanıldı.

---

## 6. Hatalar ve çözümler

| # | Sorun | Durum |
|---|---|---|
| 1 | ABD'de ürün "tükendi" görünüyordu. US, `shipsToCountries` içinde yoktu. | **Çözüldü [D].** Ben US kataloğu ekledim, bölgeyi yeniden oluşturdum, işe yaramadı. Kullanıcı admin'de bir değişiklik yaptıktan sonra US listeye girdi ve ürün satılabilir oldu. **Kesin kök neden bilinmiyor [V].** Ajan 4'ün tahmini: Shopify'ın 1 Ağustos 2025 kuralı ("sadece yapılandırılmış kargo bölgelerinde satış") ve aktif olmayan US bölgesi. |
| 2 | **Checkout yanlış kargo fiyatı gösteriyor.** | **ÇÖZÜLMEDİ [D].** `draftOrderAvailableDeliveryOptions` sonuçları: US → sadece **"Ekonomi" $5.00**. DE/GB/TR/AU → **"Standart" $3.00, "Hızlı" $5.00**. Ücretsiz kargo ve $2.55 yok, "5–7 gün" açıklaması yok. Profildeki API oranları yok sayılıyor. Mağaza büyük olasılıkla pazar bazlı kargoya geçmiş [V]. **Admin'de elle düzeltilmeli** (bölüm 8). |
| 3 | Mağaza dili Türkçe. Checkout, çerez bandı, sistem metinleri ve başlık "Mağazam" Türkçe çıkıyor. | **Çözülmedi.** Admin: Ayarlar → Diller → İngilizce'yi varsayılan yap. Ayarlar → Genel → mağaza adı "Puppy Platoon". |
| 4 | Ürün sayfası mobilde yatay taşıyor (390 px genişlikte 456 px). | **Çözülmedi [D].** Suçlu element henüz bulunmadı. Bulma scripti (`wide.js`) çalıştırılmadan kesildi. Şüpheliler: `.pp-kit`, `.pp-trust`, `.pp-pills`, `.pp-gallery__thumbs` padding'i ya da `.pp-sarge`. |
| 5 | Politika yazılamıyor (`write_legal_policies` yok). | Metinler `POLICIES.md`'de. **Admin'den yapıştırılacak.** |
| 6 | Arka planda yükleme yapan alt ajan oturum limitine (429) takıldı. | Atlatıldı: URL yöntemiyle kalan dosyalar ben yükledim. md5'ler doğrulandı. |
| 7 | Curl ile seri istek → Shopify bot challenge ("Verifying your connection…"). | Testler Playwright ile, ülkeler arası ≥3–15 sn beklemeyle yapılıyor. Challenge dönen sonuç "bilinmiyor" sayılıyor. |
| 8 | Ajan 3 (Asya/OD/Afrika ülke testi) için sistem "Third-Party Attack" güvenlik uyarısı verdi. | Ajan zaten durdurulmuştu. **Sonuçları kullanılmadı.** Ne yaptığı incelenmedi [V]. |
| 9 | `DeliveryLocationGroup.locations` CJ lokasyonunu göstermiyor. | Sorun değil [D]. `includeLegacy:true` ile CJ görünüyor, grupta 2 lokasyon var. |

**Testler [D]:**
- md5 karşılaştırması: tüm tema dosyaları.
- Playwright: önizleme ana sayfa ve PDP 390 px ekran görüntüsü (`qa/` içinde).
- Ülke satılabilirliği: US, DE (true). Avrupa taraması: GB, DE, FR, IT, ES satılabilir ve sepete ekleniyor. NL, BE, IE, AT, CH, SE sonuç vermedi (bot challenge ya da ajan kesildi).
- Draft-order kargo oranı sorgusu: NY adresi → Ekonomi $5.

---

## 7. Son yapılan işlem

1. 10 inceleme ajanı başlatıldı. **Rapor verenler:** inventory-locations, markets, shipping-rates, live-theme (kısmi), store-config. **Gelmeyenler:** sweep-americas, sweep-europe (kısmi json var), cart-checkout (sadece bir US ekran görüntüsü: `qa/reports/cart-checkout-shipping-US.png`), theme-preview. sweep-rest güvenlik uyarısıyla durdu. Bu oturum kapanınca çalışanlar da kaybolur.
2. Düzeltmeler başladı:
   - Politika yazma denendi, yetki yok.
   - 4 sayfa oluşturuldu, iletişim sayfası yeniden adlandırıldı.
   - **Menüleri güncellerken kullanıcı işlemi kesti.** `MenuItemCreateInput` şeması okunmuştu, `menuUpdate` çağrılmadı.
3. Kullanıcı bu devir belgesini istedi. Bu belge ve QA raporları repoya commit'lendi.

---

## 8. Bekleyen işler (öncelik sırasıyla)

**A. Kullanıcının admin'de yapması gerekenler (API ile yapılamıyor):**
1. **Kargo oranları:** Ayarlar → Pazarlar → United States → Kargo:
   - "Ekonomi" → **Free Standard Shipping, $0.00, 5–7 iş günü**
   - **Express Shipping $2.55** ekle
   
   Worldwide → Kargo:
   - "Standart" → Free Standard $0, 5–7 gün
   - "Hızlı" → Express $2.55
   
   Express açıklaması "Priority handling + tracking" olsun. Pazar altında kargo bölümü yoksa Ayarlar → Kargo ve teslimat'tan düzenlenmeli.
2. **Dil:** Ayarlar → Diller → İngilizce yayınla ve varsayılan yap.
3. **Mağaza adı:** Ayarlar → Genel → "Puppy Platoon". Logo ve checkout markası eklensin.
4. **Ödeme:** Ayarlar → Ödemeler → yabancı kart ve USD kabul eden bir sağlayıcı aktif mi? Türkiye'de Shopify Payments yok. Görülemedi [V]; **satış engelleyici olabilir.**
5. **Politikalar:** `POLICIES.md`'yi Ayarlar → Politikalar'a yapıştır, Gizlilik politikasını İngilizce yeniden oluştur.
6. **Tema yayınlama:** API engelli. Online Mağaza → Temalar → "Puppy Platoon v1" → Yayınla. Bunu B işleri bittikten sonra yap.

**B. Claude'un yapacakları (API ve tema):**
1. Kullanıcı A1'i yapınca kargo oranlarını doğrula: `draftOrderAvailableDeliveryOptions` ile US (NY) ve DE (Berlin). Free $0 ve Express $2.55 görünmeli.
2. **Menüler (`menuUpdate`):**
   - `main-menu` (`275742261496`): Shop the Suit → `/products/puppy-soldier-clothes-suit`, Size Guide → `/pages/size-guide`, Bundles → `/#bundles`, FAQ → `/pages/faq`, Track Order → `/pages/track`.
   - Footer menüleri **oluşturulmalı** (`menuCreate`). `sections/footer-group.json` şu handle'ları bekliyor: `footer-shop`, `footer-help`, `footer-policies`. Shop: Shop the Suit, Bundles, Size Guide. Help: FAQ, Track Order, Contact Us, About. Policies: Refund, Shipping, Privacy, Terms (`/policies/...`).
   - Mevcut `footer` (`275742294264`) menüsündeki Türkçe öğeleri İngilizceye çevir.
   - "Ana sayfa" koleksiyonunu "Home" yap.
3. **Ürün seçenekleri:**
   - Beden sırasını S, M, L, XL, 2XL yap (`productOptionsReorder`). Şu an 2XL ilk sırada, bu yüzden varsayılan seçili beden 2XL.
   - Tek değerli "Color" seçeneğini sil: `productOptionsDelete(productId, options:["gid://shopify/ProductOption/17906217746680"], strategy: DEFAULT)`. Varyant ID'leri korunur. Önce `product.options` ile ID'yi yeniden doğrula. CJ senkronu bu seçeneği geri ekleyebilir [V].
4. **Ürün verisi:**
   - Canlı açıklamadaki doğrulanmamış "soft polyester fabric" ifadesini kaldır.
   - SEO açıklamasındaki "S-XXL"i "S-2XL" yap.
   - Kategori: kostüm için `gid://shopify/TaxonomyCategory/ap-2-6-5` (Pet Costumes), koruma için `pa-6`. Ajan önerisi, doğrulanmadı.
   - Koruma ürününe görsel ekle.
5. **PDP mobil taşmasını bul ve düzelt.** Script: önizleme URL'si `?country=DE&preview_theme_id=188335325432`, 390 px viewport. Sağ kenarı `clientWidth`'i aşan ve overflow ile kırpılmayan elementleri listele.
6. **Tema QA (Playwright, yavaş):**
   - ATC → çekmece açılıyor mu, ilerleme çubuğu, upsell, koruma anahtarı, toplamlar `/cart.js` ile eşleşiyor mu.
   - Sticky ATC, oyunun skip → kod → uygula akışı, beden bulucu, 404, iletişim formu, beden rehberi ve SSS sayfaları.
7. **Tema ve MASTER_PLAN farklarını kullanıcıyla netleştir veya uygula:**
   - Oyun: tema 8 kemik/20 sn, plan 10/15. Tema değeri ayarlardan değişebiliyor.
   - Teslim tarihi: plan 1–2 gün işlem süresi ekliyor, tema eklemiyor.
   - Çekmece: plan native `<dialog>` istiyor, tema `div role=dialog` kullanıyor.
8. **Marj riski:** ajana göre birim maliyet $18.28 [V]. 3'lü paket ve TREAT10 ile takım başı $28.35, kargo ücretsiz. Seçenekler: 3'lü paketi %20'ye düşür (`pp-config` tiers, bundles ve PDP metinleri, otomatik indirim), ya da TREAT10'u `combinesWith.productDiscounts:false` yap. **Kullanıcı kararı gerekli.**
9. Gümrük: varyantlara `countryCodeOfOrigin: CN` ve HS kodu `420100` ekle. Önce CJ ile teyit et.
10. Eksik raporlar için ülke ve checkout testlerini yavaşça tekrar et (Amerika, Avrupa geri kalanı, Asya). Sonuçları `qa/reports/`'a yaz.
11. Her şey yeşilse kullanıcıya temayı yayınlamasını söyle (A6). Yayından sonra canlı mağazada 3 ülkeden sepete ekle ve checkout'a kadar git.
12. **Her değişiklikten sonra:** yerel dosyayı düzenle → `manifest.txt`'yi yeniden üret → commit ve push → yeni commit SHA ile URL yükle → md5 doğrula.

---

## 9. Önemli talimatlar

- **Kullanıcıya Türkçe yanıt ver.** Mağaza içeriği İngilizce.
- Kullanıcı tam yetki verdi: "izin sormadan düzelt, kendin yayınla". Yine de **canlı temayı yayınlama ve ödeme gibi işler admin'de**; API izin vermiyor.
- **Uyum kuralları:**
  - Sahte yorum, yıldız, sayaç, stok sayacı veya compare-at fiyat yok.
  - "gun, weapon, army-issued, military-approved" kelimeleri yok.
  - Tüfek her zaman "plush toy rifle".
  - Em dash az kullan, kısa cümleler kur. "It's not X, it's Y" gibi yapay zeka kalıpları yok.
- **Kargo metni her yerde "5–7 business days".** Express "daha hızlı" diye vaat edilmesin; "priority handling + tracking" denebilir.
- **Shopify tuzakları** (`/home/user/claude-starter-kit/knowledge/LESSONS.md` §6):
  - Section'ı şablondan önce yükle.
  - Curl ile seri istek atma (bot challenge çıkar).
  - Önizleme çerezleri yanıltabilir.
  - İndirim kodunun adı değerini göstermez; değeri sorgula.
- **Starter kit kurulu [D]:** 42/42 plugin, 94 skill, 10 agent. `~/.claude/` altında. Yeni bulut oturumunda yoksa: `bash /home/user/claude-starter-kit/install.sh`.
- Git: commit mesajı sonuna attribution satırları eklenir. Push: `git push -u origin claude/puppy-platoon-store`. **PR açma**; kullanıcı istemedi.
- Yazmaları paralel ajanlara verme. İnceleme ajanları sadece okusun.

---

## 10. Kod ve Git durumu

- Branch: **`claude/puppy-platoon-store`**. `main`'den (`85011c4`) ayrıldı.
- Commit'ler:
  - `71c7582` "feat: add Puppy Platoon store build (theme code, plans, status)". **Push edildi [D].** Tema yüklemedeki raw URL'ler bu SHA'yı kullanıyor.
  - Bu belgeyle birlikte ikinci commit: HANDOVER.md, POLICIES.md, qa/ klasörü. Push edildi (commit sonrası kontrol et).
- Push edilmemiş değişiklik yok (commit sonrası `git status` temiz olmalı).
- Açık PR yok.

**Yükleme komutu şablonu** (değişen her dosya için, SHA'yı güncelle):

```graphql
mutation($files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
  themeFilesUpsert(themeId: "gid://shopify/OnlineStoreTheme/188335325432", files: $files) {
    upsertedThemeFiles { filename } userErrors { filename field message code } job { id }
  }
}
# variables:
{"files":[{"filename":"assets/pp-product.css","body":{"type":"URL","value":"https://raw.githubusercontent.com/numanebay2006-lab/claude-starter-kit/<SHA>/projects/puppy-platoon/theme/assets/pp-product.css"}}]}
```

Sonra `job { done }` sorgula, ardından md5 doğrula:

```graphql
{ theme(id:"gid://shopify/OnlineStoreTheme/188335325432"){ files(first:100, filenames:["assets/pp-*","sections/pp-*","snippets/pp-*","templates/*.json","layout/theme.liquid"]){ nodes{ filename checksumMd5 } } } }
```

Manifest üretimi:

```bash
cd /home/user/claude-starter-kit/projects/puppy-platoon/theme && find . -type f | sort | sed 's#^\./##' | while read f; do echo "$(md5sum "$f" | cut -d' ' -f1) $(wc -c < "$f") $f"; done > ../manifest.txt
```

Satılabilirlik testi:

```bash
cd /home/user/claude-starter-kit/projects/puppy-platoon/qa/scripts && NODE_PATH=/opt/node22/lib/node_modules node avail.js US,DE
```

Kargo oranı testi:

```graphql
query($i: DraftOrderAvailableDeliveryOptionsInput!) { draftOrderAvailableDeliveryOptions(input:$i){ availableShippingRates{ title price{amount currencyCode} } } }
# {"i":{"lineItems":[{"variantId":"gid://shopify/ProductVariant/67765307474168","quantity":1}],"shippingAddress":{"address1":"350 5th Ave","city":"New York","provinceCode":"NY","zip":"10118","countryCode":"US"}}}
```

Varyant ID'leri: 2XL `67765307408632`, L `67765307441400`, M `67765307474168`, S `67765307506936`, XL `67765307539704`. Lokasyonlar: Ankara `96125485304` (stok yok), cjdropshipping `96125649144` (tüm stok, fulfillment service).

---

## 11. Eksik bilgiler ve doğrulanması gerekenler

- [V] Kullanıcının US sorununu çözmek için admin'de **tam olarak ne yaptığı** bilinmiyor. "Ekonomi $5" oranı muhtemelen o sırada eklendi.
- [V] Mağaza gerçekten pazar bazlı kargoya mı geçti? API 2026-01 bunu gösteremiyor.
- [V] Aktif bir ödeme sağlayıcı var mı, USD ve yabancı kart kabul ediyor mu?
- [V] Şifre sayfası açık mı?
- [V] CJ gerçek işlem ve teslim süresi. "5–7 gün" iddiası CJ'nin ABD'ye gerçekçi süresiyle uyuşuyor mu? Express'in gerçek bir avantajı var mı?
- [V] Birim maliyet ($18.28, ajan raporu) ve CJ kargo maliyeti → paket indirimlerinin kârlılığı.
- [V] Ürün fotoğraflarının (başka markanın görselleri, `_water` dosya adları) kullanım hakkı.
- [V] Yeni temanın sepet, çekmece, oyun ve sticky davranışları gerçek tarayıcıda test edilmedi.
- [V] Gelmeyen raporlar: sweep-americas, sweep-europe (tam), cart-checkout, theme-preview, sweep-rest (güvenlik uyarısı).
- [V] Google Merchant ve Meta reklam politikaları, gerçekçi siyah "AR" peluş tüfek görselleri nedeniyle reddedebilir. SEO başlığında "Plush Rifle" var.
- [V] AB/İngiltere vergi ve gümrük yükümlülükleri (DDU gönderim, UK VAT).

---

## EK: Devir belgesinden sonra yapılanlar (2026-10-22 ~18:00 UTC) [D]

- **Dil:** kullanıcı İngilizce'yi varsayılan yaptı (`en` primary + published). Çerez bandı İngilizce görünüyor.
- **Menüler:** `main-menu` İngilizce (Shop the Suit, Size Guide, Bundles, FAQ, Track Order). `footer` menüsü İngilizce. Yeni: `footer-shop` (275817693432), `footer-help` (275817726200), `footer-policies` (275817758968). `customer-account-main-menu` güncellenemedi ("Customer account page must exist" hatası). Düşük öncelik.
- **Ürün:** beden sırası S, M, L, XL, 2XL. "Color" seçeneği silindi; varyant başlıkları artık sadece beden, ID ve SKU'lar aynı, stok aynı. SEO başlık: "Puppy Soldier Dog Costume with Plush Arms | Puppy Platoon". SEO açıklamada "S-2XL" yazıyor. Açıklamadan "polyester" çıkarıldı. Kategoriler: Pet Costumes ve Shipping Insurance.
- **Koleksiyon:** "Ana sayfa" adı "Home" yapıldı.
- **Tema düzeltmeleri** (commit ve yükleme yapıldı, md5 eşleşiyor):
  1. PDP mobil taşma düzeltildi: `.pp-pdp__grid { grid-template-columns: minmax(0,1fr) }` ve `.pp-gallery, .pp-buy { min-width:0 }`. 390 px'te scrollWidth artık 390.
  2. Desktop galeri 96 px aşağı kayıyordu (sticky yerine relative kalmıştı). `.pp-pdp .pp-gallery { position: sticky }` ile düzeltildi.
  3. Oyun zorlaştırıldı: 15 sn'de 10 kemik, yakalama alanı ortadaki 46 px.
- **Tarayıcı testi** (US, önizleme) geçti:
  - Beden seçimi, "Add 2 suits · $71.40", sepete ekle ve çekmece açılması.
  - %15 indirim (tasarruf $12.60), ilerleme mesajı, upsell "+$23.10".
  - Koruma anahtarı: açınca +$3 = $74.40, kapatınca kalkıyor, sepet sayacı 2 kalıyor.
  - Sticky bar ("Add 2 · $71.40").
  - Oyun: hareketsiz oynayınca kaybediyor. Skip → kod → "Applied!", TREAT10 geçerli ($42 → $37.80).
  - Size guide, FAQ, track, contact, about ve 404 sayfaları hatasız, taşma yok.
- **Son commit'ler:** `ddcf9bc`, `16c26a1`, `ca9d64f`, `3a1cca7` (hepsi push edildi).
- **Hâlâ açık:** checkout kargo oranları (US "Ekonomi $5", diğerleri "Standart $3 / Hızlı $5"), politikalar, ödeme sağlayıcı kontrolü, mağaza adı, tema yayınlama. Hepsi admin işi. Marj kararı da bekliyor.

### EK 2 (2026-10-23) [D]
- **Kargo düzeltildi** (kullanıcı admin'de pazar bazlı kargoyu düzenledi). `draftOrderAvailableDeliveryOptions` sonuçları:
  - US / DE / TR: "Free Standart Shipping" $0.00 + "Express Shipping" **$3.00**.
  - Kullanıcı Express'i $2.55 giremedi, $3 yaptı. Bu karar onun, kalıcı.
- Sitedeki tüm "$2.55" metinleri "$3" yapıldı (tema + POLICIES.md). Commit `da58640`, 10 dosya yüklendi, md5'ler eşleşti.
- Eski profil API oranları (Free $0 / Express $2.55) hâlâ General profile'da duruyor ama checkout bunları kullanmıyor.
- **Açık kalanlar:**
  - Admin'de oran adında yazım hatası: "Standart" yerine "Standard" olmalı.
  - İki oranın teslimat süresi alanı boş (checkout'ta "5–7 business days" görünmüyor).
  - Politikalar, ödeme kontrolü, mağaza adı, tema yayınlama.
  - Marj kararı.

---

## DEVAM TALİMATI (yeni oturuma yapıştır)

```
Puppy Platoon Shopify projesine devam ediyoruz. Bana Türkçe yanıt ver.
1) Repoyu hazırla: /home/user/claude-starter-kit içinde `git fetch origin claude/puppy-platoon-store && git checkout claude/puppy-platoon-store`.
   Starter kit kurulu değilse `bash install.sh` çalıştır (42 plugin olmalı).
2) projects/puppy-platoon/HANDOVER.md dosyasını baştan sona oku. Bölüm 6, 8 ve 9 kritik. Sonra qa/reports/shipping-rates.md ve store-config.md'yi oku.
3) Shopify MCP araçlarını ToolSearch ile yükle (graphql_query, graphql_mutation, graphql_schema) ve durumu doğrula:
   - theme 188335325432 dosya md5'leri manifest.txt ile eşleşiyor mu,
   - draftOrderAvailableDeliveryOptions ile US (NY) ve DE (Berlin) kargo oranları (hedef: Free $0 + Express $2.55),
   - shopLocales (en varsayılan mı), shipsToCountries içinde US var mı.
4) Bana kısa bir durum özeti ver: bölüm 8A'daki admin işlerinden hangileri hâlâ yapılmamış görünüyor.
5) Sonra bölüm 8B'yi sırayla uygula. Önce menüler ve footer menüleri, sonra ürün seçenekleri (beden sırası, Color silme), ürün metin düzeltmeleri, PDP mobil taşma düzeltmesi, ardından Playwright ile yavaş tema QA.
   Her tema değişikliğinden sonra: commit, push, raw URL ile yükle, md5 doğrula.
6) Marj (3'lü %25 + TREAT10 birleşmesi) ve oyun ayarları için karar gerekiyorsa bana sor. Diğer düzeltmeleri izin sormadan yap.
7) Her şey hazır olunca temayı admin'den yayınlamamı söyle. Yayından sonra canlı mağazada US, GB ve TR'den sepete ekle ve checkout kargo adımını test et.
```
