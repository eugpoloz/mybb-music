/* ВСТАВКА МУЗЫКИ И ПЛЕЙЛИСТОВ С ЯНДЕКС.МУЗЫКИ, ПРОСТОПЛЕЕРА И ZIPPYSHARE
Автор - грандоченька смерти @ https://github.io/eugpoloz
Версия 3.0
*/
// LOOK, MA, NO JQUERY

var letsMakeSomeMusic = function() {
	function yandexMusic(url) {
		let playerParams = {
			type: 'track',
			id: url[2],
			cover: 'hide',
			height: 70
		};
		let {type, id, cover, height} = playerParams;

		switch(url[1]) {
			case 'album':
				if (url[3] && url[3] === 'track') {
					id = url[4];
				} else {
					type = 'album';
					cover = 'show';
					height = 500;
				}
				break;
			case 'users':
				type = 'playlist';
				cover = 'show';
				height = 500;
				id = url[4];
				break;
			default:
				break;
		}

		return `<iframe frameborder="0" style="border:none;width:100%;height:${height}px;" width="100%" height="${height}" src="https://music.yandex.ru/iframe/#${type}/${type === 'playlist' ? `${url[2]}/${id}/show/description` : id}/${cover}/cover/"></iframe>`;
	};

	// parse everything
	let paragraphsNodeList = document.querySelectorAll('.post-content > p');
	paragraphsNodeList.forEach(node => {
		if (node.textContent.includes('[audio]')) {
			let newHtml = node.innerHTML.replace(/\[audio\]/gi, '<div class="audio-player" style="display:none;">').replace(/\[\/audio\]/gi, '</div>');
			node.innerHTML = newHtml;
		}

		// make a switch inside forEach
		node.querySelectorAll('.audio-player').forEach(audio => {
			let urlArr = audio.textContent.replace(/http\:\/\//, '').replace(/https\:\/\//, '').split('/');
			let newPlayer;
			switch(urlArr[0]) {
				case 'www.music.yandex.ru':
				case 'music.yandex.ru':
					newPlayer = yandexMusic(urlArr);
					break;
				default:
					break;
			}
			audio.innerHTML = newPlayer;
			audio.style.display = 'block';
		});
	});
}();

// КОД ВЕРСИИ 2.0
// $(function() {
// 	$('.post-content').find('p').each(function() {
// 		if ( (/\[audio\](?:[^\]])+\[\/audio\]/gi).test($(this).html()) == true ) {
// 			if ( (/\[audio\]https\:\/\/music\.yandex\.ru(?:[^\]])+\[\/audio\]/gi).test($(this).html()) == true ) {
// 				var yandexTrack = /\[audio\]https\:\/\/music\.yandex\.ru\/album\/((?:[\d\]])+)\/track\/((?:[\d\]])+)\[\/audio\]/gi,
// 					yandexAlbum = /\[audio\]https\:\/\/music\.yandex\.ru\/album\/((?:[\d\]])+)\[\/audio\]/gi,
// 					yandexList = /\[audio\]https\:\/\/music\.yandex\.ru\/users\/((?:[^\]])+)\/playlists\/((?:[\d\]])+)\[\/audio\]/gi;
// 				if ( yandexTrack.test($(this).html()) == true ) {
// 					$(this).html( $(this).html().replace(yandexTrack, '<iframe frameborder=\"0\" style=\"border:none;width:100%;height:70px;\" width=\"100%\" height=\"70\" src=\"https:\/\/music.yandex.ru\/iframe\/#track\/$2\/$1\/hide\/cover\/\"><\/iframe>')); //Вставка трека с Яндекса
// 				} else if ( yandexAlbum.test($(this).html()) == true ) {
// 					$(this).html( $(this).html().replace(yandexAlbum, '<iframe frameborder="0" style="border:none;width:100%;height:500;" width="100%" height="500" src="https://music.yandex.ru/iframe/#album/$1/hide/cover/"></iframe>')); //Вставка альбома с Яндекса
// 				} else if ( yandexList.test($(this).html()) == true ) {
// 					$(this).html( $(this).html().replace(yandexList, '<iframe frameborder="0" style="border:none;width:100%;height:500;" width="100%" height="500" src="https://music.yandex.ru/iframe/#playlist/$1/$2/show/description/hide/cover/"></iframe>')); //Вставка плейлиста с Яндекса
// 				}
// 			} else if ( (/\[audio\]http\:\/\/www((?:[^\]])+)\.zippyshare\.com(?:[^\]])+\[\/audio\]/gi).test($(this).html()) == true ) {
// 				$(this).html($(this).html().replace(/\[audio\]http\:\/\/www((?:[^\]])+)\.zippyshare\.com\/v\/((?:[^\]])+)\/file\.html\[\/audio\]/gi, '<embed type="application/x-shockwave-flash" src="http://api.zippyshare.com/api/mediaplayer/mediaplayer.swf" flashvars="height=20&amp;width=400&amp;file=http://www$1.zippyshare.com/downloadMusic%3Fkey%3D$2%26&amp;volume=80&amp;autostart=false&amp;frontcolor=0x000000&amp;backcolor=0xffffff&amp;lightcolor=0x000000&amp;type=flv" quality="high" menu="false" wmode="transparent" allowscriptaccess="always" height="20" width="400" name="mp3player" border="0" style="margin-bottom: 6px;"/>')); // Вставка трека с zippyshare
// 			}
// 		}
// 	});
// });

// // Кнопка
// $('td#button-code').after('<td id="button-audio" style="background-image:url(http://s5.uploads.ru/4QUIa.gif);" title="Музыка в посте"><img src="/i/blank.gif"></td>');
// // Функция на кнопке
// $('td#button-audio').click(function (event) {
// 	if (event.ctrlKey || event.altKey) {
// 		bbcode('[audio]', '[/audio]');
// 	} else {
// 		var audioMusicURL = prompt('Вставьте ссылку на трек, альбом или плейлист с Яндекс.Музыки или трек с zippyshare.com', 'http://');
// 		if (audioMusicURL === null) {
// 			return;
// 		} else if (!audioMusicURL || audioMusicURL === 'http://') {
// 			alert('Вы не вставили ссылку!');
// 		} else {
// 			insert('[audio]' + audioMusicURL + '[/audio]');
// 		}
// 	}
// });