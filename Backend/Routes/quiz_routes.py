from flask import Blueprint, request, jsonify
from utils.question_generator import generate_quiz

quiz_bp = Blueprint("quiz", __name__)

@quiz_bp.route("/generate", methods=["POST"])
def generate():
    data = request.json
    topic = data.get("topic", "")
    num_questions = data.get("num_questions", 5)
    quiz = generate_quiz(topic, int(num_questions))
    return jsonify({"questions": quiz})
