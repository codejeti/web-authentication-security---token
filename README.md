

#  인증 흐름 & 실행 시 발생한 에러 정리 (추가 설명)

본 프로젝트를 로컬 환경에서 실행하는 과정에서 발생할 수 있는
`CSP / favicon` 경고와 `Cannot GET /` 에러에 대해 아래와 같이 정리합니다.

---

##  Content-Security-Policy (CSP) / favicon 관련 경고

###  발생한 메시지

```text
Content-Security-Policy: The page’s settings blocked the loading of a resource (img-src)
at http://localhost:3000/favicon.ico because it violates the following directive:
"default-src 'none'"
```

###  원인 설명

* 브라우저는 페이지를 로드할 때 자동으로 `/favicon.ico` 파일을 요청합니다.
* 하지만 현재 페이지는 **강한 CSP(Content Security Policy)** 가 적용되어 있어
  외부 리소스(이미지 포함)의 로딩이 차단된 상태입니다.
* 그 결과, favicon 요청이 차단되며 위와 같은 **경고 메시지**가 출력됩니다.

### 영향 여부

* ❌ 로그인 기능에 영향 없음
* ❌ JWT 발급 및 검증 로직과 무관
* ❌ 서버 통신 오류 아님
* ❌ 과제 채점에 영향 없음

 **브라우저 보안 정책에 따른 경고일 뿐, 정상적인 동작에는 문제가 없습니다.**

### 선택적 해결 방법

```html
<link rel="icon" href="data:,">
```

위 코드를 `index.html`의 `<head>`에 추가하면 favicon 요청 자체가 발생하지 않아
해당 경고를 제거할 수 있습니다.

---

## Cannot GET / 에러 정리

###  발생한 메시지

```text
GET http://localhost:3000/
404 Not Found
Cannot GET /
```

###  원인 설명

* Express 서버는 **API 서버**로 동작하고 있으며,
* `/login`, `/verify` 와 같은 **특정 라우트만 정의**되어 있습니다.
* 따라서 브라우저에서 `http://localhost:3000/` 으로 직접 접근할 경우,
  해당 경로(`/`)를 처리하는 라우트가 없어 `Cannot GET /` 에러가 발생합니다.

###  정상 동작 여부

* 이 프로젝트는 **index.html을 서버에서 렌더링하지 않는 구조**입니다.
* `index.html`은 **Live Server 또는 로컬 파일 서버**로 실행하고,
* 서버(`server.js`)는 **순수 API 역할**만 수행합니다.

따라서 `Cannot GET /` 에러는 **의도된 정상적인 동작**입니다.

---

##  전체 실행 구조 요약

```text
[ index.html ]  (Live Server 실행)
      |
      | axios 요청
      v
[ server.js ]  (node server.js)
      |
      | /login  → accessToken 발급 (jwt.sign)
      | /verify → accessToken 검증 (jwt.verify)
      v
[ 클라이언트로 유저 정보 응답 ]
```

---

## Authorization 대신 accessToken 헤더를 사용한 이유

본 과제에서는 `Authorization: Bearer <token>` 형식 대신
**커스텀 헤더인 `accessToken`을 사용**하여 토큰을 전달하였습니다.

### 🔎 사용 예시

```js
axios.get('/verify', {
  headers: {
    accessToken: accessToken,
  },
});
```

###  사용 이유

* HTTP 헤더의 구조와 전달 방식을 이해하는 것이 목적
* 인증 로직의 핵심은 **토큰의 전달 및 검증 흐름**이지,
  반드시 `Authorization` 헤더를 사용하는 것이 필수는 아님

### 📎 참고

실무 환경에서는 보통 다음과 같은 형식을 사용합니다.

```http
Authorization: Bearer <accessToken>
```

하지만 본 실습에서는 **학습 목적에 맞춰 accessToken 헤더를 직접 사용**하였습니다.

---

##  정리

* CSP / favicon 경고는 **브라우저 보안 정책에 따른 경고**
* `Cannot GET /` 에러는 **API 서버 구조상 정상적인 현상**
* 인증 흐름은 **login → token 발급 → token 검증 → 사용자 정보 반환**

---
