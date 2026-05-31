package dz.univ.transcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TransCampusApplication {
    public static void main(String[] args) {
        SpringApplication.run(TransCampusApplication.class, args);
    }
}
