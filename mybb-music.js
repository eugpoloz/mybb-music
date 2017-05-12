/* ВСТАВКА МУЗЫКИ И ПЛЕЙЛИСТОВ С ЯНДЕКС.МУЗЫКИ, ПРОСТОПЛЕЕРА И ZIPPYSHARE
Автор - грандоченька смерти @ https://github.io/eugpoloz
Версия 3.0
*/
// LOOK, MA, NO JQUERY

var letsMakeSomeMusic = function() {
  'use strict';

  var maxH = 417;

  function yandexMusic(url) {
    let playerParams = {
      type: 'track',
      id: url[2],
      cover: 'hide',
      h: 70
    };
    let {type, id, cover, h} = playerParams;

    switch(url[1]) {
      case 'album':
        if (url[3] && url[3] === 'track') {
          id = url[4];
        } else {
          type = 'album';
          cover = 'show';
          h = maxH;
        }
        break;
      case 'users':
        type = 'playlist';
        cover = 'show';
        h = maxH;
        id = url[4];
        break;
      default:
        break;
    }

    return `<iframe frameborder="0" style="border:none;width:100%;height:${h}px;" width="100%" height="${h}" src="https://music.yandex.ru/iframe/#${type}/${type === 'playlist' ? `${url[2]}/${id}/show/description` : id}/${cover}/cover/"></iframe>`;
  };

  function zippyMusic(url) {
    return `<embed type="application/x-shockwave-flash" src="http://api.zippyshare.com/api/mediaplayer/mediaplayer.swf" flashvars="height=20&amp;width=400&amp;file=http://${url[0]}/downloadMusic%3Fkey%3D${url[2]}%26&amp;volume=80&amp;autostart=false&amp;frontcolor=0x000000&amp;backcolor=0xffffff&amp;lightcolor=0x000000&amp;type=flv" quality="high" menu="false" wmode="transparent" allowscriptaccess="always" height="20" width="400" name="mp3player" border="0" style="margin-bottom: 6px;"/>`;
  }

  function prostoMusic(url) {
    let playerParams = {
      type: 'track',
      id: url[2],
      w: '100%',
      h: 43
    };
    let {type, id, w, h} = playerParams;

    if (url[1] !== 'tracks') {
      type = 'list';
      id = url[1].replace(/list/, '');
      w = '100%';
      h = maxH + 80;
    }

    var link = `http://embedpleer.net/${type === 'track' ? `normal/${type}?id=${id}&t=grey` : `${type}?id=${id}`}`;
    var wH = `width=${w} height=${h}`;
    return `<object ${wH}><param name="movie" value="${link}"></param><embed src="${link}" ${wH} type="application/x-shockwave-flash"></embed></object>`;
  }

  // parse everything
  let paragraphsNodeList = document.querySelectorAll('.post-content > p');
  paragraphsNodeList.forEach(node => {
    if (node.textContent.includes('[audio]')) {
      let newHtml = node.innerHTML.replace(/\[audio\]/gi, `<div class="audio-player" style="display:none;max-height:${maxH}px;overflow:hidden;">`).replace(/\[\/audio\]/gi, '</div>');
      node.innerHTML = newHtml;
    }

    // make a switch inside forEach
    node.querySelectorAll('.audio-player').forEach(audio => {
      let urlArr = audio.textContent.replace(/http\:\/\//, '').replace(/https\:\/\//, '').split('/');
      let domain = urlArr[0].replace(/^w{3}(?:\S+?\.)/, '');
      let newPlayer;
      switch(domain) {
        case 'music.yandex.kz':
        case 'music.yandex.by':
        case 'music.yandex.ru':
        case 'music.yandex.ua':
          newPlayer = yandexMusic(urlArr);
          break;
        case 'zippyshare.com':
          newPlayer = zippyMusic(urlArr);
          break;
        case 'pleer.com':
        case 'pleer.net':
          newPlayer = prostoMusic(urlArr);
          break;
        default:
          break;
      }
      audio.innerHTML = newPlayer || '<em style="color:tomato;">Это не та музыка, которую вы ищете!</em>';
      audio.style.display = 'block';
    });
  });
}();

// КОД ВЕРСИИ 2.0
// $(function() {
//   $('.post-content').find('p').each(function() {
//     if ( (/\[audio\](?:[^\]])+\[\/audio\]/gi).test($(this).html()) == true ) {
//       if ( (/\[audio\]https\:\/\/music\.yandex\.ru(?:[^\]])+\[\/audio\]/gi).test($(this).html()) == true ) {
//         var yandexTrack = /\[audio\]https\:\/\/music\.yandex\.ru\/album\/((?:[\d\]])+)\/track\/((?:[\d\]])+)\[\/audio\]/gi,
//           yandexAlbum = /\[audio\]https\:\/\/music\.yandex\.ru\/album\/((?:[\d\]])+)\[\/audio\]/gi,
//           yandexList = /\[audio\]https\:\/\/music\.yandex\.ru\/users\/((?:[^\]])+)\/playlists\/((?:[\d\]])+)\[\/audio\]/gi;
//         if ( yandexTrack.test($(this).html()) == true ) {
//           $(this).html( $(this).html().replace(yandexTrack, '<iframe frameborder=\"0\" style=\"border:none;width:100%;height:70px;\" width=\"100%\" height=\"70\" src=\"https:\/\/music.yandex.ru\/iframe\/#track\/$2\/$1\/hide\/cover\/\"><\/iframe>')); //Вставка трека с Яндекса
//         } else if ( yandexAlbum.test($(this).html()) == true ) {
//           $(this).html( $(this).html().replace(yandexAlbum, '<iframe frameborder="0" style="border:none;width:100%;height:500;" width="100%" height="500" src="https://music.yandex.ru/iframe/#album/$1/hide/cover/"></iframe>')); //Вставка альбома с Яндекса
//         } else if ( yandexList.test($(this).html()) == true ) {
//           $(this).html( $(this).html().replace(yandexList, '<iframe frameborder="0" style="border:none;width:100%;height:500;" width="100%" height="500" src="https://music.yandex.ru/iframe/#playlist/$1/$2/show/description/hide/cover/"></iframe>')); //Вставка плейлиста с Яндекса
//         }
//       } else if ( (/\[audio\]http\:\/\/www((?:[^\]])+)\.zippyshare\.com(?:[^\]])+\[\/audio\]/gi).test($(this).html()) == true ) {
//         $(this).html($(this).html().replace(/\[audio\]http\:\/\/www((?:[^\]])+)\.zippyshare\.com\/v\/((?:[^\]])+)\/file\.html\[\/audio\]/gi, '<embed type="application/x-shockwave-flash" src="http://api.zippyshare.com/api/mediaplayer/mediaplayer.swf" flashvars="height=20&amp;width=400&amp;file=http://www$1.zippyshare.com/downloadMusic%3Fkey%3D$2%26&amp;volume=80&amp;autostart=false&amp;frontcolor=0x000000&amp;backcolor=0xffffff&amp;lightcolor=0x000000&amp;type=flv" quality="high" menu="false" wmode="transparent" allowscriptaccess="always" height="20" width="400" name="mp3player" border="0" style="margin-bottom: 6px;"/>')); // Вставка трека с zippyshare
//       } else if ( (/\[audio\]http\:\/\/(?:prostopleer|pleer)\.(?:com|net)(?:[^\]])+\[\/audio\]/gi).test($(this).html()) == true ) {
//         var pleerTrack = /\[audio\]http:\/\/(?:prostopleer|pleer)\.(?:com|net)\/tracks\/((?:[^\]])+)\[\/audio\]/gi,
//           pleerList = /\[audio\]http:\/\/(?:prostopleer|pleer)\.(?:com|net)\/list((?:[^\]])+)\[\/audio\]/gi;
//           if ( pleerTrack.test($(this).html()) == true ) {
//             $(this).html($(this).html().replace( pleerTrack, '<object width="578" height="43"><param name="movie" value="http://embedpleer.net/normal/track?id=$1&t=grey"></param><embed src="http://embedpleer.net/normal/track?id=$1&t=grey" type="application/x-shockwave-flash" width="578" height="43"></embed></object>')); // Вставка трека с (prosto)pleer.com
//           } else if ( pleerList.test($(this).html()) == true ) {
//             $(this).html($(this).html().replace(pleerList, '<object width="550" height="300"><param name="movie" value="http://embedpleer.net/list?id=$1"></param><embed src="http://embedpleer.net/list?id=$1" type="application/x-shockwave-flash" width="550" height="300" style="margin-bottom:-90px;"></embed></object>')); // Вставка плейлиста с (prosto)pleer.com
//           }
//       }
//     }
//   });
// });
// // Кнопка
// $('td#button-code').after('<td id="button-audio" style="background-image:url(http://s5.uploads.ru/4QUIa.gif);" title="Музыка в посте"><img src="/i/blank.gif"></td>');
// // Функция на кнопке
// $('td#button-audio').click(function (event) {
//   if (event.ctrlKey || event.altKey) {
//     bbcode('[audio]', '[/audio]');
//   } else {
//     var audioMusicURL = prompt('Вставьте ссылку на трек, альбом или плейлист с Яндекс.Музыки, трек или плейлист с pleer.net или трек с zippyshare.com', 'http://');
//     if (audioMusicURL === null) {
//       return;
//     } else if (!audioMusicURL || audioMusicURL === 'http://') {
//       alert('Вы не вставили ссылку!');
//     } else {
//       insert('[audio]' + audioMusicURL + '[/audio]');
//     }
//   }
// });
