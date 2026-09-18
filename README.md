# MikroTik RouterOS CLI — курс

Офлайн-курс командного рядка RouterOS 7 українською: 7 модулів, 13 уроків, фінальний іспит, шпаргалка, тренажер і банк питань.

**Без збірки й без роутера** — статичні сторінки, працюють з диска (`file://`) або на GitHub Pages.

## Швидкий старт

```bash
open index.html      # курс (уроки, quiz, іспит, шпаргалка, словник)
open trainer.html    # тренажер-емулятор RouterOS CLI
open quiz.html       # банк питань (54, GIFT)
```

## Сторінки

| Сторінка | Зміст |
|----------|--------|
| **index.html** | Курс на спільному рушії CLI Course Hub (генерується `node scripts/render-index.mjs courses/mikrotik` у hub) |
| **trainer.html** | Емулятор RouterOS 7 — 6 розділів, строгий матчинг, Safe Mode через Ctrl+X, тест-режим |
| **quiz.html** | 54 питання GIFT — 3 варіанти, перемішування, feedback |

## Модулі

1. CLI RouterOS: шляхи й дії — `/`, Tab, F1, `print`, `add`, `set`, `remove`
2. Безпечні зміни — `/export`, `/system backup save`, Safe Mode (Ctrl+X), `/undo`
3. Система і діагностика — resource, package, log, `/ping`, traceroute, torch
4. Інтерфейси — bridge, VLAN, списки, Wi‑Fi, WireGuard
5. IP, маршрути, DNS, DHCP
6. Firewall і доступ — filter, nat, user, services
7. VPN і сертифікати — IPsec, certificate

## Перегенерація

```bash
python3 scripts/build_quiz_html.py   # quiz.html з quiz_parts/gift/*.txt
```

`scripts/build_trainer.py` — архів старого генератора; тренажер редагується прямо в `trainer.html`.

## Джерела

- `mikrotik_routeros_cli_commands_uk.md` (архівний довідник)
- https://help.mikrotik.com/docs/spaces/ROS/pages/328134/Command+Line+Interface
- https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management
