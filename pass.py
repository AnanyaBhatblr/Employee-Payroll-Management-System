import bcrypt

def hash_password(password: str) -> str:
    # Generate salt
    salt = bcrypt.gensalt(rounds=10)  # 10 is the cost factor
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

# Example usage
password = "Aditya123"
hashed_pw = hash_password(password)
print("Hashed Password:", hashed_pw)