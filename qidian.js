// ==UserScript==
// @name         qidian
// @namespace    http://tampermonkey.net/
// @version      2026-06-05
// @description  try to take over the world!
// @author       xwt
// @match        https://www.qidian.com/chapter/*/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qidian.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    window.loop = setInterval(download_chapter, 3000);

})();

function download_chapter() {
    var re = new RegExp('https://www.qidian.com/chapter/(\\d+)/(\\d+)/');
    var cid = re.exec(window.location.href)[2];
    var a = document.getElementById(`c-${cid}`);
    if (a == null) {
        a = document.getElementById(`c-${cid}`);
        return;
    }
    var review = a.querySelectorAll('span[class="review"]');
    review.forEach(r => {
        r.remove();
    });
    var bid = re.exec(window.location.href)[1];
    var count_key = `qidian_bid_${bid}`;
    var count = GM_getValue(count_key, 1);
    download(`_${count}_${document.title}`, a.innerText);
    GM_setValue(count_key, count + 1);
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
