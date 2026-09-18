window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m03", order: 3, title: "Система і діагностика", subtitle: "Ресурси, пакети, час, журнал, ping, traceroute, torch", icon: "monitor_heart",
  goal: "Після модуля ти за хвилину оцінюєш стан роутера, читаєш і фільтруєш журнал та знаходиш, де обривається зв'язок, інструментами /ping, traceroute і torch.",
  lessons: [
    {
      id: "m03-l01", title: "Стан роутера: ресурси, пакети, час", minutes: 11,
      steps: [
        { type: "story", title: "«Інтернет гальмує»",
          body: "<p>Увечері домашні скаржаться: сайти відкриваються повільно. Перш ніж щось міняти, Stas хоче знати, чи живий сам роутер: чи не завантажений процесор, чи вистачає пам'яті, коли він перезавантажувався і яка версія RouterOS.</p>" },
        { type: "concept", title: "Меню /system",
          body: "<p>У <code>/system</code> живе все про сам пристрій: ресурси, плата, пакети, годинник, ім'я. Усі ці <code>print</code> лише читають.</p><p>У RouterOS 7 є основний пакет <code>routeros</code> і опційні пакети, які ставлять за потреби: <code>wifi-qcom</code> чи <code>wifi-qcom-ac</code> для Wi‑Fi, <code>container</code> для контейнерів тощо.</p>",
          analogy: "`/system resource print` — як панель приладів в авто: швидкість (CPU), бак (пам'ять), пробіг з останньої зупинки (uptime). `/system package print` — перелік встановленого додаткового обладнання: причіп, багажник на даху." },
        { type: "cli", title: "П'ять швидких перевірок",
          commands: [
            { cmd: "/system resource print", explain: "Uptime, версія, вільна пам'ять, навантаження CPU, модель.", output: "            uptime: 3d12h4m10s\n           version: 7.19.4 (stable)\n       free-memory: 892.4MiB\n      total-memory: 1024.0MiB\n         cpu-count: 4\n          cpu-load: 4%\n        board-name: RB4011iGS+5HacQ2HnD", risk: "low" },
            { cmd: "/system routerboard print", explain: "Модель, серійний номер і версії RouterBOOT — завантажувача, не самої RouterOS.", risk: "low" },
            { cmd: "/system package print", explain: "Встановлені пакети та їхні версії.", output: "Columns: NAME, VERSION, SIZE\n# NAME          VERSION   SIZE\n0 routeros      7.19.4   12.9MiB\n1 wifi-qcom-ac  7.19.4    3.3MiB", risk: "low" },
            { cmd: "/system clock print", explain: "Дата, час, часовий пояс. Неправильний час ламає журнали й перевірку сертифікатів.", risk: "low" },
            { cmd: "/system identity print", explain: "Ім'я роутера, яке видно в запрошенні <code>[Stas@RB4011]</code>.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: стан роутера",
          task: "Покажи навантаження CPU, пам'ять, uptime і версію RouterOS.",
          expected: ["/system resource print", "/system/resource/print", "/system/resource print", "system resource print"],
          output: "            uptime: 3d12h4m10s\n           version: 7.19.4 (stable)\n       free-memory: 892.4MiB\n      total-memory: 1024.0MiB\n         cpu-count: 4\n          cpu-load: 4%\n        board-name: RB4011iGS+5HacQ2HnD",
          hint: "Розділ `/system`, меню ресурсів, дія — показати.",
          explain: "CPU 4% і майже гігабайт вільної пам'яті — роутер не причина гальм. Шукаємо далі: канал, Wi‑Fi, DNS." },
        { type: "check", title: "Малий uptime",
          question: "`/system resource print` показує `uptime: 00:07:12`, хоча ніхто не перезавантажував роутер. Що це підказує?",
          options: ["Роутер перезавантажився сам 7 хвилин тому — варто подивитися журнал і живлення", "Годинник збився", "Так і має бути"],
          correct: 0, feedback: "Uptime рахується від останнього старту. Несподіваний малий uptime — привід перевірити `/log print` і блок живлення." },
        { type: "terminal", title: "Спробуй: пакети",
          task: "Покажи встановлені пакети RouterOS.",
          expected: ["/system package print", "/system/package/print", "/system/package print", "system package print"],
          output: "Columns: NAME, VERSION, SIZE\n# NAME          VERSION   SIZE\n0 routeros      7.19.4   12.9MiB\n1 wifi-qcom-ac  7.19.4    3.3MiB",
          hint: "Меню пакетів у розділі `/system`.",
          explain: "Основний пакет `routeros` і драйвер Wi‑Fi `wifi-qcom-ac`. Версії всіх пакетів мають збігатися." },
        { type: "check", title: "Що в routerboard",
          question: "Навіщо `/system routerboard print`, якщо версію RouterOS показує `resource`?",
          options: ["Він показує пароль", "Він показує модель, серійний номер і версію RouterBOOT (завантажувача), яку оновлюють окремо", "Він перезавантажує плату"],
          correct: 1, feedback: "RouterBOOT — окрема прошивка завантажувача. Після оновлення RouterOS її `upgrade-firmware` може бути новішою за `current-firmware`." },
        { type: "summary", title: "Підсумок",
          points: ["`/system resource print` — CPU, пам'ять, uptime, версія.", "`/system routerboard print` — модель, серійний номер, RouterBOOT.", "`/system package print` — `routeros` + опційні пакети (`wifi-qcom`, `container`…).", "`/system clock print` — правильний час важливий для журналів і сертифікатів.", "Усі ці `print` безпечні: спершу діагноз, потім зміни."] }
      ],
      glossary: [
        { term: "Uptime", def: "Час роботи з останнього запуску роутера." },
        { term: "RouterBOOT", def: "Завантажувач плати MikroTik; оновлюється окремо від RouterOS." },
        { term: "Пакет routeros", def: "Основний пакет RouterOS 7; решта функцій — опційні пакети." },
        { term: "Identity", def: "Ім'я роутера, видиме в запрошенні терміналу." }
      ],
      quiz: [
        { question: "Яка команда покаже навантаження процесора?", options: ["`/system identity print`", "`/system clock print`", "`/system resource print`"], correct: 2, feedback: "`cpu-load` у `resource` — перший показник, чи не «задихається» роутер." },
        { question: "Що типово побачиш у `/system package print` на RouterOS 7?", options: ["Основний пакет `routeros` і опційні, напр. `wifi-qcom-ac` чи `container`", "Лише список Wi‑Fi клієнтів", "Список правил firewall"], correct: 0, feedback: "У RouterOS 7 більшість функцій у пакеті `routeros`; окремо ставлять драйвери Wi‑Fi, контейнери тощо." },
        { question: "Журнал показує події з датою 1970 року. Що перевірити?", options: ["`/system routerboard print`", "`/system clock print` — час роутера", "`/ip route print`"], correct: 1, feedback: "Роутер без синхронізації часу може стартувати з нульової дати. Налаштуй NTP-клієнт." },
        { question: "Навіщо знати `board-name` і версію RouterOS, коли пишеш на форум чи в підтримку?", options: ["Від моделі й версії залежить, які меню й параметри доступні", "Щоб похвалитися", "Це не має значення"], correct: 0, feedback: "Меню Wi‑Fi, наприклад, різне для різних пакетів і версій." },
        { question: "Чи змінює щось команда `/system identity print`?", options: ["Так, перейменовує роутер", "Так, перезавантажує", "Ні, лише показує ім'я"], correct: 2, feedback: "Змінити ім'я можна було б через `/system identity set name=…` — це вже зміна конфігурації." },
        { question: "CPU 95% постійно. Яка команда допоможе з'ясувати, що саме його навантажує?", options: ["`/system package print`", "`/tool profile`", "`/system clock print`"], correct: 1, feedback: "`/tool profile` розкладає навантаження CPU за процесами: firewall, networking, management…" }
      ]
    },
    {
      id: "m03-l02", title: "Журнал і мережева діагностика", minutes: 13,
      steps: [
        { type: "concept", title: "Від журналу до пакетів",
          body: "<p>Журнал <code>/log</code> розповідає, що роутер помітив: входи, DHCP, VPN, падіння лінків. <code>/ping</code> і <code>/tool traceroute</code> перевіряють зв'язок з самого роутера, а <code>/tool torch</code> показує живий трафік на інтерфейсі.</p><p>Фільтр <code>where topics~\"…\"</code> залишає в журналі лише потрібну тему.</p>",
          analogy: "Журнал — бортовий журнал корабля: хто прибув, що зламалося. `ping` — гукнути «Ти там?», traceroute — пройти дорогу і записати кожне перехрестя, а torch — постояти на мосту й порахувати, хто куди їде." },
        { type: "cli", title: "Журнал",
          commands: [
            { cmd: "/log print", explain: "Весь журнал від найстаріших записів.", risk: "low" },
            { cmd: "/log print follow", explain: "Журнал наживо: нові записи з'являються самі. Вихід — <span class=\"kbd\">Q</span> або <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">C</span>.", risk: "low" },
            { cmd: "/log print where topics~\"firewall\"", explain: "Лише записи, в темах яких є <code>firewall</code>. <code>~</code> означає «містить (регулярний вираз)».", output: "2026-09-18 13:02:47 firewall,info drop-wan input: in:ether1 … 203.0.113.66:51522->198.51.100.23:22", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: лише firewall",
          task: "Покажи лише записи журналу, в темах яких є `firewall`.",
          expected: ["/log print where topics~\"firewall\"", "/log print where topics~firewall", "/log/print where topics~\"firewall\"", "log print where topics~\"firewall\""],
          output: "2026-09-18 13:02:47 firewall,info drop-wan input: in:ether1 out:(unknown 0), proto TCP (SYN), 203.0.113.66:51522->198.51.100.23:22, len 60",
          hint: "`/log print`, потім фільтр `where` за властивістю `topics` з оператором `~`.",
          explain: "Хтось з інтернету стукав на порт 22 (SSH) — і правило з префіксом `drop-wan` його відкинуло. Firewall працює." },
        { type: "cli", title: "Зв'язок з роутера",
          commands: [
            { cmd: "/ping 8.8.8.8 count=4", explain: "Рівно 4 ping-запити. Без <code>count=</code> пінг іде безкінечно — зупиняє <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">C</span>. Те саме є як <code>/tool ping</code>.", output: "  SEQ HOST       SIZE TTL TIME\n    0 8.8.8.8      56 117 12ms\n    …\n    sent=4 received=4 packet-loss=0%", risk: "low" },
            { cmd: "/tool traceroute 8.8.8.8", explain: "Кожен вузол на шляху до адреси: де з'являються втрати, там і проблема.", risk: "low" },
            { cmd: "/tool torch interface=ether1", explain: "Живий трафік на WAN-порту: з якими адресами і з якою швидкістю.", risk: "low" },
            { cmd: "/tool profile", explain: "Що навантажує процесор роутера.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: чотири пінги",
          task: "Надішли з роутера рівно 4 ping-запити до `8.8.8.8`.",
          expected: ["/ping 8.8.8.8 count=4", "/ping address=8.8.8.8 count=4", "/tool ping 8.8.8.8 count=4", "/tool ping address=8.8.8.8 count=4", "ping 8.8.8.8 count=4"],
          output: "  SEQ HOST                                     SIZE TTL TIME       STATUS\n    0 8.8.8.8                                    56 117 12ms134us\n    1 8.8.8.8                                    56 117 11ms812us\n    2 8.8.8.8                                    56 117 12ms40us\n    3 8.8.8.8                                    56 117 12ms301us\n    sent=4 received=4 packet-loss=0% min-rtt=11ms812us avg-rtt=12ms71us max-rtt=12ms301us",
          hint: "Службова команда пінгу, адреса, параметр кількості запитів.",
          explain: "0% втрат і ~12 мс — інтернет з роутера в порядку. Отже, гальма десь між роутером і пристроями: Wi‑Fi чи DNS." },
        { type: "check", title: "Де обрив",
          question: "`/tool traceroute 8.8.8.8`: перший вузол `198.51.100.1` відповідає, а з другого — 100% втрат. Де ймовірна проблема?",
          options: ["У Wi‑Fi вдома", "У провайдера, за його шлюзом", "У DNS"],
          correct: 1, feedback: "Перший вузол — шлюз провайдера, до нього все добре. Далі пакети губляться вже в мережі провайдера." },
        { type: "check", title: "Живий журнал",
          question: "Ти підключаєш новий телефон і хочеш одразу бачити, чи видав йому DHCP адресу. Що запустити?",
          options: ["`/system resource print`", "`/log print` раз на хвилину", "`/log print follow` — нові записи з'являтимуться самі"],
          correct: 2, feedback: "`follow` показує події наживо. Вихід — Q або Ctrl+C." },
        { type: "summary", title: "Підсумок",
          points: ["`/log print where topics~\"firewall\"` — лише потрібна тема журналу.", "`/log print follow` — журнал наживо, вихід Q або Ctrl+C.", "`/ping 8.8.8.8 count=4` — рівно 4 запити; без `count=` зупиняй Ctrl+C.", "`/tool traceroute` — на якому вузлі губляться пакети.", "`/tool torch interface=ether1` — хто зараз генерує трафік."] }
      ],
      glossary: [
        { term: "topics", def: "Теми запису журналу (`firewall,info`, `dhcp,info`), за якими фільтрують." },
        { term: "follow", def: "Параметр `print`, що показує нові записи наживо." },
        { term: "Traceroute", def: "Перелік вузлів на шляху пакетів до адреси." },
        { term: "Torch", def: "Інструмент `/tool torch` — живий перегляд трафіку на інтерфейсі." }
      ],
      quiz: [
        { question: "Що робить `~` у `/log print where topics~\"ipsec\"`?", options: ["Перевіряє, що тема містить `ipsec` (збіг з регулярним виразом)", "Видаляє записи ipsec", "Вимикає журнал ipsec"], correct: 0, feedback: "`=` — точна рівність, `~` — «містить» за регулярним виразом." },
        { question: "Ти запустив `/ping 8.8.8.8` без `count=`, і він не зупиняється. Що робити?", options: ["Перезавантажити роутер", "Натиснути Ctrl+C", "Закрити ноутбук"], correct: 1, feedback: "Ctrl+C перериває поточну команду і повертає запрошення." },
        { question: "Пінг з роутера до `8.8.8.8` — 0% втрат, а в ноутбука сайти не відкриваються за іменем. Куди дивитися далі?", options: ["`/system routerboard print`", "`/tool profile`", "DNS: `/ip dns print`, пінг за іменем"], correct: 2, feedback: "IP-зв'язок є, отже, імовірно, не працює перетворення імен на адреси." },
        { question: "Яка команда покаже, хто зараз «з'їдає» канал на WAN?", options: ["`/tool torch interface=ether1`", "`/log print`", "`/system clock print`"], correct: 0, feedback: "Torch показує живий трафік за адресами й протоколами." },
        { question: "У traceroute втрати з'являються вже на першому вузлі — шлюзі провайдера. Що перевірити першим?", options: ["Сертифікати", "WAN-підключення роутера: кабель, `/interface print` для ether1, DHCP-клієнт", "Користувачів роутера"], correct: 1, feedback: "Якщо не відповідає найближчий вузол провайдера, проблема на лінії до нього." },
        { question: "Чи змінює щось `/tool traceroute 8.8.8.8`?", options: ["Так, додає маршрут", "Так, вимикає firewall", "Ні, це лише діагностика"], correct: 2, feedback: "Діагностичні інструменти `/tool` лише вимірюють — ризик низький." }
      ]
    }
  ]
});
