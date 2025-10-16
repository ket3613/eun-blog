# 베이스 JRE 이미지 선택
FROM openjdk:17-jdk-slim

# 컨테이너 내부 작업 디렉터리
WORKDIR /app

# ↓ 빌드 컨텍스트(DEPLOY_DIR)에 있는 JAR을 복사
#    Jenkinsfile에서 컨텍스트를 DEPLOY_DIR로 설정했으므로 파일이 존재함
COPY eun-api.jar /app/app.jar

# 애플리케이션 포트(컨테이너 내부)
EXPOSE 8080

# 애플리케이션 실행 커맨드
ENTRYPOINT ["java","-jar","/app/app.jar"]
