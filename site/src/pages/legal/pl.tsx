// Gizlilik politikası ve kullanım şartları: Lehçe çevirisi (kaynak: Privacy.tsx / Terms.tsx İngilizce).
// JSX'te satır sonu ile etiket arasındaki boşluk düşer: metinle bağlantıyı aynı satırda tut.
import { DocPage, Mail } from '../../Layout';
import { PATHS } from '../../site';

export function Privacy() {
  return (
    <DocPage
      lang="pl"
      page="privacy"
      title="Polityka prywatności"
      updated="30 września 2026"
      description="Wordvoya nie wymaga konta, a dane z gry pozostają na Państwa urządzeniu. Reklamy wyświetla Google AdMob, a zakupy odbywają się przez Google Play."
    >
      <p className="note">
        Jest to tłumaczenie udostępnione dla wygody; w razie rozbieżności z <a href={PATHS.en.privacy}>wersją angielską</a> pierwszeństwo ma wersja angielska.
      </p>
      <p>
        Niniejsza polityka wyjaśnia, jakie dane są przetwarzane podczas korzystania z aplikacji <strong>Wordvoya: Łamigłówka słowna</strong> na Androida (<code>com.cranked.wordvoya</code>) oraz z tej strony internetowej.
      </p>
      <p className="lead">
        <strong>W skrócie:</strong> Wordvoya nie wymaga konta i nie wysyła danych na nasze serwery; dane z gry pozostają
        na Państwa urządzeniu. Aplikacja wyświetla reklamy Google AdMob, a Google może wykorzystywać do ich wyświetlania
        identyfikator reklamowy Państwa urządzenia oraz niektóre informacje techniczne. Zakup opcji „Usuń reklamy” odbywa się przez Google Play.
      </p>

      <h2>Jakie dane zbieramy</h2>
      <ul>
        <li>
          <strong>Brak konta:</strong> aplikacja nie wymaga rejestracji ani logowania i nie otrzymuje Państwa imienia,
          adresu e-mail ani żadnego innego identyfikatora.
        </li>
        <li>
          <strong>Dane z gry na urządzeniu:</strong> postępy na poziomach, znalezione słowa, dzienna seria i cel, diamenty
          oraz ustawienia są przechowywane wyłącznie na Państwa urządzeniu i nie są do nas wysyłane.
        </li>
        <li>
          <strong>Reklamy (Google AdMob):</strong> w celu wyświetlania i mierzenia skuteczności reklam oraz zapobiegania
          nadużyciom Google może przetwarzać identyfikator reklamowy Państwa urządzenia, adres IP (przybliżoną lokalizację),
          informacje o urządzeniu i aplikacji oraz Państwa interakcje z reklamami. Dane te trafiają bezpośrednio do Google;
          nie mamy do nich dostępu.
        </li>
        <li>
          <strong>Zakupy:</strong> pakiety diamentów i usunięcie reklam kupuje się przez Google Play Billing. Nigdy nie
          mamy dostępu do Państwa danych płatniczych (numeru karty itp.); aplikacja jedynie dowiaduje się od Google Play, co
          zostało kupione, i zapisuje tę informację na Państwa urządzeniu (łącznie z tokenem zakupu, aby ten sam zakup nie
          został policzony dwukrotnie).
        </li>
        <li>
          <strong>Ranking (Google Play Games, opcjonalnie):</strong> Państwa punkty sumują się na urządzeniu. Jeśli
          zalogują się Państwo w Google Play Games, łączna i tygodniowa liczba punktów, osiągnięty poziom, liczba
          znalezionych słów oraz czas ukończenia ostatniego poziomu są wysyłane do Google wraz z nazwą Państwa profilu Play
          Games i pokazywane innym graczom w rankingu. Jeśli nie zalogują się Państwo, nic z tego nie jest wysyłane.
          W ustawieniach Play Games mogą Państwo decydować, kto widzi Państwa profil, oraz usuwać swoje dane z gry.
        </li>
      </ul>

      <h2>Państwa wybory dotyczące reklam</h2>
      <ul>
        <li>
          <strong>Europejski Obszar Gospodarczy, Wielka Brytania i Szwajcaria:</strong> przed wyświetleniem jakiejkolwiek
          reklamy pojawia się formularz zgody Google, w którym mogą Państwo zezwolić na reklamy spersonalizowane lub je
          odrzucić. Swój wybór można później zmienić w aplikacji w sekcji <em>Ustawienia &gt; Sklep i reklamy &gt; Opcje prywatności reklam</em>.
        </li>
        <li>
          <strong>Identyfikator reklamowy:</strong> w ustawieniach urządzenia (Google &gt; Reklamy) mogą Państwo
          zresetować lub usunąć swój identyfikator reklamowy.
        </li>
        <li>
          <strong>Gra bez reklam:</strong> zakup „Usuń reklamy” lub „Bez reklam + diamenty: 500” usuwa reklamy między
          poziomami. Reklamy z nagrodą, dające dodatkowy czas lub życie, są zawsze opcjonalne.
        </li>
      </ul>

      <h2>Jak wykorzystujemy dane</h2>
      <p>
        Dane na Państwa urządzeniu służą wyłącznie do działania gry: do zapamiętywania bieżącego poziomu i znalezionych
        słów oraz do liczenia serii i dziennego celu. Nigdy nie są wysyłane do nas ani do osób trzecich i nigdy nie są
        sprzedawane. Dane reklamowe są przetwarzane przez Google w celach opisanych powyżej.
      </p>

      <h2>Usługi podmiotów trzecich</h2>
      <ul>
        <li>
          <strong>Google AdMob</strong> (reklamy): zob. <a href="https://policies.google.com/technologies/partner-sites?hl=pl">jak Google wykorzystuje dane z aplikacji partnerów</a> oraz <a href="https://policies.google.com/privacy?hl=pl">politykę prywatności</a> Google.
        </li>
        <li>
          <strong>Google Play</strong> (dystrybucja i Billing): obowiązuje polityka prywatności Google.
        </li>
        <li>
          <strong>Kopia zapasowa Androida:</strong> jeśli kopia zapasowa Androida jest włączona, system może uwzględnić
          dane z gry w kopii zapasowej konta Google i przywrócić je na nowym urządzeniu. Kopią tą zarządza Google; nie mamy
          do niej dostępu.
        </li>
      </ul>

      <h2>Ta strona internetowa</h2>
      <p>
        Ta strona nie używa plików cookie i nie ładuje zasobów podmiotów trzecich (czcionek, narzędzi analitycznych ani
        reklam). Nasz serwer może przez krótki czas przechowywać standardowe dzienniki dostępu (adres IP, informacje
        o przeglądarce, żądaną stronę, czas) ze względów bezpieczeństwa i w celu usuwania usterek; nie są one wykorzystywane
        do żadnych innych celów.
      </p>

      <h2>Przechowywanie i usuwanie danych</h2>
      <p>
        Dane z gry pozostają na Państwa urządzeniu. Aby je usunąć, należy odinstalować aplikację lub skorzystać w aplikacji z opcji <em>Ustawienia &gt; Dane &gt; Zresetuj postępy</em>. Nie przechowujemy na naszych serwerach żadnego konta ani zapisu gry dotyczącego Państwa. Dane przetwarzane przez Google
        na potrzeby reklam podlegają zasadom Google; można nimi zarządzać w <a href="https://myadcenter.google.com/">Moim Centrum reklam</a>.
      </p>

      <h2>Prywatność dzieci</h2>
      <p>
        Aplikacja jest przeznaczona dla ogółu odbiorców i nie jest skierowana do dzieci poniżej 13. roku życia. Nie
        zbieramy świadomie danych osobowych od dzieci poniżej 13. roku życia.
      </p>

      <h2>Zmiany</h2>
      <p>
        W razie zmiany niniejszej polityki nowa wersja jest publikowana na tej stronie, a data „ostatniej aktualizacji”
        ulega zmianie. Jeśli do aplikacji zostanie dodana nowa funkcja przetwarzająca dane, strona ta zostanie
        zaktualizowana przed udostępnieniem tej funkcji.
      </p>

      <h2>Kontakt</h2>
      <p>
        W razie pytań: <Mail />
      </p>
    </DocPage>
  );
}

export function Terms() {
  return (
    <DocPage
      lang="pl"
      page="terms"
      title="Warunki korzystania"
      updated="1 października 2026"
      description="Warunki korzystania z aplikacji Wordvoya: Łamigłówka słowna."
    >
      <p className="note">
        Jest to tłumaczenie udostępnione dla wygody; w razie rozbieżności z <a href={PATHS.en.terms}>wersją angielską</a> pierwszeństwo ma wersja angielska.
      </p>
      <p>
        Pobierając lub używając aplikacji <strong>Wordvoya: Łamigłówka słowna</strong>, akceptują Państwo poniższe warunki.
      </p>

      <h2>Licencja</h2>
      <p>
        Aplikacja jest udostępniana Państwu na podstawie ograniczonej, niezbywalnej licencji do użytku osobistego,
        niekomercyjnego. Nie wolno kopiować, modyfikować, poddawać inżynierii wstecznej ani ponownie rozpowszechniać
        aplikacji. Opisana poniżej zawartość słownikowa objęta otwartą licencją jest wyłączona z tego ograniczenia.
      </p>

      <h2>Zawartość słownikowa i źródła</h2>
      <ul>
        <li>
          Znaczenia słów zaadaptowano z pracy współtwórców <a href="https://www.wiktionary.org/">Wikisłownika</a>: własnego Wikisłownika każdego języka łamigłówek oraz angielskiego Wikisłownika, głównie za pośrednictwem danych wyodrębnionych przez <a href="https://kaikki.org/">kaikki.org</a>.
        </li>
        <li>
          Częstotliwość słów pochodzi z list <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (OpenSubtitles) i <a href="https://github.com/rspeer/wordfreq">wordfreq</a>.
        </li>
        <li>
          Listy słów i pakiety poziomów utworzone na podstawie tych źródeł są udostępniane na licencji <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pl">CC BY-SA 4.0</a>. Kod aplikacji, jej projekt graficzny i nazwa Wordvoya nie są objęte tą licencją.
        </li>
        <li>
          Znaczenia sprawdzano pojedynczo, jednak nie gwarantujemy ich kompletności ani bezbłędności. Aplikacja służy
          rozrywce i nie zastępuje oficjalnego słownika. Jeśli zauważą Państwo błędne słowo, prosimy o informację.
        </li>
      </ul>

      <h2>Diamenty</h2>
      <p>
        Diamenty to wirtualne przedmioty używane wyłącznie w grze: do podpowiedzi i do uzyskiwania dodatkowego czasu na
        poziomach z limitem czasu. Zdobywa się je, grając (nagrody za słowa dodatkowe; ukończenie poziomu daje punkty, a nie diamenty), lub kupując przez Google Play; reklamy nie dają diamentów. Nie mają
        wartości pieniężnej, nie można ich wymienić na gotówkę, nie podlegają zwrotowi (z wyjątkiem sytuacji, w których
        wymaga tego prawo, i z zastrzeżeniem zasad zwrotów Google Play) i nie mogą być przekazywane innym osobom.
      </p>
      <p>
        Diamenty są przechowywane wyłącznie na Państwa urządzeniu; ponieważ nie ma konta, nie można ich przenieść na inne
        urządzenie. Zresetowanie postępów nie usuwa diamentów, ale odinstalowanie aplikacji lub wyczyszczenie jej danych
        usuwa wszystkie diamenty, także zakupione, i nie można ich przywrócić.
      </p>

      <h2>Reklamy</h2>
      <p>
        Aplikacja jest bezpłatna i finansowana z reklam Google AdMob: między niektórymi poziomami może pojawić się reklama
        pełnoekranowa, a obejrzenie reklamy z nagrodą w zamian za dodatkowy czas lub życie jest zawsze dobrowolne. Za treść
        reklam odpowiadają reklamodawcy i Google. Witryny i aplikacje, do których prowadzi reklama, podlegają własnym
        warunkom.
      </p>

      <h2>Zakupy</h2>
      <p>
        Wszystkie zakupy są dokonywane w <em>Sklepie</em> aplikacji przez Google Play; płatności, zwroty i rozliczenia podlegają warunkom
        Google Play.
      </p>
      <ul>
        <li>
          <strong>Pakiety diamentów</strong> są zużywalne: diamenty są od razu dodawane do salda i ubywają w miarę ich
          wydawania. Ponieważ diamenty są przechowywane na urządzeniu, po odinstalowaniu aplikacji nie są przywracane
          (zob. Diamenty).
        </li>
        <li>
          <strong>„Usuń reklamy”</strong> i <strong>„Bez reklam + diamenty: 500”</strong> to zakupy jednorazowe, które usuwają
          reklamy między poziomami. Opcjonalne reklamy z nagrodą pozostają dla każdego, kto chce uzyskać dodatkowy czas lub życie. Usunięcie reklam
          jest powiązane z kontem Google, a po ponownej instalacji aplikacji lub na nowym urządzeniu można je odzyskać w <em>Sklep &gt; Przywróć zakupy</em> (500 diamentów z pakietu przyznaje się jednorazowo).
        </li>
      </ul>

      <h2>Dostępność</h2>
      <p>
        Nie gwarantujemy, że aplikacja będzie działać bez przerw i błędów. Funkcje, poziomy i zawartość słownikowa mogą
        być dodawane, zmieniane lub usuwane bez wcześniejszego powiadomienia.
      </p>

      <h2>Ograniczenie odpowiedzialności</h2>
      <p>
        Aplikacja jest udostępniana w stanie „takim, w jakim jest”. W zakresie dozwolonym przez obowiązujące prawo
        deweloper nie ponosi odpowiedzialności za szkody pośrednie wynikające z korzystania z aplikacji.
      </p>

      <h2>Prywatność</h2>
      <p>
        Aplikacja nie wymaga konta, a dane z gry pozostają na Państwa urządzeniu; szczegóły, w tym dane przetwarzane przez Google na potrzeby reklam, zawiera <a href={PATHS.pl.privacy}>Polityka prywatności</a>.
      </p>

      <h2>Zmiany</h2>
      <p>
        W razie zmiany niniejszych warunków nowa wersja jest publikowana na tej stronie. Dalsze korzystanie z aplikacji po
        aktualizacji oznacza akceptację nowych warunków.
      </p>

      <h2>Kontakt</h2>
      <p>
        W razie pytań oraz w celu zgłoszenia błędnego słowa: <Mail />
      </p>
    </DocPage>
  );
}
