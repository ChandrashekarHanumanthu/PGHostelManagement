package com.pgms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.pgms")
public class PgHostelBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PgHostelBackendApplication.class, args);
    }
}

