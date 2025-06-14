import requests
import os

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL")

def get_llm_advice(goal_name, gap, overspending_categories):
    categories = overspending_categories or "no major categories"
    prompt = (
        f"The user wants to reach their savings goal '{goal_name}', but needs to save an extra ${gap:.2f} per month.\n"
        f"Recent spending trends:\n{categories}\n\n"
        "Provide 3 concise, specific actions with numeric targets to reduce spending, "
        "e.g., 'Cut dining out expenses by 15%', 'Reduce entertainment spending by $50 monthly'. "
        "Focus on practical, quantifiable steps that add up to the gap. Keep it friendly and direct."
    )


    try:
        response = requests.post(
            OLLAMA_API_URL,
            json={
                "model": 'hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF:latest',
                "prompt": prompt,
                "stream": False
            }
        )
        data = response.json()
        return data.get("response", "").strip() or "Sorry, I can't generate personalised advice at this time."
    except Exception:
        return "Something went wrong. Please try again later."