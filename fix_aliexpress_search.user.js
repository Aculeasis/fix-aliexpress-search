// ==UserScript==
// @name        Fix AliExpress Search
// @namespace   https://github.com/Aculeasis/fix-aliexpress-search
// @description Удаляет реферальный ключ из куки, который ставят все кому не лень. Ключ ломает поиск. Отключить скрипт и обновить страницу перед использованием кэшбек-сервисов.
// @author      Aculeasis
// @version     0.1.0
// @grant       none
// @include     *.aliexpress.com/*
// @run-at      document-start
// ==/UserScript==

function getCookie(c_name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + c_name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? matches[1] : undefined;
}

function setCookie(c_name, value) {
  // Ставим все атрибуты куки - иначе через js нельзя.
  var domain = ".aliexpress.com";
  var date = new Date();
  date.setDate(date.getDate() + 365);
  var expires = date.toUTCString();

  document.cookie = c_name + "=" + value + "; expires=" + expires + "; domain=" + domain + "; path=/";
}

function CookieToArray(cookie) {
  // Без decode\encode - нам плевать что там. 
  var request = {};
  var pairs = cookie.split('&');
  for (var i = 0; i < pairs.length; i++) {
    if(!pairs[i])
      continue;
    var pair = pairs[i].split('=');
    request[pair[0]] = pair[1];
  }
  return request;
}

function ArrayToCookie(array) {
  var pairs = [];
  for (var key in array)
    if (array.hasOwnProperty(key))
      pairs.push(key + '=' + array[key]);
  return pairs.join('&');
}

(function (){
  // Искомая кука. Если ее просто удалить то али сломается - начнет спамить баннером до релога.
  var c_name = "xman_us_f";
  // Реферальный ключ ломающий поиск! Надеюсь он такой один.
  var fucking_key = "x_as_i";

  var data = getCookie(c_name);
  if (data === undefined) {
    return;
  }

  data = CookieToArray(data);
  if (data[fucking_key] === undefined) { 
    return;
  }

  delete data[fucking_key]
  data = ArrayToCookie(data); 
  setCookie(c_name, data);
})();
