// MongoDB initialization script - runs on container startup
db = db.getSiblingDB('dealflow');

// Create application user with appropriate permissions
db.createUser({
  user: 'dealflow_user',
  pwd: 'dealflow_app_password_2025',
  roles: [
    { role: 'readWrite', db: 'dealflow' },
    { role: 'dbOwner', db: 'dealflow' }
  ]
});

// Create collections with schema validation
db.createCollection('startup', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'sector', 'stage'],
      properties: {
        _id: { bsonType: 'objectId' },
        name: { bsonType: 'string', description: 'Startup name' },
        tagline: { bsonType: 'string' },
        sector: { bsonType: 'string', description: 'Industry sector' },
        stage: { bsonType: 'string', description: 'Funding stage' },
        location: { bsonType: 'string' },
        score: { bsonType: 'double', minimum: 0, maximum: 100 }
      }
    }
  }
});

db.createCollection('user', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'hashed_password'],
      properties: {
        _id: { bsonType: 'objectId' },
        email: { bsonType: 'string' },
        username: { bsonType: 'string' },
        hashed_password: { bsonType: 'string' },
        is_active: { bsonType: 'bool' }
      }
    }
  }
});

db.createCollection('deal', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['startup_id', 'user_id', 'startup_name'],
      properties: {
        _id: { bsonType: 'objectId' },
        startup_id: { bsonType: 'string' },
        user_id: { bsonType: 'string' },
        status: { bsonType: 'string' }
      }
    }
  }
});

// Create indexes for performance
db.startup.createIndex({ name: 1 });
db.startup.createIndex({ sector: 1 });
db.startup.createIndex({ stage: 1 });

db.user.createIndex({ email: 1 }, { unique: true });
db.user.createIndex({ username: 1 }, { unique: true });

db.deal.createIndex({ user_id: 1 });
db.deal.createIndex({ startup_id: 1 });
db.deal.createIndex({ status: 1 });

console.log('✅ MongoDB initialization complete');
console.log('📋 Created users:');
console.log('   - dealflow_admin (root access)');
console.log('   - dealflow_user (app access)');
console.log('✅ Created collections: startup, user, deal');
console.log('✅ Created indexes for performance');
