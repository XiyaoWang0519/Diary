import sqlite3
import aiosqlite
from typing import List, Optional, Dict
import json

class Database:
    def __init__(self, db_path: str = "diary.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """Initialize the database with required tables"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()

        # Create diary entries table
        c.execute('''
        CREATE TABLE IF NOT EXISTS diary_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            content TEXT NOT NULL,
            enhanced_content TEXT,
            created_at TEXT NOT NULL,
            context TEXT
        )
        ''')

        conn.commit()
        conn.close()

    async def create_entry(self, entry: Dict) -> Dict:
        """Create a new diary entry"""
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.cursor()
            await cursor.execute(
                '''INSERT INTO diary_entries
                   (user_id, content, enhanced_content, created_at, context)
                   VALUES (?, ?, ?, ?, ?)''',
                (
                    entry['user_id'],
                    entry['content'],
                    entry.get('enhanced_content'),
                    entry['created_at'],
                    json.dumps(entry.get('context', {}))
                )
            )
            await db.commit()
            entry_id = cursor.lastrowid
            entry['id'] = entry_id
            return entry

    async def get_entries_by_user(self, user_id: str, limit: Optional[int] = None) -> List[Dict]:
        """Get diary entries for a specific user"""
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.cursor()
            if limit:
                await cursor.execute(
                    '''SELECT * FROM diary_entries
                       WHERE user_id = ?
                       ORDER BY created_at DESC LIMIT ?''',
                    (user_id, limit)
                )
            else:
                await cursor.execute(
                    '''SELECT * FROM diary_entries
                       WHERE user_id = ?
                       ORDER BY created_at DESC''',
                    (user_id,)
                )

            rows = await cursor.fetchall()
            columns = [description[0] for description in cursor.description]
            entries = []

            for row in rows:
                entry = dict(zip(columns, row))
                try:
                    entry['context'] = json.loads(entry['context'])
                except:
                    entry['context'] = {}
                entries.append(entry)

            return entries

    async def get_entry(self, entry_id: int) -> Optional[Dict]:
        """Get a specific diary entry"""
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.cursor()
            await cursor.execute('SELECT * FROM diary_entries WHERE id = ?', (entry_id,))
            row = await cursor.fetchone()

            if not row:
                return None

            columns = [description[0] for description in cursor.description]
            entry = dict(zip(columns, row))
            try:
                entry['context'] = json.loads(entry['context'])
            except:
                entry['context'] = {}

            return entry
