window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m06", order: 6, title: "Firewall і доступ", subtitle: "Filter, NAT, address-list, з'єднання, користувачі, сервіси", icon: "security",
  goal: "Після модуля ти читаєш правила firewall і NAT, розумієш, чому важливий їхній порядок, і перевіряєш, хто і через які сервіси може керувати роутером.",
  lessons: [
    {
      id: "m06-l01", title: "Правила filter і NAT", minutes: 13,
      steps: [
        { type: "concept", title: "Правила — зверху вниз",
          body: "<p><code>/ip firewall filter</code> — правила, що пропускають чи відкидають трафік. Ланцюг <code>input</code> — трафік до самого роутера, <code>forward</code> — крізь роутер. Правила перевіряються <strong>зверху вниз</strong>: спрацьовує перше, що збіглося.</p><p><code>/ip firewall nat</code> — підміна адрес; <code>masquerade</code> дає всій LAN вихід в інтернет через одну адресу WAN.</p>",
          analogy: "Правила firewall — охоронець зі списком на вході в бізнес-центр. Він читає список згори донизу і діє за першим пунктом, що підходить: «свої — проходять», «підозрілі — геть», «усі інші з вулиці — геть». Якщо «усі — геть» поставити першим пунктом, не пройде ніхто, навіть власник будівлі." },
        { type: "cli", title: "Читаємо правила",
          commands: [
            { cmd: "/ip firewall filter print", explain: "Правила з номерами в порядку перевірки; <code>;;;</code> — коментар правила.", output: "Flags: X - DISABLED, I - INVALID; D - DYNAMIC\n 0    ;;; defconf: accept established,related,untracked\n      chain=input action=accept connection-state=established,related,untracked\n 1    ;;; defconf: drop invalid\n      chain=input action=drop connection-state=invalid\n 2    ;;; defconf: accept ICMP\n      chain=input action=accept protocol=icmp\n 3    ;;; defconf: drop all not coming from LAN\n      chain=input action=drop in-interface-list=!LAN", risk: "low" },
            { cmd: "/ip firewall filter print detail", explain: "Те саме з усіма властивостями — перед будь-якою зміною.", risk: "low" },
            { cmd: "/ip firewall nat print", explain: "Правила NAT. Типове — <code>masquerade</code> для списку <code>WAN</code>.", output: "Flags: X - DISABLED, I - INVALID; D - DYNAMIC\n 0    ;;; defconf: masquerade\n      chain=srcnat action=masquerade out-interface-list=WAN ipsec-policy=out,none", risk: "low" },
            { cmd: "/ip firewall address-list print", explain: "Списки адрес (<code>trusted</code>, <code>blocked</code>), на які посилаються правила.", risk: "low" },
            { cmd: "/ip firewall connection print", explain: "Активні з'єднання, які відстежує роутер.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: правила фільтрації",
          task: "Покажи правила фільтрації firewall.",
          expected: ["/ip firewall filter print", "/ip/firewall/filter/print", "/ip/firewall/filter print", "ip firewall filter print"],
          output: "Flags: X - DISABLED, I - INVALID; D - DYNAMIC\n 0    ;;; defconf: accept established,related,untracked\n      chain=input action=accept connection-state=established,related,untracked\n 1    ;;; defconf: drop invalid\n      chain=input action=drop connection-state=invalid\n 2    ;;; defconf: accept ICMP\n      chain=input action=accept protocol=icmp\n 3    ;;; defconf: drop all not coming from LAN\n      chain=input action=drop in-interface-list=!LAN",
          hint: "Шлях: `/ip`, `firewall`, `filter`; дія — показати.",
          explain: "Правило 3 відкидає все на input, що прийшло не зі списку LAN. Тому керувати роутером можна лише з домашньої мережі." },
        { type: "check", title: "Порядок має значення",
          question: "Ти додав у кінець `chain=input action=accept protocol=tcp dst-port=8291` (WinBox) для доступу з інтернету, але доступу немає. Чому?",
          options: ["Порт 8291 неправильний", "Правило «drop all not coming from LAN» стоїть вище і спрацьовує першим", "Треба перезавантажити роутер"],
          correct: 1, feedback: "Спрацьовує перше правило, що збіглося. Та й відкривати WinBox в інтернет — погана ідея: краще VPN." },
        { type: "cli", title: "Зміни firewall",
          commands: [
            { cmd: "/ip firewall filter disable [find comment=\"test\"]", explain: "Тимчасово вимкнути правило за коментарем — його легко ввімкнути назад.", risk: "medium" },
            { cmd: "/ip firewall filter move 7 destination=2", explain: "Перемістити правило 7 на позицію 2. Змінює, що пропускається, — можна відкрити мережу чи заблокувати себе.", risk: "high" },
            { cmd: "/ip firewall filter remove 3", explain: "Видалити правило 3 («drop all not coming from LAN») — керування роутером відкриється з інтернету.", risk: "high" }
          ] },
        { type: "callout", variant: "danger", title: "move і remove у firewall",
          body: "<p>Переміщення чи видалення правила діє миттєво: або роутер відкривається світу, або ти блокуєш власне підключення. Номери беруться з останнього <code>print</code> — після чужих змін вони вже інші.</p><p>Безпечніше: <code>/ip firewall filter print detail</code> і <code>/export file=before-fw</code>, Safe Mode (<span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">X</span>), замість <code>remove</code> — спершу <code>disable</code>, звертайся за <code>[find comment=…]</code>.</p>" },
        { type: "terminal", title: "Спробуй: NAT",
          task: "Покажи правила NAT.",
          expected: ["/ip firewall nat print", "/ip/firewall/nat/print", "/ip/firewall/nat print", "ip firewall nat print"],
          output: "Flags: X - DISABLED, I - INVALID; D - DYNAMIC\n 0    ;;; defconf: masquerade\n      chain=srcnat action=masquerade out-interface-list=WAN ipsec-policy=out,none",
          hint: "Той самий шлях `/ip firewall`, але меню `nat`.",
          explain: "Одне правило masquerade: усі пристрої LAN виходять в інтернет з адресою WAN роутера." },
        { type: "check", title: "Немає інтернету в LAN",
          question: "Роутер пінгує `8.8.8.8`, а ноутбуки в LAN — ні. `/ip firewall nat print` порожній. Що не так?",
          options: ["Немає правила masquerade — пакети LAN ідуть в інтернет з приватними адресами і не повертаються", "Зламаний DNS", "Вимкнено Wi‑Fi"],
          correct: 0, feedback: "Приватні адреси `10.0.0.x` не маршрутизуються в інтернеті. NAT підміняє їх на адресу WAN." },
        { type: "summary", title: "Підсумок",
          points: ["`/ip firewall filter print` — правила в порядку перевірки; спрацьовує перше, що збіглося.", "`input` — до роутера, `forward` — крізь роутер.", "`/ip firewall nat print` — masquerade дає LAN вихід в інтернет.", "`address-list` і `connection print` — списки адрес і живі з'єднання.", "`move` і `remove` у firewall — високий ризик: export, Safe Mode, спершу `disable`."] }
      ],
      glossary: [
        { term: "chain input", def: "Ланцюг правил для трафіку, адресованого самому роутеру." },
        { term: "chain forward", def: "Ланцюг правил для трафіку, що проходить крізь роутер." },
        { term: "masquerade", def: "Дія NAT: підміна адреси відправника на адресу вихідного інтерфейсу." },
        { term: "address-list", def: "Названий список IP-адрес для використання в правилах." },
        { term: "Connection tracking", def: "Відстеження стану з'єднань (new, established, related, invalid)." }
      ],
      quiz: [
        { question: "Як RouterOS обробляє правила в `/ip firewall filter`?", options: ["Згори вниз; спрацьовує перше правило, що збіглося", "Знизу вгору", "Усі правила одночасно, перемагає найсуворіше"], correct: 0, feedback: "Тому порядок правил — частина безпеки." },
        { question: "Трафік з ноутбука на сайт в інтернеті проходить через який ланцюг?", options: ["`input`", "`output`", "`forward`"], correct: 2, feedback: "Ноутбук → роутер → інтернет: трафік іде крізь роутер, це `forward`." },
        { question: "Навіщо правило `masquerade` у NAT?", options: ["Щоб шифрувати трафік", "Щоб пристрої з приватними адресами LAN виходили в інтернет через адресу WAN", "Щоб блокувати рекламу"], correct: 1, feedback: "Приватні адреси `10.0.0.x` не маршрутизуються в інтернеті." },
        { question: "Яка дія з правилом firewall найлегше відкочується?", options: ["`remove`", "`move`", "`disable` — правило лишається, його вмикає `enable`"], correct: 2, feedback: "Вимкнене правило зберігає всі свої параметри." },
        { question: "Навіщо `print detail` і `/export` перед зміною firewall?", options: ["Щоб знати поточний стан і мати текстову копію правил для відновлення", "Щоб прискорити firewall", "Щоб скинути лічильники"], correct: 0, feedback: "Без «було» не зрозумієш, що саме зламалося, і не повернеш назад." },
        { question: "Колега пише «видали правило 3», а ти востаннє робив `print` годину тому. Що робити?", options: ["Одразу `remove 3`", "Спершу знову `print` (номери могли змінитися) і звірити коментар правила", "Видалити всі правила"], correct: 1, feedback: "Номери діють до наступного `print`. Надійніше за номер — `[find comment=…]`." }
      ]
    },
    {
      id: "m06-l02", title: "Користувачі й сервіси керування", minutes: 11,
      steps: [
        { type: "story", title: "Хто може зайти на роутер?",
          body: "<p>Після статті про масові злами роутерів Stas вирішив перевірити свій: які облікові записи існують, хто зараз підключений і через які «двері» — SSH, WinBox, веб — узагалі можна керувати роутером.</p>" },
        { type: "concept", title: "Користувачі, групи, сервіси",
          body: "<p><code>/user</code> — облікові записи; кожен у групі (<code>read</code>, <code>write</code>, <code>full</code>), що задає права. <code>/user active</code> — хто в системі зараз.</p><p><code>/ip service</code> — сервіси керування: <code>ssh</code>, <code>winbox</code>, <code>www</code>, <code>api</code>… У кожного порт і поле <code>address</code> — з яких мереж дозволено підключатися.</p>",
          analogy: "`/user` — список ключів від офісу, група — рівень допуску: «лише подивитися», «працювати», «директор». `/ip service` — двері будівлі: парадні (WinBox), службові (SSH), вантажні (API). Кожні зайві відчинені двері — ще один шлях для зломщика, тому непотрібні зачиняють." },
        { type: "cli", title: "Аудит доступу",
          commands: [
            { cmd: "/user print", explain: "Облікові записи: ім'я, група, дозволені адреси. Стандартний <code>admin</code> краще вимкнути, створивши свій запис.", output: "Flags: X - DISABLED\nColumns: NAME, GROUP, ADDRESS\n#   NAME     GROUP  ADDRESS\n0   Stas     full   10.0.0.0/24\n1 X ;;; system default user\n    admin    full\n2   monitor  read   10.0.0.0/24", risk: "low" },
            { cmd: "/user group print", explain: "Групи і їхні політики (права).", risk: "low" },
            { cmd: "/user active print", explain: "Хто зараз підключений, звідки і через що (ssh, winbox).", risk: "low" },
            { cmd: "/ip service print", explain: "Сервіси керування; <code>X</code> — вимкнений.", output: "Flags: X - DISABLED, I - INVALID\nColumns: NAME, PORT, ADDRESS\n#   NAME     PORT  ADDRESS\n0 X telnet     23\n1 X ftp        21\n2 X www        80\n3   ssh        22  10.0.0.0/24,10.0.9.0/24\n4 X www-ssl   443\n5 X api      8728\n6   winbox   8291  10.0.0.0/24\n7 X api-ssl  8729", risk: "low" },
            { cmd: "/ip ssh print", explain: "Налаштування SSH-сервера (strong-crypto тощо).", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: сервіси",
          task: "Покажи сервіси керування роутером (ssh, winbox, www, api).",
          expected: ["/ip service print", "/ip/service/print", "/ip/service print", "ip service print"],
          output: "Flags: X - DISABLED, I - INVALID\nColumns: NAME, PORT, ADDRESS\n#   NAME     PORT  ADDRESS\n0 X telnet     23\n1 X ftp        21\n2 X www        80\n3   ssh        22  10.0.0.0/24,10.0.9.0/24\n4 X www-ssl   443\n5 X api      8728\n6   winbox   8291  10.0.0.0/24\n7 X api-ssl  8729",
          hint: "Сервіси керування — у розділі `/ip`.",
          explain: "Увімкнені лише ssh і winbox, і лише з LAN та VPN-мережі `10.0.9.0/24`. Telnet і FTP (без шифрування) вимкнені — добре." },
        { type: "check", title: "Незнайомий сеанс",
          question: "`/user active print` показує сеанс `Stas` з адреси `203.0.113.66`, але ти зараз удома. Перший крок?",
          options: ["Ігнорувати", "Скинути роутер до заводських", "Перевірити `/ip service print` (звідки дозволено вхід), змінити пароль і обмежити `address` сервісів"],
          correct: 2, feedback: "Хтось зайшов з інтернету твоїм логіном. Закрий двері (сервіси), зміни пароль, подивись журнал `topics~\"account\"`." },
        { type: "terminal", title: "Спробуй: хто на роутері",
          task: "Покажи, хто зараз підключений до роутера.",
          expected: ["/user active print", "/user/active/print", "/user/active print", "user active print"],
          output: "Flags: R - RADIUS\nColumns: WHEN, NAME, ADDRESS, VIA, GROUP\n# WHEN                 NAME  ADDRESS    VIA     GROUP\n0 2026-09-18 13:58:02  Stas  10.0.0.42  ssh     full\n1 2026-09-18 09:12:40  Stas  10.0.0.42  winbox  full",
          hint: "Меню `/user`, підменю активних сеансів.",
          explain: "Два твої сеанси з ноутбука: SSH і WinBox. Пам'ятай про це, коли вимикаєш сервіси: не вимкни той, через який сидиш." },
        { type: "callout", variant: "danger", title: "Зміни доступу",
          body: "<p><code>/ip service disable ssh</code>, зміна <code>address</code> сервісу чи <code>/user remove</code> для свого облікового запису миттєво відрізають тебе від роутера. Відкритий в інтернет <code>winbox</code> чи <code>www</code> — запрошення для зломщиків.</p><p>Безпечніше: спершу створи й перевір новий запис в <em>окремій</em> сесії, лише потім вимикай старий; зміни сервісів — у Safe Mode (<span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">X</span>); доступ ззовні — через VPN, а не відкритими портами.</p>" },
        { type: "cli", title: "Посилення доступу",
          commands: [
            { cmd: "/ip service disable telnet,ftp,www,api", explain: "Вимкнути непотрібні сервіси.", risk: "high" },
            { cmd: "/ip service set winbox address=10.0.0.0/24", explain: "Дозволити WinBox лише з LAN.", risk: "high" },
            { cmd: "/user disable admin", explain: "Вимкнути стандартний запис <code>admin</code> — лише після перевірки, що твій власний запис з групою <code>full</code> працює.", risk: "high" }
          ] },
        { type: "check", title: "Порядок посилення",
          question: "Ти хочеш вимкнути `admin` і входити як `Stas`. Який порядок безпечний?",
          options: ["Вимкнути `admin`, потім створити `Stas`", "Створити `Stas` з групою `full`, увійти ним в окремій сесії, перевірити — і лише тоді вимкнути `admin`", "Видалити всіх користувачів і створити нових"],
          correct: 1, feedback: "Спершу нові двері, потім зачиняєш старі — інакше можеш лишитися без жодних." },
        { type: "summary", title: "Підсумок",
          points: ["`/user print`, `/user group print`, `/user active print` — хто має доступ і хто зараз у системі.", "`/ip service print` — які сервіси керування відкриті і з яких адрес.", "Непотрібні сервіси вимикають, потрібні обмежують `address=` мережею LAN/VPN.", "Спершу перевір новий доступ в окремій сесії, потім вимикай старий.", "Доступ ззовні — через VPN, не відкритим WinBox."] }
      ],
      glossary: [
        { term: "Група користувача", def: "Набір прав (політик): `read`, `write`, `full`." },
        { term: "/ip service", def: "Сервіси керування роутером (ssh, winbox, www, api) з портами й дозволеними адресами." },
        { term: "address (сервісу)", def: "Мережі, з яких дозволено підключатися до сервісу." },
        { term: "/user active", def: "Список поточних сеансів: хто, звідки, через що." }
      ],
      quiz: [
        { question: "Яка команда покаже, через які сервіси можна керувати роутером?", options: ["`/ip service print`", "`/user group print`", "`/ip firewall nat print`"], correct: 0, feedback: "Там порти й дозволені адреси для ssh, winbox, www, api." },
        { question: "Навіщо поле `address` у `/ip service`?", options: ["Це адреса самого роутера", "Обмежити, з яких мереж можна підключатися до сервісу", "Адреса DNS"], correct: 1, feedback: "Навіть якщо firewall пропустить, сервіс відповість лише дозволеним мережам." },
        { question: "Чому варто вимкнути `telnet` і `ftp`?", options: ["Вони сповільнюють роутер", "Вони потрібні лише для Wi‑Fi", "Вони передають логін і пароль без шифрування"], correct: 2, feedback: "Для керування є SSH і WinBox; для файлів — SFTP через SSH." },
        { question: "Ти керуєш роутером через SSH. Яка зміна обірве твій сеанс?", options: ["`/ip service disable ssh`", "`/ip service disable telnet`", "`/user group print`"], correct: 0, feedback: "Вимикаючи сервіс, перевір у `/user active print`, чи ти не сидиш саме через нього." },
        { question: "У якій групі має бути обліковий запис, який лише дивиться статистику?", options: ["`full`", "`read`", "`write`"], correct: 1, feedback: "Принцип найменших прав: для перегляду досить `read`." },
        { question: "Як безпечно дати собі доступ до роутера з інтернету?", options: ["Відкрити WinBox у firewall для всіх", "Вимкнути firewall", "Підключатися через VPN (напр. WireGuard) і дозволити сервіс лише з мережі VPN"], correct: 2, feedback: "VPN — одні надійні двері з ключем замість відчиненого WinBox для всього світу." }
      ]
    }
  ]
});
