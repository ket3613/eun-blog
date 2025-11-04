
// Jenkins 파이프라인 정의
pipeline {
  // 모든 에이전트에서 실행 가능
  agent any
  
  // 환경 변수 설정
  environment {
    COMPOSE_DIR = '/host/eun-blog'  // Docker Compose 파일이 위치할 디렉토리
    SERVICE = 'app'                  // Docker Compose 서비스 이름
    IMAGE = 'eun-blog:latest'        // 빌드할 Docker 이미지 이름
  }
  
  stages {
    // A 선택 시 Checkout stage 삭제
    
    // Docker 이미지 빌드 단계
    stage('Build'){
      steps {
        sh '''
          set -eu  # 에러 발생 시 중단, 미정의 변수 사용 시 에러
          docker build -t ${IMAGE} ${WORKSPACE}  # 현재 워크스페이스에서 Docker 이미지 빌드
        '''
      }
    }
    
    // Docker Compose로 배포하는 단계
    stage('Deploy'){
      steps {
        sh '''
          set -eu
          mkdir -p ${COMPOSE_DIR}  # 배포 디렉토리 생성 (없으면)
          cp -f ${WORKSPACE}/docker-compose.yml ${COMPOSE_DIR}/  # docker-compose.yml 파일 복사
          cd ${COMPOSE_DIR}  # 배포 디렉토리로 이동
          docker compose up -d --force-recreate ${SERVICE}  # 서비스 강제 재생성 및 백그라운드 실행
          docker compose ps  # 실행 중인 컨테이너 상태 확인
        '''
      }
    }
  }
}