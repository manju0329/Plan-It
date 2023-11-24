
# :beach_with_umbrella: : PLAN_IT





## :person_frowning: 팀원

- 이민주
- 김하은

| 필수 기능 |  |
| -------- | ------------------ |
| 게시판 기능 | :white_check_mark: |
| 메인페이지 화면 | :white_check_mark: |
| 회원관리 기능 | :white_check_mark: |
| 관광지 조회 기능 | :white_check_mark: |

| 추가 기능 |  |
| -------- | ------------------ |
| 여행 계획 기능 | :white_check_mark: |
| 핫플레이스 기능 | :white_check_mark: |
| 관리자 화면 | :white_check_mark: |


## ⚒️ 화면 구성
### 1. 메인 페이지
- 메인 페이지입니다. 상단의 메뉴는 현재 로그인 상태, 사용자 권한에 따라 다르게 출력됩니다.    
<br/>
![image](/uploads/861d4a663f943cea159dc2699d30cfcc/image.png)

- 등록된 핫플레이스 중 좋아요 기준으로 상위 6개 관광지가 메인 화면에 출력됩니다.<br/><br/>
![image](/uploads/09cbd47951e8e503d86070ae79be27fc/image.png)


### 2. 회원 기능
- 로그인 화면 입니다.<br/><br/>
![image](/uploads/9eaa4046612d097a806239c80b7619f1/image.png)

- 회원가입 화면입니다.<br/><br/>
![image](/uploads/f2f0070965d7b9b784401b6437ce8b6f/image.png)

- 로그인 후 마이페이지에서 자신의 정보를 조회하고 수정할 수 있습니다.<br/><br/>
![image](/uploads/fc6032e6dd74a3f8eb4db9f984256f53/image.png)

- 관리자 계정으로 로그인했다면 ADMIN 메뉴에서 전체 회원 정보를 조회하고 수정할 수 있습니다.<br/><br/>
![image](/uploads/6b91f3c5ff060d4ea1dcc846157875f0/image.png)

### 3. 게시판 기능
- 자유게시판에서 게시글을 작성할 수 있습니다.<br/><br/>
![게시글작성](/uploads/e9c6f9e7687a8faabbffc79f8507b996/스크린샷_2023-11-12_오후_4.32.22.png)

- 전체 게시글을 조회할 수 있습니다. 이때 관리자 계정이 작성한 글은 자동으로 공지사항으로 상단에 고정됩니다.<br/><br/>
![image.png](./image.png)

- 키워드를 통해 게시글을 검색할 수 있습니다.<br/><br/>
![게시글검색](/uploads/1ceba2374460d1d827853904405b1955/스크린샷_2023-11-12_오후_4.25.16.png)

- 게시글 상세 조회 화면입니다.<br/><br/>
![게시글상세조회](/uploads/c4202f7a0c6df617c9dc75c2be4b71e2/스크린샷_2023-11-12_오후_4.27.02.png)




### 4. 관광지 조회 기능
- 관광지 조회 화면입니다. 지역별 및 유형별로 관광지를 조회할 수 있습니다.
- 조회된 관광지를 클릭하면 해당 위치로 지도가 이동합니다.<br/><br/>
![image](/uploads/13c8ce3a8e1e8a0b7256121da7bb13a3/image.png)

- 모달창을 통한 상세 정보 보기가 가능합니다.<br/><br/>
![image-1.png](./image-1.png)

### 5. 여행 계획 기능
- 조회된 관광지를 기반으로 여행 계획을 등록할 수 있습니다.
- 계획에 추가한 관광지를 실시간으로 확인할 수 있으며 드래그를 통한 순서 변경, 삭제, 추가가 가능합니다.
- 계획에 등록된 관광지가 변경될 때마다 동적으로 추천 경로와 예상 시간, 거리가 출력됩니다.<br/><br/>
![image-2.png](./image-2.png)

- 전체 여행 계획 조회 화면입니다. 키워드를 통한 검색, 내가 작성한 계획만 모아서 조회할 수 있습니다.<br/><br/>
![image-3.png](./image-3.png)

- 여행 계획 상세 조회 화면입니다. 저장된 관광지에 대한 경로와 상세정보를 확인할 수 있습니다.<br/><br/>
![image-4.png](./image-4.png)


### 6. 핫플레이스 기능
- 여행 계획 상세 조회 화면에서 핫플레이스 등록 버튼을 통해 계획에 포함된 관광지 중 하나를 핫플레이스로 등록할 수 있습니다.<br/><br/>
![image-5.png](./image-5.png)

- 핫플레이스 전체 조회 화면입니다. 작성자가 등록한 이미지를 기준으로 썸네일 형식의 리스트를 확인할 수 있습니다.<br/><br/>
![image-6.png](./image-6.png)

- 핫플레이스 상세 조회 화면입니다. 마음에 드는 관광지는 좋아요 버튼을 누를 수 있습니다. 이때 좋아요는 중복으로 반영되지 않습니다.<br/><br/>

- 지역별로 등록된 핫플레이스와 내가 좋아요를 누른 핫플레이스를 조회할 수 있습니다.<br/><br/>

- 등록된 핫플레이스 중 사용자가 추가한 핫플레이스를 사용하여 여행 계획을 등록할 수 있습니다.<br/><br/>
![image-8.png](./image-8.png)

## ⚒️ 시스템 구성
### ERD
---
![image](/uploads/cffb671a5c7a1d1b67c41386262c836c/image.png)

### 클래스 다이어그램
---
![image](/uploads/672c9df9a389dcbec586bcafef847322/image.png)

## ⚒️ 전체 API 리스트
![screencapture-localhost-8080-enjoytrip-swagger-ui-index-html-2023-11-24-11_38_59](/uploads/7fec113ef06e56bac604e4258e729704/screencapture-localhost-8080-enjoytrip-swagger-ui-index-html-2023-11-24-11_38_59.png)
