import json
import requests
import os


OLLAMA_API_URL = os.getenv("OLLAMA_API_URL")


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

    def event_stream():
        with requests.post(
            OLLAMA_API_URL,
            json={
                "model": "hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF:latest",
                "prompt": prompt,
                "stream": True,
            },
            stream=True,
        ) as resp:
            for line in resp.iter_lines():
                if line:
                    data = json.loads(line.decode("utf-8"))
                    response = data.get("response", "")
                    yield response

    return event_stream()

