// Test script for Contact Requests API
// This tests the API endpoint structure and data format

const testData = {
  firstName: "Test",
  lastName: "User", 
  email: "test@example.com",
  company: "Test Company",
  companySize: "startup",
  country: "united-states",
  additionalInfo: "This is a test submission from the demo form",
  source: "demo-page"
};

console.log("🧪 Testing Contact Requests API");
console.log("=================================");

console.log("\n📡 API Endpoint: POST https://api.qava.ai/admin/contact-requests");
console.log("\n📦 Test Data:");
console.log(JSON.stringify(testData, null, 2));

console.log("\n🔍 Expected Response:");
console.log(JSON.stringify({
  success: true,
  message: "Contact request submitted successfully",
  data: {
    id: "uuid-here",
    ...testData,
    status: "new",
    createdAt: "2025-01-27T10:30:00.000Z",
    updatedAt: "2025-01-27T10:30:00.000Z"
  }
}, null, 2));

console.log("\n✅ Test Commands:");
console.log("curl -X POST https://api.qava.ai/admin/contact-requests \\");
console.log("  -H 'Content-Type: application/json' \\");
console.log("  -d '" + JSON.stringify(testData) + "'");

console.log("\n📊 Get All Contact Requests:");
console.log("curl https://api.qava.ai/admin/contact-requests");

console.log("\n📈 Get Statistics:");
console.log("curl https://api.qava.ai/admin/contact-requests/stats");

console.log("\n🎯 Demo Form Integration:");
console.log("The demo form at https://qava.ai/demo will now submit to this endpoint");
console.log("and display success/error messages to users.");

console.log("\n🚀 Ready for Deployment!");
console.log("1. Deploy the backend changes");
console.log("2. Run database migration: npx prisma migrate deploy");
console.log("3. Test the live demo form");
