
from cryptography.fernet import Fernet
from dotenv import load_dotenv
import os

load_dotenv()

encryptKey = 'KeB09b_ZfiFP1VZ-ui5NFyTGRadlDff844ueoU9IiJc='
print(encryptKey)

def passwordDecrypt(encryptedPassword):
    try:
        cipher_suite = Fernet(encryptKey)
        encryptedPassword_bytes = encryptedPassword.encode('utf-8')
        decrypted_text = cipher_suite.decrypt(encryptedPassword_bytes)
        decrypted_text = decrypted_text.decode('utf-8')
        print(decrypted_text)
        return decrypted_text
    except Exception as ex:
        print(f"Error during password decryption: {ex}")
        raise Exception(ex)

def passwordEncrypt(plainPassword):
    try:
        cipher_suite = Fernet(encryptKey)
        print(plainPassword)
        # plainPassword_bytes = plainPassword.encode('utf-8')
        encrypted_text = cipher_suite.encrypt(plainPassword.encode('utf-8'))
        # encrypted_text = cipher_suite.encrypt(plainPassword_bytes)
        # encrypted_text = encrypted_text.decode('utf-8')
        print(encrypted_text)
        return encrypted_text
    except Exception as ex:
        print(f"Error during password encryption: {ex}")
        raise Exception(ex)