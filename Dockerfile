# Build the front-end application
FROM node:9.6.1 as build-fe

WORKDIR /frontend
COPY frontend /frontend
RUN npm install
RUN npm run build

FROM maven:alpine as build-be

WORKDIR /backend
COPY pom.xml pom.xml
RUN ["mvn", "-B", "dependency:go-offline"]

COPY src src
COPY --from=build-fe /frontend/build src/main/resources/app
RUN ["mvn", "-B", "package"]

FROM openjdk:8-jre-alpine
WORKDIR /app

COPY --from=build-be /backend/target/iceberg*.jar iceberg.jar
COPY config config
VOLUME /app/config

ENTRYPOINT ["java", "-jar", "iceberg.jar", "server", "config/config.yml"]