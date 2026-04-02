
// =============================================
// MOCK SEQUELIZE - LOCAL DEVELOPMENT ONLY
// Stops the "Failed to load Sequelize" error
// =============================================

console.log('✅ LOCAL MODE: Sequelize mocked (no real DB)');

const Sequelize = {
    DataTypes: {},
    define: () => ({}),
    sync: async () => console.log('Sequelize sync skipped'),
};

const sequelize = {
    authenticate: async () => console.log('✅ Sequelize connection mocked'),
    close: async () => {},
    define: () => ({}),
};

module.exports = sequelize;
