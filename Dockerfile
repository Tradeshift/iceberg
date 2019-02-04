FROM maven:alpine

WORKDIR /app
ADD pom.xml pom.xml
RUN ["mvn", "dependency:go-offline"]

ADD src /app/src
ADD config.yml config.yml
RUN ["mvn", "package"]

ENTRYPOINT ["java", "-jar", "target/iceberg-1.0.0.jar", "server", "config.yml"]