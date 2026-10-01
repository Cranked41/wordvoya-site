// Gizlilik politikası ve kullanım şartları: İspanyolca çevirisi (kaynak: Privacy.tsx / Terms.tsx İngilizce).
// JSX'te satır sonu ile etiket arasındaki boşluk düşer: metinle bağlantıyı aynı satırda tut.
import { DocPage, Mail } from '../../Layout';
import { PATHS } from '../../site';

export function Privacy() {
  return (
    <DocPage
      lang="es"
      page="privacy"
      title="Política de privacidad"
      updated="30 de septiembre de 2026"
      description="Wordvoya no necesita cuenta y los datos de su juego permanecen en su dispositivo. Los anuncios los sirve Google AdMob y las compras se realizan a través de Google Play."
    >
      <p className="note">
        Esta es una traducción facilitada por comodidad; si difiere de la <a href={PATHS.en.privacy}>versión en inglés</a>, prevalece la versión en inglés.
      </p>
      <p>
        Esta política explica qué datos se procesan cuando usted utiliza la aplicación para Android <strong>Wordvoya: Puzle de palabras</strong> (<code>com.cranked.wordvoya</code>) y este sitio web.
      </p>
      <p className="lead">
        <strong>En resumen:</strong> Wordvoya no necesita cuenta y no envía ningún dato a nuestros servidores; los datos de su
        juego permanecen en su dispositivo. La aplicación muestra anuncios de Google AdMob, y Google puede utilizar el ID de
        publicidad de su dispositivo y cierta información técnica para mostrarlos. La compra «Quitar anuncios» se realiza a
        través de Google Play.
      </p>

      <h2>Datos que recopilamos</h2>
      <ul>
        <li>
          <strong>Sin cuenta:</strong> La aplicación no le pide que se registre ni que inicie sesión, y no recibe su nombre,
          su dirección de correo electrónico ni ningún otro identificador.
        </li>
        <li>
          <strong>Datos de juego en su dispositivo:</strong> El progreso de los niveles, las palabras encontradas, la racha
          diaria y la meta diaria, los diamantes y los ajustes se almacenan únicamente en su dispositivo y no se nos envían.
        </li>
        <li>
          <strong>Anuncios (Google AdMob):</strong> Para mostrar y medir los anuncios y para prevenir el fraude, Google puede
          procesar el ID de publicidad de su dispositivo, su dirección IP (ubicación aproximada), información del dispositivo
          y de la aplicación, y sus interacciones con los anuncios. Estos datos van directamente a Google; nosotros no
          tenemos acceso a ellos.
        </li>
        <li>
          <strong>Compras:</strong> Los paquetes de diamantes y la eliminación de anuncios se compran mediante Google Play
          Billing. Nunca tenemos acceso a sus datos de pago (número de tarjeta, etc.); la aplicación solo averigua a través
          de Google Play qué se ha comprado y lo almacena en su dispositivo (incluido el token de compra, para que una misma
          compra no se contabilice dos veces).
        </li>
        <li>
          <strong>Clasificación (Google Play Games, opcional):</strong> Sus puntos se acumulan en su dispositivo. Si inicia
          sesión con Google Play Games, sus puntos totales y semanales, el nivel que ha alcanzado, el número de palabras que
          ha encontrado y el tiempo que tardó en terminar su último nivel se envían a Google junto con el nombre de su perfil
          de Play Games y se muestran a otros jugadores en la clasificación. Si no inicia sesión, no se envía nada de esto.
          En los ajustes de Play Games puede controlar quién ve su perfil y eliminar sus datos de juego.
        </li>
      </ul>

      <h2>Sus opciones sobre los anuncios</h2>
      <ul>
        <li>
          <strong>Espacio Económico Europeo, Reino Unido y Suiza:</strong> Antes de que se muestre cualquier anuncio, aparece
          el formulario de consentimiento de Google y usted puede permitir o rechazar los anuncios personalizados. Puede
          cambiar su elección más adelante en la aplicación, en <em>Ajustes &gt; Tienda y anuncios &gt; Opciones de privacidad de anuncios</em>.
        </li>
        <li>
          <strong>ID de publicidad:</strong> Puede restablecer o eliminar su ID de publicidad en los ajustes de su dispositivo
          (Google &gt; Anuncios).
        </li>
        <li>
          <strong>Juego sin anuncios:</strong> La compra «Quitar anuncios» o «Sin anuncios + 500 diamantes» elimina los
          anuncios entre niveles. Los anuncios con recompensa para conseguir tiempo extra o una vida son siempre opcionales.
        </li>
      </ul>

      <h2>Cómo se utilizan los datos</h2>
      <p>
        Los datos de su dispositivo se utilizan únicamente para hacer funcionar el juego: para recordar su nivel actual y las
        palabras que ha encontrado, y para contar su racha y su meta diaria. Nunca se envían a nosotros ni a terceros y nunca
        se venden. Google procesa los datos de los anuncios para los fines descritos anteriormente.
      </p>

      <h2>Servicios de terceros</h2>
      <ul>
        <li>
          <strong>Google AdMob</strong> (anuncios): consulte <a href="https://policies.google.com/technologies/partner-sites?hl=es">cómo utiliza Google los datos de las aplicaciones de sus socios</a> y la <a href="https://policies.google.com/privacy?hl=es">política de privacidad</a> de Google.
        </li>
        <li>
          <strong>Google Play</strong> (distribución y facturación): se aplica la política de privacidad de Google.
        </li>
        <li>
          <strong>Copia de seguridad de Android:</strong> Si la copia de seguridad de Android está activada, el sistema puede
          incluir los datos de su juego en la copia de seguridad de su cuenta de Google y restaurarlos en un dispositivo
          nuevo. Google gestiona esa copia de seguridad; nosotros no tenemos acceso a ella.
        </li>
      </ul>

      <h2>Este sitio web</h2>
      <p>
        Este sitio no utiliza cookies ni carga recursos de terceros (fuentes, analítica o anuncios). Nuestro servidor puede
        conservar durante un breve periodo registros de acceso estándar (dirección IP, información del navegador, página
        solicitada, hora) por motivos de seguridad y para la resolución de problemas; no se utilizan para ningún otro fin.
      </p>

      <h2>Conservación y eliminación de datos</h2>
      <p>
        Los datos de su juego permanecen en su dispositivo. Para eliminarlos, desinstale la aplicación o utilice <em>Ajustes &gt; Datos &gt; Reiniciar progreso</em> en la aplicación. No conservamos en nuestros servidores ninguna cuenta ni registro de juego sobre usted. Los datos que Google procesa
        para los anuncios están sujetos a las políticas de Google; puede gestionarlos en <a href="https://myadcenter.google.com/">Mi centro de anuncios</a>.
      </p>

      <h2>Privacidad de los menores</h2>
      <p>
        La aplicación está pensada para el público general y no está dirigida a menores de 13 años. No recopilamos a sabiendas
        datos personales de menores de 13 años.
      </p>

      <h2>Cambios</h2>
      <p>
        Cuando esta política cambia, la nueva versión se publica en esta página y se modifica la fecha de «última
        actualización». Si se añade a la aplicación una nueva función que procese datos, esta página se actualizará antes de
        que esa función se publique.
      </p>

      <h2>Contacto</h2>
      <p>
        Si tiene preguntas: <Mail />
      </p>
    </DocPage>
  );
}

export function Terms() {
  return (
    <DocPage
      lang="es"
      page="terms"
      title="Términos de uso"
      updated="1 de octubre de 2026"
      description="Términos de uso de la aplicación Wordvoya — Puzle de palabras."
    >
      <p className="note">
        Esta es una traducción facilitada por comodidad; si difiere de la <a href={PATHS.en.terms}>versión en inglés</a>, prevalece la versión en inglés.
      </p>
      <p>
        Al descargar o utilizar la aplicación <strong>Wordvoya: Puzle de palabras</strong>, usted acepta los siguientes términos.
      </p>

      <h2>Licencia</h2>
      <p>
        La aplicación se le proporciona bajo una licencia limitada e intransferible para uso personal y no comercial. No puede
        copiar, modificar, aplicar ingeniería inversa ni redistribuir la aplicación. El contenido de palabras con licencia
        abierta que se describe a continuación queda excluido de esta restricción.
      </p>

      <h2>Contenido de palabras y fuentes</h2>
      <ul>
        <li>
          Los significados de las palabras están adaptados del trabajo de los colaboradores de <a href="https://www.wiktionary.org/">Wikcionario</a>: el Wikcionario propio de cada idioma del puzle y el Wikcionario en inglés, principalmente mediante la extracción de <a href="https://kaikki.org/">kaikki.org</a>.
        </li>
        <li>
          Las frecuencias de las palabras proceden de las listas <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (OpenSubtitles) y <a href="https://github.com/rspeer/wordfreq">wordfreq</a>.
        </li>
        <li>
          Las listas de palabras y los paquetes de niveles derivados de estas fuentes se proporcionan bajo la licencia <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es">CC BY-SA 4.0</a>. El código de la aplicación, su diseño y el nombre Wordvoya no están cubiertos por esa licencia.
        </li>
        <li>
          Los significados se revisaron uno por uno, pero no se garantiza que estén completos ni libres de errores. La
          aplicación está pensada para el entretenimiento y no sustituye a un diccionario oficial. Si detecta una palabra
          incorrecta, por favor, comuníquenoslo.
        </li>
      </ul>

      <h2>Diamantes</h2>
      <p>
        Los diamantes son objetos virtuales que se utilizan únicamente en el juego, para pistas y para conseguir tiempo extra
        en los niveles con tiempo. Se obtienen jugando (recompensas por palabras extra; terminar un nivel da puntos, no
        diamantes) o comprándolos a través de Google Play; los anuncios no dan diamantes. No tienen valor monetario, no pueden
        canjearse por dinero en efectivo, no son reembolsables (salvo que la ley disponga lo contrario y con sujeción a las
        políticas de reembolso de Google Play) y no pueden transferirse a nadie más.
      </p>
      <p>
        Los diamantes se almacenan únicamente en su dispositivo; como no hay cuenta, no pueden trasladarse a otro dispositivo.
        Reiniciar el progreso conserva sus diamantes, pero desinstalar la aplicación o borrar sus datos elimina todos los
        diamantes, incluidos los comprados, y no pueden restaurarse.
      </p>

      <h2>Anuncios</h2>
      <p>
        La aplicación es gratuita y se financia con anuncios de Google AdMob: puede mostrarse un anuncio a pantalla completa
        entre algunos niveles, y ver un anuncio con recompensa para conseguir tiempo extra o una vida es siempre opcional. Los
        anunciantes y Google son responsables del contenido de los anuncios. Los sitios y aplicaciones a los que acceda a
        través de un anuncio se rigen por sus propios términos.
      </p>

      <h2>Compras</h2>
      <p>
        Todas las compras se realizan en la <em>Tienda</em> de la aplicación a través de Google Play; el pago, los reembolsos y
        la facturación están sujetos a los términos de Google Play.
      </p>
      <ul>
        <li>
          <strong>Los paquetes de diamantes</strong> son consumibles: los diamantes se añaden a su saldo de inmediato y se
          agotan a medida que los gasta. Como los diamantes se almacenan en su dispositivo, no se restauran tras desinstalar
          la aplicación (véase Diamantes).
        </li>
        <li>
          <strong>«Quitar anuncios»</strong> y <strong>«Sin anuncios + 500 diamantes»</strong> son compras únicas que eliminan los anuncios entre niveles. Los anuncios con recompensa opcionales siguen disponibles para quien quiera tiempo extra o una vida. La eliminación de anuncios está vinculada a su cuenta de Google y, tras reinstalar la aplicación o en un dispositivo nuevo, puede recuperarla en <em>Tienda &gt; Restaurar compras</em> (los 500 diamantes del paquete se entregan una sola vez).
        </li>
      </ul>

      <h2>Disponibilidad</h2>
      <p>
        No garantizamos que la aplicación funcione sin interrupciones ni errores. Las funciones, los niveles y el contenido de
        palabras pueden añadirse, modificarse o eliminarse sin previo aviso.
      </p>

      <h2>Limitación de responsabilidad</h2>
      <p>
        La aplicación se proporciona «tal cual». En la medida en que lo permita la legislación aplicable, el desarrollador no
        es responsable de los daños indirectos derivados del uso de la aplicación.
      </p>

      <h2>Privacidad</h2>
      <p>
        La aplicación no necesita cuenta y los datos de su juego permanecen en su dispositivo; consulte la <a href={PATHS.es.privacy}>Política de privacidad</a> para más información, incluidos los datos que Google procesa para los anuncios.
      </p>

      <h2>Cambios</h2>
      <p>
        Cuando estos términos cambien, la nueva versión se publicará en esta página. Seguir utilizando la aplicación después
        de una actualización significa que usted acepta los nuevos términos.
      </p>

      <h2>Contacto</h2>
      <p>
        Si tiene preguntas o desea informar de una palabra incorrecta: <Mail />
      </p>
    </DocPage>
  );
}
