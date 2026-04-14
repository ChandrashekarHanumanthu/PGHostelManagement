# Flyway Migration Guide

This guide explains how to migrate from `ddl-auto=update` to Flyway for production-ready schema management.

## 🔄 What Changed

### Before (Risky)
- `spring.jpa.hibernate.ddl-auto=update` 
- Hibernate automatically modifies schema at runtime
- Risky for production, no version control, hard to track changes

### After (Safe)
- `spring.jpa.hibernate.ddl-auto=none`
- Flyway manages all schema changes through versioned migrations
- Safe for production, full version control, predictable changes

## 📁 Migration Files Created

1. **V1__Create_initial_schema.sql** - Complete database schema
2. **V2__Add_signup_token_expiry.sql** - Added token expiry field

## 🚀 How to Deploy

### For New Database (Recommended)
1. Start application with Flyway enabled
2. Flyway will automatically run V1 and V2 migrations
3. Database will be created with proper schema

### For Existing Database (Current Production)
1. **Backup your database first!**
2. Run application with Flyway enabled
3. Flyway will baseline existing schema
4. Future changes will be managed through migrations

## 🛠️ Migration Commands

### Maven Commands
```bash
# Check migration status
mvn flyway:info

# Run pending migrations
mvn flyway:migrate

# Validate migrations
mvn flyway:validate

# Show migration history
mvn flyway:history
```

### Application Startup
- Flyway runs automatically on application startup
- Migrations are applied before JPA initialization
- Failed migrations prevent application startup (safety feature)

## 📝 Adding New Migrations

### Naming Convention
- Format: `V{version}__{description}.sql`
- Example: `V3__Add_user_profile_table.sql`
- Version numbers must be sequential

### Process
1. Create new SQL file in `src/main/resources/db/migration/`
2. Write your schema changes
3. Test locally with `mvn flyway:migrate`
4. Commit to version control
5. Deploy - Flyway handles the rest

### Example Migration
```sql
-- V3__Add_user_preferences.sql
CREATE TABLE user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    theme VARCHAR(20) DEFAULT 'light',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## ⚠️ Important Notes

### Production Deployment
1. **Always backup database before major migrations**
2. **Test migrations in staging first**
3. **Monitor application startup logs**
4. **Have rollback plan ready**

### Common Issues
- **Out of order migrations**: Set `spring.flyway.out-of-order=true` temporarily
- **Checksum mismatches**: Use `mvn flyway:repair` after manual fixes
- **Failed migrations**: Fix SQL and rerun, or use `flyway:repair`

### Best Practices
- Keep migrations small and focused
- Add comments explaining complex changes
- Use transactions for multi-table changes
- Test with realistic data volumes

## 🔍 Configuration

### Current Settings
```properties
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
spring.flyway.validate-on-migrate=true
spring.flyway.out-of-order=false
spring.jpa.hibernate.ddl-auto=none
```

### Environment-Specific
```properties
# Development
spring.flyway.clean-disabled=false

# Production
spring.flyway.clean-disabled=true
```

## 📊 Benefits Achieved

1. **Safety**: No more automatic schema modifications
2. **Version Control**: All changes tracked in git
3. **Reproducibility**: Same schema in all environments
4. **Rollback Support**: Can revert problematic changes
5. **Team Collaboration**: Clear history of all changes
6. **Production Ready**: Enterprise-grade schema management

## 🆘 Troubleshooting

### Migration Failed on Startup
1. Check application logs for error details
2. Fix the SQL issue in the migration file
3. Run `mvn flyway:repair` if needed
4. Restart application

### Need to Modify Existing Migration
1. **Never modify applied migrations**
2. Create a new migration instead
3. Use `V{next_version}__Fix_previous_issue.sql`

### Database Schema Drift
1. Run `mvn flyway:info` to see differences
2. Create migration to align with expected schema
3. Avoid manual database changes

## 🎯 Next Steps

1. Test Flyway in development environment
2. Verify all existing functionality works
3. Plan first production migration carefully
4. Document migration procedures for your team

This migration makes your application production-ready with proper schema management!
