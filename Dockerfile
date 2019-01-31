FROM maven:alpine

WORKDIR /app
ADD pom.xml pom.xml
RUN ["mvn", "dependency:go-offline"]

ADD src /app/src
ADD config.yml config.yml
RUN ["mvn", "package"]
RUN ["java", "-jar", "target/iceberg-1.0.0.jar", "db", "migrate", "config.yml"]

EXPOSE 8080 8081
ENTRYPOINT ["java", "-jar", "target/iceberg-1.0.0.jar", "server", "config.yml"]