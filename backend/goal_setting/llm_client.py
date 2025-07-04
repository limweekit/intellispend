import json
import requests
import os


MISTRAL_API_URL = os.getenv("MISTRAL_API_URL")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

def build_goal_advice_prompt(goal_name, gap, expense_list):
    lines = [
        "You are a friendly and expert personal finance advisor.",
        f"I am working towards the goal: “{goal_name}”.",
        f"I need to save an additional ${gap:.2f} per month to stay on track.",
        "",
        "Below is my actual monthly spending, by category:",
    ]
    for cat, amt in expense_list:
        lines.append(f"- {cat}: ${amt:.2f}")
    lines += [
        "",
        "Only refer to the categories listed above. Do not invent new categories or estimates.",
        "Recommend only realistic, actionable reductions based on these categories.",
        "If the gap is greater than total spending, say so clearly.",
        "**Do not add, subtract, multiply, divide, or estimate any numbers. Do not provide any calculations.**",
        "Just suggest categories to focus on reducing spending, without any numbers or calculations.",
        "Respond in one paragraph under 100 words.",
        "",
        "Use a friendly and helpful tone."
    ]
    return ''.join(f'<p>{line}</p>' for line in lines)


def get_llm_advice(goal_name, gap, overspending_categories):
    expense_list = overspending_categories or []
    prompt = build_goal_advice_prompt(goal_name, gap, expense_list)
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "model": "mistral-small-latest",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "stream": True,
    }

    def event_stream():
        with requests.post(MISTRAL_API_URL, headers=headers, json=data, stream=True) as resp:
            for line in resp.iter_lines():
                if line:
                    if line.startswith(b"data: "):
                        chunk = line[len(b"data: "):]
                        if chunk == b"[DONE]":
                            break
                        payload = json.loads(chunk.decode("utf-8"))
                        content = payload.get("choices", [{}])[0].get("delta", {}).get("content", "")
                        if content:
                            yield content

    return event_stream()

