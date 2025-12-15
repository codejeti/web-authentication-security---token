const loginBtn = document.getElementById('login_button');
const logoutBtn = document.getElementById('logout_button');

const userName = document.getElementById('user_name');
const userInfo = document.getElementById('user_info');

let accessToken = '';

loginBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const id = document.getElementById('user_id').value;
  const password = document.getElementById('user_password').value;

  try {
    // 1️⃣ 로그인 요청
    const loginRes = await axios.post('http://localhost:3000/login', {
      id,
      password,
    });

    accessToken = loginRes.data.accessToken;

    // 2️⃣ 토큰 검증 요청
    const verifyRes = await axios.get('http://localhost:3000/verify', {
      headers: {
        accessToken,
      },
    });

    // 3️⃣ 유저 정보 출력
    userName.innerText = verifyRes.data.name;
    userInfo.innerText = JSON.stringify(verifyRes.data);
  } catch (err) {
    alert('로그인 실패');
  }
});

logoutBtn.addEventListener('click', () => {
  accessToken = '';
  userName.innerText = '';
  userInfo.innerText = '';
});
