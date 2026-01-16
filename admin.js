// Admin Logic for Secret Repo
// API_BASE is defined in admin.html

async function initAdmin() {
    console.log("Initializing Admin Dashboard...");
    fetchUsersForAdmin();
}

async function fetchUsersForAdmin() {
    const list = document.getElementById('admin-user-list');
    const countEl = document.getElementById('user-count');

    if (!list) return;
    list.innerHTML = '<tr><td colspan="5" style="text-align:center">데이터 로딩 중...</td></tr>';

    try {
        const res = await fetch(`${API_BASE}/users`);
        if (!res.ok) throw new Error("서버 연결 실패");

        const users = await res.json();

        if (countEl) countEl.innerText = users.length;
        list.innerHTML = '';

        users.forEach(u => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>
                    <div style="font-weight:600">${u.name}</div>
                    <div style="font-size:0.75rem; color:#9ca3af">${u.id}</div>
                </td>
                <td><span class="badge ${u.level === 'Pro' ? 'lv-pro' : (u.level === 'Elite' ? 'lv-elite' : 'lv-1')}">${u.level}</span></td>
                <td>${u.growthIndex || 0}</td>
                <td>${u.status || '-'}</td>
                <td>
                    ${u.level === '1' ? `<button class="action-btn" onclick="upgradeUser('${u.id}', 'Pro')">Pro 승인</button>` : ''}
                    ${u.level === 'Pro' ? `<button class="action-btn" onclick="upgradeUser('${u.id}', 'Elite')">Elite 승인</button>` : ''}
                    ${u.level === 'Elite' ? `<span style="color:#9ca3af">최고 등급</span>` : ''}
                </td>
            `;
            list.appendChild(tr);
        });

    } catch (err) {
        list.innerHTML = `<tr><td colspan="5" style="color:#f87171">오류: ${err.message}</td></tr>`;
    }
}

async function upgradeUser(userId, newLevel) {
    if (!confirm(`해당 회원을 ${newLevel} 등급으로 승격시키겠습니까?`)) return;

    try {
        const res = await fetch(`${API_BASE}/users/${userId}/level`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level: newLevel })
        });

        if (!res.ok) throw new Error("서버 업데이트 실패");

        alert("승인 완료! 회원의 등급이 변경되었습니다.");
        fetchUsersForAdmin(); // Refresh

    } catch (err) {
        alert("오류: " + err.message);
    }
}
