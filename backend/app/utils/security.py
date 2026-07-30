import bcrypt


def hash_password(password):
    password_bytes = password.encode("utf-8")

    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

    return hashed.decode("utf-8")


def check_password(password, hashed_password):
    password_bytes = password.encode("utf-8")

    hashed_bytes = hashed_password.encode("utf-8")

    return bcrypt.checkpw(password_bytes, hashed_bytes)