pipeline {
  agent any
  environment {
    COMPOSE_DIR = '/host/eun-blog'   // 호스트 경로 바인드 지점
    SERVICE = 'app'
    IMAGE = 'eun-blog:latest'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build') {
      steps {
        sh '''
          set -euo pipefail
          docker build -t ${IMAGE} ${WORKSPACE}
          docker images | grep eun-blog
        '''
      }
    }
    stage('Deploy') {
      steps {
        sh '''
          set -euo pipefail
          mkdir -p ${COMPOSE_DIR}
          cp -f ${WORKSPACE}/docker-compose.yml ${COMPOSE_DIR}/
          cd ${COMPOSE_DIR}
          # 서비스명 정확히
          docker compose up -d --force-recreate ${SERVICE}
          docker compose ps
        '''
      }
    }
  }
  post {
    always {
      sh 'docker ps -a | grep eun-blog || true'
    }
  }
}
