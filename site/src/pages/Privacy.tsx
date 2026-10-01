// Gizlilik politikası (uygulamanın Ayarlar ekranı bu sayfaya bağlanır).
// JSX'te satır sonu ile etiket arasındaki boşluk düşer: metinle bağlantıyı aynı satırda tut.
import { DocPage, Mail } from '../Layout';
import type { Lang } from '../site';

function PrivacyTr() {
  return (
    <DocPage
      lang="tr"
      page="privacy"
      title="Gizlilik Politikası"
      updated="30 Eylül 2026"
      description="Wordvoya hesap istemez; oyun verilerin cihazında kalır. Reklamlar Google AdMob ile gösterilir, satın almalar Google Play üzerinden yapılır."
    >
      <p>
        Bu politika, <strong>Wordvoya: Kelime Bulmacası</strong> Android uygulamasını (<code>com.cranked.wordvoya</code>) ve bu web sitesini kullandığınızda hangi verilerin işlendiğini açıklar.
      </p>
      <p className="lead">
        <strong>Kısaca:</strong> Wordvoya hesap istemez ve bizim sunucularımıza veri göndermez; oyun verileriniz
        cihazınızda kalır. Uygulamada Google AdMob reklamları gösterilir; Google, reklamlar için cihazınızın reklam
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
          elmaslar ve ayarlar yalnızca cihazınızda saklanır; bize gönderilmez.
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
          <strong>Skor tablosu (Google Play Games, isteğe bağlı):</strong> Puanlarınız cihazınızda birikir. Google Play
          Games ile oturum açarsanız toplam ve haftalık puanınız, ulaştığınız bölüm, bulduğunuz kelime sayısı ve son
          bölümü bitirme süreniz Play Games profil adınızla birlikte Google'a gönderilir ve skor tablosunda diğer
          oyunculara gösterilir. Oturum açmazsanız hiçbiri gönderilmez. Profilinizin kimlere görüneceğini Play Games
          ayarlarından yönetebilir, oyun verilerinizi oradan silebilirsiniz.
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
        Bu site çerez kullanmaz ve üçüncü taraf kaynak (yazı tipi, analiz, reklam) yüklemez. Sunucumuz, güvenlik ve hata
        giderme amacıyla standart erişim kayıtlarını (IP adresi, tarayıcı bilgisi, istenen sayfa, zaman) kısa süre
        tutabilir; bu kayıtlar başka bir amaçla kullanılmaz.
      </p>

      <h2>Veri Saklama ve Silme</h2>
      <p>
        Oyun verileriniz cihazınızda kalır. Silmek için uygulamayı kaldırabilir ya da uygulamada <em>Ayarlar &gt; Veriler &gt; İlerlemeyi sıfırla</em> seçeneğini kullanabilirsiniz. Sunucularımızda size ait bir
        hesap ya da oyun kaydı tutulmaz. Google'ın reklam için işlediği veriler Google'ın politikasına tabidir; <a href="https://myadcenter.google.com/">Google Reklam Merkezi</a>'nden yönetebilirsiniz.
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
      updated="30 September 2026"
      description="Wordvoya needs no account and your game data stays on your device. Ads are served by Google AdMob and purchases go through Google Play."
    >
      <p>
        This policy explains what data is processed when you use the <strong>Wordvoya: Word Puzzle</strong> Android app (<code>com.cranked.wordvoya</code>) and this website.
      </p>
      <p className="lead">
        <strong>In short:</strong> Wordvoya needs no account and sends no data to our servers; your game data stays on
        your device. The app shows ads from Google AdMob, and Google may use your device's advertising ID and some
        technical information to serve them. The "Remove ads" purchase is made through Google Play.
      </p>

      <h2>Data We Collect</h2>
      <ul>
        <li>
          <strong>No account:</strong> The app does not ask you to sign up or sign in, and it does not receive your name,
          email address or any other identifier.
        </li>
        <li>
          <strong>Game data on your device:</strong> Level progress, found words, the daily streak and goal, diamonds and
          settings are stored only on your device and are not sent to us.
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
          <strong>Leaderboard (Google Play Games, optional):</strong> Your points add up on your device. If you sign in
          with Google Play Games, your total and weekly points, the level you have reached, the number of words you have
          found and the time you took to finish your last level are sent to Google together with your Play Games profile
          name and shown to other players on the leaderboard. If you do not sign in, none of this is sent. You can control
          who sees your profile, and delete your game data, in the Play Games settings.
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
        This site does not use cookies and loads no third-party resources (fonts, analytics or ads). Our server may keep
        standard access logs (IP address, browser information, requested page, time) for a short period for security and
        troubleshooting; they are not used for anything else.
      </p>

      <h2>Data Retention and Deletion</h2>
      <p>
        Your game data stays on your device. To delete it, uninstall the app or use <em>Settings &gt; Data &gt; Reset progress</em> in the app. We keep no account or game records about you on our servers. Data processed by Google
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

export default function Privacy({ lang }: { lang: Lang }) {
  return lang === 'tr' ? <PrivacyTr /> : <PrivacyEn />;
}
