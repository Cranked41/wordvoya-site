// Gizlilik politikası ve kullanım şartları: Felemenkçe çevirisi (kaynak: Privacy.tsx / Terms.tsx İngilizce).
// JSX'te satır sonu ile etiket arasındaki boşluk düşer: metinle bağlantıyı aynı satırda tut.
import { DocPage, Mail } from '../../Layout';
import { PATHS } from '../../site';

export function Privacy() {
  return (
    <DocPage
      lang="nl"
      page="privacy"
      title="Privacybeleid"
      updated="30 september 2026"
      description="Wordvoya heeft geen account nodig en uw spelgegevens blijven op uw apparaat. Advertenties worden getoond via Google AdMob en aankopen lopen via Google Play."
    >
      <p className="note">
        Dit is een vertaling die voor het gemak wordt aangeboden; als deze afwijkt van de <a href={PATHS.en.privacy}>Engelse versie</a>, prevaleert de Engelse versie.
      </p>
      <p>
        Dit beleid legt uit welke gegevens worden verwerkt wanneer u de Android-app <strong>Wordvoya: Woordpuzzel</strong> (<code>com.cranked.wordvoya</code>) en deze website gebruikt.
      </p>
      <p className="lead">
        <strong>Kort samengevat:</strong> Wordvoya heeft geen account nodig en stuurt geen gegevens naar onze servers;
        uw spelgegevens blijven op uw apparaat. De app toont advertenties van Google AdMob en Google kan het
        advertentie-ID van uw apparaat en enige technische informatie gebruiken om ze te tonen. De aankoop
        “Advertenties verwijderen” verloopt via Google Play.
      </p>

      <h2>Gegevens die we verzamelen</h2>
      <ul>
        <li>
          <strong>Geen account:</strong> De app vraagt u niet om u te registreren of in te loggen en ontvangt uw naam,
          e-mailadres of enige andere identificatiegegevens niet.
        </li>
        <li>
          <strong>Spelgegevens op uw apparaat:</strong> Voortgang in levels, gevonden woorden, de dagelijkse reeks en het
          dagdoel, diamanten en instellingen worden alleen op uw apparaat opgeslagen en niet naar ons verzonden.
        </li>
        <li>
          <strong>Advertenties (Google AdMob):</strong> Om advertenties te tonen en te meten en om fraude te voorkomen,
          kan Google het advertentie-ID van uw apparaat, uw IP-adres (bij benadering uw locatie), apparaat- en
          app-informatie en uw interacties met advertenties verwerken. Deze gegevens gaan rechtstreeks naar Google; wij
          hebben er geen toegang toe.
        </li>
        <li>
          <strong>Aankopen:</strong> Diamantenpakketten en het verwijderen van advertenties worden gekocht via Google Play
          Billing. Wij hebben nooit toegang tot uw betaalgegevens (kaartnummer enz.); de app krijgt alleen van Google
          Play te horen wat er is gekocht en slaat dat op uw apparaat op (inclusief de aankooptoken, zodat dezelfde
          aankoop niet twee keer wordt geteld).
        </li>
        <li>
          <strong>Ranglijst (Google Play Games, optioneel):</strong> Uw punten worden opgeteld op uw apparaat. Als u zich
          aanmeldt bij Google Play Games, worden uw totale en wekelijkse punten, het level dat u hebt bereikt, het aantal
          woorden dat u hebt gevonden en de tijd die u nodig had om uw laatste level te voltooien samen met de naam van
          uw Play Games-profiel naar Google verzonden en aan andere spelers getoond op de ranglijst. Als u zich niet
          aanmeldt, wordt hiervan niets verzonden. In de instellingen van Play Games kunt u bepalen wie uw profiel ziet
          en uw spelgegevens verwijderen.
        </li>
      </ul>

      <h2>Uw advertentiekeuzes</h2>
      <ul>
        <li>
          <strong>Europese Economische Ruimte, Verenigd Koninkrijk en Zwitserland:</strong> Voordat er een advertentie
          wordt getoond, verschijnt het toestemmingsformulier van Google en kunt u gepersonaliseerde advertenties
          toestaan of weigeren. U kunt uw keuze later wijzigen in de app via <em>Instellingen &gt; Winkel en advertenties &gt; Privacyopties voor advertenties</em>.
        </li>
        <li>
          <strong>Advertentie-ID:</strong> U kunt uw advertentie-ID resetten of verwijderen in de instellingen van uw
          apparaat (Google &gt; Advertenties).
        </li>
        <li>
          <strong>Spelen zonder advertenties:</strong> De aankoop “Advertenties verwijderen” of “Geen advertenties + 500
          diamanten” verwijdert de advertenties tussen levels. Advertenties met beloning voor extra tijd of een leven
          zijn altijd optioneel.
        </li>
      </ul>

      <h2>Hoe de gegevens worden gebruikt</h2>
      <p>
        De gegevens op uw apparaat worden alleen gebruikt om het spel te laten werken: om uw huidige level en de woorden
        die u hebt gevonden te onthouden en om uw reeks en dagdoel bij te houden. Ze worden nooit naar ons of naar derden
        verzonden en nooit verkocht. Advertentiegegevens worden door Google verwerkt voor de hierboven beschreven
        doeleinden.
      </p>

      <h2>Diensten van derden</h2>
      <ul>
        <li>
          <strong>Google AdMob</strong> (advertenties): zie <a href="https://policies.google.com/technologies/partner-sites?hl=nl">hoe Google gegevens van apps van partners gebruikt</a> en het <a href="https://policies.google.com/privacy?hl=nl">privacybeleid</a> van Google.
        </li>
        <li>
          <strong>Google Play</strong> (distributie en Billing): het privacybeleid van Google is van toepassing.
        </li>
        <li>
          <strong>Android-back-up:</strong> Als de Android-back-up is ingeschakeld, kan het systeem uw spelgegevens
          opnemen in de back-up van uw Google-account en op een nieuw apparaat terugzetten. Die back-up wordt door Google
          beheerd; wij hebben er geen toegang toe.
        </li>
      </ul>

      <h2>Deze website</h2>
      <p>
        Deze site gebruikt geen cookies en laadt geen bronnen van derden (lettertypen, analyses of advertenties). Onze
        server kan gedurende een korte periode standaard toegangslogboeken bijhouden (IP-adres, browsergegevens,
        opgevraagde pagina, tijdstip) voor beveiliging en probleemoplossing; ze worden voor niets anders gebruikt.
      </p>

      <h2>Bewaring en verwijdering van gegevens</h2>
      <p>
        Uw spelgegevens blijven op uw apparaat. Om ze te verwijderen, verwijdert u de app of gebruikt u <em>Instellingen &gt; Gegevens &gt; Voortgang resetten</em> in de app. Wij bewaren op onze servers geen account of spelgegevens over u. Gegevens die Google
        voor advertenties verwerkt, vallen onder het beleid van Google; u kunt ze beheren in <a href="https://myadcenter.google.com/">Mijn advertentiecentrum</a>.
      </p>

      <h2>Privacy van kinderen</h2>
      <p>
        De app is bedoeld voor een algemeen publiek en is niet gericht op kinderen jonger dan 13 jaar. Wij verzamelen
        niet bewust persoonsgegevens van kinderen jonger dan 13 jaar.
      </p>

      <h2>Wijzigingen</h2>
      <p>
        Wanneer dit beleid wordt gewijzigd, wordt de nieuwe versie op deze pagina gepubliceerd en wordt de datum van
        “laatst bijgewerkt” aangepast. Als er een nieuwe functie die gegevens verwerkt aan de app wordt toegevoegd, wordt
        deze pagina bijgewerkt voordat die functie wordt uitgebracht.
      </p>

      <h2>Contact</h2>
      <p>
        Voor vragen: <Mail />
      </p>
    </DocPage>
  );
}

export function Terms() {
  return (
    <DocPage
      lang="nl"
      page="terms"
      title="Gebruiksvoorwaarden"
      updated="2 oktober 2026"
      description="Gebruiksvoorwaarden voor de app Wordvoya — Woordpuzzel."
    >
      <p className="note">
        Dit is een vertaling die voor het gemak wordt aangeboden; als deze afwijkt van de <a href={PATHS.en.terms}>Engelse versie</a>, prevaleert de Engelse versie.
      </p>
      <p>
        Door de app <strong>Wordvoya: Woordpuzzel</strong> te downloaden of te gebruiken, gaat u akkoord met de volgende
        voorwaarden.
      </p>

      <h2>Licentie</h2>
      <p>
        De app wordt aan u beschikbaar gesteld onder een beperkte, niet-overdraagbare licentie voor persoonlijk,
        niet-commercieel gebruik. U mag de app niet kopiëren, wijzigen, reverse-engineeren of opnieuw verspreiden. De
        hieronder beschreven woordinhoud met een open licentie is van deze beperking uitgezonderd.
      </p>

      <h2>Woordinhoud en bronnen</h2>
      <ul>
        <li>
          Woordbetekenissen zijn aangepast uit het werk van de bijdragers van <a href="https://www.wiktionary.org/">Wikiwoordenboek</a>: het eigen Wikiwoordenboek van elke puzzeltaal en het Engelse Wikiwoordenboek, grotendeels via de extractie van <a href="https://kaikki.org/">kaikki.org</a>.
        </li>
        <li>
          Woordfrequenties komen uit de lijsten <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (OpenSubtitles) en <a href="https://github.com/rspeer/wordfreq">wordfreq</a>.
        </li>
        <li>
          De woordenlijsten en levelpakketten die van deze bronnen zijn afgeleid, worden aangeboden onder <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.nl">CC BY-SA 4.0</a>. De code en het ontwerp van de app en de naam Wordvoya vallen niet onder die licentie.
        </li>
        <li>
          De betekenissen zijn één voor één beoordeeld, maar er is geen garantie dat ze volledig of foutloos zijn. De app
          is bedoeld voor entertainment en vervangt geen officieel woordenboek. Als u een onjuist woord ziet, laat het
          ons dan weten.
        </li>
      </ul>

      <h2>Diamanten</h2>
      <p>
        Diamanten zijn virtuele items die alleen in het spel worden gebruikt, voor hints en voor extra tijd in levels met
        tijdslimiet. U krijgt ze door ze te kopen via Google Play, en nieuwe spelers beginnen met 100 diamanten;
        spelen (woorden vinden en levels voltooien) levert punten op, geen diamanten, en advertenties geven geen
        diamanten. Ze hebben geen geldwaarde,
        kunnen niet worden ingewisseld voor contant geld, zijn niet terugbetaalbaar (behalve waar de wet anders vereist
        en onder voorbehoud van het terugbetalingsbeleid van Google Play) en kunnen niet aan iemand anders worden
        overgedragen.
      </p>
      <p>
        Diamanten worden alleen op uw apparaat opgeslagen; omdat er geen account is, kunnen ze niet naar een ander
        apparaat worden verplaatst. Als u de voortgang reset, blijven uw diamanten behouden, maar als u de app
        verwijdert of de gegevens ervan wist, worden alle diamanten verwijderd, ook de gekochte, en kunnen ze niet
        worden hersteld.
      </p>

      <h2>Advertenties</h2>
      <p>
        De app is gratis en wordt ondersteund door advertenties van Google AdMob: tussen sommige levels kan een
        advertentie op volledig scherm worden getoond, en het bekijken van een advertentie met beloning voor extra tijd
        of een leven is altijd optioneel. Adverteerders en Google zijn verantwoordelijk voor de inhoud van de
        advertenties. Voor sites en apps die u via een advertentie bereikt, gelden hun eigen voorwaarden.
      </p>

      <h2>Aankopen</h2>
      <p>
        Alle aankopen worden gedaan in de <em>Winkel</em> van de app via Google Play; betaling, terugbetalingen en
        facturering vallen onder de voorwaarden van Google Play.
      </p>
      <ul>
        <li>
          <strong>Diamantenpakketten</strong> zijn verbruiksartikelen: de diamanten worden direct aan uw saldo toegevoegd
          en raken op naarmate u ze uitgeeft. Omdat diamanten op uw apparaat zijn opgeslagen, worden ze na het
          verwijderen van de app niet hersteld (zie Diamanten).
        </li>
        <li>
          <strong>“Advertenties verwijderen”</strong> en <strong>“Geen advertenties + 500 diamanten”</strong> zijn
          eenmalige aankopen die de advertenties tussen levels verwijderen. Optionele advertenties met beloning blijven
          beschikbaar voor wie extra tijd of een leven wil. Het verwijderen van advertenties is gekoppeld aan uw Google-account en na het opnieuw installeren van de app of op een nieuw apparaat kunt u het terugkrijgen via <em>Winkel &gt; Aankopen herstellen</em> (de 500 diamanten in het pakket worden één keer toegekend).
        </li>
      </ul>

      <h2>Beschikbaarheid</h2>
      <p>
        Wij garanderen niet dat de app zonder onderbrekingen of fouten werkt. Functies, levels en woordinhoud kunnen
        zonder voorafgaande kennisgeving worden toegevoegd, gewijzigd of verwijderd.
      </p>

      <h2>Beperking van aansprakelijkheid</h2>
      <p>
        De app wordt geleverd “in de huidige staat”. Voor zover wettelijk toegestaan, is de ontwikkelaar niet
        aansprakelijk voor indirecte schade die voortvloeit uit het gebruik van de app.
      </p>

      <h2>Privacy</h2>
      <p>
        De app heeft geen account nodig en uw spelgegevens blijven op uw apparaat; zie het <a href={PATHS.nl.privacy}>Privacybeleid</a> voor details, inclusief de gegevens die Google voor advertenties verwerkt.
      </p>

      <h2>Wijzigingen</h2>
      <p>
        Wanneer deze voorwaarden worden gewijzigd, wordt de nieuwe versie op deze pagina gepubliceerd. Als u de app na een
        update blijft gebruiken, betekent dat dat u de nieuwe voorwaarden accepteert.
      </p>

      <h2>Contact</h2>
      <p>
        Voor vragen en om een onjuist woord te melden: <Mail />
      </p>
    </DocPage>
  );
}
