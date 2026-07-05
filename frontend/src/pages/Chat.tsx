import {
    Box,
} from "@mui/material";

import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/ui/PageHeader";

import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import ConversationList from "../components/chat/ConversationList";

import useChat from "../hooks/useChat";

export default function Chat() {

    const {

        sessions,

        messages,

        question,

        loading,

        sessionId,

        setQuestion,

        sendMessage,

        loadChat,

        newChat,

    } = useChat();

    return (

        <MainLayout>

            <PageHeader

                title="AI Assistant"

                subtitle="Ask questions about your uploaded documents."

            />

            <Box
                display="flex"
                gap={2}
            >

                <ConversationList

                    sessions={sessions}

                    selectedId={sessionId}

                    onSelect={loadChat}

                    onNewChat={newChat}

                />

                <Box
                    flex={1}
                >

                    <ChatWindow

                        messages={messages}
                        loading={loading}

                    />

                    <ChatInput

                        question={question}

                        setQuestion={setQuestion}

                        onSend={sendMessage}

                        loading={loading}

                    />

                </Box>

            </Box>

        </MainLayout>

    );

}