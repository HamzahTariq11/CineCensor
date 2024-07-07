import mysql.connector


def establish_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="0321",
            database="cinecensor",
            port="3308",
        )
        cursor = connection.cursor()
        return cursor, connection
    except mysql.connector.Error as e:
        print(f"Error: Failed to connect to the database: {e}")


def close_connection(cursor, connection):
    cursor.close()
    connection.close()


establish_connection()
