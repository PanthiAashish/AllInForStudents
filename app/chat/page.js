"use client";
import { useChat } from "ai/react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

require("dotenv").config();

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const { user, isLoading } = useUser();

  const urlParams = useSearchParams();

  const title = urlParams.get("title");
  const description = urlParams.get("description");
  const name = urlParams.get("name");

  const messageContainerRef = useRef();

  useEffect(() => {
    messageContainerRef.current &&
      messageContainerRef.current.scrollTo(
        0,
        messageContainerRef.current.scrollHeight
      );
  }, [messages]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center flex-col justify-center">
        <p className="text-3xl font-bold text-red-500">Unauthorized</p>
        <Link href="/">
          <button className="border rounded-md px-10 py-1 mt-2 hover:bg-white hover:text-black transition-all cursor-pointer">
            Home
          </button>
        </Link>
      </div>
    );

  if (!title || !description || !name) return <p>Invalid URL.</p>;

  return (
    <div className="chatContainer">
      <div
        className="messageContainer h-[80vh] overflow-y-scroll"
        ref={messageContainerRef}
      >
        {Array.from(Array(1)).map((_, i) => (
          <div className={"systemMessage"} key={i}>
            <div className="messageContent">
              <Image
                alt="teacher image"
                src={"/teacher.png"}
                height={30}
                width={30}
                style={{
                  objectFit: "contain",
                  borderRadius: "50%",
                  border: "1px solid white",
                  margin: "10px",
                }}
              />{" "}
              Hello there, I am {name}. I am a {title} with 10+ years of
              experience in this field. My work is related to {description}. How
              can I assist you today ?{" "}
            </div>
          </div>
        ))}

        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === "assistant" ? "systemMessage" : "userMessage"}
          >
            <div className="messageContent">
              {m.role === "assistant" && (
                <Image
                  alt="Teacher image"
                  src={"/teacher.png"}
                  height={30}
                  width={30}
                  style={{
                    objectFit: "contain",
                    borderRadius: "50%",
                    border: "1px solid white",
                    margin: "10px",
                  }}
                />
              )}
              {m.content}{" "}
            </div>
          </div>
        ))}

        <form
          onSubmit={handleSubmit}
          className="inputForm absolute bottom-[10%] w-full max-w-[500px]"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={`Ask questions to ${name}`}
            className="inputField text-black"
          ></input>
          <input
            type="submit"
            value={"Ask"}
            className="border rounded-md px-5 py-1 mt-2 hover:bg-white hover:text-black transition-all cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
}
