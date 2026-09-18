window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m02", order: 2, title: "Безпечні зміни", subtitle: "Export, backup, Safe Mode, undo і небезпечні команди", icon: "shield",
  goal: "Після модуля ти перед кожною зміною робиш експорт і бекап, вмикаєш Safe Mode командою /safe-mode або клавішами Ctrl+X, умієш відкотити зміну через /undo і впізнаєш команди, які не можна запускати без плану.",
  lessons: [
    {
      id: "m02-l01", title: "Export, backup і Safe Mode", minutes: 13,
      steps: [
        { type: "story", title: "Один невдалий Enter",
          body: "<p>Stas налаштовував firewall з ноутбука через SSH, додав правило «drop усе на input» — і термінал завис. Правило заблокувало і його власне підключення. Роутер на горищі, до нього треба лізти з ноутбуком і кабелем.</p><p>Цей урок — про три звички, після яких така історія закінчується за хвилину.</p>" },
        { type: "concept", title: "Дві копії і страховка",
          body: "<p><strong>Export</strong> — текстовий файл <code>.rsc</code> з командами, що відтворюють конфігурацію: його можна читати й порівнювати. <strong>Backup</strong> — бінарний знімок для відновлення на цьому ж роутері.</p><p><strong>Safe Mode</strong> вмикається клавішами <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">X</span> (або <span class=\"kbd\">F4</span>) і відкочує зміни, якщо сесія обірвалася.</p>",
          analogy: "Export — фотокопія рецепта: видно кожен інгредієнт, можна переписати частину. Backup — заморожена готова страва: швидко розігріти, але тільки в тій самій кухні. Safe Mode — страховий трос альпініста: поки ти тримаєш зв'язок, трос не заважає, а зірвався — він повертає тебе на останню безпечну точку." },
        { type: "cli", title: "Зберегти конфігурацію",
          commands: [
            { cmd: "/export file=before-change", explain: "Текстовий експорт у файл <code>before-change.rsc</code> на роутері. Паролі користувачів, сертифікати й SSH-ключі в експорт не потрапляють; інші секрети приховані, якщо не додати <code>show-sensitive</code>.", risk: "medium" },
            { cmd: "/system backup save name=before-change", explain: "Бінарний бекап <code>before-change.backup</code>. Без <code>password=</code> файл не шифрується — зберігай його як секрет.", output: "Configuration backup saved", risk: "medium" },
            { cmd: "/file print", explain: "Перевірити, що обидва файли з'явилися. Потім забери їх на комп'ютер (WinBox → Files або <code>scp</code>).", output: "Columns: NAME, TYPE, SIZE\n# NAME                   TYPE         SIZE\n0 before-change.rsc      .rsc file   5.1KiB\n1 before-change.backup   backup     48.3KiB", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: текстовий експорт",
          task: "Збережи текстовий експорт конфігурації у файл з іменем `before-change`.",
          expected: ["/export file=before-change", "/export file=before-change.rsc", "export file=before-change"],
          output: "",
          hint: "Службова команда кореня для експорту + параметр `file=` з іменем.",
          explain: "RouterOS мовчить при успіху. Перевір `/file print`: там з'явився `before-change.rsc`. Без `file=` експорт просто надрукується на екран." },
        { type: "check", title: "Export чи backup",
          question: "Ти хочеш перенести правила firewall зі старого роутера на новий іншої моделі. Що підійде краще?",
          options: ["Бінарний backup", "Текстовий export: його можна прочитати й застосувати частинами", "Скріншот WinBox"],
          correct: 1, feedback: "Backup розрахований на той самий пристрій (у ньому навіть MAC-адреси). Export — текст: береш потрібний шматок." },
        { type: "cli", title: "Safe Mode у терміналі",
          intro: "<p>Safe Mode — режим сесії. На нашому роутері його вмикають двома способами: командою <code>/safe-mode</code> з кореневого меню або клавішами <span class=\"kbd\">Ctrl</span>+<span class=\"kbd\">X</span> (<span class=\"kbd\">F4</span>). Результат однаковий.</p>",
          commands: [
            { cmd: "/safe-mode", explain: "Увімкнути Safe Mode командою з кореневого меню (у <code>/</code> нашого роутера є пункт <code>safe-mode</code>). Вийти й зберегти зміни — <span class=\"kbd\">Ctrl</span>+<span class=\"kbd\">X</span> (у тренажері повторний <code>/safe-mode</code> теж перемикає режим). У старіших версіях RouterOS пункту може не бути — тоді лише клавіші.", output: "[Safe Mode taken]", risk: "low" },
            { cmd: "Ctrl+X", explain: "Увімкнути Safe Mode (або <span class=\"kbd\">F4</span>). Роутер відповідає <code>[Safe Mode taken]</code>, запрошення стає <code>[Stas@RB4011] &lt;SAFE&gt;</code>.", output: "[Safe Mode taken]\n[Stas@RB4011] <SAFE>", risk: "low" },
            { cmd: "Ctrl+X (ще раз)", explain: "Вийти з Safe Mode і <strong>зберегти</strong> зроблені зміни. Якщо ж зв'язок обірвався — через тайм-аут (до ~9 хв) зміни відкотяться самі.", risk: "medium" },
            { cmd: "Ctrl+D", explain: "Вийти з сесії, <strong>скасувавши</strong> всі зміни Safe Mode. А от <code>/quit</code> зміни не скасовує.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: увімкни Safe Mode",
          task: "Перед зміною firewall увімкни Safe Mode **командою**, а не клавішами.",
          expected: ["/safe-mode", "/safe-mode/"], output: "[Safe Mode taken]",
          hint: "Пункт кореневого меню, назва — як у режиму, через дефіс.",
          explain: "Запрошення стане `[Stas@RB4011] <SAFE>`. Тепер кожна зміна відкотиться, якщо сесія обірветься." },
        { type: "check", title: "Коли вмикати",
          question: "Ти зараз змінюватимеш правила firewall на роутері, до якого підключений по SSH. Коли вмикати Safe Mode?",
          options: ["Після змін, щоб зберегти їх", "Лише якщо щось уже зламалося", "Перед першою зміною — тоді відкотиться все, що зроблено в режимі, якщо зв'язок обірветься"],
          correct: 2, feedback: "Safe Mode захищає лише зміни, зроблені після `[Safe Mode taken]`. Зміни до нього вже не відкотяться." },
        { type: "callout", variant: "warning", title: "Межі Safe Mode",
          body: "<p>Історія Safe Mode тримає до 100 останніх дій: якщо змін забагато, режим вимкнеться сам і нічого не відкотить. Працюй малими кроками.</p><p>Safe Mode не замінює бекап: він не допоможе, якщо ти сам вийшов і зберіг невдалу зміну.</p>" },
        { type: "summary", title: "Підсумок",
          points: ["`/export file=before-change` — читабельна копія `.rsc`, без паролів користувачів і ключів.", "`/system backup save name=before-change` — бінарна копія для цього ж роутера; без `password=` не шифрується.", "Забирай обидва файли з роутера на комп'ютер.", "Safe Mode — Ctrl+X (або F4) перед змінами; повторний Ctrl+X зберігає, обрив відкочує.", "Ctrl+D скасовує зміни Safe Mode, `/quit` — ні."] }
      ],
      glossary: [
        { term: "Export (.rsc)", def: "Текстовий файл команд, що відтворюють конфігурацію; `/export file=…`." },
        { term: "Backup (.backup)", def: "Бінарний знімок конфігурації для відновлення на тому самому пристрої." },
        { term: "Safe Mode", def: "Режим сесії (Ctrl+X або F4), у якому зміни відкочуються при обриві зв'язку." },
        { term: "Self-lockout", def: "Ситуація, коли власна зміна відрізала тобі доступ до роутера." }
      ],
      quiz: [
        { question: "Як увімкнути Safe Mode в терміналі RouterOS?", options: ["Клавішами Ctrl+X (або F4)", "Командою меню в `/system`", "Кнопкою Reset на роутері"], correct: 0, feedback: "Safe Mode — режим сесії, а не пункт меню. У WinBox для цього є кнопка Safe Mode." },
        { question: "Що відбудеться зі змінами Safe Mode, якщо Wi‑Fi ноутбука зник посеред роботи?", options: ["Залишаться на роутері", "Роутер перезавантажиться", "Після тайм-ауту сесії роутер їх відкотить"], correct: 2, feedback: "Саме для цього режим і існує: обрив — сигнал, що щось пішло не так." },
        { question: "Чим `/export` відрізняється від `/system backup save`?", options: ["Нічим", "Export — текст, який можна читати й застосувати частинами; backup — бінарний знімок для того самого роутера", "Backup — текстовий, export — бінарний"], correct: 1, feedback: "Добра звичка — робити обидва перед серйозними змінами." },
        { question: "Чи можна пересилати файл `.backup`, збережений без пароля, у загальний чат?", options: ["Ні: у ньому повна конфігурація, файл не зашифрований — зберігай як секрет", "Так, він зашифрований автоматично", "Так, у ньому лише назви інтерфейсів"], correct: 0, feedback: "Починаючи з RouterOS 6.43, без `password=` бекап не шифрується." },
        { question: "Ти зробив кілька змін у Safe Mode і все працює. Як вийти, зберігши їх?", options: ["Ctrl+D", "Вимкнути живлення", "Ще раз натиснути Ctrl+X"], correct: 2, feedback: "Ctrl+D навпаки скасує зміни Safe Mode при виході." },
        { question: "Навіщо забирати `before-change.rsc` з роутера на комп'ютер?", options: ["Щоб звільнити 5 КБ пам'яті", "Якщо роутер скинуть чи він зламається, копія на ньому зникне разом з конфігурацією", "Так вимагає RouterOS"], correct: 1, feedback: "Бекап, що лежить лише на самому роутері, не рятує від втрати роутера." }
      ]
    },
    {
      id: "m02-l02", title: "Undo, історія і небезпечні команди", minutes: 12,
      steps: [
        { type: "concept", title: "Роутер пам'ятає свої зміни",
          body: "<p>Кожна дія з терміналу чи WinBox записується в <code>/system history</code>. Команда <code>/undo</code> скасовує останню зміну, <code>/redo</code> — повертає скасовану.</p><p>Це працює, поки ти на зв'язку. Після обриву рятують лише Safe Mode і бекап.</p>",
          analogy: "`/system history` — журнал змін, як історія правок у Google Docs. `/undo` — Ctrl+Z для роутера. Але Ctrl+Z не допоможе, якщо ноутбук уже вимкнули: для цього потрібна збережена копія документа — бекап." },
        { type: "cli", title: "Історія, undo, redo",
          commands: [
            { cmd: "/system history print", explain: "Список змін: що, хто, з якими правами. Прапорець <code>U</code> — можна скасувати, <code>R</code> — можна повторити, <code>F</code> — зміна Safe Mode, яка відкотиться при обриві.", output: "Flags: U - UNDOABLE, R - REDOABLE, F - FLOATING-UNDO\nColumns: ACTION, BY, POLICY\n#   ACTION                     BY    POLICY\n0 U interface ether5 disabled  Stas  write\n1 U dns changed                Stas  write", risk: "low" },
            { cmd: "/undo", explain: "Скасувати останню зміну конфігурації.", risk: "medium" },
            { cmd: "/redo", explain: "Повторити зміну, скасовану через <code>/undo</code>.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: скасуй зміну",
          task: "Ти щойно вимкнув не той порт. Скасуй останню зміну конфігурації.",
          expected: ["/undo", "undo"],
          output: "",
          hint: "Службова команда кореня, як Ctrl+Z.",
          explain: "RouterOS мовчить; перевір `/system history print` — запис став `R` (можна повторити), а порт знову ввімкнено." },
        { type: "check", title: "Що скасує undo",
          question: "Ти змінив DNS, потім вимкнув ether5. Що зробить один `/undo`?",
          options: ["Скасує обидві зміни", "Увімкне ether5 назад — скасує останню зміну", "Поверне старий DNS"],
          correct: 1, feedback: "`/undo` іде від останньої зміни назад. Другий `/undo` повернув би DNS." },
        { type: "cli", title: "Команди, які не запускають «про всяк випадок»",
          commands: [
            { cmd: "/import file-name=config.rsc", explain: "Виконує всі команди з файлу підряд. Помилка у файлі — зламана мережа чи VPN.", risk: "high" },
            { cmd: "/system reset-configuration", explain: "Скидає всю конфігурацію і перезавантажує роутер. Віддалено — гарантована втрата доступу.", risk: "high" },
            { cmd: "/system reboot", explain: "Перезавантаження обриває всі з'єднання, VPN і Wi‑Fi на хвилину-дві.", risk: "high" }
          ] },
        { type: "callout", variant: "danger", title: "Незворотне",
          body: "<p><code>/system reset-configuration</code> стирає всі налаштування — undo після нього немає, а віддалений доступ зникне. <code>/import</code> застосує файл повністю, навіть якщо рядок на середині відріже тебе від роутера.</p><p>Безпечніше: <code>/export file=…</code> і <code>/system backup save name=…</code>, файли — на комп'ютер; скидання — лише з фізичним доступом; імпорт — з Safe Mode і після перегляду файлу.</p>" },
        { type: "terminal", title: "Спробуй: подивись історію",
          task: "Покажи історію змін конфігурації роутера.",
          expected: ["/system history print", "/system/history/print", "/system/history print", "system history print"],
          output: "Flags: U - UNDOABLE, R - REDOABLE, F - FLOATING-UNDO\nColumns: ACTION, BY, POLICY\n#   ACTION                     BY    POLICY\n0 R interface ether5 disabled  Stas  write\n1 U dns changed                Stas  write",
          hint: "Меню історії лежить у розділі `/system`.",
          explain: "Запис з `R` — зміна, яку ти скасував: її можна повернути `/redo`." },
        { type: "check", title: "План для чужого файлу",
          question: "Друг надіслав `firewall.rsc` «для швидкого налаштування». Як правильно його застосувати на своєму роутері?",
          options: ["Одразу `/import file-name=firewall.rsc`", "`/system reset-configuration`, потім імпорт", "Прочитати файл, зробити export і backup, увімкнути Safe Mode, застосовувати частинами з перевіркою"],
          correct: 2, feedback: "Чужий скрипт виконується з твоїми правами. Спершу зрозумій, що в ньому, і май план відкату." },
        { type: "summary", title: "Підсумок",
          points: ["`/system history print` — журнал змін; `U` можна скасувати, `R` — повторити.", "`/undo` скасовує останню зміну, `/redo` повертає її.", "Undo не допоможе після обриву — тоді рятують Safe Mode і бекап.", "`/import`, `/system reset-configuration`, `/system reboot` — високий ризик, лише за планом.", "Чужий `.rsc` спершу читають, потім застосовують частинами в Safe Mode."] }
      ],
      glossary: [
        { term: "/system history", def: "Журнал змін конфігурації з прапорцями U (undoable), R (redoable), F (floating-undo)." },
        { term: "/undo", def: "Скасування останньої зміни конфігурації." },
        { term: "/import", def: "Виконання команд з файлу `.rsc`; високий ризик." },
        { term: "reset-configuration", def: "Скидання всієї конфігурації роутера з перезавантаженням." }
      ],
      quiz: [
        { question: "Що покаже `/system history print`?", options: ["Список змін конфігурації, які можна скасувати або повторити", "Історію введених команд `print`", "Журнал firewall"], correct: 0, feedback: "Там лише дії, що змінили конфігурацію; `print` туди не потрапляє." },
        { question: "Що зробить `/redo` одразу після `/undo`?", options: ["Скасує ще одну зміну", "Поверне зміну, яку щойно скасували", "Перезавантажить роутер"], correct: 1, feedback: "`/redo` — протилежність `/undo`, як Ctrl+Y у редакторі." },
        { question: "Ти віддалено застосував правило, і сесія обірвалася. Чи допоможе `/undo`?", options: ["Так, роутер виконає його сам", "Так, якщо ввести його після перепідключення через 10 хвилин — завжди", "Ні: ти вже не можеш його ввести; рятує лише Safe Mode (якщо був увімкнений) або доступ іншим шляхом"], correct: 2, feedback: "Звідси правило: Ctrl+X перед ризиковою зміною, а не після." },
        { question: "Який ризик у `/system reset-configuration` при віддаленій роботі?", options: ["Ніякого, це лише перегляд", "Роутер забуде всі налаштування, включно з адресою, через яку ти підключений", "Скинуться лише лічильники трафіку"], correct: 1, feedback: "Після скидання роутер стає «новим»: віддаленого доступу більше немає." },
        { question: "Що з цього — найбезпечніша підготовка до `/import` великого файлу?", options: ["Прочитати файл, зробити export і backup, увімкнути Safe Mode", "Вимкнути Safe Mode, щоб імпорт пройшов швидше", "Перезавантажити роутер перед імпортом"], correct: 0, feedback: "Імпорт виконує все підряд. Підготовка дає план відкату." },
        { question: "Колега пропонує «для чистоти» зробити `/system reset-configuration` через SSH з дому, а роутер в офісі. Твоя відповідь?", options: ["Добре, це швидко", "Добре, але потім `/undo`", "Ні: спершу експорт і бекап на комп'ютер, а скидання — лише з фізичним доступом до роутера"], correct: 2, feedback: "Після скидання віддалений доступ зникне, і `/undo` вже нікуди вводити." }
      ]
    }
  ]
});
