# 📱 Dozn

- ✏️ Dozn 스크래핑 사업본부 채용과제
- ⏱️ 프로젝트 기간: `2024/12/19 ~ 2023/12/21`
- ⛓️ 배포 링크: [프로젝트 결과물](https://dzon-scraping-recruit-task.vercel.app/)
- 특이사항 : 반응형까진 작업하지못했음.

  <br>

• Page 1: 로그인 페이지
• Page 2: API 목록 조회 페이지 + 스크래핑 데이터 호출 후 응답 팝업 페이지
• Page 3: 호출 목록 조회 페이지 + 스크래핑 데이터 호출에 대한 응답 팝업 페이지

API 관리 및 호출 시스템 구현: API 목록 조회, 호출 기록 저장, 스크래핑 데이터를 관리하는 기능을 개발하며, Redux를 활용해 상태를 관리하고 데이터를 체계적으로 정리했습니다.

Redux와 LocalStorage 연동: API 호출 기록을 Redux로 관리하며, localStorage에 저장하여 새로고침해도 데이터가 유지되도록 구현하였습니다.

UX 개선: 요청 내역을 카드 형태로 표시, 정렬, 북마크 기능과 팝업 응답 보기 기능을 추가하여 사용자 친화적인 UI를 구현했습니다.

<br />

# 📝 프로젝트 실행 방법

### 1️⃣ 종속성 설치

```bash
$ npm install
```

### 2️⃣ 개발 모드 실행

```bash
$ npm run dev
```

```
# 테스트용 서버 URL
http://localhost:3000
```

<br />

# 📝 Routing 구조

Page 1. "/" : 로그인 페이지
Page 2. "/app-list" : API 목록 조회 및 호출 목록 조회 페이지

<br />

# 🎩 Tech Stack

## 📤 FrontEnd

|                                                                                    TypeScript                                                                                     |                                                                                       Next                                                                                       |                                                                                    Redux                                                                                     |                                                                                    TailwindCss                                                                                     |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <div style="display: flex; align-items: flex-start; justify-content: center;"><img src="https://cdn.simpleicons.org/typescript/3178C6" alt="icon" width="75" height="75" /></div> | <div style="display: flex; align-items: flex-start; justify-content: center;"><img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="icon" width="75" height="75" /></div> | <div style="display: flex; align-items: flex-start; justify-content: center;"><img src="https://cdn.simpleicons.org/redux/764abc" alt="icon" width="75" height="75" /></div> | <div style="display: flex; align-items: flex-start; justify-content: center;"><img src="https://cdn.simpleicons.org/tailwindcss/06b6d4" alt="icon" width="75" height="75" /></div> |

<br />

## 🌍서비스 배포 환경

- Vercel

<br>

# ✅ 주요 기능

## 1. 로그인 페이지

![Login]("//ecimg.cafe24img.com/pg972b74884267083/leemjaejun/login.png")

### 1) 로그인 기능 구현

- **제공된 엔드포인트**로 `POST` 요청을 보내, 서버에서 로그인 검증을 받은 뒤 **JWT(JSON Web Token)** 을 발급받습니다.
- 서버로부터 전달받은 `accessToken`을 **로컬 스토리지(localStorage)**에 저장하여, 브라우저 새로고침 시에도 세션 정보를 유지하도록 했습니다.
- 토큰 디코딩 과정에서는 `iat(발급 시점)`과 `exp(만료 시점)` 값을 추출하여, 이후 유효시간 검증에 활용합니다.

### 2) 상태 관리와 화면 전환

- **Redux Toolkit**을 사용하여 `authSlice`에서 토큰과 사용자 정보를 관리합니다.
- 로그인 성공 시 `dispatch(setAuth(...))`로 토큰 및 유저 정보를 Redux 전역 상태에 반영하고, `localStorage`에도 동기화합니다.
- **Next.js의 `router.push`**를 통해 로그인 성공 후 특정 페이지(`api-list`)로 라우팅하여, 사용자가 로그인 후 기능 페이지에 즉시 접근할 수 있도록 했습니다.
- 로그인 실패 시 서버에서 전송되는 `errYn` 또는 `msg` 값을 확인하여, 에러 메시지를 UI에 표시하고, 디버깅이 용이하도록 콘솔에 함께 로깅합니다.

### 3) UI 및 사용자 경험

- **아이디와 비밀번호**를 입력받는 간단한 폼을 구성하였으며, Tailwind CSS로 스타일링을 적용했습니다.
- 사용자가 **Enter** 키를 누르는 경우에도 로그인 요청이 실행되도록 `onKeyDown` 이벤트를 처리했습니다.
- 에러 메시지는 빨간색 텍스트로 노출되어, 사용자가 로그인이 실패했음을 직관적으로 파악할 수 있습니다.

<br />

## 2. 유효시간 체크

### 1) JWT 만료 시간 확인

- **JWT**가 발급될 때 토큰에 포함되는 `exp`(만료 시간) 값을 로컬 스토리지와 Redux 상태에 함께 저장합니다.
- 매 요청 전, 혹은 특정 **주기적 검사(Interval)** 또는 **페이지 접근 시** `exp` 값을 확인하여 현재 시간과 비교합니다.
- 만료 시간이 지났다면 자동으로 로그아웃을 트리거해 사용자에게 재인증을 요구합니다.

### 2) 자동 로그아웃 처리

- `clearAuth` 액션을 통해 Redux 상태와 `localStorage`에 저장된 토큰 관련 정보를 모두 삭제합니다.
- 만료 또는 로그아웃 시 **Next.js의 `router.push`**를 사용해 로그인 페이지로 강제 이동시켜, 더 이상 인증이 만료된 사용자가 보호된 페이지에 머무르지 않도록 합니다.
- 이 로직을 **클라이언트 측에서만** 수행하기 위해, `useEffect` 등을 통해 브라우저 환경임을 확인한 뒤 체크하는 방식을 자주 택합니다.

### 3) 보안 고려사항

- 원칙적으로 **JWT**를 클라이언트에서 보관할 때는 `localStorage`보다는 **HTTPOnly 쿠키**를 권장하지만, 이번 구현에서는 간편함과 빠른 개발을 위해 `localStorage`를 사용했습니다.
- 민감한 정보는 가능한 **JWT 페이로드** 내에 최소화하고, 추가 보안이 필요한 경우 **Refresh Token** 전략을 고려할 수 있습니다.

<br />

## 3. 사용된 기술

### 1) Next.js (13+ 버전)와 React

- **App Router(`app` 디렉토리)** 기반으로, 화면 전환과 서버-클라이언트 간 데이터 연동을 간편화했습니다.
- **서버 컴포넌트**와 **클라이언트 컴포넌트** 분리로, 인증 로직은 클라이언트 컴포넌트(`"use client"`)에서 처리하도록 구성했습니다.

### 2) Redux Toolkit

- 로그인 상태를 전역으로 관리하기 위해 **Redux Slice**를 사용했습니다.
- `createSlice`로 `authSlice`를 정의하고, **토큰 저장**과 **토큰 제거**를 직관적인 액션(`setAuth`, `clearAuth`)으로 관리합니다.
- Redux 상태 변경 시 **로컬 스토리지**와 즉시 동기화하여, 페이지 새로고침 이후에도 저장된 데이터를 복원합니다.

### 3) 로컬 스토리지와 JWT

- **로컬 스토리지**: 사용자 토큰과 만료 시간을 저장하고, 필요 시 바로 읽어올 수 있도록 구현했습니다.
- **JWT 파싱**: `atob` 함수를 통해 토큰의 페이로드를 디코딩하고, 만료 시간(`exp`)과 발급 시점(`iat`), 그리고 사용자 식별자(`identification`) 등의 정보를 추출합니다.
- **재사용성**: 추후 API 호출 시 헤더에 토큰을 실어 서버에 인증을 보낼 수 있도록, Redux 상태에서 토큰을 가져와 사용합니다.

<br />

## 정리

이 프로젝트는 **로그인 후 권한이 필요한 페이지**에 접근할 수 있도록 하는 **인증/인가 시스템**으로,

- **Next.js**로 UI/라우팅을 구성하고,
- **Redux Toolkit**으로 토큰/유저정보를 전역 관리,
- **JWT** 만료 시간을 확인해 자동으로 로그아웃하는 로직을 구현했습니다.

이를 통해 유지보수성과 보안성을 모두 고려하면서도, 사용자가 재로그인 없이 **원활하게 서비스를 이용**할 수 있는 환경을 제공했습니다.

<br />

## TokenManager (유효시간 관리 컴포넌트)

![TokenManager]("//ecimg.cafe24img.com/pg972b74884267083/leemjaejun/tokenmanager.png")

### 1) 컴포넌트 역할

- **토큰의 만료 시간**(expireAt)을 모니터링하여, 남은 시간이 0이 되면 **자동으로 로그아웃**을 수행합니다.
- 로그인 후 부여된 토큰의 유효시간을 늘리거나 줄여볼 수 있는 버튼들을 제공하여, 실시간으로 만료 시점을 변경할 수 있습니다.

### 2) 유효시간 추적 로직

- `remainingTime` 상태를 매 1초마다 갱신(`setInterval`)하여, `localStorage`에 저장된 `expireAt`과 현재 시간을 비교합니다.
- 만약 `remainingTime`이 0 이하가 되면 만료로 간주하고 **로그아웃**을 유도합니다.
- 유효시간이 정상적으로 남아 있는 경우, `formatTime` 함수를 통해 **사람이 읽기 쉬운 형태**(시, 분, 초)로 변환해 화면에 표시합니다.

### 3) 만료 시간 변경 기능

- **+/- 버튼**: `changeExpireTime(deltaDuration)` 함수를 통해 `expireAt`을 `deltaDuration`만큼 조정할 수 있습니다.
  - 예: `-1분`, `-10분`, `+10분`, `+1시간` 등 버튼 클릭 시 만료 시점을 앞당기거나 늦춥니다.
- **즉시 만료**: `handleImmediateExpire` 함수를 사용하여 만료 시간을 0으로 설정하고, **바로 로그아웃 처리**를 합니다.
- 만료 시점이 현재 시간(`Date.now()`) 이하가 되면 만료로 보고 `handleLogout()`을 호출해, **Redux** 상태와 `localStorage`에서 인증 정보를 제거한 뒤 **로그인 페이지**로 리다이렉트합니다.

### 4) 로그아웃 처리

- `clearAuth()` 액션을 디스패치해 **Redux**의 `auth` 관련 상태(토큰, 유저 정보 등)와 브라우저 `localStorage`에 저장된 값들을 모두 제거합니다.
- `router.push("/")`로 **로그인 페이지**로 이동하여, 만료된 사용자가 더 이상 보호된 페이지에 머무르지 않도록 합니다.

### 5) 사용된 기술

- **React**와 **Next.js**: 컴포넌트 구조 및 라우팅을 담당. `"use client"`를 통해 클라이언트 컴포넌트로 동작.
- **Redux Toolkit**: `clearAuth` 액션으로 전역 인증 상태를 한 번에 처리.
- **localStorage**: 토큰 만료 시점(`expireAt`)을 저장하고 수정하며, 컴포넌트에서 이를 **실시간 체크**하여 만료 여부를 판별.

<br />

## 정리

이 `TokenManager` 컴포넌트는 **JWT 토큰 유효시간**을 실시간으로 추적·조정하며, 만료 시점이 지나면 **자동 로그아웃**하는 핵심 로직을 담당합니다.  
이를 통해 **사용자 세션**을 안전하고 유연하게 관리하고, 테스팅 시 **만료 시점**을 자유롭게 바꿔 볼 수 있는 **개발 유틸** 역할도 수행합니다.

<br />
