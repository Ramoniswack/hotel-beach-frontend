'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { contactSettingsAPI } from '@/lib/api';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Sparkles,
  User,
  Bot,
  UtensilsCrossed,
  Sparkle,
  Waves,
  Car,
  Wine,
  Wifi,
  Key,
  Briefcase,
  Bed,
  Droplet,
  Coffee,
  Salad,
  Beef,
  Cake,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ContactSettings {
  phone: string;
  email: string;
  location: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  serviceHours: {
    frontDesk: string;
    roomService: string;
    concierge: string;
    spa: string;
    restaurant: string;
  };
  emergencyHotline: string;
}

export default function GuestContact() {
  const { user } = useAuthStore();
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${user?.name || 'Guest'}! I'm your AI Concierge. How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      const response = await contactSettingsAPI.get();
      setContactSettings(response.data.data);
    } catch (error) {
      console.error('Error fetching contact settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { text: 'Room service menu', icon: UtensilsCrossed },
    { text: 'Request housekeeping', icon: Sparkle },
    { text: 'Book spa appointment', icon: Sparkles },
    { text: 'Local recommendations', icon: MapPin },
    { text: 'Transportation help', icon: Car },
    { text: 'Restaurant reservations', icon: Wine },
  ];

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputMessage.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('room service') || lowerMessage.includes('food') || lowerMessage.includes('menu')) {
      return "I'd be happy to help with room service! Our menu includes:\n\n• Breakfast (7am-11am)\n• Lunch (12pm-3pm)\n• Dinner (6pm-10pm)\n• Desserts & Drinks (24/7)\n\nWould you like me to send you the full menu or help you place an order?";
    }

    if (lowerMessage.includes('housekeeping') || lowerMessage.includes('clean')) {
      return "I'll arrange housekeeping for you right away! Our team typically responds within 30 minutes. Would you like:\n\n• Full room cleaning\n• Fresh towels & linens\n• Amenity refill\n\nPlease let me know your preference!";
    }

    if (lowerMessage.includes('spa') || lowerMessage.includes('massage')) {
      return "Our luxury spa offers amazing treatments!\n\nPopular services:\n• Swedish Massage (60min) - $120\n• Hot Stone Therapy (90min) - $180\n• Couples Massage (60min) - $220\n• Facial Treatment (45min) - $95\n\nAvailable daily 9am-8pm. Would you like to book an appointment?";
    }

    if (lowerMessage.includes('restaurant') || lowerMessage.includes('dining') || lowerMessage.includes('reservation')) {
      return "I can help you with restaurant reservations!\n\nOur recommendations:\n• Sunset Terrace (Mediterranean) - In-house\n• Ambrosia (Fine Dining) - 5min walk\n• Taverna Katina (Traditional Greek) - 10min walk\n\nWhat type of cuisine are you interested in?";
    }

    if (lowerMessage.includes('beach') || lowerMessage.includes('pool') || lowerMessage.includes('swim')) {
      return "Great choice!\n\n• Beach access: Open 24/7, 2min walk\n• Pool: Open 7am-10pm, rooftop level\n• Water sports: Available 9am-6pm\n\nBeach towels and umbrellas are complimentary. Need anything else?";
    }

    if (lowerMessage.includes('transport') || lowerMessage.includes('taxi') || lowerMessage.includes('car')) {
      return "I can arrange transportation for you!\n\n• Airport transfer\n• Taxi service\n• Car rental\n• Private driver\n• Boat tours\n\nWhere would you like to go?";
    }

    if (lowerMessage.includes('recommend') || lowerMessage.includes('visit') || lowerMessage.includes('see')) {
      return "Santorini has so much to offer!\n\nMust-see attractions:\n• Oia Sunset (30min drive)\n• Red Beach (15min drive)\n• Ancient Akrotiri (20min drive)\n• Wine Tasting Tours\n• Volcano & Hot Springs\n\nWould you like detailed directions or help booking a tour?";
    }

    if (lowerMessage.includes('wifi') || lowerMessage.includes('internet') || lowerMessage.includes('password')) {
      return "WiFi Information:\n\nNetwork: HotelBeach_Guest\nPassword: Santorini2024\n\nHigh-speed internet is complimentary throughout the hotel. Having connection issues? Let me know!";
    }

    if (lowerMessage.includes('checkout') || lowerMessage.includes('check out')) {
      return "Checkout information:\n\nStandard checkout: 11:00 AM\nLate checkout: Available until 2:00 PM (+$50)\nLuggage storage: Complimentary\n\nWould you like to arrange late checkout or luggage storage?";
    }

    // Default response
    return "I'm here to help! I can assist you with:\n\n• Room service & dining\n• Housekeeping requests\n• Spa & wellness bookings\n• Local recommendations\n• Transportation arrangements\n• General hotel information\n\nWhat would you like to know more about?";
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  return (
    <RouteGuard allowedRoles={['guest']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#59a4b5] to-[#4a8a99] rounded-lg p-4 sm:p-6 md:p-8 text-white">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">AI Concierge</h2>
            </div>
            <p className="text-sm sm:text-base text-white/90">24/7 assistance for all your needs</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-[500px] sm:h-[600px]">
                {/* Chat Header */}
                <div className="bg-[#59a4b5] text-white p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold">AI Concierge</h3>
                    <p className="text-xs text-white/80">Always here to help</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex items-start space-x-1.5 sm:space-x-2 max-w-[85%] sm:max-w-[80%] ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.sender === 'user'
                              ? 'bg-[#59a4b5] text-white'
                              : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          {message.sender === 'user' ? (
                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          ) : (
                            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                        </div>
                        <div>
                          <div
                            className={`rounded-lg p-2.5 sm:p-3 ${
                              message.sender === 'user'
                                ? 'bg-[#59a4b5] text-white'
                                : 'bg-white border border-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-xs sm:text-sm whitespace-pre-line">{message.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-1.5 sm:space-x-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-3">
                          <div className="flex space-x-1.5 sm:space-x-2">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="border-t border-gray-200 p-2.5 sm:p-3 bg-white">
                  <p className="text-xs text-gray-600 mb-1.5 sm:mb-2">Quick actions:</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {quickActions.map((action, index) => {
                      const IconComponent = action.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action.text)}
                          className="px-2 sm:px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors flex items-center space-x-1"
                        >
                          <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden xs:inline">{action.text}</span>
                          <span className="xs:hidden">{action.text.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-3 sm:p-4 bg-white">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex space-x-2"
                  >
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="px-3 sm:px-6 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 sm:space-x-2"
                    >
                      <Send className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                      <span className="hidden sm:inline text-sm sm:text-base">Send</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* Direct Contact */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Direct Contact</span>
                </h3>
                {isLoadingSettings ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#59a4b5]" />
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <a
                      href={`tel:${contactSettings?.phone || ''}`}
                      className="flex items-start space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-medium text-gray-900">Phone</p>
                        <p className="text-xs sm:text-sm text-gray-600">{contactSettings?.phone || 'N/A'}</p>
                        <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">24/7 Front Desk</p>
                      </div>
                    </a>

                    <a
                      href={`mailto:${contactSettings?.email || ''}`}
                      className="flex items-start space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-medium text-gray-900">Email</p>
                        <p className="text-xs sm:text-sm text-gray-600 break-all">{contactSettings?.email || 'N/A'}</p>
                        <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Response within 1 hour</p>
                      </div>
                    </a>

                    <div className="flex items-start space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-lg">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-medium text-gray-900">Location</p>
                        <p className="text-xs sm:text-sm text-gray-600">{contactSettings?.location.address || 'N/A'}</p>
                        <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                          {contactSettings?.location.city || 'N/A'}, {contactSettings?.location.country || 'N/A'} {contactSettings?.location.postalCode || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hours */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Service Hours</span>
                </h3>
                {isLoadingSettings ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#59a4b5]" />
                  </div>
                ) : (
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">Front Desk</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">{contactSettings?.serviceHours.frontDesk || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">Room Service</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">{contactSettings?.serviceHours.roomService || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">Concierge</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">{contactSettings?.serviceHours.concierge || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">Spa</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">{contactSettings?.serviceHours.spa || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">Restaurant</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">{contactSettings?.serviceHours.restaurant || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-red-900 mb-1.5 sm:mb-2">Emergency</h3>
                <p className="text-xs sm:text-sm text-red-700 mb-2.5 sm:mb-3">
                  For urgent assistance, please call:
                </p>
                {isLoadingSettings ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                  </div>
                ) : (
                  <a
                    href={`tel:${contactSettings?.emergencyHotline || ''}`}
                    className="block w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-center font-bold"
                  >
                    Emergency Hotline
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
