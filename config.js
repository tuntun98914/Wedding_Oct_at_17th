const CONFIG = {
  useCurtain: false,

  kakao: {
    jsKey: "ab0589cffa9e45b137dc4959a1d7e8b4",
    shareUrl: "",
    imageUrl: ""
  },

  groom: {
    name: "조승우",
    father: "조윤재",
    mother: "김향숙",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "이수민",
    father: "이시운",
    mother: "서형민",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-10-17",
    time: "18:00",
    venue: "아시아드 웨딩컨벤션, 인천",
    hall: "비아벨라홀",
    address: "인천광역시 서구 염곡로 725",
    tel: "032-765-6000",
    mapLinks: {
      kakao: "https://place.map.kakao.com/1055358838",
      naver: "https://naver.me/Fw7iZcaK",
      tmap: "tmap://route?goalname=%EC%95%84%EC%8B%9C%EC%95%84%EB%93%9C%20%EC%9B%A8%EB%94%A9%EC%BB%A8%EB%B2%A4%EC%85%98%20%EB%B9%84%EC%95%84%EB%B2%A8%EB%9D%BC%ED%99%80&goalx=126.6671712&goaly=37.5490036"
    }
  },

  greeting: {
    title: "소중한 분들을 초대합니다",
    content: "함께 있을 때 가장 편안한 사람을 만나\n이제 평생을 약속하려 합니다.\n\n저희의 새로운 시작에 함께해 주시면\n더없이 감사하겠습니다."
  },

  story: {
    title: "우리의 이야기",
    content: "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n여러분을 소중한 자리에 초대합니다."
  },

  accounts: {
    groom: [
      { role: "신랑", name: "조승우", bank: "카카오뱅크", number: "3333-23-7991081" }
    ],
    bride: [
      { role: "신부", name: "이수민", bank: "카카오뱅크", number: "3333-07-7885976" }
    ]
  },

  meta: {
    title: "조승우 ♥ 이수민 결혼합니다",
    description: "2026년 10월 17일, 소중한 분들을 초대합니다."
  }
};

/* ── 이전 코드 잔여 버튼/스타일 정리 ── */
(function () {
  function cleanOldElements() {
    const ids = [
      "bgmButton",
      "secretKakaoShareButton",
      "forceHideCalendarStyle",
      "extraWeddingButtons",
      "tmapOnlySection"
    ];

    ids.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    const hiddenByOldCode = document.querySelectorAll('[hidden][aria-hidden="true"]');

    hiddenByOldCode.forEach(function (el) {
      const text = (el.innerText || el.textContent || "").replace(/\s+/g, "").trim();

      const shouldStayHidden =
        text === "Apple캘린더" ||
        text === "애플캘린더" ||
        text === "Google캘린더" ||
        text === "구글캘린더";

      if (!shouldStayHidden) {
        el.removeAttribute("hidden");
        el.removeAttribute("aria-hidden");
        el.style.removeProperty("display");
        el.style.removeProperty("visibility");
        el.style.removeProperty("opacity");
        el.style.removeProperty("height");
        el.style.removeProperty("min-height");
        el.style.removeProperty("padding");
        el.style.removeProperty("margin");
        el.style.removeProperty("border");
        el.style.removeProperty("overflow");
      }
    });
  }

  window.addEventListener("DOMContentLoaded", cleanOldElements);
  window.addEventListener("load", cleanOldElements);
})();

/* ── BGM 자동 재생 : YouTube ── */
(function () {
  const YOUTUBE_VIDEO_ID = "7iAKkbEWHfA";
  let userGestureTried = false;

  function removeOldBgmButton() {
    const oldButton = document.getElementById("bgmButton");
    if (oldButton) oldButton.remove();
  }

  function createYoutubeBgmPlayer(forceRestart) {
    removeOldBgmButton();

    const existingPlayer = document.getElementById("youtubeBgmPlayer");

    if (existingPlayer && forceRestart) {
      existingPlayer.remove();
    } else if (existingPlayer) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.id = "youtubeBgmPlayer";
    iframe.src =
      "https://www.youtube.com/embed/" +
      YOUTUBE_VIDEO_ID +
      "?autoplay=1&loop=1&playlist=" +
      YOUTUBE_VIDEO_ID +
      "&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1";

    iframe.allow = "autoplay; encrypted-media";
    iframe.setAttribute("allowfullscreen", "false");

    iframe.style.position = "fixed";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.left = "-9999px";
    iframe.style.top = "-9999px";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    iframe.style.border = "0";

    document.body.appendChild(iframe);
  }

  function startBgmAuto() {
    createYoutubeBgmPlayer(false);
  }

  function startBgmByFirstAction() {
    if (userGestureTried) return;
    userGestureTried = true;
    createYoutubeBgmPlayer(true);
  }

  window.addEventListener("DOMContentLoaded", function () {
    removeOldBgmButton();
    setTimeout(startBgmAuto, 300);
    setTimeout(startBgmAuto, 1000);
  });

  window.addEventListener("load", function () {
    removeOldBgmButton();
    setTimeout(startBgmAuto, 300);
  });

  document.addEventListener("click", startBgmByFirstAction, { once: true });
  document.addEventListener("touchstart", startBgmByFirstAction, { once: true });
  document.addEventListener("scroll", startBgmByFirstAction, { once: true });
})();

/* ── 카카오톡 공유 메시지 + 일정 등록 기능 ── */
(function () {
  function getBaseShareUrl() {
    if (CONFIG.kakao && CONFIG.kakao.shareUrl) {
      return CONFIG.kakao.shareUrl;
    }

    return window.location.origin + window.location.pathname;
  }

  function getCalendarUrl() {
    const baseUrl = getBaseShareUrl();
    const separator = baseUrl.indexOf("?") > -1 ? "&" : "?";
    return baseUrl + separator + "calendar=1";
  }

  function getShareImageUrl() {
    if (CONFIG.kakao && CONFIG.kakao.imageUrl) {
      return CONFIG.kakao.imageUrl;
    }

    const ogImage = document.querySelector("meta[property='og:image']");
    if (ogImage && ogImage.content) {
      return new URL(ogImage.content, getBaseShareUrl()).href;
    }

    return new URL("images/hero/4.jpg", getBaseShareUrl()).href;
  }

  function formatICSDate(date, time) {
    const cleanDate = date.replace(/-/g, "");
    const cleanTime = time.replace(":", "") + "00";
    return cleanDate + "T" + cleanTime;
  }

  function addHoursToTime(time, hoursToAdd) {
    const [hour, minute] = time.split(":").map(Number);
    const newHour = hour + hoursToAdd;

    return String(newHour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
  }

  function escapeICS(text) {
    return String(text || "")
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  function createWeddingICS() {
    const title = `${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 결혼식`;
    const location = `${CONFIG.wedding.venue} ${CONFIG.wedding.hall}, ${CONFIG.wedding.address}`;
    const startDateTime = formatICSDate(CONFIG.wedding.date, CONFIG.wedding.time);
    const endDateTime = formatICSDate(CONFIG.wedding.date, addHoursToTime(CONFIG.wedding.time, 2));

    const description =
      `${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 결혼식\n` +
      `일시: ${CONFIG.wedding.date} ${CONFIG.wedding.time}\n` +
      `장소: ${CONFIG.wedding.venue} ${CONFIG.wedding.hall}\n` +
      `주소: ${CONFIG.wedding.address}\n` +
      `연락처: ${CONFIG.wedding.tel}`;

    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Invitation//KO",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VTIMEZONE",
      "TZID:Asia/Seoul",
      "BEGIN:STANDARD",
      "DTSTART:19700101T000000",
      "TZOFFSETFROM:+0900",
      "TZOFFSETTO:+0900",
      "TZNAME:KST",
      "END:STANDARD",
      "END:VTIMEZONE",
      "BEGIN:VEVENT",
      `UID:wedding-${CONFIG.wedding.date}-${CONFIG.groom.name}-${CONFIG.bride.name}@wedding`,
      `DTSTART;TZID=Asia/Seoul:${startDateTime}`,
      `DTEND;TZID=Asia/Seoul:${endDateTime}`,
      `SUMMARY:${escapeICS(title)}`,
      `LOCATION:${escapeICS(location)}`,
      `DESCRIPTION:${escapeICS(description)}`,
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeICS("내일 결혼식이 있습니다.")}`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
  }

  function addWeddingSchedule() {
    const icsContent = createWeddingICS();

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const fileName = `${CONFIG.groom.name}-${CONFIG.bride.name}-결혼식.ics`;

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 3000);
  }

  function checkCalendarParam() {
    const params = new URLSearchParams(window.location.search);

    if (params.get("calendar") === "1") {
      setTimeout(function () {
        addWeddingSchedule();
      }, 600);
    }
  }

  function loadKakaoSDK(callback) {
    if (window.Kakao) {
      callback();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
    script.onload = callback;
    script.onerror = function () {
      alert("카카오톡 공유 기능을 불러오지 못했습니다.");
    };

    document.head.appendChild(script);
  }

  function initKakao() {
    if (!CONFIG.kakao || !CONFIG.kakao.jsKey) {
      alert("카카오 JavaScript 키가 없습니다.");
      return false;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(CONFIG.kakao.jsKey);
    }

    return true;
  }

  function shareKakaoWedding() {
    loadKakaoSDK(function () {
      if (!initKakao()) return;

      const shareUrl = getBaseShareUrl();
      const calendarUrl = getCalendarUrl();
      const imageUrl = getShareImageUrl();

      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 결혼합니다.`,
          description: `2026년 10월 17일 토요일 오후 6시 · ${CONFIG.wedding.venue} ${CONFIG.wedding.hall}`,
          imageUrl: imageUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl
          }
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl
            }
          },
          {
            title: "일정 등록하기",
            link: {
              mobileWebUrl: calendarUrl,
              webUrl: calendarUrl
            }
          }
        ]
      });
    });
  }

  window.__shareWeddingKakao = shareKakaoWedding;

  window.addEventListener("DOMContentLoaded", checkCalendarParam);
})();

/* ── 화면에 보이는 불필요 버튼만 제거 ── */
(function () {
  function normalizeText(value) {
    return String(value || "")
      .replace(/\s+/g, "")
      .replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "")
      .trim();
  }

  function removeUnwantedButtonsOnly() {
    const elements = document.querySelectorAll("a, button, [role='button']");

    elements.forEach(function (el) {
      if (el.id === "smallKakaoShareButton") return;
      if (el.closest && el.closest("#customMapButtons")) return;

      const text = normalizeText(el.innerText || el.textContent || "");
      const href = el.getAttribute("href") || "";

      const isOldTopKakaoMap = text === "카카오맵";
      const isOldTopNaverMap = text === "네이버지도";

      const isOldKakaoShare =
        text === "카카오톡으로공유하기" ||
        text === "카카오톡공유하기" ||
        text === "카카오톡으로청첩장보내기";

      const isAppleCalendar =
        text === "Apple캘린더" ||
        text === "애플캘린더" ||
        text.includes("Apple캘린더") ||
        text.includes("애플캘린더");

      const isGoogleCalendar =
        text === "Google캘린더" ||
        text === "구글캘린더" ||
        text.includes("Google캘린더") ||
        text.includes("구글캘린더");

      const isCalendarLink =
        href.includes(".ics") ||
        href.startsWith("webcal:") ||
        href.includes("calendar.google.com") ||
        href.includes("google.com/calendar");

      const shouldRemove =
        isOldTopKakaoMap ||
        isOldTopNaverMap ||
        isOldKakaoShare ||
        isAppleCalendar ||
        isGoogleCalendar ||
        isCalendarLink;

      if (shouldRemove) {
        el.remove();
      }
    });

    const oldExtraButtons = document.getElementById("extraWeddingButtons");
    if (oldExtraButtons) oldExtraButtons.remove();

    const oldTmapOnly = document.getElementById("tmapOnlySection");
    if (oldTmapOnly) oldTmapOnly.remove();

    const oldSecret = document.getElementById("secretKakaoShareButton");
    if (oldSecret) oldSecret.remove();
  }

  window.addEventListener("DOMContentLoaded", function () {
    removeUnwantedButtonsOnly();
    setTimeout(removeUnwantedButtonsOnly, 300);
    setTimeout(removeUnwantedButtonsOnly, 800);
    setTimeout(removeUnwantedButtonsOnly, 1500);
    setTimeout(removeUnwantedButtonsOnly, 2500);
  });

  window.addEventListener("load", function () {
    removeUnwantedButtonsOnly();

    const observer = new MutationObserver(function () {
      removeUnwantedButtonsOnly();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
})();

/* ── 길찾기 버튼 추가 : 카카오맵 / 네이버지도 / 티맵 ── */
(function () {
  const TMAP_ANDROID_STORE = "https://play.google.com/store/apps/details?id=com.skt.tmap.ku";
  const TMAP_IOS_STORE = "https://apps.apple.com/kr/app/id431589174";

  function openTmap() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (!isMobile) {
      alert("티맵 길안내는 모바일에서 이용 가능합니다.");
      return;
    }

    const before = Date.now();

    window.location.href = CONFIG.wedding.mapLinks.tmap;

    setTimeout(function () {
      const elapsed = Date.now() - before;

      if (elapsed < 2200) {
        if (/Android/i.test(navigator.userAgent)) {
          window.location.href = TMAP_ANDROID_STORE;
        } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.href = TMAP_IOS_STORE;
        }
      }
    }, 1500);
  }

  function createButton(text, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.innerText = text;

    button.style.width = "100%";
    button.style.maxWidth = "320px";
    button.style.margin = "8px auto";
    button.style.padding = "13px 16px";
    button.style.border = "1px solid #ddd";
    button.style.borderRadius = "999px";
    button.style.background = "#fff";
    button.style.color = "#333";
    button.style.fontSize = "14px";
    button.style.cursor = "pointer";
    button.style.display = "block";
    button.style.boxShadow = "0 3px 10px rgba(0,0,0,0.06)";

    button.addEventListener("click", onClick);

    return button;
  }

  function removeOldCustomMapButtons() {
    const oldCustomMapButtons = document.getElementById("customMapButtons");
    if (oldCustomMapButtons) {
      oldCustomMapButtons.remove();
    }
  }

  function createMapButtons() {
    removeOldCustomMapButtons();

    if (document.getElementById("customMapButtons")) return;

    const section = document.createElement("section");
    section.id = "customMapButtons";
    section.style.padding = "24px 20px 32px";
    section.style.textAlign = "center";

    const title = document.createElement("h3");
    title.innerText = "길찾기";
    title.style.margin = "0 0 16px";
    title.style.fontSize = "18px";
    title.style.fontWeight = "600";
    title.style.color = "#333";

    const kakaoMapButton = createButton("카카오맵으로 보기", function () {
      window.open(CONFIG.wedding.mapLinks.kakao, "_blank");
    });

    const naverMapButton = createButton("네이버지도 보기", function () {
      window.open(CONFIG.wedding.mapLinks.naver, "_blank");
    });

    const tmapButton = createButton("티맵 길안내", openTmap);

    section.appendChild(title);
    section.appendChild(kakaoMapButton);
    section.appendChild(naverMapButton);
    section.appendChild(tmapButton);

    const locationSection =
      document.querySelector("#location") ||
      document.querySelector(".location") ||
      document.querySelector("[data-section='location']") ||
      document.querySelector(".map") ||
      document.querySelector("#map");

    if (locationSection) {
      locationSection.appendChild(section);
    } else {
      document.body.appendChild(section);
    }
  }

  window.addEventListener("DOMContentLoaded", function () {
    setTimeout(createMapButtons, 500);
  });

  window.addEventListener("load", function () {
    setTimeout(createMapButtons, 500);
  });
})();

/* ── 작은 카카오톡 공유 버튼 ── */
(function () {
  function createSmallKakaoShareButton() {
    if (document.getElementById("smallKakaoShareButton")) return;

    const button = document.createElement("button");
    button.id = "smallKakaoShareButton";
    button.type = "button";
    button.innerText = "카톡 공유";

    button.style.position = "fixed";
    button.style.left = "12px";
    button.style.bottom = "12px";
    button.style.zIndex = "999999";
    button.style.padding = "7px 10px";
    button.style.border = "1px solid rgba(0,0,0,0.08)";
    button.style.borderRadius = "999px";
    button.style.background = "rgba(254,229,0,0.92)";
    button.style.color = "#222";
    button.style.fontSize = "11px";
    button.style.fontWeight = "500";
    button.style.lineHeight = "1";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 3px 10px rgba(0,0,0,0.12)";
    button.style.opacity = "0.85";

    button.addEventListener("click", function () {
      if (typeof window.__shareWeddingKakao === "function") {
        window.__shareWeddingKakao();
      } else {
        alert("카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 눌러주세요.");
      }
    });

    document.body.appendChild(button);
  }

  window.addEventListener("DOMContentLoaded", createSmallKakaoShareButton);
  window.addEventListener("load", createSmallKakaoShareButton);
})();