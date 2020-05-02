(function () {

  const imagesList = [
    "images/photo-1.jpg",
    "images/photo-2.jpg",
    "images/photo-3.jpg",
    "images/photo-4.jpg",
    "images/photo-5.jpg",
    "images/photo-6.jpg",
    "images/photo-7.jpg",
    "images/photo-8.jpg",
    "images/photo-9.jpg",
    "images/photo-10.jpg"
  ];

  const gallery = document.querySelector(".js-gallery");
  const progressbar = document.querySelector(".js-progressbar");
  const fragment = document.createDocumentFragment();

  const rootElement = document.documentElement;
  const scrollbarFixTargets = document.querySelectorAll(".js-scrollbarFix");
  let scrollbarFix = false;

  const count = imagesList.length;
  // 完了した数を管理する変数
  let current = 0;

  // `aria-valuemax`の初期化
  function initProgressbar() {
    progressbar.setAttribute("aria-valuemax", count);
  }
  // ローディング画面をDOMから削除する
  function removeProgressbar() {
    const parent = progressbar.parentElement;
    parent.removeChild(progressbar);
  }

  // ローディング画面を非表示に
  function hideProgressbar() {
    progressbar.addEventListener("transitionend", onTransitionendProgressbar, false);
    progressbar.classList.add("hide");
  }

  // ローディング画面の非表示アニメーション終了時のイベントハンドラ
// `removeProgressbar()`を実行する
  function onTransitionendProgressbar(event) {
    if (event.propertyName !== "visibility") {
      return;
    }
    progressbar.removeEventListener("transitionend", onTransitionendProgressbar, false);
    deactivatePreventKeydownTabKey();// タブキー制御解除
    deactivateScrollLock();// スクロール固定解除
    removeProgressbar();
  }

  // 完了した数をインクリメントする
  function updateCount() {
    current = current + 1;
    progressbar.setAttribute("aria-valuenow", current);
    
    if (current === count) {
      // すべてのロードが完了した
      gallery.appendChild(fragment);
      hideProgressbar();
    }
  }

  // ギャラリーアイテムのHTMLを作成し、DocumentFragmentに追加
  function appendImageItem(url) {
    const div = document.createElement("div");
    const img = document.createElement("img");
    div.classList.add("Gallery-item");
    img.classList.add("Gallery-image");
    img.setAttribute("src", url);
    div.appendChild(img);
    fragment.appendChild(div);
  }

  // 画像を1枚ロードする
  function loadImage(url) {
    const img = new Image();
    img.onload = function () {
      appendImageItem(this.src);
      updateCount();
    };
    img.src = url + "?t=" + Date.now();
  }

  // 全ての画像をロードする
  function loadAllImages() {
    imagesList.forEach(function (url) {
      loadImage(url);
    })
  }

  // キー押下時のイベントハンドラ
  // タブキーが押下されたら`preventDefault()`して標準動作を無効にする
  function onKeydownTabKey(event) {
    if (event.key !== "Tab") {
      return;
    }
    event.preventDefault();
  }

  // キー押下時のイベントリスナを追加
  function activatePreventKeydownTabKey() {
    progressbar.addEventListener("keydown", onKeydownTabKey, false);
  }

  // キー押下時のイベントリスナを削除
  function deactivatePreventKeydownTabKey() {
    progressbar.removeEventListener("keydown", onKeydownTabKey, false);
  }

  function onTouchMoveProgressbar(event) {
    if (event.targetTouches.length > 1) {
      return;
    }
    event.preventDefault();
  }

  function activateScrollLock() {
    addScrollbarWidth();
    rootElement.classList.add("scrollLock");
    progressbar.addEventListener("touchmove", onTouchMoveProgressbar, false);
  }

  function deactivateScrollLock() {
    removeScrollbarWidth();
    rootElement.classList.remove("scrollLock");
    progressbar.removeEventListener("touchmove", onTouchMoveProgressbar, false);
  }

  function addScrollbarMargin(value) {
    const targetsLength = scrollbarFixTargets.length;
    for (let i = 0; i < targetsLength; i++) {
      scrollbarFixTargets[i].style.marginRight = value;
    }
  }

  function addScrollbarWidth() {
    const scrollbarWidth = window.innerWidth - rootElement.clientWidth;
    if (!scrollbarWidth) {
      scrollbarFix = false;
      return;
    }
    const value = scrollbarWidth + "px";
    addScrollbarMargin(value);
    scrollbarFix = true;
  }

  function removeScrollbarWidth() {
    if (!scrollbarFix) {
      return;
    }
    addScrollbarMargin("");
  }

  initProgressbar();
  progressbar.focus();
  activatePreventKeydownTabKey();
  activateScrollLock();
  loadAllImages();

})();