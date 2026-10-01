// Ana sayfa ve arayüz metinleri: Türkçe ve İngilizce dışındaki 13 dil (Home.tsx ve site.ts'deki tr/en ile aynı yapı).
import type { HomeText } from './pages/Home';
import type { UiText } from './site';

export type ExtraLang = 'de' | 'fr' | 'es' | 'it' | 'pt' | 'ru' | 'nl' | 'pl' | 'ja' | 'ko' | 'ar' | 'fa' | 'hi';

export const HOME_EXTRA: Record<ExtraLang, HomeText> = {
  de: {
    title: 'Wordvoya — Worträtsel',
    description:
      'Verbinde Buchstabeninseln, finde die Wörter im Kreuzworträtsel und jage Bonuswörter. Eine Inselreise, die nie endet.',
    og: {
      title: 'Wordvoya — Worträtsel',
      description: 'Verbinde Buchstabeninseln, finde die Wörter und starte eine endlose Reise.',
      image: '/img/og-de.jpg',
    },
    sub: 'Worträtsel',
    intro:
      'Die Buchstaben warten auf Inseln im Meer. Zieh den Finger von Insel zu Insel: Deine Route bildet ein Wort und landet im Kreuzworträtsel. Jedes Level ist eine neue Insel mit neuen Wörtern.',
    soon: 'Bald bei Google Play',
    iconAlt: 'Wordvoya-Symbol',
    heroAlt: 'Über die Buchstabeninseln gleiten, um ein Wort zu bilden',
    featuresTitle: 'Eine Wortjagd von Insel zu Insel',
    features: [
      ['~', 'Buchstabeninseln', 'Kein Rad: Die Buchstaben liegen auf Inseln im Meer. Zieh den Finger, und deine Route bildet das Wort.'],
      ['∞', 'Weltwunder', 'Von Pamukkale bis zum Taj Mahal ist jeder Halt ein Weltwunder. Jede Reise führt zu zehn neuen Orten; die Fahrt endet nie, und die Rätsel wachsen mit.'],
      ['★', 'Bonuswörter', 'Finde die zusätzlichen Wörter, die sich in den Buchstaben verstecken, und verdiene Diamanten; wenn du nicht weiterkommst, deckst du mit einem Tipp einen Buchstaben auf.'],
      ['A', 'Neugierig auf ein Wort?', 'Tippe auf ein gefundenes Wort und sieh dir seine Bedeutung an. Jedes Rätselwort wurde von Hand geprüft.'],
      ['15', 'Rätsel in 15 Sprachen', 'Deutsch, Englisch, Türkisch, Japanisch, Hindi, Arabisch und mehr; der Fortschritt wird für jede Sprache getrennt gespeichert.'],
      ['✓', 'Kein Konto nötig', 'Das Spiel braucht keine Anmeldung, du kannst sofort loslegen. Dein Fortschritt bleibt auf deinem Gerät.'],
    ],
    shotsTitle: 'Screenshots',
    shots: ['Buchstabeninseln verbinden', 'Level geschafft: Punkte der Station und Tagesziel', 'Bonuswörter', 'Ein großes Rätsel weiter auf der Reise'],
    attribution: (
      <>
        Wortbedeutungen wurden aus der Arbeit der <a href="https://de.wiktionary.org/">Wiktionary</a>-Mitwirkenden übernommen und angepasst (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">CC BY-SA 4.0</a>).
      </>
    ),
  },
  fr: {
    title: 'Wordvoya — Jeu de mots',
    description:
      'Relie des îles de lettres, trouve les mots de la grille de mots croisés et chasse les mots bonus. Un voyage insulaire qui ne s’arrête jamais.',
    og: {
      title: 'Wordvoya — Jeu de mots',
      description: 'Relie des îles de lettres, trouve les mots et pars pour un voyage sans fin.',
      image: '/img/og-fr.jpg',
    },
    sub: 'Jeu de mots',
    intro:
      'Les lettres t’attendent sur des îles au milieu de la mer. Fais glisser ton doigt d’île en île : ton itinéraire forme un mot et vient se placer dans la grille de mots croisés. Chaque niveau est une nouvelle île, avec de nouveaux mots à trouver.',
    soon: 'Bientôt sur Google Play',
    iconAlt: 'Icône de Wordvoya',
    heroAlt: 'Glisser sur les îles de lettres pour former un mot',
    featuresTitle: 'Une chasse aux mots d’île en île',
    features: [
      ['~', 'Des îles de lettres', 'Pas de roue : les lettres sont posées sur des îles au milieu de la mer. Fais glisser ton doigt et ton itinéraire forme le mot.'],
      ['∞', 'Les merveilles du monde', 'De Pamukkale au Taj Mahal, chaque escale est une merveille du monde. Chaque voyage visite dix nouveaux lieux ; l’aventure ne s’arrête jamais et les grilles ne cessent de grandir.'],
      ['★', 'Mots bonus', 'Trouve les mots supplémentaires cachés dans les lettres pour gagner des diamants, et révèle une lettre avec un indice quand tu es bloqué.'],
      ['A', 'Un mot te intrigue ?', 'Touche un mot trouvé pour voir sa définition. Chaque mot de la grille a été vérifié à la main.'],
      ['15', 'Des grilles en 15 langues', 'Français, anglais, turc, japonais, hindi, arabe et bien d’autres ; la progression est enregistrée séparément pour chaque langue.'],
      ['✓', 'Pas besoin de compte', 'Le jeu ne demande aucune inscription : tu peux commencer tout de suite. Ta progression reste sur ton appareil.'],
    ],
    shotsTitle: 'Captures d’écran',
    shots: ['Relier les îles de lettres', 'Niveau terminé : points de l’escale et objectif quotidien', 'Mots bonus', 'Une grande grille plus loin dans le voyage'],
    attribution: (
      <>
        Les définitions sont adaptées du travail des contributeurs de <a href="https://fr.wiktionary.org/">Wiktionnaire</a> (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr">CC BY-SA 4.0</a>).
      </>
    ),
  },
  es: {
    title: 'Wordvoya — Puzle de palabras',
    description:
      'Une islas de letras, encuentra las palabras del crucigrama y caza palabras extra. Un viaje entre islas que nunca termina.',
    og: {
      title: 'Wordvoya — Puzle de palabras',
      description: 'Une islas de letras, encuentra palabras y emprende un viaje sin fin.',
      image: '/img/og-es.jpg',
    },
    sub: 'Puzle de palabras',
    intro:
      'Las letras te esperan en islas en medio del mar. Desliza el dedo de isla en isla: tu ruta forma una palabra y se coloca en el crucigrama. Cada nivel es una isla nueva con palabras nuevas por descubrir.',
    soon: 'Próximamente en Google Play',
    iconAlt: 'Icono de Wordvoya',
    heroAlt: 'Deslizando el dedo por las islas de letras para formar una palabra',
    featuresTitle: 'Una caza de palabras de isla en isla',
    features: [
      ['~', 'Islas de letras', 'Nada de ruedas: las letras están en islas en medio del mar. Desliza el dedo y tu ruta forma la palabra.'],
      ['∞', 'Maravillas del mundo', 'De Pamukkale al Taj Mahal, cada parada es una maravilla del mundo. Cada viaje visita diez lugares nuevos; la travesía nunca termina y los puzles no dejan de crecer.'],
      ['★', 'Palabras extra', 'Encuentra las palabras adicionales escondidas en las letras para ganar diamantes y descubre una letra con una pista cuando te atasques.'],
      ['A', '¿Curiosidad por una palabra?', 'Toca una palabra que hayas encontrado para ver su significado. Todas las palabras de los puzles se han revisado a mano.'],
      ['15', 'Puzles en 15 idiomas', 'Español, inglés, turco, japonés, hindi, árabe y más; el progreso se guarda por separado para cada idioma.'],
      ['✓', 'No hace falta cuenta', 'El juego no pide registro, así que puedes empezar al instante. Tu progreso se queda en tu dispositivo.'],
    ],
    shotsTitle: 'Capturas de pantalla',
    shots: ['Une las islas de letras', 'Nivel completado: puntos de la parada y meta diaria', 'Palabras extra', 'Un gran puzle más adelante en el viaje'],
    attribution: (
      <>
        Los significados de las palabras están adaptados del trabajo de los colaboradores de <a href="https://es.wiktionary.org/">Wikcionario</a> (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es">CC BY-SA 4.0</a>).
      </>
    ),
  },
  it: {
    title: 'Wordvoya — Puzzle di parole',
    description:
      'Unisci isole di lettere, trova le parole nelle parole crociate e dai la caccia alle parole bonus. Un viaggio tra le isole che non finisce mai.',
    og: {
      title: 'Wordvoya — Puzzle di parole',
      description: 'Unisci isole di lettere, trova le parole e salpa per un viaggio senza fine.',
      image: '/img/og-it.jpg',
    },
    sub: 'Puzzle di parole',
    intro:
      'Le lettere ti aspettano su isole in mezzo al mare. Fai scorrere il dito da un’isola all’altra: il tuo percorso forma una parola e si posiziona nelle parole crociate. Ogni livello è un’isola nuova, con parole nuove da scoprire.',
    soon: 'In arrivo su Google Play',
    iconAlt: 'Icona di Wordvoya',
    heroAlt: 'Far scorrere il dito sulle isole di lettere per formare una parola',
    featuresTitle: 'Una caccia alle parole di isola in isola',
    features: [
      ['~', 'Isole di lettere', 'Niente ruota: le lettere sono sulle isole in mezzo al mare. Fai scorrere il dito e il tuo percorso forma la parola.'],
      ['∞', 'Meraviglie del mondo', 'Da Pamukkale al Taj Mahal, ogni tappa è una meraviglia del mondo. Ogni viaggio tocca dieci luoghi nuovi; l’avventura non finisce mai e i puzzle continuano a crescere.'],
      ['★', 'Parole bonus', 'Trova le parole extra nascoste tra le lettere per guadagnare diamanti e svela una lettera con un suggerimento quando sei bloccato.'],
      ['A', 'Curioso di una parola?', 'Tocca una parola trovata per vederne il significato. Ogni parola dei puzzle è stata controllata a mano.'],
      ['15', 'Puzzle in 15 lingue', 'Italiano, inglese, turco, giapponese, hindi, arabo e altro ancora; i progressi vengono salvati separatamente per ogni lingua.'],
      ['✓', 'Nessun account necessario', 'Il gioco non richiede registrazione, quindi puoi iniziare subito. I tuoi progressi restano sul tuo dispositivo.'],
    ],
    shotsTitle: 'Schermate',
    shots: ['Unisci le isole di lettere', 'Livello completato: punti della tappa e obiettivo giornaliero', 'Parole bonus', 'Un grande puzzle più avanti nel viaggio'],
    attribution: (
      <>
        I significati delle parole sono adattati dal lavoro dei collaboratori di <a href="https://it.wiktionary.org/">Wikizionario</a> (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.it">CC BY-SA 4.0</a>).
      </>
    ),
  },
  pt: {
    title: 'Wordvoya — Jogo de palavras',
    description:
      'Junte ilhas de letras, encontre as palavras nas palavras cruzadas e cace palavras bônus. Uma viagem entre ilhas que nunca termina.',
    og: {
      title: 'Wordvoya — Jogo de palavras',
      description: 'Junte ilhas de letras, encontre as palavras e embarque em uma viagem sem fim.',
      image: '/img/og-pt.jpg',
    },
    sub: 'Jogo de palavras',
    intro:
      'As letras esperam você em ilhas no meio do mar. Deslize o dedo de ilha em ilha: sua rota forma uma palavra e se encaixa nas palavras cruzadas. Cada fase é uma ilha nova, com novas palavras para descobrir.',
    soon: 'Em breve no Google Play',
    iconAlt: 'Ícone do Wordvoya',
    heroAlt: 'Deslizando pelas ilhas de letras para formar uma palavra',
    featuresTitle: 'Uma caça às palavras de ilha em ilha',
    features: [
      ['~', 'Ilhas de letras', 'Sem roda: as letras ficam em ilhas no meio do mar. Deslize o dedo e sua rota forma a palavra.'],
      ['∞', 'Maravilhas do mundo', 'De Pamukkale ao Taj Mahal, cada parada é uma maravilha do mundo. Cada viagem passa por dez lugares novos; a jornada nunca acaba e os quebra-cabeças não param de crescer.'],
      ['★', 'Palavras bônus', 'Encontre as palavras extras escondidas nas letras para ganhar diamantes e revele uma letra com uma dica quando travar.'],
      ['A', 'Curioso sobre uma palavra?', 'Toque em uma palavra encontrada para ver o significado. Cada palavra dos quebra-cabeças foi revisada à mão.'],
      ['15', 'Quebra-cabeças em 15 idiomas', 'Português, inglês, turco, japonês, hindi, árabe e mais; o progresso é guardado separadamente para cada idioma.'],
      ['✓', 'Sem precisar de conta', 'O jogo não exige cadastro, então você pode começar já. Seu progresso fica no seu dispositivo.'],
    ],
    shotsTitle: 'Capturas de tela',
    shots: ['Conecte as ilhas de letras', 'Fase concluída: pontos da parada e meta diária', 'Palavras bônus', 'Um quebra-cabeça grande mais adiante na viagem'],
    attribution: (
      <>
        Os significados das palavras foram adaptados do trabalho dos colaboradores do <a href="https://pt.wiktionary.org/">Wikcionário</a> (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt">CC BY-SA 4.0</a>).
      </>
    ),
  },
  ru: {
    title: 'Wordvoya — Игра в слова',
    description:
      'Соединяй острова букв, находи слова в кроссворде и охоться за бонусными словами. Путешествие по островам, которому нет конца.',
    og: {
      title: 'Wordvoya — Игра в слова',
      description: 'Соединяй острова букв, находи слова и отправляйся в бесконечное путешествие.',
      image: '/img/og-ru.jpg',
    },
    sub: 'Игра в слова',
    intro:
      'Буквы ждут тебя на островах посреди моря. Проведи пальцем от острова к острову: твой маршрут сложится в слово и встанет в кроссворд. Каждый уровень — новый остров с новыми словами, которые предстоит найти.',
    soon: 'Скоро в Google Play',
    iconAlt: 'Значок Wordvoya',
    heroAlt: 'Проводим пальцем по островам букв, чтобы составить слово',
    featuresTitle: 'Охота за словами от острова к острову',
    features: [
      ['~', 'Острова букв', 'Никаких кругов: буквы лежат на островах посреди моря. Проведи пальцем, и твой маршрут сложится в слово.'],
      ['∞', 'Чудеса света', 'От Памуккале до Тадж-Махала каждая остановка — чудо света. В каждом плавании десять новых мест; путешествие никогда не кончается, а головоломки становятся всё больше.'],
      ['★', 'Бонусные слова', 'Находи дополнительные слова, спрятанные в буквах, и зарабатывай алмазы; если застрял, подсказка откроет одну букву.'],
      ['A', 'Интересно, что значит слово?', 'Нажми на найденное слово, чтобы увидеть его значение. Каждое слово в головоломках проверено вручную.'],
      ['15', 'Головоломки на 15 языках', 'Русский, английский, турецкий, японский, хинди, арабский и другие; прогресс сохраняется отдельно для каждого языка.'],
      ['✓', 'Аккаунт не нужен', 'Игре не нужна регистрация, так что начать можно сразу. Твой прогресс остаётся на твоём устройстве.'],
    ],
    shotsTitle: 'Скриншоты',
    shots: ['Соединяй острова букв', 'Уровень пройден: очки остановки и дневная цель', 'Бонусные слова', 'Большая головоломка дальше в путешествии'],
    attribution: (
      <>
        Значения слов адаптированы из работы участников <a href="https://ru.wiktionary.org/">Викисловаря</a> (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.ru">CC BY-SA 4.0</a>).
      </>
    ),
  },
  nl: {
    title: 'Wordvoya — Woordpuzzel',
    description:
      'Verbind letter-eilanden, vind de woorden in de kruiswoordpuzzel en jaag op bonuswoorden. Een eilandenreis die nooit eindigt.',
    og: {
      title: 'Wordvoya — Woordpuzzel',
      description: 'Verbind letter-eilanden, vind de woorden en ga op een reis zonder einde.',
      image: '/img/og-nl.jpg',
    },
    sub: 'Woordpuzzel',
    intro:
      'De letters wachten op je op eilanden in de zee. Veeg met je vinger van eiland naar eiland: je route vormt een woord en komt in de kruiswoordpuzzel terecht. Elk level is een nieuw eiland met nieuwe woorden om te vinden.',
    soon: 'Binnenkort op Google Play',
    iconAlt: 'Wordvoya-pictogram',
    heroAlt: 'Over de letter-eilanden vegen om een woord te vormen',
    featuresTitle: 'Een woordenjacht van eiland naar eiland',
    features: [
      ['~', 'Letter-eilanden', 'Geen wiel: de letters liggen op eilanden in de zee. Veeg met je vinger en je route vormt het woord.'],
      ['∞', 'Wereldwonderen', 'Van Pamukkale tot de Taj Mahal is elke halte een wereldwonder. Elke reis bezoekt tien nieuwe plekken; de tocht houdt nooit op en de puzzels worden steeds groter.'],
      ['★', 'Bonuswoorden', 'Vind de extra woorden die in de letters verborgen zitten en verdien diamanten; zit je vast, dan onthult een hint een letter.'],
      ['A', 'Benieuwd naar een woord?', 'Tik op een gevonden woord om de betekenis te zien. Elk puzzelwoord is met de hand gecontroleerd.'],
      ['15', 'Puzzels in 15 talen', 'Nederlands, Engels, Turks, Japans, Hindi, Arabisch en meer; je voortgang wordt voor elke taal apart bijgehouden.'],
      ['✓', 'Geen account nodig', 'Het spel vraagt geen registratie, dus je kunt meteen beginnen. Je voortgang blijft op je apparaat.'],
    ],
    shotsTitle: 'Schermafbeeldingen',
    shots: ['Verbind de letter-eilanden', 'Level voltooid: punten van de halte en dagdoel', 'Bonuswoorden', 'Een grote puzzel verderop in de reis'],
    attribution: (
      <>
        Woordbetekenissen zijn aangepast uit het werk van de bijdragers van <a href="https://nl.wiktionary.org/">Wikiwoordenboek</a> (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.nl">CC BY-SA 4.0</a>).
      </>
    ),
  },
  pl: {
    title: 'Wordvoya — Łamigłówka słowna',
    description:
      'Łącz wyspy liter, znajduj słowa w krzyżówce i poluj na słowa dodatkowe. Wyspiarska podróż, która nigdy się nie kończy.',
    og: {
      title: 'Wordvoya — Łamigłówka słowna',
      description: 'Łącz wyspy liter, znajduj słowa i wyrusz w podróż bez końca.',
      image: '/img/og-pl.jpg',
    },
    sub: 'Łamigłówka słowna',
    intro:
      'Litery czekają na ciebie na wyspach pośrodku morza. Przesuwaj palec z wyspy na wyspę: twoja trasa ułoży słowo i wpadnie do krzyżówki. Każdy poziom to nowa wyspa i nowe słowa do odnalezienia.',
    soon: 'Wkrótce w Google Play',
    iconAlt: 'Ikona Wordvoya',
    heroAlt: 'Przesuwanie palcem po wyspach liter, by ułożyć słowo',
    featuresTitle: 'Polowanie na słowa z wyspy na wyspę',
    features: [
      ['~', 'Wyspy liter', 'Żadnego koła: litery leżą na wyspach pośrodku morza. Przesuwaj palec, a twoja trasa ułoży słowo.'],
      ['∞', 'Cuda świata', 'Od Pamukkale po Tadź Mahal każdy przystanek to cud świata. W każdym rejsie dziesięć nowych miejsc; podróż nigdy się nie kończy, a łamigłówki stają się coraz większe.'],
      ['★', 'Słowa dodatkowe', 'Znajdź dodatkowe słowa ukryte w literach, by zdobywać diamenty, a gdy utkniesz, odkryj literę podpowiedzią.'],
      ['A', 'Ciekawi cię jakieś słowo?', 'Dotknij znalezionego słowa, by zobaczyć jego znaczenie. Każde słowo w łamigłówkach sprawdzono ręcznie.'],
      ['15', 'Łamigłówki w 15 językach', 'Polski, angielski, turecki, japoński, hindi, arabski i inne; postęp zapisywany jest osobno dla każdego języka.'],
      ['✓', 'Bez zakładania konta', 'Gra nie wymaga rejestracji, więc możesz zacząć od razu. Twój postęp zostaje na twoim urządzeniu.'],
    ],
    shotsTitle: 'Zrzuty ekranu',
    shots: ['Łącz wyspy liter', 'Poziom ukończony: punkty przystanku i cel dzienny', 'Słowa dodatkowe', 'Duża łamigłówka dalej w podróży'],
    attribution: (
      <>
        Znaczenia słów zaadaptowano z pracy współtwórców <a href="https://pl.wiktionary.org/">Wikisłownika</a> (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pl">CC BY-SA 4.0</a>).
      </>
    ),
  },
  ja: {
    title: 'Wordvoya — ことばパズル',
    description:
      '文字の島をつなぎ、クロスワードの言葉を見つけて、ボーナスワードも探そう。終わりのない島めぐりの航海です。',
    og: {
      title: 'Wordvoya — ことばパズル',
      description: '文字の島をつなぎ、言葉を見つけて、終わりのない航海へ出かけよう。',
      image: '/img/og-ja.jpg',
    },
    sub: 'ことばパズル',
    intro:
      '文字は海に浮かぶ島で待っています。島から島へ指をすべらせると、たどったルートが言葉になり、クロスワードに収まります。レベルごとに新しい島、新しい言葉との出会いが待っています。',
    soon: 'Google Playで近日公開',
    iconAlt: 'Wordvoyaのアイコン',
    heroAlt: '文字の島の上で指をすべらせて言葉をつくる',
    featuresTitle: '島から島へ、言葉探しの旅',
    features: [
      ['~', '文字の島', '円ではなく、文字は海に浮かぶ島に並んでいます。指をすべらせると、たどったルートが言葉になります。'],
      ['∞', '世界の不思議', 'パムッカレからタージ・マハルまで、どの寄港地も世界の不思議。1回の航海で新しい10か所を巡り、旅は終わることなく、パズルも大きくなっていきます。'],
      ['★', 'ボーナスワード', '文字の中に隠れた追加の言葉を見つけてダイヤをゲット。行き詰まったら、ヒントで1文字を開けられます。'],
      ['A', '気になる言葉は？', '見つけた言葉をタップすると、意味が見られます。パズルの言葉はすべて1語ずつ確認済みです。'],
      ['15', '15の言語でパズル', '日本語、英語、トルコ語、ヒンディー語、アラビア語など。進行状況は言語ごとに別々に保存されます。'],
      ['✓', 'アカウント不要', '登録なしですぐに始められます。進行状況は端末の中だけに保存されます。'],
    ],
    shotsTitle: 'スクリーンショット',
    shots: ['文字の島をつなごう', 'レベルクリア：寄港地のポイントと毎日の目標', 'ボーナスワード', '航海の先で待つ大きなパズル'],
    attribution: (
      <>
        言葉の意味は、<a href="https://ja.wiktionary.org/">ウィクショナリー</a>の編集者の成果をもとに改変したものです（
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.ja">CC BY-SA 4.0</a>）。
      </>
    ),
  },
  ko: {
    title: 'Wordvoya — 단어 퍼즐',
    description:
      '글자 섬을 이어 크로스워드의 단어를 찾고, 보너스 단어도 사냥해 보세요. 끝나지 않는 섬 항해입니다.',
    og: {
      title: 'Wordvoya — 단어 퍼즐',
      description: '글자 섬을 이어 단어를 찾고, 끝없는 항해를 떠나 보세요.',
      image: '/img/og-ko.jpg',
    },
    sub: '단어 퍼즐',
    intro:
      '글자들은 바다 위 섬에서 기다리고 있습니다. 섬에서 섬으로 손가락을 밀어 보세요. 그린 경로가 단어가 되어 크로스워드에 채워집니다. 레벨마다 새로운 섬, 새로운 단어가 기다립니다.',
    soon: 'Google Play 출시 예정',
    iconAlt: 'Wordvoya 아이콘',
    heroAlt: '글자 섬 위로 손가락을 밀어 단어 만들기',
    featuresTitle: '섬에서 섬으로 이어지는 단어 사냥',
    features: [
      ['~', '글자 섬', '원이 아니라 바다 위 섬에 글자가 놓여 있습니다. 손가락을 밀면 그린 경로가 단어가 됩니다.'],
      ['∞', '세계의 불가사의', '파묵칼레에서 타지마할까지, 모든 기항지가 세계의 불가사의입니다. 한 번의 항해에서 새로운 열 곳을 방문하며, 여정은 끝나지 않고 퍼즐도 계속 커집니다.'],
      ['★', '보너스 단어', '글자 속에 숨은 추가 단어를 찾아 다이아몬드를 모으세요. 막혔을 때는 힌트로 글자 하나를 열 수 있습니다.'],
      ['A', '궁금한 단어가 있나요?', '찾은 단어를 누르면 뜻을 볼 수 있습니다. 퍼즐의 모든 단어는 하나하나 직접 검수했습니다.'],
      ['15', '15개 언어의 퍼즐', '한국어, 영어, 튀르키예어, 일본어, 힌디어, 아랍어 등을 지원하며, 진행 상황은 언어마다 따로 저장됩니다.'],
      ['✓', '계정 불필요', '가입 없이 바로 시작할 수 있습니다. 진행 상황은 기기에만 저장됩니다.'],
    ],
    shotsTitle: '스크린샷',
    shots: ['글자 섬 잇기', '레벨 클리어: 기항지 점수와 일일 목표', '보너스 단어', '항해 후반에 만나는 큰 퍼즐'],
    attribution: (
      <>
        단어 뜻은 <a href="https://ko.wiktionary.org/">위키낱말사전</a> 기여자들의 작업을 바탕으로 변형한 것입니다(
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.ko">CC BY-SA 4.0</a>).
      </>
    ),
  },
  ar: {
    title: 'Wordvoya — لعبة الكلمات',
    description:
      'صِل جزر الحروف، واعثر على الكلمات في الكلمات المتقاطعة، وابحث عن الكلمات الإضافية. رحلة بين الجزر لا تنتهي أبدًا.',
    og: {
      title: 'Wordvoya — لعبة الكلمات',
      description: 'صِل جزر الحروف، واعثر على الكلمات، وانطلق في رحلة لا تنتهي.',
      image: '/img/og-ar.jpg',
    },
    sub: 'لعبة الكلمات',
    intro:
      'الحروف تنتظرك على جزر وسط البحر. مرِّر إصبعك من جزيرة إلى أخرى: يكوّن مسارك كلمة ويملأ الكلمات المتقاطعة. كل مستوى جزيرة جديدة، وكلمات جديدة تنتظر أن تكتشفها.',
    soon: 'قريبًا على Google Play',
    iconAlt: 'أيقونة Wordvoya',
    heroAlt: 'تمرير الإصبع عبر جزر الحروف لتكوين كلمة',
    featuresTitle: 'مطاردة كلمات من جزيرة إلى جزيرة',
    features: [
      ['~', 'جزر الحروف', 'لا عجلة ولا دائرة: الحروف تستقر على جزر وسط البحر. مرِّر إصبعك فيكوّن مسارك الكلمة.'],
      ['∞', 'عجائب الدنيا', 'من باموكالي إلى تاج محل، كل محطة عجيبة من عجائب الدنيا. في كل رحلة تزور عشرة أماكن جديدة؛ ولا تنتهي الرحلة أبدًا وتظل الألغاز تكبر.'],
      ['★', 'كلمات إضافية', 'اعثر على الكلمات الإضافية المخبأة بين الحروف لتكسب الماسات، واكشف حرفًا بتلميح عندما تعلق.'],
      ['A', 'هل تتساءل عن كلمة؟', 'اضغط على كلمة وجدتها لتعرف معناها. روجعت كل كلمة في الألغاز كلمةً كلمة.'],
      ['15', 'ألغاز بـ 15 لغة', 'العربية والإنجليزية والتركية واليابانية والهندية وغيرها؛ ويُحفظ تقدمك بشكل منفصل لكل لغة.'],
      ['✓', 'لا حاجة إلى حساب', 'اللعبة لا تحتاج إلى تسجيل، فيمكنك البدء فورًا. يبقى تقدمك على جهازك.'],
    ],
    shotsTitle: 'لقطات الشاشة',
    shots: ['صِل جزر الحروف', 'اكتمل المستوى: نقاط المحطة والهدف اليومي', 'كلمات إضافية', 'لغز كبير في مرحلة متقدمة من الرحلة'],
    attribution: (
      <>
        معاني الكلمات مقتبسة ومعدَّلة من أعمال المساهمين في <a href="https://ar.wiktionary.org/">ويكاموس</a> (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.ar">CC BY-SA 4.0</a>).
      </>
    ),
  },
  fa: {
    title: 'Wordvoya — بازی کلمات',
    description:
      'جزیره‌های حروف را وصل کن، کلمه‌های جدول کلمات متقاطع را پیدا کن و دنبال کلمه‌های جایزه بگرد. سفری میان جزیره‌ها که هرگز تمام نمی‌شود.',
    og: {
      title: 'Wordvoya — بازی کلمات',
      description: 'جزیره‌های حروف را وصل کن، کلمه‌ها را پیدا کن و به سفری بی‌پایان برو.',
      image: '/img/og-fa.jpg',
    },
    sub: 'بازی کلمات',
    intro:
      'حروف روی جزیره‌هایی در دریا منتظرت هستند. انگشتت را از جزیره‌ای به جزیره‌ی دیگر بکش: مسیرت یک کلمه می‌سازد و جدول کلمات متقاطع را پر می‌کند. هر مرحله یک جزیره‌ی تازه است، با کلمه‌های تازه برای پیدا کردن.',
    soon: 'به‌زودی در Google Play',
    iconAlt: 'آیکون Wordvoya',
    heroAlt: 'کشیدن انگشت روی جزیره‌های حروف برای ساختن یک کلمه',
    featuresTitle: 'شکار کلمه از جزیره‌ای به جزیره‌ی دیگر',
    features: [
      ['~', 'جزیره‌های حروف', 'بدون چرخ: حروف روی جزیره‌هایی در دریا نشسته‌اند. انگشتت را بکش تا مسیرت کلمه را بسازد.'],
      ['∞', 'شگفتی‌های جهان', 'از پاموکاله تا تاج‌محل، هر ایستگاه یکی از شگفتی‌های جهان است. هر سفر ده مکان تازه را می‌بیند؛ این سفر هرگز تمام نمی‌شود و معماها بزرگ‌تر می‌شوند.'],
      ['★', 'کلمه‌های جایزه', 'کلمه‌های اضافیِ پنهان میان حروف را پیدا کن و الماس بگیر؛ وقتی گیر کردی، با یک راهنما یک حرف را آشکار کن.'],
      ['A', 'درباره‌ی یک کلمه کنجکاوی؟', 'روی کلمه‌ای که پیدا کرده‌ای بزن تا معنایش را ببینی. تک‌تک کلمه‌های معماها بررسی شده‌اند.'],
      ['15', 'معما به 15 زبان', 'فارسی، انگلیسی، ترکی، ژاپنی، هندی، عربی و بیشتر؛ پیشرفت برای هر زبان جداگانه نگه داشته می‌شود.'],
      ['✓', 'بدون نیاز به حساب کاربری', 'بازی ثبت‌نام نمی‌خواهد و همین حالا می‌توانی شروع کنی. پیشرفتت فقط روی دستگاه خودت می‌ماند.'],
    ],
    shotsTitle: 'تصاویر صفحه',
    shots: ['جزیره‌های حروف را وصل کن', 'مرحله تمام شد: امتیاز ایستگاه و هدف روزانه', 'کلمه‌های جایزه', 'یک معمای بزرگ در ادامه‌ی سفر'],
    attribution: (
      <>
        معنای کلمه‌ها برگرفته از کار مشارکت‌کنندگان <a href="https://fa.wiktionary.org/">ویکی‌واژه</a> است و تغییر یافته (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>).
      </>
    ),
  },
  hi: {
    title: 'Wordvoya — शब्द पहेली',
    description:
      'अक्षरों के द्वीप जोड़ें, क्रॉसवर्ड के शब्द खोजें और बोनस शब्दों की तलाश करें। द्वीपों के बीच एक सफ़र जो कभी ख़त्म नहीं होता।',
    og: {
      title: 'Wordvoya — शब्द पहेली',
      description: 'अक्षरों के द्वीप जोड़ें, शब्द खोजें और कभी न ख़त्म होने वाले सफ़र पर निकलें।',
      image: '/img/og-hi.jpg',
    },
    sub: 'शब्द पहेली',
    intro:
      'अक्षर समुद्र के द्वीपों पर आपका इंतज़ार कर रहे हैं। उँगली को एक द्वीप से दूसरे द्वीप तक फिराएँ: आपका रास्ता एक शब्द बनाता है और क्रॉसवर्ड में जुड़ जाता है। हर स्तर एक नया द्वीप है, और खोजने के लिए नए शब्द।',
    soon: 'जल्द ही Google Play पर',
    iconAlt: 'Wordvoya आइकन',
    heroAlt: 'अक्षरों के द्वीपों पर उँगली फिराकर एक शब्द बनाना',
    featuresTitle: 'द्वीप से द्वीप तक शब्दों की खोज',
    features: [
      ['~', 'अक्षरों के द्वीप', 'कोई गोल चक्र नहीं: अक्षर समुद्र के द्वीपों पर टिके हैं। उँगली फिराएँ और आपका रास्ता शब्द बना देगा।'],
      ['∞', 'दुनिया के अजूबे', 'पामुक्काले से ताज महल तक, हर पड़ाव दुनिया का एक अजूबा है। हर यात्रा में दस नई जगहें आती हैं; सफ़र कभी ख़त्म नहीं होता और पहेलियाँ बड़ी होती जाती हैं।'],
      ['★', 'बोनस शब्द', 'अक्षरों में छिपे अतिरिक्त शब्द ढूँढ़ें और हीरे कमाएँ; अटक जाएँ तो संकेत से एक अक्षर खोलें।'],
      ['A', 'किसी शब्द के बारे में जानना है?', 'ढूँढ़े हुए शब्द पर टैप करें और उसका अर्थ देखें। पहेली का हर शब्द एक-एक करके जाँचा गया है।'],
      ['15', '15 भाषाओं में पहेली', 'हिंदी, अंग्रेज़ी, तुर्की, जापानी, अरबी और कई अन्य; प्रगति हर भाषा के लिए अलग रखी जाती है।'],
      ['✓', 'खाते की ज़रूरत नहीं', 'खेल में साइन-अप की ज़रूरत नहीं, इसलिए आप तुरंत शुरू कर सकते हैं। आपकी प्रगति सिर्फ़ आपके डिवाइस पर रहती है।'],
    ],
    shotsTitle: 'स्क्रीनशॉट',
    shots: ['अक्षरों के द्वीप जोड़ें', 'स्तर पूरा: पड़ाव के अंक और रोज़ का लक्ष्य', 'बोनस शब्द', 'सफ़र में आगे एक बड़ी पहेली'],
    attribution: (
      <>
        शब्दों के अर्थ <a href="https://hi.wiktionary.org/">विक्षनरी</a> के योगदानकर्ताओं के काम से रूपांतरित किए गए हैं (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>)।
      </>
    ),
  },
};

export const UI_EXTRA: Record<ExtraLang, UiText> = {
  de: {
    features: 'Funktionen',
    featuresId: 'features',
    home: 'Startseite',
    privacy: 'Datenschutz',
    privacyLong: 'Datenschutzerklärung',
    terms: 'Nutzungsbedingungen',
    langName: 'Deutsch',
    updated: 'Zuletzt aktualisiert',
    languages: 'Sprache',
  },
  fr: {
    features: 'Fonctionnalités',
    featuresId: 'features',
    home: 'Accueil',
    privacy: 'Confidentialité',
    privacyLong: 'Politique de confidentialité',
    terms: 'Conditions d’utilisation',
    langName: 'Français',
    updated: 'Dernière mise à jour',
    languages: 'Langue',
  },
  es: {
    features: 'Características',
    featuresId: 'features',
    home: 'Inicio',
    privacy: 'Privacidad',
    privacyLong: 'Política de privacidad',
    terms: 'Términos de uso',
    langName: 'Español',
    updated: 'Última actualización',
    languages: 'Idioma',
  },
  it: {
    features: 'Funzionalità',
    featuresId: 'features',
    home: 'Home',
    privacy: 'Privacy',
    privacyLong: 'Informativa sulla privacy',
    terms: 'Termini di utilizzo',
    langName: 'Italiano',
    updated: 'Ultimo aggiornamento',
    languages: 'Lingua',
  },
  pt: {
    features: 'Recursos',
    featuresId: 'features',
    home: 'Início',
    privacy: 'Privacidade',
    privacyLong: 'Política de Privacidade',
    terms: 'Termos de Uso',
    langName: 'Português',
    updated: 'Última atualização',
    languages: 'Idioma',
  },
  ru: {
    features: 'Возможности',
    featuresId: 'features',
    home: 'Главная',
    privacy: 'Конфиденциальность',
    privacyLong: 'Политика конфиденциальности',
    terms: 'Условия использования',
    langName: 'Русский',
    updated: 'Последнее обновление',
    languages: 'Язык',
  },
  nl: {
    features: 'Functies',
    featuresId: 'features',
    home: 'Home',
    privacy: 'Privacy',
    privacyLong: 'Privacybeleid',
    terms: 'Gebruiksvoorwaarden',
    langName: 'Nederlands',
    updated: 'Laatst bijgewerkt',
    languages: 'Taal',
  },
  pl: {
    features: 'Funkcje',
    featuresId: 'features',
    home: 'Strona główna',
    privacy: 'Prywatność',
    privacyLong: 'Polityka prywatności',
    terms: 'Warunki korzystania',
    langName: 'Polski',
    updated: 'Ostatnia aktualizacja',
    languages: 'Język',
  },
  ja: {
    features: '特長',
    featuresId: 'features',
    home: 'ホーム',
    privacy: 'プライバシー',
    privacyLong: 'プライバシーポリシー',
    terms: '利用規約',
    langName: '日本語',
    updated: '最終更新',
    languages: '言語',
  },
  ko: {
    features: '특징',
    featuresId: 'features',
    home: '홈',
    privacy: '개인정보',
    privacyLong: '개인정보 처리방침',
    terms: '이용약관',
    langName: '한국어',
    updated: '최종 업데이트',
    languages: '언어',
  },
  ar: {
    features: 'المزايا',
    featuresId: 'features',
    home: 'الرئيسية',
    privacy: 'الخصوصية',
    privacyLong: 'سياسة الخصوصية',
    terms: 'شروط الاستخدام',
    langName: 'العربية',
    updated: 'آخر تحديث',
    languages: 'اللغة',
  },
  fa: {
    features: 'ویژگی‌ها',
    featuresId: 'features',
    home: 'خانه',
    privacy: 'حریم خصوصی',
    privacyLong: 'سیاست حریم خصوصی',
    terms: 'شرایط استفاده',
    langName: 'فارسی',
    updated: 'آخرین به‌روزرسانی',
    languages: 'زبان',
  },
  hi: {
    features: 'विशेषताएँ',
    featuresId: 'features',
    home: 'होम',
    privacy: 'गोपनीयता',
    privacyLong: 'गोपनीयता नीति',
    terms: 'उपयोग की शर्तें',
    langName: 'हिन्दी',
    updated: 'अंतिम अपडेट',
    languages: 'भाषा',
  },
};
