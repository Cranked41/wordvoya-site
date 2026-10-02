// Gizlilik politikası ve kullanım şartları: Almanca çevirisi (kaynak: Privacy.tsx / Terms.tsx İngilizce).
// JSX'te satır sonu ile etiket arasındaki boşluk düşer: metinle bağlantıyı aynı satırda tut.
import { DocPage, Mail } from '../../Layout';
import { PATHS } from '../../site';

export function Privacy() {
  return (
    <DocPage
      lang="de"
      page="privacy"
      title="Datenschutzerklärung"
      updated="30. September 2026"
      description="Wordvoya benötigt kein Konto, und Ihre Spieldaten bleiben auf Ihrem Gerät. Werbung wird über Google AdMob ausgeliefert, Käufe laufen über Google Play."
    >
      <p className="note">
        Diese Übersetzung wird nur zur Vereinfachung bereitgestellt; weicht sie von der <a href={PATHS.en.privacy}>englischen Fassung</a> ab, ist die englische Fassung maßgeblich.
      </p>
      <p>
        Diese Erklärung beschreibt, welche Daten verarbeitet werden, wenn Sie die Android-App <strong>Wordvoya: Worträtsel</strong> (<code>com.cranked.wordvoya</code>) und diese Website nutzen.
      </p>
      <p className="lead">
        <strong>Kurz gesagt:</strong> Wordvoya benötigt kein Konto und sendet keine Daten an unsere Server; Ihre Spieldaten
        bleiben auf Ihrem Gerät. Die App zeigt Werbung von Google AdMob, und Google kann die Werbe-ID Ihres Geräts und einige
        technische Informationen verwenden, um sie auszuliefern. Der Kauf „Werbung entfernen“ erfolgt über Google Play.
      </p>

      <h2>Welche Daten wir erheben</h2>
      <ul>
        <li>
          <strong>Kein Konto:</strong> Die App verlangt keine Registrierung oder Anmeldung und erhält weder Ihren Namen noch
          Ihre E-Mail-Adresse oder eine sonstige Kennung.
        </li>
        <li>
          <strong>Spieldaten auf Ihrem Gerät:</strong> Levelfortschritt, gefundene Wörter, die Tagesserie und das Tagesziel,
          Diamanten und Einstellungen werden ausschließlich auf Ihrem Gerät gespeichert und nicht an uns gesendet.
        </li>
        <li>
          <strong>Werbung (Google AdMob):</strong> Um Werbung auszuliefern und ihre Wirkung zu messen sowie um Betrug zu
          verhindern, kann Google die Werbe-ID Ihres Geräts, Ihre IP-Adresse (ungefährer Standort), Geräte- und
          App-Informationen sowie Ihre Interaktionen mit Werbung verarbeiten. Diese Daten gehen direkt an Google; wir haben
          keinen Zugriff darauf.
        </li>
        <li>
          <strong>Käufe:</strong> Diamantenpakete und die Entfernung der Werbung werden über Google Play Billing erworben.
          Wir haben zu keinem Zeitpunkt Zugriff auf Ihre Zahlungsdaten (Kartennummer usw.); die App erfährt von Google Play
          lediglich, was gekauft wurde, und speichert dies auf Ihrem Gerät (einschließlich des Kauf-Tokens, damit derselbe
          Kauf nicht doppelt gezählt wird).
        </li>
        <li>
          <strong>Bestenliste (Google Play Games, optional):</strong> Ihre Punkte sammeln sich auf Ihrem Gerät. Wenn Sie sich
          bei Google Play Games anmelden, werden Ihre Gesamt- und Wochenpunkte, das erreichte Level, die Anzahl der gefundenen
          Wörter und die Zeit, die Sie für Ihr zuletzt beendetes Level benötigt haben, zusammen mit Ihrem Play-Games-Profilnamen
          an Google gesendet und anderen Spielern in der Bestenliste angezeigt. Wenn Sie sich nicht anmelden, wird nichts davon
          gesendet. In den Play-Games-Einstellungen können Sie festlegen, wer Ihr Profil sieht, und Ihre Spieldaten löschen.
        </li>
      </ul>

      <h2>Ihre Werbeoptionen</h2>
      <ul>
        <li>
          <strong>Europäischer Wirtschaftsraum, Vereinigtes Königreich und Schweiz:</strong> Bevor Werbung angezeigt wird,
          erscheint das Einwilligungsformular von Google, und Sie können personalisierte Werbung zulassen oder ablehnen. Ihre
          Entscheidung können Sie später in der App unter <em>Einstellungen &gt; Shop und Werbung &gt; Datenschutzoptionen für Werbung</em> ändern.
        </li>
        <li>
          <strong>Werbe-ID:</strong> In den Einstellungen Ihres Geräts (Google
          &gt; Werbung) können Sie Ihre Werbe-ID zurücksetzen oder löschen.
        </li>
        <li>
          <strong>Werbefreies Spielen:</strong> Der Kauf „Werbung entfernen“ oder „Ohne Werbung + 500 Diamanten“ entfernt die
          Werbung zwischen den Levels. Werbung mit Belohnung für zusätzliche Zeit oder ein Leben bleibt stets freiwillig.
        </li>
      </ul>

      <h2>Wie die Daten verwendet werden</h2>
      <p>
        Die Daten auf Ihrem Gerät werden ausschließlich für den Spielbetrieb verwendet: um sich Ihr aktuelles Level und die
        gefundenen Wörter zu merken und um Ihre Serie und Ihr Tagesziel zu zählen. Sie werden niemals an uns oder an Dritte
        gesendet und niemals verkauft. Werbedaten werden von Google zu den oben beschriebenen Zwecken verarbeitet.
      </p>

      <h2>Dienste von Drittanbietern</h2>
      <ul>
        <li>
          <strong>Google AdMob</strong> (Werbung): siehe <a href="https://policies.google.com/technologies/partner-sites?hl=de">wie Google Daten aus Apps von Partnern verwendet</a> und die <a href="https://policies.google.com/privacy?hl=de">Datenschutzerklärung</a> von Google.
        </li>
        <li>
          <strong>Google Play</strong> (Vertrieb und Abrechnung): Es gilt die Datenschutzerklärung von Google.
        </li>
        <li>
          <strong>Android-Datensicherung:</strong> Ist die Android-Datensicherung aktiviert, kann das System Ihre Spieldaten
          in die Sicherung Ihres Google-Kontos aufnehmen und auf einem neuen Gerät wiederherstellen. Diese Sicherung wird von
          Google verwaltet; wir haben keinen Zugriff darauf.
        </li>
      </ul>

      <h2>Diese Website</h2>
      <p>
        Diese Website verwendet keine Cookies und lädt keine Ressourcen von Drittanbietern (Schriftarten, Analysen oder
        Werbung). Unser Server kann zur Gewährleistung der Sicherheit und zur Fehlerbehebung für kurze Zeit übliche
        Zugriffsprotokolle (IP-Adresse, Browserinformationen, aufgerufene Seite, Uhrzeit) speichern; sie werden für keinen
        anderen Zweck verwendet.
      </p>

      <h2>Datenspeicherung und Löschung</h2>
      <p>
        Ihre Spieldaten bleiben auf Ihrem Gerät. Zum Löschen können Sie die App deinstallieren oder in der App <em>Einstellungen &gt; Daten &gt; Fortschritt zurücksetzen</em> verwenden. Auf unseren Servern speichern wir keine Konto- oder Spieldatensätze über Sie. Daten, die Google
        für Werbung verarbeitet, unterliegen den Richtlinien von Google; Sie können sie in <a href="https://myadcenter.google.com/">Meine Werbezentrale</a> verwalten.
      </p>

      <h2>Datenschutz für Kinder</h2>
      <p>
        Die App richtet sich an ein allgemeines Publikum und nicht an Kinder unter 13 Jahren. Wir erheben nicht wissentlich
        personenbezogene Daten von Kindern unter 13 Jahren.
      </p>

      <h2>Änderungen</h2>
      <p>
        Wenn sich diese Erklärung ändert, wird die neue Version auf dieser Seite veröffentlicht und das Datum der „letzten
        Aktualisierung“ angepasst. Wird der App eine neue Funktion hinzugefügt, die Daten verarbeitet, wird diese Seite
        aktualisiert, bevor die Funktion veröffentlicht wird.
      </p>

      <h2>Kontakt</h2>
      <p>
        Bei Fragen: <Mail />
      </p>
    </DocPage>
  );
}

export function Terms() {
  return (
    <DocPage
      lang="de"
      page="terms"
      title="Nutzungsbedingungen"
      updated="2. Oktober 2026"
      description="Nutzungsbedingungen für die App Wordvoya — Worträtsel."
    >
      <p className="note">
        Diese Übersetzung wird nur zur Vereinfachung bereitgestellt; weicht sie von der <a href={PATHS.en.terms}>englischen Fassung</a> ab, ist die englische Fassung maßgeblich.
      </p>
      <p>
        Durch das Herunterladen oder die Nutzung der App <strong>Wordvoya: Worträtsel</strong> erklären Sie sich mit den folgenden Bedingungen einverstanden.
      </p>

      <h2>Lizenz</h2>
      <p>
        Die App wird Ihnen im Rahmen einer beschränkten, nicht übertragbaren Lizenz für den persönlichen, nicht
        kommerziellen Gebrauch zur Verfügung gestellt. Sie dürfen die App weder kopieren, verändern, zurückentwickeln
        (Reverse Engineering) noch weiterverbreiten. Die nachstehend beschriebenen offen lizenzierten Wortinhalte sind von
        dieser Einschränkung ausgenommen.
      </p>

      <h2>Wortinhalte und Quellen</h2>
      <ul>
        <li>
          Wortbedeutungen sind eine Bearbeitung der Arbeit der Mitwirkenden von <a href="https://www.wiktionary.org/">Wiktionary</a>: dem jeweils eigenen Wiktionary jeder Rätselsprache und dem englischen Wiktionary, überwiegend über die Extraktion von <a href="https://kaikki.org/">kaikki.org</a>.
        </li>
        <li>
          Die Worthäufigkeiten stammen aus den Listen <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (OpenSubtitles) und <a href="https://github.com/rspeer/wordfreq">wordfreq</a>.
        </li>
        <li>
          Die aus diesen Quellen abgeleiteten Wortlisten und Levelpakete werden unter <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">CC BY-SA 4.0</a> bereitgestellt. Der Code der App, ihr Design und der Name Wordvoya fallen nicht unter diese Lizenz.
        </li>
        <li>
          Die Bedeutungen wurden einzeln geprüft, es wird jedoch nicht garantiert, dass sie vollständig oder fehlerfrei sind.
          Die App dient der Unterhaltung und ersetzt kein offizielles Wörterbuch. Wenn Ihnen ein falsches Wort auffällt,
          teilen Sie es uns bitte mit.
        </li>
      </ul>

      <h2>Diamanten</h2>
      <p>
        Diamanten sind virtuelle Gegenstände, die ausschließlich im Spiel verwendet werden, für Tipps und für zusätzliche
        Zeit in Levels mit Zeitlimit. Sie erhalten sie durch Kauf über Google Play, und neue Spieler beginnen mit 100
        Diamanten; Spielen (Wörter finden und Levels beenden) bringt Punkte, keine Diamanten, und Werbung bringt keine
        Diamanten. Sie haben keinen
        Geldwert, können nicht gegen Bargeld eingetauscht werden, sind nicht erstattungsfähig (soweit das Gesetz nichts
        anderes vorschreibt und vorbehaltlich der Erstattungsrichtlinien von Google Play) und können nicht auf andere
        Personen übertragen werden.
      </p>
      <p>
        Diamanten werden ausschließlich auf Ihrem Gerät gespeichert; da es kein Konto gibt, können sie nicht auf ein anderes
        Gerät übertragen werden. Das Zurücksetzen des Fortschritts lässt Ihre Diamanten unberührt, das Deinstallieren der App
        oder das Löschen ihrer Daten löscht jedoch alle Diamanten, auch gekaufte, und sie können nicht wiederhergestellt
        werden.
      </p>

      <h2>Werbung</h2>
      <p>
        Die App ist kostenlos und wird durch Werbung von Google AdMob finanziert: Zwischen einigen Levels kann eine
        Vollbildanzeige eingeblendet werden, und das Ansehen einer Werbung mit Belohnung für zusätzliche Zeit oder ein Leben
        ist stets freiwillig. Für den Inhalt der Werbung sind die Werbetreibenden und Google verantwortlich. Für Websites und
        Apps, die Sie über eine Werbeanzeige erreichen, gelten deren eigene Bedingungen.
      </p>

      <h2>Käufe</h2>
      <p>
        Alle Käufe werden im <em>Shop</em> der App über Google Play getätigt; Zahlung, Erstattungen und Abrechnung unterliegen
        den Bedingungen von Google Play.
      </p>
      <ul>
        <li>
          <strong>Diamantenpakete</strong> sind Verbrauchsgüter: Die Diamanten werden Ihrem Guthaben sofort gutgeschrieben und
          verbrauchen sich, sobald Sie sie ausgeben. Da Diamanten auf Ihrem Gerät gespeichert werden, werden sie nach der
          Deinstallation der App nicht wiederhergestellt (siehe Diamanten).
        </li>
        <li>
          <strong>„Werbung entfernen“</strong> und <strong>„Ohne Werbung + 500 Diamanten“</strong> sind einmalige Käufe, die die Werbung zwischen den Levels entfernen. Optionale Werbung mit Belohnung bleibt für alle bestehen, die zusätzliche Zeit oder ein Leben möchten. Die Entfernung der Werbung ist an Ihr Google-Konto gebunden, und nach einer Neuinstallation der App oder auf einem neuen Gerät können Sie sie unter <em>Shop &gt; Käufe wiederherstellen</em> zurückerhalten (die 500 Diamanten des Pakets werden einmalig gutgeschrieben).
        </li>
      </ul>

      <h2>Verfügbarkeit</h2>
      <p>
        Wir garantieren nicht, dass die App unterbrechungs- oder fehlerfrei läuft. Funktionen, Levels und Wortinhalte können
        ohne vorherige Ankündigung hinzugefügt, geändert oder entfernt werden.
      </p>

      <h2>Haftungsbeschränkung</h2>
      <p>
        Die App wird „wie besehen“ bereitgestellt. Soweit nach geltendem Recht zulässig, haftet der Entwickler nicht für
        indirekte Schäden, die aus der Nutzung der App entstehen.
      </p>

      <h2>Datenschutz</h2>
      <p>
        Die App benötigt kein Konto, und Ihre Spieldaten bleiben auf Ihrem Gerät; Einzelheiten, einschließlich der Daten, die Google für Werbung verarbeitet, finden Sie in der <a href={PATHS.de.privacy}>Datenschutzerklärung</a>.
      </p>

      <h2>Änderungen</h2>
      <p>
        Wenn sich diese Bedingungen ändern, wird die neue Version auf dieser Seite veröffentlicht. Die weitere Nutzung der
        App nach einer Aktualisierung bedeutet, dass Sie die neuen Bedingungen akzeptieren.
      </p>

      <h2>Kontakt</h2>
      <p>
        Bei Fragen und zum Melden eines falschen Wortes: <Mail />
      </p>
    </DocPage>
  );
}
