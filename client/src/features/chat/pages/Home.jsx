import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

const SendIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 11.5L19 4L12.5 19L10.8 13.2L4 11.5Z" fill="currentColor" />
    <path
      d="M10.5 13.5L19 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 7H20M4 12H20M4 17H20"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const SparkIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L13.9 8.1L19 10L13.9 11.9L12 17L10.1 11.9L5 10L10.1 8.1L12 3Z"
      fill="currentColor"
    />
  </svg>
);

const ChatIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 8.5H17M7 12H14M6.8 18L4 20V6.8C4 5.8 4.8 5 5.8 5H18.2C19.2 5 20 5.8 20 6.8V15.2C20 16.2 19.2 17 18.2 17H7.8L6.8 18Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 4.5H15M5.5 7H18.5M8 7L8.6 18.2C8.7 19.2 9.5 20 10.5 20H13.5C14.5 20 15.3 19.2 15.4 18.2L16 7M10.5 10.2V16.5M13.5 10.2V16.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PaperclipIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.5 12.5L13.8 7.2C15 6 16.9 6 18.1 7.2C19.3 8.4 19.3 10.3 18.1 11.5L10.7 18.9C8.9 20.7 6 20.7 4.2 18.9C2.4 17.1 2.4 14.2 4.2 12.4L12 4.6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 7L17 17M17 7L7 17"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const MAX_FILE_CHARS = 12000;
const textFileExtensions = new Set([
  "txt",
  "md",
  "js",
  "jsx",
  "ts",
  "tsx",
  "json",
  "css",
  "html",
  "csv",
  "xml",
  "yml",
  "yaml",
  "py",
  "java",
  "c",
  "cpp",
  "go",
  "rs",
]);

const canReadFileAsText = (file) => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return file.type.startsWith("text/") || textFileExtensions.has(extension);
};

const formatFileSize = (size) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const MarkdownMessage = ({ content }) => (
  <ReactMarkdown
    components={{
      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
      h1: ({ children }) => <h1 className="mb-2 text-[17px] font-semibold sm:text-[18px]">{children}</h1>,
      h2: ({ children }) => <h2 className="mb-2 text-[16px] font-semibold">{children}</h2>,
      h3: ({ children }) => <h3 className="mb-2 text-[15px] font-semibold">{children}</h3>,
      ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
      ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
      li: ({ children }) => <li>{children}</li>,
      a: ({ children, href }) => (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-[#67e8f9] underline decoration-[#67e8f9]/50 underline-offset-2"
        >
          {children}
        </a>
      ),
      code: ({ children }) => (
        <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[12px] break-words text-[#f4d27f]">
          {children}
        </code>
      ),
      pre: ({ children }) => (
        <pre className="scrollbar-hide mb-2 overflow-x-auto rounded-[8px] bg-black/35 p-3 text-[12px] leading-5 last:mb-0">
          {children}
        </pre>
      ),
      blockquote: ({ children }) => (
        <blockquote className="mb-2 border-l-2 border-[#76d5cb]/40 pl-3 text-[#b8d2cd] last:mb-0">
          {children}
        </blockquote>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

const ThinkingMessage = () => (
  <div className="self-start">
    <div className="flex max-w-[72%] items-center gap-2 rounded-[16px] border border-[#76d5cb]/8 bg-[#122128] px-3 py-2 text-[12.5px] text-[#b8d2cd] sm:max-w-[220px] sm:rounded-[20px] sm:px-4 sm:py-3 sm:text-[13px]">
      <span>Thinking</span>
      <span className="flex items-center gap-1" aria-hidden="true">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8bb8b1]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8bb8b1] [animation-delay:160ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8bb8b1] [animation-delay:320ms]" />
      </span>
    </div>
  </div>
);

const Home = () => {
  const {
    initializeSocketConnection,
    disconnectSocket,
    handleGetChats,
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    chats,
    currentChatId,
    currentMessages,
    isLoading,
  } = useChat();

  const [prompt, setPrompt] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.matchMedia("(min-width: 640px)").matches;
  });
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sidebarRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const previousChats = Object.values(chats);

  useEffect(() => {
    initializeSocketConnection();
    handleGetChats();

    // return () => {
    //   disconnectSocket()
    // }
  }, [disconnectSocket, handleGetChats, initializeSocketConnection]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isAiThinking]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handlePointerDown = (event) => {
      if (sidebarRef.current?.contains(event.target)) {
        return;
      }

      setIsSidebarOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isSidebarOpen]);

  const handleAsk = async () => {
    const trimmedPrompt = prompt.trim();

    if ((!trimmedPrompt && !attachedFile) || isLoading || isAiThinking) {
      return;
    }

    const fileContext = attachedFile
      ? attachedFile.content
        ? `\n\nAttached file: ${attachedFile.name} (${attachedFile.sizeLabel})\n\n\`\`\`\n${attachedFile.content}\n\`\`\`${attachedFile.truncated ? "\n\nFile content was truncated." : ""}`
        : `\n\nAttached file: ${attachedFile.name} (${attachedFile.sizeLabel}). File content is not readable in the browser, so use the filename only.`
      : "";
    const messageToSend = `${trimmedPrompt || "Please look at the attached file."}${fileContext}`;
    const displayMessage = attachedFile
      ? `${trimmedPrompt || "Attached a file"}\n\nAttached: ${attachedFile.name}`
      : trimmedPrompt;

    setPrompt("");
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try{
      setIsAiThinking(true);
      await handleSendMessage({
        message: messageToSend,
        displayMessage,
        chatId: currentChatId,
      });
    }catch{
      setPrompt(trimmedPrompt);
      setAttachedFile(attachedFile);
    }finally{
      setIsAiThinking(false);
    }
  };

  const handleStartNewChat = () => {
    handleNewChat();
    setPrompt("");
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
  };

  const handleChatSelect = (chatId) => {
    handleSelectChat(chatId);
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
  };

  const handleChatDelete = async (chatId) => {
    const shouldDelete = window.confirm("Delete this chat?");

    if (!shouldDelete) {
      return;
    }

    await handleDeleteChat(chatId);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const baseFile = {
      name: file.name,
      sizeLabel: formatFileSize(file.size),
      content: "",
      truncated: false,
    };

    if (!canReadFileAsText(file)) {
      setAttachedFile({
        ...baseFile,
        content: null,
      });
      return;
    }

    const text = await file.text();
    setAttachedFile({
      ...baseFile,
      content: text.slice(0, MAX_FILE_CHARS),
      truncated: text.length > MAX_FILE_CHARS,
    });
  };

  const handlePromptKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAsk();
    }
  };

  const renderComposer = (isCentered = false) => (
    <div
      className={`mx-auto w-full min-w-0 ${isCentered ? "max-w-[920px]" : "max-w-[860px]"}`}
    >
      <div
        className={`rounded-[16px] border border-[#76d5cb]/10 bg-[#112128]/90 shadow-[0_20px_55px_rgba(3,10,16,0.28)] sm:rounded-[22px] ${
          isCentered ? "px-2.5 py-2 sm:px-4 sm:py-3" : "px-2.5 py-2 sm:px-3"
        }`}
      >
        {attachedFile && (
          <div className="mb-2 flex max-w-full items-center gap-2 rounded-xl border border-[#76d5cb]/10 bg-[#0b161a] px-2.5 py-1.5 text-[11px] text-[#b8d2cd]">
            <PaperclipIcon />
            <span className="min-w-0 flex-1 truncate">
              {attachedFile.name} · {attachedFile.sizeLabel}
            </span>
            <button
              type="button"
              onClick={() => {
                setAttachedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#7da39d] transition hover:bg-white/5 hover:text-[#eef8f6]"
              aria-label="Remove attached file"
            >
              <CloseIcon />
            </button>
          </div>
        )}
        <div className="flex min-w-0 items-end gap-1.5 sm:gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8bb8b1] transition hover:bg-white/5 hover:text-[#eef8f6] sm:h-9 sm:w-9"
            aria-label="Attach file"
          >
            <PaperclipIcon />
          </button>
          <textarea
            rows="1"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={handlePromptKeyDown}
            placeholder="Ask anything"
            className={`min-w-0 flex-1 resize-none bg-transparent px-1 text-[#edf7f5] outline-none placeholder:text-[#79a49d] ${
              isCentered
                ? "max-h-32 min-h-[38px] py-1.5 text-[14px] sm:max-h-40 sm:min-h-[50px] sm:py-2 sm:text-[16px]"
                : "max-h-28 min-h-[32px] py-1 text-[13px] sm:max-h-32 sm:min-h-[36px] sm:py-1.5 sm:text-[14px]"
            }`}
          />

          <button
            type="button"
            onClick={handleAsk}
            className={`flex shrink-0 items-center justify-center rounded-full border border-[#76d5cb]/18 bg-[#0b161a] text-[#b9d7d1] transition hover:border-[#76d5cb]/35 hover:bg-[#14272d] hover:text-[#eef8f6] ${
              isCentered ? "h-9 w-9 sm:h-10 sm:w-10" : "h-8 w-8"
            }`}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(103,232,249,0.12),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.14),_transparent_28%),linear-gradient(135deg,_#071016_0%,_#0c151c_48%,_#101826_100%)] text-white">
      <div className="relative h-full">
        {isSidebarOpen && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-black/35 sm:bg-transparent" />
        )}
        <aside
          ref={sidebarRef}
          className={`absolute left-0 top-0 z-20 flex h-dvh bg-[#0b1419]/95 rounded-[10px] transition-[width] duration-200 ${
            isSidebarOpen ? "w-[min(300px,calc(100vw-8px))]" : "w-[36px] sm:w-[40px]"
          }`}
        >
          <div className="flex w-[36px] shrink-0 flex-col items-center py-2.5 sm:w-[40px] sm:py-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((current) => !current)}
              className="flex h-7 w-7 items-center justify-center rounded-xl text-[#83aca5] outline-none transition hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#8bbcff] sm:h-8 sm:w-8"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <MenuIcon />
            </button>
          </div>

          {isSidebarOpen && (
            <div className="flex min-h-0 min-w-0 rounded-2xl flex-1 flex-col border-l border-[#76d5cb]/8 bg-[linear-gradient(180deg,#0f1c22_0%,#0b1318_100%)] sm:rounded-3xl">
              <div className="px-3.5 pt-3.5">
                <div className="rounded-2xl border border-[#76d5cb]/10 bg-[#15242b]/80 px-3.5 py-3.5 sm:rounded-3xl">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#133a41,#382811)] text-[#f3ca7a]">
                      <SparkIcon />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[#eef8f6]">
                        Perplexity
                      </p>
                      <p className="text-[11px] text-[#7ca39c]">
                        Aurora search workspace
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl bg-[#0b161a] px-3 py-2.5">
                    <p className="text-[11px] font-medium text-[#d8efeb]">
                      Start a fresh chat or reopen a recent thread.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-3.5 py-3">
                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="w-full rounded-2xl border border-[#76d5cb]/12 bg-[linear-gradient(135deg,#15343a_0%,#332513_100%)] px-3.5 py-3 text-left text-[13px] font-medium text-[#f4d27f] transition hover:border-[#76d5cb]/22 hover:brightness-110"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none text-[#f4d27f]">
                      +
                    </span>
                    <span>New chat</span>
                  </span>
                </button>
              </div>

              <div className="px-3.5 pb-2">
                <div className="flex items-center gap-2 rounded-2xl border border-[#76d5cb]/8 bg-[#101a1f] px-3 py-2.5">
                  <span className="text-[#7da39d]">
                    <ChatIcon />
                  </span>
                  <span className="text-[12px] text-[#84aba4]">
                    Search your chats
                  </span>
                </div>
              </div>

              <div className="scrollbar-hide flex-1 overflow-y-auto px-2.5 pb-3">
                <div className="mb-2 flex items-center justify-between px-1.5 pt-1">
                  <p className="px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#6f9790]">
                    Recent
                  </p>
                  <span className="px-2 text-[10px] text-[#5d7b75]">
                    {previousChats.length} chats
                  </span>
                </div>
                <div className="space-y-1">
                  {previousChats.map((chatItem, index) => (
                    <div
                      key={chatItem.id || chatItem._id || index}
                      className={`w-full rounded-2xl border px-3 py-2.5 text-left transition ${
                        (chatItem.id || chatItem._id) === currentChatId
                          ? "border-[#76d5cb]/14 bg-[linear-gradient(135deg,rgba(21,57,63,0.85),rgba(56,40,18,0.55))]"
                          : "border-transparent bg-transparent hover:border-[#76d5cb]/8 hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleChatSelect(chatItem.id || chatItem._id)}
                          className="flex min-w-0 flex-1 items-start gap-2.5 text-left"
                        >
                          <span
                            className={`mt-0.5 ${(chatItem.id || chatItem._id) === currentChatId ? "text-[#f4d27f]" : "text-[#7a9590]"}`}
                          >
                            <ChatIcon />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-medium text-[#e2f3ef]">
                              {chatItem.title}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-[#79938e]">
                              {(chatItem.id || chatItem._id) === currentChatId
                                ? "Active conversation"
                                : "Open conversation"}
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChatDelete(chatItem.id || chatItem._id)}
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#6f9790] transition hover:bg-red-500/10 hover:text-red-300"
                          aria-label={`Delete ${chatItem.title}`}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-3.5 pb-3.5">
                <div className="rounded-2xl border border-[#76d5cb]/8 bg-[#0f191d] px-3 py-2.5">
                  <p className="truncate text-[12px] font-medium text-[#d7efeb]">
                    {user?.name || "Guest user"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#79938e]">
                    Workspace ready
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>

        <main className="flex h-full min-h-0 min-w-0 flex-col pl-[36px] sm:pl-[40px]">
          <header className="px-2.5 py-2.5 sm:px-5 sm:py-3">
            <div className="flex min-w-0 items-center gap-1 leading-none text-white">
              <span className="truncate text-[18px] font-medium text-[#eef8f6] sm:text-[24px]">
                Perplexity
              </span>
              <span className="text-xs text-[#79a099]">⌄</span>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="scrollbar-hide flex-1 overflow-y-auto px-2.5 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2">
              {currentMessages.length === 0 && !isAiThinking ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-1 sm:gap-7">
                  <h1 className="max-w-[min(520px,100%)] text-center text-[21px] font-normal leading-tight text-[#eef8f6] sm:text-[38px]">
                    What&apos;s on the agenda today?
                  </h1>
                  {renderComposer(true)}
                </div>
              ) : (
                <div className="mx-auto flex w-full max-w-[860px] flex-col gap-2.5 pt-2 sm:gap-3 sm:pt-4">
                  {currentMessages.map((message, index) => (
                    <div
                      key={message.id || message._id || `${message.role}-${index}`}
                      className={
                        message.role === "user" ? "self-end" : "self-start"
                      }
                    >
                      <div
                        className={`overflow-hidden break-words rounded-[16px] px-3 py-2 text-[12.5px] leading-5 sm:max-w-[780px] sm:rounded-[20px] sm:px-4 sm:py-3 sm:text-[13px] sm:leading-6 ${
                          message.role === "user"
                            ? "max-w-[78%] bg-[linear-gradient(135deg,#15353b,#3a2a18)] text-[#eef8f6]"
                            : "max-w-[92%] border border-[#76d5cb]/8 bg-[#122128] text-[#d7ece8]"
                        }`}
                      >
                        {message.role === "user" ? (
                          message.content
                        ) : (
                          <MarkdownMessage content={message.content} />
                        )}
                      </div>
                    </div>
                  ))}
                  {isAiThinking && <ThinkingMessage />}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {(currentMessages.length > 0 || isAiThinking) && (
              <div className="px-2.5 pb-4 sm:px-5 sm:pb-5">{renderComposer(false)}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
