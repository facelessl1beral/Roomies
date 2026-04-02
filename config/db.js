// =============================================
// LOCAL-ONLY MOCK DATABASE - NO INTERNET NEEDED
// =============================================

console.log('✅ LOCAL MODE: Database fully disabled (mocked)');

const getUsers = (request, response) => {
    console.log('📋 getUsers called (mock data)');
    response.status(200).json([
        { id: 1, firstName: "Test", lastName: "Student", email: "test@kyu.ac.ug" }
    ]);
};

const connectDB = async () => {
    console.log('🔌 LOCAL MODE: Skipped all real database connections');
    return true;
};

module.exports = { getUsers, connectDB };
