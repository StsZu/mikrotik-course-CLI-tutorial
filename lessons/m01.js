window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m01", order: 1, title: "CLI RouterOS: шляхи й дії", subtitle: "Шлях меню, Tab і F1, print, add, set, remove", icon: "terminal",
  goal: "Після модуля ти читаєш будь-яку команду RouterOS як «шлях меню + дія», знаходиш команди через Tab і F1 і відрізняєш безпечні дії від тих, що змінюють роутер.",
  lessons: [
    {
      id: "m01-l01", title: "Шлях меню, Tab і F1", minutes: 11,
      steps: [
        { type: "story", title: "Термінал замість кнопок",
          body: "<p>У Stas удома MikroTik RB4011 з адресою <code>10.0.0.254</code>. WinBox зручний, але інструкції в інтернеті й підтримка MikroTik говорять мовою команд — і їх можна скопіювати, зберегти та повторити.</p><p>Ти підключаєшся по SSH (або відкриваєш New Terminal у WinBox) і бачиш запрошення <code>[Stas@RB4011] &gt;</code>. Що далі?</p>" },
        { type: "concept", title: "Команда = шлях меню + дія",
          body: "<p>Уся конфігурація RouterOS — це дерево меню: <code>/ip</code>, у ньому <code>address</code>, <code>firewall</code>, <code>route</code>… Команда складається зі <strong>шляху</strong> до меню і <strong>дії</strong> в ньому.</p><p>Слова шляху можна розділяти пробілом або скісною рискою: <code>/ip address print</code> і <code>/ip/address/print</code> — одне й те саме.</p>",
          analogy: "Меню RouterOS — як поверхи й кабінети великої установи. `/ip firewall filter` — адреса кабінету: «поверх IP, крило firewall, кабінет filter». А `print` чи `add` — що ти просиш зробити в цьому кабінеті: «покажіть список» чи «оформіть новий запис»." },
        { type: "cli", title: "Перші команди перегляду",
          intro: "<p>Дія <code>print</code> лише показує — з неї безпечно починати знайомство з будь-яким роутером.</p>",
          commands: [
            { cmd: "/system resource print", explain: "Стан роутера: uptime, версія RouterOS, пам'ять, навантаження CPU.", output: "     uptime: 3d12h4m10s\n    version: 7.24.4 (stable)\nfree-memory: 892.4MiB\n   cpu-load: 4%", risk: "low" },
            { cmd: "/interface print", explain: "Усі інтерфейси: порти, bridge, VLAN, Wi‑Fi, тунелі.", risk: "low" },
            { cmd: "/ip address print", explain: "Які IPv4-адреси висять на яких інтерфейсах.", output: "Flags: D - DYNAMIC\nColumns: ADDRESS, NETWORK, INTERFACE\n#   ADDRESS           NETWORK       INTERFACE\n0   10.0.0.254/24     10.0.0.0      bridge\n1 D 198.51.100.23/24  198.51.100.0  ether1", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: адреси роутера",
          task: "Покажи IPv4-адреси на інтерфейсах роутера.",
          expected: ["/ip address print", "/ip/address/print", "/ip/address print", "ip address print"],
          output: "Flags: D - DYNAMIC\nColumns: ADDRESS, NETWORK, INTERFACE\n#   ADDRESS           NETWORK       INTERFACE\n0   10.0.0.254/24     10.0.0.0      bridge\n1 D 198.51.100.23/24  198.51.100.0  ether1",
          hint: "Шлях: розділ IP → меню адрес. Дія — показати список.",
          explain: "Адреса `10.0.0.254/24` на bridge — це LAN. Прапорець `D` біля адреси на ether1 означає «динамічна»: її видав провайдер через DHCP." },
        { type: "check", title: "Що є що",
          question: "У команді `/ip firewall filter print` що є шляхом меню, а що дією?",
          options: ["`/ip` — дія, `firewall filter print` — шлях", "`/ip firewall filter` — шлях до меню, `print` — дія", "Уся команда — одне слово-команда"],
          correct: 1, feedback: "Шлях веде в меню правил фільтрації, а `print` просить показати їх. Та сама дія `print` працює в будь-якому меню." },
        { type: "cli", title: "Як знайти команду, не знаючи її",
          intro: "<p>Не треба пам'ятати всі меню — RouterOS сам підказує.</p>",
          commands: [
            { cmd: "/ip ", explain: "Надрукуй це (з пробілом у кінці) і натисни <span class=\"kbd\">Tab</span> двічі, не натискаючи Enter: з'являться всі підменю — address, arp, dns, firewall… Один Tab доповнює недописане слово.", risk: "low" },
            { cmd: "/interface ", explain: "Надрукуй і натисни <span class=\"kbd\">F1</span>: RouterOS 7 покаже контекстну довідку — підменю й дії цього рівня. У RouterOS 6 для цього був <code>?</code>.", risk: "low" },
            { cmd: "/ip address", explain: "Шлях без дії переносить тебе в це меню: запрошення стає <code>[Stas@RB4011] /ip/address&gt;</code>. Далі можна писати просто <code>print</code>; <code>/</code> — повернутися в корінь, <code>..</code> — на рівень вище.", risk: "low" }
          ] },
        { type: "check", title: "Забув назву меню",
          question: "Ти пам'ятаєш, що DNS-налаштування десь у `/ip`, але не пам'ятаєш назву меню. Що зробити?",
          options: ["Надрукувати `/ip ` і натиснути Tab двічі або F1 — роутер покаже підменю", "Перезавантажити роутер", "Ввести `/help dns` і чекати"],
          correct: 0, feedback: "Tab і F1 — вбудований навігатор. Так знаходять і команди, і параметри: після назви дії Tab підказує можливі параметри." },
        { type: "callout", variant: "tip", title: "Скорочення — лише коли вже знаєш",
          body: "<p>RouterOS приймає однозначні скорочення: <code>/ip addr pr</code> спрацює як <code>/ip address print</code>. Це зручно вдома, але в нотатках і скриптах пиши повні слова — їх легше читати й перевіряти.</p><p>Тренажер курсу вимагає повні слова.</p>" },
        { type: "summary", title: "Підсумок",
          points: ["Команда RouterOS = шлях меню (`/ip address`) + дія (`print`).", "Шлях можна писати через пробіл або `/`: `/ip address print` = `/ip/address/print`.", "Tab доповнює, подвійний Tab і F1 показують, що є на цьому рівні.", "Шлях без дії переносить у меню; `/` — корінь, `..` — вище.", "Починай знайомство з роутером з `print` — він нічого не змінює."] }
      ],
      glossary: [
        { term: "RouterOS", def: "Операційна система роутерів MikroTik; курс спирається на версію 7." },
        { term: "Шлях меню", def: "Адреса розділу конфігурації, напр. `/ip firewall filter`; слова через пробіл або `/`." },
        { term: "print", def: "Дія «показати список» у будь-якому меню; нічого не змінює." },
        { term: "F1", def: "Контекстна довідка в терміналі RouterOS 7 (у v6 — `?`)." },
        { term: "Tab", def: "Доповнення слова; подвійний Tab показує всі варіанти." }
      ],
      quiz: [
        { question: "Які з записів — одна й та сама команда?", options: ["`/ip address print` і `/ip route print`", "`/ip address print` і `/ip/address/print`", "`/ip address print` і `/ip address add`"], correct: 1, feedback: "Пробіл і `/` між словами шляху рівнозначні. Інші пари — різні меню або різні дії." },
        { question: "Що станеться після `/interface print` на робочому роутері?", options: ["Нічого не зміниться — роутер лише покаже список інтерфейсів", "Інтерфейси перезапустяться", "Роутер збереже конфігурацію у файл"], correct: 0, feedback: "`print` — дія читання. З неї безпечно починати будь-яку діагностику." },
        { question: "Ти ввів `/ip firewall` і натиснув Enter. Що відбулося?", options: ["Вимкнувся firewall", "Помилка — бракує дії", "Ти перейшов у меню: запрошення стало `/ip/firewall>`"], correct: 2, feedback: "Шлях без дії змінює поточне меню. Повернутися в корінь — `/`." },
        { question: "Яка клавіша в RouterOS 7 показує контекстну довідку?", options: ["F1", "Ctrl+X", "Esc"], correct: 0, feedback: "F1 — довідка; Ctrl+X — зовсім інше: вмикає і вимикає Safe Mode." },
        { question: "Ти в меню `/ip/address>` і хочеш подивитися маршрути, не виходячи вручну. Що ввести?", options: ["`route print`", "`/ip route print`", "`print route`"], correct: 1, feedback: "Шлях, що починається з `/`, завжди рахується від кореня — працює з будь-якого меню. `route print` шукав би підменю в `/ip/address`." },
        { question: "Навіщо в нотатках писати `/ip address print`, а не `/ip addr pr`?", options: ["Скорочення не працюють ніколи", "Скорочення ламають роутер", "Повні слова легше читати й перевіряти; скорочення зручні лише для швидкого набору"], correct: 2, feedback: "RouterOS приймає однозначні скорочення, але в документації й скриптах їх важко читати." }
      ]
    },
    {
      id: "m01-l02", title: "Дії: print, add, set, remove", minutes: 12,
      steps: [
        { type: "concept", title: "Дії, які повторюються всюди",
          body: "<p>Майже в кожному меню ті самі дії: <code>print</code> — показати, <code>add</code> — додати, <code>set</code> — змінити, <code>remove</code> — видалити, <code>enable</code>/<code>disable</code> — увімкнути чи вимкнути.</p><p>Зміни застосовуються <strong>одразу</strong> після Enter — кнопки «Застосувати» немає.</p>",
          analogy: "Меню RouterOS — як таблиця в Excel: `print` — подивитися таблицю, `add` — дописати рядок, `set` — виправити клітинку, `remove` — стерти рядок. Тільки це таблиця, за якою прямо зараз працює твоя мережа, і автозбереження вмикається на кожному Enter." },
        { type: "cli", title: "Від читання до змін",
          commands: [
            { cmd: "/interface print detail", explain: "Те саме, що <code>print</code>, але з усіма властивостями у вигляді <code>ключ=значення</code>. Перший крок перед будь-якою зміною.", risk: "low" },
            { cmd: "/interface print where disabled=yes", explain: "<code>where</code> фільтрує вивід: лише вимкнені інтерфейси.", risk: "low" },
            { cmd: "/ip address add address=10.0.1.1/24 interface=ether5", explain: "Додати адресу на порт <code>ether5</code> — з'явиться нова мережа <code>10.0.1.0/24</code>.", risk: "medium" },
            { cmd: "/interface set ether5 comment=LAB", explain: "Змінити властивість наявного об'єкта: тут — коментар порту.", risk: "medium" },
            { cmd: "/ip address remove [find address=\"10.0.1.1/24\"]", explain: "Видалити адресу. <code>[find …]</code> шукає об'єкт за умовою замість номера. Якщо це адреса, через яку ти підключений, зв'язок обірветься.", risk: "high" }
          ] },
        { type: "terminal", title: "Спробуй: детальний вивід",
          task: "Покажи всі інтерфейси з усіма властивостями.",
          expected: ["/interface print detail", "/interface/print detail", "/interface/print/detail", "interface print detail"],
          output: "Flags: X - DISABLED; R - RUNNING; S - SLAVE\n 0 R  ;;; WAN\n       name=\"ether1\" default-name=\"ether1\" type=\"ether\" mtu=1500 actual-mtu=1500 l2mtu=1598\n       mac-address=48:A9:8A:10:20:01 last-link-up-time=2026-09-15 02:01:10 link-downs=0\n 1 RS  name=\"ether2\" default-name=\"ether2\" type=\"ether\" mtu=1500 actual-mtu=1500 l2mtu=1598",
          hint: "Та сама команда, що показує інтерфейси, плюс слово, яке просить подробиць.",
          explain: "`detail` показує властивості, які потім змінюють через `set`. Коментар `;;; WAN` підказує, що ether1 дивиться в інтернет." },
        { type: "check", title: "Номери з print",
          question: "`/ip firewall filter print` показав правила 0–7. Колега в іншому вікні додав правило на початок списку. Ти пишеш `/ip firewall filter disable 3`. Яке правило вимкнеться?",
          options: ["Те, що твій `print` показав під номером 3: номери належать твоїй сесії й діють до твого наступного `print`", "Те, що тепер стоїть третім після правила колеги", "Жодне: RouterOS відмовить, бо номери застаріли"],
          correct: 0, feedback: "Номери з `print` — власні для кожної сесії і лишаються чинними навіть після add/remove/move, доки ти знову не зробиш `print`. Колега бачить свою нумерацію. Щоб побачити актуальний порядок перед зміною — свіжий `print` у своїй сесії; надійніше звертатися за умовою: `[find comment=\"…\"]`." },
        { type: "terminal", title: "Спробуй: лише вимкнені",
          task: "Покажи лише вимкнені інтерфейси.",
          expected: ["/interface print where disabled=yes", "/interface/print where disabled=yes", "/interface print where disabled", "interface print where disabled=yes"],
          output: "Flags: X - DISABLED; R - RUNNING; S - SLAVE\nColumns: NAME, TYPE, ACTUAL-MTU\n#   NAME     TYPE  ACTUAL-MTU\n8 X wg-home  wg          1420",
          hint: "Після `print` додай фільтр `where` з умовою на властивість `disabled`.",
          explain: "Фільтр `where` економить час на великих списках: правила firewall, журнал, сертифікати." },
        { type: "callout", variant: "danger", title: "remove і set діють миттєво",
          body: "<p><code>remove</code> видаляє об'єкт без запитання, а невдалий <code>set</code> на WAN, bridge чи firewall може відрізати тебе від роутера. Кнопки «Скасувати» в терміналі немає — є <code>/undo</code>, але після обриву зв'язку ти його вже не введеш.</p><p>Безпечніше: <code>print detail</code> → <code>/export</code> → Safe Mode (<span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">X</span>) → одна зміна → перевірка. Замість видалення правила його можна спершу <code>disable</code>.</p>" },
        { type: "check", title: "Рівень ризику",
          question: "Яка дія найризиковіша, якщо ти підключений до роутера віддалено?",
          options: ["`/ip route print`", "`/interface print detail`", "`/ip address remove` для адреси, через яку ти підключений"],
          correct: 2, feedback: "Прибери адресу, до якої підключений, — і сесія обірветься. `print` лише читає." },
        { type: "summary", title: "Підсумок",
          points: ["`print` / `print detail` / `print where …` — лише читають.", "`add`, `set`, `enable`, `disable` змінюють конфігурацію одразу після Enter.", "`remove` видаляє без запитання — високий ризик.", "Номери з `print` діють до наступного `print`; надійніше `[find умова]`.", "Перед змінами: `print detail` → `/export` → Safe Mode → одна зміна."] }
      ],
      glossary: [
        { term: "print detail", def: "Вивід усіх властивостей об'єктів у форматі `ключ=значення`." },
        { term: "where", def: "Фільтр у `print`: `print where disabled=yes`." },
        { term: "set", def: "Дія зміни властивостей наявного об'єкта." },
        { term: "find", def: "Пошук об'єктів за умовою, напр. `[find comment=\"LAB\"]`, замість номера." },
        { term: "Номер об'єкта", def: "Число з лівої колонки `print`; власне для твоєї сесії й дійсне до наступного `print` у ній (навіть після add/remove/move)." }
      ],
      quiz: [
        { question: "Яка команда нічого не змінює на роутері?", options: ["`/ip address add address=10.0.1.1/24 interface=ether5`", "`/ip firewall filter print detail`", "`/interface set ether5 disabled=yes`"], correct: 1, feedback: "`print detail` лише читає. `add` і `set` змінюють конфігурацію одразу." },
        { question: "Коли застосовується зміна, введена через `set`?", options: ["Одразу після Enter", "Після перезавантаження", "Після команди `apply`"], correct: 0, feedback: "У RouterOS немає окремого «застосувати» — тому важливі бекап і Safe Mode перед змінами." },
        { question: "Навіщо `print detail` перед `set`?", options: ["Щоб роутер дозволив `set`", "Щоб прискорити роутер", "Щоб побачити поточні значення і точно знати, що змінюєш і як повернути"], correct: 2, feedback: "Знаючи старе значення, ти завжди зможеш повернути його тим самим `set`." },
        { question: "Як надійно звернутися до правила, не покладаючись на номер?", options: ["Через `[find comment=\"…\"]` або іншу умову", "Через `print` без номера", "Номер завжди надійний"], correct: 0, feedback: "Номери переназначає кожен `print`, а умова `find` шукає саме потрібний об'єкт." },
        { question: "Колега пропонує прибрати зайве правило firewall командою `remove`, «щоб не заважало». Безпечніша альтернатива на перший крок?", options: ["`/system reset-configuration`", "`/ip firewall filter move`", "Спершу `disable` правила і перевірка — видалити можна потім"], correct: 2, feedback: "Вимкнене правило легко ввімкнути назад, а видалене доведеться відновлювати з експорту." },
        { question: "Що покаже `/interface print where disabled=yes`?", options: ["Вимкне всі інтерфейси", "Лише вимкнені інтерфейси", "Усі інтерфейси, крім вимкнених"], correct: 1, feedback: "`where` — фільтр виводу. Нічого не вмикає й не вимикає." }
      ]
    }
  ]
});
