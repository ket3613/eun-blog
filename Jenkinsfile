pipeline {
  agent any
  environment {
    DEPLOY_DIR = '/home/ket3613/Desktop/eun-blog'   // 배포 폴더(호스트와 마운트되어 있어야 함)
    IMAGE      = 'eun-blog:latest'                  // 빌드될 이미지 태그
  }
  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Docker Build') {
      steps {
        sh '''
          # 리포 루트의 Dockerfile로 멀티스테이지 빌드
          docker build -t ${IMAGE} ${WORKSPACE}
        '''
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          # 배포 폴더 준비 및 compose 파일 배치
          mkdir -p ${DEPLOY_DIR}
          cp -f ${WORKSPACE}/docker-compose.yml ${DEPLOY_DIR}/

          # 컨테이너 기동/갱신
          cd ${DEPLOY_DIR}
          docker compose up -d --force-recreate --build web || true

          # 상태 출력
          docker compose ps
        '''
      }
    }
  }
}
