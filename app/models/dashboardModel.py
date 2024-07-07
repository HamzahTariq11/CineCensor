import mysql.connector
import mysql
from config import establish_connection,close_connection

def getTotalVideo(user):
    try:
        queryTotalVideo = "select count(*) from videos where email = %s"
        cursor,connection = establish_connection()
        cursor.execute(queryTotalVideo,([user]))
        result = cursor.fetchone()
        return result
    except Exception as ex:
        print(ex)
        raise Exception(ex)
    
    
def getTotalProcessed(user):
    try:
        queryTotalProcessed = "select count(*) from videos where email = %s and is_processed = 1"
        cursor,connection = establish_connection()
        cursor.execute(queryTotalProcessed,([user]))
        result = cursor.fetchone()
        return result
    except Exception as ex:
        print(ex)
        raise Exception(ex)    

def getExplicitContent(user):
    try:
        queryTotalExplicit = "SELECT COUNT(*) AS total_records,SUM(CASE WHEN nudity = 1 OR rifles= 1 OR blood= 1 OR cigarette= 1 OR guns = 1 THEN 1 ELSE 0 END) AS records_with_any_one FROM videos where email = %s"
        cursor,connection = establish_connection()
        cursor.execute(queryTotalExplicit,([user]))
        result = cursor.fetchone()
        percentage = (result[1]/result[0])*100
        return percentage
    except Exception as ex:
        print(ex)
        raise Exception(ex)
    
    
def getGraphContent(user):
    try:
        queryTotalExplicit = "select sum(nudity), sum(rifles), sum(blood), sum(cigarette), sum(guns) from videos where email = %s;"
        cursor,connection = establish_connection()
        cursor.execute(queryTotalExplicit,([user]))
        result = cursor.fetchone()
        return result
    except Exception as ex:
        print(ex)
        raise Exception(ex)