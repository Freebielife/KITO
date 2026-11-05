# KITO Observatory

Аналитика KITO на DeDust для **freebie.socool.ton**, на русском и английском. [Скачать index.html](https://raw.githubusercontent.com/Freebielife/KITO/main/index.html) и загрузить как корневой файл сайта в Resistance Tools.

GitHub Actions обновляет данные каждые два часа. Страница читает свежий снимок с GitHub, а при отсутствии сети использует встроенную копию.

Исходники интерфейса находятся в `web/`. Сборка и проверка (Python 3.10+):

```sh
python3 collect.py
python3 build.py
python3 verify.py
```
