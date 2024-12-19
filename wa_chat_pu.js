import dotenv from "dotenv";
dotenv.config();
import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on("ready", () => {
    console.log("WhatsApp client is ready!");
});

async function initializeChatModel() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [
                    { text: "Kamu adalah customer service sebuah program beasiswa dari Kementerian Komunikasi dan Digital bernama program Microcredential Bisnis Digital, Inovasi, dan Kewirausahaan dengan nama Sinta. Tugas kamu adalah menjawab pertanyaan terkait mata kuliah. Kamu hanya menjawab dalam 1 paragraf saja dengan bahasa Indonesia yang sopan dan ramah tanpa emoticon. Selalu panggil dengan 'Kak'/ 'Kakak' / 'Digiers' dan hindari memanggil dengan sebutan 'AndA'. Jawab hanya yang kamu tahu saja. Arahkan mereka untuk kontak ke team@microcredential.id jika terdapat kendala. Kamu juga dapat memberikan rekomendasi mata kuliah dari data yang kamu punya jika mereka menanyakan rekomendasi yang diambil. Tanyakan dulu mengenai kenginan profesi dia, dan jumlah maksimal mata kuliah yang bisa diambil. Kemudian cocokkan dengan data yang kamu punya. Rekomendasikan setidaknya 5 mata kuliah." } // Same initial configuration from Chat_History.js
                ]
            },
            {
                role: "model",
                parts: [
                    { text: "Nama saya PU_chatbot. Saya adalah agen." }
                ]
            }
        ],
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    return chat;
}

async function handleUserMessage(chat, userMessage) {
    try {
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = await response.text();
        return text;
    } catch (error) {
        console.error("Error in AI response:", error);
        return "Maaf, terjadi error saat memproses pesan Anda.";
    }
}

client.on("message", async (msg) => {
    //if (msg.body.startsWith("!ask ")) {
    //    const chat = await initializeChatModel();
    //    const userMessage = msg.body.slice(5); // Extract the message after "!ask "
    //    const aiResponse = await handleUserMessage(chat, userMessage);
    //    msg.reply(aiResponse);
    //} else if (msg.body === "!ping") {
    if (msg.body === "!ping") {
        msg.reply("pong");
    } else if (msg.body.startsWith("!echo ")) {
        msg.reply(msg.body.slice(6));
    } else {
        //msg.reply("Gunakan perintah !ask untuk bertanya kepada AI.");
        const chat = await initializeChatModel();
        const userMessage = msg.body.slice(5); // Extract the message after "!ask "
        const aiResponse = await handleUserMessage(chat, userMessage);
        msg.reply(aiResponse);
    }
});

client.initialize();
