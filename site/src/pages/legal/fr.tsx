// Gizlilik politikası ve kullanım şartları: Fransızca çevirisi (kaynak: Privacy.tsx / Terms.tsx İngilizce).
// JSX'te satır sonu ile etiket arasındaki boşluk düşer: metinle bağlantıyı aynı satırda tut.
import { DocPage, Mail } from '../../Layout';
import { PATHS } from '../../site';

export function Privacy() {
  return (
    <DocPage
      lang="fr"
      page="privacy"
      title="Politique de confidentialité"
      updated="2 octobre 2026"
      description="Wordvoya ne demande aucun compte et vos données de jeu restent sur votre appareil. Les publicités sont diffusées par Google AdMob dans l’application et par Google AdSense sur ce site ; les achats passent par Google Play."
    >
      <p className="note">
        Ceci est une traduction fournie à titre de commodité ; en cas de divergence avec la <a href={PATHS.en.privacy}>version anglaise</a>, la version anglaise prévaut.
      </p>
      <p>
        Cette politique explique quelles données sont traitées lorsque vous utilisez l’application Android <strong>Wordvoya : Jeu de mots</strong> (<code>com.cranked.wordvoya</code>) et ce site web.
      </p>
      <p className="lead">
        <strong>En bref :</strong> Wordvoya ne demande aucun compte et n’envoie aucune donnée à nos serveurs ; vos données de
        jeu restent sur votre appareil. L’application affiche des publicités de Google AdMob, et Google peut utiliser
        l’identifiant publicitaire de votre appareil ainsi que certaines informations techniques pour les diffuser. L’achat
        « Supprimer les pubs » s’effectue via Google Play.
      </p>

      <h2>Données que nous collectons</h2>
      <ul>
        <li>
          <strong>Aucun compte :</strong> L’application ne vous demande ni de vous inscrire ni de vous connecter, et elle ne
          reçoit ni votre nom, ni votre adresse e-mail, ni aucun autre identifiant.
        </li>
        <li>
          <strong>Données de jeu sur votre appareil :</strong> La progression par niveau, les mots trouvés, la série
          quotidienne et l’objectif quotidien, les diamants et les paramètres sont stockés uniquement sur votre appareil et
          ne nous sont pas envoyés.
        </li>
        <li>
          <strong>Publicités (Google AdMob) :</strong> Pour diffuser et mesurer les publicités et pour prévenir la fraude,
          Google peut traiter l’identifiant publicitaire de votre appareil, votre adresse IP (localisation approximative),
          des informations sur l’appareil et l’application, ainsi que vos interactions avec les publicités. Ces données vont
          directement à Google ; nous n’y avons pas accès.
        </li>
        <li>
          <strong>Achats :</strong> Les packs de diamants et la suppression des publicités s’achètent via Google Play Billing.
          Nous n’avons jamais accès à vos informations de paiement (numéro de carte, etc.) ; l’application apprend seulement
          de Google Play ce qui a été acheté et le stocke sur votre appareil (y compris le jeton d’achat, afin qu’un même
          achat ne soit pas compté deux fois).
        </li>
        <li>
          <strong>Classement (Google Play Games, facultatif) :</strong> Vos points s’accumulent sur votre appareil. Si vous
          vous connectez à Google Play Games, vos points totaux et hebdomadaires, le niveau atteint, le nombre de mots
          trouvés et le temps que vous avez mis pour terminer votre dernier niveau sont envoyés à Google avec le nom de votre
          profil Play Games et affichés aux autres joueurs dans le classement. Si vous ne vous connectez pas, rien de tout
          cela n’est envoyé. Vous pouvez gérer qui voit votre profil, et supprimer vos données de jeu, dans les paramètres de
          Play Games.
        </li>
      </ul>

      <h2>Vos choix en matière de publicité</h2>
      <ul>
        <li>
          <strong>Espace économique européen, Royaume-Uni et Suisse :</strong> Avant l’affichage de toute publicité, le
          formulaire de consentement de Google apparaît et vous pouvez autoriser ou refuser les publicités personnalisées.
          Vous pouvez modifier votre choix ultérieurement dans l’application, sous <em>Paramètres &gt; Boutique et publicités &gt; Options de confidentialité des publicités</em>.
        </li>
        <li>
          <strong>Identifiant publicitaire :</strong> Vous pouvez réinitialiser ou supprimer votre identifiant publicitaire
          dans les paramètres de votre appareil (Google &gt; Annonces).
        </li>
        <li>
          <strong>Jeu sans publicité :</strong> L’achat « Supprimer les pubs » ou « Sans pub + 500 diamants » supprime les
          publicités entre les niveaux. Les publicités avec récompense pour du temps supplémentaire ou une vie sont toujours
          facultatives.
        </li>
      </ul>

      <h2>Utilisation des données</h2>
      <p>
        Les données de votre appareil servent uniquement au fonctionnement du jeu : mémoriser votre niveau actuel et les mots
        que vous avez trouvés, et comptabiliser votre série et votre objectif quotidien. Elles ne sont jamais envoyées à
        nous ni à des tiers, et ne sont jamais vendues. Les données publicitaires sont traitées par Google aux fins décrites
        ci-dessus.
      </p>

      <h2>Services tiers</h2>
      <ul>
        <li>
          <strong>Google AdMob</strong> (publicités) : voir <a href="https://policies.google.com/technologies/partner-sites?hl=fr">comment Google utilise les données des applications partenaires</a> et la <a href="https://policies.google.com/privacy?hl=fr">politique de confidentialité</a> de Google.
        </li>
        <li>
          <strong>Google Play</strong> (distribution et facturation) : la politique de confidentialité de Google s’applique.
        </li>
        <li>
          <strong>Sauvegarde Android :</strong> Si la sauvegarde Android est activée, le système peut inclure vos données de
          jeu dans la sauvegarde de votre compte Google et les restaurer sur un nouvel appareil. Cette sauvegarde est gérée
          par Google ; nous n’y avons pas accès.
        </li>
      </ul>

      <h2>Ce site web</h2>
      <p>
        Ce site affiche des publicités de <strong>Google AdSense</strong>. Google et ses partenaires utilisent des cookies et des technologies similaires pour afficher et mesurer les publicités, pour diffuser des publicités personnalisées (en fonction de vos visites sur ce site et sur d’autres sites web) et pour prévenir la fraude. Voir <a href="https://policies.google.com/technologies/partner-sites?hl=fr">comment Google utilise les informations des sites qui utilisent ses services</a>. Vous pouvez désactiver les publicités personnalisées dans les <a href="https://adssettings.google.com/">Paramètres des annonces Google</a> et refuser l’utilisation de cookies par des fournisseurs tiers sur <a href="https://www.aboutads.info/">www.aboutads.info</a>. Dans l’Espace économique européen, au Royaume-Uni et en Suisse, les publicités personnalisées ne sont affichées qu’avec votre consentement.
      </p>
      <p>
        En dehors des publicités, le site ne dépose aucun cookie qui lui soit propre et ne charge aucun outil d’analyse. Notre
        serveur peut conserver pendant une courte période des journaux d’accès standard (adresse IP, informations sur le
        navigateur, page demandée, heure) à des fins de sécurité et de dépannage ; ils ne sont utilisés à aucune autre fin.
      </p>

      <h2>Conservation et suppression des données</h2>
      <p>
        Vos données de jeu restent sur votre appareil. Pour les supprimer, désinstallez l’application ou utilisez <em>Paramètres &gt; Données &gt; Réinitialiser la progression</em> dans l’application. Nous ne conservons sur nos serveurs aucun compte ni aucun enregistrement de jeu vous concernant. Les données traitées par Google
        à des fins publicitaires sont soumises aux politiques de Google ; vous pouvez les gérer dans <a href="https://myadcenter.google.com/">Mon Centre d’annonces</a>.
      </p>

      <h2>Protection de la vie privée des enfants</h2>
      <p>
        L’application s’adresse au grand public et ne vise pas les enfants de moins de 13 ans. Nous ne collectons pas sciemment
        de données personnelles auprès d’enfants de moins de 13 ans.
      </p>

      <h2>Modifications</h2>
      <p>
        Lorsque cette politique change, la nouvelle version est publiée sur cette page et la date de « dernière mise à jour »
        est modifiée. Si une nouvelle fonctionnalité traitant des données est ajoutée à l’application, cette page sera mise à
        jour avant la publication de cette fonctionnalité.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question : <Mail />
      </p>
    </DocPage>
  );
}

export function Terms() {
  return (
    <DocPage
      lang="fr"
      page="terms"
      title="Conditions d’utilisation"
      updated="2 octobre 2026"
      description="Conditions d’utilisation de l’application Wordvoya — Jeu de mots."
    >
      <p className="note">
        Ceci est une traduction fournie à titre de commodité ; en cas de divergence avec la <a href={PATHS.en.terms}>version anglaise</a>, la version anglaise prévaut.
      </p>
      <p>
        En téléchargeant ou en utilisant l’application <strong>Wordvoya : Jeu de mots</strong>, vous acceptez les conditions suivantes.
      </p>

      <h2>Licence</h2>
      <p>
        L’application vous est fournie dans le cadre d’une licence limitée et non transférable, pour un usage personnel et non
        commercial. Vous ne pouvez ni copier, ni modifier, ni soumettre à une ingénierie inverse, ni redistribuer
        l’application. Le contenu lexical sous licence libre décrit ci-dessous est exclu de cette restriction.
      </p>

      <h2>Contenu lexical et sources</h2>
      <ul>
        <li>
          Les définitions des mots sont adaptées du travail des contributeurs du <a href="https://www.wiktionary.org/">Wiktionnaire</a> : le Wiktionnaire propre à chaque langue de puzzle et le Wiktionnaire anglais, principalement via l’extraction de <a href="https://kaikki.org/">kaikki.org</a>.
        </li>
        <li>
          Les fréquences des mots proviennent des listes <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (OpenSubtitles) et <a href="https://github.com/rspeer/wordfreq">wordfreq</a>.
        </li>
        <li>
          Les listes de mots et les packs de niveaux dérivés de ces sources sont fournis sous licence <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr">CC BY-SA 4.0</a>. Le code de l’application, son design et le nom Wordvoya ne sont pas couverts par cette licence.
        </li>
        <li>
          Les définitions ont été relues une par une, mais rien ne garantit qu’elles soient complètes ou exemptes d’erreurs.
          L’application est destinée au divertissement et ne remplace pas un dictionnaire officiel. Si vous repérez un mot
          erroné, merci de nous le signaler.
        </li>
      </ul>

      <h2>Diamants</h2>
      <p>
        Les diamants sont des objets virtuels utilisés uniquement dans le jeu, pour les indices et pour obtenir du temps
        supplémentaire dans les niveaux chronométrés. Vous les obtenez en les achetant via Google Play, et les
        nouveaux joueurs commencent avec 100 diamants ; jouer (trouver des mots et terminer des niveaux) rapporte des
        points, pas des diamants, et les publicités ne donnent pas de diamants. Ils n’ont aucune valeur monétaire, ne
        peuvent pas être échangés contre de l’argent, ne sont pas
        remboursables (sauf lorsque la loi en dispose autrement et sous réserve des politiques de remboursement de Google
        Play) et ne peuvent être transférés à personne d’autre.
      </p>
      <p>
        Les diamants sont stockés uniquement sur votre appareil ; comme il n’y a pas de compte, ils ne peuvent pas être
        transférés vers un autre appareil. La réinitialisation de la progression conserve vos diamants, mais la
        désinstallation de l’application ou l’effacement de ses données supprime tous les diamants, y compris ceux qui ont
        été achetés, et ils ne peuvent pas être restaurés.
      </p>

      <h2>Publicités</h2>
      <p>
        L’application est gratuite et financée par les publicités de Google AdMob : une publicité plein écran peut s’afficher
        entre certains niveaux, et regarder une publicité avec récompense pour obtenir du temps supplémentaire ou une vie est
        toujours facultatif. Les annonceurs et Google sont responsables du contenu des publicités. Les sites et applications
        auxquels vous accédez via une publicité sont régis par leurs propres conditions.
      </p>

      <h2>Achats</h2>
      <p>
        Tous les achats s’effectuent dans la <em>Boutique</em> de l’application via Google Play ; le paiement, les remboursements
        et la facturation sont soumis aux conditions de Google Play.
      </p>
      <ul>
        <li>
          <strong>Les packs de diamants</strong> sont consommables : les diamants sont ajoutés immédiatement à votre solde et
          s’épuisent au fur et à mesure que vous les dépensez. Les diamants étant stockés sur votre appareil, ils ne sont pas
          restaurés après la désinstallation de l’application (voir Diamants).
        </li>
        <li>
          <strong>« Supprimer les pubs »</strong> et <strong>« Sans pub + 500 diamants »</strong> sont des achats uniques qui suppriment les publicités entre les niveaux. Les publicités avec récompense facultatives restent disponibles pour quiconque souhaite du temps supplémentaire ou une vie. La suppression des publicités est liée à votre compte Google, et après une réinstallation de l’application ou sur un nouvel appareil, vous pouvez la récupérer sous <em>Boutique &gt; Restaurer les achats</em> (les 500 diamants du pack ne sont attribués qu’une seule fois).
        </li>
      </ul>

      <h2>Disponibilité</h2>
      <p>
        Nous ne garantissons pas que l’application fonctionnera sans interruption ni erreur. Les fonctionnalités, les niveaux
        et le contenu lexical peuvent être ajoutés, modifiés ou supprimés sans préavis.
      </p>

      <h2>Limitation de responsabilité</h2>
      <p>
        L’application est fournie « telle quelle ». Dans la mesure permise par la loi applicable, le développeur n’est pas
        responsable des dommages indirects résultant de l’utilisation de l’application.
      </p>

      <h2>Confidentialité</h2>
      <p>
        L’application ne nécessite aucun compte et vos données de jeu restent sur votre appareil ; consultez la <a href={PATHS.fr.privacy}>Politique de confidentialité</a> pour plus de détails, y compris les données que Google traite à des fins publicitaires.
      </p>

      <h2>Modifications</h2>
      <p>
        Lorsque ces conditions changent, la nouvelle version est publiée sur cette page. Continuer à utiliser l’application
        après une mise à jour signifie que vous acceptez les nouvelles conditions.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question et pour signaler un mot erroné : <Mail />
      </p>
    </DocPage>
  );
}
