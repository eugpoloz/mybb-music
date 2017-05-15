# mybb-music
Скрипт музыки для mybb-форумов, девелоперская версия. Поскольку он переписывается полностью не в первый раз, я решила, что есть смысл вынести его в свой собственный красивый репозиторий.

## Поддержка
Скрипт поддерживается **[грандоченькой смерти](http://urchoice.rolka.su/profile.php?id=4789)** на "Live Your Life", здесь и через e-mail [muirelynn.roleplay@gmail.com](mailto:muirelynn.roleplay@gmail.com). Реквестировать фичи можно по тем же каналам.

## О скрипте

### Сервисы и их возможности, которые поддерживает скрипт:
- Яндекс.Музыка: треки, альбомы, плейлисты
- Простоплеер (Pleer.net/Pleer.com): треки, плейлисты
- Zippyshare.com

<<<<<<< 2f7c0988a2b69ea8db95867ea32ebdc60de9f5de
## Дополнительные фичи
- при клике на кнопку с зажатыми `CTRL` или `ALT` в форму ответа вставляется тег `[audio][/audio]`. 

## План полной победы (потенциальные фичи)

#### Первостепенной важности:

- сделать сайт на Github Pages с инструкцией по установке, шарить скрипт оттуда
- запилить на сайте генератор стилей поля и иконки
- заменить дефолтную иконку на что-нибудь с музычкой
- изучить/настроить babel и автосборщик локально

#### Когда-нибудь:

- сделать возможность кастомизировать Яндекс.Музыку
- разобраться в API Простоплеера и сделать для него свой HTML5-плеер
=======
### Дополнительные фичи:
- при клике на кнопку с зажатыми `CTRL` или `ALT` в форму ответа вставляется тег `[audio][/audio]`. 

## Сборка

### Копирование проекта и установка зависимостей:
```
git clone git@github.com:eugpoloz/mybb-music.git
cd mybb-music
npm install
```

### Прогнать mybb-music.js через babel и получить production-ready code:
```
npm run build
```
>>>>>>> document building process and stuff
