import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="lost_found_system",
    auth_plugin='caching_sha2_password'
)

print("Connected!" if conn.is_connected() else "Failed!")