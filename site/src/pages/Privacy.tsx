// Gizlilik politikası (uygulamanın Ayarlar ekranı bu sayfaya bağlanır).
// JSX'te satır sonu ile etiket arasındaki boşluk düşer: metinle bağlantıyı aynı satırda tut.
import { DocPage, Mail } from '../Layout';
import type { Lang } from '../site';
import * as de from './legal/de';
import * as fr from './legal/fr';
import * as es from './legal/es';
import * as it from './legal/it';
import * as pt from './legal/pt';
import * as ru from './legal/ru';
import * as nl from './legal/nl';
import * as pl from './legal/pl';
import * as ja from './legal/ja';
import * as ko from './legal/ko';
import * as ar from './legal/ar';
import * as fa from './legal/fa';
import * as hi from './legal/hi';

function PrivacyTr() {
  return (
    <DocPage
      lang="tr"
      page="privacy"
      title="Gizlilik Politikası"
      updated="8 Kasım 2026"
      description="Wordvoya hesap istemez; oyun verilerin cihazında kalır. Reklamlar uygulamada Google AdMob, sitede Google AdSense ile gösterilir; satın almalar Google Play üzerinden yapılır."
    >
      <p>
        Bu politika, <strong>Wordvoya: Kelime Bulmacası</strong> Android uygulamasını (<code>com.cranked.wordvoya</code>) ve bu web sitesini kullandığınızda hangi verilerin işlendiğini açıklar.
      </p>
      <p className="lead">
        <strong>Kısaca:</strong> Wordvoya hesap istemez; oyun verileriniz cihazınızda kalır, sunucumuza yalnız skor tablosu için seçtiğiniz ad ve oyun istatistikleriniz gönderilir. Uygulamada Google AdMob reklamları gösterilir; Google, reklamlar için cihazınızın reklam
        kimliğini ve bazı teknik bilgileri kullanabilir. "Reklamları kaldır" satın alması Google Play üzerinden yapılır.
      </p>

      <h2>Toplanan Veriler</h2>
      <ul>
        <li>
          <strong>Hesap yok:</strong> Uygulama kayıt ya da giriş istemez; adınızı, e-posta adresinizi veya başka bir
          kimlik bilginizi almaz.
        </li>
        <li>
          <strong>Cihazdaki oyun verileri:</strong> Bölüm ilerlemesi, bulduğunuz kelimeler, günlük seri ve hedef,
          elmaslar ve ayarlar cihazınızda saklanır. Skor tablosu için sunucumuza giden bilgiler aşağıda yazılıdır.
        </li>
        <li>
          <strong>Reklamlar (Google AdMob):</strong> Reklamları göstermek, ölçmek ve sahtekarlığı önlemek için Google;
          cihazınızın reklam kimliğini, IP adresini (yaklaşık konum), cihaz ve uygulama bilgilerini ve reklamlarla
          etkileşimlerinizi işleyebilir. Bu veriler doğrudan Google'a gider; bizim erişimimiz yoktur.
        </li>
        <li>
          <strong>Satın almalar:</strong> Elmas paketleri ve reklamsızlık Google Play Faturalandırma ile satın alınır.
          Ödeme bilgilerinize (kart numarası vb.) hiçbir zaman erişmeyiz; uygulama yalnızca neyin satın alındığını
          Google Play'den öğrenir ve cihazda saklar (aynı satın alma iki kez sayılmasın diye satın alma belirteci dahil).
        </li>
        <li>
          <strong>Skor tablosu:</strong> Puanlarınız cihazınızda birikir ve sunucumuzdaki (wordvoya.com) Wordvoya skor tablosuna gönderilir: seçtiğiniz ad, toplam ve haftalık puanınız, ulaştığınız bölüm, bulduğunuz kelime sayısı, son bölümün süresi ve puanı. Ayrıca elmas bakiyeniz ve bitirdiğiniz her bölümün numarası, puanı, süresi ve tarihi kaydedilir; bunlar diğer oyunculara gösterilmez, yalnız oyunu yönetmek için (destek, hile denetimi ve hediye elmas) kullanılır. Bunlar cihazınızda üretilen rastgele bir kimlikle saklanır ve skor tablosunda diğer oyunculara gösterilir; gerçek adınızı, e-posta adresinizi ya da cihaz kimliğinizi istemeyiz. Sunucu, kötüye kullanımı önlemek için isteklerin IP adresini işler; bu adres skor kaydınızla birlikte saklanmaz. Kaydınızı uygulamada <em>Skor Tablosu &gt; (i) &gt; Tablodan çık</em> ile istediğiniz zaman silebilirsiniz. Google Play Games'te oturumunuz açıksa puanlarınız Play Games skor tablolarına da gönderilir; profilinizi ve oyun verilerinizi Play Games ayarlarından yönetebilirsiniz.
        </li>
      </ul>

      <h2>Reklam Tercihleriniz</h2>
      <ul>
        <li>
          <strong>Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre:</strong> Reklam göstermeden önce Google'ın onay
          formu açılır; kişiselleştirilmiş reklama izin verebilir ya da reddedebilirsiniz. Seçiminizi daha sonra
          uygulamada <em>Ayarlar &gt; Mağaza ve reklamlar &gt; Reklam gizlilik seçenekleri</em>'nden değiştirebilirsiniz.
        </li>
        <li>
          <strong>Reklam kimliği:</strong> Cihazınızın ayarlarından (Google &gt; Reklamlar) reklam kimliğinizi
          sıfırlayabilir ya da silebilirsiniz.
        </li>
        <li>
          <strong>Reklamsız oyun:</strong> "Reklamları kaldır" ya da "Reklamsız + 500 elmas" satın alması bölüm
          aralarındaki reklamları kaldırır. Ek süre ya da can için izlenen ödüllü reklamlar her zaman isteğe bağlıdır.
        </li>
      </ul>

      <h2>Verilerin Kullanımı</h2>
      <p>
        Cihazdaki veriler yalnızca oyunun çalışması için kullanılır: kaldığınız bölümü ve bulduğunuz kelimeleri
        hatırlamak, seriyi ve günlük hedefi saymak. Bu veriler bize ya da üçüncü taraflara gönderilmez ve satılmaz.
        Reklam verileri Google tarafından yukarıda anlatılan amaçlarla işlenir.
      </p>

      <h2>Üçüncü Taraf Hizmetler</h2>
      <ul>
        <li>
          <strong>Google AdMob</strong> (reklamlar): Google'ın <a href="https://policies.google.com/technologies/partner-sites?hl=tr">iş ortaklarının uygulamalarındaki veri kullanımı</a> ve <a href="https://policies.google.com/privacy?hl=tr">gizlilik politikası</a>.
        </li>
        <li>
          <strong>Google Play</strong> (dağıtım ve Faturalandırma): Google'ın gizlilik politikası geçerlidir.
        </li>
        <li>
          <strong>Android yedeklemesi:</strong> Cihazınızda Android yedeklemesi açıksa sistem, oyun verilerini Google
          hesabınızdaki yedeğe ekleyebilir ve yeni bir cihaza geri yükleyebilir. Bu yedeği Google yönetir; bizim
          erişimimiz yoktur.
        </li>
      </ul>

      <h2>Web Sitesi</h2>
      <p>
        Bu sitede <strong>Google AdSense</strong> reklamları gösterilir. Google ve iş ortakları, reklamları göstermek ve ölçmek, kişiselleştirilmiş reklamlar sunmak (bu siteye ve başka sitelere yaptığınız ziyaretlere göre) ve sahtekarlığı önlemek için çerezler ve benzeri teknolojiler kullanır. Ayrıntılar için <a href="https://policies.google.com/technologies/partner-sites?hl=tr">Google'ın, hizmetlerini kullanan sitelerden gelen verileri nasıl kullandığına</a> bakabilirsiniz. Kişiselleştirilmiş reklamları <a href="https://adssettings.google.com/">Google Reklam Ayarları</a>'ndan kapatabilir, üçüncü taraf sağlayıcıların çerez kullanımını <a href="https://www.aboutads.info/">www.aboutads.info</a> adresinden reddedebilirsiniz. Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre'de kişiselleştirilmiş reklamlar yalnızca onayınızla gösterilir.
      </p>
      <p>
        Reklamlar dışında site kendi çerezini kullanmaz ve analiz aracı yüklemez. Sunucumuz, güvenlik ve hata giderme amacıyla standart erişim kayıtlarını (IP adresi, tarayıcı bilgisi, istenen sayfa, zaman) kısa süre tutabilir; bu kayıtlar başka bir amaçla kullanılmaz.
      </p>

      <h2>Veri Saklama ve Silme</h2>
      <p>
        Oyun verileriniz cihazınızda kalır. Silmek için uygulamayı kaldırabilir ya da uygulamada <em>Ayarlar &gt; Veriler &gt; İlerlemeyi sıfırla</em> seçeneğini kullanabilirsiniz. Sunucularımızda yalnız skor tablosu kaydınız tutulur (yukarıya bakın); onu uygulamadan silebilirsiniz. Google'ın reklam için işlediği veriler Google'ın politikasına tabidir; <a href="https://myadcenter.google.com/">Google Reklam Merkezi</a>'nden yönetebilirsiniz.
      </p>

      <h2>Çocukların Gizliliği</h2>
      <p>
        Uygulama genel kitleye yöneliktir ve 13 yaş altı çocuklara yönelik değildir. 13 yaş altı çocuklardan bilerek
        kişisel veri toplamayız.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu politika güncellendiğinde yeni sürüm bu sayfada yayımlanır ve "son güncelleme" tarihi değiştirilir.
        Uygulamaya veri işleyen yeni bir özellik eklenirse bu sayfa, özellik yayına çıkmadan önce güncellenir.
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız için: <Mail />
      </p>
    </DocPage>
  );
}

function PrivacyEn() {
  return (
    <DocPage
      lang="en"
      page="privacy"
      title="Privacy Policy"
      updated="8 November 2026"
      description="Wordvoya needs no account and your game data stays on your device. Ads are served by Google AdMob in the app and Google AdSense on this site; purchases go through Google Play."
    >
      <p>
        This policy explains what data is processed when you use the <strong>Wordvoya: Word Puzzle</strong> Android app (<code>com.cranked.wordvoya</code>) and this website.
      </p>
      <p className="lead">
        <strong>In short:</strong> Wordvoya needs no account; your game data stays on your device, and only the name you choose and your game statistics are sent to our server for the leaderboard. The app shows ads from Google AdMob, and Google may use your device's advertising ID and some
        technical information to serve them. The "Remove ads" purchase is made through Google Play.
      </p>

      <h2>Data We Collect</h2>
      <ul>
        <li>
          <strong>No account:</strong> The app does not ask you to sign up or sign in, and it does not receive your name,
          email address or any other identifier.
        </li>
        <li>
          <strong>Game data on your device:</strong> Level progress, found words, the daily streak and goal, diamonds and settings are stored on your device. What is sent to our server for the leaderboard is described below.
        </li>
        <li>
          <strong>Ads (Google AdMob):</strong> To serve and measure ads and to prevent fraud, Google may process your
          device's advertising ID, IP address (approximate location), device and app information, and your interactions
          with ads. This data goes directly to Google; we have no access to it.
        </li>
        <li>
          <strong>Purchases:</strong> Diamond packs and ad removal are bought through Google Play Billing. We never have
          access to your payment details (card number etc.); the app only learns from Google Play what was bought and
          stores that on your device (including the purchase token, so the same purchase is not counted twice).
        </li>
        <li>
          <strong>Leaderboard:</strong> Your points add up on your device and are sent to the Wordvoya leaderboard on our server (wordvoya.com): the name you choose, your total and weekly points, the level you have reached, the number of words you have found, and the time and points of your last level. We also record your diamond balance and the number, points, time and date of each level you finish; these are not shown to other players and are used only to run the game (support, cheat checks and gift diamonds). They are stored with a random ID created on your device and shown to other players on the leaderboard; we do not ask for your real name, email address or device identifiers. To prevent abuse, the server processes the IP address of each request; it is not stored with your leaderboard record. You can delete your record at any time in the app under <em>Leaderboard &gt; (i) &gt; Leave the leaderboard</em>. If you are signed in to Google Play Games, your points are also sent to the Play Games leaderboards; you can manage your profile and game data in the Play Games settings.
        </li>
      </ul>

      <h2>Your Ad Choices</h2>
      <ul>
        <li>
          <strong>European Economic Area, United Kingdom and Switzerland:</strong> Before any ad is shown, Google's
          consent form appears and you can allow or refuse personalised ads. You can change your choice later in the app
          under <em>Settings &gt; Shop and ads &gt; Ad privacy options</em>.
        </li>
        <li>
          <strong>Advertising ID:</strong> You can reset or delete your advertising ID in your device settings (Google
          &gt; Ads).
        </li>
        <li>
          <strong>Ad-free play:</strong> The "Remove ads" or "No ads + 500 diamonds" purchase removes the ads between
          levels. Rewarded ads for extra time or a life are always optional.
        </li>
      </ul>

      <h2>How the Data Is Used</h2>
      <p>
        The data on your device is used only to run the game: to remember your current level and the words you found, and
        to count your streak and daily goal. It is never sent to us or to third parties and is never sold. Ad data is
        processed by Google for the purposes described above.
      </p>

      <h2>Third-Party Services</h2>
      <ul>
        <li>
          <strong>Google AdMob</strong> (ads): see <a href="https://policies.google.com/technologies/partner-sites">how Google uses data from partner apps</a> and Google's <a href="https://policies.google.com/privacy">privacy policy</a>.
        </li>
        <li>
          <strong>Google Play</strong> (distribution and Billing): Google's privacy policy applies.
        </li>
        <li>
          <strong>Android backup:</strong> If Android backup is turned on, the system may include your game data in your
          Google account backup and restore it on a new device. Google manages that backup; we have no access to it.
        </li>
      </ul>

      <h2>This Website</h2>
      <p>
        This site shows ads from <strong>Google AdSense</strong>. Google and its partners use cookies and similar technologies to show and measure ads, to serve personalized ads (based on your visits to this and other websites) and to prevent fraud. See <a href="https://policies.google.com/technologies/partner-sites">how Google uses information from sites that use its services</a>. You can turn off personalized ads in <a href="https://adssettings.google.com/">Google Ads Settings</a> and opt out of third-party vendors' use of cookies at <a href="https://www.aboutads.info/">www.aboutads.info</a>. In the European Economic Area, the United Kingdom and Switzerland, personalized ads are shown only with your consent.
      </p>
      <p>
        Apart from the ads, the site sets no cookies of its own and loads no analytics. Our server may keep standard access logs (IP address, browser information, requested page, time) for a short period for security and troubleshooting; they are not used for anything else.
      </p>

      <h2>Data Retention and Deletion</h2>
      <p>
        Your game data stays on your device. To delete it, uninstall the app or use <em>Settings &gt; Data &gt; Reset progress</em> in the app. The only record we keep about you on our servers is your leaderboard record (see above), which you can delete in the app. Data processed by Google
        for ads is subject to Google's policies; you can manage it in <a href="https://myadcenter.google.com/">My Ad Center</a>.
      </p>

      <h2>Children's Privacy</h2>
      <p>
        The app is intended for a general audience and is not directed at children under 13. We do not knowingly collect
        personal data from children under 13.
      </p>

      <h2>Changes</h2>
      <p>
        When this policy changes, the new version is published on this page and the "last updated" date is changed. If a
        new feature that processes data is added to the app, this page will be updated before that feature is released.
      </p>

      <h2>Contact</h2>
      <p>
        For questions: <Mail />
      </p>
    </DocPage>
  );
}

// tr/en asıl metin; öbür diller çeviri (legal/<dil>.tsx, başında "farklılıkta İngilizcesi geçerli" notu)
const CEVIRI = { de, fr, es, it, pt, ru, nl, pl, ja, ko, ar, fa, hi };

export default function Privacy({ lang }: { lang: Lang }) {
  if (lang === 'tr') return <PrivacyTr />;
  if (lang === 'en') return <PrivacyEn />;
  const Ceviri = CEVIRI[lang].Privacy;
  return <Ceviri />;
}
