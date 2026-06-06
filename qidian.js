// ==UserScript==
// @name         qidian
// @namespace    http://tampermonkey.net/
// @version      2026-06-05
// @description  try to take over the world!
// @author       xwt
// @match        https://www.qidian.com/chapter/*/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qidian.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    window.loop = setInterval(download_chapter, 3000);

})();

function download_chapter() {
    var cid = window.location.href.slice(42, 51);
    var a = document.getElementById(`c-${cid}`);
    if (a == null) {
        a = document.getElementById(`c-${cid}`);
        return;
    }
    var review = a.querySelectorAll('span[class="review"]');
    review.forEach(r => {
        r.remove();
    });
    download(document.title, a.innerText);
    clearInterval(window.loop);
    var next_page = document.getElementsByClassName("nav-btn");
    next_page[next_page.length - 1].click();
}

function download(filename, text) {
    var element = document.createElement('a');
    element.style.display = 'none';
    var content = encodeURIComponent(text);
    element.setAttribute('href', `data:text/plain;charset=utf-8,${content}`);
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
