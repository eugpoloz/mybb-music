"use strict";

/*
   mybb-music v1.0.1
   by грандоченька смерти @ https://github.io/eugpoloz/mybb-music
   @license MIT
*/

var letsMakeSomeMusic = function () {
  var maxH = 417;

  function yandexMusic(url) {
    var playerParams = {
      type: "track",
      id: url[2],
      cover: "hide",
      h: 70
    };
    var type = playerParams.type,
        id = playerParams.id,
        cover = playerParams.cover,
        h = playerParams.h;


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

    return "<iframe frameborder=\"0\" style=\"border:none;width:100%;height:" + h + "px;\" width=\"100%\" height=\"" + h + "\" src=\"https://music.yandex.ru/iframe/#" + type + "/" + (type === "playlist" ? url[2] + "/" + id + "/show/description" : id) + "/" + cover + "/cover/\"></iframe>";
  }

  function zippyMusic(url) {
    return "<embed type=\"application/x-shockwave-flash\" src=\"http://api.zippyshare.com/api/mediaplayer/mediaplayer.swf\" flashvars=\"height=20&amp;width=400&amp;file=http://" + url[0] + "/downloadMusic%3Fkey%3D" + url[2] + "%26&amp;volume=80&amp;autostart=false&amp;frontcolor=0x000000&amp;backcolor=0xffffff&amp;lightcolor=0x000000&amp;type=flv\" quality=\"high\" menu=\"false\" wmode=\"transparent\" allowscriptaccess=\"always\" height=\"20\" width=\"400\" name=\"mp3player\" border=\"0\" style=\"margin-bottom: 6px;\"/>";
  }

  function prostoMusic(url) {
    var playerParams = {
      type: "track",
      id: url[2],
      w: 578,
      h: 43
    };
    var type = playerParams.type,
        id = playerParams.id,
        w = playerParams.w,
        h = playerParams.h;


    if (url[1] !== "tracks") {
      type = "list";
      id = url[1].replace(/list/, "");
      w = "100%";
      h = maxH + 80;
    }

    var link = "http://embedpleer.net/" + (type === "track" ? "normal/" + type + "?id=" + id + "&t=grey" : type + "?id=" + id);
    var wH = "width=" + w + " height=" + h;
    return "<object " + wH + "><param name=\"movie\" value=\"" + link + "\"></param><embed src=\"" + link + "\" " + wH + " type=\"application/x-shockwave-flash\"></embed></object>";
  }

  var paragraphsNodeList = document.querySelectorAll(".post-content > *:not(.post-sig)");
  paragraphsNodeList.forEach(function (node) {
    if (node.textContent.includes("[audio]")) {
      var newHtml = node.innerHTML.replace(/\[audio\]/gi, "<div class=\"audio-player\" style=\"display:none;max-height:" + maxH + "px;overflow:hidden;\">").replace(/\[\/audio\]/gi, "</div>");
      node.innerHTML = newHtml;
    }

    node.querySelectorAll(".audio-player").forEach(function (audio) {
      var urlArr = audio.textContent.replace(/http\:\/\//, "").replace(/https\:\/\//, "").split("/");
      var domain = urlArr[0].replace(/^w{3}(?:\S+?\.)/, "");
      var newPlayer = void 0;
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
      audio.innerHTML = newPlayer || '<em style="color:tomato;">Это не та музыка, которую вы ищете!</em>';
      audio.style.display = "block";
    });
  });

  function insertNode(el, hostEl) {
    return hostEl.parentNode.insertBefore(el, hostEl.nextSibling);
  }

  var createBtn = function createBtn() {
    var btn = document.createElement("td");
    btn.id = "button-audio";
    btn.className = "button-audio";
    btn.title = "Музыка в посте";
    btn.innerHTML = '<img src="/i/blank.gif" style="pointer-events:none;">';

    return btn;
  };

  var createPopup = function createPopup() {
    var popup = document.createElement("div");
    popup.className = "container audio-popup";
    popup.id = "audio-area";
    popup.style.display = "none";
    popup.innerHTML = "\n      <label for=\"audio-link-input\" class=\"audio-popup__label\">\n        <strong>\u0412\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443 \u043D\u0430 \u0442\u0440\u0435\u043A \u0441 \u042F\u043D\u0434\u0435\u043A\u0441.\u041C\u0443\u0437\u044B\u043A\u0438, \u041F\u0440\u043E\u0441\u0442\u043E\u043F\u043B\u0435\u0435\u0440\u0430 \u0438\u043B\u0438 zippyshare.com:</strong>\n        <input class=\"audio-popup__input\" type=\"text\" id=\"audio-link-input\" name=\"audio-link-input\" placeholder=\"http://\" />\n      </label>\n      <a href=\"#\" class=\"audio-popup__btn js-audio-link-insert\">\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044C</a>&nbsp;&nbsp;&nbsp;<a href=\"#\" class=\"audio-popup__btn js-audio-link-close\">\u0417\u0430\u043A\u0440\u044B\u0442\u044C</a>\n    ";

    return popup;
  };

  if (document.querySelector("textarea#main-reply") !== null) {
    var addMusic = function addMusic(e) {
      var isVisible = audioPopup.style.display === "block";

      if (e.ctrlKey || e.altKey) {
        if (isVisible) audioPopup.style.display = "none";
        return bbcode("[audio]", "[/audio]");
      }

      audioPopup.style.display = isVisible ? "none" : "block";
      audioPopup.style.zIndex = isVisible ? -1 : 10000;
    };

    var popupBtnActions = function popupBtnActions(e) {
      e.preventDefault();
      audioPopup.style.display = "none";

      var input = document.getElementById("audio-link-input");

      if (e.target === document.querySelector(".js-audio-link-insert")) {
        input.value.trim() === "" ? bbcode("[audio]", "[/audio]") : insert("[audio]" + input.value + "[/audio]");
      }

      return input.value = "";
    };

    var codeBtn = document.getElementById("button-code");
    insertNode(createBtn(), codeBtn);

    var colorDiv = document.querySelector("#post .fs-box.hashelp #color-area");
    insertNode(createPopup(), colorDiv);

    var audioPopup = document.getElementById("audio-area");

    document.getElementById("button-audio").addEventListener("click", addMusic, true);
    document.querySelector(".js-audio-link-insert").addEventListener("click", popupBtnActions, true);
    document.querySelector(".js-audio-link-close").addEventListener("click", popupBtnActions, true);
  }
}();
