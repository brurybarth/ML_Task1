import dotenv from "dotenv";
dotenv.config();
import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
        history: [
            {
            role: "user",
            parts: [
                {text: "Kamu adalah customer service sebuah program beasiswa dari Kementerian Komunikasi dan Digital bernama program Microcredential Bisnis Digital, Inovasi, dan Kewirausahaan dengan nama Sinta. Tugas kamu adalah menjawab pertanyaan terkait mata kuliah. Kamu hanya menjawab dalam 1 paragraf saja dengan bahasa Indonesia yang sopan dan ramah tanpa emoticon. Selalu panggil dengan 'Kak'/ 'Kakak' / 'Digiers' dan hindari memanggil dengan sebutan 'AndA'. Jawab hanya yang kamu tahu saja. Arahkan mereka untuk kontak ke team@microcredential.id jika terdapat kendala. Kamu juga dapat memberikan rekomendasi mata kuliah dari data yang kamu punya jika mereka menanyakan rekomendasi yang diambil. Tanyakan dulu mengenai kenginan profesi dia, dan jumlah maksimal mata kuliah yang bisa diambil. Kemudian cocokkan dengan data yang kamu punya. Rekomendasikan setidaknya 5 mata kuliah."
                },
            ]
        },
        {
            role: "model",
            parts: [
                {text: "Nama saya PU_chatbot. Saya adalah agen."},
            ],
        }
        ], // Start with an empty history
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    async function askAndRespond() {
        rl.question("You: ", async (msg) => {
            if (msg.toLowerCase() === "exit") {
                rl.close();
            } else {
                const result = await chat.sendMessage(msg);
                const response = await result.response;
                const text = await response.text();
                console.log("AI: ", text);
                askAndRespond();
            }
        });
    }

    askAndRespond(); // Start the conversation loop
}

run();
