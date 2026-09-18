window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m04", order: 4, title: "Інтерфейси", subtitle: "Ethernet, bridge, VLAN, списки, Wi‑Fi, WireGuard", icon: "lan",
  goal: "Після модуля ти читаєш будову мережі роутера — порти, bridge, VLAN, списки WAN/LAN, Wi‑Fi і WireGuard — і безпечно вимикаєш та вмикаєш порт, розуміючи ризик.",
  lessons: [
    {
      id: "m04-l01", title: "Порти, bridge, VLAN і списки", minutes: 12,
      steps: [
        { type: "concept", title: "Фізичне і логічне",
          body: "<p><strong>Ethernet</strong> — фізичні гнізда (<code>ether1</code>…). <strong>Bridge</strong> об'єднує кілька портів і Wi‑Fi в одну локальну мережу — на ньому живе адреса LAN <code>10.0.0.254</code>. <strong>VLAN</strong> — окрема логічна мережа поверх того самого кабелю.</p><p><strong>Списки інтерфейсів</strong> (WAN, LAN) — групи, на які посилаються правила firewall.</p>",
          analogy: "Ethernet-порти — окремі кімнати квартири. Bridge — знесені стіни між ними: одна велика вітальня, де всі чують одне одного. VLAN — прозора перегородка в тій вітальні: гості IoT-кута не заходять у робочу зону. А списки WAN і LAN — таблички «вхідні двері» й «житлова частина» для охоронця (firewall)." },
        { type: "cli", title: "Огляд інтерфейсів",
          commands: [
            { cmd: "/interface ethernet print", explain: "Лише фізичні порти з MAC-адресами.", risk: "low" },
            { cmd: "/interface bridge print", explain: "Bridge-інтерфейси. У домашній конфігурації зазвичай один — <code>bridge</code>.", risk: "low" },
            { cmd: "/interface bridge port print", explain: "Які порти входять у bridge. Прапорець <code>I</code> — порт неактивний (кабель не підключено).", output: "Flags: I - INACTIVE; H - HW-OFFLOAD\nColumns: INTERFACE, BRIDGE, HW, PVID\n#    INTERFACE  BRIDGE  HW   PVID\n0 H  ether2     bridge  yes     1\n1 H  ether3     bridge  yes     1\n2 IH ether4     bridge  yes     1\n3    wifi1      bridge          1", risk: "low" },
            { cmd: "/interface vlan print", explain: "VLAN-інтерфейси: номер VLAN і на якому інтерфейсі вони створені.", risk: "low" },
            { cmd: "/interface list member print", explain: "Хто входить у списки: <code>LAN</code> — bridge, <code>WAN</code> — ether1.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: порти bridge",
          task: "Покажи, які порти входять у bridge.",
          expected: ["/interface bridge port print", "/interface/bridge/port/print", "/interface/bridge/port print", "interface bridge port print"],
          output: "Flags: I - INACTIVE; H - HW-OFFLOAD\nColumns: INTERFACE, BRIDGE, HW, PVID\n#    INTERFACE  BRIDGE  HW   PVID\n0 H  ether2     bridge  yes     1\n1 H  ether3     bridge  yes     1\n2 IH ether4     bridge  yes     1\n3    wifi1      bridge          1",
          hint: "Шлях: `/interface bridge`, у ньому підменю портів.",
          explain: "ether2–ether4 і Wi‑Fi в одній LAN. ether1 (WAN) і ether5 у bridge не входять — і так має бути." },
        { type: "check", title: "Не той список",
          question: "`/interface bridge print` показує лише один рядок `bridge`. Де подивитися, які порти в ньому?",
          options: ["`/interface bridge port print`", "`/interface ethernet print`", "`/ip address print`"],
          correct: 0, feedback: "`bridge print` — самі bridge-інтерфейси, `bridge port print` — їхні учасники." },
        { type: "terminal", title: "Спробуй: списки WAN і LAN",
          task: "Покажи, які інтерфейси входять у списки інтерфейсів (WAN, LAN).",
          expected: ["/interface list member print", "/interface/list/member/print", "/interface/list/member print", "interface list member print"],
          output: "Columns: LIST, INTERFACE\n#   LIST  INTERFACE\n;;; defconf\n0   LAN   bridge\n;;; defconf\n1   WAN   ether1",
          hint: "Меню `/interface list`, у ньому підменю учасників.",
          explain: "Правило firewall «drop all not coming from LAN» довіряє лише тому, що в списку LAN. Порт поза bridge і поза списком — «чужий»." },
        { type: "check", title: "Новий порт — нема доступу",
          question: "Ти вивів ether5 з bridge для лабораторії й підключився до нього ноутбуком. WinBox не пускає до роутера. Чому, найімовірніше?",
          options: ["ether5 зламався", "ether5 не в списку LAN, а firewall на input пропускає лише LAN", "Потрібно перезавантажити роутер"],
          correct: 1, feedback: "Типова конфігурація довіряє лише списку LAN. Додай ether5 у список або дозволь потрібний трафік окремим правилом." },
        { type: "cli", title: "Змінити порт у bridge",
          intro: "<p>Зміни складу bridge — це зміни мережі. Робити їх варто в Safe Mode.</p>",
          commands: [
            { cmd: "/interface bridge port add bridge=bridge interface=ether5", explain: "Додати ether5 у bridge — він стане частиною LAN.", risk: "medium" },
            { cmd: "/interface bridge port remove [find interface=ether2]", explain: "Прибрати ether2 з bridge. Якщо ти підключений через ether2 — зв'язок обірветься.", risk: "high" }
          ] },
        { type: "callout", variant: "danger", title: "Не відпиляй гілку, на якій сидиш",
          body: "<p>Видалення порту з bridge, вимкнення bridge чи зміна VLAN на порту, через який ти підключений, миттєво обриває сесію — і <code>/undo</code> вже не введеш.</p><p>Безпечніше: подивись <code>/user active print</code> і <code>/interface bridge port print</code>, увімкни Safe Mode (<span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">X</span>), змінюй порт, яким ти <em>не</em> користуєшся.</p>" },
        { type: "summary", title: "Підсумок",
          points: ["`/interface ethernet print` — фізичні порти; `/interface bridge print` — bridge.", "`/interface bridge port print` — хто в bridge; `I` — неактивний порт.", "`/interface vlan print` — логічні мережі поверх кабелю.", "`/interface list member print` — склад списків WAN і LAN для firewall.", "Зміни bridge і портів — у Safe Mode і не на тому порту, через який ти підключений."] }
      ],
      glossary: [
        { term: "Bridge", def: "Програмний комутатор: об'єднує порти й Wi‑Fi в одну мережу L2." },
        { term: "Bridge port", def: "Інтерфейс, доданий у bridge." },
        { term: "VLAN", def: "Логічна мережа з номером (VLAN ID) поверх спільного фізичного каналу." },
        { term: "Interface list", def: "Названа група інтерфейсів (WAN, LAN), на яку посилаються правила." }
      ],
      quiz: [
        { question: "На якому інтерфейсі в типовій домашній конфігурації живе адреса LAN `10.0.0.254/24`?", options: ["На ether1", "На bridge", "На wifi1"], correct: 1, feedback: "Адресу ставлять на bridge, щоб усі порти LAN і Wi‑Fi бачили один шлюз." },
        { question: "Що означає прапорець `I` у `/interface bridge port print`?", options: ["Порт неактивний — наприклад, кабель не підключено", "Порт заблокований firewall", "Порт — інтернет"], correct: 0, feedback: "INACTIVE: порт у bridge, але лінку немає." },
        { question: "Навіщо firewall посилається на список `LAN`, а не на конкретні порти?", options: ["Так швидше працює роутер", "Так вимагає RouterOS 7", "Додав інтерфейс у список — і всі правила одразу його враховують"], correct: 2, feedback: "Списки спрощують правила: їх не треба переписувати для кожного нового порту." },
        { question: "Ти підключений до роутера через ether2. Яка зміна найризиковіша?", options: ["`/interface bridge port remove [find interface=ether2]`", "`/interface bridge port print`", "`/interface vlan print`"], correct: 0, feedback: "Прибравши свій порт з bridge, ти втрачаєш адресу LAN — і сесію." },
        { question: "Яка команда покаже VLAN ID інтерфейсу `vlan20-iot`?", options: ["`/interface ethernet print`", "`/interface list print`", "`/interface vlan print`"], correct: 2, feedback: "У меню VLAN — номер і батьківський інтерфейс." },
        { question: "Нова камера в ether5 не отримує адресу, а в ether3 — отримує. Що перевірити першим?", options: ["Версію RouterOS", "Чи входить ether5 у bridge: `/interface bridge port print`", "Сертифікати"], correct: 1, feedback: "DHCP-сервер LAN працює на bridge. Порт поза bridge його не чує." }
      ]
    },
    {
      id: "m04-l02", title: "Wi‑Fi, WireGuard і вимкнення порту", minutes: 12,
      steps: [
        { type: "story", title: "Хто в мережі?",
          body: "<p>Stas помітив у Wi‑Fi незнайомий пристрій, а ще хоче перевірити, чи підключається його ноутбук до дому через WireGuard. Наприкінці — вимкнути лабораторний порт ether5, щоб туди ніхто не підключився.</p>" },
        { type: "concept", title: "Wi‑Fi і WireGuard у RouterOS 7",
          body: "<p>У RouterOS 7 з пакетами <code>wifi-qcom</code>/<code>wifi-qcom-ac</code> бездротові інтерфейси керуються в меню <code>/interface wifi</code>; підключені клієнти — у <code>registration-table</code>. На старих пристроях з пакетом <code>wireless</code> меню інше — залежить від моделі.</p><p><strong>WireGuard</strong> — VPN-інтерфейс; кожен <em>пір</em> — пристрій, якому дозволено підключатися.</p>",
          analogy: "Registration table — список гостей, які зараз у тебе вдома: хто, звідки і як добре чути (сигнал). Піри WireGuard — список людей, які мають ключ від дверей: вони можуть і не бути вдома зараз, але прийти можуть." },
        { type: "cli", title: "Хто підключений",
          commands: [
            { cmd: "/interface wifi registration-table print", explain: "Wi‑Fi клієнти зараз: MAC, час підключення, сигнал.", output: "Columns: INTERFACE, MAC-ADDRESS, UPTIME, SIGNAL, BAND\n# INTERFACE  MAC-ADDRESS        UPTIME   SIGNAL  BAND\n0 wifi1      3C:22:FB:10:AA:50  2h14m3s     -58  5ghz-ac\n1 wifi1      A4:83:E7:5C:01:42  35m10s      -67  5ghz-ac", risk: "low" },
            { cmd: "/interface wireguard print", explain: "WireGuard-інтерфейси: порт і <em>публічний</em> ключ. Приватний ключ нікому не показують.", risk: "low" },
            { cmd: "/interface wireguard peers print", explain: "Піри: публічні ключі пристроїв і дозволені їм адреси.", risk: "low" },
            { cmd: "/interface monitor-traffic ether1", explain: "Швидкість трафіку на порту наживо. Вихід — <span class=\"kbd\">Q</span> або <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">C</span>.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: Wi‑Fi клієнти",
          task: "Покажи Wi‑Fi клієнтів, підключених зараз (RouterOS 7, меню wifi).",
          expected: ["/interface wifi registration-table print", "/interface/wifi/registration-table/print", "/interface/wifi/registration-table print", "interface wifi registration-table print"],
          output: "Columns: INTERFACE, MAC-ADDRESS, UPTIME, SIGNAL, BAND\n# INTERFACE  MAC-ADDRESS        UPTIME   SIGNAL  BAND\n0 wifi1      3C:22:FB:10:AA:50  2h14m3s     -58  5ghz-ac\n1 wifi1      A4:83:E7:5C:01:42  35m10s      -67  5ghz-ac",
          hint: "`/interface wifi`, потім таблиця реєстрацій клієнтів.",
          explain: "MAC `3C:22:FB…` збігається з iPhone з DHCP-лізів. Другий пристрій звір з `/ip dhcp-server lease print`." },
        { type: "check", title: "Пір є, зв'язку немає",
          question: "Ноутбук є в `/interface wireguard peers print`, але `/interface wireguard print` показує інтерфейс `wg-home` з прапорцем `X`. Чому ноутбук не підключається?",
          options: ["Пір неправильний", "Треба перезавантажити ноутбук", "Інтерфейс WireGuard вимкнений (`X` — DISABLED)"],
          correct: 2, feedback: "Спершу стан інтерфейсу, потім піри. Вимкнений інтерфейс не прийме нікого." },
        { type: "cli", title: "Вимкнути й увімкнути порт",
          commands: [
            { cmd: "/interface disable ether5", explain: "Вимкнути порт ether5. Те саме — <code>/interface set ether5 disabled=yes</code>.", risk: "high" },
            { cmd: "/interface enable ether5", explain: "Увімкнути назад.", risk: "medium" },
            { cmd: "/interface print where disabled=yes", explain: "Перевірити, що вимкнено саме те, що треба.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: вимкни ether5",
          task: "Вимкни лабораторний порт `ether5`.",
          expected: ["/interface disable ether5", "/interface disable numbers=ether5", "/interface set ether5 disabled=yes", "/interface/disable ether5", "interface disable ether5"],
          output: "",
          hint: "Меню `/interface`, дія вимкнення, ім'я порту.",
          explain: "RouterOS мовчить при успіху. `/interface print` покаже `X` біля ether5. Відкотити — `/interface enable ether5` або `/undo`." },
        { type: "callout", variant: "danger", title: "disable на WAN чи своєму порту",
          body: "<p><code>/interface disable ether1</code> вимикає інтернет усьому дому; вимкнення bridge, свого порту чи VPN-тунелю, через який ти зайшов, відрізає тебе від роутера — і ввімкнути назад уже нікому.</p><p>Безпечніше: <code>/user active print</code> — звідки ти підключений; Safe Mode (<span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">X</span>); вимикай лише порт, яким не користуєшся.</p>" },
        { type: "check", title: "Сигнал",
          question: "У registration-table ноутбук має `SIGNAL -82`, телефон — `-55`. Що це означає?",
          options: ["Ноутбук має кращий сигнал", "Сигнал ноутбука значно слабший: число ближче до нуля — краще", "Обидва однакові"],
          correct: 1, feedback: "Сигнал у dBm від'ємний: −55 сильний, −82 слабкий. Ноутбук далеко від точки або за стінами." },
        { type: "summary", title: "Підсумок",
          points: ["`/interface wifi registration-table print` — хто зараз у Wi‑Fi (RouterOS 7, пакет wifi).", "`/interface wireguard print` і `peers print` — стан VPN і дозволені пристрої; показують лише публічні ключі.", "`/interface monitor-traffic ether1` — швидкість наживо.", "`/interface disable ether5` / `enable ether5` — вимкнути й увімкнути порт.", "Не вимикай WAN, bridge чи свій порт без Safe Mode і плану."] }
      ],
      glossary: [
        { term: "Registration table", def: "Список Wi‑Fi клієнтів, підключених зараз." },
        { term: "WireGuard peer", def: "Пристрій з публічним ключем, якому дозволено підключатися до WireGuard-інтерфейсу." },
        { term: "SIGNAL (dBm)", def: "Рівень сигналу клієнта: ближче до нуля — сильніший." },
        { term: "disabled", def: "Властивість об'єкта: `yes` — вимкнений (прапорець `X`)." }
      ],
      quiz: [
        { question: "Де в RouterOS 7 з пакетом wifi шукати підключених Wi‑Fi клієнтів?", options: ["`/interface wifi registration-table print`", "`/ip wifi clients print`", "`/system wifi print`"], correct: 0, feedback: "Меню `/interface wifi` — для нового драйвера Wi‑Fi у RouterOS 7." },
        { question: "Що можна показувати іншим з виводу `/interface wireguard print`?", options: ["Приватний ключ", "Публічний ключ — його й передають пірам", "Нічого"], correct: 1, feedback: "Публічний ключ для того й існує, щоб ним обмінюватися. Приватний — секрет." },
        { question: "Як перевірити, які інтерфейси зараз вимкнені?", options: ["`/interface enable`", "`/interface disable`", "`/interface print where disabled=yes`"], correct: 2, feedback: "Фільтр `where` лише показує, нічого не змінюючи." },
        { question: "Чому `/interface disable ether5` має ризик «високий», хоча ether5 лабораторний?", options: ["Бо ця ж дія на WAN, bridge чи твоєму порту обірве зв'язок — завжди перевіряй, що саме вимикаєш", "Бо ether5 зламається", "Бо команда видаляє порт"], correct: 0, feedback: "Ризик залежить від цілі. Дисципліна однакова: перевірка, Safe Mode, одна зміна." },
        { question: "Ти вимкнув не той порт, але зв'язок не обірвався. Найшвидший відкат?", options: ["`/system reset-configuration`", "`/undo` або `/interface enable` для того порту", "Перезавантажити роутер"], correct: 1, feedback: "`/undo` скасовує останню зміну; `enable` явно вмикає порт." },
        { question: "Яка команда покаже швидкість трафіку на ether1 наживо?", options: ["`/interface ethernet print`", "`/ip address print`", "`/interface monitor-traffic ether1`"], correct: 2, feedback: "`monitor-traffic` оновлюється щосекунди; вихід — Q або Ctrl+C." }
      ]
    }
  ]
});
