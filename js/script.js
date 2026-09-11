(() => {
  "use strict";

  /* =========================================================
     Event data (source of truth for calendar + cards + D-day)
     ========================================================= */
  /* =========================================================
     Event data (source of truth for calendar + cards + D-day)
     ========================================================= */
  const EVENTS = [
    { date: "2026-09-12", title: "피움 챔버 시리즈 Vol.3", time: "19:30", venue: "유성선병원 김인홀", status: "upcoming", ticket: "live", poster: "poster_001.jpg" },
    { date: "2026-09-26", title: "가을밤 재즈 살롱", time: "17:00 / 20:00", venue: "대전예술의전당 앙상블홀", status: "upcoming", ticket: "soon", poster: "poster_002.jpg" },
    { date: "2026-10-18", title: "창작 판소리 〈서른, 소리〉", time: "19:00", venue: "대전시립연정국악원 작은마당", status: "upcoming", ticket: "live", poster: "poster_003.jpg" },
    { date: "2025-12-20", title: "송년 음악회", time: "19:00", venue: "대전예술의전당 앙상블홀", status: "past", ticket: "ended", poster: "poster_004.jpg" },
    { date: "2026-10-25", title: "피움 체임버 피아노 퀸텟", time: "17:00", venue: "대전예술의전당 아트홀", status: "upcoming", ticket: "live", poster: "poster_005.jpg" },
    { date: "2026-11-02", title: "첼로 & 피아노 듀오 리사이틀", time: "19:30", venue: "유성선병원 김인홀", status: "upcoming", ticket: "soon", poster: "poster_006.jpg" },
    { date: "2026-11-15", title: "퓨전 국악 어울림 한마당", time: "15:00", venue: "대전시립연정국악원 큰마당", status: "upcoming", ticket: "live", poster: "poster_007.jpg" },
    { date: "2026-11-28", title: "오페라 아리아 하이라이트", time: "14:00 / 18:00", venue: "대전예술의전당 앙상블홀", status: "upcoming", ticket: "soon", poster: "poster_008.jpg" },
    { date: "2026-12-05", title: "현대무용 심포니 스펙트럼", time: "19:00", venue: "대전예술의전당 아트홀", status: "upcoming", ticket: "live", poster: "poster_009.jpg" },
    { date: "2026-12-24", title: "크리스마스 클래식 앙상블", time: "19:30", venue: "유성선병원 김인홀", status: "upcoming", ticket: "soon", poster: "poster_010.jpg" },
    { date: "2027-01-09", title: "신년 챔버 오케스트라 갈라", time: "17:00", venue: "대전예술의전당 아트홀", status: "upcoming", ticket: "soon", poster: "poster_011.jpg" },
    { date: "2027-01-23", title: "피움 챔버 시리즈 Vol.4", time: "19:30", venue: "유성선병원 김인홀", status: "upcoming", ticket: "soon", poster: "poster_012.jpg" },
    { date: "2027-02-14", title: "청소년 교향악 라이징 스타", time: "15:00", venue: "대전예술의전당 앙상블홀", status: "upcoming", ticket: "soon", poster: "poster_013.jpg" },
    { date: "2027-03-07", title: "봄을 여는 목관 5중주 앙상블", time: "17:00", venue: "대전시립연정국악원 작은마당", status: "upcoming", ticket: "soon", poster: "poster_014.jpg" },
    { date: "2027-03-21", title: "베토벤 피아노 소나타 전곡 I", time: "19:00", venue: "유성선병원 김인홀", status: "upcoming", ticket: "soon", poster: "poster_015.jpg" },
    { date: "2027-04-11", title: "현악 사중주 익스플로어", time: "17:00", venue: "대전예술의전당 앙상블홀", status: "upcoming", ticket: "soon", poster: "poster_016.jpg" },
    { date: "2025-04-25", title: "피움 봄빛 가곡 콘서트", time: "15:00", venue: "대전시립연정국악원 큰마당", status: "past", ticket: "ended", poster: "poster_017.jpg" },
    { date: "2027-05-09", title: "월드 뮤직 & 퍼커션 앙상블", time: "19:00", venue: "대전예술의전당 아트홀", status: "upcoming", ticket: "soon", poster: "poster_018.jpg" },
    { date: "2027-05-23", title: "피움 챔버 시리즈 Vol.5", time: "19:30", venue: "유성선병원 김인홀", status: "upcoming", ticket: "soon", poster: "poster_019.jpg" },
    { date: "2027-06-13", title: "초여름의 브라스 퀸텟", time: "17:00", venue: "대전예술의전당 앙상블홀", status: "upcoming", ticket: "soon", poster: "poster_020.jpg" }
  ];

  const DOW = ["일", "월", "화", "수", "목", "금", "토"];

  /* =========================================================
     Calendar & Event Mouse Toast Tooltip
     ========================================================= */
  const calendarDays = document.getElementById("calendarDays");
  const monthLabel = document.getElementById("monthLabel");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  // Create or select floating tooltip toast element
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

  function eventDatesInMonth(year, month) {
    return new Set(
      EVENTS.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
      }).map((e) => new Date(e.date).getDate())
    );
  }

  function renderCalendar() {
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
            const weekday = DOW[dateObj.getDay()];
            const formattedDate = `${match.date.replace(/-/g, ".")} (${weekday})`;

            tooltipEl.innerHTML = `
              <span class="tooltip-badge">공연 정보</span>
              <div class="tooltip-title">${match.title}</div>
              <div class="tooltip-row">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                <span>${formattedDate} · ${match.time}</span>
              </div>
              <div class="tooltip-row">
                <svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${match.venue}</span>
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

    // scroll the "today" pill into view within the strip
    requestAnimationFrame(() => {
      const active = calendarDays.querySelector('[aria-pressed="true"]');
      if (active) active.scrollIntoView({ inline: "center", block: "nearest" });
    });
  }

  prevMonthBtn.addEventListener("click", () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  renderCalendar();

  /* =========================================================
     Schedule Infinite Carousel (20 Items, Auto Flow, Mouse Drag, Left/Right Buttons)
     ========================================================= */
  const eventTrack = document.getElementById("eventTrack");
  const cardCount = document.getElementById("cardCount");
  const cardPrevBtn = document.getElementById("cardPrev");
  const cardNextBtn = document.getElementById("cardNext");
  const tabs = document.querySelectorAll(".tab");

  const originalCards = Array.from(eventTrack.querySelectorAll(".event-card"));

  let isDragging = false;
  let startX = 0;
  let scrollLeftStart = 0;
  let hasDragged = false;
  let singleSetWidth = 0;
  let autoFlowSpeed = 0; // Stationary 4-card display until user clicks buttons or drags

  function buildInfiniteTrack(filteredCards) {
    eventTrack.innerHTML = "";
    if (filteredCards.length === 0) {
      cardCount.textContent = "전체 0건";
      return;
    }

    const fragment = document.createDocumentFragment();

    const cloneLeft = filteredCards.map((c) => c.cloneNode(true));
    const mainSet = filteredCards.map((c) => c.cloneNode(true));
    const cloneRight = filteredCards.map((c) => c.cloneNode(true));

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

    if (cardCount) cardCount.textContent = `전체 ${filteredCards.length}건`;

    requestAnimationFrame(() => {
      calculateAndCenterTrack(filteredCards.length);
    });
  }

  function calculateAndCenterTrack(count) {
    if (count === 0) return;
    const cards = Array.from(eventTrack.children);
    if (cards.length === 0) return;

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 16;
    singleSetWidth = (cardWidth + gap) * count;

    eventTrack.scrollLeft = singleSetWidth;
  }

  function handleInfiniteLoopBoundaries() {
    if (singleSetWidth <= 0) return;
    if (eventTrack.scrollLeft < singleSetWidth * 0.2) {
      eventTrack.scrollLeft += singleSetWidth;
    } else if (eventTrack.scrollLeft > singleSetWidth * 1.8) {
      eventTrack.scrollLeft -= singleSetWidth;
    }
  }

  eventTrack.addEventListener("scroll", () => {
    handleInfiniteLoopBoundaries();
  }, { passive: true });

  // Auto-flow loop (active only if speed > 0)
  function autoFlowStep() {
    if (autoFlowSpeed > 0 && !isDragging && !isHovered && singleSetWidth > 0) {
      eventTrack.scrollLeft += autoFlowSpeed;
      handleInfiniteLoopBoundaries();
    }
    if (autoFlowSpeed > 0) {
      requestAnimationFrame(autoFlowStep);
    }
  }

  // Mouse hover pause
  eventTrack.addEventListener("mouseenter", () => { isHovered = true; });
  eventTrack.addEventListener("mouseleave", () => {
    isHovered = false;
    isDragging = false;
    eventTrack.classList.remove("is-dragging");
  });

  // Mouse Dragging handlers
  eventTrack.addEventListener("mousedown", (e) => {
    isDragging = true;
    hasDragged = false;
    startX = e.pageX - eventTrack.offsetLeft;
    scrollLeftStart = eventTrack.scrollLeft;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
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
    if (isDragging) {
      isDragging = false;
      eventTrack.classList.remove("is-dragging");
      setTimeout(() => {
        hasDragged = false;
      }, 80);
    }
  });

  // Touch Dragging handlers
  eventTrack.addEventListener("touchstart", (e) => {
    isDragging = true;
    hasDragged = false;
    startX = e.touches[0].pageX - eventTrack.offsetLeft;
    scrollLeftStart = eventTrack.scrollLeft;
  }, { passive: true });

  eventTrack.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
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

  // Left / Right Slide Buttons (Dynamic step calculation for 4-card grid)
  function slideNext() {
    const cards = Array.from(eventTrack.children);
    if (cards.length === 0) return;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 16;
    const step = cardWidth + gap;
    eventTrack.scrollBy({ left: step, behavior: "smooth" });
  }

  function slidePrev() {
    const cards = Array.from(eventTrack.children);
    if (cards.length === 0) return;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 16;
    const step = cardWidth + gap;
    eventTrack.scrollBy({ left: -step, behavior: "smooth" });
  }

  if (cardNextBtn) cardNextBtn.addEventListener("click", slideNext);
  if (cardPrevBtn) cardPrevBtn.addEventListener("click", slidePrev);

  function applyTabFilter(tabName) {
    const filteredCards = originalCards.filter((card) => {
      const cardStatus = card.dataset.status;
      const cardTicket = card.dataset.ticket;

      if (tabName === "all") return true;
      if (tabName === "upcoming") return cardStatus === "upcoming";
      if (tabName === "booking" || tabName === "live") return cardTicket === "live";
      if (tabName === "soon") return cardTicket === "soon";
      if (tabName === "past" || tabName === "ended") return cardStatus === "past";
      return true;
    });

    buildInfiniteTrack(filteredCards);
  }

  function switchTab(tabName) {
    tabs.forEach((t) => {
      const isTarget = t.dataset.tab === tabName;
      t.classList.toggle("active", isTarget);
      t.setAttribute("aria-selected", String(isTarget));
    });
    applyTabFilter(tabName);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchTab(tab.dataset.tab);
    });
  });

  switchTab("all");
  requestAnimationFrame(autoFlowStep);

  function scrollToEventCard(title) {
    const cards = Array.from(eventTrack.children);
    const target = cards.find((c) => c.querySelector("h3")?.textContent.includes(title));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }

  /* =========================================================
     Inquiry form — event type chips
     ========================================================= */
  const chipOptions = document.querySelectorAll(".chip-option");
  const eventTypeInput = document.getElementById("eventType");

  chipOptions.forEach((chip) => {
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", () => {
      const alreadyActive = chip.getAttribute("aria-pressed") === "true";
      chipOptions.forEach((c) => c.setAttribute("aria-pressed", "false"));
      if (!alreadyActive) {
        chip.setAttribute("aria-pressed", "true");
        eventTypeInput.value = chip.dataset.value;
      } else {
        eventTypeInput.value = "";
      }
    });
  });

  /* =========================================================
     Inquiry form — submit
     ========================================================= */
  const inquiryForm = document.getElementById("inquiryForm");
  inquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = inquiryForm.querySelector('button[type="submit"]');
    const original = submitBtn.textContent;
    submitBtn.textContent = "문의가 접수되었습니다";
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = original;
      submitBtn.disabled = false;
      inquiryForm.reset();
      chipOptions.forEach((c) => c.setAttribute("aria-pressed", "false"));
    }, 2200);
  });

  /* =========================================================
     D-Day banner — computed against the nearest upcoming event
     ========================================================= */
  const ddayNumber = document.getElementById("ddayNumber");
  const ddayTitle = document.querySelector(".dday-body h3");
  const ddayMeta = document.querySelector(".dday-body p:last-child");

  function updateDday() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = EVENTS
      .map((e) => ({ ...e, dateObj: new Date(e.date) }))
      .filter((e) => e.dateObj >= now)
      .sort((a, b) => a.dateObj - b.dateObj)[0];

    if (!upcoming) return;

    const diffDays = Math.round((upcoming.dateObj - now) / 86400000);
    ddayNumber.textContent = diffDays === 0 ? "D-DAY" : `-${diffDays}`;

    const weekday = DOW[upcoming.dateObj.getDay()];
    const y = upcoming.dateObj.getFullYear();
    const m = String(upcoming.dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(upcoming.dateObj.getDate()).padStart(2, "0");

    ddayTitle.textContent = upcoming.title;
    ddayMeta.textContent = `${y}.${m}.${d}(${weekday}) · ${upcoming.venue} · ${upcoming.time}`;
  }

  updateDday();

  /* =========================================================
     Hero Interactive 3-Column Poster Animation
     - 20 poster images (poster_001.jpg ~ poster_020.jpg)
     - 3 Columns:
       * Left (Col 1) & Right (Col 3): Move UP (양옆 위로)
       * Center (Col 2): Moves DOWN (가운데 아래로 / 움직이는 인터랙션)
     - RAF Infinite Smooth Scroll
     - Mouse Move 3D Tilt Parallax & Hover Interaction
     ========================================================= */
  function initHeroPosterShowcase() {
    const showcase = document.getElementById("heroPosterShowcase");
    const colLeft = document.getElementById("posterColLeft");
    const colCenter = document.getElementById("posterColCenter");
    const colRight = document.getElementById("posterColRight");

    if (!showcase || !colLeft || !colCenter || !colRight) return;

    // Generate 20 poster image paths
    const posters = Array.from({ length: 20 }, (_, i) => {
      const num = String(i + 1).padStart(3, "0");
      return `img/poster/poster_${num}.jpg`;
    });

    // Distribute posters into 3 columns
    const leftList = [];
    const centerList = [];
    const rightList = [];

    posters.forEach((src, idx) => {
      if (idx % 3 === 0) leftList.push(src);
      else if (idx % 3 === 1) centerList.push(src);
      else rightList.push(src);
    });

    // Function to build a track with cards duplicated for infinite scrolling
    function buildTrack(container, imageList) {
      const track = document.createElement("div");
      track.className = "col-track";

      // Duplicate list 3 times to ensure smooth loop without gap
      const tripleList = [...imageList, ...imageList, ...imageList];

      tripleList.forEach((src, idx) => {
        const card = document.createElement("div");
        card.className = "poster-card";

        const img = document.createElement("img");
        img.src = src;
        img.alt = `피움 공연 포스터 ${(idx % imageList.length) + 1}`;
        img.loading = "lazy";
        // Fallback for missing poster image numbers
        img.onerror = () => {
          img.src = "img/poster/poster_001.jpg";
        };

        card.appendChild(img);
        track.appendChild(card);
      });

      container.appendChild(track);
      return track;
    }

    const trackLeft = buildTrack(colLeft, leftList);
    const trackCenter = buildTrack(colCenter, centerList);
    const trackRight = buildTrack(colRight, rightList);

    // Initial offsets and speeds
    let posLeft = 0;
    let posCenter = 0;
    let posRight = 0;

    let baseSpeed = 0.65; // pixels per frame
    let currentSpeedMult = 1;
    let targetSpeedMult = 1;

    // Parallax mouse tilt
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    // Mouse hover speed control
    showcase.addEventListener("mouseenter", () => {
      targetSpeedMult = 0.35; // Slow down on hover
    });
    showcase.addEventListener("mouseleave", () => {
      targetSpeedMult = 1.0;
      targetTiltX = 0;
      targetTiltY = 0;
    });

    // 3D Tilt on mouse move inside Hero
    const heroSec = document.querySelector(".hero");
    if (heroSec) {
      heroSec.addEventListener("mousemove", (e) => {
        const rect = heroSec.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetTiltX = -y * 8; // degrees X
        targetTiltY = x * 8;   // degrees Y
      });
    }

    // Touch feedback
    showcase.addEventListener("touchstart", () => {
      targetSpeedMult = 0.2;
    }, { passive: true });
    showcase.addEventListener("touchend", () => {
      targetSpeedMult = 1.0;
    }, { passive: true });

    // Scroll speed reaction
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    window.addEventListener("scroll", () => {
      const dy = window.scrollY - lastScrollY;
      scrollVelocity = dy * 0.15;
      lastScrollY = window.scrollY;
    }, { passive: true });

    // Animation Loop
    function animate() {
      // Lerp speed multiplier
      currentSpeedMult += (targetSpeedMult - currentSpeedMult) * 0.08;

      // Lerp tilt
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      showcase.style.transform = `rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;

      // Decay scroll velocity
      scrollVelocity *= 0.92;

      const moveStep = baseSpeed * currentSpeedMult + scrollVelocity;

      // Single track set height calculation (1/3 of full track height)
      const trackHeightLeft = trackLeft.scrollHeight / 3 || 600;
      const trackHeightCenter = trackCenter.scrollHeight / 3 || 600;
      const trackHeightRight = trackRight.scrollHeight / 3 || 600;

      // Left Column: Moves UP (posLeft decreases)
      posLeft -= moveStep;
      if (Math.abs(posLeft) >= trackHeightLeft) {
        posLeft += trackHeightLeft;
      }

      // Center Column: Moves DOWN (posCenter increases)
      posCenter += moveStep * 0.9;
      if (posCenter >= 0) {
        posCenter -= trackHeightCenter;
      }

      // Right Column: Moves UP (posRight decreases)
      posRight -= moveStep * 1.05;
      if (Math.abs(posRight) >= trackHeightRight) {
        posRight += trackHeightRight;
      }

      // Apply transform
      trackLeft.style.transform = `translate3d(0, ${posLeft.toFixed(2)}px, 0)`;
      trackCenter.style.transform = `translate3d(0, ${posCenter.toFixed(2)}px, 0)`;
      trackRight.style.transform = `translate3d(0, ${posRight.toFixed(2)}px, 0)`;

      requestAnimationFrame(animate);
    }

    // Set initial position of center track to middle of loop so it scrolls down cleanly
    requestAnimationFrame(() => {
      const centerSetH = trackCenter.scrollHeight / 3 || 600;
      posCenter = -centerSetH;
      animate();
    });
  }

  initHeroPosterShowcase();

  /* =========================================================
     Event Detail Modal Popup & Booking Button Handler
     ========================================================= */
  function initEventModal() {
    const eventModal = document.getElementById("eventModal");
    const modalCloseBtn = document.getElementById("modalClose");
    const modalPosterImg = document.getElementById("modalPosterImg");
    const modalChips = document.getElementById("modalChips");
    const modalTitle = document.getElementById("modalTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalDate = document.getElementById("modalDate");
    const modalVenue = document.getElementById("modalVenue");
    const modalPrice = document.getElementById("modalPrice");
    const modalRuntime = document.getElementById("modalRuntime");
    const modalAge = document.getElementById("modalAge");
    const modalDesc = document.getElementById("modalDesc");
    const modalBookingBtn = document.getElementById("modalBookingBtn");

    if (!eventModal) return;

    const EVENT_DETAILS = {
      "피움 챔버 시리즈 Vol.3": {
        subtitle: "PIUM Chamber Music Series Vol.3",
        price: "전석 30,000원 (학생 50% 할인)",
        runtime: "90분 (인터미션 15분)",
        age: "초등학생 이상 관람가",
        desc: "피움 기획의 대표 클래식 시리즈! 바이올린, 첼로, 피아노가 어우러지는 감성 실내악 콘서트입니다. 서정적인 멜로디와 최고 연주자들의 깊은 호흡을 경험해보세요."
      },
      "가을밤 재즈 살롱": {
        subtitle: "Autumn Night Jazz Salon",
        price: "R석 40,000원 / S석 30,000원",
        runtime: "100분 (인터미션 없음)",
        age: "8세 이상 관람가",
        desc: "가을 분위 물씬 감도는 재즈 스탠다드와 어쿠스틱 스윙 사운드! 국내 최정상 재즈 퀸텟과 함께하는 감성 가득한 가을밤 살롱 콘서트입니다."
      },
      "창작 판소리 〈서른, 소리〉": {
        subtitle: "Creative Pansori <Thirty, Sori>",
        price: "전석 25,000원",
        runtime: "85분 (인터미션 없음)",
        age: "초등학생 이상 관람가",
        desc: "이 시대 청춘들의 솔직한 삶과 고민을 전통 판소리 가락에 담아낸 모던 창작 소리극. 깊은 울림과 색다른 재미를 선사합니다."
      },
      "송년 음악회": {
        subtitle: "Year-End Concert 2025",
        price: "R석 50,000원 / S석 35,000원",
        runtime: "110분 (인터미션 15분)",
        age: "초등학생 이상 관람가",
        desc: "한 해를 따뜻하게 마무리하는 피움 송년 시그니처 음악회. 웅장한 오케스트라와 성악 협연으로 감동을 전합니다."
      }
    };

    function openEventModal(eventObj) {
      if (!eventObj) return;

      const details = EVENT_DETAILS[eventObj.title] || {
        subtitle: `${eventObj.title} Special Performance`,
        price: "전석 30,000원",
        runtime: "90분 (인터미션 15분)",
        age: "초등학생 이상 관람가",
        desc: `${eventObj.title}에 여러분을 초대합니다. 실력파 아티스트들이 펼치는 감동적인 무대를 직접 감상해보세요.`
      };

      const dateObj = new Date(eventObj.date);
      const weekday = DOW[dateObj.getDay()] || "";
      const formattedDate = `${eventObj.date.replace(/-/g, ".")} (${weekday}) ${eventObj.time || ""}`;

      modalPosterImg.src = `img/poster/${eventObj.poster || "poster_001.jpg"}`;
      modalPosterImg.alt = `${eventObj.title} 상세 포스터`;
      modalTitle.textContent = eventObj.title;
      modalSubtitle.textContent = details.subtitle;
      modalDate.textContent = formattedDate;
      modalVenue.textContent = eventObj.venue || "대전예술의전당";
      modalPrice.textContent = details.price;
      modalRuntime.textContent = details.runtime;
      modalAge.textContent = details.age;
      modalDesc.textContent = details.desc;

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
        modalBookingBtn.href = "https://tickets.interpark.com";
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

      // Do not trigger modal if user was actively dragging
      if (typeof hasDragged !== "undefined" && hasDragged) return;

      const titleEl = card.querySelector("h3");
      let eventObj = null;

      if (titleEl) {
        const titleText = titleEl.textContent.trim();
        eventObj = EVENTS.find((item) => item.title === titleText || item.title.includes(titleText) || titleText.includes(item.title));
      }

      if (!eventObj) {
        // Fallback for hero poster cards matching image src
        const img = card.querySelector("img");
        if (img) {
          const match = img.src.match(/poster_(\d+)\.jpg/);
          if (match) {
            const index = parseInt(match[1], 10) - 1;
            eventObj = EVENTS[index % EVENTS.length];
          }
        }
      }

      if (!eventObj) {
        eventObj = EVENTS[0];
      }

      openEventModal(eventObj);
    });
  }

  initEventModal();
})();
