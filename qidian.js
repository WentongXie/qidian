// ==UserScript==
// @name         qidian
// @namespace    http://tampermonkey.net/
// @version      2026-06-05
// @description  download chapter from qidian.com
// @author       xwt
// @match        https://www.qidian.com/book/*/
// @match        https://www.qidian.com/chapter/*/*/
// @match        https://www.qidian.com/lastpage/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qidian.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    var bidPageRe = /^https:\/\/www\.qidian\.com\/book\/(\d+)\/$/;
    var match = bidPageRe.exec(window.location.href);
    if (match) {
        initBidInput(match);
        return;
    }
    var chapter_re = new RegExp('https://www.qidian.com/chapter/(\\d+)/(\\d+)/');
    match = chapter_re.exec(window.location.href);
    if (match) {
        var bid = match[1];
        var enableKey = `qidian_bid_download_enable_${bid}`;
        var enabled = GM_getValue(enableKey, false);
        if (enabled) {
            window.loop = setInterval(download_chapter, 3000, match);
        }
        return;
    }
    var lastpage_re = new RegExp('https://www.qidian.com/lastpage/(\\d+)/');
    match = lastpage_re.exec(window.location.href);
    if (match) {
        var bid = match[1];
        var enableKey = `qidian_bid_download_enable_${bid}`;
        GM_setValue(enableKey, false);
        clearInterval(window.loop);
        return;
    }

})();

function initBidInput(match) {
    var bid = match[1];
    var countKey = `qidian_bid_${bid}`;
    var enableKey = `qidian_bid_download_enable_${bid}`;
    var value = GM_getValue(countKey, 1);
    var enabled = GM_getValue(enableKey, false);

    var container = document.createElement('div');
    container.id = 'qidian-bid-input';
    container.style.cssText = 'position:fixed;right:16px;top:80px;z-index:9999;background:#fff;border:1px solid #ccc;padding:10px 12px;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,0.18);font-size:13px;color:#333;min-width:220px;';
    container.innerHTML = `
        <div style="margin-bottom:8px;font-weight:600;">设置 qidian_bid_${bid}</div>
        <label style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-size:13px;color:#333;">
            <span>自动下载启用</span>
            <input id="qidian-bid-enable" type="checkbox" style="width:auto;height:auto;" ${enabled ? 'checked' : ''}>
        </label>
        <input id="qidian-bid-value" type="number" min="1" step="1" value="${value}" style="width:100%;padding:6px 8px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;margin-bottom:8px;">
        <button id="qidian-bid-save" style="width:100%;padding:7px 0;background:#2d8cf0;color:#fff;border:none;border-radius:4px;cursor:pointer;">保存</button>
        <div id="qidian-bid-status" style="margin-top:8px;font-size:12px;color:#666;"></div>
    `;

    document.body.appendChild(container);

    var input = container.querySelector('#qidian-bid-value');
    var enableInput = container.querySelector('#qidian-bid-enable');
    var status = container.querySelector('#qidian-bid-status');
    var button = container.querySelector('#qidian-bid-save');

    button.addEventListener('click', function () {
        var newValue = parseInt(input.value, 10);
        if (!Number.isFinite(newValue) || newValue < 1) {
            status.textContent = '请输入大于 0 的整数。';
            return;
        }
        GM_setValue(countKey, newValue);
        GM_setValue(enableKey, enableInput.checked);
        status.textContent = `已保存当前值：${newValue}，下载已${enableInput.checked ? '启用' : '禁用'}`;
    });
}

function download_chapter(match) {
    var bid = match[1];
    var cid = match[2];
    var a = document.getElementById(`c-${cid}`);
    if (a == null) {
        return;
    }
    var review = a.querySelectorAll('span[class="review"]');
    review.forEach(r => {
        r.remove();
    });
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
