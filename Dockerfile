# Build the front-end application
FROM node:9.6.1 as builder
WORKDIR /frontend
COPY frontend /frontend
RUN npm install
RUN npm run build

FROM maven:alpine

WORKDIR /app
COPY pom.xml pom.xml
RUN ["mvn", "dependency:go-offline"]

COPY src src
COPY --from=builder /frontend/build src/main/resources/app
RUN ["mvn", "package"]

COPY config config
VOLUME /app/config

ENTRYPOINT ["java", "-jar", "target/iceberg-1.0.0.jar", "server", "config/config.yml"]