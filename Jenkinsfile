pipeline {
    agent any

    environment {
        DOCKER_IMAGE_API = 'dalton9819/avatars-backend'
        DOCKER_IMAGE_WEB = 'dalton9819/avatars-frontend'
        DOCKER_TAG = '0.0.2'
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build API Docker Image') {
            steps {
                dir('api') {
                    script {
                        sh 'docker build -t $DOCKER_IMAGE_API:$DOCKER_TAG .'
                    }
                }
            }
        }

        stage('Build Web Docker Image') {
            steps {
                dir('web') {
                    script {
                        sh 'docker build -t $DOCKER_IMAGE_WEB:$DOCKER_TAG .'
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withDockerRegistry([credentialsId: "$DOCKER_CREDENTIALS", url: 'https://index.docker.io/v1/']) {
                    sh 'docker push $DOCKER_IMAGE_API:$DOCKER_TAG'
                    sh 'docker push $DOCKER_IMAGE_WEB:$DOCKER_TAG'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'kubectl apply -f backend-deployment.yaml'
                    sh 'kubectl apply -f frontend-deployment.yaml'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
