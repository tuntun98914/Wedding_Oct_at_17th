const CONFIG = {
  useCurtain: false,

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

/* ── 배경음악 설정 : YouTube BGM ── */
(function () {
  const YOUTUBE_VIDEO_ID = "-hb2tecD13s";

  function createBgmButton() {
    if (document.getElementById("bgmButton")) return;

    const button = document.createElement("button");
    button.id = "bgmButton";
    button.innerText = "BGM ON";
    button.style.position = "fixed";
    button.style.right = "16px";
    button.style.bottom = "16px";
    button.style.zIndex = "99999";
    button.style.padding = "10px 14px";
    button.style.border = "1px solid #ddd";
    button.style.borderRadius = "999px";
    button.style.background = "rgba(255,255,255,0.9)";
    button.style.color = "#333";
    button.style.fontSize = "13px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";

    let isPlaying = false;

    button.addEventListener("click", function () {
      const existingPlayer = document.getElementById("youtubeBgmPlayer");

      if (!isPlaying) {
        if (!existingPlayer) {
          const iframe = document.createElement("iframe");
          iframe.id = "youtubeBgmPlayer";
          iframe.src =
            "https://www.youtube.com/embed/" +
            YOUTUBE_VIDEO_ID +
            "?autoplay=1&loop=1&playlist=" +
            YOUTUBE_VIDEO_ID +
            "&controls=0&modestbranding=1&playsinline=1";

          iframe.allow = "autoplay";
          iframe.style.position = "fixed";
          iframe.style.width = "1px";
          iframe.style.height = "1px";
          iframe.style.left = "-9999px";
          iframe.style.top = "-9999px";
          iframe.style.opacity = "0";
          iframe.style.pointerEvents = "none";

          document.body.appendChild(iframe);
        }

        isPlaying = true;
        button.innerText = "BGM OFF";
      } else {
        if (existingPlayer) {
          existingPlayer.remove();
        }

        isPlaying = false;
        button.innerText = "BGM ON";
      }
    });

    document.body.appendChild(button);
  }

  window.addEventListener("DOMContentLoaded", createBgmButton);
})();

/* ── 기존 위쪽 네모 카카오맵 / 네이버지도 / 카카오톡 공유하기 제거 ── */
(function () {
  function removeUnwantedButtons() {
    const elements = document.querySelectorAll("a, button");

    elements.forEach(function (el) {
      const text = (el.innerText || el.textContent || "").trim();

      const isTopKakaoMapButton = text === "카카오맵";
      const isTopNaverMapButton = text === "네이버지도";
      const isKakaoShareButton = text === "카카오톡으로 공유하기";

      if (isTopKakaoMapButton || isTopNaverMapButton || isKakaoShareButton) {
        el.remove();
      }
    });
  }

  window.addEventListener("DOMContentLoaded", function () {
    removeUnwantedButtons();
    setTimeout(removeUnwantedButtons, 300);
    setTimeout(removeUnwantedButtons, 800);
    setTimeout(removeUnwantedButtons, 1500);
    setTimeout(removeUnwantedButtons, 2500);
  });

  window.addEventListener("load", function () {
    removeUnwantedButtons();

    const observer = new MutationObserver(function () {
      removeUnwantedButtons();
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

  function removeOldExtraButtons() {
    const oldExtraButtons = document.getElementById("extraWeddingButtons");
    if (oldExtraButtons) {
      oldExtraButtons.remove();
    }

    const oldTmapOnly = document.getElementById("tmapOnlySection");
    if (oldTmapOnly) {
      oldTmapOnly.remove();
    }
  }

  function createMapButtons() {
    removeOldExtraButtons();

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