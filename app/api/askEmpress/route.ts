import { type NextRequest, NextResponse } from "next/server"

// TODO: Integrate with OpenAI GPT or Google Gemini API with RAG for menopause-specific knowledge
// System prompt: "You are Empress Sense, a menopause concierge providing educational support and guidance.
// You offer evidence-based information about menopause symptoms, lifestyle strategies, and general wellness.
// You are warm, knowledgeable, and supportive, but always clarify that you provide education, not medical diagnosis.
// Encourage users to consult healthcare providers for medical concerns."

const menopauseResponses = {
  "hot flashes": [
    "Hot flashes are one of the most common menopause symptoms, affecting up to 75% of women. They're caused by hormonal changes that affect your body's temperature regulation. Try keeping a fan nearby, wearing breathable layers, and avoiding triggers like spicy foods, caffeine, and alcohol. Deep breathing exercises can also help when you feel one coming on.",
    "Hot flashes can be intense, but there are ways to manage them! Consider keeping a symptom diary to identify your personal triggers. Many women find relief through cooling techniques like cold water on wrists, breathable cotton clothing, and maintaining a cool sleeping environment. Regular exercise and stress management can also reduce their frequency.",
  ],
  "sleep issues": [
    "Sleep disruption during menopause is incredibly common due to hormonal changes, night sweats, and increased anxiety. Create a cool, dark sleeping environment and establish a consistent bedtime routine. Avoid screens before bed, limit caffeine after 2 PM, and consider relaxation techniques like gentle yoga or meditation before sleep.",
    "Menopause can really disrupt sleep patterns! Try keeping your bedroom temperature around 65-68°F, use moisture-wicking sleepwear, and consider a cooling mattress pad. A warm bath before bed can help regulate your body temperature. If sleep issues persist, discuss options with your healthcare provider.",
  ],
  "mood changes": [
    "Mood fluctuations during menopause are completely normal and are largely due to hormonal changes affecting neurotransmitters in your brain. Regular exercise, maintaining social connections, and practicing stress-reduction techniques like mindfulness can help stabilize mood. Don't hesitate to reach out for support when you need it.",
    "The emotional ups and downs of menopause can feel overwhelming, but you're not alone. Hormonal changes can affect serotonin and other mood-regulating chemicals. Consider keeping a mood journal, practicing deep breathing exercises, and ensuring you're getting enough omega-3 fatty acids in your diet. Professional counseling can also be very helpful during this transition.",
  ],
  "weight gain": [
    "Weight changes during menopause are common due to hormonal shifts that affect metabolism and fat distribution. Focus on strength training to maintain muscle mass, eat plenty of protein, and prioritize whole foods. Remember, this is about health and feeling good in your body, not just the number on the scale.",
    "Menopause can change how your body stores fat, often shifting it to the midsection. Combat this with regular resistance exercise, adequate protein intake (aim for 25-30g per meal), and staying hydrated. Small, consistent changes in eating patterns often work better than dramatic diets during this time.",
  ],
  "brain fog": [
    "Brain fog - that feeling of mental cloudiness - affects many women during menopause. It's linked to hormonal changes affecting neurotransmitters. Stay mentally active with puzzles or learning new skills, get quality sleep, manage stress, and ensure you're eating brain-healthy foods like omega-3 rich fish and antioxidant-rich berries.",
    "That fuzzy, forgetful feeling is real and frustrating! Brain fog during menopause is often related to estrogen fluctuations. Try breaking tasks into smaller steps, use lists and reminders, stay physically active (it boosts brain blood flow), and consider meditation to improve focus. Most women find it improves as hormones stabilize.",
  ],
  "joint pain": [
    "Joint aches and stiffness can increase during menopause as estrogen levels decline. Estrogen has anti-inflammatory properties, so its reduction can affect joint health. Gentle, regular movement like walking or swimming, anti-inflammatory foods like turmeric and leafy greens, and maintaining a healthy weight can help manage discomfort.",
    "Joint pain during menopause is often related to decreased estrogen, which affects cartilage and bone health. Stay active with low-impact exercises, consider yoga or tai chi for flexibility, and include calcium and vitamin D in your diet. Warm baths and gentle stretching can provide relief for daily stiffness.",
  ],
  default: [
    "That's a great question about your menopause journey. Every woman's experience is unique, and what works for one person may be different for another. I'd encourage you to track your symptoms and discuss your specific concerns with a healthcare provider who can give you personalized guidance.",
    "Thank you for sharing that with me. Menopause is a significant life transition, and it's normal to have questions and concerns. While I can provide general educational information, your healthcare provider is the best resource for advice tailored to your specific situation and health history.",
    "I appreciate you asking about this. The menopause transition affects every woman differently, and there's no 'one size fits all' approach. Consider keeping a symptom journal to track patterns, and don't hesitate to advocate for yourself with healthcare providers to get the support you need.",
  ],
}

function getResponseCategory(question: string): keyof typeof menopauseResponses {
  const lowerQuestion = question.toLowerCase()

  if (lowerQuestion.includes("hot flash") || lowerQuestion.includes("hot flush") || lowerQuestion.includes("heat")) {
    return "hot flashes"
  }
  if (lowerQuestion.includes("sleep") || lowerQuestion.includes("insomnia") || lowerQuestion.includes("night sweat")) {
    return "sleep issues"
  }
  if (
    lowerQuestion.includes("mood") ||
    lowerQuestion.includes("anxiety") ||
    lowerQuestion.includes("depression") ||
    lowerQuestion.includes("irritab")
  ) {
    return "mood changes"
  }
  if (lowerQuestion.includes("weight") || lowerQuestion.includes("gain") || lowerQuestion.includes("metabolism")) {
    return "weight gain"
  }
  if (
    lowerQuestion.includes("brain fog") ||
    lowerQuestion.includes("memory") ||
    lowerQuestion.includes("concentration") ||
    lowerQuestion.includes("focus")
  ) {
    return "brain fog"
  }
  if (
    lowerQuestion.includes("joint") ||
    lowerQuestion.includes("ache") ||
    lowerQuestion.includes("pain") ||
    lowerQuestion.includes("stiff")
  ) {
    return "joint pain"
  }

  return "default"
}

export async function POST(request: NextRequest) {
  try {
    const { question, context } = await request.json()

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    // TODO: Replace with actual AI API call with RAG
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     {
    //       role: "system",
    //       content: `You are Empress Sense, a menopause concierge providing educational support and guidance.
    //                You offer evidence-based information about menopause symptoms, lifestyle strategies, and general wellness.
    //                You are warm, knowledgeable, and supportive, but always clarify that you provide education, not medical diagnosis.
    //                Encourage users to consult healthcare providers for medical concerns.
    //
    //                Context: ${context?.symptomFocus ? `User is focused on: ${context.symptomFocus}` : ''}
    //                ${context?.stage ? `Menopause stage: ${context.stage}` : ''}`
    //     },
    //     { role: "user", content: question }
    //   ],
    //   max_tokens: 400,
    //   temperature: 0.7,
    // });

    // Mock response logic for menopause-specific topics
    const category = getResponseCategory(question)
    const responses = menopauseResponses[category]
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    return NextResponse.json({
      answer: randomResponse,
    })
  } catch (error) {
    console.error("AskEmpress API error:", error)
    return NextResponse.json(
      {
        error: "I'm having trouble responding right now. Please try again.",
      },
      { status: 500 },
    )
  }
}
