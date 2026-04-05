import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event) => {
  // 只允许 POST 请求
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { content } = JSON.parse(event.body);

    const prompt = `你是一个高校教学专家。请从以下教学大纲文本中提取课程信息。请以严格的 JSON 格式返回，包含字段：courseName, courseId, semester, courseNature, credits (数字), classHours (数字), examType, objectiveDescriptions (字符串数组)。大纲文本如下：\n\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: text }),
    };
  } catch (error) {
    console.error("AI 分析错误:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI 分析失败" }),
    };
  }
};
