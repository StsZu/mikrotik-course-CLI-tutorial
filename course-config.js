window.CLI_COURSE_CONFIG = {
  id: "mikrotik",
  title: "MikroTik RouterOS CLI",
  subtitle: "Командний рядок RouterOS 7 без страху: шляхи меню, безпечні зміни з Safe Mode і бекапом, діагностика, інтерфейси, IP, firewall, VPN і сертифікати.",
  overline: "Курс для новачків · RouterOS 7 · термінал MikroTik",
  brandSub: "курс CLI MikroTik",
  storageKey: "cli-mikrotik-v1",
  caseInsensitive: true,
  prompt: "[Stas@RB4011] >",
  termTitle: "RouterOS 7 — навчальний термінал",
  sandbox: "trainer.html",
  quizBank: "quiz.html",
  skills: [
    ["terminal", "Читати шлях меню RouterOS і знаходити команди через Tab і F1 замість зубріння."],
    ["backup", "Робити `/export` і `/system backup save` перед змінами та вмикати Safe Mode клавішами Ctrl+X."],
    ["monitor_heart", "Діагностувати роутер: ресурси, пакети, журнал, `/ping`, traceroute, torch."],
    ["lan", "Розбиратися в інтерфейсах: bridge, VLAN, списки WAN/LAN, Wi‑Fi, WireGuard."],
    ["security", "Читати правила firewall і NAT, перевіряти користувачів і сервіси керування."],
    ["vpn_key", "Діагностувати IPsec і перевіряти сертифікати, не ламаючи VPN."]
  ],
  audience: "<p>Для тих, у кого вдома чи в офісі MikroTik і хто хоче керувати ним з терміналу (SSH або New Terminal у WinBox), а не лише кнопками. Досвід мереж бажаний на рівні «знаю, що таке IP-адреса і роутер».</p><p>Головна мета — не вивчити всі команди, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.</p>",
  safety: "<p>Кроки «Спробуй сам» і пісочниця — імітація: вони нічого не змінюють на справжньому роутері. На живому MikroTik правило одне: спершу <code>print</code>, потім <code>/export</code> і <code>/system backup save</code>, потім Safe Mode (<span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">X</span>), і лише тоді одна зміна з перевіркою. Команди з ризиком «високий» віддалено виконуй лише з планом відкату.</p>",
  sources: [
    { href: "https://help.mikrotik.com/docs/spaces/ROS/pages/328134/Command+Line+Interface", label: "MikroTik — Command Line Interface" },
    { href: "https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management", label: "MikroTik — Configuration Management (Safe Mode, undo, export)" },
    { href: "https://help.mikrotik.com/docs/spaces/ROS/pages/40992852/Backup", label: "MikroTik — Backup" },
    { href: "https://help.mikrotik.com/docs/spaces/ROS/pages/8323183/Ping", label: "MikroTik — Ping" },
    { href: "https://help.mikrotik.com/docs/spaces/ROS/pages/11993097/IPsec", label: "MikroTik — IPsec" },
    { href: "https://help.mikrotik.com/docs/spaces/ROS/pages/2555969/Certificates", label: "MikroTik — Certificates" }
  ]
};
