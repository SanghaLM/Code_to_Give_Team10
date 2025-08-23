import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MessageTeacherRoute = () => {
  const [currentScreen, setCurrentScreen] = useState("teacherList");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentBot, setCurrentBot] = useState(null);
  const [conversationStage, setConversationStage] = useState(0);
  const [feedbackCollected, setFeedbackCollected] = useState([]);
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const scrollViewRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  // 2 English-focused teaching assistants for kindergarten
  const teachingBots = [
    {
      id: "ms_luna",
      name: "Ms. Luna",
      subject: "Phonics & Letters",
      avatar: "🔤",
      personality: "encouraging",
      color: "#FF6B9D",
      hasUnread: true,
      lastMessage: "How did letter practice go today? 📝",
      lastSeen: "2 min ago",
      welcomeMessage:
        "Hello! 👋 I'm Ms. Luna, and I love helping little ones discover letters and sounds! Tell me, did your child practice any letters or phonics today?",
      conversationFlow: [
        {
          stage: 0,
          question: "Which letters or sounds did you focus on today?",
          quickResponses: [
            "ABC letters",
            "Letter sounds",
            "Writing practice",
            "We didn't practice",
          ],
        },
        {
          stage: 1,
          question:
            "How confident did your child seem? Did they recognize the letters easily?",
          quickResponses: [
            "Very confident! 😊",
            "Getting there 😐",
            "Still learning 😅",
            "Struggled a bit 😢",
          ],
        },
        {
          stage: 2,
          question:
            "That's valuable feedback! How long did you practice together?",
          quickResponses: [
            "5-10 minutes",
            "15-20 minutes",
            "30+ minutes",
            "Just a few minutes",
          ],
        },
        {
          stage: 3,
          question:
            "Perfect! Any particular letters they found tricky or exciting?",
          quickResponses: [
            "B and D confusion",
            "Loved writing",
            "Hard to sit still",
            "Ask me more",
          ],
        },
      ],
      tips: [
        "🎯 Try the 'letter hunt' - find that letter on cereal boxes, signs, anywhere!",
        "✏️ Trace letters in sand, salt, or finger paint - make it sensory!",
        "🎵 Letter songs help kids remember - sing the ABC song slowly!",
        "🏆 Celebrate small wins - recognizing just one letter is huge progress!",
      ],
      responses: {
        positive: [
          "That's absolutely wonderful! 🌟 Your child is making great progress!",
          "I love hearing success stories like this! ✨ Keep up the amazing work!",
          "Fantastic! 🎉 You're doing such a great job supporting their learning!",
        ],
        neutral: [
          "Thank you for being so honest! 💝 Every bit of practice helps.",
          "That's completely normal for kindergarten! 🌱 They're learning so much.",
          "Perfect feedback! 📝 This helps me understand where they are.",
        ],
        concern: [
          "No worries at all! 🤗 Every child learns at their own pace.",
          "That's totally okay! 💪 Some days are harder than others.",
          "Thank you for sharing that - it helps me support them better! 🌈",
        ],
      },
    },
    {
      id: "ms_rose",
      name: "Ms. Rose",
      subject: "Reading & Stories",
      avatar: "📚",
      personality: "nurturing",
      color: "#4ECDC4",
      hasUnread: false,
      lastMessage: "Great job on story time yesterday! 📖",
      lastSeen: "5 min ago",
      welcomeMessage:
        "Hi there! 🌹 I'm Ms. Rose, and I'm passionate about helping children fall in love with stories and reading! How was reading time today?",
      conversationFlow: [
        {
          stage: 0,
          question:
            "What did you read together today? A book, or maybe you told a story?",
          quickResponses: [
            "Picture book",
            "Made up story",
            "Online story",
            "No reading today",
          ],
        },
        {
          stage: 1,
          question:
            "Wonderful! How engaged was your little one? Were they asking questions or making comments?",
          quickResponses: [
            "Very engaged! 😍",
            "Listened well 😊",
            "A bit distracted 😐",
            "Hard to focus 😴",
          ],
        },
        {
          stage: 2,
          question:
            "That's really helpful to know! Did they try to 'read' any words or predict what comes next?",
          quickResponses: [
            "Yes, tried reading!",
            "Guessed the story",
            "Just listened",
            "Wanted to turn pages",
          ],
        },
        {
          stage: 3,
          question:
            "Beautiful! Any favorite characters or parts they got excited about?",
          quickResponses: [
            "Loved the animals",
            "Funny parts",
            "Asked to read again",
            "Tell me more",
          ],
        },
      ],
      tips: [
        "📖 Let them 'read' the pictures - describing what they see builds comprehension!",
        "🗣️ Ask 'What do you think happens next?' - prediction builds thinking skills!",
        "🎭 Act out the story together - movement helps memory and engagement!",
        "💤 Bedtime stories create positive associations with reading!",
      ],
      responses: {
        positive: [
          "Oh how wonderful! 📚 Building that love of stories is so important!",
          "That makes my heart happy! 💕 Keep nurturing that reading joy!",
          "Excellent! 🎉 You're creating a lifelong love of books!",
        ],
        neutral: [
          "Thank you for sharing! 📝 Every reading moment counts, big or small.",
          "That's perfectly normal! 🌸 Building reading habits takes time.",
          "I appreciate the honest feedback! 💖 This helps me understand their journey.",
        ],
        concern: [
          "That's completely okay! 🤗 Some days reading is harder than others.",
          "No pressure! 🌱 Even looking at books together is valuable.",
          "Thank you for trying! 💪 Tomorrow is a new opportunity to explore stories.",
        ],
      },
    },
  ];

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.stopAnimation();
    }
  }, [isTyping, typingAnimation]);

  const startChatWithBot = (bot) => {
    setCurrentBot(bot);
    setCurrentScreen("chat");
    setMessages([]);
    setConversationStage(0);
    setFeedbackCollected([]);
    setShowQuickResponses(false);

    // Mark as read
    const updatedBots = teachingBots.map((b) =>
      b.id === bot.id ? { ...b, hasUnread: false } : b
    );

    setTimeout(() => {
      addBotMessage(bot.welcomeMessage, bot);
      setShowQuickResponses(true);
    }, 1000);
  };

  const addBotMessage = (text, bot, delay = 0) => {
    setTimeout(() => {
      const newMessage = {
        id: Date.now() + Math.random(),
        text,
        sender: "bot",
        bot: bot,
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    }, delay);
  };

  const addUserMessage = (text, isQuickResponse = false) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
      type: isQuickResponse ? "quick" : "text",
    };
    setMessages((prev) => [...prev, newMessage]);
    setFeedbackCollected((prev) => [...prev, text]);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleQuickResponse = (response) => {
    addUserMessage(response, true);
    setInputText("");
    setShowQuickResponses(false);
    generateBotResponse(response);
  };

  const generateBotResponse = (userMessage) => {
    if (!currentBot) return;

    setIsTyping(true);
    setShowQuickResponses(false);

    setTimeout(() => {
      setIsTyping(false);

      try {
        const responses = getBotResponse(
          userMessage.toLowerCase(),
          conversationStage
        );

        responses.forEach((response, index) => {
          addBotMessage(response, currentBot, index * 1200);
        });

        // Show quick responses after bot responds (except for final stage)
        if (conversationStage < 3) {
          setTimeout(() => {
            setShowQuickResponses(true);
          }, responses.length * 1200 + 500);
        }

        setConversationStage((prev) => prev + 1);
      } catch (error) {
        console.error("Error generating response:", error);
        addBotMessage(
          "I'm sorry, I didn't quite catch that. Could you tell me more?",
          currentBot
        );
        setShowQuickResponses(true);
      }
    }, 1500);
  };

  const getBotResponse = (userInput, stage) => {
    if (
      !currentBot.conversationFlow ||
      stage >= currentBot.conversationFlow.length
    ) {
      return handleConversationEnd();
    }

    // Determine sentiment
    const isPositive =
      userInput.includes("confident") ||
      userInput.includes("great") ||
      userInput.includes("loved") ||
      userInput.includes("yes") ||
      userInput.includes("good") ||
      userInput.includes("engaged") ||
      userInput.includes("😊") ||
      userInput.includes("very");

    const isConcern =
      userInput.includes("struggle") ||
      userInput.includes("hard") ||
      userInput.includes("difficult") ||
      userInput.includes("no") ||
      userInput.includes("😢") ||
      userInput.includes("😐") ||
      userInput.includes("didn't") ||
      userInput.includes("distracted");

    let responses = [];

    // Contextual acknowledgment
    if (isPositive) {
      const positiveResponses = currentBot.responses.positive;
      responses.push(
        positiveResponses[Math.floor(Math.random() * positiveResponses.length)]
      );
    } else if (isConcern) {
      const concernResponses = currentBot.responses.concern;
      responses.push(
        concernResponses[Math.floor(Math.random() * concernResponses.length)]
      );

      // Add helpful tip for concerns
      const randomTip =
        currentBot.tips[Math.floor(Math.random() * currentBot.tips.length)];
      responses.push(`💡 Quick tip: ${randomTip}`);
    } else {
      const neutralResponses = currentBot.responses.neutral;
      responses.push(
        neutralResponses[Math.floor(Math.random() * neutralResponses.length)]
      );
    }

    // Next question
    if (stage < currentBot.conversationFlow.length - 1) {
      responses.push(currentBot.conversationFlow[stage + 1].question);
    }

    return responses;
  };

  const handleConversationEnd = () => {
    const responses = [
      "Thank you so much for this wonderful feedback! 📋 Let me create a summary for your child's teacher...",
    ];

    setTimeout(() => {
      showTeacherSummary();
    }, 2000);

    return responses;
  };

  const generateSummary = () => {
    const subject = currentBot.subject;
    const engagement = feedbackCollected.some(
      (f) =>
        f.includes("confident") || f.includes("engaged") || f.includes("loved")
    )
      ? "High"
      : feedbackCollected.some(
          (f) =>
            f.includes("struggle") ||
            f.includes("hard") ||
            f.includes("difficult")
        )
      ? "Needs Support"
      : "Progressing Well";

    return `📚 ${subject} Update - ${new Date().toLocaleDateString()}

🎯 Parent Feedback Summary:
${feedbackCollected
  .slice(0, 2)
  .map((feedback, i) => `• ${feedback}`)
  .join("\n")}

📊 Engagement Level: ${engagement}
⏰ Practice Duration: ${
      feedbackCollected.find((f) => f.includes("minute")) || "Not specified"
    }
🎉 Celebration Notes: ${
      feedbackCollected.find(
        (f) => f.includes("loved") || f.includes("excited")
      ) || "Steady progress"
    }

💡 AI Recommendations:
• Continue current approach
• Focus on areas mentioned as challenging
• Maintain positive reinforcement

👩‍🏫 Next Steps: Teacher will review and adjust lesson plans accordingly`;
  };

  const showTeacherSummary = () => {
    const summary = generateSummary();

    Alert.alert("📋 Teacher Summary Ready", summary, [
      {
        text: "📞 Request Teacher Call",
        onPress: () => requestEscalation("call"),
      },
      {
        text: "💬 Message Teacher",
        onPress: () => requestEscalation("message"),
      },
      {
        text: "✅ Send Summary",
        style: "default",
        onPress: () => {
          Alert.alert(
            "Sent! ✅",
            "Your feedback has been sent to the teacher. They'll use this to personalize upcoming lessons!"
          );
        },
      },
    ]);
  };

  const requestEscalation = (type) => {
    const typeText = type === "call" ? "call" : "direct message";
    Alert.alert(
      `📞 ${type === "call" ? "Teacher Call" : "Teacher Message"} Requested`,
      `Your request for a ${typeText} with your child's ${currentBot.subject} teacher has been submitted!\n\n⏰ Expected response: Within 24 hours\n📝 They'll have your feedback summary ready\n\n🔔 You'll get a notification when they respond!`,
      [
        {
          text: "Perfect! 👍",
          style: "default",
        },
      ]
    );
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    addUserMessage(userMessage);
    setInputText("");
    setShowQuickResponses(false);

    generateBotResponse(userMessage);
  };

  const renderQuickResponses = () => {
    if (!showQuickResponses || !currentBot?.conversationFlow) return null;

    const currentStage = currentBot.conversationFlow[conversationStage];
    if (!currentStage?.quickResponses) return null;

    return (
      <View style={styles.quickResponseContainer}>
        <Text style={styles.quickResponseTitle}>Quick responses:</Text>
        <View style={styles.quickResponseButtons}>
          {currentStage.quickResponses.map((response, index) => (
            <Pressable
              key={index}
              style={styles.quickResponseButton}
              onPress={() => handleQuickResponse(response)}
            >
              <Text style={styles.quickResponseText}>{response}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  const renderTeacherCard = ({ item }) => (
    <Pressable
      style={[styles.teacherCard, { borderLeftColor: item.color }]}
      onPress={() => startChatWithBot(item)}
    >
      <View style={styles.teacherHeader}>
        <Text style={styles.teacherAvatar}>{item.avatar}</Text>
        <View style={styles.teacherInfo}>
          <View style={styles.teacherNameRow}>
            <Text style={styles.teacherName}>{item.name}</Text>
            {item.hasUnread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.teacherSubject}>{item.subject}</Text>
        </View>
        <View style={styles.teacherStatus}>
          <Text style={[styles.lastSeen, item.hasUnread && styles.unreadText]}>
            {item.lastSeen}
          </Text>
          <View style={styles.onlineDot} />
        </View>
      </View>
      <Text
        style={[styles.lastMessage, item.hasUnread && styles.unreadMessage]}
      >
        {item.lastMessage}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.tapHint}>
          {item.hasUnread ? "💬 New message - Tap to respond" : "Tap to chat"}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#999" />
      </View>
    </Pressable>
  );

  const renderMessage = (message) => {
    const isBot = message.sender === "bot";
    const isQuick = message.type === "quick";

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isBot ? styles.botMessage : styles.userMessage,
        ]}
      >
        {isBot && (
          <View style={styles.botHeader}>
            <Text style={styles.botAvatar}>{message.bot?.avatar}</Text>
            <Text style={styles.botName}>{message.bot?.name}</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isBot ? styles.botBubble : styles.userBubble,
            isQuick && styles.quickBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isBot ? styles.botText : styles.userText,
            ]}
          >
            {message.text}
          </Text>
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.botMessage]}>
        <View style={styles.botHeader}>
          <Text style={styles.botAvatar}>{currentBot?.avatar}</Text>
          <Text style={styles.botName}>{currentBot?.name}</Text>
        </View>
        <View style={[styles.messageBubble, styles.botBubble]}>
          <View style={styles.typingContainer}>
            <Animated.View
              style={[styles.typingDot, { opacity: typingAnimation }]}
            />
            <Animated.View
              style={[styles.typingDot, { opacity: typingAnimation }]}
            />
            <Animated.View
              style={[styles.typingDot, { opacity: typingAnimation }]}
            />
            <Text style={styles.typingText}>typing...</Text>
          </View>
        </View>
      </View>
    );
  };

  if (currentScreen === "teacherList") {
    return (
      <View style={styles.container}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Teaching Assistants</Text>
          <Text style={styles.listSubtitle}>
            Your child's AI learning companions 🤖✨
          </Text>
        </View>

        <FlatList
          data={teachingBots}
          renderItem={renderTeacherCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.teacherList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.bottomTip}>
          <Ionicons name="bulb" size={16} color="#FFB347" />
          <Text style={styles.tipText}>
            Share daily updates and get personalized tips! 💡
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => setCurrentScreen("teacherList")}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerAvatar}>{currentBot?.avatar}</Text>
          <View>
            <Text style={styles.headerName}>{currentBot?.name}</Text>
            <Text style={styles.headerSubject}>{currentBot?.subject}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.actionButton, styles.callButton]}
            onPress={() => requestEscalation("call")}
          >
            <Ionicons name="call" size={16} color="#007AFF" />
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.messageButton]}
            onPress={() => requestEscalation("message")}
          >
            <Ionicons name="mail" size={16} color="#FF6B9D" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        {renderTypingIndicator()}
      </ScrollView>

      {renderQuickResponses()}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your response or use quick replies above..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <Pressable
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listHeader: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    fontFamily: "BalsamiqSans_400Regular",
  },
  listSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    fontFamily: "BalsamiqSans_400Regular",
  },
  teacherList: {
    padding: 20,
    paddingBottom: 100,
  },
  teacherCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  teacherHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  teacherAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  teacherName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontFamily: "BalsamiqSans_400Regular",
    marginRight: 8,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF4757",
  },
  teacherSubject: {
    fontSize: 14,
    color: "#666",
    fontFamily: "BalsamiqSans_400Regular",
  },
  teacherStatus: {
    alignItems: "flex-end",
  },
  lastSeen: {
    fontSize: 12,
    color: "#10b981",
    fontFamily: "BalsamiqSans_400Regular",
  },
  unreadText: {
    color: "#FF4757",
    fontWeight: "600",
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#333",
    fontFamily: "BalsamiqSans_400Regular",
    marginBottom: 8,
  },
  unreadMessage: {
    color: "#000",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tapHint: {
    fontSize: 12,
    color: "#999",
    fontFamily: "BalsamiqSans_400Regular",
  },
  bottomTip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff9e6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  tipText: {
    fontSize: 14,
    color: "#B8860B",
    marginLeft: 8,
    fontFamily: "BalsamiqSans_400Regular",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontFamily: "BalsamiqSans_400Regular",
  },
  headerSubject: {
    fontSize: 14,
    color: "#666",
    fontFamily: "BalsamiqSans_400Regular",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  callButton: {
    backgroundColor: "#e3f2fd",
  },
  messageButton: {
    backgroundColor: "#fce4ec",
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 15,
  },
  botMessage: {
    alignItems: "flex-start",
  },
  userMessage: {
    alignItems: "flex-end",
  },
  botHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  botAvatar: {
    fontSize: 20,
    marginRight: 8,
  },
  botName: {
    fontSize: 12,
    color: "#666",
    fontFamily: "BalsamiqSans_400Regular",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 20,
    padding: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  botBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 5,
  },
  quickBubble: {
    backgroundColor: "#e3f2fd",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "BalsamiqSans_400Regular",
  },
  botText: {
    color: "#000",
  },
  userText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 11,
    color: "#999",
    marginTop: 8,
    alignSelf: "flex-end",
    fontFamily: "BalsamiqSans_400Regular",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#999",
    marginRight: 4,
  },
  typingText: {
    fontSize: 14,
    color: "#999",
    marginLeft: 8,
    fontStyle: "italic",
    fontFamily: "BalsamiqSans_400Regular",
  },
  quickResponseContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  quickResponseTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontFamily: "BalsamiqSans_400Regular",
  },
  quickResponseButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickResponseButton: {
    backgroundColor: "#f0f8ff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  quickResponseText: {
    fontSize: 14,
    color: "#007AFF",
    fontFamily: "BalsamiqSans_400Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    fontFamily: "BalsamiqSans_400Regular",
    backgroundColor: "#f8f9fa",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
});

export default MessageTeacherRoute;
