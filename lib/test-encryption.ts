import { encryptPassword, decryptPassword } from './encryption';

async function testEncryption() {
  // Sample user ID and password
  const userId = "user123456789";
  const originalPassword = "MySecurePassword123!";
  
  console.log("Original password:", originalPassword);
  
  try {
    // Encrypt the password
    console.log("Encrypting password...");
    const encrypted = await encryptPassword(originalPassword, userId);
    console.log("Encrypted result:", encrypted);
    
    // Decrypt the password
    console.log("Decrypting password...");
    const decrypted = await decryptPassword(encrypted, userId);
    console.log("Decrypted result:", decrypted);
    
    // Verify
    if (decrypted === originalPassword) {
      console.log("✅ SUCCESS: Encryption and decryption working correctly!");
    } else {
      console.error("❌ FAILED: Decrypted password doesn't match original!");
    }
  } catch (error) {
    console.error("Error during encryption test:", error);
  }
}

// Run the test when imported in a browser environment
if (typeof window !== 'undefined') {
  console.log("Running encryption test...");
  testEncryption();
}

export { testEncryption };
