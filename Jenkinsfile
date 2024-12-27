pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'tonne/expressbackend'
        DOCKER_TAG = 'latest'
        TELEGRAM_BOT_TOKEN = '7856181372:AAEy-Ztmf9qwukKHEiN-_X35nwz2orCUQh0'
        TELEGRAM_CHAT_ID = '-4773169460'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'master', url: 'https://github.com/Tonyamano2727/Jenkins_Devop.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy Golang to DEV') {
            steps {
                echo 'Deploying to DEV...'
                sh 'docker image pull tonne/expressbackend:latest'
                sh 'docker container stop expressbackend || echo "this container does not exist"'
                sh 'echo y | docker container prune '

                sh 'docker container run -d --rm --name express_server -p 3001:3001 tonne/expressbackend:latest'
            }
        }
    }

    post {
        always {
            cleanWs()
        }

        success {
            sendTelegramMessage("✅ Build #${BUILD_NUMBER} was successful! ✅")
        }

        failure {
            sendTelegramMessage("❌ Build #${BUILD_NUMBER} failed. ❌")
        }
    }
}

def sendTelegramMessage(String message) {
    sh """
    curl -s -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
    -d chat_id=${TELEGRAM_CHAT_ID} \
    -d text="${message}"
    """
}
