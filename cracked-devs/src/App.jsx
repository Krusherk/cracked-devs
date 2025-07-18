import { useEffect, useState, useRef } from "react"
import { ethers } from "ethers"
import { ChatModel } from "./multisynq/ChatModel"
import { ChatView } from "./multisynq/ChatView"
import { Message } from "./components/Message"
import { WalletButton } from "./components/WalletButton"

const model = new ChatModel()

export default function App() {
  const [input, setInput] = useState("")
  const [view, setView] = useState(null)
  const [provider, setProvider] = useState(null)
  const [address, setAddress] = useState("")
  const [nickname, setNickname] = useState("")
  const [_, forceRender] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [model.history])

  // Wallet connect & chat init
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!")
      return
    }

    const _provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await _provider.getSigner()
    const addr = await signer.getAddress()

    setProvider(_provider)
    setAddress(addr)

    const chatView = new ChatView(model, { address: addr })
    setView(chatView)

    chatView.refreshViewInfo = () => {
      const nick = model.views.get(chatView.viewId)?.nickname || ""
      setNickname(nick)
    }

    chatView.refreshViewInfo()
  }

  // Handle send (either message or MON transfer)
  const handleSend = async () => {
    const text = input.trim()
    if (!text || !view) return
    setInput("")

    if (text.startsWith("@")) {
      const [name, amt] = text.slice(1).split(" ")
      if (!name || !amt) return

      const recipient = Array.from(model.views.values()).find(
        (v) => v.nickname?.toLowerCase() === name.toLowerCase()
      )

      if (!recipient?.address) {
        model.addToHistory({
          html: `❌ <b>${nickname}:</b> User @${name} not found`,
        })
        forceRender((x) => !x)
        return
      }

      try {
        const signer = await provider.getSigner()
        await signer.sendTransaction({
          to: recipient.address,
          value: ethers.parseEther(amt),
        })
        view.send(`sent ${amt} MON to @${name} 💸`)
      } catch (err) {
        model.addToHistory({
          html: `❌ <b>${nickname}:</b> Failed to send ${amt} MON to @${name}`,
        })
        console.error("Transfer failed:", err)
        forceRender((x) => !x)
      }

      return
    }

    // Normal message
    view.send(text)
  }

  // Handle Enter key
  const onKeyDown = (e) => {
    if (e.key === "Enter") handleSend()
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4">
          <h1 className="text-xl font-bold">CRACKED DEVS</h1>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span>{nickname && `You're ${nickname}`}</span>
            <WalletButton address={address} onConnect={connectWallet} />
          </div>
        </div>

        {/* Messages */}
        <div className="h-72 p-4 overflow-y-auto bg-gray-50 flex-1">
          {model.history.map((msg, i) => (
            <Message
              key={i}
              html={msg.html}
              isCurrentUser={msg.viewId === view?.viewId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder='Say something or "@jack 0.1" to send MON'
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 italic text-center">
            made by crack
          </p>
        </div>
      </div>
    </div>
  )
}
