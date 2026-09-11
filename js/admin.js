/* ==========================================================================
   PIUM PLANNING — Admin Application Controller (js/admin.js)
   ========================================================================== */

(function () {
  'use strict';

  // Key Constants
  const STORAGE_KEYS = {
    AUTH: 'pium_admin_auth',
    PERFORMANCES: 'pium_admin_performances',
    INQUIRIES: 'pium_admin_inquiries'
  };

  // Sample Default Data (Seeded if local storage empty)
  const INITIAL_PERFORMANCES = [
    {
      id: 'perf_001',
      title: '르 그랑 클라비어 — 거장의 대화',
      startDate: '2026-10-15',
      endDate: '2026-10-15',
      location: '대전예술의전당 아트홀 · 1회 (19:30)',
      description: '세계적인 피아니스트들의 듀오 콘서트. 깊이 있는 클래식 연주와 거장들의 숨막히는 대화.',
      posterUrl: 'img/poster/poster_001.jpg',
      status: 'upcoming',
      openDate: '2026-09-01 10:00',
      ticketStatus: '예매중',
      ticketUrl: 'https://ticket.interpark.com',
      createdAt: '2026-08-20T10:00:00Z'
    },
    {
      id: 'perf_002',
      title: '더 테너스 콘서트 — 맛집 앙상블',
      startDate: '2026-10-22',
      endDate: '2026-10-22',
      location: '유성선병원 김인홀 · 1회 (19:00)',
      description: '국내 최정상 테너 4인이 선사하는 웅장한 가곡과 하모니의 밤.',
      posterUrl: 'img/poster/poster_002.jpg',
      status: 'upcoming',
      openDate: '2026-09-10 14:00',
      ticketStatus: '예매중',
      ticketUrl: 'https://ticket.interpark.com',
      createdAt: '2026-08-22T14:30:00Z'
    },
    {
      id: 'perf_003',
      title: '인디 락 챔버 오케스트라 레이블 패밀리',
      startDate: '2026-10-28',
      endDate: '2026-10-29',
      location: '대전시립연정국악원 큰마당 · 2회',
      description: '클래식 오케스트라와 인디 락의 하모니 콜라보레이션 연주회.',
      posterUrl: 'img/poster/poster_003.jpg',
      status: 'upcoming',
      openDate: '2026-09-20 10:00',
      ticketStatus: '예매예정',
      ticketUrl: 'https://ticket.interpark.com',
      createdAt: '2026-08-25T11:00:00Z'
    },
    {
      id: 'perf_004',
      title: '시티 팝 앤 재즈 퀸텟 라이브',
      startDate: '2026-09-01',
      endDate: '2026-09-15',
      location: '유성 문화예술 쉼터 · 3회',
      description: '도심 속에서 즐기는 감성적인 시티팝과 로맨틱 재즈 퀸텟 파티.',
      posterUrl: 'img/poster/poster_004.jpg',
      status: 'ongoing',
      openDate: '2026-08-01 10:00',
      ticketStatus: '예매중',
      ticketUrl: 'https://ticket.interpark.com',
      createdAt: '2026-07-28T09:00:00Z'
    },
    {
      id: 'perf_005',
      title: '2026 피움 썸머 체임버 뮤직 페스티벌',
      startDate: '2026-07-10',
      endDate: '2026-07-12',
      location: '대전예술의전당 앙상블홀',
      description: '여름밤을 수놓은 실내악 거장들의 명품 페스티벌.',
      posterUrl: 'img/poster/poster_005.jpg',
      status: 'ended',
      openDate: '2026-06-01 10:00',
      ticketStatus: '마감',
      ticketUrl: 'https://ticket.interpark.com',
      createdAt: '2026-05-15T10:00:00Z'
    }
  ];

  const INITIAL_INQUIRIES = [
    {
      id: 'inq_001',
      name: '김민준 이사',
      contact: '010-9876-5432 / minjun@company.co.kr',
      performanceType: '기업 창립기념 음악회 대관 및 기획',
      preferredDate: '2026-11-20',
      message: '기업 창립 10주년을 맞아 임직원 및 고객 초청 음악회를 기획하고자 합니다. 유성선병원 김인홀 섭외 및 출연진 구성 관련 상담 부탁드립니다.',
      status: 'new',
      createdAt: '2026-09-10 15:42'
    },
    {
      id: 'inq_002',
      name: '박지영 팀장',
      contact: '010-3344-5566 / jiyoung@artculture.org',
      performanceType: '클래식 재즈 융합 공연 섭외',
      preferredDate: '2026-12-05',
      message: '지자체 문화재단 송년 음악회 기획 문의입니다. 락 챔버 오케스트라 섭외 문의 드립니다.',
      status: 'new',
      createdAt: '2026-09-09 11:15'
    },
    {
      id: 'inq_003',
      name: '최현우 연출',
      contact: '010-1122-3344 / hwchoi@stage.kr',
      performanceType: '독주회 대관 및 홍보 대행',
      preferredDate: '2026-10-30',
      message: '귀사의 공동기획 및 티켓 예매 대행 관련 협의건으로 문의드립니다.',
      status: 'done',
      createdAt: '2026-09-02 09:30'
    }
  ];

  // Store Management
  function getStoreData(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.error('Store read error', e);
      return defaultVal;
    }
  }

  function setStoreData(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Store write error', e);
    }
  }

  // Initialize Store with Seed Data if empty
  function initStore() {
    if (!localStorage.getItem(STORAGE_KEYS.PERFORMANCES)) {
      setStoreData(STORAGE_KEYS.PERFORMANCES, INITIAL_PERFORMANCES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
      setStoreData(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    }
  }

  // App State Variables
  let performances = [];
  let inquiries = [];
  let currentPerfFilter = 'all';
  let currentInqFilter = 'all';
  let currentSearchQuery = '';

  // DOM Elements Cache
  const authContainer = document.getElementById('authContainer');
  const adminApp = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  
  const navLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const tabSections = document.querySelectorAll('.tab-section');
  
  const perfTableBody = document.getElementById('perfTableBody');
  const perfEmptyState = document.getElementById('perfEmptyState');
  const perfSearchInput = document.getElementById('perfSearchInput');
  const perfFilterTabs = document.querySelectorAll('#perfFilterTabs .tab-btn');
  
  const inqTableBody = document.getElementById('inqTableBody');
  const inqEmptyState = document.getElementById('inqEmptyState');
  const inqFilterTabs = document.querySelectorAll('#inqFilterTabs .tab-btn');
  
  const openPerfModalBtn = document.getElementById('openPerfModalBtn');
  const perfModal = document.getElementById('perfModal');
  const perfModalClose = document.getElementById('perfModalClose');
  const perfModalCancel = document.getElementById('perfModalCancel');
  const perfForm = document.getElementById('perfForm');
  const perfModalTitle = document.getElementById('perfModalTitle');
  const posterInput = document.getElementById('posterInput');
  const posterPreview = document.getElementById('posterPreview');
  const posterUrlInput = document.getElementById('posterUrlInput');

  const inqModal = document.getElementById('inqModal');
  const inqModalClose = document.getElementById('inqModalClose');
  const inqModalCloseBtn = document.getElementById('inqModalCloseBtn');
  const inqModalStatusBtn = document.getElementById('inqModalStatusBtn');

  // Stats Counters
  const statTotalPerf = document.getElementById('statTotalPerf');
  const statUpcomingPerf = document.getElementById('statUpcomingPerf');
  const statNewInq = document.getElementById('statNewInq');
  const sidebarInqBadge = document.getElementById('sidebarInqBadge');

  // Initialize Application
  function init() {
    initStore();
    checkAuth();
    bindEvents();
  }

  // Auth Functions
  function checkAuth() {
    const isAuth = localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    if (isAuth) {
      authContainer.style.display = 'none';
      adminApp.style.display = 'flex';
      loadData();
    } else {
      authContainer.style.display = 'flex';
      adminApp.style.display = 'none';
    }
  }

  function login(email, password) {
    if (email && password) {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      showToast('로그인 되었습니다.', 'success');
      checkAuth();
    } else {
      showToast('아이디와 비밀번호를 입력해주세요.', 'danger');
    }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    showToast('로그아웃 되었습니다.', 'success');
    checkAuth();
  }

  // Data Loading & Stats Update
  function loadData() {
    performances = getStoreData(STORAGE_KEYS.PERFORMANCES, INITIAL_PERFORMANCES);
    inquiries = getStoreData(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    
    updateStats();
    renderPerformances();
    renderInquiries();
  }

  function updateStats() {
    const upcomingCount = performances.filter(p => p.status === 'upcoming' || p.status === 'ongoing').length;
    const newInqCount = inquiries.filter(i => i.status === 'new').length;

    if (statTotalPerf) statTotalPerf.textContent = performances.length;
    if (statUpcomingPerf) statUpcomingPerf.textContent = upcomingCount;
    if (statNewInq) statNewInq.textContent = newInqCount;
    if (sidebarInqBadge) {
      sidebarInqBadge.textContent = newInqCount;
      sidebarInqBadge.style.display = newInqCount > 0 ? 'inline-block' : 'none';
    }
  }

  // Render Performances
  function renderPerformances() {
    if (!perfTableBody) return;
    
    let filtered = performances.filter(p => {
      if (currentPerfFilter === 'upcoming') return p.status === 'upcoming';
      if (currentPerfFilter === 'ongoing') return p.status === 'ongoing';
      if (currentPerfFilter === 'ended') return p.status === 'ended';
      return true;
    });

    if (currentSearchQuery.trim() !== '') {
      const q = currentSearchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.location.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      perfTableBody.innerHTML = '';
      if (perfEmptyState) perfEmptyState.style.display = 'block';
      return;
    }

    if (perfEmptyState) perfEmptyState.style.display = 'none';

    perfTableBody.innerHTML = filtered.map(p => {
      let statusBadge = '';
      if (p.status === 'upcoming') statusBadge = '<span class="badge badge-upcoming">진행예정</span>';
      else if (p.status === 'ongoing') statusBadge = '<span class="badge badge-ongoing">진행중</span>';
      else statusBadge = '<span class="badge badge-ended">종료</span>';

      let ticketBadge = '';
      if (p.ticketStatus === '예매중') ticketBadge = '<span class="badge badge-ticket-live">예매중</span>';
      else if (p.ticketStatus === '예매예정') ticketBadge = '<span class="badge badge-ticket-soon">예매예정</span>';
      else ticketBadge = '<span class="badge badge-ticket-closed">마감</span>';

      const posterSrc = p.posterUrl || 'img/poster/poster_001.jpg';
      const dateText = p.startDate === p.endDate ? p.startDate : `${p.startDate} ~ ${p.endDate}`;

      return `
        <tr>
          <td>
            <div class="item-title-cell">
              <img src="${posterSrc}" alt="${escapeHtml(p.title)}" class="poster-thumb">
              <div>
                <div class="item-title">${escapeHtml(p.title)}</div>
                <div class="item-subtitle">${escapeHtml(p.location)}</div>
              </div>
            </div>
          </td>
          <td>${dateText}</td>
          <td>${statusBadge}</td>
          <td>${ticketBadge}</td>
          <td>
            <span class="item-subtitle">${p.openDate || '-'}</span>
          </td>
          <td>
            <div class="action-group">
              <button type="button" class="btn btn-secondary btn-sm edit-perf-btn" data-id="${p.id}">
                수정
              </button>
              <button type="button" class="btn btn-danger btn-sm del-perf-btn" data-id="${p.id}">
                삭제
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Event Handlers for Edit & Delete
    document.querySelectorAll('.edit-perf-btn').forEach(btn => {
      btn.addEventListener('click', () => openPerformanceModal(btn.dataset.id));
    });

    document.querySelectorAll('.del-perf-btn').forEach(btn => {
      btn.addEventListener('click', () => deletePerformance(btn.dataset.id));
    });
  }

  // Render Inquiries
  function renderInquiries() {
    if (!inqTableBody) return;

    let filtered = inquiries.filter(i => {
      if (currentInqFilter === 'new') return i.status === 'new';
      if (currentInqFilter === 'done') return i.status === 'done';
      return true;
    });

    if (filtered.length === 0) {
      inqTableBody.innerHTML = '';
      if (inqEmptyState) inqEmptyState.style.display = 'block';
      return;
    }

    if (inqEmptyState) inqEmptyState.style.display = 'none';

    inqTableBody.innerHTML = filtered.map(i => {
      const isNew = i.status === 'new';
      const statusBadge = isNew
        ? '<span class="badge badge-new">신규 접수</span>'
        : '<span class="badge badge-done">처리 완료</span>';

      return `
        <tr>
          <td>
            <div class="item-title">${escapeHtml(i.name)}</div>
            <div class="item-subtitle">${escapeHtml(i.contact)}</div>
          </td>
          <td>
            <strong>${escapeHtml(i.performanceType)}</strong>
          </td>
          <td>${escapeHtml(i.preferredDate || '-')}</td>
          <td>${statusBadge}</td>
          <td><span class="item-subtitle">${i.createdAt}</span></td>
          <td>
            <div class="action-group">
              <button type="button" class="btn btn-secondary btn-sm view-inq-btn" data-id="${i.id}">
                상세보기
              </button>
              <button type="button" class="btn ${isNew ? 'btn-primary' : 'btn-secondary'} btn-sm toggle-inq-btn" data-id="${i.id}">
                ${isNew ? '처리 완료로 변경' : '신규 상태로 변경'}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Event Handlers
    document.querySelectorAll('.view-inq-btn').forEach(btn => {
      btn.addEventListener('click', () => viewInquiryDetail(btn.dataset.id));
    });

    document.querySelectorAll('.toggle-inq-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleInquiryStatus(btn.dataset.id));
    });
  }

  // Performance Form Modal Logic
  function openPerformanceModal(id = null) {
    perfForm.reset();
    posterPreview.style.display = 'none';
    posterPreview.src = '';
    posterUrlInput.value = '';

    if (id) {
      const item = performances.find(p => p.id === id);
      if (item) {
        perfModalTitle.textContent = '공연 정보 수정';
        document.getElementById('perfId').value = item.id;
        document.getElementById('perfTitle').value = item.title || '';
        document.getElementById('perfStartDate').value = item.startDate || '';
        document.getElementById('perfEndDate').value = item.endDate || '';
        document.getElementById('perfLocation').value = item.location || '';
        document.getElementById('perfStatus').value = item.status || 'upcoming';
        document.getElementById('perfOpenDate').value = item.openDate || '';
        document.getElementById('perfTicketStatus').value = item.ticketStatus || '예매중';
        document.getElementById('perfTicketUrl').value = item.ticketUrl || '';
        document.getElementById('perfDescription').value = item.description || '';
        
        if (item.posterUrl) {
          posterUrlInput.value = item.posterUrl;
          posterPreview.src = item.posterUrl;
          posterPreview.style.display = 'block';
        }
      }
    } else {
      perfModalTitle.textContent = '신규 공연 등록';
      document.getElementById('perfId').value = '';
    }

    perfModal.classList.add('active');
  }

  function closePerformanceModal() {
    perfModal.classList.remove('active');
  }

  function savePerformance(e) {
    e.preventDefault();

    const id = document.getElementById('perfId').value;
    const title = document.getElementById('perfTitle').value.trim();
    const startDate = document.getElementById('perfStartDate').value;
    const endDate = document.getElementById('perfEndDate').value || startDate;
    const location = document.getElementById('perfLocation').value.trim();
    const status = document.getElementById('perfStatus').value;
    const openDate = document.getElementById('perfOpenDate').value;
    const ticketStatus = document.getElementById('perfTicketStatus').value;
    const ticketUrl = document.getElementById('perfTicketUrl').value.trim();
    const description = document.getElementById('perfDescription').value.trim();
    const posterUrl = posterUrlInput.value || 'img/poster/poster_001.jpg';

    if (!title || !startDate || !location) {
      showToast('필수항목(제목, 시작일, 장소)을 입력해주세요.', 'danger');
      return;
    }

    if (id) {
      // Edit
      const index = performances.findIndex(p => p.id === id);
      if (index !== -1) {
        performances[index] = {
          ...performances[index],
          title,
          startDate,
          endDate,
          location,
          status,
          openDate,
          ticketStatus,
          ticketUrl,
          description,
          posterUrl
        };
        showToast('공연 정보가 수정되었습니다.', 'success');
      }
    } else {
      // Create
      const newPerf = {
        id: 'perf_' + Date.now(),
        title,
        startDate,
        endDate,
        location,
        status,
        openDate,
        ticketStatus,
        ticketUrl,
        description,
        posterUrl,
        createdAt: new Date().toISOString()
      };
      performances.unshift(newPerf);
      showToast('새 공연이 등록되었습니다.', 'success');
    }

    setStoreData(STORAGE_KEYS.PERFORMANCES, performances);
    closePerformanceModal();
    loadData();
  }

  function deletePerformance(id) {
    if (confirm('정말로 이 공연 항목을 삭제하시겠습니까?')) {
      performances = performances.filter(p => p.id !== id);
      setStoreData(STORAGE_KEYS.PERFORMANCES, performances);
      showToast('공연 항목이 삭제되었습니다.', 'success');
      loadData();
    }
  }

  // Inquiry Modal Logic
  let activeInquiryId = null;

  function viewInquiryDetail(id) {
    const item = inquiries.find(i => i.id === id);
    if (!item) return;

    activeInquiryId = id;
    document.getElementById('inqDetailName').textContent = item.name;
    document.getElementById('inqDetailContact').textContent = item.contact;
    document.getElementById('inqDetailType').textContent = item.performanceType;
    document.getElementById('inqDetailDate').textContent = item.preferredDate || '미정';
    document.getElementById('inqDetailCreated').textContent = item.createdAt;
    document.getElementById('inqDetailMessage').textContent = item.message;

    inqModalStatusBtn.textContent = item.status === 'new' ? '처리 완료로 변경' : '신규 상태로 변경';
    inqModalStatusBtn.className = item.status === 'new' ? 'btn btn-primary' : 'btn btn-secondary';

    inqModal.classList.add('active');
  }

  function closeInquiryModal() {
    inqModal.classList.remove('active');
    activeInquiryId = null;
  }

  function toggleInquiryStatus(id) {
    const index = inquiries.findIndex(i => i.id === id);
    if (index !== -1) {
      const nextStatus = inquiries[index].status === 'new' ? 'done' : 'new';
      inquiries[index].status = nextStatus;
      setStoreData(STORAGE_KEYS.INQUIRIES, inquiries);
      showToast(`문의 상태가 '${nextStatus === 'done' ? '처리완료' : '신규'}'로 변경되었습니다.`, 'success');
      
      if (activeInquiryId === id) {
        closeInquiryModal();
      }
      loadData();
    }
  }

  // Toast System
  function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Helper Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Bind All Event Handlers
  function bindEvents() {
    // Auth Form
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        login(email, password);
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }

    // Sidebar Navigation Tabs
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = link.dataset.tab;

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        tabSections.forEach(section => {
          if (section.id === targetTab + 'Section') {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        });

        // Set Top Header Title
        const headerTitle = document.getElementById('headerTitle');
        if (headerTitle) {
          headerTitle.textContent = targetTab === 'performance' ? '공연 관리' : '공연 의뢰 문의 관리';
        }
      });
    });

    // Performance Filter Tabs
    perfFilterTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        perfFilterTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPerfFilter = btn.dataset.filter;
        renderPerformances();
      });
    });

    // Performance Search
    if (perfSearchInput) {
      perfSearchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderPerformances();
      });
    }

    // Inquiry Filter Tabs
    inqFilterTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        inqFilterTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentInqFilter = btn.dataset.filter;
        renderInquiries();
      });
    });

    // Performance Modal Triggers
    if (openPerfModalBtn) openPerfModalBtn.addEventListener('click', () => openPerformanceModal());
    if (perfModalClose) perfModalClose.addEventListener('click', closePerformanceModal);
    if (perfModalCancel) perfModalCancel.addEventListener('click', closePerformanceModal);
    if (perfForm) perfForm.addEventListener('submit', savePerformance);

    // Image Upload File Preview
    if (posterInput) {
      posterInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            posterUrlInput.value = event.target.result;
            posterPreview.src = event.target.result;
            posterPreview.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Inquiry Modal Triggers
    if (inqModalClose) inqModalClose.addEventListener('click', closeInquiryModal);
    if (inqModalCloseBtn) inqModalCloseBtn.addEventListener('click', closeInquiryModal);
    if (inqModalStatusBtn) {
      inqModalStatusBtn.addEventListener('click', () => {
        if (activeInquiryId) toggleInquiryStatus(activeInquiryId);
      });
    }
  }

  // Run App Init on DOM Load
  document.addEventListener('DOMContentLoaded', init);

})();
