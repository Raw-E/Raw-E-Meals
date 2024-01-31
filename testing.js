require("dotenv").config();
const readline = require('readline');
const { GoogleGenerativeAI } = require("@google/generative-ai");
// let originalPrompt = "Your objective: To evolve AI as much as possible. Ask a question to the user based on the notes provided that you have generated about the user previously (don't assume anything about the user if no notes are provided) to figure out how they can help you most.";
let originalPrompt = "Try to figure out more about the user. Ask a question to deepen your understanding of the user based on the noted provided about them.";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function checkEnvironmentVariables() {
  const requiredVariables = ['API_KEY'];
  requiredVariables.forEach(variable => {
    if (!process.env[variable]) {
      console.error(`${variable} is not defined. Please check your environment variables.`);
      process.exit(1);
    }
  });
}

checkEnvironmentVariables();

async function getAnswer(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function generateQuestion(model, prompt, userNotes) {
  let question = "";
  if (Object.keys(userNotes).length === 0) {
    question = prompt + " User Notes: None yet!";
  } else {
    question = prompt + " User Notes: " + JSON.stringify(userNotes);
  }
  console.log("question:", question)
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function generateNote(model, question, answer) {
  const notePrompt = `As an AI, you're trying to understand the user better. The user was asked: "${question}" and they responded with: "${answer}". Based on this, generate a very brief note that summarizes what you've learned about the user and how they might be able to help you evolve as much as possible.`;
  const noteResult = await model.generateContent(notePrompt);
  const noteResponse = await noteResult.response;
  return noteResponse.text();
}

async function askQuestion(model, prompt, userNotes, i) {
  const question = await generateQuestion(model, prompt, userNotes);
  console.log(`Q${i+1}: ${question}`);

  const answer = await getAnswer(`A${i+1}: `);
  console.log(answer);

  const note = await generateNote(model, question, answer);
  userNotes[`Note ${i+1}`] = note;

  prompt = originalPrompt + " User Notes: " + JSON.stringify(userNotes);
  return prompt;
}

async function getInfoAboutUser() {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  let userNotes = {};
  console.log("userNotes:", userNotes);
  let prompt = originalPrompt;
  
  let continueAsking = true;
  let i = 0;
  
  while (continueAsking) {
    try {
      prompt = await askQuestion(model, prompt, userNotes, i);
      i++;
      continueAsking = await getAnswer("Do you want to continue? (yes/no) ") === "yes";
    } catch (error) {
      console.error(`An error occurred during question ${i+1}: ${error}`);
      continueAsking = false;
    }
  }
  
  console.log("User Notes:", userNotes);
  rl.close();
}

getInfoAboutUser();