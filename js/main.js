// ===== 예식 날짜 설정 (여기만 바꾸면 달력/D-day가 자동 변경) =====
const WEDDING = new Date(2027, 4, 22, 13, 0); // 월은 0부터 시작 → 4 = 5월

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

// 날짜 텍스트
document.getElementById('dateText').textContent =
  `${WEDDING.getFullYear()}년 ${WEDDING.getMonth() + 1}월 ${WEDDING.getDate()}일 ` +
  `${DAYS_KO[WEDDING.getDay()]}요일 오후 ${WEDDING.getHours() % 12 || 12}시`;

// 달력 그리기
function renderCalendar() {
  const cal = document.getElementById('calendar');
  const y = WEDDING.getFullYear();
  const m = WEDDING.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const lastDate = new Date(y, m + 1, 0).getDate();

  let html = DAYS_KO.map((d, i) => `<div class="head ${i === 0 ? 'sun' : ''}">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += '<div></div>';
  for (let d = 1; d <= lastDate; d++) {
    const cls = ['day'];
    if ((firstDay + d - 1) % 7 === 0) cls.push('sun');
    if (d === WEDDING.getDate()) cls.push('wedding');
    html += `<div class="${cls.join(' ')}">${d}</div>`;
  }
  cal.innerHTML = html;
}

// 카운트다운
function updateCountdown() {
  const diff = WEDDING - new Date();
  const msg = document.getElementById('ddayMsg');
  if (diff <= 0) {
    ['cd-days', 'cd-hours', 'cd-min', 'cd-sec'].forEach(id => (document.getElementById(id).textContent = 0));
    msg.innerHTML = '민준 ♥ 유나의 결혼식이 <b>진행되었습니다</b>';
    return;
  }
  const s = Math.floor(diff / 1000);
  document.getElementById('cd-days').textContent = Math.floor(s / 86400);
  document.getElementById('cd-hours').textContent = Math.floor((s % 86400) / 3600);
  document.getElementById('cd-min').textContent = Math.floor((s % 3600) / 60);
  document.getElementById('cd-sec').textContent = s % 60;
  msg.innerHTML = `민준 ♥ 유나의 결혼식이 <b>${Math.ceil(diff / 86400000)}일</b> 남았습니다`;
}

// 스크롤 시 섹션 페이드인
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.section').forEach(s => observer.observe(s));

// 꽃잎 떨어지기
function createPetal() {
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.left = Math.random() * 100 + 'vw';
  p.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
  p.style.animationDuration = 6 + Math.random() * 5 + 's';
  const size = 8 + Math.random() * 8;
  p.style.width = p.style.height = size + 'px';
  document.getElementById('petals').appendChild(p);
  p.addEventListener('animationend', () => p.remove());
}

// 토스트 메시지
function showToast(text) {
  const t = document.getElementById('toast');
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove('show'), 1800);
}

// 계좌 복사
document.querySelectorAll('.copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      showToast('계좌번호가 복사되었습니다');
    } catch {
      showToast('복사에 실패했습니다');
    }
  });
});

// 링크 공유
document.getElementById('shareBtn').addEventListener('click', async () => {
  const data = { title: document.title, url: location.href };
  if (navigator.share) {
    try { await navigator.share(data); } catch { /* 사용자가 취소 */ }
  } else {
    await navigator.clipboard.writeText(location.href);
    showToast('링크가 복사되었습니다');
  }
});

renderCalendar();
updateCountdown();
setInterval(updateCountdown, 1000);
setInterval(createPetal, 600);
