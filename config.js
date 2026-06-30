const CONFIG = {
  useCurtain: false,

  kakao: {
    jsKey: "ab0589cffa9e45b137dc4959a1d7e8b4",
    shareUrl: "",
    imageUrl: ""
  },

  bgm: {
    /*
      네이버앱까지 안정적으로 소리 나오게 하려면
      청첩장 폴더에 music/bgm.mp3 파일을 넣어야 함.
      없으면 유튜브 BGM으로 재생 시도함.
    */
    mp3Url: "music/bgm.mp3",
    youtubeVideoId: "7iAKkbEWHfA"
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

/* ─────────────────────────────
   공통 유틸
───────────────────────────── */
(function () {
  window.__WEDDING_UTILS__ = {
    getPageUrl: function () {
      if (CONFIG.kakao.shareUrl) return CONFIG.kakao.shareUrl;
      return window.location.origin + window.location.pathname;
    },

    getImageUrl: function () {
      if (CONFIG.kakao.imageUrl) return CONFIG.kakao.imageUrl;

      const ogImage = document.querySelector("meta[property='og:image']");
      if (ogImage && ogImage.content) {
        return new URL(ogImage.content, window.__WEDDING_UTILS__.getPageUrl()).href;
      }

      return new URL("images/hero/4.jpg", window.__WEDDING_UTILS__.getPageUrl()).href;
    },

    normalizeText: function (value) {
      return String(value || "")
        .replace(/\s+/g, "")
        .replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "")
        .trim();
    }
  };
})();

/* ─────────────────────────────
   이전 코드 잔여 요소 정리
───────────────────────────── */
(function () {
  function cleanOldElements() {
    [
      "bgmButton",
      "secretKakaoShareButton",
      "forceHideCalendarStyle",
      "extraWeddingButtons",
      "tmapOnlySection",
      "customMapButtons",
      "customTransportInfo",
      "smallBgmButton",
      "smallKakaoShareButton",
      "weddingStartOverlay",
      "youtubeBgmPlayer"
    ].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  window.addEventListener("DOMContentLoaded", cleanOldElements);
})();

/* ─────────────────────────────
   BGM : 청첩장 열기 클릭 시 재생
───────────────────────────── */
(function () {
  let audio = null;
  let isPlaying = false;

  function updateBgmButton() {
    const button = document.getElementById("smallBgmButton");
    if (!button) return;

    if (isPlaying) {
      button.innerText = "Ⅱ";
      button.style.background = "rgba(254,229,0,0.95)";
    } else {
      button.innerText = "♪";
      button.style.background = "rgba(255,255,255,0.9)";
    }
  }

  function stopBgm() {
    const youtube = document.getElementById("youtubeBgmPlayer");
    if (youtube) youtube.remove();

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    isPlaying = false;
    updateBgmButton();
  }

  function playYoutubeBgm() {
    const existing = document.getElementById("youtubeBgmPlayer");
    if (existing) existing.remove();

    const iframe = document.createElement("iframe");
    iframe.id = "youtubeBgmPlayer";
    iframe.src =
      "https://www.youtube.com/embed/" +
      CONFIG.bgm.youtubeVideoId +
      "?autoplay=1&loop=1&playlist=" +
      CONFIG.bgm.youtubeVideoId +
      "&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1";

    iframe.allow = "autoplay; encrypted-media";
    iframe.style.position = "fixed";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.left = "-9999px";
    iframe.style.top = "-9999px";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    iframe.style.border = "0";

    document.body.appendChild(iframe);
    isPlaying = true;
    updateBgmButton();
  }

  function playBgm() {
    if (!audio) {
      audio = new Audio(CONFIG.bgm.mp3Url);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0.75;
    }

    audio.play()
      .then(function () {
        isPlaying = true;
        updateBgmButton();
      })
      .catch(function () {
        playYoutubeBgm();
      });
  }

  function createSmallBgmButton() {
    if (document.getElementById("smallBgmButton")) return;

    const button = document.createElement("button");
    button.id = "smallBgmButton";
    button.type = "button";
    button.innerText = "♪";

    button.style.position = "fixed";
    button.style.right = "12px";
    button.style.bottom = "12px";
    button.style.zIndex = "999999";
    button.style.width = "34px";
    button.style.height = "34px";
    button.style.border = "1px solid rgba(0,0,0,0.12)";
    button.style.borderRadius = "50%";
    button.style.background = "rgba(255,255,255,0.9)";
    button.style.color = "#333";
    button.style.fontSize = "16px";
    button.style.lineHeight = "1";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 3px 10px rgba(0,0,0,0.12)";
    button.style.opacity = "0.9";

    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (isPlaying) {
        stopBgm();
      } else {
        playBgm();
      }
    });

    document.body.appendChild(button);
    updateBgmButton();
  }

  function createStartOverlay() {
    if (document.getElementById("weddingStartOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "weddingStartOverlay";

    overlay.style.position = "fixed";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "9999999";
    overlay.style.background = "rgba(255,255,255,0.96)";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.textAlign = "center";
    overlay.style.padding = "30px";
    overlay.style.boxSizing = "border-box";

    const title = document.createElement("div");
    title.innerText = `${CONFIG.groom.name} ♥ ${CONFIG.bride.name}`;
    title.style.fontSize = "22px";
    title.style.letterSpacing = "1px";
    title.style.color = "#333";
    title.style.marginBottom = "10px";
    title.style.fontWeight = "500";

    const desc = document.createElement("div");
    desc.innerText = "결혼식에 초대합니다";
    desc.style.fontSize = "14px";
    desc.style.color = "#777";
    desc.style.marginBottom = "28px";

    const button = document.createElement("button");
    button.type = "button";
    button.innerText = "청첩장 열기";

    button.style.width = "180px";
    button.style.height = "46px";
    button.style.border = "1px solid #ddd";
    button.style.borderRadius = "999px";
    button.style.background = "#fff";
    button.style.color = "#333";
    button.style.fontSize = "15px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)";

    button.addEventListener("click", function () {
      createSmallBgmButton();
      playBgm();

      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.35s ease";

      setTimeout(function () {
        overlay.remove();
      }, 350);
    });

    overlay.appendChild(title);
    overlay.appendChild(desc);
    overlay.appendChild(button);
    document.body.appendChild(overlay);
  }

  window.addEventListener("DOMContentLoaded", function () {
    setTimeout(createStartOverlay, 300);
  });

  window.addEventListener("load", function () {
    setTimeout(createStartOverlay, 300);
  });
})();

/* ─────────────────────────────
   카카오톡 공유 + 일정 등록
───────────────────────────── */
(function () {
  function getCalendarUrl() {
    const baseUrl = window.__WEDDING_UTILS__.getPageUrl();
    const separator = baseUrl.indexOf("?") > -1 ? "&" : "?";
    return baseUrl + separator + "calendar=1";
  }

  function formatICSDate(date, time) {
    const cleanDate = date.replace(/-/g, "");
    const cleanTime = time.replace(":", "") + "00";
    return cleanDate + "T" + cleanTime;
  }

  function addHoursToTime(time, hoursToAdd) {
    const parts = time.split(":").map(Number);
    const hour = parts[0] + hoursToAdd;
    const minute = parts[1];
    return String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
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
    const blob = new Blob([createWeddingICS()], {
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
      setTimeout(addWeddingSchedule, 600);
    }
  }

  function loadKakaoSDK(callback) {
    if (window.Kakao && window.Kakao.Share) {
      callback();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
    script.onload = callback;
    script.onerror = function () {
      alert("카카오 SDK 로드 실패");
    };

    document.head.appendChild(script);
  }

  function initKakao() {
    if (!CONFIG.kakao.jsKey) {
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

      const shareUrl = window.__WEDDING_UTILS__.getPageUrl();
      const calendarUrl = getCalendarUrl();
      const imageUrl = window.__WEDDING_UTILS__.getImageUrl();

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
        ],
        fail: function (error) {
          alert(
            "카카오톡 공유 요청 실패\n\n" +
            "1. 카카오 디벨로퍼스에 현재 도메인 등록 필요\n" +
            "2. 등록 도메인: " + window.location.origin + "\n\n" +
            "오류: " + JSON.stringify(error)
          );
        }
      });
    });
  }

  window.__shareWeddingKakao = shareKakaoWedding;

  window.addEventListener("DOMContentLoaded", checkCalendarParam);
})();

/* ─────────────────────────────
   화면에 보이는 불필요 버튼 제거
───────────────────────────── */
(function () {
  function removeUnwantedButtonsOnly() {
    const normalizeText = window.__WEDDING_UTILS__.normalizeText;
    const elements = document.querySelectorAll("a, button, [role='button']");

    elements.forEach(function (el) {
      if (el.id === "smallKakaoShareButton") return;
      if (el.id === "smallBgmButton") return;
      if (el.closest && el.closest("#customMapButtons")) return;
      if (el.closest && el.closest("#weddingStartOverlay")) return;

      const text = normalizeText(el.innerText || el.textContent || "");
      const href = el.getAttribute("href") || "";

      const shouldRemove =
        text === "카카오맵" ||
        text === "네이버지도" ||
        text === "Apple캘린더" ||
        text === "애플캘린더" ||
        text === "Google캘린더" ||
        text === "구글캘린더" ||
        text.includes("Apple캘린더") ||
        text.includes("애플캘린더") ||
        text.includes("Google캘린더") ||
        text.includes("구글캘린더") ||
        text === "카카오톡으로공유하기" ||
        text === "카카오톡공유하기" ||
        href.includes(".ics") ||
        href.startsWith("webcal:") ||
        href.includes("calendar.google.com") ||
        href.includes("google.com/calendar");

      if (shouldRemove) {
        el.remove();
      }
    });

    ["extraWeddingButtons", "tmapOnlySection", "secretKakaoShareButton"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  window.addEventListener("DOMContentLoaded", function () {
    removeUnwantedButtonsOnly();
    setTimeout(removeUnwantedButtonsOnly, 300);
    setTimeout(removeUnwantedButtonsOnly, 800);
    setTimeout(removeUnwantedButtonsOnly, 1500);
  });

  window.addEventListener("load", function () {
    removeUnwantedButtonsOnly();

    const observer = new MutationObserver(removeUnwantedButtonsOnly);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
})();

/* ─────────────────────────────
   오시는 길 상세 안내 추가
───────────────────────────── */
(function () {
  function createTransportTitle(icon, english, korean) {
    const title = document.createElement("div");
    title.style.display = "inline-flex";
    title.style.alignItems = "center";
    title.style.gap = "8px";
    title.style.background = "#f5f3f1";
    title.style.padding = "10px 14px";
    title.style.margin = "22px 0 14px";
    title.style.fontSize = "18px";
    title.style.color = "#4a341f";
    title.style.fontFamily = "serif";

    const iconSpan = document.createElement("span");
    iconSpan.innerText = icon;
    iconSpan.style.fontSize = "20px";

    const textSpan = document.createElement("span");
    textSpan.innerHTML = `${english} <span style="font-family: inherit;">${korean}</span>`;

    title.appendChild(iconSpan);
    title.appendChild(textSpan);

    return title;
  }

  function createBullet(text, color) {
    const li = document.createElement("li");
    li.innerText = text;
    li.style.margin = "7px 0";
    li.style.lineHeight = "1.7";
    li.style.fontSize = "14px";
    li.style.color = color || "#333";
    return li;
  }

  function createTransportInfoElement() {
    const section = document.createElement("section");
    section.id = "customTransportInfo";
    section.style.maxWidth = "520px";
    section.style.margin = "24px auto 28px";
    section.style.padding = "0 20px";
    section.style.textAlign = "left";
    section.style.boxSizing = "border-box";
    section.style.color = "#333";

    const subwayTitle = createTransportTitle("🚇", "Subway", "지하철");
    const subwayList = document.createElement("ul");
    subwayList.style.paddingLeft = "18px";
    subwayList.style.margin = "0 0 14px";
    subwayList.style.listStyleType = "circle";

    subwayList.appendChild(createBullet("셔틀버스 운행 (20분 간격 운행)"));
    subwayList.appendChild(createBullet("※ 도로교통상황에 따라 배차 간격이 길어질 수 있습니다.", "#e53935"));
    subwayList.appendChild(createBullet("인천 2호선 아시아드경기장역 3번출구 앞 승차"));
    subwayList.appendChild(createBullet("※ 공항철도 이용시 : 검암역 하차 ▶ 인천 2호선 환승 ▶ 아시아드경기장역 3번출구 앞 승차"));

    const busTitle = createTransportTitle("🚌", "Bus", "버스");
    const busList = document.createElement("ul");
    busList.style.paddingLeft = "18px";
    busList.style.margin = "0 0 14px";
    busList.style.listStyleType = "circle";

    busList.appendChild(createBullet("우성아파트 [42717] : 24-1, 70, 인천e음86, 111, 111B, 302, 310"));
    busList.appendChild(createBullet("우성아파트 [42718] : 24-1, 70, 595, 인천e음86, 111, 111B, 302, 302B, 308, 310"));
    busList.appendChild(createBullet("인천아시아드주경기장(동문) [89354] : 3-2, 71, 인천e음86"));
    busList.appendChild(createBullet("인천아시아드주경기장(동문) [89359] : 3-2, 71, 인천e음86"));

    const carTitle = createTransportTitle("🚗", "Car", "자가용");
    const carList = document.createElement("ul");
    carList.style.paddingLeft = "18px";
    carList.style.margin = "0";
    carList.style.listStyleType = "circle";

    carList.appendChild(createBullet('네비게이션 : "아시아드웨딩컨벤션" 또는 "염곡로 725" 입력'));
    carList.appendChild(createBullet("주차장 안내 : 인천아시아드주경기장 3번 게이트 앞 주차장 이용"));
    carList.appendChild(createBullet("상담 방문시 3번 게이트 앞 주차장 이용시 웨딩홀과 가장 가깝습니다."));

    section.appendChild(subwayTitle);
    section.appendChild(subwayList);
    section.appendChild(busTitle);
    section.appendChild(busList);
    section.appendChild(carTitle);
    section.appendChild(carList);

    return section;
  }

  function findLocationSection() {
    const candidates = Array.from(document.querySelectorAll("section, div, article"));

    const matched = candidates.find(function (el) {
      const text = el.innerText || el.textContent || "";
      return (
        text.includes("오시는 길") ||
        text.includes(CONFIG.wedding.address) ||
        text.includes(CONFIG.wedding.tel)
      );
    });

    return matched || document.body;
  }

  function findTelAnchor(locationSection) {
    const elements = Array.from(locationSection.querySelectorAll("*"));

    const telElement = elements.find(function (el) {
      const text = el.innerText || el.textContent || "";
      return text.includes(CONFIG.wedding.tel);
    });

    if (!telElement) return null;

    let anchor = telElement;

    for (let i = 0; i < 4; i++) {
      if (!anchor.parentElement || anchor.parentElement === locationSection) break;

      const parentText = anchor.parentElement.innerText || anchor.parentElement.textContent || "";

      if (parentText.includes(CONFIG.wedding.tel) && parentText.length < 400) {
        anchor = anchor.parentElement;
      } else {
        break;
      }
    }

    return anchor;
  }

  function createTransportInfo() {
    const old = document.getElementById("customTransportInfo");
    if (old) old.remove();

    const section = createTransportInfoElement();
    const locationSection = findLocationSection();
    const telAnchor = findTelAnchor(locationSection);

    if (telAnchor && telAnchor.parentElement) {
      telAnchor.insertAdjacentElement("afterend", section);
      return;
    }

    const mapImage = locationSection.querySelector("img");

    if (mapImage) {
      mapImage.insertAdjacentElement("beforebegin", section);
    } else {
      locationSection.appendChild(section);
    }
  }

  window.addEventListener("DOMContentLoaded", function () {
    setTimeout(createTransportInfo, 700);
    setTimeout(createTransportInfo, 1500);
    setTimeout(createTransportInfo, 3000);
  });

  window.addEventListener("load", function () {
    setTimeout(createTransportInfo, 700);

    const observer = new MutationObserver(function () {
      if (!document.getElementById("customTransportInfo")) {
        createTransportInfo();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
})();

/* ─────────────────────────────
   길찾기 버튼 추가
───────────────────────────── */
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

  function createMapButtons() {
    const old = document.getElementById("customMapButtons");
    if (old) old.remove();

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

    section.appendChild(title);

    section.appendChild(createButton("카카오맵으로 보기", function () {
      window.open(CONFIG.wedding.mapLinks.kakao, "_blank");
    }));

    section.appendChild(createButton("네이버지도 보기", function () {
      window.open(CONFIG.wedding.mapLinks.naver, "_blank");
    }));

    section.appendChild(createButton("티맵 길안내", openTmap));

    const locationSection =
      document.querySelector("#location") ||
      document.querySelector(".location") ||
      document.querySelector("[data-section='location']") ||
      document.querySelector(".map") ||
      document.querySelector("#map") ||
      document.body;

    locationSection.appendChild(section);
  }

  window.addEventListener("DOMContentLoaded", function () {
    setTimeout(createMapButtons, 1200);
  });

  window.addEventListener("load", function () {
    setTimeout(createMapButtons, 1200);
  });
})();

/* ─────────────────────────────
   작은 카카오톡 공유 버튼
───────────────────────────── */
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
    button.style.opacity = "0.9";

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