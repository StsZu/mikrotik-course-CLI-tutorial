window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m07", order: 7, title: "VPN і сертифікати", subtitle: "Діагностика IPsec, журнал ipsec, сертифікати", icon: "vpn_key",
  goal: "Після модуля ти покроково діагностуєш IPsec-тунель (peer → IKE → SA → policy), читаєш журнал ipsec і перевіряєш сертифікати, не показуючи приватних ключів.",
  lessons: [
    {
      id: "m07-l01", title: "Діагностика IPsec", minutes: 13,
      steps: [
        { type: "story", title: "Тунель в офіс мовчить",
          body: "<p>Домашній роутер Stas тримає IPsec-тунель до офісу (<code>203.0.113.10</code>): домашня мережа <code>10.0.0.0/24</code> ходить до офісної <code>192.168.50.0/24</code>. Сьогодні офісний сервер не відповідає. Треба зрозуміти, на якому кроці зламався тунель, нічого не змінюючи навмання.</p>" },
        { type: "concept", title: "Чотири поверхи IPsec",
          body: "<p><strong>Peer</strong> — з ким будуємо тунель. <strong>Identity</strong> — як доводимо, хто ми (сертифікат чи спільний ключ). Коли домовились — з'являється <strong>active peer</strong> (IKE). Потім встановлюються <strong>SA</strong> — ключі, якими реально шифрується трафік. <strong>Policy</strong> каже, трафік між якими мережами шифрувати.</p><p>Меню однаково пишуть <code>/ip ipsec …</code> або <code>/ip/ipsec/…</code>.</p>",
          analogy: "IPsec — як домовленість двох офісів про кур'єра з сейфом. Peer — адреса другого офісу, identity — посвідчення кур'єра, active peer — «ми познайомились і домовились», SA — сейф з кодом, у якому реально возять документи, policy — список, які саме папки класти в сейф. Нема сейфа (SA) — знайомство нічого не дає." },
        { type: "cli", title: "Від peer до SA",
          commands: [
            { cmd: "/ip ipsec peer print", explain: "Налаштовані піри: адреса і профіль.", risk: "low" },
            { cmd: "/ip ipsec active-peers print", explain: "З ким зараз встановлено IKE: <code>state=established</code> — знайомство відбулося.", output: "Columns: ID, STATE, UPTIME, PH2-TOTAL, REMOTE-ADDRESS\n# ID      STATE        UPTIME  PH2-TOTAL  REMOTE-ADDRESS\n0 office  established  2h14m           1  203.0.113.10", risk: "low" },
            { cmd: "/ip ipsec installed-sa print", explain: "Встановлені SA. Немає SA — трафік не шифрується, хоч IKE і встановлено.", risk: "low" },
            { cmd: "/ip ipsec policy print", explain: "Політики: між якими мережами шифрувати; <code>A</code> — активна.", risk: "low" },
            { cmd: "/ip ipsec identity print", explain: "Як пір автентифікується: <code>digital-signature</code> (сертифікат) чи <code>pre-shared-key</code>.", risk: "low" },
            { cmd: "/log print where topics~\"ipsec\"", explain: "Журнал лише про IPsec: помилки узгодження, автентифікації.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: активні піри",
          task: "Покажи IPsec-піри, з якими зараз встановлено IKE-з'єднання.",
          expected: ["/ip ipsec active-peers print", "/ip/ipsec/active-peers/print", "/ip/ipsec/active-peers print", "/ip/ipsec active-peers print", "ip ipsec active-peers print"],
          output: "Columns: ID, STATE, UPTIME, PH2-TOTAL, REMOTE-ADDRESS\n# ID      STATE        UPTIME  PH2-TOTAL  REMOTE-ADDRESS\n0 office  established  2h14m           1  203.0.113.10",
          hint: "`/ip ipsec`, підменю активних пірів, дія — показати.",
          explain: "IKE з офісом встановлено. Наступний поверх — SA: `/ip ipsec installed-sa print`." },
        { type: "check", title: "IKE є, SA немає",
          question: "`active-peers` показує `established`, а `installed-sa print` порожній. Де шукати проблему?",
          options: ["У кабелі WAN", "У policy/proposal: сторони не домовились про те, який трафік і чим шифрувати", "У DNS"],
          correct: 1, feedback: "IKE пройшов, отже зв'язок і автентифікація є. SA не встановлюються через розбіжність policy (мережі) чи proposal (алгоритми). Журнал `topics~\"ipsec\"` підкаже деталі." },
        { type: "terminal", title: "Спробуй: журнал IPsec",
          task: "Покажи лише записи журналу про IPsec.",
          expected: ["/log print where topics~\"ipsec\"", "/log print where topics~ipsec", "/log/print where topics~\"ipsec\"", "log print where topics~\"ipsec\""],
          output: "2026-09-18 12:15:21 ipsec,info office: IKE SA established (ike2), peer 203.0.113.10",
          hint: "Той самий фільтр журналу, що для firewall, але інша тема.",
          explain: "Запис підтверджує: IKE-частина працює. Помилки узгодження тут виглядали б як `ipsec,error`." },
        { type: "cli", title: "Зміни, що кладуть VPN",
          commands: [
            { cmd: "/ip ipsec policy remove [find dst-address=192.168.50.0/24]", explain: "Видалити політику — трафік в офіс перестане шифруватися й ходити.", risk: "high" },
            { cmd: "/ip ipsec peer disable office", explain: "Вимкнути пір — тунель впаде. Якщо ти керуєш через цей тунель — втратиш доступ.", risk: "high" }
          ] },
        { type: "callout", variant: "danger", title: "VPN, через який ти зайшов",
          body: "<p>Зміни policy, peer, identity чи proposal на віддаленому роутері, до якого ти підключений через цей самий тунель, обривають і тунель, і твою сесію.</p><p>Безпечніше: <code>/ip ipsec export</code> перед змінами, Safe Mode (<span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">X</span>), запасний шлях доступу (другий VPN або доступ на місці).</p>" },
        { type: "check", title: "Політика не та",
          question: "`/ip ipsec policy print`: активна політика `10.0.0.0/24 → 192.168.5.0/24`, а офісна мережа — `192.168.50.0/24`. Що станеться з трафіком до `192.168.50.10`?",
          options: ["Він не потрапить у тунель — policy не збігається з мережею офісу", "Він піде тунелем", "Роутер сам виправить помилку"],
          correct: 0, feedback: "Policy — точний селектор трафіку. Помилка в одній цифрі — трафік іде повз тунель." },
        { type: "summary", title: "Підсумок",
          points: ["Порядок діагностики: `peer print` → `active-peers print` → `installed-sa print` → `policy print`.", "IKE є, SA немає — шукай розбіжність policy чи proposal.", "`/log print where topics~\"ipsec\"` — причини помилок.", "`/ip ipsec …` і `/ip/ipsec/…` — одне й те саме.", "Зміни IPsec на віддаленому роутері — лише з export, Safe Mode і запасним доступом."] }
      ],
      glossary: [
        { term: "IPsec peer", def: "Віддалена сторона тунелю: адреса, профіль, режим обміну (ike2)." },
        { term: "Active peer", def: "Пір, з яким зараз встановлено IKE-з'єднання." },
        { term: "SA (Security Association)", def: "Узгоджені ключі й алгоритми, якими реально шифрується трафік." },
        { term: "Policy", def: "Правило, трафік між якими мережами шифрувати в тунелі." },
        { term: "Identity", def: "Спосіб автентифікації піра: сертифікат або спільний ключ." }
      ],
      quiz: [
        { question: "Що підтверджує, що трафік справді шифрується тунелем?", options: ["Наявність рядка в `/ip ipsec peer print`", "Встановлені SA в `/ip ipsec installed-sa print`", "Запис у `/user active print`"], correct: 1, feedback: "Налаштований пір — лише намір. SA — реальні ключі шифрування." },
        { question: "`active-peers` порожній, у журналі `ipsec,error … authentication failed`. Що перевірити?", options: ["Identity: сертифікат або спільний ключ з обох сторін", "Правила NAT", "Wi‑Fi"], correct: 0, feedback: "Помилка автентифікації — це identity: не той сертифікат, прострочений сертифікат або різний ключ." },
        { question: "Які записи рівнозначні?", options: ["`/ip ipsec policy print` і `/ip ipsec peer print`", "`/ip ipsec print` і `/ipsec print`", "`/ip ipsec policy print` і `/ip/ipsec/policy/print`"], correct: 2, feedback: "Пробіл і `/` у шляху рівнозначні в RouterOS 7." },
        { question: "Ти вдома, керуєш офісним роутером через IPsec-тунель. Що з цього найризиковіше?", options: ["`/ip ipsec installed-sa print`", "`/log print where topics~\"ipsec\"`", "`/ip ipsec peer disable office` на офісному роутері"], correct: 2, feedback: "Вимкнеш пір — впаде тунель, а з ним і твій доступ." },
        { question: "Що робить `/ip ipsec policy print`?", options: ["Показує, трафік між якими мережами шифрувати, нічого не змінюючи", "Видаляє політики", "Перезапускає тунель"], correct: 0, feedback: "Як і будь-який `print`, лише читає." },
        { question: "Перед зміною proposal (алгоритмів) на робочому тунелі найкраще:", options: ["Одразу змінити на обох сторонах", "`/ip ipsec export` на обох роутерах, Safe Mode, мати запасний доступ", "Перезавантажити обидва роутери"], correct: 1, feedback: "Якщо алгоритми розійдуться, тунель не підніметься — потрібен план відкату." }
      ]
    },
    {
      id: "m07-l02", title: "Сертифікати на роутері", minutes: 11,
      steps: [
        { type: "concept", title: "Що таке сертифікат на роутері",
          body: "<p>Сертифікат — підтверджене посвідчення: «цей ключ належить <code>vpn.home.lan</code>». Роутер використовує їх для IPsec/IKEv2, SSTP, OpenVPN і HTTPS.</p><p>У <code>/certificate print</code> прапорці: <code>K</code> — на роутері є <strong>приватний ключ</strong>, <code>A</code> — центр сертифікації (CA), <code>I</code> — виданий, <code>T</code> — довірений.</p>",
          analogy: "Сертифікат — паспорт, CA — паспортний стіл, що його видав. Приватний ключ — твій підпис, який ніхто не може підробити. Паспорт можна показувати всім, а от підпис (приватний ключ) у чужі руки не віддають — з ним можна «бути тобою»." },
        { type: "cli", title: "Перевірка сертифікатів",
          commands: [
            { cmd: "/certificate print", explain: "Список сертифікатів з прапорцями.", output: "Flags: K - PRIVATE-KEY; L - CRL; A - AUTHORITY; I - ISSUED; T - TRUSTED\nColumns: NAME, COMMON-NAME, DAYS-VALID\n# FLAGS  NAME        COMMON-NAME         DAYS-VALID\n0 KLAT   ca-home     ca-home                   3650\n1 KIT    vpn-home    vpn.home.lan               365\n2 T      vpn-office  vpn.office.example         365\n3 KIT    www-ssl     10.0.0.254                 365", risk: "low" },
            { cmd: "/certificate print detail", explain: "Усі поля: <code>invalid-after</code> (до якої дати дійсний), відбиток <code>fingerprint</code>.", risk: "low" },
            { cmd: "/certificate print where name~\"vpn\"", explain: "Лише сертифікати, в імені яких є <code>vpn</code>.", risk: "low" },
            { cmd: "/certificate export", explain: "Експорт <em>налаштувань</em> меню сертифікатів. Самі сертифікати й ключі звичайний export не вивантажує.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: деталі сертифікатів",
          task: "Покажи сертифікати з усіма полями (строк дії, відбиток).",
          expected: ["/certificate print detail", "/certificate/print detail", "/certificate/print/detail", "certificate print detail"],
          output: "Flags: K - PRIVATE-KEY; L - CRL; A - AUTHORITY; I - ISSUED; T - TRUSTED\n 1 KIT  name=\"vpn-home\" common-name=\"vpn.home.lan\" key-size=2048 days-valid=365\n         invalid-before=2026-09-01 10:00:00 invalid-after=2027-09-01 10:00:00\n         fingerprint=\"5f1c…a93e\"\n 3 KIT  name=\"www-ssl\" common-name=\"10.0.0.254\" key-size=2048 days-valid=365\n         invalid-before=2025-10-02 10:00:00 invalid-after=2026-10-02 10:00:00",
          hint: "`/certificate print` і слово, що просить усіх полів.",
          explain: "`www-ssl` спливає 2026-10-02 — за два тижні. Час запланувати новий сертифікат." },
        { type: "check", title: "Прострочений сертифікат",
          question: "IKEv2 з офісом раптом перестав підніматися, у журналі — помилка перевірки сертифіката. Що перевірити першим?",
          options: ["`/certificate print detail` — `invalid-after` і чи правильний час на роутері (`/system clock print`)", "`/interface ethernet print`", "`/ip dns print`"],
          correct: 0, feedback: "Прострочений сертифікат або збитий годинник — найчастіші причини помилок перевірки." },
        { type: "terminal", title: "Спробуй: лише VPN-сертифікати",
          task: "Покажи лише сертифікати, в імені яких є `vpn`.",
          expected: ["/certificate print where name~\"vpn\"", "/certificate print where name~vpn", "/certificate/print where name~\"vpn\"", "certificate print where name~\"vpn\""],
          output: "Flags: K - PRIVATE-KEY; L - CRL; A - AUTHORITY; I - ISSUED; T - TRUSTED\nColumns: NAME, COMMON-NAME, DAYS-VALID\n# FLAGS  NAME        COMMON-NAME         DAYS-VALID\n1 KIT    vpn-home    vpn.home.lan               365\n2 T      vpn-office  vpn.office.example         365",
          hint: "Фільтр `where` за властивістю `name` з оператором `~`.",
          explain: "`vpn-home` — наш сертифікат з приватним ключем (`K`), `vpn-office` — лише довірений сертифікат офісу, без ключа." },
        { type: "cli", title: "Дії з ключами",
          commands: [
            { cmd: "/certificate export-certificate vpn-home export-passphrase=…", explain: "Вивантажити сертифікат <strong>разом з приватним ключем</strong> у файл. Замість <code>…</code> — довга унікальна фраза; без неї ключ не вивантажиться.", risk: "high" },
            { cmd: "/certificate remove vpn-home", explain: "Видалити сертифікат — усе, що на ньому трималося (VPN, HTTPS), перестане працювати.", risk: "high" }
          ] },
        { type: "callout", variant: "danger", title: "Приватний ключ — секрет",
          body: "<p>Файл з <code>export-certificate</code> і ключем дає змогу видавати себе за твій роутер. Видалення сертифіката миттєво ламає VPN чи HTTPS, що на ньому працюють.</p><p>Безпечніше: експортуй ключ лише за потреби, з надійною <code>export-passphrase</code>, передавай захищеним каналом і видали файл з роутера (<code>/file print</code>) після копіювання; перед <code>remove</code> перевір, де сертифікат використовується (<code>/ip ipsec identity print</code>, <code>/ip service print</code>).</p>" },
        { type: "check", title: "Що можна надіслати",
          question: "Офісний адміністратор просить «сертифікат для налаштування довіри». Що безпечно надіслати?",
          options: ["Файл з `export-certificate` разом з приватним ключем", "Публічний сертифікат (CA чи роутера) без приватного ключа", "Бекап роутера"],
          correct: 1, feedback: "Для довіри досить публічної частини. Приватний ключ і бекап не залишають твоїх рук." },
        { type: "summary", title: "Підсумок",
          points: ["`/certificate print` — список; `K` означає, що на роутері є приватний ключ.", "`print detail` — строк дії (`invalid-after`) і відбиток.", "`print where name~\"vpn\"` — швидкий фільтр.", "Помилка перевірки сертифіката: строк дії і `/system clock print`.", "`export-certificate` з ключем і `remove` — високий ризик: passphrase, захищений канал, перевірка залежностей."] }
      ],
      glossary: [
        { term: "CA", def: "Центр сертифікації — сертифікат, що підписує інші (прапорець `A`)." },
        { term: "Приватний ключ", def: "Секретна частина пари; прапорець `K` у `/certificate print`." },
        { term: "invalid-after", def: "Дата, після якої сертифікат недійсний." },
        { term: "export-passphrase", def: "Пароль, яким шифрується експортований приватний ключ." }
      ],
      quiz: [
        { question: "Що означає прапорець `K` у `/certificate print`?", options: ["Сертифікат відкликано", "Сертифікат прострочений", "На роутері є приватний ключ цього сертифіката"], correct: 2, feedback: "K — PRIVATE-KEY. Такий сертифікат роутер може використовувати, щоб довести, що він — це він." },
        { question: "Яка команда покаже, до якої дати дійсні сертифікати?", options: ["`/certificate print detail`", "`/certificate export`", "`/system identity print`"], correct: 0, feedback: "Поле `invalid-after` є у детальному виводі." },
        { question: "Що з цього потрапляє у звичайний `/export`?", options: ["Приватні ключі сертифікатів", "Паролі користувачів", "Налаштування меню, але не самі сертифікати й ключі"], correct: 2, feedback: "Сертифікати переносять окремо: `export-certificate` / `import`." },
        { question: "Чому `export-certificate` з ключем — високий ризик?", options: ["Бо ламає роутер", "Бо файл з ключем дає змогу видавати себе за твій роутер", "Бо видаляє сертифікат"], correct: 1, feedback: "Ключ — секрет. Експорт лише з passphrase і захищеним каналом." },
        { question: "Перед `/certificate remove www-ssl` що варто перевірити?", options: ["Чи сертифікат не використовує сервіс `www-ssl` чи VPN (`/ip service print`, `/ip ipsec identity print`)", "Версію RouterOS", "Список Wi‑Fi клієнтів"], correct: 0, feedback: "Видалиш сертифікат, на якому працює сервіс, — сервіс перестане працювати." },
        { question: "Сертифікат дійсний до 2027 року, але роутер каже, що він «ще не дійсний». Найімовірніша причина?", options: ["Зламаний Wi‑Fi", "Годинник роутера збитий (напр. 1970 рік) — перевір `/system clock print`", "Забагато правил firewall"], correct: 1, feedback: "Перевірка сертифіката порівнює дати з часом роутера." }
      ]
    }
  ]
});
