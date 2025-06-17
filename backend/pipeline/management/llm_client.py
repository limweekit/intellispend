import requests
import os

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL")


def build_goal_advice_prompt(goal_name, gap, expense_list):
    lines = [
        "You are a friendly and expert personal finance advisor.",
        f"The user is working towards the goal: “{goal_name}”.",
        f"They need to save an additional ${gap:.2f} per month to stay on track.",
        "",
        "Below is their actual monthly spending, by category:",
    ]
    for cat, amt in expense_list:
        lines.append(f"- {cat}: ${amt:.2f}")
    lines += [
        "",
        "Only refer to the categories listed above. Do not invent new categories or estimates.",
        "Recommend only realistic, actionable reductions based on these categories.",
        "If the gap is greater than total spending, say so clearly.",
        "",
        "For each suggestion, include:",
        "• Category name (must match exactly)",
        "• A clear reduction (in dollars or percentage)",
        "• Estimated monthly savings (must match the reduction)",
        "",
        "Respond in one paragraph under 100 words.",
        "",
        "Use a friendly and helpful tone."
    ]
    return "\n".join(lines)


def get_llm_advice(goal_name, gap, overspending_categories):
    expense_list = overspending_categories or []
    prompt = build_goal_advice_prompt(goal_name, gap, expense_list)

    try:
        response = requests.post(
            OLLAMA_API_URL,
            json={
                "model": "hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF:latest",
                "prompt": prompt,
                "stream": False,
            },
        )
        data = response.json()
        return data.get("response", "").strip() or \
            "Sorry, I can't generate personalised advice at this time."
    except Exception:
        return "Something went wrong. Please try again later."

