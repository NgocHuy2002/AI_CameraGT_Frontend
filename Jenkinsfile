pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                echo 'Testing..'
                telegramSend(message: 'Building Job tCamera-traffic-dev Web...', chatId: -740504133)
            }
        }
        stage ('Deployments') {
            steps {
                echo 'Deploying to Production environment...'
                echo 'Copy project over SSH...'
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'swarm1',
                        transfers:
                            [sshTransfer(
                                cleanRemote: false,
                                excludes: '',
                                execCommand: "docker build -t registry.thinklabs.com.vn:5000/tcameratrafficdevweb ./thinklabsdev/tcameratrafficdevwebCI/ \
                                    && docker image push registry.thinklabs.com.vn:5000/tcameratrafficdevweb \
                                    && docker service rm tcameratrafficdev_web || true \
                                    && docker stack deploy -c ./thinklabsdev/tcameratrafficdevwebCI/docker-compose.yml tcameratrafficdev \
                                    && rm -rf ./thinklabsdev/tcameratrafficdevwebCIB \
                                    && mv ./thinklabsdev/tcameratrafficdevwebCI/ ./thinklabsdev/tcameratrafficdevwebCIB",
                                execTimeout: 600000,
                                flatten: false,
                                makeEmptyDirs: false,
                                noDefaultExcludes: false,
                                patternSeparator: '[, ]+',
                                remoteDirectory: './thinklabsdev/tcameratrafficdevwebCI',
                                remoteDirectorySDF: false,
                                removePrefix: '',
                                sourceFiles: '*, src/, server/, webpack/, public/'
                            )],
                        usePromotionTimestamp: false,
                        useWorkspaceInPromotion: false,
                        verbose: false
                    )
                ])
                telegramSend(message: 'Build Job tCamera-traffic-dev Web -STATUS: $BUILD_STATUS!', chatId: -740504133)
            }
        }
    }
}
