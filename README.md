# Tatum_Cloud_Project

## 1. API 및 i18n 관리 방안


### Swagger 기반 API 문서 자동화

저는 가장 근본적인 방법이 가장 명확하다고 생각합니다. 

기존처럼 Swagger를 직접 작성하고 Swagger 내용에 따라 프론트가 작업하는 방법도 있겠지만, 

이를 보조하는 방법으로 
- [Swagger / OpenAPI 공식문서](https://spec.openapis.org/oas/v3.1.0.html?utm_source=chatgpt.com) 와 같은 자동화 기능을 사용하는 방법이 있을 것 같습니다.
- 이 방식을 통해 모든 백엔드 API 명세를 자동화합니다.
- 프론트엔드에서 [openAPI-TypeScript](https://openapi-ts.dev/introduction) 등의 도구를 통해 Swagger 스키마를 변환하여 자동 생성하여 일관성을 확보하는 방안을 생각해보았습니다.


## 2. i18n 적용 방안

### 지역감지 및 캐싱로직을 통한 방안

- 사용자의 최초 접속 시에 브라우저의 언어 감지후 `localStorage`에 저장합니다.
- 이후 요청시에는 캐시된 locale을 기반으로 `.ko`, `.en`, `.ja` 파일을 즉시 로드합니다.
- i18n 파일버전을 쿠키 또는 로컬스토리지에 함께 저장하여 버전 불일치시 새로 로드하도록 구성하는 방안을 생각해봤습니다.
