import os
from openai import OpenAI

class AIInterviewerGPT:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)
        self.user_profile = {"Skills": [], "Knowledge": []}  # Focus on skills and knowledge
        self.conversation_history = []
        self.notes = []  # Store notes from each interaction

    def generate_question(self):
        # Use conversation history, profile, and notes to generate the next question
        prompt = self.create_prompt_for_question_generation()
        question = self.query_gpt(prompt, generate_question=True).strip()
        self.conversation_history.append(f"AI: {question}")
        return question

    def create_prompt_for_question_generation(self):
        # Include notes in the prompt to inform the next question
        notes_summary = " ".join(self.notes)
        profile_summary = self.profile_summary()
        prompt = (f"Based on the following profile and notes, generate a question to learn more about "
                  f"the user's abilities and knowledge:\n{profile_summary}\nNotes: {notes_summary}\n\nGenerate question:")
        return prompt

    def ask_question_and_update_profile(self):
        question = self.generate_question()
        print(f"AI: {question}")
        response = input("User: ")
        self.conversation_history.append(f"User: {response}")
        self.update_user_profile_and_notes(response)

    def update_user_profile_and_notes(self, response):
        # Analyze response, update profile, and add notes
        note_prompt = (f"Analyze the user's response to identify skills or knowledge areas and provide a note:\n"
                       f"User said: {response}\n\nCurrent profile:\n{self.profile_summary()}\n\nIdentify skills or knowledge and provide a note:")
        update_note = self.query_gpt(note_prompt).strip()
        self.notes.append(update_note)  # Add the new note
        print(f"AI Note: {update_note}")  # Optionally, print the note for visibility
        # Update `self.user_profile` based on `update_note`

    def profile_summary(self):
        skills = ", ".join(self.user_profile["Skills"]) or "Not provided"
        knowledge = ", ".join(self.user_profile["Knowledge"]) or "Not provided"
        return f"Skills: {skills}\nKnowledge: {knowledge}"

    def query_gpt(self, prompt, generate_question=False):
        print("Prompt for GPT:")
        print("#############################################")
        print(prompt)
        print("#############################################")
        role = "system" if generate_question else "user"
        response = self.client.chat.completions.create(
            messages=[{"role": "system", "content": "You are a helpful assistant."},
                      {"role": role, "content": prompt}],
            model="gpt-3.5-turbo"
        )
        return response.choices[0].message.content.strip()

    def start_interview(self, num_questions=5):
        for _ in range(num_questions):
            self.ask_question_and_update_profile()

# Assuming the OPENAI_API_KEY is set as an environment variable
api_key = os.environ.get("OPENAI_API_KEY")
interviewer = AIInterviewerGPT(api_key)
interviewer.start_interview()
