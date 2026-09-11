(() => {
  "use strict";

  const DOW = ["일", "월", "화", "수", "목", "금", "토"];

  /* =========================================================
     1. Data Synchronization (LocalStorage <-> Admin <-> Index)
     ========================================================= */
  const DEFAULT_PERFORMANCES = [
    { id: "perf_001", title: "르 그랑 클라비어 — 거장의 대화", startDate: "2026-10-15", endDate: "2026-10-15", location: "대전예술의전당 아트홀 · 1회 (19:30)", description: "피움 기획의 대표 클래식 시리즈! 바이올린, 첼로, 피아노가 어우러지는 감성 실내악 콘서트입니다.", posterUrl: "img/poster/poster_001.jpg", status: "upcoming", openDate: "2026-09-01 10:00", ticketStatus: "예매중", ticketUrl: "https://tickets.interpark.com" },
    { id: "perf_002", title: "더 테너스 콘서트 — 맛집 앙상블", startDate: "2026-10-22", endDate: "2026-10-22", location: "유성선병원 김인홀 · 1회 (19:00)", description: "국내 최정상 테너 4인이 선사하는 웅장한 가곡과 하모니의 밤.", posterUrl: "img/poster/poster_002.jpg", status: "upcoming", openDate: "2026-09-10 14:00", ticketStatus: "예매중", ticketUrl: "https://tickets.interpark.com" },
    { id: "perf_003", title: "인디 락 챔버 오케스트라 레이블 패밀리", startDate: "2026-10-28", endDate: "2026-10-29", location: "대전시립연정국악원 큰마당 · 2회", description: "클래식 오케스트라와 인디 락의 하모니 콜라보레이션 연주회.", posterUrl: "img/poster/poster_003.jpg", status: "upcoming", openDate: "2026-09-20 10:00", ticketStatus: "예매예정", ticketUrl: "https://tickets.interpark.com" },
    { id: "perf_004", title: "시티 팝 앤 재즈 퀸텟 라이브", startDate: "2026-09-01", endDate: "2026-09-15", location: "유성 문화예술 쉼터 · 3회", description: "도심 속에서 즐기는 감성적인 시티팝과 로맨틱 재즈 퀸텟 파티.", posterUrl: "img/poster/poster_004.jpg", status: "ongoing", openDate: "2026-08-01 10:00", ticketStatus: "예매중", ticketUrl: "https://tickets.interpark.com" },
    { id: "perf_005", title: "2026 피움 썸머 체임버 뮤직 페스티벌", startDate: "2026-07-10", endDate: "2026-07-12", location: "대전예술의전당 앙상블홀", description: "여름밤을 수놓은 실내악 거장들의 명품 페스티벌.", posterUrl: "img/poster/poster_005.jpg", status: "ended", openDate: "2026-06-01 10:00", ticketStatus: "마감", ticketUrl: "https://tickets.interpark.com" }
  ];

  function loadEventsFromStorage() {
    let rawList = [];
    try {
      const stored = localStorage.getItem("pium_admin_performances");
      if (stored) {
        rawList = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("LocalStorage load error, fallback to default", e);
    }

    if (!Array.isArray(rawList) || rawList.length === 0) {
      rawList = DEFAULT_PERFORMANCES;
      try {
        localStorage.setItem("pium_admin_performances", JSON.stringify(rawList));
      } catch (e) {}
    }

    const ticketMap = { "예매중": "live", "예매예정": "soon", "마감": "ended" };
    const statusMap = { "upcoming": "upcoming", "ongoing": "upcoming", "ended": "past" };

    return rawList.map((p, index) => {
      const dateStr = p.startDate || "2026-10-01";
      let timeStr = "19:00";
      let venueStr = p.location || "대전예술의전당";

      if (p.location && p.location.includes("·")) {
        const parts = p.location.split("·");
        venueStr = parts[0].trim();
        timeStr = parts.slice(1).join("·").trim();
      }

      let posterPath = p.posterUrl || `img/poster/poster_${String((index % 20) + 1).padStart(3, "0")}.jpg`;

      return {
        id: p.id || `perf_${index}`,
        date: dateStr,
        title: p.title,
        time: timeStr,
        venue: venueStr,
        status: statusMap[p.status] || "upcoming",
        ticket: ticketMap[p.ticketStatus] || "live",
        poster: posterPath,
        description: p.description || "",
        ticketUrl: p.ticketUrl || "https://tickets.interpark.com",
        rawStatus: p.status,
        rawTicketStatus: p.ticketStatus
      };
    });
  }

  const EVENTS = loadEventsFromStorage();

  /* =========================================================
     1-B. Hero 3-Column Poster Showcase (Auto-scroll Animation)
     ========================================================= */
  (function initPosterShowcase() {
    const showcase = document.getElementById("heroPosterShowcase");
    const colLeft   = document.getElementById("posterColLeft");
    const colCenter = document.getElementById("posterColCenter");
    const colRight  = document.getElementById("posterColRight");
    if (!showcase || !colLeft || !colCenter || !colRight) return;

    // img/poster/ 폴더 고정 이미지만 사용 (관리자 등록 공연 제외)
    const allPosters = [
      "img/poster/poster_001.jpg",
      "img/poster/poster_002.jpg",
      "img/poster/poster_003.jpg",
      "img/poster/poster_004.jpg",
      "img/poster/poster_005.jpg",
      "img/poster/poster_006.jpg",
      "img/poster/poster_007.jpg",
      "img/poster/poster_008.jpg",
      "img/poster/poster_009.jpg",
      "img/poster/poster_010.jpg",
      "img/poster/poster_011.jpg",
      "img/poster/poster_012.jpg",
      "img/poster/poster_013.jpg",
      "img/poster/poster_014.jpg",
      "img/poster/poster_015.jpg",
      "img/poster/poster_016.jpg",
      "img/poster/poster_020.jpg"
    ];

    // Distribute posters across 3 columns
    const colA = [], colB = [], colC = [];
    allPosters.forEach((src, i) => {
      if (i % 3 === 0) colA.push(src);
      else if (i % 3 === 1) colB.push(src);
      else colC.push(src);
    });

    // Ensure minimum 4 per column by cycling
    function padCol(arr) {
      const min = 5;
      while (arr.length < min) arr.push(...arr);
      return arr;
    }

    function buildTrack(col, posters, altDir) {
      const track = document.createElement("div");
      track.className = "col-track";

      // Duplicate for seamless loop
      const doubled = [...posters, ...posters];
      doubled.forEach(src => {
        const card = document.createElement("div");
        card.className = "poster-card";
        card.setAttribute("role", "img");
        card.setAttribute("aria-label", "공연 포스터");

        const img = document.createElement("img");
        img.src = src;
        img.alt = "공연 포스터";
        img.loading = "lazy";
        img.decoding = "async";

        card.appendChild(img);
        track.appendChild(card);
      });

      col.appendChild(track);
      return track;
    }

    const trackLeft   = buildTrack(colLeft,   padCol([...colA]), false);
    const trackCenter = buildTrack(colCenter,  padCol([...colB]), true);
    const trackRight  = buildTrack(colRight,   padCol([...colC]), false);

    // Animation state
    const SPEED = 0.45; // px per frame
    let posLeft   = 0;
    let posCenter = 0;
    let posRight  = 0;
    let paused = false;
    let rafId = null;

    function getTrackHeight(track) {
      const cards = track.children;
      if (!cards.length) return 0;
      // Height of ONE set = half the total children
      const half = Math.floor(cards.length / 2);
      let h = 0;
      for (let i = 0; i < half; i++) {
        const rect = cards[i].getBoundingClientRect();
        h += rect.height + 14; // 14px gap
      }
      return h;
    }

    function animate() {
      if (!paused) {
        posLeft   += SPEED;
        posCenter += SPEED;  // 가운데는 반대 방향(아래로)
        posRight  += SPEED;

        const hL = getTrackHeight(trackLeft);
        const hC = getTrackHeight(trackCenter);
        const hR = getTrackHeight(trackRight);

        if (hL > 0 && posLeft   >= hL) posLeft   -= hL;
        if (hC > 0 && posCenter >= hC) posCenter -= hC;  // 루프 리셋
        if (hR > 0 && posRight  >= hR) posRight  -= hR;

        trackLeft.style.transform   = `translateY(-${posLeft}px)`;          // 위로↑
        trackCenter.style.transform = `translateY(${posCenter - hC}px)`;    // 아래로↓
        trackRight.style.transform  = `translateY(-${posRight}px)`;         // 위로↑
      }
      rafId = requestAnimationFrame(animate);
    }

    // Pause on hover
    showcase.addEventListener("mouseenter", () => { paused = true; });
    showcase.addEventListener("mouseleave", () => { paused = false; });

    // Parallax tilt on mouse move (desktop only)
    if (window.matchMedia("(min-width: 1024px)").matches) {
      showcase.addEventListener("mousemove", (e) => {
        const rect = showcase.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        showcase.style.transform = `rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg)`;
      });
      showcase.addEventListener("mouseleave", () => {
        showcase.style.transform = "";
      });
    }

    // Start animation after images begin loading
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 가운데 열: 중간 지점에서 시작 (아래로 스크롤)
        const hC = getTrackHeight(trackCenter);
        posCenter = hC / 2;  // 절반 지점에서 시작
        trackCenter.style.transform = `translateY(${posCenter - hC}px)`;
        animate();
      });
    });
  })();

  /* =========================================================
     2. Calendar & Event Mouse Toast Tooltip
     ========================================================= */
  const calendarDays = document.getElementById("calendarDays");
  const monthLabel = document.getElementById("monthLabel");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  let tooltipEl = document.getElementById("calEventTooltip");
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "calEventTooltip";
    tooltipEl.className = "cal-event-tooltip";
    document.body.appendChild(tooltipEl);
  }

  function updateTooltipPos(e) {
    const x = e.clientX + 16;
    const y = e.clientY - 12;
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const maxX = window.innerWidth - tooltipRect.width - 16;
    const maxY = window.innerHeight - tooltipRect.height - 16;

    tooltipEl.style.left = `${Math.min(x, maxX)}px`;
    tooltipEl.style.top = `${Math.min(y, maxY)}px`;
  }

  let viewYear = 2026;
  let viewMonth = 8; // 0-indexed: 8 = September

  // Auto focus calendar to current month or first upcoming event month
  if (EVENTS.length > 0) {
    const firstEventDate = new Date(EVENTS[0].date);
    if (!isNaN(firstEventDate.getTime())) {
      viewYear = firstEventDate.getFullYear();
      viewMonth = firstEventDate.getMonth();
    }
  }

  function eventDatesInMonth(year, month) {
    return new Set(
      EVENTS.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
      }).map((e) => new Date(e.date).getDate())
    );
  }

  function renderCalendar() {
    if (!monthLabel || !calendarDays) return;
    monthLabel.textContent = `${viewYear}. ${viewMonth + 1}`;
    calendarDays.innerHTML = "";

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const eventDays = eventDatesInMonth(viewYear, viewMonth);
    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === viewYear && today.getMonth() === viewMonth;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewYear, viewMonth, day);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-day";
      btn.setAttribute("aria-pressed", String(isCurrentMonth && day === today.getDate()));

      const dow = document.createElement("span");
      dow.className = "dow";
      dow.textContent = DOW[date.getDay()];

      const dom = document.createElement("span");
      dom.className = "dom";
      dom.textContent = String(day);

      btn.append(dow, dom);

      if (eventDays.has(day)) {
        btn.classList.add("has-event");
        const match = EVENTS.find((e) => {
          const d = new Date(e.date);
          return d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === day;
        });

        if (match) {
          btn.addEventListener("mouseenter", (e) => {
            const dateObj = new Date(match.date);
            const weekday = DOW[dateObj.getDay()] || "";
            const formattedDate = `${match.date.replace(/-/g, ".")} (${weekday})`;

            tooltipEl.innerHTML = `
              <span class="tooltip-badge">공연 정보</span>
              <div class="tooltip-title">${escapeHtml(match.title)}</div>
              <div class="tooltip-row">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                <span>${formattedDate} ${match.time ? "· " + escapeHtml(match.time) : ""}</span>
              </div>
              <div class="tooltip-row">
                <svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${escapeHtml(match.venue)}</span>
              </div>
            `;
            tooltipEl.classList.add("active");
            updateTooltipPos(e);
          });

          btn.addEventListener("mousemove", (e) => {
            updateTooltipPos(e);
          });

          btn.addEventListener("mouseleave", () => {
            tooltipEl.classList.remove("active");
          });
        }
      }

      btn.addEventListener("click", () => {
        calendarDays
          .querySelectorAll(".cal-day")
          .forEach((el) => el.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");

        if (eventDays.has(day)) {
          const match = EVENTS.find((e) => {
            const d = new Date(e.date);
            return d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === day;
          });
          scrollToEventCard(match?.title);
        }
      });

      calendarDays.appendChild(btn);
    }

    requestAnimationFrame(() => {
      const active = calendarDays.querySelector('[aria-pressed="true"]');
      if (active) active.scrollIntoView({ inline: "center", block: "nearest" });
    });
  }

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      renderCalendar();
    });
  }

  renderCalendar();

  /* =========================================================
     3. Schedule Infinite Carousel (Dynamic List Generation)
     ========================================================= */
  const eventTrack = document.getElementById("eventTrack");
  const cardCount = document.getElementById("cardCount");
  const cardPrevBtn = document.getElementById("cardPrev");
  const cardNextBtn = document.getElementById("cardNext");
  const tabs = document.querySelectorAll(".tab");

  let isDragging = false;
  let startX = 0;
  let scrollLeftStart = 0;
  let hasDragged = false;
  let singleSetWidth = 0;
  let currentTabFilter = "all";

  function createCardElement(e, index) {
    const card = document.createElement("article");
    card.className = "event-card";
    card.setAttribute("data-status", e.status);
    card.setAttribute("data-ticket", e.ticket);
    card.setAttribute("data-id", e.id || index + 1);

    const categoryText = e.status === "past" ? "종료공연" : "예정공연";
    let ticketClass = "chip-soon";
    let ticketText = "예매예정";

    if (e.ticket === "live") {
      ticketClass = "chip-live";
      ticketText = "예매중";
    } else if (e.ticket === "ended" || e.status === "past") {
      ticketClass = "chip-ended";
      ticketText = "예매종료";
    }

    const posterSrc = (e.poster.startsWith("data:") || e.poster.startsWith("http") || e.poster.startsWith("img/"))
      ? e.poster
      : `img/poster/${e.poster}`;

    const dateObj = new Date(e.date);
    const weekday = DOW[dateObj.getDay()] || "";
    const formattedDate = `${e.date.replace(/-/g, ".")} (${weekday})`;

    card.innerHTML = `
      <div class="event-poster">
        <div class="chip-container">
          <span class="chip chip-category">${categoryText}</span>
          <span class="chip ${ticketClass}">${ticketText}</span>
        </div>
        <img src="${posterSrc}" alt="${escapeHtml(e.title)} 포스터" loading="lazy">
      </div>
      <h3>${escapeHtml(e.title)}</h3>
      <p class="event-date">${formattedDate}</p>
      <p class="event-venue">${escapeHtml(e.venue)} ${e.time ? "· " + escapeHtml(e.time) : ""}</p>
    `;

    return card;
  }

  function getFilteredEvents(filter) {
    if (filter === "upcoming") {
      return EVENTS.filter(e => e.status === "upcoming");
    }
    if (filter === "past") {
      return EVENTS.filter(e => e.status === "past");
    }
    return EVENTS;
  }

  function buildInfiniteTrack(filteredEvents) {
    if (!eventTrack) return;
    eventTrack.innerHTML = "";

    if (filteredEvents.length === 0) {
      if (cardCount) cardCount.textContent = "전체 0건";
      return;
    }

    const fragment = document.createDocumentFragment();

    const cloneLeft = filteredEvents.map((e, idx) => createCardElement(e, idx));
    const mainSet = filteredEvents.map((e, idx) => createCardElement(e, idx));
    const cloneRight = filteredEvents.map((e, idx) => createCardElement(e, idx));

    cloneLeft.forEach((card) => fragment.appendChild(card));
    mainSet.forEach((card) => fragment.appendChild(card));
    cloneRight.forEach((card) => fragment.appendChild(card));

    eventTrack.appendChild(fragment);

    // Re-attach chip click events
    eventTrack.querySelectorAll(".chip[data-tab]").forEach((chipBtn) => {
      chipBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        switchTab(chipBtn.dataset.tab);
      });
    });

    // Prevent default card action when dragging
    eventTrack.querySelectorAll(".event-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });

    if (cardCount) cardCount.textContent = `전체 ${filteredEvents.length}건`;

    requestAnimationFrame(() => {
      calculateAndCenterTrack(filteredEvents.length);
    });
  }

  function calculateAndCenterTrack(count) {
    if (count === 0 || !eventTrack) return;
    const cards = Array.from(eventTrack.children);
    if (cards.length === 0) return;

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 16;
    singleSetWidth = (cardWidth + gap) * count;

    eventTrack.scrollLeft = singleSetWidth;
  }

  function handleInfiniteLoopBoundaries() {
    if (!eventTrack || singleSetWidth <= 0) return;
    if (eventTrack.scrollLeft < singleSetWidth * 0.2) {
      eventTrack.scrollLeft += singleSetWidth;
    } else if (eventTrack.scrollLeft > singleSetWidth * 1.8) {
      eventTrack.scrollLeft -= singleSetWidth;
    }
  }

  // Mouse / Touch Dragging handlers
  if (eventTrack) {
    eventTrack.addEventListener("mouseenter", () => {});
    eventTrack.addEventListener("mouseleave", () => {
      isDragging = false;
      eventTrack.classList.remove("is-dragging");
    });

    eventTrack.addEventListener("mousedown", (e) => {
      isDragging = true;
      hasDragged = false;
      startX = e.pageX - eventTrack.offsetLeft;
      scrollLeftStart = eventTrack.scrollLeft;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging || !eventTrack) return;
      const x = e.pageX - eventTrack.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(x - startX) > 5) {
        hasDragged = true;
        eventTrack.classList.add("is-dragging");
      }
      eventTrack.scrollLeft = scrollLeftStart - walk;
      handleInfiniteLoopBoundaries();
    });

    window.addEventListener("mouseup", () => {
      if (isDragging && eventTrack) {
        isDragging = false;
        eventTrack.classList.remove("is-dragging");
        setTimeout(() => {
          hasDragged = false;
        }, 80);
      }
    });

    eventTrack.addEventListener("touchstart", (e) => {
      isDragging = true;
      hasDragged = false;
      startX = e.touches[0].pageX - eventTrack.offsetLeft;
      scrollLeftStart = eventTrack.scrollLeft;
    }, { passive: true });

    eventTrack.addEventListener("touchmove", (e) => {
      if (!isDragging || !eventTrack) return;
      const x = e.touches[0].pageX - eventTrack.offsetLeft;
      const walk = (x - startX) * 1.25;
      if (Math.abs(x - startX) > 5) {
        hasDragged = true;
      }
      eventTrack.scrollLeft = scrollLeftStart - walk;
      handleInfiniteLoopBoundaries();
    }, { passive: true });

    eventTrack.addEventListener("touchend", () => {
      isDragging = false;
      setTimeout(() => {
        hasDragged = false;
      }, 80);
    });
  }

  function slideNext() {
    if (!eventTrack) return;
    const cards = Array.from(eventTrack.children);
    if (cards.length === 0) return;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 16;
    const step = cardWidth + gap;
    eventTrack.scrollBy({ left: step, behavior: "smooth" });
  }

  function slidePrev() {
    if (!eventTrack) return;
    const cards = Array.from(eventTrack.children);
    if (cards.length === 0) return;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 16;
    const step = cardWidth + gap;
    eventTrack.scrollBy({ left: -step, behavior: "smooth" });
  }

  if (cardPrevBtn) cardPrevBtn.addEventListener("click", slidePrev);
  if (cardNextBtn) cardNextBtn.addEventListener("click", slideNext);

  function switchTab(filterName) {
    currentTabFilter = filterName;
    tabs.forEach((tab) => {
      const match = tab.dataset.tab === filterName;
      tab.setAttribute("aria-selected", String(match));
    });

    const filtered = getFilteredEvents(filterName);
    buildInfiniteTrack(filtered);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  // Initial Track Build
  buildInfiniteTrack(EVENTS);

  function scrollToEventCard(titleText) {
    if (!titleText || !eventTrack) return;
    const cards = Array.from(eventTrack.querySelectorAll(".event-card"));
    const targetCard = cards.find((c) => {
      const h3 = c.querySelector("h3");
      return h3 && (h3.textContent.trim() === titleText || h3.textContent.includes(titleText));
    });

    if (targetCard) {
      targetCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      targetCard.classList.add("highlight-card");
      setTimeout(() => targetCard.classList.remove("highlight-card"), 1800);
    }
  }

  /* =========================================================
     4. D-day Banner Calculation (Dynamic Next Stage)
     ========================================================= */
  const ddayNumber = document.getElementById("ddayNumber");
  const ddayTitle = document.querySelector(".dday-body h3");
  const ddayDesc = document.querySelector(".dday-body p");

  function updateDDayBanner() {
    const upcomingEvents = EVENTS.filter(e => e.status === "upcoming");
    if (upcomingEvents.length === 0 || !ddayNumber) return;

    // Pick first upcoming event
    const nextEvent = upcomingEvents[0];
    const targetDate = new Date(nextEvent.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = targetDate - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      ddayNumber.textContent = "DAY";
    } else if (diffDays > 0) {
      ddayNumber.textContent = `-${diffDays}`;
    } else {
      ddayNumber.textContent = `+${Math.abs(diffDays)}`;
    }

    if (ddayTitle) ddayTitle.textContent = nextEvent.title;
    if (ddayDesc) {
      const dateObj = new Date(nextEvent.date);
      const weekday = DOW[dateObj.getDay()] || "";
      const formattedDate = `${nextEvent.date.replace(/-/g, ".")} (${weekday})`;
      ddayDesc.textContent = `${formattedDate} · ${nextEvent.venue} ${nextEvent.time ? "· " + nextEvent.time : ""}`;
    }
  }

  updateDDayBanner();

  /* =========================================================
     5. Inquiry Form Handler (Push to localStorage for admin)
     ========================================================= */
  const inquiryForm = document.getElementById("inquiryForm");
  if (inquiryForm) {
    const chipOptions = inquiryForm.querySelectorAll(".chip-option");
    const eventTypeInput = document.getElementById("eventType");

    chipOptions.forEach((btn) => {
      btn.addEventListener("click", () => {
        chipOptions.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        if (eventTypeInput) eventTypeInput.value = btn.dataset.value;
      });
    });

    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("name");
      const phoneInput = document.getElementById("phone");
      const dateInput = document.getElementById("date");
      const venueInput = document.getElementById("venue");
      const messageInput = document.getElementById("message");

      const name = nameInput ? nameInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const eventType = (eventTypeInput && eventTypeInput.value) ? eventTypeInput.value : "일반 문의";
      const date = dateInput ? dateInput.value.trim() : "";
      const venue = venueInput ? venueInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !phone || !message) return;

      const now = new Date();
      const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const newInquiry = {
        id: "inq_" + Date.now(),
        name: name,
        contact: phone,
        performanceType: eventType,
        preferredDate: date || "미정",
        message: message + (venue ? ` (희망 공연장: ${venue})` : ""),
        status: "new",
        createdAt: formattedNow
      };

      try {
        const stored = localStorage.getItem("pium_admin_inquiries");
        const inquiries = stored ? JSON.parse(stored) : [];
        inquiries.unshift(newInquiry); // Prepend to top of inquiry list!
        localStorage.setItem("pium_admin_inquiries", JSON.stringify(inquiries));
      } catch (err) {
        console.error("Save inquiry error", err);
      }

      alert("공연 의뢰 문의가 정상적으로 접수되었습니다.\n담당자가 확인 후 영업일 기준 2일 이내에 연락드리겠습니다.");
      inquiryForm.reset();
      chipOptions.forEach((b) => b.classList.remove("active"));
    });
  }

  /* =========================================================
     6. Event Detail Modal (Poster Card Click Detail Popup)
     ========================================================= */
  function initEventModal() {
    const eventModal = document.getElementById("eventModal");
    if (!eventModal) return;

    const modalPosterImg = document.getElementById("modalPosterImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalDate = document.getElementById("modalDate");
    const modalVenue = document.getElementById("modalVenue");
    const modalPrice = document.getElementById("modalPrice");
    const modalRuntime = document.getElementById("modalRuntime");
    const modalAge = document.getElementById("modalAge");
    const modalDesc = document.getElementById("modalDesc");
    const modalChips = document.getElementById("modalChips");
    const modalBookingBtn = document.getElementById("modalBookingBtn");
    const modalCloseBtn = document.getElementById("modalClose") || document.getElementById("modalCloseBtn");

    function openEventModal(eventObj) {
      if (!eventObj) return;

      const dateObj = new Date(eventObj.date);
      const weekday = DOW[dateObj.getDay()] || "";
      const formattedDate = `${eventObj.date.replace(/-/g, ".")} (${weekday}) ${eventObj.time || ""}`;

      const posterSrc = (eventObj.poster.startsWith("data:") || eventObj.poster.startsWith("http") || eventObj.poster.startsWith("img/"))
        ? eventObj.poster
        : `img/poster/${eventObj.poster}`;

      modalPosterImg.src = posterSrc;
      modalPosterImg.alt = `${eventObj.title} 상세 포스터`;
      modalTitle.textContent = eventObj.title;
      modalSubtitle.textContent = `${eventObj.title} Special Performance`;
      modalDate.textContent = formattedDate;
      modalVenue.textContent = eventObj.venue || "대전예술의전당";
      modalPrice.textContent = "전석 30,000원";
      modalRuntime.textContent = "90분 (인터미션 15분)";
      modalAge.textContent = "초등학생 이상 관람가";
      modalDesc.textContent = eventObj.description || `${eventObj.title}에 여러분을 초대합니다. 실력파 아티스트들이 펼치는 감동적인 무대를 직접 감상해보세요.`;

      // Chips
      const categoryText = eventObj.status === "past" ? "종료공연" : "예정공연";
      let ticketClass = "chip-soon";
      let ticketText = "예매예정";

      if (eventObj.ticket === "live") {
        ticketClass = "chip-live";
        ticketText = "예매중";
      } else if (eventObj.ticket === "ended" || eventObj.status === "past") {
        ticketClass = "chip-ended";
        ticketText = "예매종료";
      }

      modalChips.innerHTML = `
        <span class="chip chip-category">${categoryText}</span>
        <span class="chip ${ticketClass}">${ticketText}</span>
      `;

      // Booking button status
      if (eventObj.status === "past" || eventObj.ticket === "ended") {
        modalBookingBtn.style.pointerEvents = "none";
        modalBookingBtn.style.opacity = "0.5";
        modalBookingBtn.querySelector("span").textContent = "예매가 마감되었습니다";
      } else {
        modalBookingBtn.style.pointerEvents = "auto";
        modalBookingBtn.style.opacity = "1";
        modalBookingBtn.querySelector("span").textContent = "예매 바로가기";
        modalBookingBtn.href = eventObj.ticketUrl || "https://tickets.interpark.com";
      }

      eventModal.classList.add("active");
      eventModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeEventModal() {
      eventModal.classList.remove("active");
      eventModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeEventModal);
    }

    eventModal.addEventListener("click", (e) => {
      if (e.target === eventModal) {
        closeEventModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && eventModal.classList.contains("active")) {
        closeEventModal();
      }
    });

    // Delegate click event to all poster cards
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".event-card, .poster-card");
      if (!card) return;

      if (typeof hasDragged !== "undefined" && hasDragged) return;

      const titleEl = card.querySelector("h3");
      let eventObj = null;

      if (titleEl) {
        const titleText = titleEl.textContent.trim();
        eventObj = EVENTS.find((item) => item.title === titleText || item.title.includes(titleText) || titleText.includes(item.title));
      }

      if (!eventObj) {
        const cardId = card.getAttribute("data-id");
        if (cardId) {
          eventObj = EVENTS.find((item) => String(item.id) === String(cardId));
        }
      }

      if (!eventObj) {
        eventObj = EVENTS[0];
      }

      openEventModal(eventObj);
    });
  }

  initEventModal();

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
