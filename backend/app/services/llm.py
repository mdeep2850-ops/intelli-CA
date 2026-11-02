from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage
from app.core.config import settings
from app.core.logger import logger

class LLMService:
    def __init__(self):
        # We initialize the LLM here, pulling the API key from settings
        # If the key is empty, LangChain might error, so we handle it gracefully or let it fail fast.
        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                temperature=0,
                google_api_key=settings.GOOGLE_API_KEY
            )
            logger.info("LLM Service initialized successfully.")
        except Exception as e:
            logger.error("Failed to initialize LLM. Check configuration.")
            self.llm = None

    async def generate_response(self, messages: list[BaseMessage]) -> str:
        if not self.llm:
            logger.error("Attempted to generate response but LLM is not configured.")
            raise RuntimeError("LLM is not configured properly.")
        try:
            response = await self.llm.ainvoke(messages)
            content = response.content
            if isinstance(content, list):
                return "\n".join(c.get("text", "") if isinstance(c, dict) else str(c) for c in content)
            return str(content)
        except Exception as e:
            logger.error(f"Error during LLM async generation: {type(e).__name__} - {str(e)}")
            raise RuntimeError("Error occurred while generating response from LLM.")

llm_service = LLMService()
