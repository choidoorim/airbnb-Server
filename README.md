# 13th airbnb project


:file_folder:디렉토리 구조
```bash
📂 config
 ├── 📄baseResponseStatus.js 
 ├── 📄database.js
 ├── 📄email.js
 ├── 📄express.js
 ├── 📄googleMap.js
 ├── 📄jwtMiddleware.js
 ├── 📄resEmail.js
 ├── 📄response.js
 ├── 📄secret.js
 ├── 📄winston.js
📂 src
 └── 📂 Chat 
      ├── 📄chatController.js
      ├── 📄chatDao.js
      ├── 📄chatProvider.js
      ├── 📄chatRoute.js
      ├── 📄chatService.js
 └── 📂 Experience 
      ├── 📄experienceController.js
      ├── 📄experienceDao.js
      ├── 📄experienceProvider.js
      ├── 📄experienceRoute.js
      ├── 📄experienceService.js
 └── 📂 Room
      ├── 📄roomController.js
      ├── 📄roomDao.js
      ├── 📄roomProvider.js
      ├── 📄roomRoute.js
      ├── 📄roomService.js
 └── 📂 Search 
      ├── 📄searchController.js
      ├── 📄searchDao.js
      ├── 📄searchProvider.js
      ├── 📄searchRoute.js
      ├── 📄searchService.js
 └── 📂 Trip 
      ├── 📄tripController.js
      ├── 📄tripDao.js
      ├── 📄tripProvider.js
      ├── 📄tripRoute.js
      ├── 📄tripService.js
 └── 📂 User 
      ├── 📄userController.js
      ├── 📄userDao.js
      ├── 📄userProvider.js
      ├── 📄userRoute.js
      ├── 📄userService.js
 └── 📂 WishList 
      ├── 📄wishListController.js
      ├── 📄wishListDao.js
      ├── 📄wishListProvider.js
      ├── 📄wishListRoute.js
      ├── 📄wishListService.js
📄 .gitignore
📄 CREATE-TABLES.txt
📄 README.md
📄 index.js
📄 package.json
📄 TemplateExplanation.md
```

- 서버
    - 셀리나
    - 엘빈

## 일지
### 2021.05.22
- 서버
    - 기획서 작성
    - ERD 설계
    - API 명세서 작성
    - 클라이언트와 소통

### 2021.05.23
- 회의 진행, 클라이언트와 소통
- branch 나누어 git 작업
- 앨빈의 AWS 인스턴스 사용
- ERD 설계 마무리
- API 명세서 작성 마무리
- 기획서 수정

### 2021.05.24
- 셀리나
    - EC2 인스턴스 구축 
    - RDS 데이터베이스 구축 
    - dev/prod 서버 구축
    - SSL 구축
    - User API 개발 : 회원가입, 로그인, 자동로그인, 이메일 인증 등 6개
    - API 명세서 반영

- 앨빈
    - EC2 인스턴스 구축
    - RDS 데이터베이스 구축
    - test/product 서버 구축
    - SSL 적용
- 숙소 전체 데이터 조회 API 개발

### 2021.05.25

- 1차 피드백 진행

  - keypair 공유로 협업
  - 빠른 협업을 위해, 우선은 프론트엔드 개발자의 화면 위주로 서버 설계
- 셀리나
  - User API 개발 : 로그아웃, 탈퇴, 프로필 조회, 프로필 수정 등 5개
  - Success Response 반영
  - API 명세서 반영
  
- 앨빈
  - 숙소 조회 API 수정
  - 숙소 관련 조회, 등록 API 1차 완료 + JWT
  
### 2021.05.26
- 셀리나
  - User API 개발 : 개인정보 조회/수정
  - 소셜 로그인 구현 방법 공부
  - 프론트와 소통 + 로그인 오류 해결 (db check)
  - 앨빈의 서버와 컴퓨터 연결 시도
- 앨빈
  - 숙소 조회 API 수정
  - 위시리스트 조회 관련 1차 완료
  - API 명세서 반영

### 2021.05.27
- 셀리나
  - User API 개발 : 구글 로그인 구현
  - 프론트와 소통 + 로그인 연동 (우선 이메일 로그인만)
- 앨빈
  - 위시리스트 API 1차 완료 + JWT
  - 이전 예약, 예정된 예약 조회 API 개발 + JWT
  - API 명세서 반영 완료

### 2021.05.28
- 셀리나
  - Chat API 개발 : 채팅 생성/조회 1차 구현
  - Experience API 환경구축
- 앨빈
  - 호스트 정보 조회 API 개발
  - 사용자별 예약된 숙소 정보 조회 API 개발
  - 숙소 조회 관련 API 개선
  - API 명세서 반영
  - 서버 최신화
  
### 2021.05.29
- 셀리나
  - Chat API 개발 : 채팅 생성/조회 2차 구현
  - 채팅 시 ReservationTB에 예약문의 저장 기능 추가
- 앨빈
  - 호스트, 숙소 리뷰 등록 API 개발
  - 숙소 조회, 상세 조회 쿼리 수정  
  - 서버 최신화
  - API 명세서 반영

### 2021.05.30
- 셀리나
  - User API 개발 : 전화번호/이메일 검증 API 구현, 검증 시에 UserBadgeTB에 배지 저장 기능 추가
  - User API 개발 : 구글 소셜로그인 오류 해결, 구글/네이버/카카오 소셜로그인 구현 시도
  - API 명세서 작성
  
- 앨빈
  - 숙소 조회 데이터 추가
  - 최근 검색기록 조회, 등록 API 개발
  - API 명세서 반영
  - 서버 최신화

### 2021.05.31
- 셀리나
  - 피드백 전 API 검토
  - baseResponse 정리
  - API 명세서 작성
  - User API 개발 : 오류 수정, 코드 수정
  - Chat API 개발 : 채팅방 정보 조회
  - Chat API 개발 : 채팅 생성/조회 3차 구현(마무리)
  - Experience API 개발 : 조회 기능 구현
  
- 앨빈
  - API 명세서 작성
  - ROOM API 오류 수정 및 개선
  - 예약 정보 변경 API 1차 개발 완료
  - 서버 최신화 

### 2021.06.01

- 전체 피드백
  - 기존 숙소 API와 거의 비슷한 기능을 제공하는 체험 API를 구현하는 것보다 외부 API를 엮는 API들을 구현해봐도 좋을 것 같다.

- 앨빈
  - API 명세서 작성
  - 숙소 조회 API 오류 해결
  - 위시리스트 API 수정
  - 숙소 예약정보 변경 API 구현
  - 서버 최신화
  - firebase push notification 구현 시도.(ios 번들 id를 등록해야하기에 고려.)

- 셀리나
  - Experience API 개발 : 개발 보류
  - Payment API 개발 : 인앱 결제 구현 방법 조사
    - nicepay : 처음 구현 시도, 하지만 가입 과정이 복잡하고 돈을 지불해야 하는 점에서 보류
    - iamport : 무료 demo 구현 가능, 하지만 적은 소스 코드
  - Chat API 개발 : Socket.io 구현 방법 조사
  - User API 개발 : 소셜 로그인 구현 방법 조사

### 2021.06.02
- 셀리나
  - Payment API 개발 : iamport import해서 연습
- 앨빈
  - API 명세서 작성
  - 체험 찜 API 1차 구현
  - 유저가 예약시, 호스트가 예약 확정시 예약한 유저에게 메일 전송 기능 추가
  - 위시리스트 삭제 시 관련 데이터 모두 삭제되도록 기능 추가

### 2021.06.03
- 셀리나
  - 네이버, 카카오 소셜 로그인 구현
    - 카카오의 경우, 어플 검수 이후 사용자의 이메일을 불러오는 것이 가능해서 모의외주가 끝난 후에 더 구현해볼 생각이다.
  - 조회 sql문 수정
  - API 검토
  - API 명세서 작성
- 앨빈
  - API 명세서 작성
  - 전체적인 API 테스트 후 오류 발생하는 API 수정 진행
  - 예약 변경 시 메일 전송 기능 추가
  
