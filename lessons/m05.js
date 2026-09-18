window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m05", order: 5, title: "IP, маршрути, DNS, DHCP", subtitle: "Адреси, маршрути, DNS, ARP, сусіди, DHCP", icon: "route",
  goal: "Після модуля ти перевіряєш IP-рівень роутера — адреси, маршрут за замовчуванням, DNS, ARP, DHCP і сусідні пристрої — і робиш перші зміни через add і set.",
  lessons: [
    {
      id: "m05-l01", title: "Адреси, маршрути, DNS і DHCP", minutes: 14,
      steps: [
        { type: "concept", title: "Розділ /ip",
          body: "<p>У <code>/ip</code> — усе про IPv4: адреси (<code>address</code>), маршрути (<code>route</code>), DNS, DHCP, ARP, firewall, сервіси. IPv6 живе окремо в <code>/ipv6</code>.</p><p><code>/ip neighbor</code> — не IP-сусіди в маршрутизації, а пристрої, знайдені протоколами виявлення <strong>MNDP, CDP і LLDP</strong>: інші MikroTik, керовані комутатори.</p>",
          analogy: "Адреса — номер будинку роутера на кожній вулиці (інтерфейсі). Таблиця маршрутів — дорожні вказівники: «до 10.0.0.x — сюди, все інше — на трасу через провайдера». DNS — довідкове бюро, що перетворює назву сайту на адресу. DHCP — адміністратор готелю, який видає гостям номери кімнат." },
        { type: "cli", title: "Перевірка IP-рівня",
          commands: [
            { cmd: "/ip route print", explain: "Маршрути. <code>0.0.0.0/0</code> — маршрут за замовчуванням в інтернет; <code>DAd</code> — динамічний, активний, отриманий від DHCP.", output: "Flags: D - DYNAMIC; A - ACTIVE; c - CONNECT, s - STATIC, d - DHCP\nColumns: DST-ADDRESS, GATEWAY, DISTANCE\n#     DST-ADDRESS      GATEWAY       DISTANCE\n0 DAd 0.0.0.0/0        198.51.100.1         1\n1 DAc 10.0.0.0/24      bridge               0\n2 DAc 198.51.100.0/24  ether1               0", risk: "low" },
            { cmd: "/ip dns print", explain: "DNS-сервери роутера і чи відповідає він клієнтам LAN (<code>allow-remote-requests</code>).", risk: "low" },
            { cmd: "/ip dhcp-client print", explain: "Адреса, яку WAN отримав від провайдера.", risk: "low" },
            { cmd: "/ip dhcp-server lease print", explain: "Які пристрої LAN отримали адреси; <code>D</code> — динамічна видача.", risk: "low" },
            { cmd: "/ip arp print", explain: "Яка IP-адреса за якою MAC-адресою — хто реально присутній у мережі.", risk: "low" },
            { cmd: "/ip neighbor print", explain: "Сусідні пристрої за MNDP/CDP/LLDP: ім'я, модель, версія.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: маршрут в інтернет",
          task: "Покажи лише маршрут за замовчуванням (`dst-address=0.0.0.0/0`).",
          expected: ["/ip route print where dst-address=0.0.0.0/0", "/ip/route/print where dst-address=0.0.0.0/0", "/ip/route print where dst-address=0.0.0.0/0", "ip route print where dst-address=0.0.0.0/0"],
          output: "Flags: D - DYNAMIC; A - ACTIVE; c - CONNECT, s - STATIC, d - DHCP\nColumns: DST-ADDRESS, GATEWAY, DISTANCE\n#     DST-ADDRESS  GATEWAY       DISTANCE\n0 DAd 0.0.0.0/0    198.51.100.1         1",
          hint: "`/ip route print` + фільтр `where` за властивістю `dst-address`.",
          explain: "Маршрут активний (`A`) і веде на шлюз провайдера. Якщо цього рядка немає чи він без `A` — інтернету з роутера не буде." },
        { type: "check", title: "Немає default route",
          question: "`/ip route print` не має рядка `0.0.0.0/0`, а `/ip dhcp-client print` показує `status: searching`. Що відбувається?",
          options: ["DNS зламаний", "Роутер не отримав адресу від провайдера, тому й маршрут в інтернет не з'явився", "Wi‑Fi вимкнено"],
          correct: 1, feedback: "Маршрут `DAd` створює DHCP-клієнт. Немає лізу від провайдера — немає і маршруту. Перевір кабель і ether1." },
        { type: "terminal", title: "Спробуй: сусіди",
          task: "Покажи сусідні пристрої, знайдені протоколами виявлення (MNDP/CDP/LLDP).",
          expected: ["/ip neighbor print", "/ip/neighbor/print", "/ip/neighbor print", "ip neighbor print"],
          output: "Columns: INTERFACE, ADDRESS, MAC-ADDRESS, IDENTITY, PLATFORM, VERSION\n# INTERFACE      ADDRESS   MAC-ADDRESS        IDENTITY       PLATFORM  VERSION\n0 ether2,bridge  10.0.0.2  48:A9:8A:77:10:02  hAP-ax2        MikroTik  7.19.4 (stable)\n1 ether3,bridge  10.0.0.3  00:1E:58:40:10:03  office-switch",
          hint: "Меню сусідів у розділі `/ip`.",
          explain: "Точка доступу hAP ax² знайдена через MNDP (протокол MikroTik), комутатор — через LLDP. Це не таблиця маршрутизації, а «хто поруч на кабелі»." },
        { type: "cli", title: "Перші зміни: add і set",
          commands: [
            { cmd: "/ip address add address=10.0.1.1/24 interface=ether5", explain: "Нова мережа <code>10.0.1.0/24</code> на лабораторному порту. Роутер сам додасть маршрут <code>DAc</code>.", risk: "medium" },
            { cmd: "/ip dns set servers=1.1.1.1,8.8.8.8", explain: "Змінити DNS-сервери роутера. Старе значення спершу подивись у <code>/ip dns print</code>.", risk: "medium" },
            { cmd: "/ip route remove [find dst-address=0.0.0.0/0]", explain: "Видалити маршрути за замовчуванням, додані вручну (динамічний маршрут від DHCP так не видаляється). Без маршруту в інтернет роутер перестане відповідати ззовні.", risk: "high" }
          ] },
        { type: "terminal", title: "Спробуй: зміни DNS",
          task: "Задай DNS-сервери роутера `1.1.1.1` і `8.8.8.8`.",
          expected: ["/ip dns set servers=1.1.1.1,8.8.8.8", "/ip dns set servers=\"1.1.1.1,8.8.8.8\"", "/ip/dns/set servers=1.1.1.1,8.8.8.8", "/ip/dns set servers=1.1.1.1,8.8.8.8", "ip dns set servers=1.1.1.1,8.8.8.8"],
          output: "",
          hint: "Меню DNS, дія зміни, параметр `servers=` — адреси через кому без пробілів.",
          explain: "Тиша означає успіх. Перевір `/ip dns print`. Відкотити — `/undo` або `set` зі старим значенням." },
        { type: "callout", variant: "danger", title: "Маршрути й адреси — під ногами",
          body: "<p>Видалення маршруту за замовчуванням чи адреси інтерфейсу, через який ти підключений, діє одразу і обриває сесію. Помилка в <code>servers=</code> тихо ламає інтернет усім у домі.</p><p>Безпечніше: <code>print</code> і <code>/export</code> до зміни, Safe Mode (<span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">X</span>), після зміни — <code>/ping</code> і перевірка на клієнті.</p>" },
        { type: "check", title: "Чий це пристрій",
          question: "У Wi‑Fi незнайомий MAC `A4:83:E7:5C:01:42`. Яка команда найшвидше покаже його ім'я хоста й адресу?",
          options: ["`/ip route print`", "`/ip dns print`", "`/ip dhcp-server lease print`"],
          correct: 2, feedback: "У лізах DHCP видно MAC, видану IP і host-name, який пристрій повідомив сам." },
        { type: "summary", title: "Підсумок",
          points: ["`/ip route print` — маршрути; `0.0.0.0/0` з прапорцем `A` — шлях в інтернет.", "`/ip dns print`, `/ip dhcp-client print`, `/ip dhcp-server lease print`, `/ip arp print` — хто є хто в мережі.", "`/ip neighbor print` — пристрої за MNDP/CDP/LLDP, не маршрутизація.", "`add` і `set` змінюють одразу: спершу `print`, потім зміна, потім перевірка.", "Видалення маршруту чи адреси віддалено — високий ризик."] }
      ],
      glossary: [
        { term: "Default route", def: "Маршрут `0.0.0.0/0` — куди відправляти все, для чого немає точнішого маршруту." },
        { term: "DHCP lease", def: "Запис про видану пристрою адресу: MAC, IP, host-name." },
        { term: "ARP", def: "Таблиця відповідності IP-адрес і MAC-адрес у локальній мережі." },
        { term: "MNDP / LLDP / CDP", def: "Протоколи виявлення сусідніх пристроїв; результати — у `/ip neighbor`." },
        { term: "allow-remote-requests", def: "Параметр DNS: чи відповідає роутер на DNS-запити клієнтів." }
      ],
      quiz: [
        { question: "Що показує `/ip neighbor print`?", options: ["Пристрої поруч, знайдені протоколами MNDP/CDP/LLDP", "Таблицю маршрутизації IPv4", "Усі IPv4-адреси в інтернеті"], correct: 0, feedback: "Це виявлення сусідів на рівні каналу: інші MikroTik, комутатори з LLDP." },
        { question: "Що означає `DAd` біля маршруту `0.0.0.0/0`?", options: ["Маршрут видалено", "Динамічний, активний, отриманий від DHCP", "Помилковий маршрут"], correct: 1, feedback: "D — dynamic, A — active, d — DHCP." },
        { question: "Сайти за IP відкриваються, за іменем — ні. Яка команда на роутері перша?", options: ["`/ip arp print`", "`/interface bridge print`", "`/ip dns print`"], correct: 2, feedback: "Проблема з іменами — це DNS: перевір `servers` і `dynamic-servers`." },
        { question: "Що станеться після `/ip address add address=10.0.1.1/24 interface=ether5`?", options: ["На ether5 з'явиться адреса, а в маршрутах — `DAc 10.0.1.0/24`", "Зміниться адреса LAN", "Нічого, це перегляд"], correct: 0, feedback: "Connected-маршрут з'являється автоматично для кожної адреси." },
        { question: "Перед `/ip dns set servers=…` що варто зробити, щоб легко повернути все назад?", options: ["Нічого", "`/ip dns print` — запам'ятати старі значення (а краще `/export`)", "Перезавантажити роутер"], correct: 1, feedback: "Знаючи старе значення, повернешся одним `set` або `/undo`." },
        { question: "Яка з команд може віддалено обірвати тобі доступ?", options: ["`/ip route print`", "`/ip neighbor print`", "`/ip route remove` для маршруту за замовчуванням"], correct: 2, feedback: "Без маршруту в інтернет роутер не відповість тобі ззовні." }
      ]
    }
  ]
});
