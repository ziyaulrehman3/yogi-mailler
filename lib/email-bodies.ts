/**
 * Six roles. Use the same `position` string in JSON (case/spacing normalized for matching).
 * Replace example paragraphs with your final templates.
 */
export const EMAIL_BODIES_BY_POSITION: Record<string, string> = {
  "React Native": `Dear HR Manager,

Hi, I’m Ziya Ul Rehman, a React Native Developer with hands-on experience in building Android and iOS applications. I have worked on applications across categories such as EdTech, food delivery, and home services platforms (similar to Urban Company), along with payment gateway integrations and implementation of native device features.

I work with React Native CLI & Expo, REST APIs, Reanimated, and various React Native libraries to ensure smooth UI and high performance. I am open to new opportunities and would be glad to discuss how I can contribute to your team.

Please find my resume attached. I would be happy to discuss this opportunity further.

Best Regards,
Ziya Ul Rehman
+91-8383965569
LinkedIn: https://www.linkedin.com/in/ziya-ul-rehman`,

  "Mobile App": `Dear HR Manager,

Hi, I’m Ziya Ul Rehman, a Mobile App Developer with hands-on experience in building Android and iOS applications. I have worked on applications across categories such as EdTech, food delivery, and home services platforms (similar to Urban Company), along with payment gateway integrations and implementation of native device features.

I work with React Native CLI & Expo, REST APIs, Reanimated, and various React Native libraries to ensure smooth UI and high performance. I am open to new opportunities and would be glad to discuss how I can contribute to your team.

Please find my resume attached. I would be happy to discuss this opportunity further.

Best Regards,
Ziya Ul Rehman
+91-8383965569
LinkedIn: https://www.linkedin.com/in/ziya-ul-rehman`,

  React: `Dear HR Manager,

Hi, I’m Ziya Ul Rehman, a React Developer with hands-on experience in building responsive and scalable web applications. I have worked on projects across different domains such as EdTech, admin dashboards, AI chatbot platforms, trust management systems, and interactive learning applications.

I work with React.js, Next.js, JavaScript, Tailwind CSS, Redux Toolkit, REST APIs, and modern frontend libraries to build smooth, user-friendly, and high-performance applications. I am open to new opportunities and would be glad to discuss how I can contribute to your team.

Please find my resume attached. I would be happy to discuss this opportunity further.

Best Regards,
Ziya Ul Rehman
+91-8383965569
LinkedIn: https://www.linkedin.com/in/ziya-ul-rehman`,

  "Front End": `Dear HR Manager,

Hi, I’m Ziya Ul Rehman, a Front End Developer with hands-on experience in building responsive and scalable web applications. I have worked on projects across different domains such as EdTech, admin dashboards, AI chatbot platforms, trust management systems, and interactive learning applications.

I work with React.js, Next.js, JavaScript, Tailwind CSS, Redux Toolkit, REST APIs, and modern frontend libraries to build smooth, user-friendly, and high-performance applications. I am open to new opportunities and would be glad to discuss how I can contribute to your team.

Please find my resume attached. I would be happy to discuss this opportunity further.

Best Regards,
Ziya Ul Rehman
+91-8383965569
LinkedIn: https://www.linkedin.com/in/ziya-ul-rehman`,

  "Full Stack": `Dear HR Manager,

Hi, I’m Ziya Ul Rehman, a Full Stack Developer with hands-on experience in developing full-stack web and mobile applications. I have worked on projects including EdTech platforms, AI chatbot systems, admin panels, payment gateway integrations, and real-time applications.

I work with MongoDB, Express.js, React.js, Node.js, REST APIs, JWT authentication, Redux Toolkit, and cloud deployment platforms to build scalable and efficient applications. I also have experience integrating third-party services, handling backend APIs, and optimizing application performance.

I am open to new opportunities and would be glad to discuss how I can contribute to your team.

Please find my resume attached. I would be happy to discuss this opportunity further.

Best Regards,
Ziya Ul Rehman
+91-8383965569
LinkedIn: https://www.linkedin.com/in/ziya-ul-rehman`,

  "MERN Stack": `Dear HR Manager,

Hi, I’m Ziya Ul Rehman, a MERN Stack Developer with hands-on experience in developing full-stack web and mobile applications. I have worked on projects including EdTech platforms, AI chatbot systems, admin panels, payment gateway integrations, and real-time applications.

I work with MongoDB, Express.js, React.js, Node.js, REST APIs, JWT authentication, Redux Toolkit, and cloud deployment platforms to build scalable and efficient applications. I also have experience integrating third-party services, handling backend APIs, and optimizing application performance.

I am open to new opportunities and would be glad to discuss how I can contribute to your team.

Please find my resume attached. I would be happy to discuss this opportunity further.

Best Regards,
Ziya Ul Rehman
+91-8383965569
LinkedIn: https://www.linkedin.com/in/ziya-ul-rehman`,

"MextJS": `Hi, I’m Ziya Ul Rehman, a Next.js Developer with hands-on experience in building modern, scalable, and high-performance web applications. I have worked on projects including EdTech platforms, AI chatbot systems, admin panels, real-time applications, and full-stack web solutions.

I work with Next.js, React.js, JavaScript, Tailwind CSS, REST APIs, Redux Toolkit, and backend integrations to develop responsive and efficient applications with optimized performance and smooth user experience. I also have experience working with authentication systems, API integration, and deployment platforms.

I am open to new opportunities and would be glad to discuss how I can contribute to your team.

Please find my resume attached. I would be happy to discuss this opportunity further.

Best Regards,
Ziya Ul Rehman
+91-8383965569
LinkedIn: https://www.linkedin.com/in/ziya-ul-rehman`,
};

/** Normalizes spacing/case so JSON input matches templates reliably. */
export function normalizePositionKey(s: string): string {
  const t = s.trim().toLowerCase().replace(/\s+/g, " ");
  return t.replace(/\s*,\s*/g, ", ");
}

export function resolveEmailBody(position: string): string | null {
  const needle = normalizePositionKey(position);
  for (const [key, body] of Object.entries(EMAIL_BODIES_BY_POSITION)) {
    if (normalizePositionKey(key) === needle) return body;
  }
  return null;
}

export function knownPositions(): string[] {
  return Object.keys(EMAIL_BODIES_BY_POSITION);
}
