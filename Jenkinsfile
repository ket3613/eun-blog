pipeline {
  agent any
  environment {
    DEPLOY_DIR = '/home/ket3613/Desktop/eun-blog'   // 배포 폴더(호스트와 마운트되어 있어야 함)
    IMAGE      = 'eun-blog:latest'                  // 빌드될 이미지 태그
  }
  stages {
    stage('Checkout'){ steps { checkout scm } }

    stage('Build & Copy JAR') {
      steps {
        sh '''
          # gradle 또는 maven wrapper 자동 탐색
          WRAP=$(find . -maxdepth 3 -type f \\( -name gradlew -o -name mvnw \\) | head -n1 || true)
          [ -z "$WRAP" ] && echo "no gradle/maven wrapper" && exit 1

          # 래퍼 위치로 이동하여 빌드
          cd "$(dirname "$WRAP")"
          if [ "$(basename "$WRAP")" = "gradlew" ]; then
            chmod +x ./gradlew
            ./gradlew clean build -x test
          else
            chmod +x ./mvnw
            ./mvnw -B -DskipTests clean package
          fi

          # 산출물 중 첫 번째 JAR을 배포 폴더로 복사
          ART=$(find . -type f -name "*.jar" -not -name "*sources*" -not -path "*/original/*" | head -n1)
          [ -z "$ART" ] && echo "no jar produced" && exit 1

          mkdir -p ${DEPLOY_DIR}
          cp -f "$ART" ${DEPLOY_DIR}/eun-api.jar
          ls -l ${DEPLOY_DIR}   # 확인용
        '''
      }
    }

    stage('Prepare Docker context & Build') {
      steps {
        sh '''
          # 리포 루트의 Dockerfile을 배포 폴더(컨텍스트)로 복사
          cp -f ${WORKSPACE}/Dockerfile ${DEPLOY_DIR}/

          # 컨텍스트=DEPLOY_DIR (여기에 eun-api.jar 와 Dockerfile 둘 다 있어야 COPY 성공)
          docker build -t ${IMAGE} -f ${DEPLOY_DIR}/Dockerfile ${DEPLOY_DIR}
        '''
      }
    }

    stage('Deploy (compose)') {
      steps {
        sh '''
          # compose 파일도 컨텍스트에 두고 실행
          cp -f ${WORKSPACE}/docker-compose.yml ${DEPLOY_DIR}/ || true
          cd ${DEPLOY_DIR}
          docker compose up -d --force-recreate --build app || true
          docker compose ps
        '''
      }
    }
  }
}
