# MikroTik RouterOS CLI `/` commands — довідник українською

Дата: 2026-06-30  
Пристрій/сесія: `Stas@StanislavZubar98`  
Основа: реальний CLI-вивід з вашого MikroTik + офіційна логіка RouterOS CLI.

Джерела для перевірки:
- MikroTik RouterOS Documentation: https://help.mikrotik.com/docs/spaces/ROS/pages/328059/RouterOS
- RouterOS Command Line Interface: https://help.mikrotik.com/docs/spaces/ROS/pages/328134/Command+Line+Interface
- RouterOS Console: https://help.mikrotik.com/docs/spaces/ROS/pages/8978498/Console
- RouterOS Certificates: https://help.mikrotik.com/docs/spaces/ROS/pages/2555969/Certificates
- RouterOS IPsec: https://help.mikrotik.com/docs/spaces/ROS/pages/11993097/IPsec
- RouterOS Bridging and Switching: https://help.mikrotik.com/docs/spaces/ROS/pages/328068/Bridging+and+Switching

---

## 1. Що таке `/` команди в MikroTik

У MikroTik RouterOS символ `/` означає **повний шлях до меню CLI**.

Наприклад:

```routeros
/ip firewall filter print
/interface wifi registration-table print
/system resource print
```

Це не такі slash-команди, як у Claude Code.  
У Claude `/plan` — це окрема команда агента.  
У MikroTik `/ip firewall filter` — це шлях до розділу конфігурації, а `print`, `add`, `set`, `remove` — дії всередині цього розділу.

---

## 2. Як шукати команди прямо на MikroTik

### Показати команди верхнього рівня

```routeros
/
```

Потім натиснути:

```text
Tab
```

або:

```text
F1
```

### Показати команди всередині розділу

```routeros
/interface/
```

Потім `Tab`.

```routeros
/ip/ipsec/
```

Потім `Tab`.

```routeros
/certificate/
```

Потім `Tab`.

---

## 3. Правило безпеки

Перед ризиковими змінами бажано ввімкнути Safe Mode:

```routeros
/safe-mode
```

І зробити backup/export:

```routeros
/system backup save name=before-change
/export file=before-change
```

Особливо перед командами:

```routeros
remove
reset
set
disable
enable
import
```

Команди типу `print`, `monitor`, `find`, `export` зазвичай безпечні для читання.  
Команди типу `add`, `set`, `remove`, `reset`, `import` змінюють конфігурацію.

---

# 4. Root `/` commands з вашого MikroTik

Ваш вивід:

```routeros
certificate     file          ipv6     partitions     queue       safe-mode         system     user      export       ping     undo
console         interface     log      port           radius      snmp              task       beep      import       quit
disk            ip            mpls     ppp            routing     special-login     tool       blink     password     redo
```

---

## 4.1 Основні розділи конфігурації

| Команда | Що виконує | Коли використовується | Ризик |
|---|---|---|---|
| `/certificate` | Керування сертифікатами, CA, client/server certificates, CRL, SCEP, ACME. | VPN, HTTPS, SSTP, IKEv2/IPsec з сертифікатами, захищений доступ. | Середній/високий |
| `/console` | Налаштування поведінки CLI-консолі. | Рідко: параметри terminal/console session. | Низький |
| `/disk` | Керування дисками/накопичувачами. | USB/storage, контейнери, файли, logs на диск. | Середній |
| `/file` | Файли на роутері: backup, export, certificates, logs, scripts. | Перевірити/завантажити/видалити файли. | Середній |
| `/interface` | Усі мережеві інтерфейси: Ethernet, bridge, VLAN, Wi‑Fi, VPN, tunnels, WireGuard. | Основна робота з портами, Wi‑Fi, bridge, VLAN, VPN. | Високий |
| `/ip` | IPv4: адреси, DHCP, DNS, firewall, NAT, routes, services, IPsec. | Основний розділ для мережі й безпеки. | Високий |
| `/ipv6` | IPv6: адреси, маршрути, firewall, neighbors. | Якщо мережа використовує IPv6. | Високий |
| `/log` | Перегляд системних логів. | Діагностика помилок, firewall events, VPN, DHCP, Wi‑Fi. | Низький |
| `/mpls` | MPLS-функції. | Провайдерські/складні мережі. У домашній мережі майже не треба. | Високий |
| `/partitions` | Робота з partitions RouterOS. | Спеціальні сценарії оновлення/відновлення. | Високий |
| `/port` | Серійні/USB порти. | Модеми, serial console, спеціальне обладнання. | Середній |
| `/ppp` | PPP, PPPoE, L2TP, PPTP, SSTP, profiles, secrets. | VPN-сервери, PPPoE-клієнт/сервер. | Високий |
| `/queue` | QoS, speed limits, bandwidth shaping. | Обмеження швидкості, пріоритизація трафіку. | Середній |
| `/radius` | RADIUS-клієнт для централізованої авторизації. | Корпоративна авторизація, PPP/Wi‑Fi/VPN через RADIUS. | Середній |
| `/routing` | Routing tables, rules, BGP, OSPF, routing filters. | Складна маршрутизація, policy routing, failover. | Високий |
| `/snmp` | SNMP-моніторинг. | Zabbix, The Dude, PRTG, LibreNMS тощо. | Середній |
| `/special-login` | Спеціальні login-режими. | Рідкісні сценарії доступу. | Середній |
| `/system` | Системні налаштування: packages, resources, clock, identity, backup, scripts, scheduler. | Адміністрування роутера. | Середній/високий |
| `/task` | Активні задачі RouterOS. | Діагностика поточних процесів/завдань. | Низький |
| `/tool` | Діагностичні інструменти: ping, traceroute, torch, sniffer, fetch, netwatch. | Troubleshooting. | Низький/середній |
| `/user` | Користувачі, групи, активні сесії. | Керування доступом до роутера. | Високий |

---

## 4.2 Прямі службові команди

| Команда | Що виконує | Коли використовується | Ризик |
|---|---|---|---|
| `/export` | Експорт конфігурації у текстовому вигляді. | Документація, аудит, backup перед змінами. | Низький |
| `/import` | Імпорт команд зі script/export file. | Масове застосування конфігурації. | Дуже високий |
| `/ping` | Ping з роутера. | Перевірка доступності IP/host. | Низький |
| `/quit` | Вийти з CLI. | Завершити сесію. | Низький |
| `/password` | Змінити пароль поточного користувача. | Оновлення пароля. | Середній |
| `/undo` | Скасувати останню зміну, якщо можливо. | Відкат помилки. | Середній |
| `/redo` | Повторити скасовану зміну. | Повернути undo-зміну. | Середній |
| `/beep` | Звуковий сигнал, якщо пристрій підтримує. | Фізична ідентифікація/перевірка. | Низький |
| `/blink` | Блимання індикатором пристрою. | Знайти фізичний роутер серед інших. | Низький |
| `/safe-mode` | Safe Mode: зміни відкочуються, якщо сесія обривається. | Перед ризиковими мережевими/firewall/VPN змінами. | Захисна команда |

---

# 5. `/interface/` commands з вашого MikroTik

Ваш вивід:

```routeros
6to4                eoipv6       l2tp-client     macvlan         pppoe-client     vlan          blink       find
bonding             ethernet     l2tp-ether      mesh            pppoe-server     vpls          comment     monitor-traffic
bridge              gre          l2tp-server     ovpn-client     pptp-client      vrrp          disable     print
detect-internet     gre6         list            ovpn-server     pptp-server      vxlan         edit        reset
dot1x               ipip         lte             ppp-client      sstp-client      wifi          enable      reset-counters
eoip                ipipv6       macsec          ppp-server      sstp-server      wireguard     export      set
```

---

## 5.1 Типи інтерфейсів і підрозділи

| Команда | Що виконує | Коли використовується | Ризик |
|---|---|---|---|
| `/interface 6to4` | IPv6 over IPv4 tunnel 6to4. | Старі/спеціальні IPv6-over-IPv4 сценарії. | Середній |
| `/interface bonding` | Об’єднання кількох фізичних інтерфейсів в один логічний. | Link aggregation, резервування або збільшення пропускної здатності. | Високий |
| `/interface bridge` | Bridge/switching між портами. | LAN bridge, VLAN bridge, hardware offload. | Високий |
| `/interface detect-internet` | Автовизначення інтернет-доступу на інтерфейсах. | Іноді для автоматичної класифікації WAN/LAN, але в production часто краще вимкнено/обережно. | Середній |
| `/interface dot1x` | 802.1X authentication на портах. | Корпоративна авторизація доступу до мережі. | Високий |
| `/interface eoip` | Ethernet over IP tunnel. | L2 tunnel між MikroTik через IP. | Високий |
| `/interface eoipv6` | EoIP через IPv6. | L2 tunnel через IPv6. | Високий |
| `/interface ethernet` | Фізичні Ethernet-порти. | Перевірка/налаштування портів, speed, auto-negotiation. | Високий |
| `/interface gre` | GRE tunnel IPv4. | Site-to-site tunnels, часто разом з IPsec. | Високий |
| `/interface gre6` | GRE tunnel через IPv6. | GRE для IPv6-середовищ. | Високий |
| `/interface ipip` | IP-in-IP tunnel IPv4. | Простий L3 tunnel, іноді разом з IPsec. | Високий |
| `/interface ipipv6` | IP-in-IP через IPv6. | Спеціальні tunnel-сценарії. | Високий |
| `/interface l2tp-client` | L2TP client interface. | Підключення MikroTik як VPN-клієнта. | Високий |
| `/interface l2tp-ether` | L2TP Ethernet interface. | L2-over-L2TP сценарії. | Високий |
| `/interface l2tp-server` | L2TP server interface/settings. | VPN-сервер для користувачів/філій. | Високий |
| `/interface list` | Списки інтерфейсів: WAN, LAN, manage тощо. | Firewall rules, neighbor discovery, service binding. | Високий |
| `/interface lte` | LTE modem interfaces. | LTE WAN, backup channel, SIM/modem diagnostics. | Високий |
| `/interface macsec` | MACsec encryption на L2. | Захист Ethernet-лінків у корпоративних мережах. | Високий |
| `/interface macvlan` | Віртуальні MAC/VLAN-like interfaces. | Контейнери, ізоляція, спеціальні L2-сценарії. | Середній |
| `/interface mesh` | Mesh networking. | MikroTik mesh-сценарії. | Високий |
| `/interface ovpn-client` | OpenVPN client. | VPN-клієнт OpenVPN. | Високий |
| `/interface ovpn-server` | OpenVPN server. | VPN-сервер OpenVPN. | Високий |
| `/interface ppp-client` | PPP client через serial/modem. | Модеми/старі WAN-сценарії. | Середній |
| `/interface ppp-server` | PPP server. | PPP-доступ для клієнтів. | Високий |
| `/interface pppoe-client` | PPPoE client. | Підключення до провайдера через PPPoE. | Високий |
| `/interface pppoe-server` | PPPoE server. | Провайдерські/локальні PPPoE-сервіси. | Високий |
| `/interface pptp-client` | PPTP client. | Старий VPN-клієнт. Безпека слабка, краще уникати. | Високий |
| `/interface pptp-server` | PPTP server. | Старий VPN-сервер. Небажано через слабку безпеку. | Високий |
| `/interface sstp-client` | SSTP client. | VPN-клієнт SSTP через TLS. | Високий |
| `/interface sstp-server` | SSTP server. | VPN-сервер SSTP. | Високий |
| `/interface vlan` | VLAN interfaces. | Сегментація мережі, trunk/access VLAN. | Високий |
| `/interface vpls` | VPLS tunnels. | Провайдерські/MPLS L2VPN сценарії. | Високий |
| `/interface vrrp` | VRRP redundancy. | Резервування gateway між кількома роутерами. | Високий |
| `/interface vxlan` | VXLAN overlay interface. | L2 overlay over L3, data center/advanced networking. | Високий |
| `/interface wifi` | Wi‑Fi interfaces у новому WiFiWave2/RouterOS 7 стилі. | SSID, radio, clients, security, channels. | Високий |
| `/interface wireguard` | WireGuard interfaces і peers. | Сучасний VPN для remote access/site-to-site. | Високий |

---

## 5.2 Дії всередині `/interface/`

| Команда | Що виконує | Коли використовується | Ризик |
|---|---|---|---|
| `print` | Показує список інтерфейсів або об’єктів у поточному меню. | Перевірка стану. | Низький |
| `find` | Знаходить об’єкти за умовою. | Використовується в скриптах або командах типу `set [find ...]`. | Середній |
| `comment` | Додає/змінює коментар до об’єкта. | Документація правил/інтерфейсів. | Низький |
| `monitor-traffic` | Показує live traffic на інтерфейсі. | Діагностика навантаження. | Низький |
| `disable` | Вимикає інтерфейс або об’єкт. | Тимчасово відключити порт/VPN/Wi‑Fi. | Високий |
| `enable` | Вмикає інтерфейс або об’єкт. | Повернути інтерфейс у роботу. | Високий |
| `edit` | Редагує властивість об’єкта у текстовому редакторі CLI. | Коли значення довге або незручно вводити inline. | Середній |
| `reset` | Скидає параметри. | Рідко; перед reset треба точно розуміти наслідки. | Високий |
| `reset-counters` | Скидає лічильники статистики. | Перед новим тестом/діагностикою. | Низький |
| `export` | Експортує конфігурацію поточного меню. | Backup/документація частини конфігурації. | Низький |
| `set` | Змінює параметри існуючого об’єкта. | Основна команда зміни конфігурації. | Високий |
| `blink` | Блимання індикатором конкретного інтерфейсу/пристрою, якщо підтримується. | Фізично знайти порт/пристрій. | Низький |

---

# 6. `/ip/ipsec/` commands з вашого MikroTik

Ваш вивід:

```routeros
active-peers     installed-sa     mode-config     policy      proposal     statistics
identity         key              peer            profile     settings     export
```

IPsec використовується для захищених VPN-тунелів: site-to-site, IKEv2 remote access, L2TP/IPsec, GRE/IPsec, IPIP/IPsec.

---

| Команда | Що виконує | Коли використовується | Ризик |
|---|---|---|---|
| `/ip/ipsec active-peers` | Показує активні IPsec/IKE peers. | Перевірити, хто зараз підключений і чи встановився IKE. | Низький |
| `/ip/ipsec installed-sa` | Показує встановлені Security Associations. | Діагностика: чи реально піднявся IPsec tunnel і які SA активні. | Низький |
| `/ip/ipsec mode-config` | Налаштування Mode Config: видача адрес/DNS/параметрів клієнтам. | IKEv2 remote access VPN, road-warrior VPN. | Високий |
| `/ip/ipsec policy` | IPsec policies: який трафік шифрувати, між якими subnet/IP. | Site-to-site IPsec, policy-based VPN. | Високий |
| `/ip/ipsec proposal` | Алгоритми шифрування/автентифікації для Phase 2/Child SA. | Узгодження encryption/auth з іншою стороною VPN. | Високий |
| `/ip/ipsec statistics` | Статистика IPsec. | Діагностика помилок, counters, dropped/failed packets. | Низький |
| `/ip/ipsec identity` | Ідентифікація peer: auth method, secret, certificate, policy template group. | Налаштування PSK/certificate-based VPN. | Високий |
| `/ip/ipsec key` | Ключі для IPsec. | Спеціальні сценарії ключів/сертифікатів. | Високий |
| `/ip/ipsec peer` | Peer endpoint: address, exchange mode, profile. | Налаштування віддаленого IPsec peer. | Високий |
| `/ip/ipsec profile` | IKE/Phase 1 параметри: hash, encryption, DH group, lifetime, NAT-T. | Узгодження IKE з іншою стороною VPN. | Високий |
| `/ip/ipsec settings` | Глобальні IPsec settings. | Загальна поведінка IPsec на роутері. | Високий |
| `/ip/ipsec export` | Експорт IPsec-конфігурації. | Backup/аудит VPN-конфігурації. | Низький |

---

## 6.1 Практичні IPsec команди для діагностики

```routeros
/ip/ipsec active-peers print detail
/ip/ipsec installed-sa print detail
/ip/ipsec policy print detail
/ip/ipsec peer print detail
/ip/ipsec identity print detail
/ip/ipsec profile print detail
/ip/ipsec proposal print detail
/ip/ipsec statistics print
/log print where topics~"ipsec"
```

---

## 6.2 Команди, з якими треба бути дуже обережним

```routeros
/ip/ipsec policy remove
/ip/ipsec peer remove
/ip/ipsec identity remove
/ip/ipsec profile set
/ip/ipsec proposal set
/ip/ipsec settings set
```

Одна неправильна зміна може покласти VPN. Якщо це remote access — можна відрізати собі доступ.

---

# 7. `/certificate/` commands з вашого MikroTik

Ваш вивід:

```routeros
builtin         add                card-verify                    export                 issued-revoke     scep-renew                   unset
crl             add-acme           create-certificate-request     export-certificate     print             set
scep-server     add-scep           edit                           find                   remove            sign
settings        card-reinstall     enable-ssl-certificate         import                 reset             sign-certificate-request
```

Сертифікати використовуються для TLS/HTTPS, SSTP, OpenVPN, IKEv2/IPsec, EAP-TLS, SCEP/ACME.

---

## 7.1 Підрозділи `/certificate/`

| Команда | Що виконує | Коли використовується | Ризик |
|---|---|---|---|
| `/certificate builtin` | Вбудовані/системні сертифікати, якщо доступні. | Перевірка системних certificates. | Низький |
| `/certificate crl` | Certificate Revocation List. | Перевірка/керування відкликаними сертифікатами. | Середній |
| `/certificate scep-server` | SCEP server. | Автоматична видача сертифікатів клієнтам у керованих мережах. | Високий |
| `/certificate settings` | Глобальні certificate settings. | Налаштування поведінки certificate subsystem. | Середній/високий |

---

## 7.2 Дії `/certificate/`

| Команда | Що виконує | Коли використовується | Ризик |
|---|---|---|---|
| `add` | Створює запис/шаблон сертифіката. | Підготовка CA/server/client certificate. | Середній |
| `add-acme` | Створює/налаштовує ACME certificate, наприклад Let’s Encrypt. | HTTPS/SSL certificate через ACME. | Середній |
| `add-scep` | Додає SCEP client/config. | Автоматизоване отримання сертифікатів від SCEP server. | Середній |
| `card-reinstall` | Перевстановлення certificate/card-related components. | Спеціальні сценарії зі smart card/certificate storage. | Високий |
| `card-verify` | Перевірка card/certificate. | Діагностика smart card/certificate. | Середній |
| `create-certificate-request` | Створює CSR — certificate signing request. | Коли сертифікат має підписати зовнішній CA. | Середній |
| `edit` | Редагує властивість об’єкта. | Для довгих полів/параметрів. | Середній |
| `enable-ssl-certificate` | Вмикає SSL certificate для сервісу. | HTTPS/WWW-SSL або інший SSL-сервіс на RouterOS. | Високий |
| `export` | Експорт конфігурації certificate menu. | Backup/аудит. | Низький |
| `export-certificate` | Експортує сам сертифікат/ключ у файл. | Передати client cert, backup сертифікатів. | Високий |
| `find` | Знаходить сертифікати за умовою. | Скрипти, точкові операції. | Середній |
| `import` | Імпорт сертифіката/ключа з файлу. | Завантаження CA/server/client cert. | Високий |
| `issued-revoke` | Відкликає виданий сертифікат. | Коли client/server certificate скомпрометований або більше не має права доступу. | Високий |
| `print` | Показує список сертифікатів. | Перевірка наявності, статусу, fingerprint, validity. | Низький |
| `remove` | Видаляє сертифікат. | Прибирання непотрібних/старих certs. | Високий |
| `reset` | Скидання certificate-related параметрів/стану. | Рідко, тільки якщо точно відомо що робиш. | Високий |
| `scep-renew` | Оновлює сертифікат через SCEP. | Автоматичне продовження сертифікатів. | Середній |
| `set` | Змінює параметри сертифіката/запису. | Корекція параметрів. | Середній/високий |
| `sign` | Підписує сертифікат локальним CA. | Створення CA/server/client certificate на самому MikroTik. | Високий |
| `sign-certificate-request` | Підписує CSR. | Коли є external CSR і MikroTik виступає CA. | Високий |
| `unset` | Очищає значення певного параметра. | Прибрати конкретну властивість. | Середній/високий |

---

## 7.3 Практичні certificate-команди

```routeros
/certificate print detail
/certificate print where name~"vpn"
/certificate export
/certificate export-certificate <name> export-passphrase=<strong-password>
/certificate import file-name=<file>
/certificate sign <name>
```

---

## 7.4 Команди, з якими особливо обережно

```routeros
/certificate remove
/certificate reset
/certificate issued-revoke
/certificate export-certificate
/certificate enable-ssl-certificate
```

`export-certificate` може експортувати приватний ключ, якщо вказати відповідні параметри. Це вже секрет, а не просто файл.

---

# 8. Типові дії RouterOS CLI

Ці дії повторюються в багатьох меню.

| Дія | Що робить | Приклад | Безпека |
|---|---|---|---|
| `print` | Показати об’єкти | `/ip address print` | Безпечно |
| `print detail` | Показати детально | `/interface print detail` | Безпечно |
| `add` | Додати об’єкт | `/ip address add address=... interface=...` | Обережно |
| `set` | Змінити об’єкт | `/interface set ether1 disabled=yes` | Обережно |
| `remove` | Видалити об’єкт | `/ip route remove numbers=0` | Небезпечно |
| `disable` | Вимкнути об’єкт | `/ip firewall filter disable numbers=3` | Обережно |
| `enable` | Увімкнути об’єкт | `/ip firewall filter enable numbers=3` | Обережно |
| `find` | Знайти об’єкт | `/ip firewall filter find comment~"DROP"` | Безпечно саме по собі |
| `export` | Експорт частини конфігурації | `/ip firewall export` | Безпечно |
| `comment` | Додати коментар | `/ip firewall filter comment numbers=1 comment="..."` | Майже безпечно |
| `move` | Перемістити правило/об’єкт | `/ip firewall filter move ...` | Високий ризик для firewall |
| `reset-counters` | Скинути counters | `/ip firewall filter reset-counters` | Низький |
| `monitor` | Live-моніторинг | `/interface ethernet monitor ether1` | Безпечно |
| `monitor-traffic` | Live traffic | `/interface monitor-traffic ether1` | Безпечно |
| `edit` | Редагування поля | `edit numbers=0 value-name=comment` | Середній |
| `unset` | Очистити параметр | `unset numbers=0 value-name=...` | Середній |
| `reset` | Скидання параметрів/стану | залежить від меню | Високий |
| `import` | Імпорт скрипта | `/import file-name=config.rsc` | Дуже високий |

---

# 9. Рекомендований набір команд для щоденної роботи

## Стан роутера

```routeros
/system resource print
/system routerboard print
/system package print
/system clock print
/system identity print
```

## Інтерфейси

```routeros
/interface print
/interface print detail
/interface bridge print
/interface bridge port print
/interface ethernet print
/interface wifi registration-table print
/interface wireguard print
/interface wireguard peers print
```

## IP та маршрути

```routeros
/ip address print
/ip route print
/ip dns print
/ip arp print
/ip neighbor print
/ip dhcp-server lease print
```

## Firewall

```routeros
/ip firewall filter print
/ip firewall filter print detail
/ip firewall nat print
/ip firewall nat print detail
/ip firewall address-list print
/ip firewall connection print
```

## Доступ і безпека

```routeros
/user print
/user group print
/user active print
/ip service print
/ip ssh print
```

## Логи

```routeros
/log print
/log print follow
/log print where topics~"firewall"
/log print where topics~"ipsec"
```

## Діагностика

```routeros
/ping 8.8.8.8
/tool ping 8.8.8.8
/tool traceroute 8.8.8.8
/tool torch
/tool profile
```

---

# 10. Команди, які краще не запускати без плану

```routeros
/import
/system reset-configuration
/interface reset
/interface disable
/ip firewall filter remove
/ip firewall nat remove
/ip route remove
/ip service set
/user remove
/certificate remove
/certificate reset
/ip/ipsec settings set
/ip/ipsec policy remove
/routing rule remove
/partitions
```

Перед такими командами:

```routeros
/safe-mode
/system backup save name=before-risky-change
/export file=before-risky-change
```

---

# 11. Як продовжити збір повного довідника саме для вашого MikroTik

Щоб зробити ще повніший файл, потрібно зняти підменю з головних розділів.

Команди для збору:

```routeros
/ip/
 /system/
 /tool/
 /routing/
 /user/
 /queue/
 /ppp/
 /log/
 /file/
```

У RouterOS краще вводити по черзі:

```routeros
/ip/
```

потім `Tab`.

```routeros
/system/
```

потім `Tab`.

```routeros
/tool/
```

потім `Tab`.

Після цього можна доповнити цей файл командами `/ip firewall`, `/system`, `/tool`, `/routing`, `/user`.

---

# 12. Мінімальна практична карта

Якщо коротко, головні розділи для реальної роботи:

```routeros
/interface   # фізичні і логічні інтерфейси
/ip          # IPv4, DHCP, DNS, firewall, NAT, routes
/system      # стан роутера, пакети, backup, scripts
/tool        # діагностика
/log         # логи
/user        # доступи
/routing     # складна маршрутизація
/certificate # сертифікати
/ip/ipsec    # IPsec VPN
/export      # експорт конфігурації
/safe-mode   # захист від самоблокування
```

---

# 13. Нотатка по стилю роботи

Для MikroTik краще працювати так:

1. Спочатку тільки `print detail`.
2. Потім `export` потрібного розділу.
3. Потім `safe-mode`.
4. Потім одна зміна.
5. Потім перевірка.
6. Потім наступна зміна.

Не робити “пакетом 20 команд”, якщо ти підключений віддалено. RouterOS виконає все чесно. Навіть якщо це чесно відріже тобі доступ.

