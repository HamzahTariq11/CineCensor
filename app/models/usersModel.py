import mysql.connector
import mysql
import jwt
import datetime
from flask import make_response, current_app
from config import establish_connection, close_connection
from ..helpers.usersHelper import passwordDecrypt, passwordEncrypt


def loginCheck(param1, param2):
    try:
        # secret_key = current_app.config.get('SECRET_KEY')
        secret_key = "thisisecretkey"
        cursor, connection = establish_connection()
        sql_query = "SELECT EMAIL,PASSWORD FROM USERS WHERE EMAIL = %s"
        cursor.execute(sql_query, (param1))
        record = cursor.fetchone()
        if record is not None:

            decryptedPassword = passwordDecrypt(record[1])
            print(type(decryptedPassword))
            print(type(param2[0]))
            if decryptedPassword == param2[0]:
                token = jwt.encode(
                    {
                        "user": record[0],
                        "exp": datetime.datetime.utcnow()
                        + datetime.timedelta(hours=24),
                    },
                    secret_key,
                    algorithm="HS256",
                )
                response = make_response("Cookie set and login successful!")
                response.set_cookie("token", token, max_age=3600, httponly=True)
                print(response.headers["Set-Cookie"])
                return token
        return 0
    except Exception as ex:
        print(ex)
        raise Exception(ex)


def addUser(firstName, lastName, email, password, gender):
    try:
        queryAddUser = "INSERT INTO users(email,password,first_name,last_name,gender) VALUES(%s,%s,%s,%s,%s)"
        encryptedPassword = passwordEncrypt(password)
        encryptedPassword = encryptedPassword.decode()
        cursor, connection = establish_connection()
        cursor.execute(
            queryAddUser, (email, encryptedPassword, firstName, lastName, gender)
        )
        connection.commit()
        return {"message": "user added", "status": 200}
    except Exception as ex:
        print(ex)
        raise Exception(ex)
