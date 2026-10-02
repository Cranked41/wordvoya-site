// Kullanım şartları.
// JSX'te satır sonu ile etiket arasındaki boşluk düşer: metinle bağlantıyı aynı satırda tut.
import { DocPage, Mail } from '../Layout';
import { PATHS, type Lang } from '../site';
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

function TermsTr() {
  return (
    <DocPage
      lang="tr"
      page="terms"
      title="Kullanım Şartları"
      updated="2 Ekim 2026"
      description="Wordvoya: Kelime Bulmacası uygulamasının kullanım şartları."
    >
      <p>
        <strong>Wordvoya: Kelime Bulmacası</strong> uygulamasını indirerek veya kullanarak aşağıdaki şartları kabul
        etmiş olursunuz.
      </p>

      <h2>Lisans</h2>
      <p>
        Uygulama, kişisel ve ticari olmayan kullanım için size sınırlı ve devredilemez bir lisansla sunulur. Uygulamayı
        kopyalamak, değiştirmek, tersine mühendislik yapmak veya yeniden dağıtmak yasaktır. Aşağıda belirtilen açık
        lisanslı kelime içeriği bu yasağın dışındadır.
      </p>

      <h2>Kelime İçeriği ve Kaynaklar</h2>
      <ul>
        <li>
          Kelime anlamları, <a href="https://www.wiktionary.org/">Vikisözlük</a> katkıcılarının çalışmasından uyarlanmıştır: her bulmaca dilinin kendi Vikisözlük'ü ve İngilizce Vikisözlük, büyük ölçüde <a href="https://kaikki.org/">kaikki.org</a> çıkarımı aracılığıyla.
        </li>
        <li>
          Kelime sıklıkları <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (OpenSubtitles) ve <a href="https://github.com/rspeer/wordfreq">wordfreq</a> listelerinden alınmıştır.
        </li>
        <li>
          Bu kaynaklardan türetilen kelime listeleri ve bölüm paketleri <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.tr">CC BY-SA 4.0</a> lisansıyla sunulur. Uygulamanın kodu, tasarımı ve Wordvoya adı bu lisansa tabi değildir.
        </li>
        <li>
          Anlamlar tek tek gözden geçirilmiştir; yine de eksiksiz veya hatasız oldukları garanti edilmez. Uygulama eğlence
          amaçlıdır, resmî bir sözlüğün yerine geçmez. Hatalı bir kelime görürseniz bize yazın.
        </li>
      </ul>

      <h2>Elmaslar</h2>
      <p>
        Elmaslar yalnızca oyun içinde ipucu ve süreli bölümlerde ek süre almak için kullanılan sanal öğelerdir. Google
        Play üzerinden satın alarak edinilir ve yeni oyuncular 100 elmasla başlar; oynamak (kelime bulmak ve bölüm
        bitirmek) elmas değil puan kazandırır, reklam izleyerek de elmas kazanılmaz. Parasal değerleri yoktur, nakde
        çevrilemez, iade edilemez (yasaların zorunlu kıldığı durumlar ve
        Google Play'in iade kuralları saklıdır) ve başkasına devredilemez.
      </p>
      <p>
        Elmaslar yalnızca cihazınızda saklanır; hesap olmadığı için başka bir cihaza aktarılmaz. İlerlemeyi sıfırlamak
        elmasları silmez, ancak uygulamayı kaldırmak ya da uygulama verilerini silmek satın alınanlar dahil tüm elmasları
        siler ve bunlar geri yüklenemez.
      </p>

      <h2>Reklamlar</h2>
      <p>
        Uygulama ücretsizdir ve Google AdMob reklamlarıyla desteklenir: bazı bölüm aralarında tam ekran reklam
        gösterilebilir, ek süre ya da can için ödüllü reklam izlemek ise isteğe bağlıdır. Reklamların içeriğinden
        reklamveren ve Google sorumludur. Reklam bağlantılarından gidilen sitelerin ve uygulamaların kendi şartları
        geçerlidir.
      </p>

      <h2>Satın Almalar</h2>
      <p>
        Tüm satın almalar uygulamadaki <em>Mağaza</em>'dan Google Play üzerinden yapılır; ödeme, iade ve fatura işlemleri
        Google Play'in şartlarına tabidir.
      </p>
      <ul>
        <li>
          <strong>Elmas paketleri</strong> tüketilir: satın alınan elmas hemen bakiyenize eklenir ve harcandıkça biter.
          Elmaslar cihazda saklandığı için uygulamayı kaldırınca geri yüklenmez (bkz. Elmaslar).
        </li>
        <li>
          <strong>"Reklamları kaldır"</strong> ve <strong>"Reklamsız + 500 elmas"</strong> tek seferlik satın almalardır;
          bölüm aralarındaki reklamları kaldırır. İsteğe bağlı ödüllü reklamlar ek süre ya da can isteyenler için kalır.
          Reklamsızlık Google hesabınıza bağlıdır; uygulamayı yeniden yüklediğinizde ya da yeni bir cihazda <em>Mağaza &gt; Satın alımları geri yükle</em> ile geri alabilirsiniz (paketteki 500 elmas bir kez verilir).
        </li>
      </ul>

      <h2>Hizmetin Sürekliliği</h2>
      <p>
        Uygulamanın kesintisiz veya hatasız çalışacağı garanti edilmez. Özellikler, bölümler ve kelime içeriği önceden
        bildirilmeksizin eklenebilir, değiştirilebilir veya kaldırılabilir.
      </p>

      <h2>Sorumluluk Sınırı</h2>
      <p>
        Uygulama "olduğu gibi" sunulur. Yürürlükteki yasaların izin verdiği ölçüde, uygulamanın kullanımından doğan
        dolaylı zararlardan geliştirici sorumlu tutulamaz.
      </p>

      <h2>Gizlilik</h2>
      <p>
        Uygulama hesap istemez ve oyun verileriniz cihazınızda kalır; reklamlar için Google'ın işlediği veriler dahil
        ayrıntılar <a href={PATHS.tr.privacy}>Gizlilik Politikası</a>'nda yer alır.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu şartlar güncellendiğinde yeni sürüm bu sayfada yayımlanır. Güncellemeden sonra uygulamayı kullanmaya devam
        etmeniz, yeni şartları kabul ettiğiniz anlamına gelir.
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız ve hatalı kelime bildirimleriniz için: <Mail />
      </p>
    </DocPage>
  );
}

function TermsEn() {
  return (
    <DocPage
      lang="en"
      page="terms"
      title="Terms of Use"
      updated="2 October 2026"
      description="Terms of use for the Wordvoya: Word Puzzle app."
    >
      <p>
        By downloading or using the <strong>Wordvoya: Word Puzzle</strong> app, you agree to the following terms.
      </p>

      <h2>License</h2>
      <p>
        The app is provided to you under a limited, non-transferable license for personal, non-commercial use. You may
        not copy, modify, reverse engineer or redistribute the app. The openly licensed word content described below is
        excluded from this restriction.
      </p>

      <h2>Word Content and Sources</h2>
      <ul>
        <li>
          Word meanings are adapted from the work of <a href="https://www.wiktionary.org/">Wiktionary</a> contributors: each puzzle language's own Wiktionary and the English Wiktionary, mostly via the <a href="https://kaikki.org/">kaikki.org</a> extraction.
        </li>
        <li>
          Word frequencies come from the <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (OpenSubtitles) and <a href="https://github.com/rspeer/wordfreq">wordfreq</a> lists.
        </li>
        <li>
          The word lists and level packs derived from these sources are provided under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. The app's code, design and the Wordvoya name are not covered by that license.
        </li>
        <li>
          Meanings were reviewed one by one, but they are not guaranteed to be complete or error-free. The app is meant
          for entertainment and is not a substitute for an official dictionary. If you spot a wrong word, please tell us.
        </li>
      </ul>

      <h2>Diamonds</h2>
      <p>
        Diamonds are virtual items used only in the game, for hints and for extra time in timed levels. You get them
        by buying them through Google Play, and new players start with 100 diamonds; playing (finding words and
        finishing levels) earns points, not diamonds, and ads do not give diamonds. They have
        no monetary value, cannot be exchanged for cash, are non-refundable (except where the law requires otherwise and
        subject to Google Play's refund policies) and cannot be transferred to anyone else.
      </p>
      <p>
        Diamonds are stored only on your device; as there is no account, they cannot be moved to another device.
        Resetting progress keeps your diamonds, but uninstalling the app or clearing its data deletes all diamonds,
        including purchased ones, and they cannot be restored.
      </p>

      <h2>Ads</h2>
      <p>
        The app is free and supported by Google AdMob ads: a full-screen ad may be shown between some levels, and watching
        a rewarded ad for extra time or a life is always optional. Advertisers and Google are responsible for the content
        of the ads. Sites and apps you reach through an ad are governed by their own terms.
      </p>

      <h2>Purchases</h2>
      <p>
        All purchases are made in the app's <em>Shop</em> through Google Play; payment, refunds and billing are subject to
        Google Play's terms.
      </p>
      <ul>
        <li>
          <strong>Diamond packs</strong> are consumable: the diamonds are added to your balance right away and are used up
          as you spend them. Because diamonds are stored on your device, they are not restored after uninstalling the app
          (see Diamonds).
        </li>
        <li>
          <strong>"Remove ads"</strong> and <strong>"No ads + 500 diamonds"</strong> are one-time purchases that remove
          the ads between levels. Optional rewarded ads remain for anyone who wants extra time or a life. Ad removal is
          tied to your Google account, and after reinstalling the app or on a new device you can get it back under <em>Shop &gt; Restore purchases</em> (the 500 diamonds in the bundle are given once).
        </li>
      </ul>

      <h2>Availability</h2>
      <p>
        We do not guarantee that the app will run without interruption or errors. Features, levels and word content may
        be added, changed or removed without prior notice.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        The app is provided "as is". To the extent permitted by applicable law, the developer is not liable for indirect
        damages arising from the use of the app.
      </p>

      <h2>Privacy</h2>
      <p>
        The app needs no account and your game data stays on your device; see the <a href={PATHS.en.privacy}>Privacy Policy</a> for details, including the data Google processes for ads.
      </p>

      <h2>Changes</h2>
      <p>
        When these terms change, the new version is published on this page. Continuing to use the app after an update
        means you accept the new terms.
      </p>

      <h2>Contact</h2>
      <p>
        For questions and to report a wrong word: <Mail />
      </p>
    </DocPage>
  );
}

// tr/en asıl metin; öbür diller çeviri (legal/<dil>.tsx, başında "farklılıkta İngilizcesi geçerli" notu)
const CEVIRI = { de, fr, es, it, pt, ru, nl, pl, ja, ko, ar, fa, hi };

export default function Terms({ lang }: { lang: Lang }) {
  if (lang === 'tr') return <TermsTr />;
  if (lang === 'en') return <TermsEn />;
  const Ceviri = CEVIRI[lang].Terms;
  return <Ceviri />;
}
