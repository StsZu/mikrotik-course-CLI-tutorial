# MikroTik RouterOS CLI — Тренажер

Інтерактивний HTML-тренажер команд RouterOS CLI українською + quiz-сторінка.

**Без SSH** — статичні `index.html` і `quiz.html`, працюють локально або на GitHub Pages.

## Швидкий старт

```bash
open index.html
# Quiz: open quiz.html
```

## Перегенерація

```bash
python3 scripts/build_trainer.py   # index.html
python3 scripts/build_quiz_html.py # quiz.html з GIFT
```

## Сторінки

| Сторінка | Зміст |
|----------|--------|
| **index.html** | Емулятор CLI — 6 розділів, ~55 команд, режим тестування |
| **quiz.html** | 54 питання GIFT — 3 варіанти + feedback |

## Розділи тренажера

1. CLI та безпека — safe-mode, export, backup, print
2. Система і діагностика — resource, log, tool
3. Інтерфейси — bridge, wifi, wireguard
4. IP і маршрути — route, dns, dhcp
5. Firewall і доступ — filter, nat, user, services
6. VPN і сертифікати — ipsec, certificate

## Quiz (GIFT Moodle)

Файли в `quiz_parts/gift/`:

- `01-cli-basics.txt` — CLI основи
- `02-safety.txt` — безпека
- `03-interface.txt` — інтерфейси
- `04-ip-firewall.txt` — IP і firewall
- `05-vpn-cert.txt` — VPN і certs
- `06-daily-practice.txt` — щоденна практика

Імпорт у Moodle: Question bank → Import → GIFT format.

## Джерела

- `mikrotik_routeros_cli_commands_uk.md`
- https://help.mikrotik.com/docs/spaces/ROS/pages/328134/Command+Line+Interface

## GitHub Pages

Settings → Pages → `main` → `/ (root)`.