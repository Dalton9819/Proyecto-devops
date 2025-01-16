pipeline {
    agent any

    environment {
        DOCKER_IMAGE_API = 'proyectodevops98/avatars-backend'
        DOCKER_IMAGE_WEB = 'proyectodevops98/avatars-frontend'
        DOCKER_REPO = 'proyectodevops98/avatars'
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
    }

    stages {
        stage('Input Tag') {
            steps {
                script {
                    // Solicitar al usuario el tag de la imagen
                    DOCKER_TAG = input message: 'Ingrese el tag de la imagen (e.g., 0.0.3)', parameters: [string(defaultValue: '0.0.3', description: 'Tag de la imagen', name: 'DOCKER_TAG')]
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build API Docker Image') {
            steps {
                dir('api') {
                    script {
                        sh "docker build -f Dockerfile -t $DOCKER_IMAGE_API:$DOCKER_TAG ."
                    }
                }
            }
        }

        stage('Build Web Docker Image') {
            steps {
                dir('web') {
                    script {
                        sh "docker build -f Dockerfile -t $DOCKER_IMAGE_WEB:$DOCKER_TAG ."
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withDockerRegistry([credentialsId: "$DOCKER_CREDENTIALS", url: 'https://index.docker.io/v1/']) {
                    sh "docker push $DOCKER_IMAGE_API:$DOCKER_TAG"
                    sh "docker push $DOCKER_IMAGE_WEB:$DOCKER_TAG"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh "sed -i 's#IMAGE_TAG#$DOCKER_TAG#g' backend-deployment.yaml"
                    sh "sed -i 's#IMAGE_TAG#$DOCKER_TAG#g' frontend-deployment.yaml"
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
            echo 'Pipeline ejecutado correctamente!'
        }
        failure {
            echo 'Pipeline falló!'
        }
    }
}
