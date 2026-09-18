# MikroTik RouterOS CLI — Quiz Parts

Набір тестів у форматі [GIFT](https://docs.moodle.org/en/GIFT_format) для курсу MikroTik RouterOS CLI.

**Джерело:** [`mikrotik_routeros_cli_commands_uk.md`](../mikrotik_routeros_cli_commands_uk.md)

## Секції

| Файл | Тема | Питань |
|------|------|--------|
| [`gift/01-cli-basics.txt`](gift/01-cli-basics.txt) | Основи CLI: `/`, Tab/F1, `print` vs `add`, шляхи меню | 9 |
| [`gift/02-safety.txt`](gift/02-safety.txt) | Безпека: Safe Mode (Ctrl+X), backup, export, ризик import, небезпечні команди | 10 |
| [`gift/03-interface.txt`](gift/03-interface.txt) | Інтерфейси: bridge, wifi, wireguard, vlan, ризик disable | 8 |
| [`gift/04-ip-firewall.txt`](gift/04-ip-firewall.txt) | IP і firewall: розділи `/ip`, порядок правил, NAT, services, user | 10 |
| [`gift/05-vpn-cert.txt`](gift/05-vpn-cert.txt) | VPN і сертифікати: IPsec peer/policy/installed-sa, certificates | 9 |
| [`gift/06-daily-practice.txt`](gift/06-daily-practice.txt) | Щоденна практика: print-команди, `/ping … count=`, `log follow` | 8 |

**Разом: 54 питання**

## Імпорт у Moodle

1. Відкрийте курс → **Question bank** → **Import**.
2. Оберіть формат **GIFT format**.
3. Завантажте один або кілька `.txt` файлів з каталогу `gift/`.
4. Створіть Quiz і додайте питання з банку питань.

## Формат питань

Кожне питання має:
- 3 варіанти відповіді (`=` правильна, `~` неправильні)
- блок зворотного зв'язку `#### feedback`

Приклад:

```gift
::Заголовок::
Текст питання? {
=правильна відповідь
~неправильна 1
~неправильна 2
#### Пояснення після відповіді.
}
```