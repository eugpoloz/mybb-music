/*
   mybb-music v1.0.1
   by грандоченька смерти @ https://github.io/eugpoloz/mybb-music
   @license MIT
*/

/* LOOK, MA! NO JQUERY! */

var letsMakeSomeMusic = (function() {
  var maxH = 417;

  function yandexMusic(url) {
    let playerParams = {
      type: "track",
      id: url[2],
      cover: "hide",
      h: 70
    };
    let { type, id, cover, h } = playerParams;

    switch (url[1]) {
      case "album":
        if (url[3] && url[3] === "track") {
          id = url[4];
        } else {
          type = "album";
          cover = "show";
          h = maxH;
        }
        break;
      case "users":
        type = "playlist";
        cover = "show";
        h = maxH;
        id = url[4];
        break;
      default:
        break;
    }

    return `<iframe frameborder="0" style="border:none;width:100%;height:${h}px;" width="100%" height="${h}" src="https://music.yandex.ru/iframe/#${type}/${type ===
      "playlist"
      ? `${url[2]}/${id}/show/description`
      : id}/${cover}/cover/"></iframe>`;
  }

  function zippyMusic(url) {
    return `<embed type="application/x-shockwave-flash" src="http://api.zippyshare.com/api/mediaplayer/mediaplayer.swf" flashvars="height=20&amp;width=400&amp;file=http://${url[0]}/downloadMusic%3Fkey%3D${url[2]}%26&amp;volume=80&amp;autostart=false&amp;frontcolor=0x000000&amp;backcolor=0xffffff&amp;lightcolor=0x000000&amp;type=flv" quality="high" menu="false" wmode="transparent" allowscriptaccess="always" height="20" width="400" name="mp3player" border="0" style="margin-bottom: 6px;"/>`;
  }

  function prostoMusic(url) {
    let playerParams = {
      type: "track",
      id: url[2],
      w: 578,
      h: 43
    };
    let { type, id, w, h } = playerParams;

    if (url[1] !== "tracks") {
      type = "list";
      id = url[1].replace(/list/, "");
      w = "100%";
      h = maxH + 80;
    }

    var link = `http://embedpleer.net/${type === "track"
      ? `normal/${type}?id=${id}&t=grey`
      : `${type}?id=${id}`}`;
    var wH = `width=${w} height=${h}`;
    return `<object ${wH}><param name="movie" value="${link}"></param><embed src="${link}" ${wH} type="application/x-shockwave-flash"></embed></object>`;
  }

  // parse everything
  let paragraphsNodeList = document.querySelectorAll(
    ".post-content > *:not(.post-sig)"
  );
  paragraphsNodeList.forEach(node => {
    if (node.textContent.includes("[audio]")) {
      let newHtml = node.innerHTML
        .replace(
          /\[audio\]/gi,
          `<div class="audio-player" style="display:none;max-height:${maxH}px;overflow:hidden;">`
        )
        .replace(/\[\/audio\]/gi, "</div>");
      node.innerHTML = newHtml;
    }

    // make a switch inside forEach
    node.querySelectorAll(".audio-player").forEach(audio => {
      let urlArr = audio.textContent
        .replace(/http\:\/\//, "")
        .replace(/https\:\/\//, "")
        .split("/");
      let domain = urlArr[0].replace(/^w{3}(?:\S+?\.)/, "");
      let newPlayer;
      switch (domain) {
        case "music.yandex.kz":
        case "music.yandex.by":
        case "music.yandex.ru":
        case "music.yandex.ua":
          newPlayer = yandexMusic(urlArr);
          break;
        case "zippyshare.com":
          newPlayer = zippyMusic(urlArr);
          break;
        case "pleer.com":
        case "pleer.net":
          newPlayer = prostoMusic(urlArr);
          break;
        default:
          break;
      }
      audio.innerHTML =
        newPlayer ||
        '<em style="color:tomato;">Это не та музыка, которую вы ищете!</em>';
      audio.style.display = "block";
    });
  });

  function insertNode(el, hostEl) {
    return hostEl.parentNode.insertBefore(el, hostEl.nextSibling);
  }

  // add the button
  let createBtn = () => {
    let btn = document.createElement("td");
    btn.id = "button-audio";
    btn.className = "button-audio";
    btn.title = "Музыка в посте";
    btn.innerHTML = '<img src="/i/blank.gif" style="pointer-events:none;">';

    return btn;
  };

  let createPopup = () => {
    let popup = document.createElement("div");
    popup.className = "container audio-popup";
    popup.id = "audio-area";
    popup.style.display = "none";
    popup.innerHTML = `
      <label for="audio-link-input" class="audio-popup__label">
        <strong>Вставьте ссылку на трек с Яндекс.Музыки, Простоплеера или zippyshare.com:</strong>
        <input class="audio-popup__input" type="text" id="audio-link-input" name="audio-link-input" placeholder="http://" />
      </label>
      <a href="#" class="audio-popup__btn js-audio-link-insert">Вставить</a>&nbsp;&nbsp;&nbsp;<a href="#" class="audio-popup__btn js-audio-link-close">Закрыть</a>
    `;

    return popup;
  };

  if (document.querySelector("textarea#main-reply") !== null) {
    // insert btn
    const codeBtn = document.getElementById("button-code");
    insertNode(createBtn(), codeBtn);

    // insert popup
    const colorDiv = document.querySelector(
      "#post .fs-box.hashelp #color-area"
    );
    insertNode(createPopup(), colorDiv);

    // cash audioPopup and audioInput references for helper functions to use
    const audioPopup = document.getElementById("audio-area");

    // function on btn
    function addMusic(e) {
      let isVisible = audioPopup.style.display === "block";

      if (e.ctrlKey || e.altKey) {
        if (isVisible) audioPopup.style.display = "none"; // hide popup if it's shown
        return bbcode("[audio]", "[/audio]");
      }

      audioPopup.style.display = isVisible ? "none" : "block";
      audioPopup.style.zIndex = isVisible ? -1 : 10000;
    }

    function popupBtnActions(e) {
      e.preventDefault();
      audioPopup.style.display = "none";

      let input = document.getElementById("audio-link-input");

      if (e.target === document.querySelector(".js-audio-link-insert")) {
        input.value.trim() === ""
          ? bbcode("[audio]", "[/audio]")
          : insert(`[audio]${input.value}[/audio]`);
      }

      return (input.value = "");
    }

    document
      .getElementById("button-audio")
      .addEventListener("click", addMusic, true);
    document
      .querySelector(".js-audio-link-insert")
      .addEventListener("click", popupBtnActions, true);
    document
      .querySelector(".js-audio-link-close")
      .addEventListener("click", popupBtnActions, true);
  }
})();
