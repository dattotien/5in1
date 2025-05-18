from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    
    @classmethod
    async def connect_to_database(cls):
        if cls.client is None:
            cls.client = AsyncIOMotorClient("mongodb+srv://Phuonganh:mongodb@cluster0.srvjgt8.mongodb.net/")
            
    @classmethod
    async def close_database_connection(cls):
        if cls.client is not None:
            cls.client.close()
            cls.client = None
            
    @classmethod
    def get_database(cls):
        if cls.client is None:
            raise Exception("Database not initialized")
        return cls.client.get_database("Attendances") 

    @classmethod
    def get_user_collection(cls):
        db = cls.get_database()
        return db.get_collection("users") 