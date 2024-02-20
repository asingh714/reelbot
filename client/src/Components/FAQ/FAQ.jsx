import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

import "./FAQ.scss";
import Chevron from "@assets/chevron.svg";

const faqs = [
  {
    question: "What is ReelBot?",
    answer:
      "ReelBot is an AI-driven chatbot that provides personalized movie recommendations...",
  },
  {
    question: "How can I get started with ReelBot?",
    answer:
      "Getting started is easy. Simply visit the ReelBot website, and start a conversation with the chatbot. No sign-up required—jump straight into discovering great movies.",
  },
  {
    question: "How does ReelBot personalize recommendations?",
    answer:
      "ReelBot uses your movie preferences and viewing history to suggest titles you'll love. The more you interact, the smarter it gets—curating a list that feels hand-picked just for you.",
  },
  {
    question:
      "Can ReelBot help me find movies for my specific mood or occasion?",
    answer: `Absolutely! Tell ReelBot how you're feeling, or what occasion you're planning for, and it will offer recommendations that fit the bill. From "date night" to "family-friendly" or "feel-good films," ReelBot has a suggestion for every scenario.`,
  },
  {
    question: "Is ReelBot compatible with my favorite streaming services?",
    answer:
      "Yes, ReelBot integrates with various streaming platforms. It will not only recommend movies but also direct you to where you can watch them online.",
  },

  {
    question:
      "How can I provide feedback on the recommendations ReelBot gives me?",
    answer:
      "ReelBot values your feedback! After watching a movie, you can rate it and provide comments directly through the chatbot. This helps ReelBot refine future suggestions.",
  },
];

const FAQItem = ({ faq, isOpen, toggle }) => {
  const rotate = isOpen ? 180 : 0;
  return (
    <div className="faq-item">
      <div className="faq-question" onClick={toggle}>
        <h4>{faq.question}</h4>
        <motion.img
          src={Chevron}
          className="chevron-icon"
          animate={{ rotate }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="faq-answer"
          >
            <p>{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

FAQItem.propTypes = {
  faq: PropTypes.shape({
    question: PropTypes.string,
    answer: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>

      <div className="faq-items">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            faq={faq}
            isOpen={openIndex === index}
            toggle={() => toggleFAQ(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
