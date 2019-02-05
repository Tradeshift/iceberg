FROM maven:alpine

WORKDIR /app
COPY pom.xml pom.xml
RUN ["mvn", "dependency:go-offline"]

COPY src src
RUN ["mvn", "package"]

COPY config config
VOLUME /app/config

ENTRYPOINT ["java", "-jar", "target/iceberg-1.0.0.jar", "server", "config/config.yml"]