// This Jenkinsfile uses the declarative syntax. If you need help, check:
// Overview and structure: https://jenkins.io/doc/book/pipeline/syntax/
// For plugins and steps:  https://jenkins.io/doc/pipeline/steps/
// For Github integration: https://github.com/jenkinsci/pipeline-github-plugin
// For credentials:        https://jenkins.io/doc/book/pipeline/jenkinsfile/#handling-credentials
// For credential IDs:     https://ci.ts.sv/credentials/store/system/domain/_/
// Docker:                 https://jenkins.io/doc/book/pipeline/docker/
// Custom commands:        https://github.com/Tradeshift/jenkinsfile-common/tree/master/vars
// Environment variables:  env.VARIABLE_NAME

pipeline {
    agent any // Or you could make the whole job or certain stages run inside docker
    triggers {
        issueCommentTrigger('^retest$')
    }
    // For Java people
    tools {
        jdk 'oracle-java10.0.1-jdk'
        maven 'apache-maven-3.5.0'
    }
    environment {
        P12_PASSWORD = credentials 'client-cert-password'
        MAVEN_OPTS = "-Djavax.net.ssl.keyStore=/var/lib/jenkins/.m2/certs/jenkins.p12 \
                       -Djavax.net.ssl.keyStoreType=pkcs12 \
                       -Djavax.net.ssl.keyStorePassword=$P12_PASSWORD"
    }
    stages {
        stage('Initialise PR') {
            when { changeRequest() }
            steps {
                // We need to reset the SonarQube status in the beginning
                githubNotify(status: 'PENDING', context: 'sonarqube', description: 'Not analysed')
            }
        }
        stage('Clone') {
            steps {
                checkout scm
            }
        }
        stage('Sonarqube') {
            when {
                anyOf {
                    branch 'master' // Only run Sonarqube on master...
                    changeRequest() // ... and PRs
                }
            }
            steps {
                sonarqube()
            }
        }
        stage('Download dependencies') {
            steps {
                sh 'mvn -B dependency:go-offline'
            }
        }
        stage('Compile') {
            steps {
                sh 'mvn -B compile'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn -B test'
            }
        }
        stage('Docker') {
            when {
                anyOf {
                    branch 'master' // Only build docker images on master
                    changeRequest() // ... and PRs
                }
            }
            steps {
                script {
                    def name = "docker.tradeshift.net/iceberg:${env.GIT_COMMIT}"
                    docker.build(name).push()
                    if (env.CHANGE_ID) { //PR
                        pullRequest.comment("pushed `$name`")
                    }
                }
            }
        }

    }
}

