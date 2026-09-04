import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Política de Privacidad | INVICTO",
  description:
    "Política de Privacidad de INVICTO. Cómo recolectamos, usamos, protegemos y transferimos tus datos personales conforme a la Ley 1581 de 2012 de Colombia.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Política de Privacidad" lastUpdated="Marzo de 2026">
      <p>
        La presente Política de Privacidad describe la forma en que <strong>INVICTO</strong> recolecta, utiliza,
        almacena, protege y trata los datos personales de las personas que utilizan la plataforma, el sitio web y los
        servicios relacionados (en adelante, la &ldquo;Plataforma&rdquo;). Esta política se rige por la legislación
        colombiana y, en particular, por la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas concordantes en
        materia de protección de datos personales.
      </p>

      <p>
        Al registrarse y utilizar la Plataforma, la persona titular de los datos acepta las condiciones descritas en
        este documento.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        INVICTO es un proyecto operado por su equipo fundador desde Colombia. La sociedad comercial que operará
        formalmente la Plataforma se encuentra en proceso de constitución; una vez inscrita en Cámara de Comercio, esta
        política será actualizada para reflejar la razón social, NIT y domicilio correspondientes.
      </p>
      <p>
        Mientras tanto, cualquier solicitud, consulta, reclamo o ejercicio de derechos relacionados con datos
        personales puede dirigirse al canal oficial de atención:
      </p>
      <div className="callout">
        <p>
          <strong>Correo de contacto para protección de datos:</strong>
          <br />
          <a href="mailto:privacidad@invictoapp.com.co">privacidad@invictoapp.com.co</a>
        </p>
      </div>

      <h2>2. Información que recolectamos</h2>

      <h3>2.1 Datos de identificación y contacto</h3>
      <ul>
        <li>Nombre y apellidos.</li>
        <li>Nombre de usuario.</li>
        <li>Correo electrónico.</li>
        <li>Contraseña (almacenada de forma cifrada mediante algoritmo bcrypt).</li>
        <li>Número de teléfono.</li>
        <li>Fecha de nacimiento.</li>
        <li>Sexo (masculino, femenino o no especificado).</li>
        <li>País, departamento y ciudad de residencia (ingresados como texto por la persona usuaria).</li>
        <li>Foto de perfil (opcional).</li>
      </ul>

      <h3>2.2 Datos deportivos (perfil de Jugador)</h3>
      <ul>
        <li>Estatura y peso.</li>
        <li>Pie dominante.</li>
        <li>Estado deportivo (disponible, lesionado, en temporada).</li>
        <li>Posiciones en cancha.</li>
        <li>Estadísticas por temporada: partidos jugados, goles, asistencias, tarjetas amarillas y rojas.</li>
        <li>Club, categoría y logros deportivos que la persona decida compartir.</li>
      </ul>

      <h3>2.3 Datos profesionales (perfil de Ojeador)</h3>
      <ul>
        <li>Club al que representa (si aplica) o condición de ojeador independiente.</li>
        <li>Años de experiencia.</li>
        <li>Categorías en las que trabaja.</li>
        <li>Documentos de identidad y licencia profesional (opcionales; ver sección 2.5).</li>
      </ul>

      <h3>2.4 Datos institucionales (perfil de Club)</h3>
      <ul>
        <li>Nombre del club o institución.</li>
        <li>Nombre y cargo del representante legal.</li>
        <li>Correo institucional y teléfono de contacto.</li>
        <li>Tipo de institución (escolar/amateur, semiprofesional, profesional).</li>
        <li>Dirección y ubicación de la institución.</li>
        <li>Categorías deportivas atendidas.</li>
        <li>Documentos de identidad y credencial deportiva (opcionales; ver sección 2.5).</li>
      </ul>

      <h3>2.5 Documentos de verificación</h3>
      <p>
        Los perfiles de Ojeador y Club pueden aportar de forma opcional documentos de identificación oficial y
        credenciales deportivas (PDF, JPG o PNG, hasta 10 MB) con fines exclusivos de verificación. Estos documentos
        se almacenan en la infraestructura de la Plataforma y no se comparten con otras personas usuarias.
      </p>

      <h3>2.6 Contenido generado por la persona usuaria</h3>
      <ul>
        <li>Fotografías y videos publicados en el perfil, en publicaciones (posts) o en historias (stories).</li>
        <li>Textos, descripciones, ubicaciones libres y comentarios.</li>
        <li>Interacciones dentro de la Plataforma: seguimientos, &ldquo;me gusta&rdquo;, calificaciones, bloqueos y
          términos de búsqueda recientes.</li>
      </ul>
      <p>
        Los metadatos de geolocalización (EXIF) de las fotos son eliminados antes de subirse al servidor.
      </p>

      <h3>2.7 Datos técnicos y de comunicación</h3>
      <ul>
        <li>Token de notificaciones push del dispositivo, cuando la persona usuaria acepta recibirlas.</li>
        <li>Identificador interno de cuenta.</li>
        <li>Códigos de verificación de correo y de recuperación de contraseña (vigencia limitada, entre 60 segundos y
          10 minutos).</li>
      </ul>
      <p>
        La aplicación móvil <strong>no</strong> utiliza herramientas de analítica de terceros (Google Analytics,
        Firebase Analytics, Meta Pixel, Mixpanel, Amplitude, etc.), <strong>no</strong> integra SDKs de publicidad y{" "}
        <strong>no</strong> rastrea a la persona usuaria a través de otras aplicaciones o sitios web. Tampoco
        almacenamos dirección IP ni user-agent en nuestros sistemas de aplicación (los proveedores de infraestructura
        pueden mantener este dato a nivel de servidor con fines técnicos y de seguridad).
      </p>

      <h2>3. Finalidades del tratamiento</h2>
      <p>Los datos personales son tratados con las siguientes finalidades:</p>
      <ul>
        <li>Crear, administrar y mantener la cuenta y el perfil deportivo de la persona usuaria.</li>
        <li>Permitir la interacción entre jugadores, ojeadores, clubes y otras personas usuarias registradas.</li>
        <li>Mostrar el contenido publicado dentro de la Plataforma a otras personas usuarias autorizadas.</li>
        <li>Enviar notificaciones push relacionadas con la actividad de la cuenta (nuevos seguidores, comentarios,
          calificaciones, entre otros).</li>
        <li>Enviar correos electrónicos transaccionales (verificación de correo, recuperación de contraseña).</li>
        <li>Verificar la identidad y credenciales de perfiles profesionales (Ojeadores y Clubes) cuando aporten
          documentos.</li>
        <li>Prevenir y detectar fraude, suplantación, abuso o uso indebido de la Plataforma.</li>
        <li>Mejorar los servicios, la experiencia de uso y las funcionalidades ofrecidas.</li>
        <li>Cumplir con obligaciones legales y requerimientos de autoridad competente.</li>
      </ul>

      <h2>4. Visibilidad del perfil y del contenido</h2>
      <p>
        La finalidad central de INVICTO es dar visibilidad al talento deportivo. Por ello, los perfiles y el contenido
        publicado son visibles, dentro de la Plataforma, a otras personas usuarias registradas, incluyendo jugadores,
        ojeadores, clubes, academias y organizaciones deportivas. Al publicar contenido, la persona usuaria acepta
        expresamente esta visibilidad.
      </p>
      <p>
        Las publicaciones individuales pueden marcarse como públicas o privadas según lo decida su autor. Las fotos de
        perfil, sin embargo, son servidas a través de una red de distribución de contenido (CDN) y su URL puede ser
        accesible por cualquier persona que la posea; recomendamos no incluir información sensible visible en la foto
        de perfil.
      </p>

      <h2>5. Con quién compartimos la información</h2>
      <p>
        INVICTO <strong>no vende</strong> datos personales a terceros ni los cede con fines de marketing externos. La
        información puede compartirse únicamente en los siguientes casos:
      </p>
      <ul>
        <li>
          <strong>Con otras personas usuarias de la Plataforma:</strong> en los términos descritos en la sección 4
          (visibilidad de perfiles y publicaciones).
        </li>
        <li>
          <strong>Con proveedores de infraestructura tecnológica que actúan como encargados del tratamiento:</strong>
          {" "}necesarios para operar la Plataforma. Ver sección 6.
        </li>
        <li>
          <strong>Con autoridades competentes:</strong> cuando exista requerimiento legal, orden judicial o
          administrativa válida.
        </li>
        <li>
          <strong>Para proteger derechos o la seguridad:</strong> de las personas usuarias, terceros o de la propia
          Plataforma.
        </li>
      </ul>
      <p>
        Cuando la persona usuaria utiliza la funcionalidad de compartir una publicación a una red social externa
        (WhatsApp, Facebook, Instagram, X/Twitter, LinkedIn, TikTok), la Plataforma únicamente registra que se realizó
        la acción y abre la aplicación o el sitio de la red seleccionada; INVICTO no envía datos, tokens ni
        identificadores a esas plataformas.
      </p>

      <h2>6. Encargados del tratamiento y transferencia internacional de datos</h2>
      <p>
        Para operar la Plataforma utilizamos proveedores de infraestructura y servicios en la nube que actúan como
        encargados del tratamiento. Estos proveedores pueden almacenar y procesar datos <strong>fuera de Colombia</strong>,
        principalmente en los Estados Unidos de América. Al aceptar esta política, la persona titular otorga
        autorización expresa para dicha transferencia internacional, en los términos del artículo 26 de la Ley 1581 de
        2012.
      </p>
      <p>Los principales encargados del tratamiento son:</p>
      <ul>
        <li>
          <strong>Amazon Web Services, Inc. (AWS):</strong> almacenamiento de archivos (Amazon S3, región Ohio – EE.
          UU.), distribución de contenido (Amazon CloudFront, red global), ejecución del servidor (AWS Lambda) y envío
          de correos transaccionales (Amazon SES, región Virginia – EE. UU.).
        </li>
        <li>
          <strong>Expo (650 Industries, Inc.) &ndash; EE. UU.:</strong> emisión de tokens y despacho de notificaciones
          push a los dispositivos móviles.
        </li>
        <li>
          <strong>Google LLC &ndash; EE. UU.:</strong> transporte final de notificaciones push a dispositivos Android
          a través de Firebase Cloud Messaging (FCM). No utilizamos otros servicios de Google (analítica, publicidad,
          autenticación).
        </li>
        <li>
          <strong>Apple Inc. &ndash; EE. UU.:</strong> transporte final de notificaciones push a dispositivos iOS a
          través de Apple Push Notification service (APNs).
        </li>
      </ul>
      <p>
        Estos proveedores se seleccionaron por sus estándares de seguridad y por contar con marcos de protección de
        datos reconocidos internacionalmente.
      </p>

      <h2>7. Seguridad de la información</h2>
      <p>
        INVICTO adopta medidas técnicas, administrativas y organizacionales razonables para proteger los datos
        personales contra acceso no autorizado, alteración, divulgación, pérdida o uso indebido. En particular:
      </p>
      <ul>
        <li>Las contraseñas se almacenan cifradas con algoritmo bcrypt; en ningún caso se guardan en texto plano.</li>
        <li>La autenticación se realiza mediante tokens JWT con identificadores internos cifrados con AES.</li>
        <li>Todas las comunicaciones entre la aplicación y el servidor se realizan sobre HTTPS.</li>
        <li>El acceso a la infraestructura está restringido al equipo técnico autorizado.</li>
      </ul>
      <p>
        Pese a estas medidas, ningún sistema de transmisión o almacenamiento de información es completamente seguro,
        por lo que no puede garantizarse una seguridad absoluta.
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        INVICTO reconoce la especial protección que la ley y el interés superior del niño otorgan a los menores de
        edad. La Plataforma está dirigida a personas mayores de <strong>13 años</strong>.
      </p>
      <p>
        Las personas menores de dieciocho (18) años deberán contar con la autorización previa, expresa e informada de
        su padre, madre o representante legal para registrarse y utilizar la Plataforma. Mediante dicha autorización,
        el representante legal autoriza:
      </p>
      <ul>
        <li>La creación del perfil deportivo del menor.</li>
        <li>El tratamiento de sus datos personales conforme a esta política.</li>
        <li>La publicación de fotografías, videos y contenido deportivo del menor.</li>
        <li>La visibilidad de dicho perfil dentro del ecosistema de la Plataforma.</li>
      </ul>
      <p>
        INVICTO podrá solicitar evidencia de dicha autorización cuando lo considere necesario, así como suspender o
        eliminar cuentas de menores que no cuenten con el consentimiento acreditado del representante legal. El
        representante legal es responsable del uso que el menor haga de la cuenta.
      </p>

      <h2>9. Conservación de la información</h2>
      <p>
        Los datos personales serán conservados mientras exista una relación activa entre la persona usuaria y la
        Plataforma, o mientras sean necesarios para cumplir las finalidades descritas.
      </p>
      <p>
        Cuando la persona usuaria solicite la eliminación de su cuenta, INVICTO podrá conservar determinada información
        únicamente por el tiempo necesario para cumplir obligaciones legales, atender requerimientos de autoridad
        competente o resolver controversias. Los códigos de verificación de correo y de recuperación de contraseña
        tienen vigencia inmediata (entre 60 segundos y 10 minutos) y se marcan como usados una vez utilizados.
      </p>

      <h2>10. Derechos de la persona titular</h2>
      <p>
        En su condición de titular de los datos personales, la persona usuaria tiene, entre otros, los siguientes
        derechos:
      </p>
      <ul>
        <li>Conocer, actualizar y rectificar sus datos personales.</li>
        <li>Solicitar prueba de la autorización otorgada para el tratamiento.</li>
        <li>Ser informada, previa solicitud, sobre el uso que se ha dado a sus datos.</li>
        <li>Presentar consultas y reclamos ante INVICTO por infracciones a la normativa de protección de datos.</li>
        <li>Revocar la autorización y/o solicitar la supresión de sus datos, cuando resulte procedente.</li>
        <li>Acceder de forma gratuita a sus datos personales que hayan sido objeto de tratamiento.</li>
        <li>Solicitar la portabilidad de sus datos, cuando técnicamente sea posible.</li>
      </ul>
      <p>
        Las consultas serán atendidas en un plazo máximo de diez (10) días hábiles y los reclamos en un plazo máximo de
        quince (15) días hábiles, contados a partir de su recepción, prorrogables conforme a lo previsto en la Ley 1581
        de 2012. La persona titular puede acudir a la <strong>Superintendencia de Industria y Comercio (SIC)</strong>,
        como autoridad de control, si considera que sus derechos no han sido debidamente atendidos.
      </p>

      <h2>11. Eliminación de la cuenta</h2>
      <p>
        La persona usuaria puede solicitar en cualquier momento la eliminación de su cuenta y de la información
        asociada enviando una solicitud desde el correo electrónico registrado en la Plataforma al canal oficial:
      </p>
      <div className="callout">
        <p>
          <a href="mailto:privacidad@invictoapp.com.co?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta">
            privacidad@invictoapp.com.co
          </a>
          <br />
          Asunto sugerido: &ldquo;Solicitud de eliminación de cuenta&rdquo;
        </p>
      </div>
      <p>
        Una vez validada la identidad de quien solicita, INVICTO procederá con la eliminación de la cuenta y sus datos
        asociados (perfil, publicaciones, comentarios, archivos multimedia, seguimientos, calificaciones y documentos)
        en un plazo máximo de <strong>treinta (30) días calendario</strong>, salvo obligación legal en contrario.
        Próximamente esta opción también estará disponible directamente dentro de la aplicación.
      </p>

      <h2>12. Cookies y tecnologías similares</h2>
      <p>
        La aplicación móvil de INVICTO <strong>no utiliza cookies</strong>: la autenticación se realiza mediante tokens
        JWT enviados en el encabezado <em>Authorization</em>.
      </p>
      <p>
        El sitio web público de INVICTO puede utilizar cookies estrictamente necesarias para su funcionamiento (por
        ejemplo, para recordar preferencias básicas). En caso de que en el futuro se incorporen cookies analíticas o de
        terceros, esta política será actualizada y se solicitará el consentimiento correspondiente.
      </p>

      <h2>13. Modificaciones a esta política</h2>
      <p>
        INVICTO podrá actualizar esta Política de Privacidad para adaptarla a cambios normativos, tecnológicos o
        funcionales. Las modificaciones sustanciales serán comunicadas a través de los canales oficiales de la
        Plataforma y entrarán en vigor desde su publicación. La fecha de última actualización se indica al inicio del
        documento.
      </p>

      <h2>14. Legislación aplicable</h2>
      <p>
        Esta Política de Privacidad se rige por la legislación colombiana vigente, especialmente por la Ley 1581 de
        2012, el Decreto 1377 de 2013 y las demás normas que las modifiquen, complementen o sustituyan.
      </p>

      <h2>15. Consentimiento</h2>
      <p>
        Al registrarse y utilizar la Plataforma INVICTO, la persona usuaria declara haber leído, comprendido y aceptado
        la presente Política de Privacidad, y autoriza expresamente el tratamiento de sus datos personales en los
        términos aquí descritos, incluida la transferencia internacional a los encargados del tratamiento mencionados
        en la sección 6.
      </p>
    </LegalPageShell>
  );
}
