import os
from anthropic import Anthropic
from typing import List, Optional

class DiaryEnhancementService:
    def __init__(self):
        self.client = Anthropic(api_key=os.environ.get('diaryClaude'))
        self.model = "claude-3-opus-20240229"

    async def enhance_diary_entry(self, content: str, previous_entries: Optional[List[dict]] = None) -> str:
        # Build context from previous entries if available
        context = ""
        if previous_entries:
            context = "Based on previous diary entries:\n"
            for entry in previous_entries[-3:]:  # Use last 3 entries for context
                context += f"- {entry['content']}\n"
            context += "\n"

        system_prompt = """You are a personal diary enhancement assistant. Your task is to:
1. Take simple thoughts and phrases and transform them into well-written diary entries
2. Maintain the original sentiment and meaning
3. Add relevant context based on previous entries when available
4. Keep the personal and intimate nature of a diary entry
5. Use natural, first-person language
6. Preserve any emotional nuances from the original text"""

        user_prompt = f"{context}Please enhance this diary entry while maintaining its personal nature:\n{content}"

        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                system=system_prompt,
                messages=[{
                    "role": "user",
                    "content": user_prompt
                }]
            )
            return response.content[0].text
        except Exception as e:
            print(f"Error enhancing diary entry: {e}")
            return content  # Return original content if enhancement fails

    async def analyze_user_context(self, previous_entries: List[dict]) -> dict:
        """Analyze previous entries to understand user context and preferences"""
        if not previous_entries:
            return {}

        system_prompt = """You are a diary analysis assistant. Analyze the user's previous diary entries to:
1. Identify recurring themes
2. Understand emotional patterns
3. Note important people, places, or events
4. Recognize writing style preferences
Return the analysis as structured data that can be used to enhance future entries."""

        entries_text = "\n---\n".join([entry['content'] for entry in previous_entries[-5:]])

        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                system=system_prompt,
                messages=[{
                    "role": "user",
                    "content": f"Please analyze these diary entries:\n{entries_text}"
                }]
            )
            return {'analysis': response.content[0].text, 'entry_count': len(previous_entries)}
        except Exception as e:
            print(f"Error analyzing user context: {e}")
            return {}
