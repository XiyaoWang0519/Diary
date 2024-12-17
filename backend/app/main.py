from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os

from .database import Database
from .services.diary_enhancement import DiaryEnhancementService

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
db = Database()
diary_enhancement = DiaryEnhancementService()

class DiaryEntryCreate(BaseModel):
    content: str
    userId: str

class DiaryEntryResponse(BaseModel):
    id: Optional[int]
    content: str
    enhanced_content: Optional[str]
    created_at: str
    context: Optional[dict]
    user_id: str

@app.post("/diary/create", response_model=DiaryEntryResponse)
async def create_diary_entry(entry: DiaryEntryCreate):
    try:
        # Get previous entries for context
        previous_entries = await db.get_entries_by_user(entry.userId, limit=5)

        # Enhance the entry using Claude
        enhanced_content = await diary_enhancement.enhance_diary_entry(
            entry.content,
            previous_entries
        )

        # Create entry with both original and enhanced content
        new_entry = {
            'user_id': entry.userId,
            'content': entry.content,
            'enhanced_content': enhanced_content,
            'created_at': datetime.now().isoformat(),
            'context': await diary_enhancement.analyze_user_context(previous_entries)
        }

        # Store in database
        created_entry = await db.create_entry(new_entry)
        return created_entry
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/diary/user/{user_id}", response_model=List[DiaryEntryResponse])
async def get_user_entries(user_id: str, limit: Optional[int] = None):
    try:
        entries = await db.get_entries_by_user(user_id, limit)
        return entries
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/diary/{entry_id}", response_model=DiaryEntryResponse)
async def get_entry(entry_id: int):
    try:
        entry = await db.get_entry(entry_id)
        if not entry:
            raise HTTPException(status_code=404, detail="Entry not found")
        return entry
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
