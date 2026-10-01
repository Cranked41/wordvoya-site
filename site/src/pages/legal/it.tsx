// Gizlilik politikası ve kullanım şartları: İtalyanca çevirisi (kaynak: Privacy.tsx / Terms.tsx İngilizce).
// JSX'te satır sonu ile etiket arasındaki boşluk düşer: metinle bağlantıyı aynı satırda tut.
import { DocPage, Mail } from '../../Layout';
import { PATHS } from '../../site';

export function Privacy() {
  return (
    <DocPage
      lang="it"
      page="privacy"
      title="Informativa sulla privacy"
      updated="30 settembre 2026"
      description="Wordvoya non richiede un account e i dati di gioco restano sul Suo dispositivo. Gli annunci sono forniti da Google AdMob e gli acquisti passano da Google Play."
    >
      <p className="note">
        Questa è una traduzione fornita per comodità; in caso di differenze rispetto alla <a href={PATHS.en.privacy}>versione inglese</a>, prevale la versione inglese.
      </p>
      <p>
        La presente informativa spiega quali dati vengono trattati quando utilizza l’app Android <strong>Wordvoya: Puzzle di parole</strong> (<code>com.cranked.wordvoya</code>) e questo sito web.
      </p>
      <p className="lead">
        <strong>In breve:</strong> Wordvoya non richiede un account e non invia dati ai nostri server; i Suoi dati di
        gioco restano sul Suo dispositivo. L’app mostra annunci di Google AdMob e Google può utilizzare l’ID pubblicità
        del Suo dispositivo e alcune informazioni tecniche per mostrarli. L’acquisto «Rimuovi la pubblicità» viene
        effettuato tramite Google Play.
      </p>

      <h2>Dati raccolti</h2>
      <ul>
        <li>
          <strong>Nessun account:</strong> L’app non Le chiede di registrarsi né di accedere e non riceve il Suo nome, il
          Suo indirizzo e-mail né alcun altro identificativo.
        </li>
        <li>
          <strong>Dati di gioco sul dispositivo:</strong> I progressi nei livelli, le parole trovate, la serie giornaliera
          e l’obiettivo, i diamanti e le impostazioni sono memorizzati esclusivamente sul Suo dispositivo e non ci
          vengono inviati.
        </li>
        <li>
          <strong>Pubblicità (Google AdMob):</strong> Per mostrare e misurare gli annunci e per prevenire le frodi, Google
          può trattare l’ID pubblicità del Suo dispositivo, l’indirizzo IP (posizione approssimativa), le informazioni
          sul dispositivo e sull’app e le Sue interazioni con gli annunci. Questi dati vanno direttamente a Google; noi
          non vi abbiamo accesso.
        </li>
        <li>
          <strong>Acquisti:</strong> I pacchetti di diamanti e la rimozione della pubblicità vengono acquistati tramite
          Google Play Billing. Non abbiamo mai accesso ai Suoi dati di pagamento (numero di carta ecc.); l’app apprende da
          Google Play soltanto che cosa è stato acquistato e lo memorizza sul Suo dispositivo (compreso il token di
          acquisto, affinché lo stesso acquisto non venga conteggiato due volte).
        </li>
        <li>
          <strong>Classifica (Google Play Games, facoltativo):</strong> I Suoi punti si accumulano sul Suo dispositivo. Se
          accede con Google Play Games, i Suoi punti totali e settimanali, il livello raggiunto, il numero di parole
          trovate e il tempo impiegato per completare l’ultimo livello vengono inviati a Google insieme al nome del Suo
          profilo Play Games e mostrati agli altri giocatori nella classifica. Se non accede, nulla di tutto ciò viene
          inviato. Nelle impostazioni di Play Games può gestire chi vede il Suo profilo ed eliminare i Suoi dati di
          gioco.
        </li>
      </ul>

      <h2>Le Sue scelte sulla pubblicità</h2>
      <ul>
        <li>
          <strong>Spazio economico europeo, Regno Unito e Svizzera:</strong> Prima che venga mostrato qualsiasi annuncio
          compare il modulo di consenso di Google e Lei può consentire o rifiutare gli annunci personalizzati. Può
          modificare la Sua scelta in seguito nell’app in <em>Impostazioni &gt; Negozio e pubblicità &gt; Opzioni privacy per gli annunci</em>.
        </li>
        <li>
          <strong>ID pubblicità:</strong> Può reimpostare o eliminare il Suo ID pubblicità nelle impostazioni del
          dispositivo (Google &gt; Annunci).
        </li>
        <li>
          <strong>Gioco senza pubblicità:</strong> L’acquisto «Rimuovi la pubblicità» o «Senza pubblicità + 500 diamanti»
          elimina gli annunci tra un livello e l’altro. Gli annunci con ricompensa per tempo extra o per una vita sono
          sempre facoltativi.
        </li>
      </ul>

      <h2>Come vengono utilizzati i dati</h2>
      <p>
        I dati sul Suo dispositivo vengono utilizzati esclusivamente per il funzionamento del gioco: per ricordare il
        livello attuale e le parole trovate e per conteggiare la serie e l’obiettivo giornaliero. Non vengono mai inviati
        a noi né a terze parti e non vengono mai venduti. I dati pubblicitari sono trattati da Google per le finalità
        sopra descritte.
      </p>

      <h2>Servizi di terze parti</h2>
      <ul>
        <li>
          <strong>Google AdMob</strong> (pubblicità): vedere <a href="https://policies.google.com/technologies/partner-sites?hl=it">come Google utilizza i dati delle app dei partner</a> e l’<a href="https://policies.google.com/privacy?hl=it">informativa sulla privacy</a> di Google.
        </li>
        <li>
          <strong>Google Play</strong> (distribuzione e Billing): si applica l’informativa sulla privacy di Google.
        </li>
        <li>
          <strong>Backup di Android:</strong> Se il backup di Android è attivo, il sistema può includere i Suoi dati di
          gioco nel backup del Suo account Google e ripristinarli su un nuovo dispositivo. Tale backup è gestito da
          Google; noi non vi abbiamo accesso.
        </li>
      </ul>

      <h2>Questo sito web</h2>
      <p>
        Questo sito non utilizza cookie e non carica risorse di terze parti (font, strumenti di analisi o pubblicità). Il
        nostro server può conservare per un breve periodo i log di accesso standard (indirizzo IP, informazioni sul
        browser, pagina richiesta, ora) per ragioni di sicurezza e di risoluzione dei problemi; non vengono utilizzati
        per nessun altro scopo.
      </p>

      <h2>Conservazione e cancellazione dei dati</h2>
      <p>
        I Suoi dati di gioco restano sul Suo dispositivo. Per eliminarli, può disinstallare l’app oppure utilizzare <em>Impostazioni &gt; Dati &gt; Azzera i progressi</em> nell’app. Sui nostri server non conserviamo alcun account né alcun dato di gioco che La riguardi. I dati trattati da Google
        per la pubblicità sono soggetti alle norme di Google; può gestirli in <a href="https://myadcenter.google.com/">Il mio Centro annunci</a>.
      </p>

      <h2>Privacy dei minori</h2>
      <p>
        L’app è destinata a un pubblico generale e non è rivolta ai minori di 13 anni. Non raccogliamo consapevolmente
        dati personali di minori di 13 anni.
      </p>

      <h2>Modifiche</h2>
      <p>
        Quando la presente informativa viene modificata, la nuova versione viene pubblicata in questa pagina e la data di
        «ultimo aggiornamento» viene cambiata. Se nell’app viene aggiunta una nuova funzione che tratta dati, questa
        pagina sarà aggiornata prima del rilascio di tale funzione.
      </p>

      <h2>Contatti</h2>
      <p>
        Per domande: <Mail />
      </p>
    </DocPage>
  );
}

export function Terms() {
  return (
    <DocPage
      lang="it"
      page="terms"
      title="Termini di utilizzo"
      updated="1 ottobre 2026"
      description="Termini di utilizzo dell’app Wordvoya — Puzzle di parole."
    >
      <p className="note">
        Questa è una traduzione fornita per comodità; in caso di differenze rispetto alla <a href={PATHS.en.terms}>versione inglese</a>, prevale la versione inglese.
      </p>
      <p>
        Scaricando o utilizzando l’app <strong>Wordvoya: Puzzle di parole</strong>, Lei accetta i seguenti termini.
      </p>

      <h2>Licenza</h2>
      <p>
        L’app Le viene concessa in licenza limitata e non trasferibile per uso personale e non commerciale. Non è
        consentito copiare, modificare, sottoporre a reverse engineering né ridistribuire l’app. I contenuti lessicali
        con licenza aperta descritti di seguito sono esclusi da tale restrizione.
      </p>

      <h2>Contenuti lessicali e fonti</h2>
      <ul>
        <li>
          I significati delle parole sono adattati dal lavoro dei collaboratori di <a href="https://www.wiktionary.org/">Wikizionario</a>: il Wikizionario di ciascuna lingua dei puzzle e il Wikizionario in inglese, perlopiù tramite l’estrazione di <a href="https://kaikki.org/">kaikki.org</a>.
        </li>
        <li>
          Le frequenze delle parole provengono dalle liste <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (OpenSubtitles) e <a href="https://github.com/rspeer/wordfreq">wordfreq</a>.
        </li>
        <li>
          Le liste di parole e i pacchetti di livelli derivati da queste fonti sono forniti con licenza <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.it">CC BY-SA 4.0</a>. Il codice dell’app, il design e il nome Wordvoya non sono coperti da tale licenza.
        </li>
        <li>
          I significati sono stati rivisti uno per uno, ma non si garantisce che siano completi o privi di errori. L’app
          ha uno scopo di intrattenimento e non sostituisce un dizionario ufficiale. Se nota una parola errata, ce la
          segnali.
        </li>
      </ul>

      <h2>Diamanti</h2>
      <p>
        I diamanti sono oggetti virtuali utilizzati esclusivamente nel gioco, per gli indizi e per il tempo extra nei
        livelli a tempo. Si ottengono giocando (ricompense per le parole bonus; completare un livello fa guadagnare punti,
        non diamanti) oppure acquistandoli tramite Google Play; la pubblicità non fa guadagnare diamanti. Non hanno
        valore monetario, non possono essere convertiti in denaro, non sono rimborsabili (salvo ove la legge disponga
        diversamente e fatte salve le politiche di rimborso di Google Play) e non possono essere trasferiti ad altri.
      </p>
      <p>
        I diamanti sono memorizzati esclusivamente sul Suo dispositivo; poiché non esiste un account, non possono essere
        spostati su un altro dispositivo. L’azzeramento dei progressi mantiene i Suoi diamanti, ma la disinstallazione
        dell’app o la cancellazione dei suoi dati elimina tutti i diamanti, compresi quelli acquistati, e questi non
        possono essere ripristinati.
      </p>

      <h2>Pubblicità</h2>
      <p>
        L’app è gratuita ed è sostenuta dagli annunci di Google AdMob: tra alcuni livelli può essere mostrato un annuncio
        a schermo intero e guardare un annuncio con ricompensa per tempo extra o per una vita è sempre facoltativo. Gli
        inserzionisti e Google sono responsabili del contenuto degli annunci. I siti e le app che raggiunge tramite un
        annuncio sono soggetti ai propri termini.
      </p>

      <h2>Acquisti</h2>
      <p>
        Tutti gli acquisti vengono effettuati nel <em>Negozio</em> dell’app tramite Google Play; pagamento, rimborsi e fatturazione sono
        soggetti ai termini di Google Play.
      </p>
      <ul>
        <li>
          <strong>I pacchetti di diamanti</strong> sono consumabili: i diamanti vengono aggiunti subito al Suo saldo e si
          esauriscono man mano che li spende. Poiché i diamanti sono memorizzati sul Suo dispositivo, non vengono
          ripristinati dopo la disinstallazione dell’app (vedere Diamanti).
        </li>
        <li>
          <strong>«Rimuovi la pubblicità»</strong> e <strong>«Senza pubblicità + 500 diamanti»</strong> sono acquisti una
          tantum che eliminano gli annunci tra un livello e l’altro. Gli annunci con ricompensa facoltativi restano
          disponibili per chi desidera tempo extra o una vita. La rimozione della pubblicità è legata al Suo account Google e, dopo aver reinstallato l’app o su un nuovo dispositivo, può recuperarla in <em>Negozio &gt; Ripristina acquisti</em> (i 500 diamanti del pacchetto vengono assegnati una sola volta).
        </li>
      </ul>

      <h2>Disponibilità</h2>
      <p>
        Non garantiamo che l’app funzioni senza interruzioni o errori. Funzionalità, livelli e contenuti lessicali possono
        essere aggiunti, modificati o rimossi senza preavviso.
      </p>

      <h2>Limitazione di responsabilità</h2>
      <p>
        L’app è fornita «così com’è». Nella misura consentita dalla legge applicabile, lo sviluppatore non è responsabile
        dei danni indiretti derivanti dall’uso dell’app.
      </p>

      <h2>Privacy</h2>
      <p>
        L’app non richiede un account e i Suoi dati di gioco restano sul Suo dispositivo; per i dettagli, compresi i dati trattati da Google per la pubblicità, si veda l’<a href={PATHS.it.privacy}>Informativa sulla privacy</a>.
      </p>

      <h2>Modifiche</h2>
      <p>
        Quando i presenti termini vengono modificati, la nuova versione viene pubblicata in questa pagina. Continuare a
        utilizzare l’app dopo un aggiornamento significa accettare i nuovi termini.
      </p>

      <h2>Contatti</h2>
      <p>
        Per domande e per segnalare una parola errata: <Mail />
      </p>
    </DocPage>
  );
}
