# Pium Planning 관리자 페이지 — PRD

## 1. 배경 / 목적
- Pium 담당자가 개발자 개입 없이 직접 공연 정보를 등록/수정/삭제할 수 있는 내부 도구
- 랜딩페이지에 표시되는 모든 공연 데이터, 공연 의뢰 문의를 이 admin에서 관리

## 2. 타겟 사용자
| 사용자 유형 | 니즈 |
|---|---|
| Pium 담당자 (관리자, 1~2인) | 공연 등록/수정/삭제를 직접, 반복적으로 처리 / 외부 의뢰 문의 확인 |

## 3. 브랜드 가이드
- 랜딩과 톤을 맞추되, 내부 도구이므로 화려한 장식보다 가독성·작업 효율 우선
- 메인 컬러 `#149684`는 포인트(버튼, 상태 배지)로만 사용, 배경은 무채색 계열 유지

## 4. 기능 구성
1. **로그인**
   - Firebase Auth (이메일/비밀번호), 소셜로그인 불필요
2. **공연 관리**
   - 등록 폼: 제목, 시작일, 종료일, 장소, 설명, 포스터 업로드, 상태(예정/진행중/종료), **예매 오픈일, 예매 상태(예매중/예매예정/마감), 외부 예매 링크(URL)** — 랜딩의 "진행될 공연/진행된 공연" 탭은 이 상태값 기준으로 자동 분류 (별도 카테고리 필드 불필요)
   - 목록: 등록된 공연 리스트, 각 항목 수정/삭제
3. **공연 의뢰 문의 관리**
   - inquiries 목록 확인 (문의자명, 연락처, 공연유형, 희망일정, 문의내용, 접수일시)
   - 상태 변경 (신규 → 처리완료)

## 5. 데이터 구조

### `performances` 컬렉션
| 필드 | 타입 | 설명 |
|---|---|---|
| title | string | 공연 제목 |
| startDate | string (YYYY-MM-DD) | 시작일 |
| endDate | string (YYYY-MM-DD) | 종료일 |
| location | string | 장소 |
| description | string | 설명 |
| posterUrl | string | 포스터 이미지 URL (Firebase Storage) |
| status | string | upcoming / ongoing / ended (랜딩의 "진행될 공연/진행된 공연" 탭 분류 기준) |
| openDate | string (YYYY-MM-DD HH:mm) | 예매 오픈일시 |
| ticketStatus | string | 예매중 / 예매예정 / 마감 |
| ticketUrl | string | 외부 예매 사이트 URL |
| createdAt | timestamp | 생성 시각 |

### `inquiries` 컬렉션
| 필드 | 타입 | 설명 |
|---|---|---|
| name | string | 문의자명 |
| contact | string | 연락처 |
| performanceType | string | 공연 유형 |
| preferredDate | string | 희망 일정 |
| message | string | 문의 내용 |
| status | string | new / done |
| createdAt | timestamp | 접수 시각 |

## 6. 기술 스택
- 프론트: HTML/CSS/JS (바닐라)
- 백엔드: Firebase (Auth, Firestore, Storage)
- 배포: Vercel

## 7. 개발 순서
1. 로그인 화면
2. 공연 등록/수정/삭제 — *스켈레톤 1차 작업 완료 (기존 상태값 구조 그대로 활용 가능)*
3. 공연 의뢰 문의 목록 + 상태 변경 기능
4. Pium 실사용 피드백 반영

## 8. 범위에서 제외 (Out of Scope)
- 다중 관리자 권한 분리
- 통계 대시보드
- 의뢰 문의 자동 답장(이메일 발송)

## 9. 성공 기준
- Pium 담당자가 개발자 개입 없이 공연 정보를 직접 등록 가능
- 외부 공연 의뢰 문의를 놓치지 않고 admin에서 확인 가능
