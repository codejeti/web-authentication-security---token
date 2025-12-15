const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// 정적 파일 제공 (index.html, login.js 등)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const SECRET_KEY = 'secret-key';

// 예시 유저
const USER = {
  id: 'admin',
  password: '1234',
  name: 'Lucky',
  age: 20,
};

// 로그인
app.post('/login', (req, res) => {
  const { id, password } = req.body;

  if (id === USER.id && password === USER.password) {
    const accessToken = jwt.sign(
      {
        id: USER.id,
        name: USER.name,
        age: USER.age,
      },
      SECRET_KEY,
      { expiresIn: '5m' }
    );

    return res.send({ accessToken });
  }

  res.status(401).send({ message: '로그인 실패' });
});

// 토큰 검증
app.get('/verify', (req, res) => {
  const token = req.headers.accesstoken;

  if (!token) {
    return res.status(401).send({ message: '토큰 없음' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.send(decoded);
  } catch (err) {
    res.status(403).send({ message: '토큰 검증 실패' });
  }
});

app.listen(3000, () => {
  console.log('서버 실행 http://localhost:3000');
});
