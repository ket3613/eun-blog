pipeline {
  agent any
  environment {
    COMPOSE_DIR = '/host/eun-blog'
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
          set -eu
          docker build -t ${IMAGE} .
        '''
      }
    }
    stage('Deploy') {
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
  post {
    always {
      sh 'docker ps -a | grep ${IMAGE} || true'
    }
  }
}
