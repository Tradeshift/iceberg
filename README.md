# iceberg
TEST

Aggregate data and visualize machine learning models

## Usage

### Docker

 * `docker run -p 8080:8080 imagename:version` Runs iceberg with default configurations
 * `docker run -p 8080:8080 -v /path/to/config:/app/config imagename:version ` Starts application with config file at `/path/to/config/config.yml`

### From source

 * `mvn clean package` Creates jar file
 * `java -jar target/iceberg-1.0.0.jar server config/config.yml` Starts application
 * Modify `config/config.yml` to e.g. use a different database 
