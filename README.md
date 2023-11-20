# **마음 연구소 코딩 테스트 (설문조사)**

**기술 스택**

```
- TypeScript
- Nest.js
- GraphQL
- TypeORM
- PostgreSQL
- Docker
- Jest
```

<hr><br>

**환경변수(.env)**

```
PORT=4000
TYPEORM_HOST= <예시 : postgres>
TYPEORM_PORT=5432
TYPEORM_USERNAME= <예시 : root>
TYPEORM_PASSWORD= <예시 : root>
TYPEORM_DATABASE=maum
```

<hr><br>

**서버 구동 방법**

```
- git clone https://github.com/zynoobb/mayeon-test.git

- 루트 폴더에 .env 생성 및 복사
(환경변수 HOST, USERNAME, PASSWORD가 다를 시 사용자 환경에 맞춰 수정해주세요.)

- yarn install

- docker-compose build

- docker-compose up

- "localhost:4000/graphql" 출력 시 서버 구동 성공
```

<hr><br>

**ERD**

![ERD](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbtkRNU%2FbtsAy7pfgjC%2F7RKA6hyUKkHTvJyJqMfiK0%2Fimg.png)

<hr><br>

**API 명세서**

![API명세서](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbguGHF%2FbtsAugnZwuY%2FDbkxOxLMqiiVs9gAp0TIx1%2Fimg.png)

<hr><br>

**아키텍쳐**

![아키텍쳐](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FMrT73%2FbtsACn56A42%2F2koOsY7CK825QApBN3yDkk%2Fimg.jpg)

<hr><br>

**깃 컨벤션**

| 태그     | 내용                     |
| -------- | ------------------------ |
| Setting  | 라이브러리 & 설정 추가   |
| Feat     | 기능 추가                |
| Update   | 기능 수정                |
| Delete   | 기능 삭제                |
| Remove   | 파일 삭제                |
| Fix      | 버그 수정                |
| Refactor | 코드 구조 개선           |
| Test     | 테스트 코드 추가 및 수정 |
| Docs     | ReadMe 파일 수정         |
