import os
import openai
from dotenv import load_dotenv
import re

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_quiz(topic, num_questions=5):
    prompt = (
        f"Generate {num_questions} multiple choice questions with 4 options (A, B, C, D) "
        f"on the topic '{topic}'. Include the correct answer key. Format:\n\n"
        f"Q1: ...?\nA. ...\nB. ...\nC. ...\nD. ...\nAnswer: A\n..."
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful quiz generator."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        raw_text = response["choices"][0]["message"]["content"]
        return parse_questions(raw_text)

    except Exception as e:
        print(f"Error: {e}")
        return [{"question": "Error generating quiz.", "options": [], "answer": ""}]

def parse_questions(raw_text):
    questions = []
    blocks = re.split(r"Q\\d+:", raw_text)[1:]

    for block in blocks:
        lines = block.strip().split("\n")
        question_text = lines[0].strip()
        options = [line[2:].strip() for line in lines[1:5]]
        answer_line = next((line for line in lines if line.lower().startswith("answer")), "Answer: A")
        answer = answer_line.split(":")[-1].strip()

        questions.append({
            "question": question_text,
            "options": options,
            "answer": answer
        })

    return questions
