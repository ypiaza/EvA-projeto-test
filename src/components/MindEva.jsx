import React, { useState } from "react";
import { PiUserSoundBold } from "react-icons/pi";

const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "pt-BR";
recognition.continuous = false;

const MindEva = () => {
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]); // Estado para tarefas
  const [isListening, setIsListening] = useState(false);

  const predefinedResponses = {
    "qual o seu nome": "Meu nome é Eva, sua assistente pessoal.",
    "como você está": "Estou sempre pronta para te ajudar!",
    "o que você pode fazer": "Eu posso te ajudar a lembrar de algumas coisas enquanto eu estiver em funcionamento, posso colocar músicas para tocar e consigo até contar algumas piadas! Quer tentar?", 
    "que horas são": `Agora são ${new Date().toLocaleTimeString("pt-BR")}.`,
    "qual é a data de hoje": `Hoje é ${new Date().toLocaleDateString("pt-BR")}.`,
  };

  const jokes = [
    "Por que o livro de matemática ficou triste? Porque ele tinha muitos problemas.",
    "O que é um pontinho amarelo na estrada? Um Fuscão preto com hepatite.",
    "Por que o computador foi ao médico? Porque estava com um vírus!",
    "O que o pato disse para a pata? Vem Quá!",
    "Por que o relógio foi preso? Porque matou o tempo.",
    "O que é um pontinho vermelho no castelo? Um morango invadindo.",
    "O que é um pontinho verde na parede? Uma ervilha se escondendo.",
    "Por que o astrônomo levou um lápis para o espaço? Para desenhar as estrelas.",
    "Por que as plantas não falam? Porque elas são mudas.",
    "Por que o músico foi preso? Porque fugiu da escala."
  ];

  const songs = [
    // Polyphia
    { artist: "Polyphia", title: "G.O.A.T.", link: "https://youtu.be/zv4oLw_VdMM" },
    { artist: "Polyphia", title: "Euphoria", link: "https://youtu.be/b9-jmSmrLZg" },
    { artist: "Polyphia", title: "Playing God", link: "https://youtu.be/zHbABzskgw0" },
    { artist: "Polyphia", title: "40oz", link: "https://youtu.be/VlI2tE8UPUM" },
    { artist: "Polyphia", title: "Bad", link: "https://youtu.be/YWeg6t8ysbQ" },

    // John Lennon
    { artist: "John Lennon", title: "Imagine", link: "https://youtu.be/YkgkThdzX-8" },
    { artist: "John Lennon", title: "Jealous Guy", link: "https://youtu.be/DzhyKn1ThpI" },
    { artist: "John Lennon", title: "Working Class Hero", link: "https://youtu.be/tbU3zdAgiX8" },
    { artist: "John Lennon", title: "Instant Karma!", link: "https://youtu.be/xLy2SaSQAtA" },
    { artist: "John Lennon", title: "Mother", link: "https://youtu.be/L3C2sB1j8Dg" },

    // Avenged Sevenfold
    { artist: "Avenged Sevenfold", title: "Bat Country", link: "https://youtu.be/IHs98Z4HttU" },
    { artist: "Avenged Sevenfold", title: "Hail to the King", link: "https://youtu.be/DelhLppPSxY" },
    { artist: "Avenged Sevenfold", title: "Afterlife", link: "https://youtu.be/94bGzWyHbu0" },
    { artist: "Avenged Sevenfold", title: "Nightmare", link: "https://youtu.be/94bGzWyHbu0" },
    { artist: "Avenged Sevenfold", title: "So Far Away", link: "https://youtu.be/A7ry4cx6HfY" },

    // Chon
    { artist: "Chon", title: "Perfect Pillow", link: "https://youtu.be/vUah63Gsg88" },
    { artist: "Chon", title: "Story", link: "https://youtu.be/V8vEH1EbEhE" },
    { artist: "Chon", title: "Splash", link: "https://youtu.be/Wf4z69phXYc" },
    { artist: "Chon", title: "Sleepy Tea", link: "https://youtu.be/8Q-QEnfwZqM" },
    { artist: "Chon", title: "Bubble Dream", link: "https://youtu.be/p-8LvAJ2uaM" },
  ];






  const handleUserInput = (userText) => {
    const normalizedText = userText.toLowerCase().trim();
    let response = predefinedResponses[normalizedText];

    //Apresentação
    if(normalizedText.startsWith("oi") || normalizedText.startsWith("oi eva") || normalizedText.startsWith("eva") || normalizedText.startsWith("o que você pode fazer")) {
      response = "Oi, em que eu posso ajudar?";
      
      setTimeout(startListening, 2500)
    }

    //Despedida
    if(normalizedText.startsWith("tchau") || normalizedText.startsWith("desligar")){
      response = "Até breve!"

      setTimeout(window.close(), 3000)
    }

    //Tocar musica
    if(normalizedText.startsWith("toque uma música")) {
      const randomSong = songs[Math.floor(Math.random() * songs.length)];

      response = `Tocando ${randomSong.title} da banda ${randomSong.artist}`
      window.open(randomSong.link)
    }

    //Contar uma piada
    if (normalizedText.startsWith("piada") || normalizedText.startsWith("me conte uma piada") || normalizedText.startsWith("conte uma piada")) {
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

      response = randomJoke;
    }

    //To list
    if (normalizedText.startsWith("me lembre de")) {
      const task = normalizedText.replace("me lembre de", "").trim();
      response = `Adicionando a tarefa: "${task}".`;
      addTask(task);
    } else if (normalizedText.startsWith("acabei a tarefa")) {
      const indexText = normalizedText.replace("acabei a tarefa", "").trim();
      const index = parseInt(indexText, 10) - 1; // Converte para índice (começando de 0)
      if (!isNaN(index) && index >= 0 && index < tasks.length) {
        response = `Tarefa ${index + 1}: "${tasks[index]}" concluida.`;
        removeTask(index);
      } else {
        response = "Desculpe, não encontrei essa tarefa para remover.";
      }
    } else if (normalizedText === "concluir última tarefa") {
      if (tasks.length > 0) {
        const lastIndex = tasks.length - 1;
        response = 'tarefa concluida';
        removeTask(lastIndex);
      } else {
        response = "Não há tarefas para remover.";
      }
    }

    if (!response) {
      response = "Desculpe, não entendi sua pergunta.";
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "assistant", content: response },
    ]);

    speakResponse(response);
  };

  const addTask = (task) => {
    setTasks((prev) => [...prev, task]); // Adiciona a nova tarefa ao estado
  };

  const removeTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index)); // Remove a tarefa pelo índice
  };

  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    synth.speak(utterance);
  };

  const startListening = () => {
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const userText = event.results[0][0].transcript;
      handleUserInput(userText);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      console.error("Erro ao capturar áudio");
    };

    recognition.onend = () => setIsListening(false);
  };

  return (
    <div className="assistant-container absolute h-full w-full flex items-center justify-center flex-col top-0">
      {/* Histórico de mensagens */}
      <div className="messages absolute top-16 right-2 overflow-y-scroll h-[200px]">
        {messages.map((msg, index) => (
          <div key={index} className={`text-white/10 text-xs message ${msg.role}`}>
            - {msg.content}
          </div>
        ))}
      </div>

      {/* Lista de tarefas */}
      <div className="tasks absolute w-full bottom-2  p-4 rounded-md shadow-md text-white ">
        <h3 className="font-bold text-lg">Lembretes</h3>
        <ul className="list-disc pl-5 flex items-center justify-start gap-2">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <li className="list-none"
                key={index}
                onClick={() => removeTask(index)} // Remove tarefa ao clicar
              >
                <div className="relative h-[100px] w-[150px] flex items-center justify-center bg-white/20 rounded ">
                  <div className="absolute top-1 left-1 bg-white/50 px-2 rounded-full ">{index + 1}</div> {task}
                </div>
              </li>
            ))
          ) : (
            <p className="text-white/50">Nenhuma tarefa adicionada ainda.</p>
          )}
        </ul>
        {tasks.length > 0 && (
          <p className="text-white/50 text-sm mt-2">Clique em uma tarefa para removê-la.</p>
        )}
      </div>

      {/* Botão para escutar */}
      <button
        className={`bg-transparent backdrop-blur-[2px] p-12 rounded-full listen-button ${isListening ? "listening" : ""}`}
        onClick={startListening}
        disabled={isListening}
      >
        {isListening ? "Escutando..." : <PiUserSoundBold className="text-white/50 text-2xl hover:text-white/80 duration-200" />}
      </button>
    </div>
  );
};

export default MindEva;
