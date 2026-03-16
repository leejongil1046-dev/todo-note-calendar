export default {
  expo: {
    scheme: "todonotecalendar",
    extra: {
      holidayApiKey: process.env.HOLIDAY_API_KEY,
      eas: {
        projectId: "89e74393-e07c-40aa-9777-2a7128b9a31d",
      },
    },
    name: "todo-note-calendar",
    slug: "todo-note-calendar",
    android: {
      package: "com.leejongil.todonotecalendar",
    },
  },
};
