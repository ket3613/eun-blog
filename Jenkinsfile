pipeline {
  agent any
  environment {
    COMPOSE_DIR = '/host/eun-blog'
    SERVICE     = 'app'
    IMAGE       = 'eun-blog:latest'

    // 여기 추가
    NEXT_PUBLIC_API_BASE_URL = 'https://api.euntaek.cc'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build') {
      steps {
        sh '''
          set -eu

          # 환경변수 제대로 들어왔는지 확인 (디버깅용)
          echo "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}"

          docker build \
            --build-arg NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
            -t ${IMAGE} .
          cp -f ${WORKSPACE}/docker-compose.yml ${COMPOSE_DIR}/
          cd ${COMPOSE_DIR}
          docker compose up -d --force-recreate ${SERVICE}
          docker compose ps
        '''
      }
    }
  }
  post {
    always {
      sh 'docker ps -a | grep ${IMAGE} || true'
    }
  }
}
