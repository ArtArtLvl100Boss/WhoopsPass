/**
 * Secure encryption/decryption functions for password manager
 * Uses AES-GCM encryption with a derived key from the user's ID
 * Includes fallback to simple encryption for backward compatibility
 */

// Convert a string to a Uint8Array
const encoder = new TextEncoder()
const decoder = new TextDecoder()

// Prefix to identify the encryption method used
const ENCRYPTION_PREFIX = "AES-GCM:"

// Derive a cryptographic key from the user's ID
async function deriveKey(userId: string): Promise<CryptoKey> {
  try {
    // Use the user ID as the base for key derivation
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(userId), { name: "PBKDF2" }, false, [
      "deriveKey",
    ])

    // Salt should ideally be stored securely and separately
    // For this demo, we're using a fixed salt
    const salt = encoder.encode("SecureVaultSalt")

    // Derive the actual encryption key
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    )
  } catch (error) {
    console.error("Key derivation failed:", error)
    throw new Error("Failed to derive encryption key")
  }
}

// Encrypt a password
export async function encryptPassword(password: string, userId: string): Promise<string> {
  try {
    const key = await deriveKey(userId)

    // Generate a random initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Encrypt the password
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      encoder.encode(password),
    )

    // Combine the IV and encrypted data for storage
    const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength)
    encryptedArray.set(iv, 0)
    encryptedArray.set(new Uint8Array(encryptedData), iv.length)

    // Convert to base64 for storage and add prefix to identify encryption method
    return ENCRYPTION_PREFIX + btoa(String.fromCharCode(...encryptedArray))
  } catch (error) {
    console.error("Modern encryption failed, falling back to simple encryption:", error)
    // Fallback to simple encryption
    return encryptPasswordSync(password, userId)
  }
}

// Decrypt a password
export async function decryptPassword(encryptedPassword: string, userId: string): Promise<string> {
  try {
    // Check if this is encrypted with our modern method
    if (encryptedPassword.startsWith(ENCRYPTION_PREFIX)) {
      const encryptedData = encryptedPassword.substring(ENCRYPTION_PREFIX.length)

      // Convert from base64
      const dataArray = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))

      // Extract the IV and the encrypted data
      const iv = dataArray.slice(0, 12)
      const data = dataArray.slice(12)

      // Derive the key
      const key = await deriveKey(userId)

      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        data,
      )

      // Convert back to string
      return decoder.decode(decryptedData)
    } else {
      // This is an old-style encrypted password, use the sync method
      return decryptPasswordSync(encryptedPassword, userId)
    }
  } catch (error) {
    console.error("Modern decryption failed, trying legacy method:", error)
    // Try the old method as a fallback
    return decryptPasswordSync(encryptedPassword, userId)
  }
}

// Simple encryption for backward compatibility
export function encryptPasswordSync(password: string, key: string): string {
  // This is a simple XOR encryption for demonstration
  let result = ""
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    result += String.fromCharCode(charCode)
  }
  return btoa(result) // Base64 encode
}

// Simple decryption for backward compatibility
export function decryptPasswordSync(encryptedPassword: string, key: string): string {
  try {
    const decoded = atob(encryptedPassword) // Base64 decode
    let result = ""
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode)
    }
    return result
  } catch (error) {
    console.error("Legacy decryption failed", error)
    return "Decryption failed"
  }
}

