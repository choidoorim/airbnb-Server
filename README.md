# :star2: 13th airbnb project
- 소프트스퀘어드 6 ~ 8주차 모의외주 프로젝트로 총 2명에서 진행했습니다.

### :file_folder: 디렉토리 구조
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
📄 README.md
📄 index.js
📄 package.json
📄 TemplateExplanation.md
```

### :bar_chart: ERD 설계
- AqueryTool Link: URL : https://aquerytool.com/aquerymain/index/?rurl=f17ec6fa-037e-4891-bb83-01f380b936f5&
- AqueryTool Password : m87261

![dd](https://user-images.githubusercontent.com/63203480/121947822-76ae0480-cd91-11eb-8cb5-8c616af2d4f8.PNG)

### :exclamation: Role
- :page_with_curl: ERD 설계
- :mountain_bicyclist: 숙소 기능 API 개발
- :book: 위시리스트 기능 API 개발
- :swimmer: 여행 기능 API 개발
- :computer: AWS EC2, RDS 서버 관리
- :pencil: Refactoring
  - 비밀번호 암호화 방법 수정(hashed -> hashed + salt), 이메일 로그인 로직 수정(DB의 salt 값 활용 - hashed 로만 암호시 보안에 좋지 않기 때문에 수정.

### :rocket: 사용한 외부 API
- :mailbox: nodeMailer
- :earth_americas: node-Geocoder

### :clipboard: Architecture
![아키텍처](https://user-images.githubusercontent.com/63203480/122184639-613af680-cec7-11eb-8cd1-d99b8c7a70d1.PNG)

