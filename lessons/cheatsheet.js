window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.cheatsheet = {
  sections: [
    { title: "Навігація і довідка", rows: [
      { cmd: "/ip address print = /ip/address/print", desc: "Слова шляху — через пробіл або `/`", risk: "low" },
      { cmd: "Tab / Tab Tab", desc: "Доповнити слово / показати всі варіанти рівня", risk: "low" },
      { cmd: "F1", desc: "Контекстна довідка в RouterOS 7 (у v6 — `?`)", risk: "low" },
      { cmd: "/ip address", desc: "Перейти в меню (запрошення `/ip/address>`); `/` — корінь, `..` — вище", risk: "low" },
      { cmd: "Ctrl+C", desc: "Перервати поточну команду (ping, follow, torch)", risk: "low" },
      { cmd: "/quit", desc: "Вийти з сесії (зміни Safe Mode зберігаються)", risk: "low" }
    ] },
    { title: "Дії в меню", rows: [
      { cmd: "print", desc: "Показати список", risk: "low" },
      { cmd: "print detail", desc: "Усі властивості `ключ=значення`", risk: "low" },
      { cmd: "print where disabled=yes", desc: "Фільтр: `=` точно, `~` містить, `!=` не дорівнює", risk: "low" },
      { cmd: "add … / set … / enable / disable", desc: "Додати, змінити, увімкнути, вимкнути — діє одразу", risk: "medium" },
      { cmd: "[find comment=\"LAB\"]", desc: "Звернутися до об'єкта за умовою, а не за номером", risk: "low" },
      { cmd: "remove …", desc: "Видалити об'єкт без запитання", risk: "high" },
      { cmd: "move …", desc: "Змінити порядок (у firewall — змінює, що пропускається)", risk: "high" }
    ] },
    { title: "Безпечні зміни", rows: [
      { cmd: "/safe-mode", desc: "Увімкнути / вимкнути Safe Mode командою (кореневе меню RouterOS 7 на нашому роутері)", risk: "low" },
      { cmd: "Ctrl+X (або F4)", desc: "Увімкнути / вимкнути Safe Mode; запрошення `<SAFE>`", risk: "low" },
      { cmd: "Ctrl+D у Safe Mode", desc: "Вийти, скасувавши зміни Safe Mode", risk: "medium" },
      { cmd: "/export file=before-change", desc: "Текстовий експорт `.rsc` (без паролів користувачів і ключів)", risk: "medium" },
      { cmd: "/export", desc: "Показати конфігурацію на екрані", risk: "low" },
      { cmd: "/system backup save name=before-change", desc: "Бінарний бекап для цього ж роутера; без `password=` не шифрується", risk: "medium" },
      { cmd: "/file print", desc: "Файли на роутері: бекапи, експорти", risk: "low" },
      { cmd: "/system history print", desc: "Журнал змін (U — можна скасувати, R — повторити)", risk: "low" },
      { cmd: "/undo", desc: "Скасувати останню зміну", risk: "medium" },
      { cmd: "/redo", desc: "Повторити скасовану зміну", risk: "medium" },
      { cmd: "/import file-name=config.rsc", desc: "Виконати команди з файлу — лише після перегляду й у Safe Mode", risk: "high" },
      { cmd: "/system reboot", desc: "Перезавантаження: обриває всі з'єднання", risk: "high" },
      { cmd: "/system reset-configuration", desc: "Скинути ВСЮ конфігурацію — лише з бекапом і фізичним доступом", risk: "high" }
    ] },
    { title: "Система і діагностика", rows: [
      { cmd: "/system resource print", desc: "CPU, пам'ять, uptime, версія", risk: "low" },
      { cmd: "/system routerboard print", desc: "Модель, серійний номер, RouterBOOT", risk: "low" },
      { cmd: "/system package print", desc: "Пакети: `routeros` + опційні (`wifi-qcom`, `container`…)", risk: "low" },
      { cmd: "/system clock print", desc: "Дата, час, часовий пояс", risk: "low" },
      { cmd: "/system identity print", desc: "Ім'я роутера", risk: "low" },
      { cmd: "/log print", desc: "Журнал", risk: "low" },
      { cmd: "/log print follow", desc: "Журнал наживо (Q або Ctrl+C — вихід)", risk: "low" },
      { cmd: "/log print where topics~\"firewall\"", desc: "Журнал за темою (firewall, ipsec, dhcp, account…)", risk: "low" },
      { cmd: "/ping 8.8.8.8 count=4", desc: "Рівно 4 пінги з роутера (є й `/tool ping`)", risk: "low" },
      { cmd: "/tool traceroute 8.8.8.8", desc: "Вузли на шляху до адреси", risk: "low" },
      { cmd: "/tool torch interface=ether1", desc: "Живий трафік на інтерфейсі", risk: "low" },
      { cmd: "/tool profile", desc: "Що навантажує CPU", risk: "low" }
    ] },
    { title: "Інтерфейси", rows: [
      { cmd: "/interface print", desc: "Усі інтерфейси; X — вимкнений, R — працює", risk: "low" },
      { cmd: "/interface ethernet print", desc: "Фізичні порти", risk: "low" },
      { cmd: "/interface bridge port print", desc: "Хто в bridge; I — неактивний порт", risk: "low" },
      { cmd: "/interface vlan print", desc: "VLAN: ID і батьківський інтерфейс", risk: "low" },
      { cmd: "/interface list member print", desc: "Склад списків WAN і LAN", risk: "low" },
      { cmd: "/interface wifi registration-table print", desc: "Wi‑Fi клієнти зараз (RouterOS 7, пакет wifi)", risk: "low" },
      { cmd: "/interface wireguard peers print", desc: "Піри WireGuard (публічні ключі, дозволені адреси)", risk: "low" },
      { cmd: "/interface monitor-traffic ether1", desc: "Швидкість трафіку наживо", risk: "low" },
      { cmd: "/interface enable ether5", desc: "Увімкнути порт", risk: "medium" },
      { cmd: "/interface disable ether5", desc: "Вимкнути порт; на WAN, bridge чи своєму порту — втрата зв'язку", risk: "high" },
      { cmd: "/interface bridge port remove [find interface=ether2]", desc: "Прибрати порт з bridge", risk: "high" }
    ] },
    { title: "IP, DNS, DHCP", rows: [
      { cmd: "/ip address print", desc: "Адреси на інтерфейсах; D — динамічна", risk: "low" },
      { cmd: "/ip route print", desc: "Маршрути; `0.0.0.0/0` — в інтернет", risk: "low" },
      { cmd: "/ip dns print", desc: "DNS-сервери роутера", risk: "low" },
      { cmd: "/ip arp print", desc: "IP ↔ MAC у локальній мережі", risk: "low" },
      { cmd: "/ip neighbor print", desc: "Сусідні пристрої за MNDP/CDP/LLDP", risk: "low" },
      { cmd: "/ip dhcp-client print", desc: "Адреса WAN від провайдера", risk: "low" },
      { cmd: "/ip dhcp-server lease print", desc: "Хто в LAN отримав адресу", risk: "low" },
      { cmd: "/ip address add address=10.0.1.1/24 interface=ether5", desc: "Додати адресу на інтерфейс", risk: "medium" },
      { cmd: "/ip dns set servers=1.1.1.1,8.8.8.8", desc: "Змінити DNS-сервери", risk: "medium" },
      { cmd: "/ip route remove …", desc: "Видалити маршрут — може обірвати доступ", risk: "high" }
    ] },
    { title: "Firewall і доступ", rows: [
      { cmd: "/ip firewall filter print", desc: "Правила згори вниз; перше, що збіглося, вирішує", risk: "low" },
      { cmd: "/ip firewall filter print detail", desc: "Правила з усіма властивостями", risk: "low" },
      { cmd: "/ip firewall nat print", desc: "NAT: masquerade для WAN", risk: "low" },
      { cmd: "/ip firewall address-list print", desc: "Списки адрес для правил", risk: "low" },
      { cmd: "/ip firewall connection print", desc: "Активні з'єднання", risk: "low" },
      { cmd: "/ip firewall filter disable [find comment=\"test\"]", desc: "Тимчасово вимкнути правило", risk: "medium" },
      { cmd: "/ip firewall filter remove …", desc: "Видалити правило — може відкрити мережу", risk: "high" },
      { cmd: "/user print", desc: "Облікові записи і групи", risk: "low" },
      { cmd: "/user active print", desc: "Хто зараз підключений і через що", risk: "low" },
      { cmd: "/ip service print", desc: "Сервіси керування (ssh, winbox, www, api) і дозволені адреси", risk: "low" },
      { cmd: "/ip ssh print", desc: "Налаштування SSH-сервера", risk: "low" },
      { cmd: "/ip service set winbox address=10.0.0.0/24", desc: "Обмежити сервіс мережею LAN", risk: "high" },
      { cmd: "/user disable admin", desc: "Вимкнути стандартний запис — після перевірки свого", risk: "high" }
    ] },
    { title: "VPN і сертифікати", rows: [
      { cmd: "/ip ipsec peer print", desc: "Налаштовані піри (`/ip/ipsec/…` — те саме)", risk: "low" },
      { cmd: "/ip ipsec active-peers print", desc: "IKE встановлено?", risk: "low" },
      { cmd: "/ip ipsec installed-sa print", desc: "SA — трафік справді шифрується?", risk: "low" },
      { cmd: "/ip ipsec policy print", desc: "Які мережі шифрувати", risk: "low" },
      { cmd: "/ip ipsec identity print", desc: "Сертифікат чи спільний ключ", risk: "low" },
      { cmd: "/log print where topics~\"ipsec\"", desc: "Помилки IPsec", risk: "low" },
      { cmd: "/ip ipsec policy remove …", desc: "Видалити політику — тунель перестане працювати", risk: "high" },
      { cmd: "/certificate print", desc: "Сертифікати; K — є приватний ключ, T — довірений", risk: "low" },
      { cmd: "/certificate print detail", desc: "Строк дії (`invalid-after`), відбиток", risk: "low" },
      { cmd: "/certificate print where name~\"vpn\"", desc: "Фільтр за іменем", risk: "low" },
      { cmd: "/certificate export", desc: "Налаштування меню (без самих сертифікатів і ключів)", risk: "low" },
      { cmd: "/certificate export-certificate … export-passphrase=…", desc: "Вивантажити сертифікат з приватним ключем — секрет", risk: "high" },
      { cmd: "/certificate remove …", desc: "Видалити сертифікат — ламає VPN/HTTPS на ньому", risk: "high" }
    ] }
  ]
};
