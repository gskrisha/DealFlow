// frontend/src/components/in Flow/LogoScroll.jsx
import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Mail, MessageCircle, FileText, Calendar, Users, Database } from "lucide-react";

export function LogoScroll() {
  const integrations = [
    { name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
    { name: "Gmail", icon: Mail, color: "text-red-600" },
    { name: "WhatsApp", icon: MessageCircle, color: "text-green-600" },
    { name: "Outlook", icon: Mail, color: "text-blue-500" },
    { name: "Slack", icon: MessageCircle, color: "text-purple-600" },
    { name: "Notion", icon: FileText, color: "text-slate-700" },
    { name: "Calendar", icon: Calendar, color: "text-orange-600" },
    { name: "Teams", icon: Users, color: "text-blue-700" },
  ];

  const duplicated = [...integrations, ...integrations];

  return (
    <div className="bg-linear-to-r from-indigo-50 via-white to-purple-50 border-y border-slate-200 py-6 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl mb-3">
        <p className="text-center text-slate-600 text-sm">Seamlessly integrated with your workflow</p>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-12 px-6"
          style={{ width: "max-content" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          {duplicated.map((integration, idx) => {
            const Icon = integration.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white rounded-xl px-6 py-3 border border-slate-200 shadow-sm min-w-fit"
              >
                <Icon className={integration.color} size={24} />
                <span className="text-slate-700 whitespace-nowrap">{integration.name}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
