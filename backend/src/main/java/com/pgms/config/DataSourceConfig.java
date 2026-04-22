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
            @Value("${DB_PASSWORD}") String password,
            @Value("${DB_MAX_POOL_SIZE:1}") int maxPoolSize,
            @Value("${DB_MIN_IDLE:0}") int minIdle,
            @Value("${DB_CONNECTION_TIMEOUT_MS:30000}") long connectionTimeoutMs,
            @Value("${DB_IDLE_TIMEOUT_MS:600000}") long idleTimeoutMs,
            @Value("${DB_MAX_LIFETIME_MS:1800000}") long maxLifetimeMs
    ) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(normalizeJdbcUrl(rawDbUrl));
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setMaximumPoolSize(maxPoolSize);
        dataSource.setMinimumIdle(minIdle);
        dataSource.setConnectionTimeout(connectionTimeoutMs);
        dataSource.setIdleTimeout(idleTimeoutMs);
        dataSource.setMaxLifetime(maxLifetimeMs);
        dataSource.setPoolName("pgms-hikari");
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
