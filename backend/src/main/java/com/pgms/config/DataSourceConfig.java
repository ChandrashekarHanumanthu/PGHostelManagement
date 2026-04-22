package com.pgms.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource(
            @Value("${DB_URL}") String rawDbUrl,
            @Value("${DB_USERNAME}") String username,
            @Value("${DB_PASSWORD}") String password
    ) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(normalizeJdbcUrl(rawDbUrl));
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    private String normalizeJdbcUrl(String rawDbUrl) {
        String dbUrl = rawDbUrl == null ? "" : rawDbUrl.trim();

        if (dbUrl.startsWith("jdbc:")) {
            return dbUrl;
        }

        if (dbUrl.startsWith("mysql://")) {
            return "jdbc:" + dbUrl;
        }

        throw new IllegalArgumentException("DB_URL must start with 'jdbc:' or 'mysql://'");
    }
}
