pipeline {
  agent any
  environment {
    COMPOSE_DIR = '/host/eun-blog'
    SERVICE = 'app'
    IMAGE = 'eun-blog:latest'
  }
  stages {
    // A 선택 시 Checkout stage 삭제
    stage('Build'){
      steps {
        sh '''
          set -eu
          docker build -t ${IMAGE} ${WORKSPACE}
        '''
      }
    }
    stage('Deploy'){
      steps {
        sh '''
          set -eu
          mkdir -p ${COMPOSE_DIR}
          cp -f ${WORKSPACE}/docker-compose.yml ${COMPOSE_DIR}/
          cd ${COMPOSE_DIR}
          docker compose up -d --force-recreate ${SERVICE}
          docker compose ps
        '''
      }
    }
  }
}
