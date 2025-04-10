import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSend, FiCopy, FiEdit, FiPlus } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
const API_BASE = "https://oppurt_backend.codegenerator458.workers.dev";

export function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [editingSession, setEditingSession] = useState(null);
  const chatEndRef = useRef(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchSessions();
  }, []);



  useEffect(() => {
    // Scroll to bottom whenever messages change
    if(!localStorage.getItem("autotoken69")){
      navigate("/signin");
    }
  },[]);
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (sessions.length > 0 && !activeSession) {
      setActiveSession(sessions[0].id);
    }
  }, [sessions, activeSession]);

  useEffect(() => {
    if (activeSession) {
      fetchSessionCodes();
    }
  }, [activeSession]);

  const fetchSessions = async () => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/getsessions`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("autotoken69")}`,
          },
        }
      );
      if (data.success) setSessions(data.file);
    } catch (error) {
      alert("Error fetching sessions");
    }
  };

  const fetchSessionCodes = async () => {
    try {
      setLoading2(true);
      const { data } = await axios.post(
        `${API_BASE}/getcodes`,
        { session: activeSession },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("autotoken69")}`,
          },
        }
      );
      if (data.success) {
        const formattedMessages = data.code.flatMap((code) => [
          {
            type: "user",
            content: code.code,
          },
          {
            type: "bot",
            content: code.debugged,
            info: code.info,
            title: code.title,
          },
        ]);
        setMessages(formattedMessages);
        setLoading2(false);
      }
    } catch (error) {
      setLoading2(false);
      alert("Error fetching codes");
    }
  };

  const handleNewSession = async () => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/newsession`,
        {},
        {
          //const { data } = await axios.post(`http://127.0.0.1:8787/newsession`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("autotoken69")}`,
          },
        }
      );
      if (data.success) {
        await fetchSessions();
        setActiveSession(data.res.id);
      }
    } catch (error) {
      alert("Error creating new session");
    }
  };

  const handleSendCode = async () => {
    if (!newCode.trim() || messages.length >= 20) return;

    try {
      setLoading1(true);
      setMessages((prev) => [...prev, { type: "user", content: newCode }]);

      const { data } = await axios.post(
        `${API_BASE}/debugcode`,
        { code: newCode, session: activeSession },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("autotoken69")}`,
          },
        }
      );
      
      if (data.success) {
        //console.log(data);
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            title: data.code.code.code_title,
            content: data.code.code.correct_code,
            info: data.code.code.explaination,
          },
        ]);
        setLoading1(false);
      }

      setNewCode("");
    } catch (error) {
      setLoading1(false);
      alert("Error debugging code");
    }
  };

  const updateSessionName = async (sessionId, newName) => {
    try {
      await axios.post(
        `${API_BASE}/updatesessioname`,
        { id: sessionId, name: newName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("autotoken69")}`,
          },
        }
      );
      fetchSessions();
    } catch (error) {
      alert("Error updating session name");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sessions Sidebar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <button
          onClick={handleNewSession}
          className="mb-4 p-2 bg-emerald-600 hover:bg-emerald-700 rounded flex items-center justify-center"
        >
          <FiPlus className="mr-2" /> New Session
        </button>

        <div className="flex-1 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-2 mb-2 rounded cursor-pointer ${
                activeSession === session.id
                  ? "bg-emerald-800"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveSession(session.id)}
            >
              <div className="flex items-center justify-between text-sm">
              {!loading3 &&<span className="hover:fill-red-800 hover:text-red-800">
              <svg  onClick={async(e)=>{
                e.stopPropagation();
                try {
                  setLoading3(true);
                  const { data } = await axios.post(
                    `${API_BASE}/deletesession`,
                    { id: session.id },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("autotoken69")}`,
                      },
                    }
                  );
                  if (data.success) {
                    setSessions(prev => prev.filter(se => se.id !== session.id));
                  }
                  setLoading3(false);
                } catch (error) {
                  setLoading3(false);
                  alert("Error deleting session");
                }
              }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z"/></svg>
              </span>}
                {session.name ||
                  new Date(session.created_at).toLocaleDateString()}
                <FiEdit
                  className="hover:text-emerald-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingSession(session.id);
                  }}
                />
              </div>

              {editingSession === session.id && (
                <input
                  type="text"
                  className="text-black mt-1 p-1 text-xs w-full"
                  defaultValue={session.name}
                  onBlur={(e) => {
                    updateSessionName(session.id, e.target.value);
                    setEditingSession(null);
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div>
        <div onClick={()=>{
          localStorage.removeItem("autotoken69");
          navigate("/signin")

        }} className="p-2 rounded-md w-full flex justify-center cursor-pointer hover:backdrop-brightness-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="m2 12l5 4v-3h9v-2H7V8z"/><path fill="currentColor" d="M13.001 2.999a8.938 8.938 0 0 0-6.364 2.637L8.051 7.05c1.322-1.322 3.08-2.051 4.95-2.051s3.628.729 4.95 2.051s2.051 3.08 2.051 4.95s-.729 3.628-2.051 4.95s-3.08 2.051-4.95 2.051s-3.628-.729-4.95-2.051l-1.414 1.414c1.699 1.7 3.959 2.637 6.364 2.637s4.665-.937 6.364-2.637c1.7-1.699 2.637-3.959 2.637-6.364s-.937-4.665-2.637-6.364a8.938 8.938 0 0 0-6.364-2.637z"/></svg>
        </div>
        </div>
      </div>


      {loading2 && <div className="w-full flex justify-center">
        <div className=" flex flex-col justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><circle cx="12" cy="3.5" r="1.5" fill="currentColor" opacity="0"><animateTransform attributeName="transform" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="0 12 12;90 12 12;180 12 12;270 12 12"/><animate attributeName="opacity" dur="0.6s" keyTimes="0;0.5;1" repeatCount="indefinite" values="1;1;0"/></circle><circle cx="12" cy="3.5" r="1.5" fill="currentColor" opacity="0"><animateTransform attributeName="transform" begin="0.2s" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="30 12 12;120 12 12;210 12 12;300 12 12"/><animate attributeName="opacity" begin="0.2s" dur="0.6s" keyTimes="0;0.5;1" repeatCount="indefinite" values="1;1;0"/></circle><circle cx="12" cy="3.5" r="1.5" fill="currentColor" opacity="0"><animateTransform attributeName="transform" begin="0.4s" calcMode="discrete" dur="2.4s" repeatCount="indefinite" type="rotate" values="60 12 12;150 12 12;240 12 12;330 12 12"/><animate attributeName="opacity" begin="0.4s" dur="0.6s" keyTimes="0;0.5;1" repeatCount="indefinite" values="1;1;0"/></circle></svg>
        </div>
        </div>
      }


      {!loading2 && <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl p-4 rounded-lg ${
                  msg.type === "user" ? "bg-gray-800" : "bg-emerald-800"
                }`}
              >
                {msg.type === "bot" ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono text-emerald-300">
                        {msg.title}{" "}
                        {/* Changed from msg.debugged to msg.title */}
                      </span>
                      <FiCopy
                        className="hover:text-emerald-400 cursor-pointer"
                        onClick={() =>
                          navigator.clipboard.writeText(msg.content)
                        }
                      />
                    </div>
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {msg.content}
                    </pre>
                    <div className="mt-2 p-2 bg-emerald-900 rounded text-xs">
                      {msg.info}
                    </div>
                  </>
                ) : (
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {msg.content}
                  </pre>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="relative">
          <textarea
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendCode();
              }
            }}
            placeholder="Enter your code here..."
            className="w-full p-3 bg-gray-800 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12"
            rows={4}
          />
          <button
            onClick={handleSendCode}
            disabled={loading1}
            className="absolute bottom-3 right-3 p-2 bg-emerald-600 hover:bg-emerald-700 rounded"
          >
            {loading1 && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 6.99998C9.1747 6.99987 6.99997 9.24998 7 12C7.00003 14.55 9.02119 17 12 17C14.7712 17 17 14.75 17 12"><animateTransform attributeName="transform" attributeType="XML" dur="560ms" from="0,12,12" repeatCount="indefinite" to="360,12,12" type="rotate"/></path></svg>}
            {!loading1 &&<FiSend className="text-sm" />}
          </button>
        </div>
      </div>}
    </div>
  );
}
