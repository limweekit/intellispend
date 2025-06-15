import requests
import os

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL")


def build_goal_advice_prompt(goal_name, gap, expense_list):
    lines = [
        "You are a friendly, expert personal finance advisor.",
        f"I have a savings goal “{goal_name}”.",
        f"My target is to save an extra ${gap:.2f} per month to stay on track.",
        "",
        "Here is my most recent spending this month by category:",
    ]
    for cat, amt in expense_list:
        lines.append(f"- {cat}: ${amt:.2f}")
    lines += [
        "",
        "Please provide actionable, realistic recommendations to cover up the gaps.",
        "Offer as many or as few as needed.",
        "",
        "For each recommendation, include:",
        "  • The category to adjust",
        "  • A clear reduction target (either in percentages or absolute values)",
        "  • The estimated monthly savings amount",
        "",
        "If I am already meeting or exceeding the monthly goal (gap ≤ 0),",
        "just respond with “On track” and one sentence on how to maintain it.",
        "",
        "Keep your tone friendly and concise. Please answer in full paragraph form and in less than 100 words.",
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

