from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    
    @classmethod
    async def connect_to_database(cls):
        if cls.client is None:
            cls.client = AsyncIOMotorClient("mongodb://localhost:27017/")
            
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
